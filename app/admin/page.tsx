'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FiUser, FiPackage, FiDollarSign, FiClock, FiCheckCircle, FiTruck, FiXCircle, FiRefreshCw, FiLogOut, FiAlertCircle, FiCheck } from 'react-icons/fi';
import { createClient } from '@/lib/supabase/client';

interface Order {
  id: string;
  order_number: string;
  status: string;
  total_amount: string;
  created_at: string;
  user_name: string | null;
  user_email: string | null;
  order_items: any[];
}

interface Stats {
  total: number;
  pending: number;
  processing: number;
  shipped: number;
  delivered: number;
  cancelled: number;
  totalRevenue: number;
}

export default function AdminDashboard() {
  const router = useRouter();
  const supabase = createClient();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState<{type: 'success' | 'error' | 'info', message: string} | null>(null);

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error || !user) {
        router.push('/connexion');
        return;
      }

      // Vérifier si l'utilisateur est admin
      const { data: profileData } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', user.id)
        .single();

      const adminEmailsStr = process.env.NEXT_PUBLIC_ADMIN_EMAILS || '';
      const adminEmails = adminEmailsStr
        .split(',')
        .map(email => email.trim().toLowerCase())
        .filter(email => email.length > 0);

      const isAdmin = profileData?.is_admin || (user.email && adminEmails.includes(user.email.toLowerCase()));

      if (!isAdmin) {
        router.push('/');
        return;
      }

      setUser(user);
      fetchOrders();
    } catch (err: any) {
      console.error('Admin access error:', err);
      setError('Erreur lors de la vérification des droits admin');
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      const url = selectedStatus === 'all' 
        ? '/api/admin/orders' 
        : `/api/admin/orders?status=${selectedStatus}`;
        
      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la récupération des commandes');
      }

      setOrders(data.orders || []);
      setStats(data.stats);
    } catch (err: any) {
      console.error('Fetch orders error:', err);
      setError(err.message || 'Erreur lors de la récupération des commandes');
      setNotification({ type: 'error', message: err.message || 'Erreur lors de la récupération des commandes' });
    }
  };

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [selectedStatus]);

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
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
        throw new Error(data.error || 'Erreur lors de la mise à jour de la commande');
      }

      // Mettre à jour la commande dans l'état local
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
      
      // Rafraîchir les stats
      fetchOrders();
      
      // Afficher une notification de succès
      setNotification({ 
        type: 'success', 
        message: `Statut de la commande mise à jour à ${newStatus}` 
      });
    } catch (err: any) {
      console.error('Update order error:', err);
      setError(err.message || 'Erreur lors de la mise à jour de la commande');
      setNotification({ type: 'error', message: err.message || 'Erreur lors de la mise à jour de la commande' });
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  // Effacer la notification après un certain temps
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [notification]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement du dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-md">
          <p>{error}</p>
          <button 
            onClick={() => router.push('/')}
            className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-indigo-100 text-indigo-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const statusOptions = [
    { value: 'all', label: 'Toutes les commandes', icon: FiPackage },
    { value: 'pending', label: 'En attente', icon: FiClock },
    { value: 'processing', label: 'En traitement', icon: FiRefreshCw },
    { value: 'shipped', label: 'Expédiées', icon: FiTruck },
    { value: 'delivered', label: 'Livrées', icon: FiCheckCircle },
    { value: 'cancelled', label: 'Annulées', icon: FiXCircle },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Notification System */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg text-white max-w-sm ${notification.type === 'success' ? 'bg-green-500' : notification.type === 'error' ? 'bg-red-500' : 'bg-blue-500'}`}>
          <div className="flex items-start gap-2">
            {notification.type === 'success' ? (
              <FiCheck className="flex-shrink-0 mt-0.5" />
            ) : (
              <FiAlertCircle className="flex-shrink-0 mt-0.5" />
            )}
            <div>
              <p className="font-medium">{notification.message}</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard Admin</h1>
              <p className="text-gray-600">Gestion des commandes</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
            >
              <FiLogOut />
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 rounded-full">
                  <FiPackage className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Commandes</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.total}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-3 bg-yellow-100 rounded-full">
                  <FiClock className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">En attente</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.pending}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 rounded-full">
                  <FiDollarSign className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Revenus</p>
                  <p className="text-2xl font-semibold text-gray-900">€{stats.totalRevenue.toFixed(2)}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-3 bg-purple-100 rounded-full">
                  <FiUser className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Clients</p>
                  <p className="text-2xl font-semibold text-gray-900">{new Set(orders.map(o => o.user_email)).size}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <div className="flex flex-wrap gap-4 items-center">
            <label className="text-sm font-medium text-gray-700">Filtrer par statut:</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Orders List */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              {selectedStatus === 'all' ? 'Toutes les commandes' : 
               statusOptions.find(opt => opt.value === selectedStatus)?.label}
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              {orders.length} commande{orders.length !== 1 ? 's' : ''} trouvée{orders.length !== 1 ? 's' : ''}
            </p>
          </div>
          <div className="border-t border-gray-200">
            <ul className="divide-y divide-gray-200">
              {orders.map((order) => (
                <li key={order.id}>
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <p className="text-sm font-medium text-rose-600 truncate">
                          #{order.order_number}
                        </p>
                        <div className="ml-2 flex-shrink-0 flex">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
                            {order.status === 'pending' ? 'En attente' :
                             order.status === 'processing' ? 'En traitement' :
                             order.status === 'shipped' ? 'Expédiée' :
                             order.status === 'delivered' ? 'Livrée' :
                             order.status === 'cancelled' ? 'Annulée' : order.status}
                          </span>
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">
                        <p>{new Date(order.created_at).toLocaleDateString('fr-FR')}</p>
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <p className="flex items-center text-sm text-gray-800">
                          <FiUser className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                          {order.user_name || order.user_email || 'Client anonyme'}
                        </p>
                        <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                          <FiDollarSign className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                          €{parseFloat(order.total_amount).toFixed(2)}
                        </p>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                        <p>{order.order_items?.length || 0} article{order.order_items?.length !== 1 ? 's' : ''}</p>
                      </div>
                    </div>
                    
                    {/* Order Items Preview */}
                    {order.order_items && order.order_items.length > 0 && (
                      <div className="mt-3">
                        <p className="text-sm text-gray-600">
                          Produits: {order.order_items.slice(0, 3).map(item => item.product_name).join(', ')}
                          {order.order_items.length > 3 && '...'}
                        </p>
                      </div>
                    )}
                    
                    {/* Status Update Buttons */}
                    <div className="mt-4 flex gap-2">
                      {order.status !== 'pending' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'pending')}
                          className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-gray-700 bg-gray-100 hover:bg-gray-200"
                        >
                          Remettre en attente
                        </button>
                      )}
                      {order.status !== 'processing' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'processing')}
                          className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200"
                        >
                          En traitement
                        </button>
                      )}
                      {order.status !== 'shipped' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'shipped')}
                          className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
                        >
                          Expédiée
                        </button>
                      )}
                      {order.status !== 'delivered' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'delivered')}
                          className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-green-700 bg-green-100 hover:bg-green-200"
                        >
                          Livrée
                        </button>
                      )}
                      {order.status !== 'cancelled' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'cancelled')}
                          className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200"
                        >
                          Annuler
                        </button>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {orders.length === 0 && (
          <div className="text-center py-12">
            <FiPackage className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Aucune commande</h3>
            <p className="mt-1 text-sm text-gray-500">
              {selectedStatus === 'all' 
                ? 'Aucune commande n\'a été passée.' 
                : `Aucune commande avec le statut "${statusOptions.find(opt => opt.value === selectedStatus)?.label}".`}
            </p>
          </div>
        )}
      </main>
    </div>
  );
}