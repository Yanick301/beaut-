'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FiShoppingBag, FiMenu, FiX, FiSearch, FiUser, FiLogOut } from 'react-icons/fi';
import { useCartStore } from '@/lib/store';
import { categories } from '@/lib/data';
import { createClient } from '@/lib/supabase/client';
import SearchModal from './SearchModal';

export default function Header() {
  const router = useRouter();
  const supabase = createClient();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const itemCount = useCartStore(state => state.getItemCount());

  useEffect(() => {
    async function loadUser() {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    }

    loadUser();

    // Écouter les changements d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  return (
    <header className="bg-white-cream shadow-sm sticky top-0 z-50">
      <div className="container-custom">
        {/* Top Bar */}
        <div className="border-b border-nude py-2 hidden md:block">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0 text-xs sm:text-sm text-brown-soft">
            <div className="flex items-center gap-3 sm:gap-6 flex-wrap">
              <span>🇳🇱 Livraison gratuite dès €50</span>
              <span>✓ Paiement sécurisé</span>
            </div>
            <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
              <Link href="/compte" className="hover:text-brown-dark transition">Mon compte</Link>
              <Link href="/faq" className="hover:text-brown-dark transition">Aide</Link>
              {/* Le lien admin sera affiché conditionnellement côté client si nécessaire */}
            </div>
          </div>
        </div>

        {/* Main Header */}
        <div className="flex items-center justify-between py-3 sm:py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-xl sm:text-2xl md:text-3xl font-elegant text-brown-dark">Essence Féminine</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {categories.slice(0, 6).map((category) => (
              <Link
                key={category.id}
                href={`/categorie/${category.slug}`}
                className="text-brown-soft hover:text-brown-dark transition font-medium"
              >
                {category.name}
              </Link>
            ))}
          </nav>

                  {/* Right Side Icons */}
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => setIsSearchOpen(true)}
                      className="p-2 hover:text-brown-dark transition hidden md:block"
                    >
                      <FiSearch className="w-5 h-5" />
                    </button>
            {user ? (
              <div className="hidden md:flex items-center gap-2">
                <Link href="/compte" className="p-2 hover:text-brown-dark transition">
                  <FiUser className="w-5 h-5" />
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2 hover:text-brown-dark transition"
                  title="Déconnexion"
                >
                  <FiLogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <Link href="/connexion" className="p-2 hover:text-brown-dark transition hidden md:block">
                <FiUser className="w-5 h-5" />
              </Link>
            )}
            <Link href="/panier" className="relative p-2 hover:text-brown-dark transition">
              <FiShoppingBag className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute top-0 right-0 bg-rose-soft text-white text-xs 
                               rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {itemCount}
                </span>
              )}
            </Link>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 hover:text-brown-dark transition"
            >
              {isMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-nude py-4">
            <nav className="flex flex-col gap-4">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/categorie/${category.slug}`}
                  className="text-brown-soft hover:text-brown-dark transition font-medium py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {category.name}
                </Link>
              ))}
              {user ? (
                <>
                  <Link
                    href="/compte"
                    className="text-brown-soft hover:text-brown-dark transition font-medium py-2 flex items-center gap-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <FiUser className="w-5 h-5" />
                    Mon compte
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="text-brown-soft hover:text-brown-dark transition font-medium py-2 flex items-center gap-2 w-full text-left"
                  >
                    <FiLogOut className="w-5 h-5" />
                    Déconnexion
                  </button>
                </>
              ) : (
                <Link
                  href="/connexion"
                  className="text-brown-soft hover:text-brown-dark transition font-medium py-2 flex items-center gap-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <FiUser className="w-5 h-5" />
                  Connexion
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>

      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </header>
  );
}

