'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FiShoppingBag, FiMenu, FiX, FiSearch, FiUser, FiLogOut, FiTruck, FiChevronDown } from 'react-icons/fi';
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
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
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
        <div className="bg-gradient-to-r from-rose-powder/30 via-beige/20 to-rose-powder/30 border-b border-rose-soft/20 py-3 hidden md:block">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-0">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 text-sm text-brown-dark/80 font-medium">
                <div className="w-5 h-5 rounded-full bg-rose-soft/20 flex items-center justify-center">
                  <FiTruck className="w-3 h-3 text-rose-soft" />
                </div>
                <span className="font-elegant">Livraison gratuite dès €150</span>
              </div>
            </div>
            <div className="flex items-center gap-6 text-sm">
              <Link 
                href="/compte" 
                className="text-brown-soft hover:text-brown-dark transition-colors duration-200 font-medium tracking-wide"
              >
                Mon compte
              </Link>
              <Link 
                href="/faq" 
                className="text-brown-soft hover:text-brown-dark transition-colors duration-200 font-medium tracking-wide"
              >
                Aide
              </Link>
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
            {categories.slice(0, 6).map((category) => {
              const hasSubCategories = category.subCategories && category.subCategories.length > 0;
              const isExpanded = expandedCategory === category.id;
              
              return (
                <div
                  key={category.id}
                  className="relative"
                  onMouseEnter={() => hasSubCategories && setExpandedCategory(category.id)}
                  onMouseLeave={() => setExpandedCategory(null)}
                >
                  <Link
                    href={`/categorie/${category.slug}`}
                    className="flex items-center gap-1 text-brown-soft hover:text-brown-dark transition font-medium"
                  >
                    {category.name}
                    {hasSubCategories && (
                      <FiChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                    )}
                  </Link>
                  
                  {/* Sous-catégories dropdown */}
                  {hasSubCategories && isExpanded && (
                    <div className="absolute top-full left-0 mt-2 bg-white-cream rounded-lg shadow-lg border border-nude py-2 min-w-[200px] z-50">
                      {category.subCategories!.map((subCat) => (
                        <Link
                          key={subCat}
                          href={`/categorie/${category.slug}?subCategory=${encodeURIComponent(subCat)}`}
                          className="block px-4 py-2 text-brown-soft hover:text-brown-dark hover:bg-beige transition"
                          onClick={() => setExpandedCategory(null)}
                        >
                          {subCat}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
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
              {categories.map((category) => {
                const hasSubCategories = category.subCategories && category.subCategories.length > 0;
                const isExpanded = expandedCategory === category.id;
                
                return (
                  <div key={category.id}>
                    <div className="flex items-center justify-between">
                      <Link
                        href={`/categorie/${category.slug}`}
                        className="text-brown-soft hover:text-brown-dark transition font-medium py-2 flex-1"
                        onClick={() => {
                          if (!hasSubCategories) {
                            setIsMenuOpen(false);
                          }
                        }}
                      >
                        {category.name}
                      </Link>
                      {hasSubCategories && (
                        <button
                          onClick={() => setExpandedCategory(isExpanded ? null : category.id)}
                          className="p-2 text-brown-soft hover:text-brown-dark transition"
                        >
                          <FiChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                        </button>
                      )}
                    </div>
                    {hasSubCategories && isExpanded && (
                      <div className="pl-4 mt-2 space-y-2">
                        {category.subCategories!.map((subCat) => (
                          <Link
                            key={subCat}
                            href={`/categorie/${category.slug}?subCategory=${encodeURIComponent(subCat)}`}
                            className="block text-brown-soft hover:text-brown-dark transition text-sm py-1"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            {subCat}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
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

