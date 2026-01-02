'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { FiMail } from 'react-icons/fi';
import { createClient } from '@/lib/supabase/client';

function ForgotPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const supabase = createClient();

  // Vérifier les erreurs dans l'URL
  useEffect(() => {
    const errorParam = searchParams.get('error');
    if (errorParam === 'invalid_or_expired_link') {
      setError('Le lien de réinitialisation est invalide ou a expiré. Veuillez demander un nouveau lien.');
    }
  }, [searchParams]);

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      // Envoi du Magic Link / Récupération
      const redirectUrl = process.env.NEXT_PUBLIC_SITE_URL || (typeof window !== 'undefined' ? window.location.origin : '');
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${redirectUrl}/auth/callback?next=/reinitialiser-mot-de-passe&type=recovery`,
      });

      if (error) throw error;

      setMessage(
        'Er is een link naar uw e-mailadres gestuurd om uw wachtwoord te herstellen.'
      );
    } catch (error: any) {
      setError(error.message || 'Er is iets misgegaan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section-padding bg-beige-light min-h-screen flex items-center justify-center">
      <div className="container-custom max-w-md">
        <div className="bg-white-cream rounded-2xl p-8 shadow-md">
          <h1 className="font-elegant text-3xl sm:text-4xl text-brown-dark mb-2 text-center">
            Wachtwoord vergeten
          </h1>
          <p className="text-brown-soft text-center mb-8">
            Voer uw e-mailadres in om een magische link te ontvangen die u automatisch aanmeldt bij uw account.
          </p>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          {message && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
              {message}
            </div>
          )}

          <form onSubmit={handleMagicLink} className="space-y-6">
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
                  placeholder="uw@email.com"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Verzenden...' : 'Verstuur magische link'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-brown-soft">
            <Link href="/connexion" className="text-rose-soft hover:text-rose-soft/80 font-medium transition">
              Terug naar inloggen
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={
      <div className="section-padding bg-beige-light min-h-screen flex items-center justify-center">
        <div className="text-brown-soft">Laden...</div>
      </div>
    }>
      <ForgotPasswordContent />
    </Suspense>
  );
}
