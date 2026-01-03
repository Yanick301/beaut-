import type { Metadata } from 'next'
import Image from 'next/image';
import { FiHeart, FiAward, FiZap, FiUsers } from 'react-icons/fi';

export const metadata: Metadata = {
  title: 'Over ons',
  description: 'Ontdek het verhaal van Her Essence, onze passie voor authentieke schoonheid en ons engagement voor kwaliteitsproducten.',
};

export default function AboutPage() {
  return (
    <div className="section-padding bg-beige-light min-h-screen">
      <div className="container-custom max-w-4xl">
        <h1 className="font-elegant text-3xl sm:text-4xl md:text-5xl text-brown-dark mb-8 text-center">
          Over Her Essence
        </h1>

        {/* Hero Image */}
        <div className="relative h-64 sm:h-80 md:h-96 rounded-3xl overflow-hidden mb-12 shadow-xl">
          <Image
            src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=1200"
            alt="Her Essence - Ons verhaal"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1024px"
            priority
          />
        </div>

        {/* Story */}
        <article className="bg-white-cream rounded-2xl p-6 sm:p-8 md:p-12 mb-12 shadow-md">
          <h2 className="font-elegant text-2xl sm:text-3xl text-brown-dark mb-6">Ons verhaal</h2>
          <div className="space-y-4 text-brown-soft leading-relaxed text-base sm:text-lg">
            <p>
              Her Essence is ontstaan uit een diepe passie voor authentieke schoonheid en welzijn. 
              Opgericht in Nederland, is onze missie het democratiseren van de toegang tot premium 
              schoonheidsproducten die kwaliteit, natuurlijke ingrediënten en bewezen effectiviteit combineren. 
              We zijn trots op een Nederlands bedrijf te zijn dat zich inzet voor onze klanten en gemeenschap.
            </p>
            <p>
              We geloven dat elke vrouw zich mooi, zelfverzekerd en volledig moet voelen. 
              Daarom selecteren we met zorg elk product in onze catalogus, 
              met voorkeur voor formuleringen die respectvol zijn voor uw huid en het milieu.
            </p>
            <p>
              Ons engagement gaat verder dan alleen het verkopen van producten. We zijn uw 
              schoonheidspartner, die u ondersteunt in uw dagelijkse routine om uw natuurlijke glans te onthullen.
            </p>
          </div>
        </article>

        {/* Values */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 mb-12">
          <div className="bg-white-cream rounded-2xl p-6 sm:p-8 shadow-md">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-rose-soft/20 rounded-full flex items-center justify-center mb-4">
              <FiHeart className="w-6 h-6 sm:w-8 sm:h-8 text-rose-soft" />
            </div>
            <h3 className="font-elegant text-xl sm:text-2xl text-brown-dark mb-4">Passie</h3>
            <p className="text-sm sm:text-base text-brown-soft leading-relaxed">
              We worden gedreven door een authentieke passie voor schoonheid en welzijn, 
              die zich weerspiegelt in elk keuze dat we maken.
            </p>
          </div>

          <div className="bg-white-cream rounded-2xl p-6 sm:p-8 shadow-md">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-rose-soft/20 rounded-full flex items-center justify-center mb-4">
              <FiAward className="w-6 h-6 sm:w-8 sm:h-8 text-rose-soft" />
            </div>
            <h3 className="font-elegant text-xl sm:text-2xl text-brown-dark mb-4">Kwaliteit</h3>
            <p className="text-sm sm:text-base text-brown-soft leading-relaxed">
              We accepteren alleen uitstekendheid. Al onze producten worden getest en gecertificeerd 
              om hun effectiviteit en veiligheid te garanderen.
            </p>
          </div>

          <div className="bg-white-cream rounded-2xl p-6 sm:p-8 shadow-md">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-rose-soft/20 rounded-full flex items-center justify-center mb-4">
              <FiZap className="w-6 h-6 sm:w-8 sm:h-8 text-rose-soft" />
            </div>
            <h3 className="font-elegant text-xl sm:text-2xl text-brown-dark mb-4">Verantwoordelijkheid</h3>
            <p className="text-sm sm:text-base text-brown-soft leading-relaxed">
              We zetten ons in voor verantwoorde schoonheid, met nadruk op natuurlijke ingrediënten 
              en milieuvriendelijke praktijken.
            </p>
          </div>

          <div className="bg-white-cream rounded-2xl p-6 sm:p-8 shadow-md">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-rose-soft/20 rounded-full flex items-center justify-center mb-4">
              <FiUsers className="w-6 h-6 sm:w-8 sm:h-8 text-rose-soft" />
            </div>
            <h3 className="font-elegant text-xl sm:text-2xl text-brown-dark mb-4">Klanten</h3>
            <p className="text-sm sm:text-base text-brown-soft leading-relaxed">
              U staat centraal in onze aandacht. Uw tevredenheid en welzijn 
              vormen de basis van al onze beslissingen.
            </p>
          </div>
        </div>

        {/* Mission */}
        <section className="bg-gradient-to-r from-rose-powder to-beige rounded-2xl p-6 sm:p-8 md:p-12 shadow-md">
          <h2 className="font-elegant text-2xl sm:text-3xl text-brown-dark mb-6 text-center">Onze Missie</h2>
          <p className="text-base sm:text-lg text-brown-soft leading-relaxed text-center max-w-3xl mx-auto">
            Bied elke vrouw de beste schoonheidsproducten om haar natuurlijke schoonheid te onthullen, 
            haar zelfvertrouwen te versterken en goed voor zichzelf te zorgen met premium formuleringen 
            die veilig en milieuvriendelijk zijn.
          </p>
        </section>
      </div>
    </div>
  );
}
