import type { Metadata } from 'next'
import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { FiCheck, FiTruck, FiShield, FiHeadphones, FiStar } from 'react-icons/fi';
import ProductCard from '@/components/ProductCard';
import CategoryCard from '@/components/CategoryCard';
import NewsletterForm from '@/components/NewsletterForm';
import { products, categories, reviews } from '@/lib/data';
import StructuredData from '@/components/StructuredData';

// Lazy load des sections non critiques
const ReviewsSection = dynamic(() => import('@/components/ReviewsSection'), {
  ssr: false,
  loading: () => (
    <section className="bg-white-cream section-padding">
      <div className="container-custom">
        <div className="text-center py-12 text-brown-soft">Chargement des avis...</div>
      </div>
    </section>
  ),
});

export const metadata: Metadata = {
  title: 'Accueil',
  description: 'Essence Féminine - Votre destination beauté premium. Découvrez notre sélection exclusive de produits de beauté haut de gamme pour femmes. Soins du visage, maquillage, senteurs corporelles et accessoires beauté de qualité.',
  openGraph: {
    title: 'Essence Féminine - Beauté Premium & Cosmétiques de Luxe',
    description: 'Découvrez notre sélection premium de produits de beauté pour révéler votre éclat naturel.',
    images: ['/og-image.jpg'],
  },
};

export default function Home() {
  const bestSellers = products.filter(p => p.isBestSeller).slice(0, 4);

  // Breadcrumb structured data
  const breadcrumbData = [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Accueil',
      item: 'https://essencefeminine.be',
    },
  ];

  return (
    <>
      <StructuredData
        type="BreadcrumbList"
        data={{ itemListElement: breadcrumbData }}
      />
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-rose-powder via-beige to-white-cream section-padding overflow-hidden">
          <div className="container-custom">
            <div className="grid lg:grid-cols-2 gap-8 sm:gap-10 md:gap-12 lg:gap-16 items-center">
              <div className="text-center lg:text-left order-2 lg:order-1">
                <h1 className="font-elegant text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-brown-dark mb-4 sm:mb-6 leading-tight">
                  Sublimez votre beauté naturelle
                </h1>
                <p className="text-base sm:text-lg md:text-xl text-brown-soft mb-6 sm:mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                  Découvrez notre sélection premium de produits de beauté, 
                  conçus pour révéler votre éclat et renforcer votre confiance.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
                  <Link href="/categorie/soins-visage" className="btn-primary text-center w-full sm:w-auto">
                    Découvrir la collection
                  </Link>
                  <Link href="/a-propos" className="btn-secondary text-center w-full sm:w-auto">
                    Notre histoire
                  </Link>
                </div>
              </div>
              <div className="relative h-64 sm:h-80 md:h-96 lg:h-[500px] xl:h-[600px] rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl order-1 lg:order-2">
                <Image
                  src="https://images.unsplash.com/photo-1612817288484-6f916006741a?w=1200"
                  alt="Beauté naturelle - Essence Féminine"
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Brand Story */}
        <section className="bg-white-cream section-padding">
          <div className="container-custom">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="font-elegant text-3xl sm:text-4xl md:text-5xl text-brown-dark mb-6">
                Notre Histoire
              </h2>
                  <p className="text-base sm:text-lg text-brown-soft mb-8 leading-relaxed">
                Essence Féminine est née d'une passion pour la beauté authentique et le bien-être. 
                Basée en Belgique, nous sélectionnons avec soin chaque produit pour vous offrir une expérience 
                de soin exceptionnelle, alliant qualité supérieure, ingrédients naturels 
                et efficacité prouvée. Votre confiance est notre priorité.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 md:gap-10 mt-8 sm:mt-12">
                <div className="text-center sm:text-left">
                  <h3 className="font-elegant text-xl sm:text-2xl md:text-3xl text-brown-dark mb-2 sm:mb-3">Qualité</h3>
                  <p className="text-sm sm:text-base text-brown-soft leading-relaxed">Produits certifiés et testés dermatologiquement</p>
                </div>
                <div className="text-center sm:text-left">
                  <h3 className="font-elegant text-xl sm:text-2xl md:text-3xl text-brown-dark mb-2 sm:mb-3">Naturel</h3>
                  <p className="text-sm sm:text-base text-brown-soft leading-relaxed">Ingrédients naturels et respectueux de votre peau</p>
                </div>
                <div className="text-center sm:text-left">
                  <h3 className="font-elegant text-xl sm:text-2xl md:text-3xl text-brown-dark mb-2 sm:mb-3">Efficacité</h3>
                  <p className="text-sm sm:text-base text-brown-soft leading-relaxed">Résultats visibles pour une beauté radieuse</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="bg-beige section-padding">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="font-elegant text-3xl sm:text-4xl md:text-5xl text-brown-dark mb-4">
                Nos Catégories
              </h2>
              <p className="text-base sm:text-lg text-brown-soft max-w-2xl mx-auto">
                Explorez notre gamme complète de produits de beauté
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {categories.map((category) => (
                <CategoryCard key={category.id} category={category} />
              ))}
            </div>
          </div>
        </section>

        {/* Best Sellers */}
        <section className="bg-white-cream section-padding">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="font-elegant text-3xl sm:text-4xl md:text-5xl text-brown-dark mb-4">
                Best-sellers
              </h2>
              <p className="text-base sm:text-lg text-brown-soft max-w-2xl mx-auto">
                Les produits préférés de nos clientes
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {bestSellers.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            <div className="text-center mt-8 sm:mt-12">
              <Link href="/categorie/soins-visage" className="btn-secondary">
                Voir tous les produits
              </Link>
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="bg-gradient-to-br from-beige to-nude section-padding">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="font-elegant text-3xl sm:text-4xl md:text-5xl text-brown-dark mb-4">
                Pourquoi nous choisir ?
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
              <div className="text-center bg-white-cream p-6 sm:p-8 md:p-10 rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300">
                <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-rose-soft/20 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-5">
                  <FiTruck className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 text-rose-soft" />
                </div>
                <h3 className="font-elegant text-lg sm:text-xl md:text-2xl text-brown-dark mb-2 sm:mb-3">Livraison rapide</h3>
                <p className="text-sm sm:text-base text-brown-soft leading-relaxed">Livraison express en Belgique sous 1-3 jours</p>
              </div>
              <div className="text-center bg-white-cream p-6 sm:p-8 md:p-10 rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300">
                <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-rose-soft/20 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-5">
                  <FiCheck className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 text-rose-soft" />
                </div>
                <h3 className="font-elegant text-lg sm:text-xl md:text-2xl text-brown-dark mb-2 sm:mb-3">Produits certifiés</h3>
                <p className="text-sm sm:text-base text-brown-soft leading-relaxed">Tous nos produits sont testés et certifiés</p>
              </div>
              <div className="text-center bg-white-cream p-6 sm:p-8 md:p-10 rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300">
                <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-rose-soft/20 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-5">
                  <FiHeadphones className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 text-rose-soft" />
                </div>
                <h3 className="font-elegant text-lg sm:text-xl md:text-2xl text-brown-dark mb-2 sm:mb-3">Service client</h3>
                <p className="text-sm sm:text-base text-brown-soft leading-relaxed">Équipe réactive disponible pour vous accompagner</p>
              </div>
              <div className="text-center bg-white-cream p-6 sm:p-8 md:p-10 rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300">
                <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-rose-soft/20 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-5">
                  <FiShield className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 text-rose-soft" />
                </div>
                <h3 className="font-elegant text-lg sm:text-xl md:text-2xl text-brown-dark mb-2 sm:mb-3">Paiements sécurisés</h3>
                <p className="text-sm sm:text-base text-brown-soft leading-relaxed">Transactions protégées et données sécurisées</p>
              </div>
            </div>
          </div>
        </section>

        {/* Social Proof - Reviews (Lazy loaded) */}
        <ReviewsSection reviews={reviews} />

        {/* Ingredients / Quality */}
        <section className="bg-gradient-to-r from-rose-powder to-beige section-padding">
          <div className="container-custom">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
              <div>
                <h2 className="font-elegant text-3xl sm:text-4xl md:text-5xl text-brown-dark mb-6">
                  Qualité & Ingrédients
                </h2>
                <p className="text-base sm:text-lg text-brown-soft mb-6 leading-relaxed">
                  Nous nous engageons à n'utiliser que des ingrédients de la plus haute qualité, 
                  testés dermatologiquement et respectueux de votre peau. Nos produits sont 
                  cruelty-free et formulés pour être efficaces tout en préservant votre bien-être.
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-3">
                    <FiCheck className="w-5 h-5 text-rose-soft flex-shrink-0" />
                    <span className="text-sm sm:text-base text-brown-dark">100% Naturels</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <FiCheck className="w-5 h-5 text-rose-soft flex-shrink-0" />
                    <span className="text-sm sm:text-base text-brown-dark">Testés dermatologiquement</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <FiCheck className="w-5 h-5 text-rose-soft flex-shrink-0" />
                    <span className="text-sm sm:text-base text-brown-dark">Cruelty-free</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <FiCheck className="w-5 h-5 text-rose-soft flex-shrink-0" />
                    <span className="text-sm sm:text-base text-brown-dark">Sans parabènes ni sulfates</span>
                  </li>
                </ul>
                <Link href="/a-propos" className="btn-primary">
                  En savoir plus
                </Link>
              </div>
              <div className="relative h-64 sm:h-80 md:h-96 rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=1200"
                  alt="Ingrédients naturels - Essence Féminine"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="bg-gradient-to-r from-rose-powder via-rose-soft to-nude section-padding">
          <div className="container-custom max-w-3xl mx-auto text-center">
            <h2 className="font-elegant text-3xl sm:text-4xl md:text-5xl text-brown-dark mb-4">
              Restez informée
            </h2>
            <p className="text-lg text-brown-soft mb-8">
              Recevez nos nouveautés, offres exclusives et conseils beauté directement dans votre boîte mail.
            </p>
            <NewsletterForm />
          </div>
        </section>

        {/* Final CTA */}
        <section className="bg-brown-dark text-white-cream section-padding">
          <div className="container-custom text-center">
            <h2 className="font-elegant text-3xl sm:text-4xl md:text-5xl mb-6">
              Prête à révéler votre beauté ?
            </h2>
            <p className="text-lg sm:text-xl text-white-cream/90 mb-8 max-w-2xl mx-auto">
              Rejoignez des milliers de femmes qui nous font confiance pour leur routine beauté quotidienne.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/categorie/soins-visage" className="btn-secondary bg-white-cream text-brown-dark hover:bg-beige">
                Explorer la boutique
              </Link>
              <Link href="/contact" className="btn-outline border-white-cream text-white-cream hover:bg-white-cream hover:text-brown-dark">
                Nous contacter
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
