'use client';

import { useState, useEffect } from 'react';
import { FiHeart } from 'react-icons/fi';
import { createClient } from '@/lib/supabase/client';

interface FavoriteButtonProps {
  productId: string;
  className?: string;
}

export default function FavoriteButton({ productId, className = '' }: FavoriteButtonProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function checkFavorite() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setChecking(false);
        return;
      }

      try {
        const response = await fetch(`/api/favorites?productId=${productId}`);
        const data = await response.json();
        setIsFavorite(data.isFavorite || false);
      } catch (error) {
        console.error('Error checking favorite:', error);
      } finally {
        setChecking(false);
      }
    }

    checkFavorite();
  }, [productId, supabase]);

  const handleToggleFavorite = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      // Rediriger vers la page de connexion
      window.location.href = '/connexion?redirect=' + encodeURIComponent(window.location.pathname);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/favorites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId }),
      });

      const data = await response.json();
      if (data.success) {
        setIsFavorite(data.isFavorite);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return null; // Ne rien afficher pendant la vérification
  }

  return (
    <button
      onClick={handleToggleFavorite}
      disabled={loading}
      className={`p-2 rounded-full transition ${
        isFavorite
          ? 'bg-rose-soft text-white hover:bg-rose-soft/80'
          : 'bg-white-cream text-brown-soft hover:bg-rose-soft/20 hover:text-rose-soft border border-nude'
      } ${className} ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
      aria-label={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
    >
      <FiHeart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
    </button>
  );
}







