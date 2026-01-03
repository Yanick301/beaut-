import { createAdminClient } from '@/lib/supabase/admin';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { email, password, first_name, last_name, phone } = await req.json();

    if (!email || !password || !first_name || !last_name || !phone) {
      return NextResponse.json(
        { error: 'Tous les champs sont obligatoires' },
        { status: 400 }
      );
    }

    const adminClient = createAdminClient();

    // 1. Créer l'utilisateur dans Supabase Auth (Standard Sign Up avec Password)
    // Cela enverra automatiquement l'email de confirmation configuré dans Supabase
    // On ajoute le phone dans les metadata pour l'accès facile si besoin
    const { data: authUser, error: authError } = await adminClient.auth.signUp({
      email: email.trim().toLowerCase(),
      password,
      options: {
        data: {
          first_name,
          last_name,
          phone,
        },
        // Utiliser l'origine de la requête si NEXT_PUBLIC_SITE_URL n'est pas défini
        // Cela permet de supporter localhost:3000 et les déploiements automatiquement
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || req.headers.get('origin') || 'http://localhost:3000'}/auth/callback`,
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

    // 2. Créer ou mettre à jour le profil utilisateur
    // Note: Normalement géré par trigger, mais on le garde pour sécurité/complétude
    if (authUser.user) {
      const { error: profileError } = await adminClient
        .from('profiles')
        .upsert({
          id: authUser.user.id,
          email: email.trim().toLowerCase(),
          first_name,
          last_name,
          phone,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'id' });

      if (profileError) {
        console.error('Profile creation error:', profileError);
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
