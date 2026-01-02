import { createAdminClient } from '@/lib/supabase/admin';
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { cookies } from 'next/headers';

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

    // 7. Créer une session Supabase pour cet utilisateur
    // On doit créer un JWT valide pour établir la session
    const { data: { user: authUser }, error: authError } = await adminClient.auth.admin.getUserById(user.id);

    if (authError) {
      // Si l'utilisateur n'existe pas en auth, on peut le créer ou simplement créer la session
      console.log('User not in auth, creating session via magic link...');
    }

    // 8. Créer une session valide en utilisant le token de session Supabase
    // Le mieux est de créer une session JWT directement
    const sessionResponse = await adminClient.auth.admin.createUser({
      email: magicLink.email,
      email_confirm: true,
      user_metadata: {
        provider: 'magic_link',
        authenticated_at: new Date().toISOString()
      }
    }).catch(async (error) => {
      // L'utilisateur existe déjà, on peut ignorer cette erreur
      if (error.message.includes('already exists')) {
        return { data: { user: authUser }, error: null };
      }
      throw error;
    });

    const authenticatedUser = sessionResponse.data?.user;

    if (!authenticatedUser) {
      return NextResponse.json(
        { error: 'Erreur lors de la création de la session' },
        { status: 500 }
      );
    }

    // 9. Générer une session JWT valide
    const { data: { session }, error: sessionError } = await adminClient.auth.admin.createSession(authenticatedUser.id);

    if (sessionError || !session) {
      return NextResponse.json(
        { error: 'Erreur lors de la création de la session' },
        { status: 500 }
      );
    }

    // 10. Définir les cookies de session
    const response = NextResponse.json(
      {
        message: 'Authentification réussie',
        userId: user.id,
        email: magicLink.email
      },
      { status: 200 }
    );

    // Définir les cookies Supabase
    if (session.access_token) {
      const cookieStore = await cookies();
      cookieStore.set('sb-access-token', session.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 365 // 1 year
      });
      
      if (session.refresh_token) {
        cookieStore.set('sb-refresh-token', session.refresh_token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 60 * 60 * 24 * 365 // 1 year
        });
      }
    }

    return response;
  } catch (error) {
    console.error('Erreur vérification magic link:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la vérification' },
      { status: 500 }
    );
  }
}
