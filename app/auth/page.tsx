'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function AuthCallbackPage() {
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const handleCallback = async () => {
      // IMPORTANT : ceci lit le hash (#access_token)
      const { data, error } = await supabase.auth.getSession();

      // Parse URL params to respect `next` and `type` if provided
      let nextPath = '/compte';
      let typeParam = undefined;
      try {
        const url = new URL(window.location.href);
        const np = url.searchParams.get('next');
        const tp = url.searchParams.get('type');
        if (np) nextPath = np;
        if (tp) typeParam = tp;
      } catch (e) {
        // ignore
      }

      if (error || !data.session) {
        // No session -> show error page for recovery or go to login
        if (typeParam === 'recovery') {
          router.replace('/mot-de-passe-oublie');
        } else {
          router.replace('/connexion');
        }
        return;
      }

      // If recovery type, redirect to reset password page
      if (typeParam === 'recovery') {
        router.replace('/reinitialiser-mot-de-passe');
        return;
      }

      // Build redirect with success query param
      const successMap: Record<string, string> = {
        signup: 'signup_auto_login',
        magiclink: 'magic_link_login',
        email_change: 'email_changed'
      };

      const success = successMap[typeParam as string] || 'magic_link_login';
      const separator = nextPath.includes('?') ? '&' : '?';
      router.replace(`${nextPath}${separator}success=${success}`);
    };

    handleCallback();
  }, [router, supabase]);

  return (
    <p className="text-center mt-20">
      Vérification en cours...
    </p>
  );
}
