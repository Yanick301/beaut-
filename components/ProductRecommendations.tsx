'use client';

import { Product } from '@/types';
import ProductCard from './ProductCard';

interface ProductRecommendationsProps {
  title: string;
  products: Product[];
  limit?: number;
}

export default function ProductRecommendations({
  title,
  products,
  limit = 4,
}: ProductRecommendationsProps) {
  if (products.length === 0) return null;

  const displayProducts = products.slice(0, limit);

  return (
    <section className="mt-12 sm:mt-16">
      <h2 className="font-elegant text-2xl sm:text-3xl text-brown-dark mb-6 sm:mb-8">
        {title}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {displayProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}











