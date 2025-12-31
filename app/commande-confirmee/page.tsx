'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { FiCheckCircle } from 'react-icons/fi';

function OrderConfirmedContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get('orderNumber');

  return (
    <div className="section-padding bg-beige-light min-h-screen">
      <div className="container-custom max-w-2xl mx-auto">
        <div className="bg-white-cream rounded-2xl p-12 text-center shadow-lg">
          <div className="w-20 h-20 bg-rose-soft/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <FiCheckCircle className="w-12 h-12 text-rose-soft" />
          </div>
          <h1 className="font-elegant text-4xl md:text-5xl text-brown-dark mb-4">
            Bestelling bevestigd !
          </h1>
          {orderNumber && (
            <p className="text-xl font-semibold text-brown-dark mb-4">
              Numéro de commande : {orderNumber}
            </p>
          )}
          <p className="text-lg text-brown-soft mb-8">
            Hartelijk dank voor uw aankoop. U ontvangt binnenkort een bevestigingsmail met 
            alle details van uw bestelling en de verzendgegevens.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/" className="btn-primary">
              Terug naar home
            </Link>
            <Link href="/compte" className="btn-secondary">
              Mijn bestellingen bekijken
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OrderConfirmedPage() {
  return (
    <Suspense fallback={
      <div className="section-padding bg-beige-light min-h-screen flex items-center justify-center">
        <div className="text-brown-soft">Chargement...</div>
      </div>
    }>
      <OrderConfirmedContent />
    </Suspense>
  );
}




