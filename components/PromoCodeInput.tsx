'use client';

import { useState } from 'react';
import { FiTag, FiX, FiCheck } from 'react-icons/fi';
import { validatePromoCode } from '@/lib/promo-codes';

interface PromoCodeInputProps {
  cartTotal: number;
  items: Array<{ productId: string; category: string }>;
  onApply: (discount: number, code: string) => void;
  onRemove: () => void;
  appliedCode?: string;
  appliedDiscount?: number;
}

export default function PromoCodeInput({
  cartTotal,
  items,
  onApply,
  onRemove,
  appliedCode,
  appliedDiscount,
}: PromoCodeInputProps) {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleApply = async () => {
    if (!code.trim()) {
      setError('Veuillez entrer un code promo');
      return;
    }

    setLoading(true);
    setError(null);

    // Simuler une validation (dans un vrai projet, ce serait une API call)
    setTimeout(() => {
      const result = validatePromoCode(code, cartTotal, items);
      
      if (result.valid) {
        onApply(result.discount, code.toUpperCase());
        setCode('');
      } else {
        setError(result.error || 'Code promo invalide');
      }
      setLoading(false);
    }, 300);
  };

  if (appliedCode) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FiCheck className="w-5 h-5 text-green-600" />
            <div>
              <p className="text-sm font-semibold text-green-800">
                Code {appliedCode} appliqué
              </p>
              <p className="text-xs text-green-600">
                Réduction de €{appliedDiscount?.toFixed(2)}
              </p>
            </div>
          </div>
          <button
            onClick={onRemove}
            className="p-1 hover:bg-green-100 rounded transition"
            aria-label="Retirer le code promo"
          >
            <FiX className="w-5 h-5 text-green-600" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <label className="block text-sm font-medium text-brown-dark mb-2">
        Code promo
      </label>
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <FiTag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-brown-soft w-5 h-5" />
          <input
            type="text"
            value={code}
            onChange={(e) => {
              setCode(e.target.value.toUpperCase());
              setError(null);
            }}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleApply();
              }
            }}
            placeholder="Entrez votre code promo"
            className="w-full pl-10 pr-4 py-3 rounded-lg border-2 border-nude focus:border-rose-soft outline-none transition"
          />
        </div>
        <button
          onClick={handleApply}
          disabled={loading || !code.trim()}
          className="btn-secondary whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Application...' : 'Appliquer'}
        </button>
      </div>
      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}






