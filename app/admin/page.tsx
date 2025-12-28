'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FiPackage, FiCheckCircle, FiXCircle, FiTruck, FiDollarSign, FiFilter, FiRefreshCw } from 'react-icons/fi';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';

export default function AdminDashboard() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [loadingOrders, setLoadingOrders] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/connexion?redirect=/admin');
        return;
      }
      setAuthenticated(true);
      loadOrders('all');
    }
    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router, supabase]);

  const loadOrders = async (status: string) => {
    setLoadingOrders(true);
    try {
      const url = status === 'all' 
        ? '/api/admin/orders' 
        : `/api/admin/orders?status=${status}`;
      
      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok) {
        if (response.status === 403) {
          alert('Accès refusé. Vous n\'avez pas les droits administrateur.');
          router.push('/');
          return;
        }
        const errorMessage = data.details 
          ? `${data.error}\n\nDétails: ${data.details}\n${data.hint ? `\nIndication: ${data.hint}` : ''}`
          : data.error || 'Erreur lors du chargement';
        throw new Error(errorMessage);
      }

      setOrders(data.orders || []);
      setStats(data.stats || null);
    } catch (error: any) {
      console.error('Error loading orders:', error);
      console.error('Full error:', error);
      const errorMessage = error.message || 'Erreur inconnue';
      alert('Erreur lors du chargement des commandes:\n\n' + errorMessage + '\n\nVérifiez la console pour plus de détails.');
    } finally {
      setLoadingOrders(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authenticated) {
      loadOrders(filterStatus);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterStatus, authenticated]);

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    if (!confirm(`Êtes-vous sûr de vouloir ${newStatus === 'cancelled' ? 'annuler' : 'mettre à jour'} cette commande ?`)) {
      return;
    }

    try {
      const response = await fetch('/api/admin/orders', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderId, status: newStatus }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la mise à jour');
      }

      // Recharger les commandes
      loadOrders(filterStatus);
    } catch (error: any) {
      console.error('Error updating order:', error);
      alert('Erreur lors de la mise à jour: ' + error.message);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; className: string }> = {
      pending: { label: 'En attente', className: 'bg-yellow-100 text-yellow-700' },
      processing: { label: 'En traitement', className: 'bg-blue-100 text-blue-700' },
      shipped: { label: 'Expédiée', className: 'bg-purple-100 text-purple-700' },
      delivered: { label: 'Livrée', className: 'bg-green-100 text-green-700' },
      cancelled: { label: 'Annulée', className: 'bg-red-100 text-red-700' },
    };

    const config = statusConfig[status] || statusConfig.pending;
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${config.className}`}>
        {config.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-beige-light flex items-center justify-center">
        <div className="text-brown-soft">Chargement...</div>
      </div>
    );
  }

  if (!authenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-beige-light">
      {/* Header */}
      <div className="bg-white-cream shadow-sm border-b border-nude">
        <div className="container-custom py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-elegant text-3xl text-brown-dark mb-2">Dashboard Admin</h1>
              <p className="text-brown-soft">Gestion des commandes</p>
            </div>
            <Link href="/" className="btn-outline">
              Retour au site
            </Link>
          </div>
        </div>
      </div>

      <div className="container-custom py-8">
        {/* Statistiques */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
            <div className="bg-white-cream rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <FiPackage className="w-5 h-5 text-brown-soft" />
                <span className="text-2xl font-bold text-brown-dark">{stats.total}</span>
              </div>
              <p className="text-sm text-brown-soft">Total</p>
            </div>
            <div className="bg-white-cream rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <FiRefreshCw className="w-5 h-5 text-yellow-600" />
                <span className="text-2xl font-bold text-yellow-600">{stats.pending}</span>
              </div>
              <p className="text-sm text-brown-soft">En attente</p>
            </div>
            <div className="bg-white-cream rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <FiRefreshCw className="w-5 h-5 text-blue-600" />
                <span className="text-2xl font-bold text-blue-600">{stats.processing}</span>
              </div>
              <p className="text-sm text-brown-soft">En traitement</p>
            </div>
            <div className="bg-white-cream rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <FiTruck className="w-5 h-5 text-purple-600" />
                <span className="text-2xl font-bold text-purple-600">{stats.shipped}</span>
              </div>
              <p className="text-sm text-brown-soft">Expédiées</p>
            </div>
            <div className="bg-white-cream rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <FiCheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-2xl font-bold text-green-600">{stats.delivered}</span>
              </div>
              <p className="text-sm text-brown-soft">Livrées</p>
            </div>
            <div className="bg-white-cream rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <FiXCircle className="w-5 h-5 text-red-600" />
                <span className="text-2xl font-bold text-red-600">{stats.cancelled}</span>
              </div>
              <p className="text-sm text-brown-soft">Annulées</p>
            </div>
            <div className="bg-white-cream rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <FiDollarSign className="w-5 h-5 text-rose-soft" />
                <span className="text-2xl font-bold text-rose-soft">€{stats.totalRevenue.toFixed(2)}</span>
              </div>
              <p className="text-sm text-brown-soft">CA Total</p>
            </div>
          </div>
        )}

        {/* Filtres */}
        <div className="bg-white-cream rounded-xl p-4 shadow-sm mb-6">
          <div className="flex items-center gap-4 flex-wrap">
            <FiFilter className="w-5 h-5 text-brown-soft" />
            <span className="font-medium text-brown-dark">Filtrer par statut :</span>
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-4 py-2 rounded-lg transition ${
                filterStatus === 'all'
                  ? 'bg-rose-soft text-white'
                  : 'bg-beige text-brown-soft hover:bg-nude'
              }`}
            >
              Toutes
            </button>
            <button
              onClick={() => setFilterStatus('pending')}
              className={`px-4 py-2 rounded-lg transition ${
                filterStatus === 'pending'
                  ? 'bg-yellow-600 text-white'
                  : 'bg-beige text-brown-soft hover:bg-nude'
              }`}
            >
              En attente
            </button>
            <button
              onClick={() => setFilterStatus('processing')}
              className={`px-4 py-2 rounded-lg transition ${
                filterStatus === 'processing'
                  ? 'bg-blue-600 text-white'
                  : 'bg-beige text-brown-soft hover:bg-nude'
              }`}
            >
              En traitement
            </button>
            <button
              onClick={() => setFilterStatus('shipped')}
              className={`px-4 py-2 rounded-lg transition ${
                filterStatus === 'shipped'
                  ? 'bg-purple-600 text-white'
                  : 'bg-beige text-brown-soft hover:bg-nude'
              }`}
            >
              Expédiées
            </button>
            <button
              onClick={() => setFilterStatus('delivered')}
              className={`px-4 py-2 rounded-lg transition ${
                filterStatus === 'delivered'
                  ? 'bg-green-600 text-white'
                  : 'bg-beige text-brown-soft hover:bg-nude'
              }`}
            >
              Livrées
            </button>
            <button
              onClick={() => setFilterStatus('cancelled')}
              className={`px-4 py-2 rounded-lg transition ${
                filterStatus === 'cancelled'
                  ? 'bg-red-600 text-white'
                  : 'bg-beige text-brown-soft hover:bg-nude'
              }`}
            >
              Annulées
            </button>
          </div>
        </div>

        {/* Liste des commandes */}
        {loadingOrders ? (
          <div className="text-center py-12 text-brown-soft">Chargement des commandes...</div>
        ) : orders.length === 0 ? (
          <div className="bg-white-cream rounded-xl p-12 text-center shadow-sm">
            <FiPackage className="w-16 h-16 text-nude mx-auto mb-4" />
            <p className="text-brown-soft text-lg">Aucune commande trouvée</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order: any) => (
              <div key={order.id} className="bg-white-cream rounded-xl p-6 shadow-sm">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-2">
                      <h3 className="font-semibold text-lg text-brown-dark">
                        Commande #{order.order_number}
                      </h3>
                      {getStatusBadge(order.status)}
                    </div>
                    <div className="text-sm text-brown-soft space-y-1">
                      <p>
                        Client : {order.user_name || order.user_profile?.first_name + ' ' + order.user_profile?.last_name || 'Client'} 
                        {order.user_email && ` (${order.user_email})`}
                      </p>
                      <p>
                        Date : {new Date(order.created_at).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                      <p>Total : <span className="font-semibold text-brown-dark">€{parseFloat(order.total_amount).toFixed(2)}</span></p>
                      {order.shipping_address && (
                        <p className="mt-2">
                          Adresse : {order.shipping_address.address}, {order.shipping_address.postalCode} {order.shipping_address.city}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Receipt Display */}
                  {order.receipt_url && (
                    <div className="mt-4 p-4 bg-beige rounded-lg">
                      <p className="font-semibold text-brown-dark mb-2">Reçu de virement :</p>
                      <a
                        href={order.receipt_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-rose-soft hover:text-rose-soft/80 underline text-sm"
                      >
                        Voir le reçu
                      </a>
                      {order.receipt_url.match(/\.(jpg|jpeg|png|webp)$/i) && (
                        <div className="mt-3">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={order.receipt_url}
                            alt="Reçu de virement"
                            className="max-w-xs rounded-lg border border-nude"
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex flex-wrap gap-2 mt-4">
                    {order.status === 'processing' && order.receipt_url && (
                      <>
                        <button
                          onClick={async () => {
                            if (!confirm('Confirmer le paiement et passer la commande en traitement ?')) return;
                            try {
                              const response = await fetch(`/api/admin/orders/${order.id}/confirm`, {
                                method: 'POST',
                              });
                              if (!response.ok) throw new Error('Erreur');
                              loadOrders(filterStatus);
                            } catch (error: any) {
                              alert('Erreur : ' + error.message);
                            }
                          }}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm font-medium"
                        >
                          ✓ Confirmer le paiement
                        </button>
                        <button
                          onClick={async () => {
                            const reason = prompt('Raison du rejet (optionnel) :') || 'Reçu de virement non valide';
                            if (!confirm(`Rejeter cette commande ?\nRaison : ${reason}`)) return;
                            try {
                              const response = await fetch(`/api/admin/orders/${order.id}/reject`, {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ reason }),
                              });
                              if (!response.ok) throw new Error('Erreur');
                              loadOrders(filterStatus);
                            } catch (error: any) {
                              alert('Erreur : ' + error.message);
                            }
                          }}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm font-medium"
                        >
                          ✗ Rejeter
                        </button>
                      </>
                    )}
                    {order.status === 'pending' && !order.receipt_url && (
                      <>
                        <button
                          onClick={() => updateOrderStatus(order.id, 'processing')}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
                        >
                          Confirmer
                        </button>
                        <button
                          onClick={() => updateOrderStatus(order.id, 'cancelled')}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm font-medium"
                        >
                          Rejeter
                        </button>
                      </>
                    )}
                    {order.status === 'processing' && !order.receipt_url && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'shipped')}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition text-sm font-medium"
                      >
                        Marquer comme expédiée
                      </button>
                    )}
                    {order.status === 'shipped' && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'delivered')}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm font-medium"
                      >
                        Marquer comme livrée
                      </button>
                    )}
                    {order.status !== 'cancelled' && order.status !== 'delivered' && order.status !== 'processing' && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'cancelled')}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm font-medium"
                      >
                        Annuler
                      </button>
                    )}
                  </div>
                </div>

                {/* Articles de la commande */}
                {order.order_items && order.order_items.length > 0 && (
                  <div className="border-t border-nude pt-4 mt-4">
                    <p className="font-medium text-brown-dark mb-2">Articles :</p>
                    <div className="space-y-2">
                      {order.order_items.map((item: any, index: number) => (
                        <div key={index} className="flex justify-between text-sm text-brown-soft bg-beige rounded-lg p-3">
                          <span>{item.product_name} x {item.quantity}</span>
                          <span className="font-semibold text-brown-dark">
                            €{(parseFloat(item.price) * item.quantity).toFixed(2)}
                          </span>
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
    </div>
  );
}



