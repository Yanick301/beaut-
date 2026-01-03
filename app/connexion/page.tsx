'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { FiMail } from 'react-icons/fi';
import { useToastStore } from '@/lib/toast-store';

function LoginContent() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const { addToast } = useToastStore();

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!email) {
      addToast('Vul uw e-mailadres in', 'error');
      setLoading(false);
      return;
    }

    try {
      addToast('Inloglink versturen...', 'info');

      const response = await fetch('/api/auth/request-magic-link', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Fout bij het versturen van de link');
      }

      setEmailSent(true);
      addToast('Inloglink verzonden! Controleer uw e-mail 📧', 'success');
      setEmail('');
    } catch (error: any) {
      addToast(error.message || 'Fout bij het versturen van de link', 'error');
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
            Log in op uw account via e-mail
          </p>

          {!emailSent ? (
            <form onSubmit={handleMagicLink} className="space-y-6">
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
                {loading ? 'Versturen...' : 'Ontvang een inloglink'}
              </button>

              <p className="text-center text-sm text-brown-soft">
                Een veilige inloglink wordt naar uw e-mail gestuurd.<br />
                <span className="text-xs">Geen wachtwoord vereist 🔐</span>
              </p>
            </form>
          ) : (
            <div className="text-center space-y-4">
              <div className="text-4xl mb-4">✉️</div>
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-700 font-medium mb-2">Link succesvol verzonden!</p>
                <p className="text-green-600 text-sm mb-4">
                  Controleer uw e-mail {email} en klik op de inloglink.<br />
                  <span className="font-semibold">Deze link vervalt over 15 minuten.</span>
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

          <div className="mt-6 text-center text-sm text-brown-soft">
            Heeft u nog geen account?{' '}
            <Link href="/inscription" className="text-rose-soft hover:text-rose-soft/80 font-medium transition">
              Account aanmaken
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
        <div className="text-brown-soft">Laden...</div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}



