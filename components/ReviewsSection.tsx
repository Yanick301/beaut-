'use client';

import { FiStar } from 'react-icons/fi';
import { Review } from '@/types';

interface ReviewsSectionProps {
  reviews: Review[];
}

export default function ReviewsSection({ reviews }: ReviewsSectionProps) {
  return (
    <section className="bg-white-cream section-padding">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="font-elegant text-3xl sm:text-4xl md:text-5xl text-brown-dark mb-4">
            Ce que disent nos clientes
          </h2>
          <div className="flex items-center justify-center gap-2 mb-4">
            {[...Array(5)].map((_, i) => (
              <FiStar key={i} className="w-5 h-5 sm:w-6 sm:h-6 fill-gold text-gold" />
            ))}
            <span className="text-base sm:text-lg text-brown-soft ml-2">4.8/5 (892 avis)</span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {reviews.map((review) => (
            <div key={review.id} className="bg-beige p-6 rounded-2xl">
              <div className="flex items-center gap-2 mb-4">
                {[...Array(5)].map((_, i) => (
                  <FiStar
                    key={i}
                    className={`w-4 h-4 ${
                      i < review.rating ? 'fill-gold text-gold' : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <p className="text-sm sm:text-base text-brown-dark mb-4 italic">&quot;{review.comment}&quot;</p>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-brown-dark">{review.userName}</span>
                {review.verified && (
                  <span className="text-xs bg-rose-soft/20 text-rose-soft px-2 py-1 rounded">
                    Vérifié
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}









