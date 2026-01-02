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
      addToast('Veuillez entrer votre email', 'error');
      setLoading(false);
      return;
    }

    try {
      addToast('Envoi du lien de connexion...', 'info');

      const response = await fetch('/api/auth/request-magic-link', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de l\'envoi du lien');
      }

      setEmailSent(true);
      addToast('Lien de connexion envoyé ! Vérifiez votre email 📧', 'success');
      setEmail('');
    } catch (error: any) {
      addToast(error.message || 'Erreur lors de l\'envoi du lien', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section-padding bg-beige-light min-h-screen flex items-center justify-center">
      <div className="container-custom max-w-md">
        <div className="bg-white-cream rounded-2xl p-8 shadow-md">
          <h1 className="font-elegant text-3xl sm:text-4xl text-brown-dark mb-2 text-center">
            Connexion
          </h1>
          <p className="text-brown-soft text-center mb-8">
            Connectez-vous à votre compte via email
          </p>

          {!emailSent ? (
            <form onSubmit={handleMagicLink} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-brown-dark font-medium mb-2">
                  Adresse email
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
                    disabled={loading}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Envoi en cours...' : 'Recevoir un lien de connexion'}
              </button>

              <p className="text-center text-sm text-brown-soft">
                Un lien de connexion sécurisé sera envoyé à votre email.<br />
                <span className="text-xs">Pas de mot de passe requis 🔐</span>
              </p>
            </form>
          ) : (
            <div className="text-center space-y-4">
              <div className="text-4xl mb-4">✉️</div>
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-700 font-medium mb-2">Lien envoyé avec succès !</p>
                <p className="text-green-600 text-sm mb-4">
                  Vérifiez votre email {email} et cliquez sur le lien de connexion.<br />
                  <span className="font-semibold">Ce lien expire dans 15 minutes.</span>
                </p>
              </div>
              <button
                onClick={() => {
                  setEmailSent(false);
                  setEmail('');
                }}
                className="w-full btn-outline"
              >
                Utiliser un autre email
              </button>
            </div>
          )}

          <div className="mt-6 text-center text-sm text-brown-soft">
            Vous n'avez pas de compte ?{' '}
            <Link href="/inscription" className="text-rose-soft hover:text-rose-soft/80 font-medium transition">
              Créer un compte
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



