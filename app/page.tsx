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
        <div className="text-center py-12 text-brown-soft">Beoordelingen laden...</div>
      </div>
    </section>
  ),
});

export const metadata: Metadata = {
  title: 'Home',
  description: 'Her Essence - Uw premium beauty bestemming. Ontdek onze exclusieve selectie van hoogwaardige beautyproducten voor vrouwen. Gezichtsverzorging, make-up, lichaamsgeuren en beautyaccessoires van hoge kwaliteit.',
};

export default function Home() {
  const bestSellers = products.filter(p => p.isBestSeller).slice(0, 4);

  // Breadcrumb structured data
  const breadcrumbData = [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: 'https://heressence.nl',
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
                <h1 className="font-elegant text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl text-brown-dark mb-3 sm:mb-4 md:mb-6 leading-tight">
                  Verheerlijk uw natuurlijke schoonheid
                </h1>
                <p className="text-sm sm:text-base md:text-lg text-brown-soft mb-4 sm:mb-6 max-w-sm sm:max-w-xl mx-auto lg:mx-0 leading-relaxed">
                  Ontdek onze premium selectie van beautyproducten, 
                  ontworpen om uw stralen te onthullen en uw zelfvertrouwen te versterken.
                </p>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 md:gap-4 justify-center lg:justify-start">
                  <Link href="/categorie/soins-visage" className="btn-primary text-center w-full sm:w-auto">
                    Ontdek de collectie
                  </Link>
                  <Link href="/a-propos" className="btn-secondary text-center w-full sm:w-auto">
                    Ons verhaal
                  </Link>
                </div>
              </div>
              <div className="relative h-48 sm:h-64 md:h-80 lg:h-96 xl:h-[500px] rounded-xl sm:rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl order-1 lg:order-2">
                <Image
                  src="https://images.unsplash.com/photo-1612817288484-6f916006741a?w=1200"
                  alt="Natuurlijke schoonheid - Her Essence"
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
                Ons verhaal
              </h2>
                  <p className="text-sm sm:text-base md:text-lg text-brown-soft mb-6 sm:mb-8 leading-relaxed">
                Her Essence is ontstaan uit een passie voor authentieke schoonheid en welzijn. 
                Gevestigd in Nederland, selecteren we zorgvuldig elk product om u een uitzonderlijke 
                verzorgingservaring te bieden, met een combinatie van hoogwaardige kwaliteit, natuurlijke 
                ingrediënten en bewezen effectiviteit. Uw vertrouwen is onze prioriteit.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 md:gap-8 mt-6 sm:mt-8 md:mt-12">
                <div className="text-center sm:text-left">
                  <h3 className="font-elegant text-lg sm:text-xl md:text-2xl text-brown-dark mb-1.5 sm:mb-2 md:mb-3">Kwaliteit</h3>
                  <p className="text-xs sm:text-sm md:text-base text-brown-soft leading-relaxed">Gecertificeerde producten en dermatologisch getest</p>
                </div>
                <div className="text-center sm:text-left">
                  <h3 className="font-elegant text-xl sm:text-2xl md:text-3xl text-brown-dark mb-2 sm:mb-3">Natuurlijk</h3>
                  <p className="text-sm sm:text-base text-brown-soft leading-relaxed">Natuurlijke ingrediënten die rekening houden met uw huid</p>
                </div>
                <div className="text-center sm:text-left">
                  <h3 className="font-elegant text-xl sm:text-2xl md:text-3xl text-brown-dark mb-2 sm:mb-3">Effectiviteit</h3>
                  <p className="text-sm sm:text-base text-brown-soft leading-relaxed">Zichtbare resultaten voor een stralende schoonheid</p>
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
                Onze Categorieën
              </h2>
              <p className="text-base sm:text-lg text-brown-soft max-w-2xl mx-auto">
                Verken ons volledige assortiment beautyproducten
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
                Bestsellers
              </h2>
              <p className="text-base sm:text-lg text-brown-soft max-w-2xl mx-auto">
                De favoriete producten van onze klanten
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
              {bestSellers.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            <div className="text-center mt-6 sm:mt-8 md:mt-12">
              <Link href="/categorie/soins-visage" className="btn-secondary">
                Bekijk alle producten
              </Link>
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="bg-gradient-to-br from-beige to-nude section-padding">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="font-elegant text-3xl sm:text-4xl md:text-5xl text-brown-dark mb-4">
                Waarom kiezen voor ons ?
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
              <div className="text-center bg-white-cream p-6 sm:p-8 md:p-10 rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300">
                <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-rose-soft/20 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-5">
                  <FiTruck className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 lg:w-8 md:h-7 lg:h-8 text-rose-soft" />
                </div>
                <h3 className="font-elegant text-base sm:text-lg md:text-xl lg:text-2xl text-brown-dark mb-1.5 sm:mb-2 md:mb-3">Snelle levering</h3>
                <p className="text-xs sm:text-sm md:text-base text-brown-soft leading-relaxed">Snelle levering in Nederland binnen 1-3 dagen</p>
              </div>
              <div className="text-center bg-white-cream p-4 sm:p-5 md:p-6 lg:p-8 rounded-xl sm:rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300">
                <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 lg:w-20 md:h-16 lg:h-20 bg-rose-soft/20 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <FiCheck className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 lg:w-8 md:h-7 lg:h-8 text-rose-soft" />
                </div>
                <h3 className="font-elegant text-base sm:text-lg md:text-xl lg:text-2xl text-brown-dark mb-1.5 sm:mb-2 md:mb-3">Gecertificeerde producten</h3>
                <p className="text-xs sm:text-sm md:text-base text-brown-soft leading-relaxed">Al onze producten zijn getest en gecertificeerd</p>
              </div>
              <div className="text-center bg-white-cream p-4 sm:p-5 md:p-6 lg:p-8 rounded-xl sm:rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300">
                <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 lg:w-20 md:h-16 lg:h-20 bg-rose-soft/20 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <FiHeadphones className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 lg:w-8 md:h-7 lg:h-8 text-rose-soft" />
                </div>
                <h3 className="font-elegant text-base sm:text-lg md:text-xl lg:text-2xl text-brown-dark mb-1.5 sm:mb-2 md:mb-3">Klantenservice</h3>
                <p className="text-xs sm:text-sm md:text-base text-brown-soft leading-relaxed">Reactieve team beschikbaar om u te begeleiden</p>
              </div>
              <div className="text-center bg-white-cream p-4 sm:p-5 md:p-6 lg:p-8 rounded-xl sm:rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300">
                <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 lg:w-20 md:h-16 lg:h-20 bg-rose-soft/20 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <FiShield className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 lg:w-8 md:h-7 lg:h-8 text-rose-soft" />
                </div>
                <h3 className="font-elegant text-base sm:text-lg md:text-xl lg:text-2xl text-brown-dark mb-1.5 sm:mb-2 md:mb-3">Veilige betalingen</h3>
                <p className="text-xs sm:text-sm md:text-base text-brown-soft leading-relaxed">Beveiligde transacties en veilige gegevens</p>
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
                  Kwaliteit & Ingrediënten
                </h2>
                <p className="text-sm sm:text-base md:text-lg text-brown-soft mb-4 sm:mb-6 leading-relaxed">
                  Wij streven ernaar alleen ingrediënten van de hoogste kwaliteit te gebruiken, 
                  dermatologisch getest en respectvol voor uw huid. Onze producten zijn 
                  cruelty-free en geformuleerd om effectief te zijn terwijl uw welzijn behouden blijft.
                </p>
                <ul className="space-y-2 sm:space-y-3 mb-6">
                  <li className="flex items-center gap-2 sm:gap-3">
                    <FiCheck className="w-4 h-4 sm:w-5 sm:h-5 text-rose-soft flex-shrink-0" />
                    <span className="text-xs sm:text-sm md:text-base text-brown-dark">100% Natuurlijk</span>
                  </li>
                  <li className="flex items-center gap-2 sm:gap-3">
                    <FiCheck className="w-4 h-4 sm:w-5 sm:h-5 text-rose-soft flex-shrink-0" />
                    <span className="text-xs sm:text-sm md:text-base text-brown-dark">Dermatologisch getest</span>
                  </li>
                  <li className="flex items-center gap-2 sm:gap-3">
                    <FiCheck className="w-4 h-4 sm:w-5 sm:h-5 text-rose-soft flex-shrink-0" />
                    <span className="text-xs sm:text-sm md:text-base text-brown-dark">Cruelty-free</span>
                  </li>
                  <li className="flex items-center gap-2 sm:gap-3">
                    <FiCheck className="w-4 h-4 sm:w-5 sm:h-5 text-rose-soft flex-shrink-0" />
                    <span className="text-xs sm:text-sm md:text-base text-brown-dark">Zonder parabenen of sulfaten</span>
                  </li>
                </ul>
                <Link href="/a-propos" className="btn-primary">
                  Meer weten
                </Link>
              </div>
              <div className="relative h-56 sm:h-64 md:h-80 lg:h-96 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=1200"
                  alt="Natuurlijke ingrediënten - Her Essence"
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
              Blijf op de hoogte
            </h2>
            <p className="text-base sm:text-lg text-brown-soft mb-6">
              Ontvang onze nieuwigheden, exclusieve aanbiedingen en beautyadvies rechtstreeks in uw mailbox.
            </p>
            <NewsletterForm />
          </div>
        </section>

        {/* Final CTA */}
        <section className="bg-brown-dark text-white-cream section-padding">
          <div className="container-custom text-center">
            <h2 className="font-elegant text-2xl sm:text-3xl md:text-4xl mb-4 sm:mb-6">
              Klaar om uw schoonheid te onthullen ?
            </h2>
            <p className="text-base sm:text-lg text-white-cream/90 mb-6 max-w-sm sm:max-w-2xl mx-auto">
              Sluit u aan bij duizenden vrouwen die ons vertrouwen voor hun dagelijkse beautyroutine.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Link href="/categorie/soins-visage" className="btn-secondary bg-white-cream text-brown-dark hover:bg-beige">
                Verken de winkel
              </Link>
              <Link href="/contact" className="btn-outline border-white-cream text-white-cream hover:bg-white-cream hover:text-brown-dark">
                Neem contact met ons op
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
