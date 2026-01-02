'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useToastStore } from '@/lib/toast-store';

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
        setError('Lien invalide');
        addToast('Lien invalide', 'error');
        setLoading(false);
        return;
      }

      try {
        addToast('Vérification de votre lien...', 'info');

        const response = await fetch('/api/auth/verify-magic-link', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Erreur lors de la vérification');
        }

        // Succès - créer la session Supabase
        addToast('Connexion réussie ! Redirection...', 'success');
        
        // Refresh la page pour mettre à jour la session Supabase
        setTimeout(() => {
          router.refresh();
          router.push('/compte');
        }, 1000);
      } catch (err: any) {
        const errorMsg = err.message || 'Erreur lors de la connexion';
        setError(errorMsg);
        addToast(errorMsg, 'error');
        setLoading(false);
      }
    };

    verifyMagicLink();
  }, [token, router, addToast]);

  if (loading && !error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-purple-100">
        <div className="text-center">
          <div className="inline-block animate-spin">
            <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full"></div>
          </div>
          <p className="mt-4 text-purple-700 font-semibold">Vérification de votre lien...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-purple-100">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Erreur de connexion</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <a
            href="/connexion"
            className="inline-block bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition"
          >
            Retour à la connexion
          </a>
        </div>
      </div>
    );
  }

  return null;
}

export default function MagicLinkPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-purple-100">
        <div className="text-center">
          <div className="inline-block animate-spin">
            <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full"></div>
          </div>
          <p className="mt-4 text-purple-700 font-semibold">Chargement...</p>
        </div>
      </div>
    }>
      <MagicLinkContent />
    </Suspense>
  );
}
