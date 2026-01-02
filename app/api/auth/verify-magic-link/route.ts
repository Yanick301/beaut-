import { createAdminClient } from '@/lib/supabase/admin';
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json();

    if (!token) {
      return NextResponse.json(
        { error: 'Token manquant' },
        { status: 400 }
      );
    }

    const adminClient = createAdminClient();

    // 1. Hacher le token reçu pour le comparer
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

    // 2. Vérifier si le token existe et est valide
    const { data: magicLink, error: queryError } = await adminClient
      .from('magic_links')
      .select('*')
      .eq('token_hash', tokenHash)
      .single();

    if (queryError || !magicLink) {
      return NextResponse.json(
        { error: 'Lien invalide ou expiré' },
        { status: 401 }
      );
    }

    // 3. Vérifier l'expiration
    if (new Date(magicLink.expires_at) < new Date()) {
      return NextResponse.json(
        { error: 'Lien expiré' },
        { status: 401 }
      );
    }

    // 4. Vérifier si le lien a déjà été utilisé
    if (magicLink.used) {
      return NextResponse.json(
        { error: 'Lien déjà utilisé' },
        { status: 401 }
      );
    }

    // 5. Récupérer l'utilisateur
    const { data: user, error: userError } = await adminClient
      .from('profiles')
      .select('id, email')
      .eq('email', magicLink.email)
      .single();

    if (userError || !user) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    // 6. Marquer le token comme utilisé
    await adminClient
      .from('magic_links')
      .update({ used: true })
      .eq('id', magicLink.id);

    // 7. Récupérer ou créer l'utilisateur dans Supabase Auth
    let authUserId = magicLink.user_id;

    if (!authUserId) {
      try {
        // Essayer de récupérer l'utilisateur par email
        const { data: { user: existingUser } } = await adminClient.auth.admin.getUserById(magicLink.user_id || '');
        authUserId = existingUser?.id;
      } catch (e) {
        // L'utilisateur n'existe pas, on le crée
      }

      if (!authUserId) {
        const { data: newUserData, error: createError } = await adminClient.auth.admin.createUser({
          email: magicLink.email,
          email_confirm: true,
          user_metadata: {
            provider: 'magic_link',
            authenticated_at: new Date().toISOString()
          }
        });

        if (createError) {
          // Si user existe déjà, essayer de le trouver
          if (createError.message.includes('already exists')) {
            // Faire une requête pour obtenir l'ID de cet utilisateur
            const { data: { users } } = await adminClient.auth.admin.listUsers();
            const foundUser = users?.find(u => u.email === magicLink.email);
            authUserId = foundUser?.id;
          }

          if (!authUserId) {
            console.error('Auth creation error:', createError);
            return NextResponse.json(
              { error: 'Erreur lors de la création du compte' },
              { status: 500 }
            );
          }
        } else {
          authUserId = newUserData.user?.id;
        }
      }
    }

    // 8. Retourner les informations pour la redirection côté client
    const response = NextResponse.json(
      {
        message: 'Authentification réussie',
        userId: authUserId,
        email: magicLink.email,
        redirect: '/compte'
      },
      { status: 200 }
    );

    return response;
  } catch (error) {
    console.error('Erreur vérification magic link:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la vérification' },
      { status: 500 }
    );
  }
}
