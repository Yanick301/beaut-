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
    <Link href={`/produit/${product.id}`}>
      <div className="card-product group">
        {/* Image */}
        <div className="relative overflow-hidden bg-white aspect-square">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {product.isBestSeller && (
            <span className="absolute top-3 left-3 bg-rose-soft text-white px-3 py-1 rounded-full text-xs font-semibold">
              Best-seller
            </span>
          )}
          {product.originalPrice && (
            <span className="absolute top-3 right-3 bg-gold text-white px-3 py-1 rounded-full text-xs font-semibold">
              -{Math.round((1 - product.price / product.originalPrice) * 100)}%
            </span>
          )}
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 className="font-elegant text-xl text-brown-dark mb-2 group-hover:text-rose-soft transition">
            {product.name}
          </h3>
          <p className="text-brown-soft text-sm mb-3 line-clamp-2">
            {product.description}
          </p>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <FiStar
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(product.rating)
                      ? 'fill-gold text-gold'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-brown-soft">
              ({product.reviewsCount})
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-elegant text-brown-dark">
                €{product.price.toFixed(2)}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-brown-soft line-through">
                  €{product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            className="w-full btn-outline flex items-center justify-center gap-2"
          >
            <FiShoppingCart className="w-4 h-4" />
            Ajouter au panier
          </button>
        </div>
      </div>
    </Link>
  );
}

