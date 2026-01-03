'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FiMail, FiArrowLeft } from 'react-icons/fi';
import { useToastStore } from '@/lib/toast-store';
import { createClient } from '@/lib/supabase/client';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const { addToast } = useToastStore();
  const supabase = createClient();

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!email) {
      addToast('Vul uw e-mailadres in', 'error');
      setLoading(false);
      return;
    }

    try {
      addToast('Link verzenden...', 'info');

      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/auth/callback?next=/reinitialiser-mot-de-passe`,
      });

      if (error) {
        throw error;
      }

      setEmailSent(true);
      addToast('Resetlink verzonden! Controleer uw e-mail 📧', 'success');

    } catch (error: any) {
      console.error('Reset error:', error);
      addToast(error.message || 'Fout bij het versturen van de link', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section-padding bg-beige-light min-h-screen flex items-center justify-center">
      <div className="container-custom max-w-md">
        <div className="bg-white-cream rounded-2xl p-8 shadow-md">
          <Link href="/connexion" className="flex items-center gap-2 text-brown-soft hover:text-brown-dark transition mb-6 text-sm">
            <FiArrowLeft /> Terug naar inloggen
          </Link>

          <h1 className="font-elegant text-3xl sm:text-4xl text-brown-dark mb-2 text-center">
            Wachtwoord vergeten?
          </h1>
          <p className="text-brown-soft text-center mb-8">
            Vul uw e-mailadres in om uw wachtwoord te resetten
          </p>

          {!emailSent ? (
            <form onSubmit={handleReset} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-brown-dark font-medium mb-2">
                  E-mailadres
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
                    disabled={loading}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Versturen...' : 'Resetlink versturen'}
              </button>
            </form>
          ) : (
            <div className="text-center space-y-4">
              <div className="text-4xl mb-4">📧</div>
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-700 font-medium mb-2">Link succesvol verzonden!</p>
                <p className="text-green-600 text-sm mb-4">
                  Controleer uw e-mail {email}.<br />
                  Klik op de link in de e-mail om een nieuw wachtwoord in te stellen.
                </p>
              </div>
              <button
                onClick={() => {
                  setEmailSent(false);
                  setEmail('');
                }}
                className="w-full btn-outline"
              >
                Een ander e-mailadres gebruiken
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
