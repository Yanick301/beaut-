'use client';

import { useState, useEffect } from 'react';
import { FiTag, FiX, FiCopy, FiCheck } from 'react-icons/fi';
import { PROMO_CODES } from '@/lib/promo-codes';

export default function PromoBanner() {
  const [isVisible, setIsVisible] = useState(true);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Ne pas afficher si l'utilisateur a fermé la bannière (stocké dans localStorage)
  useEffect(() => {
    const dismissed = localStorage.getItem('promo-banner-dismissed');
    if (dismissed === 'true') {
      setIsVisible(false);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem('promo-banner-dismissed', 'true');
  };

  const handleCopyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (err) {
      console.error('Erreur lors de la copie:', err);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="relative bg-gradient-to-r from-rose-powder via-rose-soft to-nude border-b border-rose-soft/30 shadow-lg">
      <div className="container-custom py-3 sm:py-4">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-3 sm:gap-4">
          {/* Left side - Icon and title */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden sm:flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-white-cream/90 rounded-full shadow-md">
              <FiTag className="w-5 h-5 sm:w-6 sm:h-6 text-rose-soft" />
            </div>
            <div>
              <h3 className="font-elegant text-base sm:text-lg md:text-xl text-brown-dark font-semibold">
                Codes promo exclusifs
              </h3>
              <p className="text-xs sm:text-sm text-brown-soft/90 hidden sm:block">
                Profitez de nos offres spéciales
              </p>
            </div>
          </div>

          {/* Right side - Promo codes */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 justify-center lg:justify-end">
            {PROMO_CODES.map((promo, index) => (
              <div
                key={promo.code}
                className="group relative bg-white-cream/95 backdrop-blur-sm rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 border border-white/50"
              >
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="flex flex-col">
                    <span className="text-[10px] sm:text-xs text-brown-soft/70 font-medium">
                      {promo.type === 'percentage' ? `${promo.value}% OFF` : `-€${promo.value.toFixed(2)}`}
                    </span>
                    <span className="text-sm sm:text-base md:text-lg font-bold text-brown-dark font-elegant">
                      {promo.code}
                    </span>
                    {promo.minPurchase && promo.minPurchase > 0 && (
                      <span className="text-[9px] sm:text-[10px] text-brown-soft/60 mt-0.5">
                        Min. €{promo.minPurchase}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => handleCopyCode(promo.code)}
                    className="p-1.5 sm:p-2 hover:bg-rose-soft/20 rounded transition-colors duration-200 active:scale-95 touch-manipulation"
                    aria-label={`Copier le code ${promo.code}`}
                    title="Copier le code"
                  >
                    {copiedCode === promo.code ? (
                      <FiCheck className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                    ) : (
                      <FiCopy className="w-4 h-4 sm:w-5 sm:h-5 text-rose-soft" />
                    )}
                  </button>
                </div>
                
                {/* Tooltip on hover */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1.5 bg-brown-dark text-white-cream text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10 shadow-lg">
                  {promo.type === 'percentage' 
                    ? `Réduction de ${promo.value}%${promo.maxDiscount ? ` (max. €${promo.maxDiscount})` : ''}`
                    : `Réduction de €${promo.value.toFixed(2)}`
                  }
                  {promo.minPurchase && promo.minPurchase > 0 && ` • Min. €${promo.minPurchase}`}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-brown-dark"></div>
                </div>
              </div>
            ))}
          </div>

          {/* Close button */}
          <button
            onClick={handleDismiss}
            className="absolute top-2 right-2 sm:relative sm:top-0 sm:right-0 p-1.5 sm:p-2 hover:bg-white-cream/50 rounded-full transition-colors duration-200 active:scale-95 touch-manipulation"
            aria-label="Fermer la bannière"
          >
            <FiX className="w-4 h-4 sm:w-5 sm:h-5 text-brown-dark" />
          </button>
        </div>
      </div>
    </div>
  );
}

