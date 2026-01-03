'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FiLock, FiEye, FiEyeOff, FiMail } from 'react-icons/fi';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { useToastStore } from '@/lib/toast-store';

export default function ResetPasswordClient() {
  const router = useRouter();
  const supabase = createClient();
  const addToast = useToastStore((state) => state.addToast);

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
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
    // Récupérer l'email depuis l'URL
    const searchParams = new URLSearchParams(window.location.search);
    const emailParam = searchParams.get('email');
    if (emailParam) {
      setEmail(emailParam);
    }

    // Controleer de huidige sessie
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
      console.log('Auth event:', event);
      if (event === 'PASSWORD_RECOVERY' || session) {
        setAuthorized(true);
        setLoadingAuth(false);
        setError(null);
      } else if (event === 'SIGNED_OUT') {
        // Ne pas rediriger immédiatement, l'utilisateur est peut-être en train d'utiliser un code
        setAuthorized(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router, supabase]);

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!email || !otp) {
      setError('Vul alle velden in.');
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.verifyOtp({
        email: email.trim(),
        token: otp.trim(),
        type: 'recovery',
      });

      if (error) throw error;

      setAuthorized(true);
      addToast('Code bevestigd! Stel nu uw nieuwe wachtwoord in.', 'success');
    } catch (err: any) {
      setError(err.message || 'Ongeldige of verlopen code.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Vérifier à nouveau la session avant de continuer
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      setError("U bent niet gemachtigd dit wachtwoord te wijzigen. Vraag een nieuwe resetlink aan.");
      setTimeout(() => {
        router.push('/mot-de-passe-oublie');
      }, 2000);
      return;
    }

    if (password !== confirmPassword) {
      setError('Wachtwoorden komen niet overeen.');
      return;
    }

    if (password.length < 6) {
      setError('Het wachtwoord moet minimaal 6 tekens bevatten.');
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password,
      });

      if (error) throw error;

      // Toon succesbericht
      addToast('Uw wachtwoord is succesvol gewijzigd!', 'success');

      // Déconnexion propre après modification
      await supabase.auth.signOut();

      // Petit délai pour que l'utilisateur voie le toast
      setTimeout(() => {
        router.push('/connexion');
        router.refresh();
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Er is een fout opgetreden.');
    } finally {
      setLoading(false);
    }
  };

  if (loadingAuth) {
    return (
      <div className="section-padding bg-beige-light min-h-screen flex items-center justify-center">
        <div className="container-custom max-w-md">
          <div className="bg-white-cream rounded-2xl p-8 shadow-md text-center">
            <div className="text-brown-soft">Sessie wordt gecontroleerd...</div>
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
            Wachtwoord opnieuw instellen
          </h1>
          <p className="text-brown-soft text-center mb-8">
            {authorized
              ? 'Voer uw nieuwe wachtwoord in'
              : 'Voer de verificatiecode in die u per e-mail heeft ontvangen'
            }
          </p>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm font-medium">
              {error}
            </div>
          )}

          {!authorized ? (
            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <div>
                <label className="block text-brown-dark font-medium mb-2">
                  E-mailadres
                </label>
                <div className="relative">
                  <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-brown-soft w-5 h-5" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-lg border-2 border-nude focus:border-rose-soft outline-none transition"
                    placeholder="uw@email.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-brown-dark font-medium mb-2">
                  Verificatiecode
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                  className="w-full px-4 py-4 text-center text-2xl tracking-[0.5em] font-bold rounded-lg border-2 border-nude focus:border-rose-soft outline-none transition"
                  placeholder="000000"
                  maxLength={6}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary disabled:opacity-50"
              >
                {loading ? 'Controleren...' : 'Code bevestigen'}
              </button>

              <div className="text-center mt-4">
                <Link href="/mot-de-passe-oublie" className="text-sm text-brown-soft hover:text-rose-soft transition">
                  Nieuwe code aanvragen
                </Link>
              </div>
            </form>
          ) : (
            <form onSubmit={handleReset} className="space-y-6">
              {/* Nouveau mot de passe */}
              <div>
                <label className="block text-brown-dark font-medium mb-2">
                  Nieuw wachtwoord
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
                  Bevestig wachtwoord
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
                {loading ? 'Bijwerken...' : 'Wachtwoord bijwerken'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
