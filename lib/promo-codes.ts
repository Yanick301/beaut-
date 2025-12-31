// Système de codes promo
export interface PromoCode {
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  minPurchase?: number;
  maxDiscount?: number;
  validFrom?: Date;
  validUntil?: Date;
  usageLimit?: number;
  usedCount?: number;
  applicableTo?: string[]; // IDs de produits ou catégories
}

// Codes promo prédéfinis (à migrer vers Supabase plus tard)
export const PROMO_CODES: PromoCode[] = [
  {
    code: 'WELKOM10',
    type: 'percentage',
    value: 10,
    minPurchase: 0,
  },
  {
    code: 'VERZEND50',
    type: 'fixed',
    value: 5.99,
    minPurchase: 150,
  },
  {
    code: 'PREMIUM20',
    type: 'percentage',
    value: 20,
    minPurchase: 350,
    maxDiscount: 50,
  },
  {
    code: 'SCHOONHEID15',
    type: 'percentage',
    value: 15,
    minPurchase: 75,
  },
  {
    code: 'KERST25',
    type: 'percentage',
    value: 25,
    minPurchase: 100,
    maxDiscount: 40,
  },
  {
    code: 'ZORG12',
    type: 'percentage',
    value: 12,
    minPurchase: 50,
  },
];

export function validatePromoCode(
  code: string,
  cartTotal: number,
  items: Array<{ productId: string; category: string }>
): { valid: boolean; discount: number; error?: string } {
  const promo = PROMO_CODES.find(p => p.code.toUpperCase() === code.toUpperCase());
  
  if (!promo) {
    return { valid: false, discount: 0, error: 'Ongeldige kortingscode' };
  }

  // Vérifier la date de validité
  const now = new Date();
  if (promo.validFrom && now < promo.validFrom) {
    return { valid: false, discount: 0, error: 'Kortingscode is nog niet geldig' };
  }
  if (promo.validUntil && now > promo.validUntil) {
    return { valid: false, discount: 0, error: 'Kortingscode is verlopen' };
  }

  // Vérifier le montant minimum
  if (promo.minPurchase && cartTotal < promo.minPurchase) {
    return {
      valid: false,
      discount: 0,
      error: `Minimum bestelbedrag: €${promo.minPurchase.toFixed(2)}`, 
    };
  }

  // Vérifier les limites d'utilisation
  if (promo.usageLimit && (promo.usedCount || 0) >= promo.usageLimit) {
    return { valid: false, discount: 0, error: 'Kortingscode is uitgeput' };
  }

  // Calculer la réduction
  let discount = 0;
  if (promo.type === 'percentage') {
    discount = (cartTotal * promo.value) / 100;
    if (promo.maxDiscount) {
      discount = Math.min(discount, promo.maxDiscount);
    }
  } else {
    discount = promo.value;
  }

  // Vérifier que la réduction ne dépasse pas le total
  discount = Math.min(discount, cartTotal);

  return { valid: true, discount };
}











