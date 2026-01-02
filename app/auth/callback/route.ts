import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const next = requestUrl.searchParams.get('next') || '/compte';
  const type = requestUrl.searchParams.get('type');

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error) {
      if (type === 'recovery') {
        return NextResponse.redirect(new URL('/reinitialiser-mot-de-passe', requestUrl.origin));
      } else if (type === 'signup') {
        // Confirmation d'email après inscription
        return NextResponse.redirect(new URL(`${next}${next.includes('?') ? '&' : '?'}success=signup_auto_login`, requestUrl.origin));
      } else if (type === 'magiclink') {
        // Connexion via magic link
        return NextResponse.redirect(new URL(`${next}${next.includes('?') ? '&' : '?'}success=magic_link_login`, requestUrl.origin));
      } else if (type === 'email_change') {
        // Changement d'email
        return NextResponse.redirect(new URL(`${next}${next.includes('?') ? '&' : '?'}success=email_changed`, requestUrl.origin));
      } else {
        // Par défaut (magic link ou autre)
        return NextResponse.redirect(new URL(`${next}${next.includes('?') ? '&' : '?'}success=magic_link_login`, requestUrl.origin));
      }
    } else {
      console.error('Error exchanging code for session:', error);
      // En cas d'erreur, rediriger vers la page appropriée avec un message d'erreur
      if (type === 'recovery') {
        return NextResponse.redirect(new URL('/mot-de-passe-oublie?error=invalid_or_expired_link', requestUrl.origin));
      }
      return NextResponse.redirect(new URL('/connexion?error=auth_callback_failed', requestUrl.origin));
    }
  }

  // Fallback if no code
  return NextResponse.redirect(new URL('/connexion?error=no_code_provided', requestUrl.origin));
}
