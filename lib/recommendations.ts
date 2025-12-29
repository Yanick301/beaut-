import { Product } from '@/types';

/**
 * Recommande des produits similaires basés sur la catégorie
 */
export function getSimilarProducts(
  product: Product,
  allProducts: Product[],
  limit: number = 4
): Product[] {
  return allProducts
    .filter(p => 
      p.id !== product.id && 
      (p.category === product.category || p.brand === product.brand)
    )
    .slice(0, limit);
}

/**
 * Recommande des produits basés sur l'historique d'achat
 */
export function getRecommendedFromHistory(
  purchasedProductIds: string[],
  allProducts: Product[],
  limit: number = 4
): Product[] {
  if (purchasedProductIds.length === 0) {
    // Si pas d'historique, retourner les best-sellers
    return allProducts
      .filter(p => p.isBestSeller)
      .slice(0, limit);
  }

  // Trouver les catégories et marques des produits achetés
  const purchasedProducts = allProducts.filter(p => 
    purchasedProductIds.includes(p.id)
  );
  
  const categories = new Set(purchasedProducts.map(p => p.category));
  const brands = new Set(purchasedProducts.map(p => p.brand).filter(Boolean));

  // Recommander des produits de catégories/marques similaires
  return allProducts
    .filter(p => 
      !purchasedProductIds.includes(p.id) &&
      (categories.has(p.category) || (p.brand && brands.has(p.brand)))
    )
    .slice(0, limit);
}

/**
 * Recommande des produits complémentaires (upsell/cross-sell)
 */
export function getComplementaryProducts(
  product: Product,
  allProducts: Product[],
  limit: number = 3
): Product[] {
  // Logique basée sur les catégories complémentaires
  const complementaryCategories: Record<string, string[]> = {
    'soins-visage': ['maquillage', 'soins-corps'],
    'maquillage': ['soins-visage', 'cheveux'],
    'soins-corps': ['soins-visage', 'parfums'],
    'cheveux': ['soins-corps', 'accessoires'],
    'parfums': ['maquillage', 'accessoires'],
  };

  const complementary = complementaryCategories[product.category] || [];
  
  return allProducts
    .filter(p => 
      p.id !== product.id &&
      (complementary.includes(p.category) || p.isBestSeller)
    )
    .slice(0, limit);
}


