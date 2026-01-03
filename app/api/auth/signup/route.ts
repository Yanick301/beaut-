import { createAdminClient } from '@/lib/supabase/admin';
import { NextRequest, NextResponse } from 'next/server';

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

      // 3. Déclencher l'envoi du Magic Link via Supabase (Native)
      // Cela utilisera le template "Magic Link" configuré dans le dashboard Supabase
      const { error: otpError } = await adminClient.auth.signInWithOtp({
        email: email.trim().toLowerCase(),
        options: {
          emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:5000'}/auth/callback`,
        },
      });

      if (otpError) {
        console.error('Erreur envoi Magic Link Supabase:', otpError);
      }
    }

    return NextResponse.json(
      {
        message: 'Compte créé avec succès. Vérifiez vos emails.',
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
