'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { FiStar, FiShoppingCart, FiHeart, FiTruck, FiShield, FiCheck } from 'react-icons/fi';
import { products } from '@/lib/data';
import { useCartStore } from '@/lib/store';
import ProductCard from '@/components/ProductCard';
import FavoriteButton from '@/components/FavoriteButton';
import ReviewForm from '@/components/ReviewForm';

export default function ProductPage() {
  const params = useParams();
  const id = params.id as string;
  const product = products.find(p => p.id === id);
  const relatedProducts = products.filter(p => p.category === product?.category && p.id !== product?.id).slice(0, 4);

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [productReviews, setProductReviews] = useState<any[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const addItem = useCartStore(state => state.addItem);

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
          <h1 className="font-elegant text-4xl text-brown-dark mb-4">Produit non trouvé</h1>
          <Link href="/" className="btn-primary">Retour à l'accueil</Link>
        </div>
      </div>
    );
  }

  const images = product.images || [product.image];

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem(product);
    }
  };

  return (
    <div className="section-padding bg-beige-light min-h-screen">
      <div className="container-custom">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm text-brown-soft">
          <Link href="/" className="hover:text-brown-dark">Accueil</Link>
          <span className="mx-2">/</span>
          <Link href={`/categorie/${product.category}`} className="hover:text-brown-dark">
            {product.category}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-brown-dark">{product.name}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Images */}
          <div>
            <div className="relative aspect-square bg-white-cream rounded-2xl overflow-hidden mb-4 shadow-lg">
              <Image
                src={images[selectedImage]}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
            </div>
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`relative aspect-square rounded-lg overflow-hidden border-2 transition ${
                      selectedImage === idx ? 'border-rose-soft' : 'border-transparent'
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${product.name} ${idx + 1}`}
                      fill
                      className="object-cover"
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

            <h1 className="font-elegant text-4xl md:text-5xl text-brown-dark mb-4">
              {product.name}
            </h1>

            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-2">
                {[...Array(5)].map((_, i) => (
                  <FiStar
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(product.rating) ? 'fill-gold text-gold' : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-brown-soft">
                {product.rating}/5 ({product.reviewsCount} avis)
              </span>
            </div>

            <div className="flex items-center gap-4 mb-6">
              <span className="text-4xl font-elegant text-brown-dark">
                €{product.price.toFixed(2)}
              </span>
              {product.originalPrice && (
                <>
                  <span className="text-2xl text-brown-soft line-through">
                    €{product.originalPrice.toFixed(2)}
                  </span>
                  <span className="bg-rose-soft text-white px-3 py-1 rounded-full text-sm font-semibold">
                    -{Math.round((1 - product.price / product.originalPrice) * 100)}%
                  </span>
                </>
              )}
            </div>

            <p className="text-lg text-brown-soft mb-8 leading-relaxed">
              {product.longDescription || product.description}
            </p>

            {/* Quantity Selector */}
            <div className="flex items-center gap-4 mb-8">
              <label className="font-semibold text-brown-dark">Quantité:</label>
              <div className="flex items-center border-2 border-nude rounded-full overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2 hover:bg-nude transition"
                >
                  -
                </button>
                <span className="px-6 py-2 font-semibold">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-2 hover:bg-nude transition"
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <div className="flex gap-4 mb-8">
              <button onClick={handleAddToCart} className="btn-primary flex-1 flex items-center justify-center gap-2">
                <FiShoppingCart className="w-5 h-5" />
                Ajouter au panier
              </button>
              <FavoriteButton productId={product.id} />
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 p-6 bg-white-cream rounded-2xl">
              <div className="text-center">
                <FiTruck className="w-6 h-6 text-rose-soft mx-auto mb-2" />
                <p className="text-xs text-brown-soft">Livraison gratuite</p>
              </div>
              <div className="text-center">
                <FiShield className="w-6 h-6 text-rose-soft mx-auto mb-2" />
                <p className="text-xs text-brown-soft">Paiement sécurisé</p>
              </div>
              <div className="text-center">
                <FiCheck className="w-6 h-6 text-rose-soft mx-auto mb-2" />
                <p className="text-xs text-brown-soft">Retours faciles</p>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="bg-white-cream rounded-2xl p-8 mb-16">
          <div className="space-y-6">
            {product.usage && (
              <div>
                <h3 className="font-elegant text-2xl text-brown-dark mb-4">Mode d'utilisation</h3>
                <p className="text-brown-soft leading-relaxed">{product.usage}</p>
              </div>
            )}

            {product.ingredients && (
              <div>
                <h3 className="font-elegant text-2xl text-brown-dark mb-4">Ingrédients</h3>
                <p className="text-brown-soft leading-relaxed">{product.ingredients}</p>
              </div>
            )}

            {product.skinType && product.skinType.length > 0 && (
              <div>
                <h3 className="font-elegant text-2xl text-brown-dark mb-4">Type de peau</h3>
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
          <h2 className="font-elegant text-3xl text-brown-dark mb-8">Avis clients</h2>
          
          <ReviewForm 
            productId={id} 
            onReviewSubmitted={() => {
              // Recharger les avis après soumission
              fetch(`/api/reviews?productId=${id}`)
                .then(res => res.json())
                .then(data => setProductReviews(data.reviews || []))
                .catch(err => console.error('Error reloading reviews:', err));
            }}
          />

          {reviewsLoading ? (
            <div className="text-center py-8 text-brown-soft">Chargement des avis...</div>
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
                        Vérifié
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
              Aucun avis pour le moment. Soyez le premier à laisser un avis !
            </div>
          )}
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="font-elegant text-3xl text-brown-dark mb-8">Produits similaires</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

