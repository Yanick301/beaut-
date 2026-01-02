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
        { error: 'Erreur lors de la création du lien' },
        { status: 500 }
      );
    }

    // 4. Envoyer l'email avec le lien magic
    const magicLink = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:5000'}/auth/magic?token=${token}`;

    const { error: emailError } = await resend.emails.send({
      from: 'noreply@beaut.fr',
      to: email,
      subject: 'Votre lien de connexion',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #333;">Connectez-vous à votre compte</h2>
          <p style="color: #666; font-size: 16px;">Cliquez sur le lien ci-dessous pour vous connecter automatiquement. Ce lien expire dans 15 minutes.</p>
          <a href="${magicLink}" style="display: inline-block; background-color: #8b5cf6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; font-weight: bold;">
            Me connecter
          </a>
          <p style="color: #999; font-size: 14px; margin-top: 20px;">
            Si vous n'avez pas demandé ce lien, ignorez cet email.
          </p>
          <p style="color: #999; font-size: 12px;">
            Lien direct : <a href="${magicLink}" style="color: #8b5cf6;">${magicLink}</a>
          </p>
        </div>
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
        { error: 'Erreur lors de l\'envoi du lien' },
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
