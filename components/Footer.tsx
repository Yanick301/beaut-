import Link from 'next/link';
import { FiMail, FiMapPin } from 'react-icons/fi';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-brown-dark text-white-cream mt-12 sm:mt-20">
      <div className="container-custom py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-6 sm:mb-8">
          {/* About */}
          <div>
            <h3 className="font-elegant text-xl sm:text-2xl mb-3 sm:mb-4">Essence Féminine</h3>
            <p className="text-white-cream/80 text-sm mb-4">
              Votre destination beauté premium. Des produits de qualité supérieure 
              pour sublimer votre beauté naturelle.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-3 sm:mb-4 text-base sm:text-lg">Navigation</h4>
            <ul className="space-y-2 text-sm text-white-cream/80">
              <li>
                <Link href="/a-propos" className="hover:text-gold transition">À propos</Link>
              </li>
              <li>
                <Link href="/categorie/soins-visage" className="hover:text-gold transition">Soins du visage</Link>
              </li>
              <li>
                <Link href="/categorie/maquillage" className="hover:text-gold transition">Maquillage</Link>
              </li>
              <li>
                <Link href="/categorie/soins-corps" className="hover:text-gold transition">Soins du corps</Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-gold transition">Contact</Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="font-semibold mb-3 sm:mb-4 text-base sm:text-lg">Service Client</h4>
            <ul className="space-y-2 text-sm text-white-cream/80">
              <li>
                <Link href="/faq" className="hover:text-gold transition">FAQ</Link>
              </li>
              <li>
                <Link href="/livraison-retours" className="hover:text-gold transition">Livraison & Retours</Link>
              </li>
              <li>
                <Link href="/cgv" className="hover:text-gold transition">Conditions Générales</Link>
              </li>
              <li>
                <Link href="/confidentialite" className="hover:text-gold transition">Confidentialité</Link>
              </li>
              <li>
                <Link href="/mentions-legales" className="hover:text-gold transition">Mentions Légales</Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold mb-3 sm:mb-4 text-base sm:text-lg">Contact</h4>
            <ul className="space-y-3 text-sm text-white-cream/80">
              <li className="flex items-center gap-2">
                <FiMapPin className="w-4 h-4" />
                <span>Bruxelles, Belgique</span>
              </li>
              <li className="flex items-center gap-2">
                <FiMail className="w-4 h-4" />
                <a href="mailto:contact@essencefeminine.be" className="hover:text-gold transition">contact@essencefeminine.be</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white-cream/20 pt-6 sm:pt-8 mt-6 sm:mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-3 sm:gap-0 text-xs sm:text-sm text-white-cream/60">
            <p className="text-center md:text-left">&copy; {currentYear} Essence Féminine. Tous droits réservés.</p>
            <div className="flex flex-wrap gap-3 sm:gap-6 justify-center md:justify-end">
              <span>Paiement sécurisé</span>
              <span>Livraison rapide</span>
              <span>RGPD conforme</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

