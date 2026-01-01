'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FiCheckCircle, FiMail, FiArrowRight } from 'react-icons/fi';
import { createClient } from '@/lib/supabase/client';

export default function EmailConfirmedPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [confirmed, setConfirmed] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function checkUser() {
      const supabase = createClient();

      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError) {
        setError('Er is iets misgegaan bij het ophalen van uw account.');
        setLoading(false);
        return;
      }

      if (!user) {
        setError('U bent niet ingelogd. Gelieve opnieuw in te loggen.');
        setLoading(false);
        return;
      }

      if (!user.email_confirmed_at) {
        setError('Uw e-mailadres is nog niet bevestigd.');
        setLoading(false);
        return;
      }

      // Tout est OK
      setConfirmed(true);
      setLoading(false);

      // Redirection vers le profil après 3 secondes
      setTimeout(() => {
        router.push('/compte');
      }, 3000);
    }

    checkUser();
  }, [router]);

  if (loading) {
    return (
      <div className="section-padding bg-beige-light min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-soft mx-auto mb-4"></div>
          <p className="text-brown-soft">Bevestiging in progress...</p>
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
              Bevestigingsfout
            </h1>
            <p className="text-brown-soft mb-6">{error}</p>
            <Link href="/connexion" className="btn-primary">
              Ga naar inlogpagina
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (confirmed) {
    return (
      <div className="section-padding bg-beige-light min-h-screen flex items-center justify-center">
        <div className="container-custom max-w-md">
          <div className="bg-white-cream rounded-2xl p-8 shadow-md text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FiCheckCircle className="w-12 h-12 text-green-600" />
            </div>
            
            <h1 className="font-elegant text-3xl text-brown-dark mb-4">
              E-mail bevestigd !
            </h1>
            
            <p className="text-brown-soft mb-2 text-lg">
              Uw e-mailadres is succesvol geverifieerd.
            </p>
            
            <p className="text-brown-soft mb-8">
              Uw account is nu actief en u wordt automatisch doorgestuurd naar uw profiel.
            </p>

            <div className="space-y-4">
              <Link 
                href="/compte" 
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                Toegang tot mijn account
                <FiArrowRight className="w-5 h-5" />
              </Link>
              
              <Link 
                href="/" 
                className="block text-rose-soft hover:text-rose-soft/80 transition text-sm"
              >
                Verder met winkelen
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
