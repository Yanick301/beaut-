'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FiMail, FiUser } from 'react-icons/fi';
import { useToastStore } from '@/lib/toast-store';

import { createClient } from '@/lib/supabase/client';

export default function SignupPage() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [verificationLoading, setVerificationLoading] = useState(false);
  const [step, setStep] = useState<'form' | 'otp'>('form');
  const [emailSent, setEmailSent] = useState(false);
  const { addToast } = useToastStore();
  const supabase = createClient();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!email || !password || !firstName || !lastName || !phone) {
      addToast('Vul alle velden in', 'error');
      setLoading(false);
      return;
    }

    try {
      addToast('Account aanmaken...', 'info');

      // Appeler l'API pour créer l'utilisateur
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password,
          first_name: firstName,
          last_name: lastName,
          phone,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Fout bij het aanmaken van het account');
      }

      setStep('otp');
      addToast('Account aangemaakt! Voer de verificatiecode uit uw e-mail in 📧', 'success');
    } catch (error: any) {
      addToast(error.message || 'Fout bij het aanmaken van het account', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setVerificationLoading(true);

    if (!otp) {
      addToast('Voer de verificatiecode in', 'error');
      setVerificationLoading(false);
      return;
    }

    try {
      addToast('Code controleren...', 'info');

      const { error } = await supabase.auth.verifyOtp({
        email: email.trim().toLowerCase(),
        token: otp.trim(),
        type: 'signup',
      });

      if (error) throw error;

      addToast('E-mail succesvol bevestigd! 🎉', 'success');
      setEmailSent(true);

      // Rediriger après 2 secondes
      setTimeout(() => {
        window.location.href = '/compte';
      }, 2000);
    } catch (error: any) {
      console.error('OTP Verification error:', error);
      addToast(error.message || 'Ongeldige of verlopen code', 'error');
    } finally {
      setVerificationLoading(false);
    }
  };

  return (
    <div className="section-padding bg-beige-light min-h-screen flex items-center justify-center">
      <div className="container-custom max-w-md">
        <div className="bg-white-cream rounded-2xl p-8 shadow-md">
          <h1 className="font-elegant text-3xl sm:text-4xl text-brown-dark mb-2 text-center">
            Account aanmaken
          </h1>
          <p className="text-brown-soft text-center mb-8">
            Word lid van onze community
          </p>

          {step === 'form' ? (
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-brown-dark font-medium mb-2">
                    Voornaam
                  </label>
                  <div className="relative">
                    <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-brown-soft w-5 h-5" />
                    <input
                      id="firstName"
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                      className="w-full pl-10 pr-4 py-3 rounded-lg border-2 border-nude focus:border-rose-soft outline-none transition"
                      placeholder="Voornaam"
                      disabled={loading}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="lastName" className="block text-brown-dark font-medium mb-2">
                    Achternaam
                  </label>
                  <div className="relative">
                    <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-brown-soft w-5 h-5" />
                    <input
                      id="lastName"
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                      className="w-full pl-10 pr-4 py-3 rounded-lg border-2 border-nude focus:border-rose-soft outline-none transition"
                      placeholder="Achternaam"
                      disabled={loading}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="phone" className="block text-brown-dark font-medium mb-2">
                  Telefoonnummer
                </label>
                <div className="relative">
                  <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-brown-soft w-5 h-5" />
                  <input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-lg border-2 border-nude focus:border-rose-soft outline-none transition"
                    placeholder="06 12 34 56 78"
                    disabled={loading}
                  />
                </div>
              </div>

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
                  <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-brown-soft w-5 h-5" />
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-lg border-2 border-nude focus:border-rose-soft outline-none transition"
                    placeholder="********"
                    disabled={loading}
                    minLength={6}
                  />
                </div>
              </div>

              <div className="text-xs text-brown-soft mb-4">
                Door een account aan te maken gaat u akkoord met onze{' '}
                <Link href="/cgv" className="text-rose-soft hover:underline">
                  algemene voorwaarden
                </Link>{' '}
                en ons{' '}
                <Link href="/confidentialite" className="text-rose-soft hover:underline">
                  privacybeleid
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Bezig met aanmaken...' : 'Account aanmaken'}
              </button>
            </form>
          ) : !emailSent ? (
            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <div className="p-4 bg-rose-50 border border-rose-100 rounded-lg text-center mb-4">
                <p className="text-brown-dark text-sm">
                  We hebben een verificatiecode gestuurd naar:<br />
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
                  disabled={verificationLoading}
                />
              </div>

              <button
                type="submit"
                disabled={verificationLoading}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {verificationLoading ? 'Controleren...' : 'Code bevestigen'}
              </button>

              <button
                type="button"
                onClick={() => setStep('form')}
                className="w-full text-sm text-brown-soft hover:text-rose-soft transition"
              >
                E-mailadres aanpassen
              </button>
            </form>
          ) : (
            <div className="text-center space-y-4">
              <div className="text-4xl mb-4">🎉</div>
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-700 font-medium mb-2">E-mail succesvol bevestigd!</p>
                <p className="text-green-600 text-sm">
                  Welkom bij Essence Féminine.<br />
                  U wordt nu doorverwezen naar uw account...
                </p>
              </div>
            </div>
          )}

          <div className="mt-6 text-center text-sm text-brown-soft">
            Heeft u al een account?{' '}
            <Link href="/connexion" className="text-rose-soft hover:text-rose-soft/80 font-medium transition">
              Inloggen
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}






