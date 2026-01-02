'use client';

import Link from 'next/link';

export default function ForgotPasswordPage() {
  return (
    <div className="section-padding bg-beige-light min-h-screen flex items-center justify-center">
      <div className="container-custom max-w-md">
        <div className="bg-white-cream rounded-2xl p-8 shadow-md">
          <h1 className="font-elegant text-3xl sm:text-4xl text-brown-dark mb-2 text-center">
            Mot de passe oublié ?
          </h1>
          <p className="text-brown-soft text-center mb-8">
            Vous n'avez plus besoin de réinitialiser votre mot de passe !
          </p>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
            <h2 className="font-semibold text-blue-900 mb-3">✨ Nouvelle méthode de connexion</h2>
            <p className="text-blue-800 text-sm mb-4">
              Vous pouvez maintenant vous connecter directement avec votre email. Pas de mot de passe requis !
            </p>
            <ol className="text-blue-800 text-sm space-y-2">
              <li>1. Allez à la page de <Link href="/connexion" className="font-semibold underline">connexion</Link></li>
              <li>2. Entrez votre email</li>
              <li>3. Cliquez sur le lien reçu par email</li>
              <li>4. Vous êtes connecté automatiquement ✅</li>
            </ol>
          </div>

          <Link
            href="/connexion"
            className="block w-full text-center btn-primary"
          >
            Aller à la connexion
          </Link>
        </div>
      </div>
    </div>
  );
}
