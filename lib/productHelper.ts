import { Product } from '@/types';

/**
 * Convertit un nom de produit en nom de fichier image
 */
function productNameToImageName(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '_')
    .replace(/[^a-z0-9_àáâãäåèéêëìíîïòóôõöùúûüýÿç]/gi, '')
    .replace(/_{2,}/g, '_')
    .replace(/^_|_$/g, '') + '.jpg';
}

/**
 * Crée un produit avec le chemin d'image généré automatiquement
 */
export function createProduct(
  id: string,
  name: string,
  description: string,
  price: number,
  category: string,
  options: {
    longDescription?: string;
    originalPrice?: number;
    subCategory?: string;
    brand?: string;
    ingredients?: string;
    usage?: string;
    skinType?: string[];
    rating?: number;
    reviewsCount?: number;
    inStock?: boolean;
    isBestSeller?: boolean;
    isNew?: boolean;
    badges?: string[];
    images?: string[];
  } = {}
): Product {
  const imagePath = `/image-products/${productNameToImageName(name)}`;
  
  return {
    id,
    name,
    description,
    price,
    image: imagePath,
    category,
    brand: options.brand || 'Essence Féminine',
    rating: options.rating || 4.5,
    reviewsCount: options.reviewsCount || 0,
    inStock: options.inStock !== undefined ? options.inStock : true,
    ...options
  };
}

















