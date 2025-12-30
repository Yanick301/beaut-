import type { Metadata } from 'next'
import Image from 'next/image';
import { FiHeart, FiAward, FiZap, FiUsers } from 'react-icons/fi';

export const metadata: Metadata = {
  title: 'À Propos',
  description: 'Découvrez l&apos;histoire d&apos;Essence Féminine, notre passion pour la beauté authentique et notre engagement envers des produits de qualité premium.',
  openGraph: {
    title: 'À Propos de Essence Féminine',
    description: 'Notre histoire et nos valeurs : qualité, naturel, responsabilité et engagement envers nos clientes.',
  },
};

export default function AboutPage() {
  return (
    <div className="section-padding bg-beige-light min-h-screen">
      <div className="container-custom max-w-4xl">
        <h1 className="font-elegant text-3xl sm:text-4xl md:text-5xl text-brown-dark mb-8 text-center">
          À Propos de Essence Féminine
        </h1>

        {/* Hero Image */}
        <div className="relative h-64 sm:h-80 md:h-96 rounded-3xl overflow-hidden mb-12 shadow-xl">
          <Image
            src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=1200"
            alt="Essence Féminine - Notre histoire"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1024px"
            priority
          />
        </div>

        {/* Story */}
        <article className="bg-white-cream rounded-2xl p-6 sm:p-8 md:p-12 mb-12 shadow-md">
          <h2 className="font-elegant text-2xl sm:text-3xl text-brown-dark mb-6">Notre Histoire</h2>
          <div className="space-y-4 text-brown-soft leading-relaxed text-base sm:text-lg">
            <p>
              Essence Féminine est née d&apos;une passion profonde pour la beauté authentique et le bien-être. 
              Fondée en Belgique, notre mission est de démocratiser l'accès à des produits de beauté 
              premium, alliant qualité supérieure, ingrédients naturels et efficacité prouvée. 
              Nous sommes fiers d'être une entreprise belge, engagée envers nos clientes et notre communauté.
            </p>
            <p>
              Nous croyons que chaque femme mérite de se sentir belle, confiante et épanouie. 
              C&apos;est pourquoi nous sélectionnons avec un soin méticuleux chaque produit de notre catalogue, 
              en privilégiant les formulations respectueuses de votre peau et de l'environnement.
            </p>
            <p>
              Notre engagement va au-delà de la simple vente de produits. Nous sommes votre partenaire 
              beauté, vous accompagnant dans votre routine quotidienne pour révéler votre éclat naturel.
            </p>
          </div>
        </article>

        {/* Values */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 mb-12">
          <div className="bg-white-cream rounded-2xl p-6 sm:p-8 shadow-md">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-rose-soft/20 rounded-full flex items-center justify-center mb-4">
              <FiHeart className="w-6 h-6 sm:w-8 sm:h-8 text-rose-soft" />
            </div>
            <h3 className="font-elegant text-xl sm:text-2xl text-brown-dark mb-4">Passion</h3>
            <p className="text-sm sm:text-base text-brown-soft leading-relaxed">
              Nous sommes animés par une passion authentique pour la beauté et le bien-être, 
              qui se reflète dans chaque choix que nous faisons.
            </p>
          </div>

          <div className="bg-white-cream rounded-2xl p-6 sm:p-8 shadow-md">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-rose-soft/20 rounded-full flex items-center justify-center mb-4">
              <FiAward className="w-6 h-6 sm:w-8 sm:h-8 text-rose-soft" />
            </div>
            <h3 className="font-elegant text-xl sm:text-2xl text-brown-dark mb-4">Qualité</h3>
            <p className="text-sm sm:text-base text-brown-soft leading-relaxed">
              Nous n&apos;acceptons que l&apos;excellence. Tous nos produits sont testés et certifiés 
              pour garantir leur efficacité et leur sécurité.
            </p>
          </div>

          <div className="bg-white-cream rounded-2xl p-6 sm:p-8 shadow-md">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-rose-soft/20 rounded-full flex items-center justify-center mb-4">
              <FiZap className="w-6 h-6 sm:w-8 sm:h-8 text-rose-soft" />
            </div>
            <h3 className="font-elegant text-xl sm:text-2xl text-brown-dark mb-4">Responsabilité</h3>
            <p className="text-sm sm:text-base text-brown-soft leading-relaxed">
              Nous nous engageons pour une beauté responsable, en privilégiant des ingrédients 
              naturels et des pratiques respectueuses de l'environnement.
            </p>
          </div>

          <div className="bg-white-cream rounded-2xl p-6 sm:p-8 shadow-md">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-rose-soft/20 rounded-full flex items-center justify-center mb-4">
              <FiUsers className="w-6 h-6 sm:w-8 sm:h-8 text-rose-soft" />
            </div>
            <h3 className="font-elegant text-xl sm:text-2xl text-brown-dark mb-4">Clientes</h3>
            <p className="text-sm sm:text-base text-brown-soft leading-relaxed">
              Vous êtes au cœur de nos préoccupations. Votre satisfaction et votre bien-être 
              guident chacune de nos décisions.
            </p>
          </div>
        </div>

        {/* Mission */}
        <section className="bg-gradient-to-r from-rose-powder to-beige rounded-2xl p-6 sm:p-8 md:p-12 shadow-md">
          <h2 className="font-elegant text-2xl sm:text-3xl text-brown-dark mb-6 text-center">Notre Mission</h2>
          <p className="text-base sm:text-lg text-brown-soft leading-relaxed text-center max-w-3xl mx-auto">
            Offrir à chaque femme les meilleurs produits de beauté pour révéler sa beauté naturelle, 
            renforcer sa confiance et prendre soin d'elle-même avec des formulations premium, 
            sûres et respectueuses de l'environnement.
          </p>
        </section>
      </div>
    </div>
  );
}
