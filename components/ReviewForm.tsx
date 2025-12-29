'use client';

import { useState } from 'react';
import { FiStar } from 'react-icons/fi';
import { createClient } from '@/lib/supabase/client';

interface ReviewFormProps {
  productId: string;
  onReviewSubmitted?: () => void;
}

export default function ReviewForm({ productId, onReviewSubmitted }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      setError('Veuillez sélectionner une note');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setError('Vous devez être connecté pour laisser un avis');
        setLoading(false);
        return;
      }

      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId,
          rating,
          comment: comment.trim() || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de l\'enregistrement de l\'avis');
      }

      setSuccess(true);
      setComment('');
      setRating(0);
      if (onReviewSubmitted) {
        onReviewSubmitted();
      }
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-700">
        <p className="font-semibold">Merci pour votre avis !</p>
        <p className="text-sm">Votre avis a été enregistré avec succès.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white-cream rounded-lg p-6 space-y-4">
      <h3 className="font-elegant text-xl text-brown-dark">Laisser un avis</h3>
      
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">
          {error}
        </div>
      )}

      <div>
        <label className="block text-brown-dark font-medium mb-2">Note *</label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="focus:outline-none"
            >
              <FiStar
                className={`w-6 h-6 transition ${
                  star <= (hoverRating || rating)
                    ? 'fill-rose-soft text-rose-soft'
                    : 'text-nude'
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="comment" className="block text-brown-dark font-medium mb-2">
          Votre avis (optionnel)
        </label>
        <textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
          className="w-full px-4 py-3 rounded-lg border-2 border-nude focus:border-rose-soft outline-none transition resize-none"
          placeholder="Partagez votre expérience avec ce produit..."
        />
      </div>

      <button
        type="submit"
        disabled={loading || rating === 0}
        className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Envoi...' : 'Publier mon avis'}
      </button>
    </form>
  );
}








