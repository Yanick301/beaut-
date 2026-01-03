import Link from 'next/link';
import { FiMail, FiMapPin } from 'react-icons/fi';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-brown-dark text-white-cream mt-8 sm:mt-10 md:mt-12 lg:mt-16">
      <div className="container-custom py-6 sm:py-8 md:py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8 mb-6 sm:mb-8 md:mb-10">
          {/* About */}
          <div className="sm:col-span-2 lg:col-span-1">
            <h3 className="font-elegant text-lg sm:text-xl md:text-2xl mb-3 sm:mb-4">Her Essence</h3>
            <p className="text-white-cream/80 text-xs sm:text-sm md:text-base leading-relaxed mb-3 sm:mb-4 max-w-sm">
              Uw premium beauty bestemming. Kwaliteitsproducten
              om uw natuurlijke schoonheid te versterken.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base md:text-lg">Navigatie</h4>
            <ul className="space-y-2 sm:space-y-2.5 text-xs sm:text-sm md:text-base text-white-cream/80">
              <li>
                <Link href="/a-propos" className="hover:text-gold transition-colors duration-200 inline-block">Over ons</Link>
              </li>
              <li>
                <Link href="/categorie/soins-visage" className="hover:text-gold transition-colors duration-200 inline-block">Gezichtsverzorging</Link>
              </li>
              <li>
                <Link href="/categorie/maquillage" className="hover:text-gold transition-colors duration-200 inline-block">Make-up</Link>
              </li>
              <li>
                <Link href="/categorie/soins-corps" className="hover:text-gold transition-colors duration-200 inline-block">Lichaamsverzorging</Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-gold transition-colors duration-200 inline-block">Contact</Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base md:text-lg">Klantenservice</h4>
            <ul className="space-y-2 sm:space-y-2.5 text-xs sm:text-sm md:text-base text-white-cream/80">
              <li>
                <Link href="/faq" className="hover:text-gold transition-colors duration-200 inline-block">FAQ</Link>
              </li>
              <li>
                <Link href="/livraison-retours" className="hover:text-gold transition-colors duration-200 inline-block">Verzending & Retour</Link>
              </li>
              <li>
                <Link href="/cgv" className="hover:text-gold transition-colors duration-200 inline-block">Algemene voorwaarden</Link>
              </li>
              <li>
                <Link href="/confidentialite" className="hover:text-gold transition-colors duration-200 inline-block">Privacybeleid</Link>
              </li>
              <li>
                <Link href="/mentions-legales" className="hover:text-gold transition-colors duration-200 inline-block">Juridische informatie</Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base md:text-lg">Contact</h4>
            <ul className="space-y-3 sm:space-y-4 text-sm sm:text-base text-white-cream/80">
              <li className="flex items-start gap-3">
                <FiMapPin className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>Amsterdam, Nederland</span>
              </li>
              <li className="flex items-start gap-3">
                <FiMail className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <a href="mailto:contact@heressence.nl" className="hover:text-gold transition-colors duration-200 break-all">contact@heressence.nl</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white-cream/20 pt-4 sm:pt-6 md:pt-8 mt-4 sm:mt-6 md:mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-3 sm:gap-4 text-xs sm:text-xs md:text-sm lg:text-base text-white-cream/60">
            <p className="text-center md:text-left">&copy; {currentYear} Her Essence. Alle rechten voorbehouden.</p>
            <div className="flex flex-wrap gap-4 sm:gap-6 justify-center md:justify-end">
              <span className="hover:text-white-cream/80 transition">Beveiligde betaling</span>
              <span className="hover:text-white-cream/80 transition">Snelle levering</span>
              <span className="hover:text-white-cream/80 transition">AVG conform</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

