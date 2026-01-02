import Link from 'next/link';

export default function Page() {
  return (
    <div className="section-padding bg-beige-light min-h-screen flex items-center justify-center">
      <div className="container-custom max-w-md">
        <div className="bg-white-cream rounded-2xl p-8 shadow-md">
          <h1 className="font-elegant text-3xl sm:text-4xl text-brown-dark mb-2 text-center">
            Réinitialisation du mot de passe
          </h1>
          <p className="text-brown-soft text-center mb-8">
            Cette page n'est plus utilisée.
          </p>

          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
            <h2 className="font-semibold text-green-900 mb-3">🎉 Bonne nouvelle !</h2>
            <p className="text-green-800 text-sm">
              Nous avons simplifié la connexion. Vous pouvez maintenant vous connecter directement avec votre email sans mot de passe !
            </p>
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
