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

      if (error || !data.session) {
        router.replace('/mot-de-passe-oublie');
        return;
      }

      // Si recovery → redirection vers reset password
      router.replace('/reinitialiser-mot-de-passe');
    };

    handleCallback();
  }, [router, supabase]);

  return (
    <p className="text-center mt-20">
      Vérification en cours...
    </p>
  );
}
