import { createAdminClient } from '@/lib/supabase/admin';
import { Resend } from 'resend';
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Email invalide' },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    // 1. Vérifier si l'utilisateur existe
    const { data: user } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email.toLowerCase().trim())
      .single();

    if (!user) {
      // Email n'existe pas - retourner un message neutre pour sécurité
      return NextResponse.json(
        { message: 'Si cet email existe, un lien de connexion a été envoyé.' },
        { status: 200 }
      );
    }

    // 2. Générer un token unique
    const token = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // 3. Stocker le token en base de données
    const { error: insertError } = await supabase
      .from('magic_links')
      .insert({
        email: email.toLowerCase().trim(),
        token_hash: tokenHash,
        expires_at: expiresAt.toISOString(),
        used: false,
      });

    if (insertError) {
      console.error('Erreur BD:', insertError);
      return NextResponse.json(
        { error: 'Fout bij aanmaken link' },
        { status: 500 }
      );
    }

    // 4. Envoyer l'email avec le lien magic
    const magicLink = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:5000'}/auth/magic?token=${token}`;

    const { error: emailError } = await resend.emails.send({
      from: 'Essence Féminine <connexion@beaut.fr>',
      to: email,
      subject: '✨ Uw Essence Féminine inloglink',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Inloggen Essence Féminine</title>
        </head>
        <body style="margin: 0; padding: 0; background-color: #FAF7F2; font-family: 'Times New Roman', serif;">
          <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #FAF7F2; padding: 40px 0;">
            <tr>
              <td align="center">
                <table role="presentation" width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
                  
                  <!-- Header avec Logo -->
                  <tr>
                    <td align="center" style="padding: 40px 0; background-color: #ffffff; border-bottom: 2px solid #F4E6E0;">
                      <h1 style="color: #5A4A3A; font-family: 'Playfair Display', 'Times New Roman', serif; font-size: 28px; margin: 0; letter-spacing: 1px;">
                        ESSENCE FÉMININE
                      </h1>
                      <p style="color: #D4AF37; font-size: 12px; text-transform: uppercase; letter-spacing: 3px; margin: 5px 0 0 0;">
                        PREMIUM SCHOONHEID
                      </p>
                    </td>
                  </tr>

                  <!-- Contenu Principal -->
                  <tr>
                    <td align="center" style="padding: 40px 40px;">
                      <h2 style="color: #5A4A3A; font-size: 22px; margin-bottom: 20px; font-weight: normal;">
                        Welkom thuis
                      </h2>
                      <p style="color: #8B7355; font-size: 16px; line-height: 1.6; margin-bottom: 30px; max-width: 400px;">
                        Hier is uw magische link om toegang te krijgen tot uw persoonlijke ruimte. Geen wachtwoord nodig.
                      </p>
                      
                      <!-- Bouton d'action -->
                      <a href="${magicLink}" style="display: inline-block; background-color: #D4AF37; color: #ffffff; padding: 15px 40px; text-decoration: none; border-radius: 50px; font-size: 14px; font-weight: bold; letter-spacing: 1px; transition: background-color 0.3s ease;">
                        NAAR MIJN ACCOUNT
                      </a>

                      <p style="color: #999; font-size: 14px; margin-top: 30px; font-style: italic;">
                        Deze link is 15 minuten geldig.
                      </p>
                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td align="center" style="background-color: #F5F1EB; padding: 30px; color: #8B7355; font-size: 12px;">
                      <p style="margin: 0 0 10px 0;">
                        Als u deze link niet heeft aangevraagd, kunt u deze e-mail veilig negeren.
                      </p>
                      <p style="margin: 0;">
                        &copy; ${new Date().getFullYear()} Essence Féminine. Alle rechten voorbehouden.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    });

    if (emailError) {
      console.error('Erreur Resend:', emailError);
      // Nettoyer le token créé si l'email échoue
      await supabase
        .from('magic_links')
        .delete()
        .eq('token_hash', tokenHash);

      return NextResponse.json(
        { error: 'Fout bij versturen link' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'Lien de connexion envoyé à votre email' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Erreur API:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue' },
      { status: 500 }
    );
  }
}
