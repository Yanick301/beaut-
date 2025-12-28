import Link from 'next/link';
import { FiHome } from 'react-icons/fi';

export default function NotFound() {
  return (
    <div className="section-padding bg-beige-light min-h-screen flex items-center justify-center">
      <div className="container-custom text-center">
        <div className="max-w-2xl mx-auto">
          <h1 className="font-elegant text-8xl md:text-9xl text-rose-soft mb-4">404</h1>
          <h2 className="font-elegant text-4xl md:text-5xl text-brown-dark mb-6">
            Page non trouvée
          </h2>
          <p className="text-lg text-brown-soft mb-8">
            Désolée, la page que vous recherchez n'existe pas ou a été déplacée.
          </p>
          <Link href="/" className="btn-primary inline-flex items-center gap-2">
            <FiHome className="w-5 h-5" />
            Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  );
}









