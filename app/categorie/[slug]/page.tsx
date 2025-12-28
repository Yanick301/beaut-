'use client';

import { useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import ProductCard from '@/components/ProductCard';
import { products, categories } from '@/lib/data';
import { FiFilter, FiX } from 'react-icons/fi';

export default function CategoryPage() {
  const params = useParams();
  const slug = params.slug as string;
  const category = categories.find(c => c.slug === slug);
  const categoryProducts = products.filter(p => p.category === slug);

  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200]);
  const [selectedBrand, setSelectedBrand] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('popular');

  const brands = useMemo(() => {
    const uniqueBrands = Array.from(new Set(categoryProducts.map(p => p.brand).filter(Boolean)));
    return uniqueBrands;
  }, [categoryProducts]);

  const filteredProducts = useMemo(() => {
    let filtered = [...categoryProducts];

    // Filter by price
    filtered = filtered.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

    // Filter by brand
    if (selectedBrand) {
      filtered = filtered.filter(p => p.brand === selectedBrand);
    }

    // Sort
    switch (sortBy) {
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'popular':
      default:
        filtered.sort((a, b) => (b.reviewsCount || 0) - (a.reviewsCount || 0));
        break;
    }

    return filtered;
  }, [categoryProducts, priceRange, selectedBrand, sortBy]);

  if (!category) {
    return (
      <div className="section-padding">
        <div className="container-custom text-center">
          <h1 className="font-elegant text-4xl text-brown-dark mb-4">Catégorie non trouvée</h1>
          <a href="/" className="btn-primary">Retour à l'accueil</a>
        </div>
      </div>
    );
  }

  return (
    <div className="section-padding bg-beige-light min-h-screen">
      <div className="container-custom">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-elegant text-4xl md:text-5xl text-brown-dark mb-4">
            {category.name}
          </h1>
          {category.description && (
            <p className="text-lg text-brown-soft max-w-3xl">
              {category.description}
            </p>
          )}
        </div>

        {/* Filters & Sort Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="btn-outline flex items-center gap-2 md:w-auto w-full justify-center"
          >
            <FiFilter className="w-4 h-4" />
            Filtres
          </button>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 rounded-full border-2 border-rose-soft text-brown-dark bg-white-cream"
          >
            <option value="popular">Plus populaires</option>
            <option value="price-asc">Prix croissant</option>
            <option value="price-desc">Prix décroissant</option>
            <option value="rating">Mieux notés</option>
          </select>
          <div className="flex-1 text-right text-brown-soft">
            {filteredProducts.length} produit{filteredProducts.length > 1 ? 's' : ''}
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <aside
            className={`lg:block ${showFilters ? 'block' : 'hidden'} lg:sticky lg:top-24 h-fit bg-white-cream p-6 rounded-2xl shadow-md`}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-elegant text-2xl text-brown-dark">Filtres</h2>
              <button
                onClick={() => setShowFilters(false)}
                className="lg:hidden p-2 hover:text-brown-dark"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            {/* Price Filter */}
            <div className="mb-6">
              <h3 className="font-semibold text-brown-dark mb-3">Prix</h3>
              <div className="space-y-2">
                <input
                  type="range"
                  min="0"
                  max="200"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-brown-soft">
                  <span>€{priceRange[0]}</span>
                  <span>€{priceRange[1]}</span>
                </div>
              </div>
            </div>

            {/* Brand Filter */}
            {brands.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold text-brown-dark mb-3">Marque</h3>
                <select
                  value={selectedBrand}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-nude bg-white text-brown-dark"
                >
                  <option value="">Toutes les marques</option>
                  {brands.map((brand) => (
                    <option key={brand} value={brand}>
                      {brand}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <button
              onClick={() => {
                setPriceRange([0, 200]);
                setSelectedBrand('');
              }}
              className="text-sm text-rose-soft hover:text-rose-soft/80 underline"
            >
              Réinitialiser les filtres
            </button>
          </aside>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {filteredProducts.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white-cream rounded-2xl">
                <p className="text-lg text-brown-soft mb-4">Aucun produit ne correspond à vos critères.</p>
                <button
                  onClick={() => {
                    setPriceRange([0, 200]);
                    setSelectedBrand('');
                  }}
                  className="btn-primary"
                >
                  Réinitialiser les filtres
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

