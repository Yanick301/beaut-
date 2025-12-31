import Link from 'next/link';
import { FiMail, FiMapPin } from 'react-icons/fi';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-brown-dark text-white-cream mt-12 sm:mt-16 md:mt-20">
      <div className="container-custom py-8 sm:py-10 md:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 md:gap-12 mb-8 sm:mb-10 md:mb-12">
          {/* About */}
          <div className="sm:col-span-2 lg:col-span-1">
            <h3 className="font-elegant text-xl sm:text-2xl md:text-3xl mb-4 sm:mb-5">Her Essence</h3>
            <p className="text-white-cream/80 text-sm sm:text-base leading-relaxed mb-4 max-w-sm">
              Uw premium beauty bestemming. Kwaliteitsproducten 
              om uw natuurlijke schoonheid te versterken.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4 sm:mb-5 text-base sm:text-lg md:text-xl">Navigation</h4>
            <ul className="space-y-2.5 sm:space-y-3 text-sm sm:text-base text-white-cream/80">
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
            <h4 className="font-semibold mb-4 sm:mb-5 text-base sm:text-lg md:text-xl">Klantenservice</h4>
            <ul className="space-y-2.5 sm:space-y-3 text-sm sm:text-base text-white-cream/80">
              <li>
                <Link href="/faq" className="hover:text-gold transition-colors duration-200 inline-block">FAQ</Link>
              </li>
              <li>
                <Link href="/verzending-retour" className="hover:text-gold transition-colors duration-200 inline-block">Verzending & Retour</Link>
              </li>
              <li>
                <Link href="/algemene-voorwaarden" className="hover:text-gold transition-colors duration-200 inline-block">Algemene voorwaarden</Link>
              </li>
              <li>
                <Link href="/privacybeleid" className="hover:text-gold transition-colors duration-200 inline-block">Privacybeleid</Link>
              </li>
              <li>
                <Link href="/juridische-informatie" className="hover:text-gold transition-colors duration-200 inline-block">Juridische informatie</Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold mb-4 sm:mb-5 text-base sm:text-lg md:text-xl">Contact</h4>
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
        <div className="border-t border-white-cream/20 pt-6 sm:pt-8 md:pt-10 mt-6 sm:mt-8 md:mt-10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 sm:gap-6 text-xs sm:text-sm md:text-base text-white-cream/60">
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

