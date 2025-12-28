import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

/**
 * Vérifie si l'utilisateur est admin
 */
async function isAdmin(userId: string, userEmail?: string): Promise<boolean> {
  // Liste des emails admin autorisés depuis la variable d'environnement
  const adminEmailsStr = process.env.ADMIN_EMAILS || '';
  const adminEmails = adminEmailsStr
    .split(',')
    .map(email => email.trim().toLowerCase())
    .filter(email => email.length > 0);
  
  // Vérifier si l'email est dans la liste admin
  if (userEmail && adminEmails.includes(userEmail.toLowerCase())) {
    return true;
  }
  
  // Vérifier si l'utilisateur a un rôle admin dans le profil
  const supabase = await createClient();
  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', userId)
    .single();
  
  return profile?.is_admin === true;
}

/**
 * GET - Récupère toutes les commandes pour l'admin
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    // Vérifier les droits admin
    const userIsAdmin = await isAdmin(user.id, user.email);
    if (!userIsAdmin) {
      return NextResponse.json(
        { error: 'Accès refusé. Droits administrateur requis.' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    // Construire la requête pour récupérer les commandes
    let query = supabase
      .from('orders')
      .select(`
        *,
        order_items (*)
      `)
      .order('created_at', { ascending: false });

    // Filtrer par statut si fourni
    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    const { data: orders, error: ordersError } = await query;

    if (ordersError) {
      console.error('Error fetching orders:', ordersError);
      console.error('Error details:', JSON.stringify(ordersError, null, 2));
      return NextResponse.json(
        { 
          error: 'Erreur lors de la récupération des commandes',
          details: ordersError.message,
          hint: ordersError.code === 'PGRST301' 
            ? 'Vérifiez que les politiques RLS permettent aux admins de voir toutes les commandes. Exécutez le script admin_rls_policies.sql dans Supabase.'
            : ordersError.message
        },
        { status: 500 }
      );
    }

    // Récupérer les profils des utilisateurs séparément
    const userIds = orders?.map((order: any) => order.user_id) || [];
    let profilesMap: Record<string, any> = {};
    
    if (userIds.length > 0) {
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, first_name, last_name')
        .in('id', userIds);

      if (!profilesError && profiles) {
        // Créer un map pour accès rapide
        profilesMap = profiles.reduce((acc: Record<string, any>, profile: any) => {
          acc[profile.id] = profile;
          return acc;
        }, {});
      }

      // Récupérer les emails depuis auth.users (nécessite service role key ou une fonction)
      // Pour l'instant, on utilisera les données du profil uniquement
    }

    // Enrichir les commandes avec les informations du profil
    const enrichedOrders = orders?.map((order: any) => {
      const profile = profilesMap[order.user_id];
      return {
        ...order,
        user_profile: profile || null,
        // Extraire l'email depuis shipping_address si disponible
        user_email: order.shipping_address?.email || null,
        user_name: profile 
          ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim()
          : order.shipping_address?.firstName && order.shipping_address?.lastName
          ? `${order.shipping_address.firstName} ${order.shipping_address.lastName}`.trim()
          : null
      };
    }) || [];

    if (ordersError) {
      console.error('Error fetching orders:', ordersError);
      console.error('Error details:', JSON.stringify(ordersError, null, 2));
      return NextResponse.json(
        { 
          error: 'Erreur lors de la récupération des commandes',
          details: ordersError.message,
          hint: ordersError.code === 'PGRST301' 
            ? 'Vérifiez que les politiques RLS permettent aux admins de voir toutes les commandes. Exécutez le script admin_rls_policies.sql dans Supabase.'
            : ordersError.message
        },
        { status: 500 }
      );
    }

    // Calculer les statistiques
    const stats = {
      total: enrichedOrders?.length || 0,
      pending: enrichedOrders?.filter((o: any) => o.status === 'pending').length || 0,
      processing: enrichedOrders?.filter((o: any) => o.status === 'processing').length || 0,
      shipped: enrichedOrders?.filter((o: any) => o.status === 'shipped').length || 0,
      delivered: enrichedOrders?.filter((o: any) => o.status === 'delivered').length || 0,
      cancelled: enrichedOrders?.filter((o: any) => o.status === 'cancelled').length || 0,
      totalRevenue: enrichedOrders?.reduce((sum: number, o: any) => sum + parseFloat(o.total_amount || 0), 0) || 0,
    };

    return NextResponse.json({ 
      orders: enrichedOrders || [],
      stats 
    });
  } catch (error: any) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Une erreur inattendue est survenue' },
      { status: 500 }
    );
  }
}

/**
 * PATCH - Met à jour le statut d'une commande
 */
export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    // Vérifier les droits admin
    const userIsAdmin = await isAdmin(user.id, user.email);
    if (!userIsAdmin) {
      return NextResponse.json(
        { error: 'Accès refusé. Droits administrateur requis.' },
        { status: 403 }
      );
    }

    const { orderId, status } = await request.json();

    if (!orderId || !status) {
      return NextResponse.json(
        { error: 'orderId et status requis' },
        { status: 400 }
      );
    }

    // Valider le statut
    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Statut invalide' },
        { status: 400 }
      );
    }

    // Mettre à jour la commande
    const { data: order, error: updateError } = await supabase
      .from('orders')
      .update({ 
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', orderId)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating order:', updateError);
      return NextResponse.json(
        { error: 'Erreur lors de la mise à jour de la commande' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      order 
    });
  } catch (error: any) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Une erreur inattendue est survenue' },
      { status: 500 }
    );
  }
}

