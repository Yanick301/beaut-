export interface ProductVolume {
  volume: string;
  price: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  longDescription?: string;
  price: number;
  originalPrice?: number;
  image: string;
  images?: string[];
  category: string;
  subCategory?: string;
  brand?: string;
  ingredients?: string;
  usage?: string;
  skinType?: string[];
  rating: number;
  reviewsCount: number;
  inStock: boolean;
  isBestSeller?: boolean;
  isNew?: boolean;
  badges?: string[];
  volumes?: ProductVolume[]; // Volumes disponibles pour les parfums
}

export interface CartItem extends Product {
  quantity: number;
  selectedVolume?: string; // Volume sélectionné pour les parfums
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  subCategories?: string[];
}

export interface Review {
  id: string;
  productId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  verified?: boolean;
}

















