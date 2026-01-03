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
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [loginMode, setLoginMode] = useState<'password' | 'otp'>('password');
  const [otpStep, setOtpStep] = useState<'request' | 'verify'>('request');
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

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!email) {
      addToast('Vul uw e-mailadres in', 'error');
      setLoading(false);
      return;
    }

    try {
      addToast('Verificatiecode verzenden...', 'info');
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          shouldCreateUser: false,
        }
      });

      if (error) throw error;

      setOtpStep('verify');
      addToast('Verificatiecode verzonden! Controleer uw e-mail 📧', 'success');
    } catch (error: any) {
      addToast(error.message || 'Fout bij het verzenden van de code', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtpLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!otp) {
      addToast('Voer de verificatiecode in', 'error');
      setLoading(false);
      return;
    }

    try {
      addToast('Inloggen...', 'info');
      const { error } = await supabase.auth.verifyOtp({
        email: email.trim(),
        token: otp.trim(),
        type: 'magiclink',
      });

      if (error) throw error;

      addToast('Succesvol ingelogd! 🎉', 'success');
      router.refresh();

      const searchParams = new URLSearchParams(window.location.search);
      const redirect = searchParams.get('redirect');
      router.push(redirect || '/compte');
    } catch (error: any) {
      addToast(error.message || 'Ongeldige of verlopen code', 'error');
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

          <div className="flex gap-4 mb-8 border-b border-nude">
            <button
              onClick={() => setLoginMode('password')}
              className={`pb-2 px-1 text-sm font-medium transition ${loginMode === 'password' ? 'border-b-2 border-rose-soft text-brown-dark' : 'text-brown-soft hover:text-brown-dark'}`}
            >
              Met wachtwoord
            </button>
            <button
              onClick={() => {
                setLoginMode('otp');
                if (otpStep === 'verify' && !email) setOtpStep('request');
              }}
              className={`pb-2 px-1 text-sm font-medium transition ${loginMode === 'otp' ? 'border-b-2 border-rose-soft text-brown-dark' : 'text-brown-soft hover:text-brown-dark'}`}
            >
              Met e-mailcode
            </button>
          </div>

          {loginMode === 'password' ? (
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
          ) : otpStep === 'request' ? (
            <form onSubmit={handleSendOtp} className="space-y-6">
              <div>
                <label htmlFor="email-otp" className="block text-brown-dark font-medium mb-2">
                  E-mailadres
                </label>
                <div className="relative">
                  <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-brown-soft w-5 h-5" />
                  <input
                    id="email-otp"
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
                {loading ? 'Code verzenden...' : 'Ontvang verificatiecode'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtpLogin} className="space-y-6">
              <div className="p-4 bg-rose-50 border border-rose-100 rounded-lg text-center mb-4">
                <p className="text-brown-dark text-sm">
                  Code gestuurd naar:<br />
                  <strong className="text-rose-soft">{email}</strong>
                </p>
              </div>

              <div>
                <label htmlFor="otp" className="block text-brown-dark font-medium mb-2">
                  Verificatiecode
                </label>
                <input
                  id="otp"
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                  className="w-full px-4 py-4 text-center text-2xl tracking-[0.5em] font-bold rounded-lg border-2 border-nude focus:border-rose-soft outline-none transition"
                  placeholder="000000"
                  maxLength={6}
                  disabled={loading}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Inloggen...' : 'Code bevestigen & Inloggen'}
              </button>

              <button
                type="button"
                onClick={() => setOtpStep('request')}
                className="w-full text-sm text-brown-soft hover:text-rose-soft transition"
              >
                Andere e-mail gebruiken
              </button>
            </form>
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



