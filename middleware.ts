import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );

          supabaseResponse = NextResponse.next({ request });

          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // ⚠️ IMPORTANT : ne rien mettre entre createServerClient et getUser
  const {
    data: { user },
  } = await supabase.auth.getUser();

  /* ------------------------------------------------------------------
   * ROUTES À NE JAMAIS BLOQUER (OBLIGATOIRE POUR SUPABASE)
   * ------------------------------------------------------------------ */
  const publicAuthRoutes = [
    '/auth/callback',
    '/auth/magic',
    '/reinitialiser-mot-de-passe',
    '/mot-de-passe-oublie',
  ];

  if (
    request.nextUrl.pathname.startsWith('/api/') ||
    publicAuthRoutes.some((path) =>
      request.nextUrl.pathname.startsWith(path)
    )
  ) {
    return supabaseResponse;
  }

  /* ------------------------------------------------------------------
   * ROUTES PROTÉGÉES
   * ------------------------------------------------------------------ */

  // Compte
  if (request.nextUrl.pathname.startsWith('/compte') && !user) {
    const url = request.nextUrl.clone();
    url.pathname = '/connexion';
    url.searchParams.set('redirect', request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  // Checkout
  if (request.nextUrl.pathname.startsWith('/checkout') && !user) {
    const url = request.nextUrl.clone();
    url.pathname = '/connexion';
    url.searchParams.set('redirect', request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  // Email non confirmé
  if (
    user &&
    !user.email_confirmed_at &&
    (request.nextUrl.pathname.startsWith('/compte') ||
      request.nextUrl.pathname.startsWith('/checkout'))
  ) {
    const url = request.nextUrl.clone();
    url.pathname = '/connexion';
    url.searchParams.set('error', 'email_not_confirmed');
    url.searchParams.set('redirect', request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  // Admin
  if (request.nextUrl.pathname.startsWith('/admin') && !user) {
    const url = request.nextUrl.clone();
    url.pathname = '/connexion';
    url.searchParams.set('redirect', request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  // Déjà connecté → pas accès à login / register
  if (
    (request.nextUrl.pathname.startsWith('/connexion') ||
      request.nextUrl.pathname.startsWith('/inscription')) &&
    user
  ) {
    const url = request.nextUrl.clone();
    url.pathname = '/compte';
    return NextResponse.redirect(url);
  }

  // ⚠️ TOUJOURS retourner supabaseResponse
  return supabaseResponse;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
