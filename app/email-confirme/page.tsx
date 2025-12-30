'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { FiCheckCircle, FiMail, FiArrowRight } from 'react-icons/fi';
import { createClient } from '@/lib/supabase/client';

function EmailConfirmedContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [confirmed, setConfirmed] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function checkEmailConfirmation() {
      const supabase = createClient();
      
      // Vérifier si l'utilisateur est connecté et si son email est confirmé
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        setError('Erreur lors de la vérification de votre compte');
        setLoading(false);
        return;
      }

      // Vérifier si l'email est confirmé
      if (user.email_confirmed_at) {
        setConfirmed(true);
      } else {
        setError('Votre email n\'a pas encore été confirmé');
      }
      
      setLoading(false);
    }

    checkEmailConfirmation();
  }, []);

  if (loading) {
    return (
      <div className="section-padding bg-beige-light min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-soft mx-auto mb-4"></div>
          <p className="text-brown-soft">Vérification en cours...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="section-padding bg-beige-light min-h-screen flex items-center justify-center">
        <div className="container-custom max-w-md">
          <div className="bg-white-cream rounded-2xl p-8 shadow-md text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiMail className="w-8 h-8 text-red-600" />
            </div>
            <h1 className="font-elegant text-2xl text-brown-dark mb-4">
              Erreur de confirmation
            </h1>
            <p className="text-brown-soft mb-6">{error}</p>
            <Link href="/connexion" className="btn-primary">
              Aller à la page de connexion
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="section-padding bg-beige-light min-h-screen flex items-center justify-center">
      <div className="container-custom max-w-md">
        <div className="bg-white-cream rounded-2xl p-8 shadow-md text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FiCheckCircle className="w-12 h-12 text-green-600" />
          </div>
          
          <h1 className="font-elegant text-3xl text-brown-dark mb-4">
            Email confirmé !
          </h1>
          
          <p className="text-brown-soft mb-2 text-lg">
            Votre adresse email a été vérifiée avec succès.
          </p>
          
          <p className="text-brown-soft mb-8">
            Votre compte est maintenant actif et vous pouvez accéder à tous les services.
          </p>

          <div className="space-y-4">
            <Link 
              href="/compte" 
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              Accéder à mon compte
              <FiArrowRight className="w-5 h-5" />
            </Link>
            
            <Link 
              href="/" 
              className="block text-rose-soft hover:text-rose-soft/80 transition text-sm"
            >
              Continuer mes achats
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function EmailConfirmedPage() {
  return (
    <Suspense fallback={
      <div className="section-padding bg-beige-light min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-soft mx-auto mb-4"></div>
          <p className="text-brown-soft">Chargement...</p>
        </div>
      </div>
    }>
      <EmailConfirmedContent />
    </Suspense>
  );
}

