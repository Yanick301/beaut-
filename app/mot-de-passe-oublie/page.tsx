'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FiMail } from 'react-icons/fi';
import { createClient } from '@/lib/supabase/client';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const supabase = createClient();

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      // Utiliser une variable d'environnement ou window.location.origin (vérifier que window existe)
      const redirectUrl = process.env.NEXT_PUBLIC_SITE_URL || (typeof window !== 'undefined' ? window.location.origin : '');
      if (!redirectUrl) {
        throw new Error('NEXT_PUBLIC_SITE_URL must be set in environment variables');
      }
      const callbackUrl = `${redirectUrl}/auth/callback?next=/reinitialiser-mot-de-passe`;

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: callbackUrl,
      });

      if (error) throw error;

      setMessage('Een wachtwoord reset link is naar uw e-mailadres verzonden!');
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
            Wachtwoord vergeten
          </h1>
          <p className="text-brown-soft text-center mb-8">
            Voer uw e-mailadres in om een wachtwoord reset link te ontvangen
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

          <form onSubmit={handleReset} className="space-y-6">
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

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Verzenden...' : 'Verstuur reset link'}
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






