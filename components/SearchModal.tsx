'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { FiSearch, FiX } from 'react-icons/fi';
import { products } from '@/lib/data';
import Image from 'next/image';
import Link from 'next/link';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      const query = searchQuery.toLowerCase();
      const filtered = products.filter(product =>
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.brand?.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query)
      ).slice(0, 8);
      setResults(filtered);
    } else {
      setResults([]);
    }
  }, [searchQuery]);

  const handleProductClick = (productId: string) => {
    router.push(`/produit/${productId}`);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-start justify-center pt-20 px-4">
      <div className="bg-white-cream rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-4 p-4 border-b border-nude">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-brown-soft w-5 h-5" />
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher un produit..."
              className="w-full pl-12 pr-4 py-3 rounded-lg border-2 border-nude focus:border-rose-soft outline-none"
            />
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-beige rounded-lg transition"
          >
            <FiX className="w-6 h-6 text-brown-dark" />
          </button>
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto p-4">
          {searchQuery.trim().length === 0 ? (
            <div className="text-center py-12 text-brown-soft">
              <FiSearch className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Commencez à taper pour rechercher...</p>
            </div>
          ) : results.length === 0 ? (
            <div className="text-center py-12 text-brown-soft">
              <p>Aucun résultat trouvé pour "{searchQuery}"</p>
            </div>
          ) : (
            <div className="space-y-2">
              {results.map((product) => (
                <button
                  key={product.id}
                  onClick={() => handleProductClick(product.id)}
                  className="w-full flex items-center gap-4 p-3 hover:bg-beige rounded-lg transition text-left"
                >
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-white-cream flex-shrink-0">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-brown-dark truncate">{product.name}</p>
                    <p className="text-sm text-brown-soft truncate">{product.brand}</p>
                    <p className="text-rose-soft font-semibold">€{product.price.toFixed(2)}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}




