import { createAdminClient } from '@/lib/supabase/admin';
import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import crypto from 'crypto';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const { email, first_name, last_name } = await req.json();

    if (!email || !first_name || !last_name) {
      return NextResponse.json(
        { error: 'Tous les champs sont obligatoires' },
        { status: 400 }
      );
    }

    const adminClient = createAdminClient();

    // 1. Créer l'utilisateur dans Supabase Auth
    const { data: authUser, error: authError } = await adminClient.auth.admin.createUser({
      email: email.trim().toLowerCase(),
      email_confirm: true,
      user_metadata: {
        first_name,
        last_name,
      }
    });

    if (authError) {
      if (authError.message.includes('already exists')) {
        return NextResponse.json(
          { error: 'Cet email est déjà utilisé' },
          { status: 409 }
        );
      }
      throw authError;
    }

    // 2. Créer le profil utilisateur
    if (authUser.user) {
      const { error: profileError } = await adminClient
        .from('profiles')
        .insert({
          id: authUser.user.id,
          email: email.trim().toLowerCase(),
          first_name,
          last_name,
          updated_at: new Date().toISOString(),
        });

      if (profileError && !profileError.message.includes('duplicate')) {
        console.error('Profile creation error:', profileError);
      }

      // 3. Générer Magic Link pour connexion immédiate
      const token = crypto.randomBytes(32).toString('hex');
      const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h

      const { error: insertError } = await adminClient
        .from('magic_links')
        .insert({
          email: email.trim().toLowerCase(),
          token_hash: tokenHash,
          expires_at: expiresAt.toISOString(),
          used: false,
        });

      if (!insertError) {
        const magicLink = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:5000'}/auth/magic?token=${token}`;

        try {
          await resend.emails.send({
            from: 'Essence Féminine <contact@heressence.nl>',
            to: email,
            subject: '✨ Welkom bij Essence Féminine',
            html: `
              <!DOCTYPE html>
              <html>
              <body style="margin: 0; padding: 0; background-color: #FAF7F2; font-family: 'Times New Roman', serif;">
                <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #FAF7F2; padding: 40px 0;">
                  <tr>
                    <td align="center">
                      <table role="presentation" width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
                        <tr>
                          <td align="center" style="padding: 40px 0; background-color: #ffffff; border-bottom: 2px solid #F4E6E0;">
                            <h1 style="color: #5A4A3A; font-family: 'Playfair Display', serif; font-size: 28px; margin: 0; letter-spacing: 1px;">
                              ESSENCE FÉMININE
                            </h1>
                          </td>
                        </tr>
                        <tr>
                          <td align="center" style="padding: 40px 40px;">
                            <h2 style="color: #5A4A3A; font-size: 24px; margin-bottom: 20px;">
                              Welkom, ${first_name} !
                            </h2>
                            <p style="color: #8B7355; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
                              Uw account is succesvol aangemaakt.
                            </p>
                            <a href="${magicLink}" style="display: inline-block; background-color: #D4AF37; color: #ffffff; padding: 15px 40px; text-decoration: none; border-radius: 50px; font-size: 14px; font-weight: bold; letter-spacing: 1px;">
                              DIRECT INLOGGEN
                            </a>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </body>
              </html>
            `
          });
        } catch (mailError) {
          console.error("Erreur Envoi Email Bienvenue:", mailError);
        }
      }
    }

    return NextResponse.json(
      {
        message: 'Compte créé avec succès',
        userId: authUser.user?.id,
        email: authUser.user?.email
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: error.message || 'Erreur lors de la création du compte' },
      { status: 500 }
    );
  }
}
