'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { FiStar, FiShoppingCart, FiHeart, FiTruck, FiShield, FiCheck } from 'react-icons/fi';
import { products } from '@/lib/data';
import { useCartStore } from '@/lib/store';
import { useToastStore } from '@/lib/toast-store';
import ProductCard from '@/components/ProductCard';
import FavoriteButton from '@/components/FavoriteButton';
import ReviewForm from '@/components/ReviewForm';
import ProductStructuredData from './ProductStructuredData';
import ProductRecommendations from '@/components/ProductRecommendations';
import { getSimilarProducts, getComplementaryProducts } from '@/lib/recommendations';

export default function ProductPage() {
  const params = useParams();
  const id = params.id as string;
  const product = products.find(p => p.id === id);
  const relatedProducts = product ? getSimilarProducts(product, products, 4) : [];
  const complementaryProducts = product ? getComplementaryProducts(product, products, 3) : [];

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVolume, setSelectedVolume] = useState<string | null>(null);
  const [productReviews, setProductReviews] = useState<any[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const addItem = useCartStore(state => state.addItem);
  const addToast = useToastStore(state => state.addToast);

  // Initialiser le volume sélectionné avec le premier volume disponible ou le prix par défaut
  useEffect(() => {
    if (product?.volumes && product.volumes.length > 0) {
      setSelectedVolume(product.volumes[0].volume);
    }
  }, [product]);

  // Charger les avis depuis l'API
  useEffect(() => {
    async function loadReviews() {
      try {
        const response = await fetch(`/api/reviews?productId=${id}`);
        const data = await response.json();
        setProductReviews(data.reviews || []);
      } catch (error) {
        console.error('Error loading reviews:', error);
      } finally {
        setReviewsLoading(false);
      }
    }
    loadReviews();
  }, [id]);

  if (!product) {
    return (
      <div className="section-padding">
        <div className="container-custom text-center">
          <h1 className="font-elegant text-4xl text-brown-dark mb-4">Product niet gevonden</h1>
          <Link href="/" className="btn-primary">Terug naar homepagina</Link>
        </div>
      </div>
    );
  }

  const images = product.images || [product.image];

  // Calculer le prix actuel en fonction du volume sélectionné
  const getCurrentPrice = () => {
    if (product.volumes && product.volumes.length > 0 && selectedVolume) {
      const volume = product.volumes.find(v => v.volume === selectedVolume);
      return volume ? volume.price : product.price;
    }
    return product.price;
  };

  const handleAddToCart = () => {
    // Créer une copie du produit avec le volume sélectionné
    const productToAdd = {
      ...product,
      price: getCurrentPrice(),
      selectedVolume: selectedVolume || undefined
    };
    
    for (let i = 0; i < quantity; i++) {
      addItem(productToAdd);
    }
    
    const volumeText = selectedVolume ? ` (${selectedVolume})` : '';
    if (quantity === 1) {
      addToast(`${product.name}${volumeText} a été ajouté au panier`, 'success');
    } else {
      addToast(`${quantity}x ${product.name}${volumeText} ont été ajoutés au panier`, 'success');
    }
  };

  return (
    <>
      <ProductStructuredData productId={id} reviews={productReviews} />
      <div className="section-padding bg-beige-light min-h-screen">
        <div className="container-custom">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm text-brown-soft">
          <Link href="/" className="hover:text-brown-dark">Home</Link>
          <span className="mx-2">/</span>
          <Link href={`/categorie/${product.category}`} className="hover:text-brown-dark">
            {product.category}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-brown-dark">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 mb-8 sm:mb-12 md:mb-16">
          {/* Images */}
          <div>
            <div className="relative aspect-square bg-white-cream rounded-xl sm:rounded-2xl overflow-hidden mb-3 sm:mb-4 shadow-lg">
              <Image
                src={images[selectedImage]}
                alt={product.name}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            {images.length > 1 && (
              <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`relative aspect-square rounded-lg overflow-hidden border-2 transition active:scale-95 touch-manipulation ${
                      selectedImage === idx ? 'border-rose-soft shadow-md' : 'border-transparent hover:border-rose-soft/50'
                    }`}
                    aria-label={`Bekijk afbeelding ${idx + 1}`}
                  >
                    <Image
                      src={img}
                      alt={`${product.name} ${idx + 1}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 25vw, (max-width: 1024px) 20vw, 12.5vw"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              {product.isBestSeller && (
                <span className="bg-rose-soft text-white px-3 py-1 rounded-full text-xs font-semibold">
                  Best-seller
                </span>
              )}
              {product.badges?.map((badge) => (
                <span key={badge} className="bg-gold/20 text-brown-dark px-3 py-1 rounded-full text-xs font-semibold">
                  {badge}
                </span>
              ))}
            </div>

            <h1 className="font-elegant text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-brown-dark mb-3 sm:mb-4">
              {product.name}
            </h1>

            <div className="flex flex-wrap items-center gap-2 sm:gap-4 mb-4 sm:mb-6">
              <div className="flex items-center gap-1 sm:gap-2">
                {[...Array(5)].map((_, i) => (
                  <FiStar
                    key={i}
                    className={`w-4 h-4 sm:w-5 sm:h-5 ${
                      i < Math.floor(product.rating) ? 'fill-gold text-gold' : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm sm:text-base text-brown-soft">
                {product.rating}/5 ({product.reviewsCount} avis)
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
              <span className="text-3xl sm:text-4xl md:text-5xl font-elegant text-brown-dark">
                €{getCurrentPrice().toFixed(2)}
              </span>
              {product.originalPrice && (
                <>
                  <span className="text-xl sm:text-2xl md:text-3xl text-brown-soft line-through">
                    €{product.originalPrice.toFixed(2)}
                  </span>
                  <span className="bg-rose-soft text-white px-2.5 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold">
                    -{Math.round((1 - getCurrentPrice() / product.originalPrice) * 100)}%
                  </span>
                </>
              )}
            </div>

            {/* Volume Selector for Senteur corporel */}
            {product.volumes && product.volumes.length > 0 && (
              <div className="mb-6 sm:mb-8">
                <label className="block font-semibold text-brown-dark mb-3 sm:mb-4 text-sm sm:text-base">Volume:</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3">
                  {product.volumes.map((vol) => (
                    <button
                      key={vol.volume}
                      onClick={() => setSelectedVolume(vol.volume)}
                      className={`px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border-2 transition text-center active:scale-95 touch-manipulation ${
                        selectedVolume === vol.volume
                          ? 'border-rose-soft bg-rose-soft/10 text-brown-dark font-semibold shadow-md'
                          : 'border-nude hover:border-rose-soft/50 text-brown-soft'
                      }`}
                    >
                      <div className="font-medium text-sm sm:text-base">{vol.volume}</div>
                      <div className="text-xs sm:text-sm text-brown-soft mt-1">€{vol.price.toFixed(2)}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <p className="text-lg text-brown-soft mb-8 leading-relaxed">
              {product.longDescription || product.description}
            </p>

            {/* Quantity Selector */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
              <label className="font-semibold text-brown-dark text-sm sm:text-base">Hoeveelheid:</label>
              <div className="flex items-center border-2 border-nude rounded-full overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 sm:px-4 py-2 hover:bg-nude transition active:scale-95 touch-manipulation"
                  aria-label="Hoeveelheid verlagen"
                >
                  -
                </button>
                <span className="px-4 sm:px-6 py-2 font-semibold text-sm sm:text-base min-w-[3rem] text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 sm:px-4 py-2 hover:bg-nude transition active:scale-95 touch-manipulation"
                  aria-label="Hoeveelheid verhogen"
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6 sm:mb-8">
              <button onClick={handleAddToCart} className="btn-primary flex-1 flex items-center justify-center gap-2 active:scale-95 touch-manipulation">
                <FiShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-sm sm:text-base">Aan winkelwagen toevoegen</span>
              </button>
              <FavoriteButton productId={product.id} />
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 p-4 sm:p-6 bg-white-cream rounded-xl sm:rounded-2xl">
              <div className="text-center">
                <FiTruck className="w-5 h-5 sm:w-6 sm:h-6 text-rose-soft mx-auto mb-1 sm:mb-2" />
                <p className="text-[10px] sm:text-xs text-brown-soft">Gratis levering</p>
              </div>
              <div className="text-center">
                <FiShield className="w-5 h-5 sm:w-6 sm:h-6 text-rose-soft mx-auto mb-1 sm:mb-2" />
                <p className="text-[10px] sm:text-xs text-brown-soft">Veilige betaling</p>
              </div>
              <div className="text-center">
                <FiCheck className="w-5 h-5 sm:w-6 sm:h-6 text-rose-soft mx-auto mb-1 sm:mb-2" />
                <p className="text-[10px] sm:text-xs text-brown-soft">Gemakkelijke retourzendingen</p>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="bg-white-cream rounded-2xl p-8 mb-16">
          <div className="space-y-6">
            {product.usage && (
              <div>
                <h3 className="font-elegant text-2xl text-brown-dark mb-4">Gebruiksaanwijzing</h3>
                <p className="text-brown-soft leading-relaxed">{product.usage}</p>
              </div>
            )}

            {product.ingredients && (
              <div>
                <h3 className="font-elegant text-2xl text-brown-dark mb-4">Ingrediënten</h3>
                <p className="text-brown-soft leading-relaxed">{product.ingredients}</p>
              </div>
            )}

            {product.skinType && product.skinType.length > 0 && (
              <div>
                <h3 className="font-elegant text-2xl text-brown-dark mb-4">Huidtype</h3>
                <div className="flex flex-wrap gap-2">
                  {product.skinType.map((type) => (
                    <span key={type} className="bg-beige text-brown-dark px-4 py-2 rounded-full text-sm">
                      {type}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Reviews */}
        <div className="mb-16">
          <h2 className="font-elegant text-3xl text-brown-dark mb-8">Klantbeoordelingen</h2>
          
          <ReviewForm 
            productId={id} 
            onReviewSubmitted={async () => {
              // Recharger les avis après soumission
              try {
                setReviewsLoading(true);
                const response = await fetch(`/api/reviews?productId=${id}`);
                const data = await response.json();
                if (response.ok) {
                  setProductReviews(data.reviews || []);
                } else {
                  console.error('Error reloading reviews:', data.error);
                }
              } catch (err) {
                console.error('Error reloading reviews:', err);
              } finally {
                setReviewsLoading(false);
              }
            }}
          />

          {reviewsLoading ? (
            <div className="text-center py-8 text-brown-soft">Beoordelingen laden...</div>
          ) : productReviews.length > 0 ? (
            <div className="mt-8 grid md:grid-cols-2 gap-6">
              {productReviews.map((review) => (
                <div key={review.id} className="bg-white-cream p-6 rounded-2xl">
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-semibold text-brown-dark">
                      {review.profiles?.first_name || 'Utilisateur'} {review.profiles?.last_name || ''}
                    </span>
                    {review.verified && (
                      <span className="text-xs bg-rose-soft/20 text-rose-soft px-2 py-1 rounded">
                        Geverifieerd
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <FiStar
                        key={i}
                        className={`w-4 h-4 ${
                          i < review.rating ? 'fill-gold text-gold' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  {review.comment && (
                    <p className="text-brown-soft italic mb-3">&quot;{review.comment}&quot;</p>
                  )}
                  <p className="text-sm text-brown-soft/60">
                    {new Date(review.created_at).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-8 text-center py-8 text-brown-soft bg-white-cream rounded-2xl">
              Nog geen beoordelingen. Wees de eerste die een beoordeling achterlaat!
            </div>
          )}
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <ProductRecommendations
            title="Vergelijkbare producten"
            products={relatedProducts}
          />
        )}

        {/* Complementary Products (Upsell/Cross-sell) */}
        {complementaryProducts.length > 0 && (
          <ProductRecommendations
            title="Aanvullende producten"
            products={complementaryProducts}
            limit={3}
          />
        )}
      </div>
    </div>
    </>
  );
}

