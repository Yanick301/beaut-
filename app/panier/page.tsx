'use client';

import Link from 'next/link';
import Image from 'next/image';
import { FiTrash2, FiPlus, FiMinus, FiArrowLeft } from 'react-icons/fi';
import { useCartStore } from '@/lib/store';

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotal, clearCart } = useCartStore();
  const total = getTotal();
  const shipping = total >= 50 ? 0 : 5.99;

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
        <h1 className="font-elegant text-4xl md:text-5xl text-brown-dark mb-8">Mon Panier</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white-cream rounded-2xl p-6 shadow-md flex flex-col md:flex-row gap-6"
              >
                {/* Image */}
                <div className="relative w-full md:w-32 h-32 bg-beige rounded-lg overflow-hidden flex-shrink-0">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Details */}
                <div className="flex-1">
                  <Link href={`/produit/${item.id}`}>
                    <h3 className="font-elegant text-xl text-brown-dark mb-2 hover:text-rose-soft transition">
                      {item.name}
                    </h3>
                  </Link>
                  <p className="text-brown-soft text-sm mb-4 line-clamp-2">
                    {item.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-elegant text-brown-dark">
                      €{(item.price * item.quantity).toFixed(2)}
                    </span>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-2 text-rose-soft hover:text-rose-soft/80 transition"
                    >
                      <FiTrash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-4 md:flex-col md:items-end">
                  <div className="flex items-center border-2 border-nude rounded-full overflow-hidden">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-2 hover:bg-nude transition"
                    >
                      <FiMinus className="w-4 h-4" />
                    </button>
                    <span className="px-4 py-2 font-semibold min-w-[3rem] text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-2 hover:bg-nude transition"
                    >
                      <FiPlus className="w-4 h-4" />
                    </button>
                  </div>
                  <span className="text-sm text-brown-soft">
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
            <div className="bg-white-cream rounded-2xl p-6 shadow-md sticky top-24">
              <h2 className="font-elegant text-2xl text-brown-dark mb-6">Récapitulatif</h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-brown-soft">
                  <span>Sous-total</span>
                  <span>€{total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-brown-soft">
                  <span>Livraison</span>
                  <span>
                    {shipping === 0 ? (
                      <span className="text-rose-soft font-semibold">Gratuite</span>
                    ) : (
                      `€${shipping.toFixed(2)}`
                    )}
                  </span>
                </div>
                {total < 50 && (
                  <p className="text-sm text-rose-soft">
                    Ajoutez €{(50 - total).toFixed(2)} pour la livraison gratuite
                  </p>
                )}
                <div className="border-t border-nude pt-4">
                  <div className="flex justify-between text-lg font-semibold text-brown-dark">
                    <span>Total</span>
                    <span>€{(total + shipping).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <Link href="/checkout" className="btn-primary w-full text-center block mb-4">
                Passer la commande
              </Link>

              <div className="text-sm text-brown-soft space-y-2">
                <p className="flex items-center gap-2">
                  <span className="text-rose-soft">✓</span>
                  Paiement sécurisé
                </p>
                <p className="flex items-center gap-2">
                  <span className="text-rose-soft">✓</span>
                  Livraison rapide
                </p>
                <p className="flex items-center gap-2">
                  <span className="text-rose-soft">✓</span>
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








