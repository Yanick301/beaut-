'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FiMail, FiUser } from 'react-icons/fi';
import { useToastStore } from '@/lib/toast-store';

export default function SignupPage() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const { addToast } = useToastStore();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!email || !firstName || !lastName) {
      addToast('Veuillez remplir tous les champs', 'error');
      setLoading(false);
      return;
    }

    try {
      addToast('Création du compte...', 'info');

      // Appeler l'API pour créer l'utilisateur
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          first_name: firstName,
          last_name: lastName,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la création du compte');
      }

      setEmailSent(true);
      addToast('Compte créé ! Vous pouvez maintenant vous connecter 🎉', 'success');
      
      // Réinitialiser le formulaire
      setFirstName('');
      setLastName('');
      setEmail('');

      // Rediriger après 2 secondes
      setTimeout(() => {
        window.location.href = '/connexion';
      }, 2000);
    } catch (error: any) {
      addToast(error.message || 'Erreur lors de la création du compte', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section-padding bg-beige-light min-h-screen flex items-center justify-center">
      <div className="container-custom max-w-md">
        <div className="bg-white-cream rounded-2xl p-8 shadow-md">
          <h1 className="font-elegant text-3xl sm:text-4xl text-brown-dark mb-2 text-center">
            Créer un compte
          </h1>
          <p className="text-brown-soft text-center mb-8">
            Rejoignez notre communauté
          </p>

          {!emailSent ? (
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-brown-dark font-medium mb-2">
                    Prénom
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
                      placeholder="Prénom"
                      disabled={loading}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="lastName" className="block text-brown-dark font-medium mb-2">
                    Nom
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
                      placeholder="Nom"
                      disabled={loading}
                    />
                  </div>
                </div>
              </div>

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

              <div className="text-xs text-brown-soft mb-4">
                En créant un compte, vous acceptez nos{' '}
                <Link href="/cgv" className="text-rose-soft hover:underline">
                  conditions générales
                </Link>{' '}
                et notre{' '}
                <Link href="/confidentialite" className="text-rose-soft hover:underline">
                  politique de confidentialité
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Création en cours...' : 'Créer mon compte'}
              </button>
            </form>
          ) : (
            <div className="text-center space-y-4">
              <div className="text-4xl mb-4">🎉</div>
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-700 font-medium mb-2">Compte créé avec succès !</p>
                <p className="text-green-600 text-sm">
                  Vous serez redirigé vers la page de connexion.<br />
                  Vous pouvez vous connecter directement avec votre email.
                </p>
              </div>
            </div>
          )}

          <div className="mt-6 text-center text-sm text-brown-soft">
            Vous avez déjà un compte ?{' '}
            <Link href="/connexion" className="text-rose-soft hover:text-rose-soft/80 font-medium transition">
              Se connecter
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}






