'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { createClient } from '@/lib/supabase/client';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/compte';
  const errorParam = searchParams.get('error');
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [resendingEmail, setResendingEmail] = useState(false);
  const [emailNotConfirmed, setEmailNotConfirmed] = useState(false);

  // Controleer de foutparameter in de URL
  useEffect(() => {
    if (errorParam === 'email_not_confirmed') {
      setEmailNotConfirmed(true);
      setError('Votre email n\'a pas encore été confirmé. Veuillez vérifier votre boîte de réception et cliquer sur le lien de confirmation.');
    }
  }, [errorParam]);

  const handleResendConfirmation = async () => {
    if (!email) {
      setError('Veuillez entrer votre email');
      return;
    }

    setResendingEmail(true);
    setError(null);
    setMessage(null);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email.trim(),
        options: {
          emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || window.location.origin}/auth/callback?next=/compte&type=signup`,
        },
      });

      if (error) {
        throw error;
      }

      setMessage('Een nieuwe bevestigingsmail is verzonden! Controleer uw inbox.');
      setEmailNotConfirmed(false);
    } catch (error: any) {
      setError(error.message || 'Fout bij het verzenden van de bevestigingsmail');
    } finally {
      setResendingEmail(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        console.error('Login error:', error);
        throw error;
      }

      if (data.user) {
        // Vérifier si l'email est confirmé
        if (!data.user.email_confirmed_at) {
          setEmailNotConfirmed(true);
          setError('Uw e-mailadres is nog niet bevestigd. Controleer uw inbox en klik op de bevestigingslink.');
          setLoading(false);
          return;
        }

        setMessage('Succesvol ingelogd! Omleiding...');
        // Petit délai pour s'assurer que la session est bien établie
        setTimeout(() => {
          router.push(redirect);
          router.refresh();
        }, 500);
      }
    } catch (error: any) {
      console.error('Login error details:', error);
      let errorMessage = 'Er is een fout opgetreden tijdens het inloggen';
      
      if (error.message) {
        if (error.message.includes('Invalid login credentials')) {
          errorMessage = 'E-mail of wachtwoord onjuist';
        } else if (error.message.includes('Email not confirmed')) {
          errorMessage = 'Bevestig uw e-mailadres voordat u inlogt';
        } else {
          errorMessage = error.message;
        }
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    if (!email) {
      setError('Veuillez entrer votre email');
      setLoading(false);
      return;
    }

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || window.location.origin}/auth/callback?next=/compte`,
        },
      });

      if (error) {
        console.error('Magic link error:', error);
        throw error;
      }

      setMessage('Een inloglink is verzonden naar uw e-mailadres!');
    } catch (error: any) {
      console.error('Magic link error details:', error);
      setError(error.message || 'Er is een fout opgetreden bij het verzenden van de link');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section-padding bg-beige-light min-h-screen flex items-center justify-center">
      <div className="container-custom max-w-md">
        <div className="bg-white-cream rounded-2xl p-8 shadow-md">
          <h1 className="font-elegant text-3xl sm:text-4xl text-brown-dark mb-2 text-center">
            Inloggen
          </h1>
          <p className="text-brown-soft text-center mb-8">
            Log in op uw Her Essence account
          </p>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
              {emailNotConfirmed && email && (
                <div className="mt-3 pt-3 border-t border-red-200">
                  <button
                    onClick={handleResendConfirmation}
                    disabled={resendingEmail}
                    className="text-sm text-red-700 hover:text-red-800 underline disabled:opacity-50"
                  >
                    {resendingEmail ? 'Verzenden bezig...' : 'Bevestigingsmail opnieuw verzenden'}
                  </button>
                </div>
              )}
            </div>
          )}

          {message && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
              {message}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-brown-dark font-medium mb-2">
                E-mail
              </label>
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-brown-soft w-5 h-5" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-lg border-2 border-nude focus:border-rose-soft outline-none transition"
                  placeholder="votre@email.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-brown-dark font-medium mb-2">
                Wachtwoord
              </label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-brown-soft w-5 h-5" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
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

            <div className="flex items-center justify-between text-sm">
              <Link href="/mot-de-passe-oublie" className="text-rose-soft hover:text-rose-soft/80 transition">
                Wachtwoord vergeten ?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Inloggen...' : 'Inloggen'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-nude">
            <button
              onClick={handleMagicLink}
              disabled={loading}
              className="w-full btn-outline disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Verzenden...' : 'Ontvang een inloglink via e-mail'}
            </button>
          </div>

          <div className="mt-6 text-center text-sm text-brown-soft">
            Heeft u nog geen account ?{' '}
            <Link href="/inscription" className="text-rose-soft hover:text-rose-soft/80 font-medium transition">
              Maak een account aan
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="section-padding bg-beige-light min-h-screen flex items-center justify-center">
        <div className="text-brown-soft">Chargement...</div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}



