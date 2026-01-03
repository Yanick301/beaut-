'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useToastStore } from '@/lib/toast-store';
import { createClient } from '@/lib/supabase/client';

function MagicLinkContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const { addToast } = useToastStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const verifyMagicLink = async () => {
      if (!token) {
        setError('Link ongeldig of ontbreekt');
        addToast('Link ongeldig', 'error');
        setLoading(false);
        return;
      }

      try {
        // Design du loader prolongé légèrement pour l'effet "premium"
        const verificationStart = Date.now();

        const response = await fetch('/api/auth/verify-magic-link', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Fout bij verificatie');
        }

        // --- PARTIE CRUCIALE : Session Supabase ---
        if (data.session) {
          const supabase = createClient();
          const { error: sessionError } = await supabase.auth.setSession(data.session);

          if (sessionError) {
            console.error('Erreur setSession:', sessionError);
            throw new Error('Beveiligen van sessie mislukt');
          }
        }
        // ------------------------------------------

        const verificationDuration = Date.now() - verificationStart;
        const minLoadingTime = 1500; // 1.5s minimum pour apprécier l'animation

        if (verificationDuration < minLoadingTime) {
          await new Promise(resolve => setTimeout(resolve, minLoadingTime - verificationDuration));
        }

        addToast('Inloggen geslaagd. Welkom.', 'success');

        // Refresh pour mettre à jour l'état Auth dans toute l'app
        router.refresh();
        router.push('/compte');

      } catch (err: any) {
        const errorMsg = err.message || 'Fout bij de verbinding';
        setError(errorMsg);
        addToast(errorMsg, 'error');
        setLoading(false);
      }
    };

    verifyMagicLink();
  }, [token, router, addToast]);

  if (loading && !error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF7F2]">
        <div className="text-center p-8 max-w-sm w-full">
          {/* Logo Animation */}
          <div className="relative w-24 h-24 mx-auto mb-8">
            <div className="absolute inset-0 border-4 border-[#F4E6E0] rounded-full animate-ping opacity-20"></div>
            <div className="absolute inset-0 border-4 border-[#D4AF37] rounded-full border-t-transparent animate-spin"></div>
            <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center shadow-sm">
              <span className="text-2xl">✨</span>
            </div>
          </div>

          <h2 className="font-elegant text-2xl text-[#5A4A3A] mb-2 tracking-wide">
            Verificatie
          </h2>
          <p className="text-[#8B7355] text-sm animate-pulse">
            Uw toegangsrechten worden gecontroleerd...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF7F2] p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center border-t-4 border-red-400">
          <div className="text-4xl mb-6">🥀</div>
          <h1 className="font-elegant text-2xl text-[#5A4A3A] mb-3">Link verlopen of ongeldig</h1>
          <p className="text-[#8B7355] mb-8 leading-relaxed">
            {error}. Om veiligheidsredenen zijn onze magische links voor eenmalig gebruik en beperkt in tijd.
          </p>
          <a
            href="/connexion"
            className="inline-block w-full bg-[#5A4A3A] text-white px-6 py-3 rounded-lg hover:bg-[#4A3A2A] transition-colors duration-300 font-medium tracking-wide uppercase text-xs"
          >
            Nieuwe link aanvragen
          </a>
        </div>
      </div>
    );
  }

  return null;
}

// Composant principal avec Suspense
export default function MagicLinkPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#FAF7F2]">
        <div className="text-[#D4AF37] animate-pulse font-elegant text-xl">
          Laden...
        </div>
      </div>
    }>
      <MagicLinkContent />
    </Suspense>
  );
}
