'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FiUser, FiMail, FiLock, FiPackage, FiHeart, FiLogOut } from 'react-icons/fi';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';

function AccountContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();
  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'favorites'>('profile');
  
  // Vérifier si on doit ouvrir l'onglet commandes depuis l'URL
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'orders') {
      setActiveTab('orders');
    }
  }, [searchParams]);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/connexion');
        return;
      }

      // Vérifier si l'email est confirmé
      if (!user.email_confirmed_at) {
        router.push('/connexion?error=email_not_confirmed');
        return;
      }

      setUser(user);

      // Charger le profil
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      setProfile(profileData);
      setLoading(false);
    }

    loadUser();
  }, [router, supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  if (loading) {
    return (
      <div className="section-padding bg-beige-light min-h-screen flex items-center justify-center">
        <div className="text-brown-soft">Laden...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="section-padding bg-beige-light min-h-screen">
      <div className="container-custom max-w-5xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-elegant text-4xl md:text-5xl text-brown-dark">Mijn account</h1>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-brown-soft hover:text-brown-dark transition"
          >
            <FiLogOut className="w-5 h-5" />
            <span className="hidden sm:inline">Afmelden</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white-cream rounded-2xl p-4 sm:p-6 shadow-md lg:sticky lg:top-24">
              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full text-left px-4 py-3 rounded-lg transition flex items-center gap-3 ${
                    activeTab === 'profile'
                      ? 'bg-rose-soft/20 text-rose-soft font-semibold'
                      : 'text-brown-soft hover:bg-beige'
                  }`}
                >
                  <FiUser className="w-5 h-5" />
                  Mijn profiel
                </button>
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`w-full text-left px-4 py-3 rounded-lg transition flex items-center gap-3 ${
                    activeTab === 'orders'
                      ? 'bg-rose-soft/20 text-rose-soft font-semibold'
                      : 'text-brown-soft hover:bg-beige'
                  }`}
                >
                  <FiPackage className="w-5 h-5" />
                  Mijn bestellingen
                </button>
                <button
                  onClick={() => setActiveTab('favorites')}
                  className={`w-full text-left px-4 py-3 rounded-lg transition flex items-center gap-3 ${
                    activeTab === 'favorites'
                      ? 'bg-rose-soft/20 text-rose-soft font-semibold'
                      : 'text-brown-soft hover:bg-beige'
                  }`}
                >
                  <FiHeart className="w-5 h-5" />
                  Mijn favorieten
                </button>
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            {activeTab === 'profile' && (
              <ProfileTab user={user} profile={profile} supabase={supabase} />
            )}

            {activeTab === 'orders' && (
              <OrdersTab userId={user.id} supabase={supabase} />
            )}

            {activeTab === 'favorites' && (
              <FavoritesTab userId={user.id} supabase={supabase} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProfileTab({ user, profile, supabase }: { user: any; profile: any; supabase: any }) {
  const [firstName, setFirstName] = useState(profile?.first_name || '');
  const [lastName, setLastName] = useState(profile?.last_name || '');
  const [phone, setPhone] = useState(profile?.phone || '');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          first_name: firstName,
          last_name: lastName,
          phone: phone,
        });

      if (error) throw error;

      setMessage('Profiel succesvol bijgewerkt !');
    } catch (error: any) {
      setMessage('Fout bij het bijwerken van het profiel');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white-cream rounded-2xl p-6 sm:p-8 shadow-md">
      <h2 className="font-elegant text-2xl sm:text-3xl text-brown-dark mb-6">Mijn gegevens</h2>
      
      {message && (
        <div className={`mb-6 p-4 rounded-lg text-sm ${
          message.includes('succès') 
            ? 'bg-green-50 border border-green-200 text-green-700' 
            : 'bg-red-50 border border-red-200 text-red-700'
        }`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        <div>
          <label className="block text-brown-dark font-medium mb-2 flex items-center gap-2">
            <FiMail className="w-4 h-4" />
            E-mail
          </label>
          <input
            type="email"
            value={user.email}
            disabled
            className="w-full px-4 py-3 rounded-lg border-2 border-nude bg-gray-50 text-brown-soft cursor-not-allowed"
          />
          <p className="text-sm text-brown-soft mt-2">E-mailadres kan niet worden gewijzigd</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-brown-dark font-medium mb-2">Voornaam</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border-2 border-nude focus:border-rose-soft outline-none transition"
            />
          </div>
          <div>
            <label className="block text-brown-dark font-medium mb-2">Achternaam</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border-2 border-nude focus:border-rose-soft outline-none transition"
            />
          </div>
        </div>

        <div>
          <label className="block text-brown-dark font-medium mb-2">Telefoon</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border-2 border-nude focus:border-rose-soft outline-none transition"
          />
        </div>

        <div>
          <label className="block text-brown-dark font-medium mb-2 flex items-center gap-2">
            <FiLock className="w-4 h-4" />
            Wachtwoord
          </label>
          <Link
            href="/reinitialiser-mot-de-passe"
            className="text-rose-soft hover:text-rose-soft/80 transition text-sm underline"
          >
            Mijn wachtwoord wijzigen
          </Link>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? 'Opslaan...' : 'Wijzigingen opslaan'}
        </button>
      </form>
    </div>
  );
}

function OrdersTab({ userId, supabase }: { userId: string; supabase: any }) {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOrders() {
      const { data } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (*)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      setOrders(data || []);
      setLoading(false);
    }

    loadOrders();
  }, [userId, supabase]);

  if (loading) {
    return (
      <div className="bg-white-cream rounded-2xl p-8 shadow-md">
        <h2 className="font-elegant text-2xl sm:text-3xl text-brown-dark mb-6">Mijn bestellingen</h2>
        <div className="text-center py-12">
          <div className="text-brown-soft">Laden...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white-cream rounded-2xl p-6 sm:p-8 shadow-md">
      <h2 className="font-elegant text-2xl sm:text-3xl text-brown-dark mb-6">Mijn bestellingen</h2>
      {orders.length === 0 ? (
        <div className="text-center py-12">
          <FiPackage className="w-16 h-16 text-nude mx-auto mb-4" />
          <p className="text-brown-soft text-lg mb-6">U heeft nog geen bestellingen</p>
          <Link href="/" className="btn-primary">
            Ontdek onze producten
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="border border-nude rounded-lg p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start mb-4 gap-4">
                <div>
                  <p className="font-semibold text-brown-dark text-lg">Bestelling #{order.order_number}</p>
                  <p className="text-sm text-brown-soft">
                    {new Date(order.created_at).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                    order.status === 'shipped' ? 'bg-blue-100 text-blue-700' :
                    order.status === 'processing' ? 'bg-yellow-100 text-yellow-700' :
                    order.status === 'pending' ? 'bg-orange-100 text-orange-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {order.status === 'delivered' ? 'Geleverd' :
                     order.status === 'shipped' ? 'Verzonden' :
                     order.status === 'processing' ? 'In verwerking' :
                     order.status === 'pending' ? 'In afwachting van verificatie' :
                     'In behandeling'}
                  </span>
                  <p className="text-brown-dark font-semibold text-lg">
                    €{parseFloat(order.total_amount).toFixed(2)}
                  </p>
                </div>
              </div>
              
              {order.order_items && order.order_items.length > 0 && (
                <div className="mt-4 pt-4 border-t border-nude">
                  <p className="text-sm font-medium text-brown-dark mb-3">Artikelen :</p>
                  <div className="space-y-2">
                    {order.order_items.map((item: any, index: number) => (
                      <div key={index} className="flex justify-between text-sm text-brown-soft">
                        <span>{item.product_name} x {item.quantity}</span>
                        <span className="text-brown-dark">€{(parseFloat(item.price) * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function FavoritesTab({ userId, supabase }: { userId: string; supabase: any }) {
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    async function loadFavorites() {
      const { data } = await supabase
        .from('favorites')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      setFavorites(data || []);

      // Charger les produits correspondants
      if (data && data.length > 0) {
        // Importer dynamiquement les produits depuis lib/data
        const { products: allProducts } = await import('@/lib/data');
        const favoriteProducts = allProducts.filter(p => 
          data.some((f: any) => f.product_id === p.id)
        );
        setProducts(favoriteProducts);
      }

      setLoading(false);
    }

    loadFavorites();
  }, [userId, supabase]);

  const handleRemoveFavorite = async (productId: string) => {
    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('user_id', userId)
      .eq('product_id', productId);

    if (!error) {
      setFavorites(favorites.filter(f => f.product_id !== productId));
      setProducts(products.filter(p => p.id !== productId));
    }
  };

  if (loading) {
    return (
      <div className="bg-white-cream rounded-2xl p-8 shadow-md">
        <h2 className="font-elegant text-2xl sm:text-3xl text-brown-dark mb-6">Mijn favorieten</h2>
        <div className="text-center py-12">
          <div className="text-brown-soft">Laden...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white-cream rounded-2xl p-6 sm:p-8 shadow-md">
      <h2 className="font-elegant text-2xl sm:text-3xl text-brown-dark mb-6">Mijn favorieten</h2>
      {favorites.length === 0 ? (
        <div className="text-center py-12">
          <FiHeart className="w-16 h-16 text-nude mx-auto mb-4" />
          <p className="text-brown-soft text-lg mb-6">U heeft nog geen favorieten</p>
          <Link href="/" className="btn-primary">
            Ontdek onze producten
          </Link>
        </div>
      ) : (
        <div>
          <p className="text-brown-soft mb-6">{favorites.length} favoriete(s) product(en)</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div key={product.id} className="relative">
                <ProductCard product={product} />
                <button
                  onClick={() => handleRemoveFavorite(product.id)}
                  className="absolute top-2 right-2 p-2 bg-white-cream rounded-full shadow-md hover:bg-rose-soft hover:text-white transition"
                  aria-label="Verwijderen uit favorieten"
                >
                  <FiHeart className="w-5 h-5 fill-current text-rose-soft" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function AccountPage() {
  return (
    <Suspense fallback={
      <div className="section-padding bg-beige-light min-h-screen flex items-center justify-center">
        <div className="text-brown-soft">Laden...</div>
      </div>
    }>
      <AccountContent />
    </Suspense>
  );
}
