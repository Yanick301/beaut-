import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { type NextRequest } from 'next/server';

/**
 * Auth callback handler for Supabase OAuth/Magic link flows.
 * Exchanges code for session and redirects with success/error params.
 *
 * Query params:
 * - code: OAuth/magic link code (required)
 * - next: redirect path (default: /compte)
 * - type: auth type (signup, magiclink, recovery, email_change)
 */
export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const next = requestUrl.searchParams.get('next') || '/compte';
  const type = requestUrl.searchParams.get('type') || 'magiclink';

  // No code provided
  if (!code) {
    console.warn('[Auth Callback] No code provided');
    return NextResponse.redirect(
      new URL('/connexion?error=no_code_provided', requestUrl.origin)
    );
  }

  try {
    const supabase = await createClient();
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

    // Exchange failed
    if (exchangeError) {
      console.error('[Auth Callback] Session exchange failed:', exchangeError);

      // Recovery type: go to forgot password page
      if (type === 'recovery') {
        return NextResponse.redirect(
          new URL('/mot-de-passe-oublie?error=invalid_or_expired_link', requestUrl.origin)
        );
      }

      // Default: go to login with error
      return NextResponse.redirect(
        new URL('/connexion?error=auth_callback_failed', requestUrl.origin)
      );
    }

    // Success: build redirect URL with success param
    const successParamMap: Record<string, string> = {
      signup: 'signup_auto_login',
      magiclink: 'magic_link_login',
      email_change: 'email_changed',
    };

    const successParam = successParamMap[type] || 'magic_link_login';
    const redirectPath = type === 'recovery' ? '/reinitialiser-mot-de-passe' : next;
    const separator = redirectPath.includes('?') ? '&' : '?';
    const finalUrl = new URL(
      `${redirectPath}${separator}success=${successParam}`,
      requestUrl.origin
    );

    console.log(`[Auth Callback] Success (type=${type}) → ${finalUrl.pathname}${finalUrl.search}`);

    return NextResponse.redirect(finalUrl);
  } catch (err) {
    console.error('[Auth Callback] Unexpected error:', err);
    return NextResponse.redirect(
      new URL('/connexion?error=auth_callback_failed', requestUrl.origin)
    );
  }
}
