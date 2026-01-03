'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FiMail, FiLock } from 'react-icons/fi';
import { useToastStore } from '@/lib/toast-store';
import { createClient } from '@/lib/supabase/client';

function LoginContent() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { addToast } = useToastStore();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!email || !password) {
      addToast('Vul alle velden in', 'error');
      setLoading(false);
      return;
    }

    try {
      addToast('Inloggen...', 'info');

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      });

      if (error) {
        throw error;
      }

      addToast('Succesvol ingelogd! 🎉', 'success');

      // Force refresh to update auth state
      router.refresh();

      // Check for redirect param or go to account
      const searchParams = new URLSearchParams(window.location.search);
      const redirect = searchParams.get('redirect');
      router.push(redirect || '/compte');

    } catch (error: any) {
      console.error('Login error:', error);
      addToast(error.message || 'Fout bij het inloggen. Controleer uw gegevens.', 'error');
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
            Log in op uw account
          </p>

          <form onSubmit={handleLogin} className="space-y-6">
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

            <div>
              <label htmlFor="password" className="block text-brown-dark font-medium mb-2">
                Wachtwoord
              </label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-brown-soft w-5 h-5" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-lg border-2 border-nude focus:border-rose-soft outline-none transition"
                  placeholder="********"
                  disabled={loading}
                />
              </div>
              <div className="text-right mt-1">
                <Link href="/mot-de-passe-oublie" className="text-xs text-brown-soft hover:text-rose-soft transition">
                  Wachtwoord vergeten?
                </Link>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Bezig met inloggen...' : 'Inloggen'}
            </button>
          </form>

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



