'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { createClient } from '@/lib/supabase/client';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  useEffect(() => {
    // Vérifier que l'utilisateur a bien un token de réinitialisation
    // Après le callback, l'utilisateur devrait avoir une session
    async function checkSession() {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Session error:', error);
        setError('Erreur de session. Veuillez redemander un lien de réinitialisation.');
        setTimeout(() => {
          router.push('/mot-de-passe-oublie');
        }, 3000);
        return;
      }

      if (!session) {
        // Pas de session, rediriger vers la page de demande de réinitialisation
        setError('Session expirée. Veuillez redemander un lien de réinitialisation.');
        setTimeout(() => {
          router.push('/mot-de-passe-oublie');
        }, 3000);
      }
    }

    checkSession();
  }, [router, supabase]);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) throw error;

      router.push('/compte');
      router.refresh();
    } catch (error: any) {
      setError(error.message || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

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
            <div>
              <label htmlFor="password" className="block text-brown-dark font-medium mb-2">
                Nouveau mot de passe
              </label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-brown-soft w-5 h-5" />
                <input
                  id="password"
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
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-brown-soft hover:text-brown-dark transition"
                >
                  {showPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-brown-dark font-medium mb-2">
                Confirmer le mot de passe
              </label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-brown-soft w-5 h-5" />
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-12 py-3 rounded-lg border-2 border-nude focus:border-rose-soft outline-none transition"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-brown-soft hover:text-brown-dark transition"
                >
                  {showConfirmPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Mise à jour...' : 'Réinitialiser le mot de passe'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}






