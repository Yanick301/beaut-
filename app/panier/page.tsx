'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { FiTrash2, FiPlus, FiMinus, FiArrowLeft } from 'react-icons/fi';
import { useCartStore } from '@/lib/store';
import { createClient } from '@/lib/supabase/client';

export default function CartPage() {
  const router = useRouter();
  const supabase = createClient();
  const { items, removeItem, updateQuantity, getTotal, clearCart } = useCartStore();
  const total = getTotal();
  const shipping = total >= 150 ? 0 : 2.99;
  const [user, setUser] = useState<any>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Vérifier l'authentification
  useEffect(() => {
    async function checkAuth() {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setCheckingAuth(false);
    }
    checkAuth();

    // Écouter les changements d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  const handleCheckout = () => {
    if (!user) {
      // Rediriger vers la page de connexion avec un paramètre redirect
      router.push('/connexion?redirect=/checkout');
    } else {
      // Utilisateur connecté, rediriger vers le checkout
      router.push('/checkout');
    }
  };

  if (items.length === 0) {
    return (
      <div className="section-padding bg-beige-light min-h-screen">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto text-center bg-white-cream p-12 rounded-2xl">
            <h1 className="font-elegant text-4xl text-brown-dark mb-4">Votre panier est vide</h1>
            <p className="text-brown-soft mb-8">Découvrez nos produits de beauté premium</p>
            <Link href="/" className="btn-primary">
              Découvrir la boutique
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="section-padding bg-beige-light min-h-screen">
      <div className="container-custom">
        <h1 className="font-elegant text-3xl sm:text-4xl md:text-5xl text-brown-dark mb-6 sm:mb-8">Mon Panier</h1>

        <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-3 sm:space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white-cream rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 shadow-md flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-6"
              >
                {/* Image */}
                <div className="relative w-full sm:w-20 md:w-24 lg:w-32 h-24 sm:h-20 md:h-24 lg:h-32 bg-beige rounded-lg overflow-hidden flex-shrink-0">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, 120px"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <Link href={`/produit/${item.id}`}>
                    <h3 className="font-elegant text-base sm:text-lg md:text-xl text-brown-dark mb-1 sm:mb-2 hover:text-rose-soft transition line-clamp-2">
                      {item.name}
                      {item.selectedVolume && (
                        <span className="text-sm sm:text-base text-brown-soft font-normal"> - {item.selectedVolume}</span>
                      )}
                    </h3>
                  </Link>
                  <p className="text-brown-soft text-xs sm:text-sm mb-2 sm:mb-4 line-clamp-2 hidden sm:block">
                    {item.description}
                  </p>
                  <div className="flex items-center justify-between sm:justify-start sm:gap-4 mb-2 sm:mb-0">
                    <span className="text-lg sm:text-xl md:text-2xl font-elegant text-brown-dark">
                      €{(item.price * item.quantity).toFixed(2)}
                    </span>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-2 text-rose-soft hover:text-rose-soft/80 transition active:scale-95 touch-manipulation sm:ml-auto"
                      aria-label="Supprimer"
                    >
                      <FiTrash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                  </div>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center justify-between sm:flex-col sm:items-end sm:justify-between gap-3 sm:gap-4 flex-shrink-0">
                  <div className="flex items-center border-2 border-nude rounded-full overflow-hidden">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-2 sm:p-2.5 md:p-3 hover:bg-nude transition active:scale-95 touch-manipulation"
                      aria-label="Diminuer la quantité"
                    >
                      <FiMinus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </button>
                    <span className="px-2 sm:px-3 md:px-4 py-2 font-semibold min-w-[2rem] sm:min-w-[2.5rem] md:min-w-[3rem] text-center text-xs sm:text-sm md:text-base">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-2 sm:p-2.5 md:p-3 hover:bg-nude transition active:scale-95 touch-manipulation"
                      aria-label="Augmenter la quantité"
                    >
                      <FiPlus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </button>
                  </div>
                  <span className="text-xs sm:text-sm text-brown-soft">
                    €{item.price.toFixed(2)} / unité
                  </span>
                </div>
              </div>
            ))}

            <div className="flex justify-between items-center pt-4">
              <Link href="/" className="flex items-center gap-2 text-brown-soft hover:text-brown-dark transition">
                <FiArrowLeft className="w-4 h-4" />
                Continuer mes achats
              </Link>
              <button
                onClick={clearCart}
                className="text-rose-soft hover:text-rose-soft/80 transition text-sm underline"
              >
                Vider le panier
              </button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white-cream rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 shadow-md lg:sticky lg:top-24">
              <h2 className="font-elegant text-xl sm:text-2xl text-brown-dark mb-4 sm:mb-6">Récapitulatif</h2>

              <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                <div className="flex justify-between text-sm sm:text-base text-brown-soft">
                  <span>Sous-total</span>
                  <span className="font-medium">€{total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm sm:text-base text-brown-soft">
                  <span>Livraison</span>
                  <span className="font-medium">
                    {shipping === 0 ? (
                      <span className="text-rose-soft font-semibold">Gratuite</span>
                    ) : (
                      `€${shipping.toFixed(2)}`
                    )}
                  </span>
                </div>
                {total < 150 && (
                  <p className="text-xs sm:text-sm text-rose-soft bg-rose-soft/10 p-2 sm:p-3 rounded-lg">
                    Ajoutez €{(150 - total).toFixed(2)} pour la livraison gratuite
                  </p>
                )}
                <div className="border-t border-nude pt-3 sm:pt-4">
                  <div className="flex justify-between text-base sm:text-lg md:text-xl font-semibold text-brown-dark">
                    <span>Total</span>
                    <span>€{(total + shipping).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={checkingAuth}
                className="btn-primary w-full text-center block mb-4 sm:mb-6 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 touch-manipulation"
              >
                {checkingAuth ? 'Vérification...' : 'Passer la commande'}
              </button>

              <div className="text-xs sm:text-sm text-brown-soft space-y-2">
                <p className="flex items-center gap-2">
                  <span className="text-rose-soft text-base">✓</span>
                  Paiement sécurisé
                </p>
                <p className="flex items-center gap-2">
                  <span className="text-rose-soft text-base">✓</span>
                  Livraison rapide
                </p>
                <p className="flex items-center gap-2">
                  <span className="text-rose-soft text-base">✓</span>
                  Retours faciles
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}








