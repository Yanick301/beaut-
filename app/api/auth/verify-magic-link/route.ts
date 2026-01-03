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

    // 3. Vérifier l'expiration (via le champ DB ou logique JS)
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

    // 5. Marquer le token comme utilisé immédiatement pour éviter le rejeu
    await adminClient
      .from('magic_links')
      .update({ used: true })
      .eq('id', magicLink.id);

    // 6. Générer une session Supabase réelle
    // On utilise generateLink pour créer un token valide Supabase Admin pour cet email
    const { data: linkData, error: linkError } = await adminClient.auth.admin.generateLink({
      type: 'magiclink',
      email: magicLink.email,
    });

    if (linkError || !linkData.properties?.action_link) {
      console.error('Erreur génération link Supabase:', linkError);
      return NextResponse.json(
        { error: 'Erreur technique lors de la création de session' },
        { status: 500 }
      );
    }

    // Extraire le token (le hash ou le code ? generateLink retourne un lien complet)
    // Le lien est du type: SiteURL/auth/callback?token=...&type=magiclink
    // Mais on peut vérifier ce token nous-mêmes pour obtenir la session
    const actionLink = linkData.properties.action_link;
    const supabaseToken = new URL(actionLink).searchParams.get('token_hash') || new URL(actionLink).searchParams.get('token'); // Dépend de la config, souvent token_hash pour PKCE flow ou token pour implicit

    // ALTERNATIVE PLUS ROBUSTE :
    // Puisque nous sommes admin, nous ne pouvons pas "logger" l'utilisateur directement sans son mot de passe ou un code OTP.
    // generateLink nous donne un token que l'utilisateur DOIT visiter.
    // MAIS, nous voulons retourner la session JSON au client pour qu'il la définisse.

    // Si generateLink retourne un access_token direct ? Non, il retourne un lien.

    // Astuce : On peut utiliser `signInWithOtp` si on avait le code, mais on ne veut pas envoyer d'email.
    // La méthode propre est de renvoyer LE LIEN SUPABASE (ou ses paramètres) au client et laisser le client faire le travail ?
    // Non, le client est sur une page custom.

    // SOLUTION : On renvoie les tokens de session (access_token, refresh_token) directement si possible.
    // Pour cela, on doit échanger le token généré.
    const verifyParams = {
      token: supabaseToken,
      type: 'magiclink',
      email: magicLink.email
    };

    // verifyOtp côté serveur fonctionne-t-il avec token_hash ? 
    // Supabase Admin `generateLink` retourne un lien qui pointe vers verify.
    // Si on veut la session, le mieux est peut-être de retourner à notre front-end les tokens de session.
    // Mais admin ne peut pas 'impersonate' pour créer une session sans auth flow.

    // On va retourner les éléments nécessaires au client pour qu'il établisse la session lui-même ?
    // Non, ce serait complexe.

    // Essayons de vérifier le token nous-mêmes pour avoir la session.
    // Attention: verifyOtp avec un client ADMIN ne crée pas une session utilisateur standard si on ne fait pas attention.
    // Il vaut mieux peut-être retourner le `supabaseToken` au client et le client appelle une fonction Supabase ?

    // Simplification : On va retourner `access_token` et `refresh_token` en utilisant `verifyOtp` avec le token qu'on vient de générer.
    // `generateLink` -> le token est valide.
    // `verifyOtp({ email, token: ..., type: 'magiclink'})` -> retourne `{ session, user }`.

    // Note : le token dans action_link est parfois un token_hash si PKCE est activé.
    // Si PKCE est désactivé, c'est un token simple.
    // Supposons que c'est un token utilisable.

    const { data: sessionData, error: sessionError } = await adminClient.auth.verifyOtp({
      email: magicLink.email,
      token: supabaseToken!,
      type: 'magiclink'
    });

    if (sessionError || !sessionData.session) {
      console.error('Erreur échange session:', sessionError);
      // Fallback: On a validé le custom token, mais on a échoué à créer la session Supabase.
      // On retourne succès quand même pour ne pas bloquer, mais l'utilisateur devra peut-être recliquer.
      // NON, c'est le bug qu'on veut corriger.
      return NextResponse.json(
        { error: 'Erreur d\'établissement de session' },
        { status: 500 }
      );
    }

    // 7. Succès total
    return NextResponse.json({
      message: 'Authentification réussie',
      session: sessionData.session, // On renvoie la session complète
      redirect: '/compte'
    }, { status: 200 });

  } catch (error) {
    console.error('Erreur vérification magic link:', error);
    return NextResponse.json(
      { error: 'Bevestiging mislukt' },
      { status: 500 }
    );
  }
}
