'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { createClient } from '@/lib/supabase/client';
import { useToastStore } from '@/lib/toast-store';

export default function ResetPasswordClient() {
  const router = useRouter();
  const supabase = createClient();
  const addToast = useToastStore((state) => state.addToast);

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [authorized, setAuthorized] = useState(false);
  const [loadingAuth, setLoadingAuth] = useState(true);

  /**
   * Vérifier la session au chargement et écouter les changements d'état
   */
  useEffect(() => {
    // Vérifier la session actuelle
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setAuthorized(true);
      }
      setLoadingAuth(false);
    };

    checkSession();

    // Écouter les changements d'état d'authentification
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'PASSWORD_RECOVERY' || session) {
        setAuthorized(true);
        setLoadingAuth(false);
        setError(null);
      } else if (event === 'SIGNED_OUT' || (!session && event !== 'INITIAL_SESSION')) {
        setError(
          'Session expirée. Veuillez redemander un lien de réinitialisation.'
        );
        setLoadingAuth(false);
        setTimeout(() => {
          router.push('/mot-de-passe-oublie');
        }, 3000);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router, supabase]);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Vérifier à nouveau la session avant de continuer
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      setError("Vous n'êtes pas autorisé à modifier ce mot de passe. Veuillez redemander un lien de réinitialisation.");
      setTimeout(() => {
        router.push('/mot-de-passe-oublie');
      }, 2000);
      return;
    }

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }

    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères.');
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password,
      });

      if (error) throw error;

      // Afficher le toast de succès
      addToast('Votre mot de passe a été modifié avec succès !', 'success');

      // Déconnexion propre après modification
      await supabase.auth.signOut();

      // Petit délai pour que l'utilisateur voie le toast
      setTimeout(() => {
        router.push('/connexion');
        router.refresh();
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue.');
    } finally {
      setLoading(false);
    }
  };

  if (loadingAuth) {
    return (
      <div className="section-padding bg-beige-light min-h-screen flex items-center justify-center">
        <div className="container-custom max-w-md">
          <div className="bg-white-cream rounded-2xl p-8 shadow-md text-center">
            <div className="text-brown-soft">Vérification de la session...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="section-padding bg-beige-light min-h-screen flex items-center justify-center">
      <div className="container-custom max-w-md">
        <div className="bg-white-cream rounded-2xl p-8 shadow-md">
          <h1 className="font-elegant text-3xl sm:text-4xl text-brown-dark mb-2 text-center">
            Réinitialiser le mot de passe
          </h1>
          <p className="text-brown-soft text-center mb-8">
            Entrez votre nouveau mot de passe
          </p>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleReset} className="space-y-6">
            {/* Nouveau mot de passe */}
            <div>
              <label className="block text-brown-dark font-medium mb-2">
                Nouveau mot de passe
              </label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-brown-soft w-5 h-5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full pl-10 pr-12 py-3 rounded-lg border-2 border-nude focus:border-rose-soft outline-none transition"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-brown-soft"
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            {/* Confirmation */}
            <div>
              <label className="block text-brown-dark font-medium mb-2">
                Confirmer le mot de passe
              </label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-brown-soft w-5 h-5" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-12 py-3 rounded-lg border-2 border-nude focus:border-rose-soft outline-none transition"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-brown-soft"
                >
                  {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary disabled:opacity-50"
            >
              {loading ? 'Mise à jour...' : 'Réinitialiser'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
