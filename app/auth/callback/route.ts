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
        return NextResponse.redirect(new URL('/reinitialiser-mot-de-passe?success=recovery_auto_login', requestUrl.origin));
      }
      return NextResponse.redirect(new URL(`${next}${next.includes('?') ? '&' : '?'}success=signup_auto_login`, requestUrl.origin));
    }
  }

  // Fallback if no code or error
  return NextResponse.redirect(new URL('/connexion?error=auth_callback_failed', requestUrl.origin));
}
