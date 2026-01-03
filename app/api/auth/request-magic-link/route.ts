import { createAdminClient } from '@/lib/supabase/admin';
import { NextRequest, NextResponse } from 'next/server';

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

    // 1. Vérifier si l'utilisateur existe (via profil)
    // IMPORTANT : On vérifie le profil pour éviter de créer des utilisateurs sans profil
    // si le setting "Disable Signup" n'est pas actif côté Supabase.
    const { data: user } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email.toLowerCase().trim())
      .single();

    if (!user) {
      // Email n'existe pas - retourner un message neutre pour sécurité
      // On simule un succès pour ne pas leaker l'existence de l'email
      return NextResponse.json(
        { message: 'Si cet email existe, un lien de connexion a été envoyé.' },
        { status: 200 }
      );
    }

    // 2. Déclencher l'email via Supabase Native
    const { error: otpError } = await supabase.auth.signInWithOtp({
      email: email.toLowerCase().trim(),
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || req.headers.get('origin') || 'http://localhost:3000'}/auth/callback`,
      },
    });

    if (otpError) {
      console.error('Erreur Supabase Auth:', otpError);
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
