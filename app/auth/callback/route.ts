import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const token_hash = requestUrl.searchParams.get('token_hash');
  const type = requestUrl.searchParams.get('type');
  const next = requestUrl.searchParams.get('next') || '/compte';
  const code = requestUrl.searchParams.get('code');

  const supabase = await createClient();

  // Si on a un code (format moderne de Supabase pour les confirmations email)
  if (code) {
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error && data.user) {
      // Vérifier le type de callback à partir des paramètres
      const type = requestUrl.searchParams.get('type');
      
      if (type === 'recovery') {
        // C'est une récupération de mot de passe, rediriger vers la page de réinitialisation
        const redirectUrl = new URL('/reinitialiser-mot-de-passe', requestUrl.origin);
        return NextResponse.redirect(redirectUrl);
      } else if (type === 'signup' || type === 'email_change') {
        // C'est une confirmation d'email, rediriger vers la page de confirmation
        return NextResponse.redirect(new URL('/email-confirme', requestUrl.origin));
      } else {
        // Sinon, rediriger vers la page demandée
        const redirectUrl = new URL(next, requestUrl.origin);
        return NextResponse.redirect(redirectUrl);
      }
    } else {
      console.error('Error exchanging code for session:', error);
      return NextResponse.redirect(new URL(`/connexion?error=${encodeURIComponent(error?.message || 'Erreur de confirmation')}`, requestUrl.origin));
    }
  }

  // Si on a un token_hash (ancien format, pour compatibilité)
  if (token_hash && type) {
    const { data, error } = await supabase.auth.verifyOtp({
      type: type as any,
      token_hash,
    });

    if (!error && data.user) {
      // Vérifier le type de callback
      if (type === 'recovery') {
        // C'est une récupération de mot de passe, rediriger vers la page de réinitialisation
        const redirectUrl = new URL('/reinitialiser-mot-de-passe', requestUrl.origin);
        return NextResponse.redirect(redirectUrl);
      } else if (type === 'signup' || type === 'email_change') {
        // C'est une confirmation d'email, rediriger vers la page de confirmation
        return NextResponse.redirect(new URL('/email-confirme', requestUrl.origin));
      } else {
        // Sinon, rediriger vers la page demandée
        const redirectUrl = new URL(next, requestUrl.origin);
        return NextResponse.redirect(redirectUrl);
      }
    } else {
      console.error('Error verifying OTP:', error);
      return NextResponse.redirect(new URL(`/connexion?error=${encodeURIComponent(error?.message || 'Erreur de confirmation')}`, requestUrl.origin));
    }
  }

  // Redirection vers la page de connexion en cas d'erreur ou paramètres manquants
  return NextResponse.redirect(new URL('/connexion?error=auth_failed', requestUrl.origin));
}
