'use client';

import { useState, useMemo, useEffect, Suspense } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import ProductCard from '@/components/ProductCard';
import { products, categories } from '@/lib/data';
import { FiFilter, FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import CategoryStructuredData from './CategoryStructuredData';

function CategoryPageContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const slug = params.slug as string;
  const category = categories.find(c => c.slug === slug);
  const categoryProducts = products.filter(p => p.category === slug);
  const subCategoryParam = searchParams.get('subCategory');
  const pageParam = searchParams.get('page');
  
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200]);
  const [selectedBrand, setSelectedBrand] = useState<string>('');
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>(subCategoryParam || '');
  const [sortBy, setSortBy] = useState<string>('popular');
  const [currentPage, setCurrentPage] = useState<number>(parseInt(pageParam || '1', 10));
  
  const productsPerPage = 10;

  // Werk de geselecteerde subcategorie bij wanneer de URL-parameter verandert
  useEffect(() => {
    if (subCategoryParam) {
      setSelectedSubCategory(subCategoryParam);
    }
  }, [subCategoryParam]);

  const brands = useMemo(() => {
    const uniqueBrands = Array.from(new Set(categoryProducts.map(p => p.brand).filter(Boolean)));
    return uniqueBrands;
  }, [categoryProducts]);

  const filteredProducts = useMemo(() => {
    let filtered = [...categoryProducts];

    // Filter by subcategory
    if (selectedSubCategory) {
      filtered = filtered.filter(p => p.subCategory === selectedSubCategory);
    }

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
  }, [categoryProducts, priceRange, selectedBrand, selectedSubCategory, sortBy]);
  
  // Calculate pagination
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + productsPerPage);

  if (!category) {
    return (
      <div className="section-padding">
        <div className="container-custom text-center">
          <h1 className="font-elegant text-4xl text-brown-dark mb-4">Categorie niet gevonden</h1>
          <a href="/" className="btn-primary">Terug naar home</a>
        </div>
      </div>
    );
  }

  return (
    <>
      <CategoryStructuredData slug={slug} />
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

        {/* Subcategory Filter Buttons */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => {
                setSelectedSubCategory('');
                router.push(`?page=1`, { scroll: false });
              }}
              className={`px-4 py-2 rounded-full text-sm sm:text-base transition ${!selectedSubCategory ? 'bg-rose-soft text-white-cream' : 'bg-white-cream text-brown-dark border border-rose-soft hover:bg-rose-soft/10'}`}
            >
              Alle producten
            </button>
            {Array.from(new Set(categoryProducts.map(p => p.subCategory).filter(Boolean))).map((subCategory) => (
              <button
                key={subCategory}
                onClick={() => {
                  setSelectedSubCategory(subCategory || '');
                  router.push(`?subCategory=${encodeURIComponent(subCategory || '')}&page=1`, { scroll: false });
                }}
                className={`px-4 py-2 rounded-full text-sm sm:text-base transition ${selectedSubCategory === subCategory ? 'bg-rose-soft text-white-cream' : 'bg-white-cream text-brown-dark border border-rose-soft hover:bg-rose-soft/10'}`}
              >
                {subCategory}
              </button>
            ))}
          </div>
        </div>

        {/* Filters & Sort Bar */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6 sm:mb-8">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="btn-outline flex items-center gap-2 sm:w-auto w-full justify-center active:scale-95 touch-manipulation"
            aria-label="Toon filters"
          >
            <FiFilter className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-sm sm:text-base">Filters</span>
          </button>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 sm:px-4 py-2.5 sm:py-3 rounded-full border-2 border-rose-soft text-brown-dark bg-white-cream text-sm sm:text-base w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-rose-soft/50"
          >
            <option value="popular">Populairste</option>
            <option value="price-asc">Prijs oplopend</option>
            <option value="price-desc">Prijs aflopend</option>
            <option value="rating">Best beoordeeld</option>
          </select>
          <div className="flex-1 text-left sm:text-right text-brown-soft text-sm sm:text-base flex items-center justify-start sm:justify-end">
            <span className="font-medium">{filteredProducts.length} product{filteredProducts.length > 1 ? 'en' : ''} ({paginatedProducts.length} op pagina {currentPage})</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <aside
            className={`lg:block ${showFilters ? 'block' : 'hidden'} lg:sticky lg:top-24 h-fit bg-white-cream p-4 sm:p-5 md:p-6 rounded-xl sm:rounded-2xl shadow-md max-h-[calc(100vh-200px)] overflow-y-auto`}
          >
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h2 className="font-elegant text-xl sm:text-2xl text-brown-dark">Filters</h2>
              <button
                onClick={() => setShowFilters(false)}
                className="lg:hidden p-2 hover:text-brown-dark transition active:scale-95 touch-manipulation"
                aria-label="Sluit filters"
              >
                <FiX className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>

            {/* Price Filter */}
            <div className="mb-6">
              <h3 className="font-semibold text-brown-dark mb-3">Prijs</h3>
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
                <h3 className="font-semibold text-brown-dark mb-3">Merk</h3>
                <select
                  value={selectedBrand}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-nude bg-white text-brown-dark"
                >
                  <option value="">Alle merken</option>
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
                setSelectedSubCategory('');
              }}
              className="text-sm text-rose-soft hover:text-rose-soft/80 underline"
            >
              Filters resetten
            </button>
          </aside>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {filteredProducts.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
                  {paginatedProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
                
                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex justify-center mt-8 sm:mt-10">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          const newPage = Math.max(1, currentPage - 1);
                          setCurrentPage(newPage);
                          router.push(`?page=${newPage}` + (selectedSubCategory ? `&subCategory=${selectedSubCategory}` : ''), { scroll: true });
                        }}
                        disabled={currentPage === 1}
                        className={`p-2 rounded-full ${currentPage === 1 ? 'text-brown-soft/50 cursor-not-allowed' : 'text-brown-dark hover:bg-rose-soft/10'}`}
                        aria-label="Vorige pagina"
                      >
                        <FiChevronLeft className="w-5 h-5" />
                      </button>
                      
                      <span className="px-3 py-1 text-brown-dark">
                        {currentPage} <span className="text-brown-soft">van</span> {totalPages}
                      </span>
                      
                      <button
                        onClick={() => {
                          const newPage = Math.min(totalPages, currentPage + 1);
                          setCurrentPage(newPage);
                          router.push(`?page=${newPage}` + (selectedSubCategory ? `&subCategory=${selectedSubCategory}` : ''), { scroll: true });
                        }}
                        disabled={currentPage === totalPages}
                        className={`p-2 rounded-full ${currentPage === totalPages ? 'text-brown-soft/50 cursor-not-allowed' : 'text-brown-dark hover:bg-rose-soft/10'}`}
                        aria-label="Volgende pagina"
                      >
                        <FiChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-8 sm:py-12 bg-white-cream rounded-xl sm:rounded-2xl">
                <p className="text-base sm:text-lg text-brown-soft mb-4 sm:mb-6">Geen producten gevonden die aan uw criteria voldoen.</p>
                <button
                  onClick={() => {
                    setPriceRange([0, 200]);
                    setSelectedBrand('');
                    setSelectedSubCategory('');
                  }}
                  className="btn-primary active:scale-95 touch-manipulation"
                >
                  Filters resetten
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

export default function CategoryPage() {
  return (
    <Suspense fallback={
      <div className="section-padding bg-beige-light min-h-screen">
        <div className="container-custom">
          <div className="text-center py-12 text-brown-soft">Laden...</div>
        </div>
      </div>
    }>
      <CategoryPageContent />
    </Suspense>
  );
}

