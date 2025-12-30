'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { FiLock, FiArrowLeft } from 'react-icons/fi';
import { useCartStore } from '@/lib/store';
import { createClient } from '@/lib/supabase/client';
import PromoCodeInput from '@/components/PromoCodeInput';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotal, clearCart } = useCartStore();
  const total = getTotal();
  const shipping = total >= 150 ? 0 : 2.99;
  const supabase = createClient();
  
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [appliedPromoCode, setAppliedPromoCode] = useState<string | undefined>();

  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'BE',
    phone: '',
    paymentMethod: 'bank_transfer',
  });

  // Vérifier l'authentification et charger les données utilisateur
  useEffect(() => {
    async function checkAuthAndLoadData() {
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error || !user) {
        // Rediriger vers la connexion si non authentifié
        router.push('/connexion?redirect=/checkout');
        return;
      }

      // Charger les données du profil
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profile) {
        setFormData(prev => ({
          ...prev,
          email: user.email || '',
          firstName: profile.first_name || '',
          lastName: profile.last_name || '',
          phone: profile.phone || '',
        }));
      }
    }
    checkAuthAndLoadData();
  }, [supabase, router]);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const shippingAddress = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        address: formData.address,
        city: formData.city,
        postalCode: formData.postalCode,
        country: formData.country,
        phone: formData.phone,
        email: formData.email,
      };

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items,
          shippingAddress,
          paymentMethod: formData.paymentMethod,
          totalAmount: Math.max(0, total - promoDiscount),
          shippingCost: shipping,
          promoCode: appliedPromoCode,
          promoDiscount: promoDiscount,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la création de la commande');
      }

      // Succès - rediriger vers la page de téléversement du reçu
      // Ne pas vider le panier ici, on le videra après téléversement réussi
      router.push(`/televerser-recu?orderId=${data.order.id}&orderNumber=${data.order.orderNumber}`);
    } catch (err: any) {
      console.error('Checkout error:', err);
      setError(err.message || 'Une erreur est survenue lors de la finalisation de la commande');
      setSubmitting(false);
    }
  };

  // Vérifier si le panier est vide et rediriger (seulement si on n'est pas en train de soumettre)
  useEffect(() => {
    if (items.length === 0 && !submitting) {
      router.push('/panier');
    }
  }, [items.length, router, submitting]);

  if (items.length === 0 && !submitting) {
    return null;
  }

  return (
    <div className="section-padding bg-beige-light min-h-screen">
      <div className="container-custom max-w-5xl">
        <Link href="/panier" className="flex items-center gap-2 text-brown-soft hover:text-brown-dark transition mb-8">
          <FiArrowLeft className="w-4 h-4" />
          Retour au panier
        </Link>

        <h1 className="font-elegant text-4xl md:text-5xl text-brown-dark mb-8">Finaliser la commande</h1>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contact Information */}
            <div className="bg-white-cream rounded-2xl p-6 shadow-md">
              <h2 className="font-elegant text-2xl text-brown-dark mb-6">Informations de contact</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-brown-dark font-medium mb-2">Email *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border-2 border-nude focus:border-rose-soft outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-brown-dark font-medium mb-2">Téléphone *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border-2 border-nude focus:border-rose-soft outline-none transition"
                  />
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white-cream rounded-2xl p-6 shadow-md">
              <h2 className="font-elegant text-2xl text-brown-dark mb-6">Adresse de livraison</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-brown-dark font-medium mb-2">Prénom *</label>
                  <input
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border-2 border-nude focus:border-rose-soft outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-brown-dark font-medium mb-2">Nom *</label>
                  <input
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border-2 border-nude focus:border-rose-soft outline-none transition"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-brown-dark font-medium mb-2">Adresse *</label>
                  <input
                    type="text"
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border-2 border-nude focus:border-rose-soft outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-brown-dark font-medium mb-2">Code postal *</label>
                  <input
                    type="text"
                    required
                    value={formData.postalCode}
                    onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border-2 border-nude focus:border-rose-soft outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-brown-dark font-medium mb-2">Ville *</label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border-2 border-nude focus:border-rose-soft outline-none transition"
                  />
                </div>
                <input type="hidden" name="country" value="BE" />
                <div className="bg-rose-soft/10 border border-rose-soft/30 rounded-lg p-4">
                  <p className="text-sm text-brown-dark">
                    <strong>Livraison :</strong> Nous livrons uniquement en Belgique
                  </p>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white-cream rounded-2xl p-6 shadow-md">
              <h2 className="font-elegant text-2xl text-brown-dark mb-6">Méthode de paiement</h2>
              <div className="space-y-3">
                <label className="flex items-center p-4 border-2 border-rose-soft rounded-lg cursor-pointer bg-rose-soft/5">
                  <input
                    type="radio"
                    name="payment"
                    value="bank_transfer"
                    checked={formData.paymentMethod === 'bank_transfer'}
                    onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                    className="mr-3"
                  />
                  <span className="font-medium">Virement bancaire instantané</span>
                </label>
              </div>
              <p className="text-sm text-brown-soft mt-4">
                Vous serez redirigé vers une page pour téléverser le reçu de virement après validation de la commande.
              </p>
            </div>

            {/* Bank Transfer Instructions */}
            <div className="bg-gradient-to-r from-rose-powder to-beige rounded-2xl p-6 shadow-md border-2 border-rose-soft">
              <h2 className="font-elegant text-2xl text-brown-dark mb-6 flex items-center gap-2">
                <FiLock className="w-6 h-6" />
                Instructions de virement bancaire
              </h2>
              <div className="bg-white-cream rounded-lg p-6 space-y-4">
                <div className="border-b border-nude pb-4">
                  <p className="text-sm font-semibold text-brown-soft mb-2">Titulaire du compte :</p>
                  <p className="text-lg font-semibold text-brown-dark">ESSENCE FÉMININE S.P.R.L.</p>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-semibold text-brown-soft mb-2">IBAN :</p>
                    <p className="text-lg font-mono text-brown-dark">BE68 5390 0754 7034</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-brown-soft mb-2">BIC / SWIFT :</p>
                    <p className="text-lg font-mono text-brown-dark">GKCCBEBB</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-brown-soft mb-2">Banque :</p>
                    <p className="text-lg text-brown-dark">Belfius Bank</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-brown-soft mb-2">Montant à virer :</p>
                    <p className="text-2xl font-bold text-rose-soft">€{(Math.max(0, total - promoDiscount) + shipping).toFixed(2)}</p>
                  </div>
                </div>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
                  <p className="text-sm text-yellow-800 font-semibold mb-2">⚠️ Important :</p>
                  <ul className="text-sm text-yellow-700 space-y-1 list-disc list-inside">
                    <li>Effectuez le virement pour le montant exact indiqué ci-dessus</li>
                    <li>Prenez une capture d'écran ou téléchargez le reçu de virement</li>
                    <li>Vous devrez téléverser ce reçu sur la page suivante pour finaliser votre commande</li>
                    <li>Votre commande sera traitée uniquement après réception et validation du reçu</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white-cream rounded-2xl p-4 sm:p-6 shadow-md lg:sticky lg:top-24">
              <h2 className="font-elegant text-2xl text-brown-dark mb-6">Récapitulatif</h2>

              <div className="space-y-3 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-brown-soft">
                      {item.name} x {item.quantity}
                    </span>
                    <span className="text-brown-dark">€{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              {/* Promo Code */}
              <div className="mb-6">
                <PromoCodeInput
                  cartTotal={total}
                  items={items.map(item => ({ productId: item.id, category: item.category }))}
                  onApply={(discount, code) => {
                    setPromoDiscount(discount);
                    setAppliedPromoCode(code);
                  }}
                  onRemove={() => {
                    setPromoDiscount(0);
                    setAppliedPromoCode(undefined);
                  }}
                  appliedCode={appliedPromoCode}
                  appliedDiscount={promoDiscount}
                />
              </div>

              <div className="space-y-3 border-t border-nude pt-4 mb-6">
                <div className="flex justify-between text-brown-soft">
                  <span>Sous-total</span>
                  <span>€{total.toFixed(2)}</span>
                </div>
                {promoDiscount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Code promo ({appliedPromoCode})</span>
                    <span>-€{promoDiscount.toFixed(2)}</span>
                  </div>
                )}
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
                <div className="border-t border-nude pt-4">
                  <div className="flex justify-between text-lg font-semibold text-brown-dark">
                    <span>Total</span>
                    <span>€{(Math.max(0, total - promoDiscount) + shipping).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="btn-primary w-full flex items-center justify-center gap-2 mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FiLock className="w-5 h-5" />
                {submitting ? 'Traitement...' : 'Commander en toute sécurité'}
              </button>

              <p className="text-xs text-brown-soft text-center">
              
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}




