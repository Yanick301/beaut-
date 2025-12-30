'use client';

import Link from 'next/link';
import Image from 'next/image';
import { FiStar, FiShoppingCart } from 'react-icons/fi';
import { Product } from '@/types';
import { useCartStore } from '@/lib/store';
import { useToastStore } from '@/lib/toast-store';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore(state => state.addItem);
  const addToast = useToastStore(state => state.addToast);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem(product);
    addToast(`${product.name} a été ajouté au panier`, 'success');
  };

  return (
    <Link href={`/produit/${product.id}`} className="block h-full">
      <div className="card-product group h-full flex flex-col">
        {/* Image */}
        <div className="relative overflow-hidden bg-white aspect-square">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
          {product.isBestSeller && (
            <span className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-rose-soft text-white px-2.5 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-semibold shadow-md">
              Best-seller
            </span>
          )}
          {product.originalPrice && (
            <span className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-gold text-white px-2.5 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-semibold shadow-md">
              -{Math.round((1 - product.price / product.originalPrice) * 100)}%
            </span>
          )}
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5 md:p-6 flex-1 flex flex-col">
          <h3 className="font-elegant text-lg sm:text-xl md:text-2xl text-brown-dark mb-2 group-hover:text-rose-soft transition-colors duration-300 line-clamp-2 min-h-[3.5rem]">
            {product.name}
          </h3>
          <p className="text-brown-soft text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2 flex-shrink-0">
            {product.description}
          </p>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-3 sm:mb-4 flex-shrink-0">
            <div className="flex items-center gap-0.5 sm:gap-1">
              {[...Array(5)].map((_, i) => (
                <FiStar
                  key={i}
                  className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${
                    i < Math.floor(product.rating)
                      ? 'fill-gold text-gold'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs sm:text-sm text-brown-soft">
              ({product.reviewsCount})
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center justify-between mb-4 sm:mb-5 flex-shrink-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xl sm:text-2xl md:text-3xl font-elegant text-brown-dark">
                €{product.price.toFixed(2)}
              </span>
              {product.originalPrice && (
                <span className="text-xs sm:text-sm text-brown-soft line-through">
                  €{product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            className="w-full btn-outline flex items-center justify-center gap-2 mt-auto active:scale-95 touch-manipulation"
          >
            <FiShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-xs sm:text-sm md:text-base">Ajouter au panier</span>
          </button>
        </div>
      </div>
    </Link>
  );
}

