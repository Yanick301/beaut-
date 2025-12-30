import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Vérifie si l'utilisateur est admin
 */
async function isAdmin(userId: string, userEmail?: string): Promise<boolean> {
  const adminEmailsStr = process.env.ADMIN_EMAILS || '';
  const adminEmails = adminEmailsStr
    .split(',')
    .map(email => email.trim().toLowerCase())
    .filter(email => email.length > 0);
  
  if (userEmail && adminEmails.includes(userEmail.toLowerCase())) {
    return true;
  }
  
  const supabase = await createClient();
  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', userId)
    .single();
  
  return profile?.is_admin === true;
}

/**
 * GET - Confirme une commande depuis le lien dans l'email
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await params;
    const supabase = await createClient();

    // Vérifier l'authentification et les droits admin
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      // Rediriger vers la connexion avec un redirect vers cette page
      const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
      const currentUrl = `${baseUrl}/api/admin/orders/${orderId}/confirm`;
      return NextResponse.redirect(`${baseUrl}/connexion?redirect=${encodeURIComponent(currentUrl)}`);
    }

    // Vérifier les droits admin
    const userIsAdmin = await isAdmin(user.id, user.email);
    if (!userIsAdmin) {
      return NextResponse.json(
        { error: 'Accès refusé. Droits administrateur requis.' },
        { status: 403 }
      );
    }

    // Utiliser le client admin pour récupérer et mettre à jour la commande
    const adminSupabase = createAdminClient();
    
    // Récupérer la commande
    const { data: order, error: orderError } = await adminSupabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (orderError || !order) {
      return NextResponse.json(
        { error: 'Commande non trouvée' },
        { status: 404 }
      );
    }

    // Mettre à jour le statut de la commande
    console.log('Updating order:', orderId, 'to processing');
    const { error: updateError } = await adminSupabase
      .from('orders')
      .update({
        status: 'processing',
        payment_status: 'paid',
        updated_at: new Date().toISOString()
      })
      .eq('id', orderId);

    if (updateError) {
      console.error('Update error:', updateError);
      console.error('Update error details:', JSON.stringify(updateError, null, 2));
      return NextResponse.json(
        { 
          error: 'Erreur lors de la mise à jour de la commande',
          details: updateError.message,
          code: updateError.code,
          hint: updateError.code === '42501' ? 'Vérifiez que la politique RLS "Admins can update all orders" est créée dans Supabase. Exécutez le script admin_rls_policies.sql' : updateError.message
        },
        { status: 500 }
      );
    }
    
    console.log('Order updated successfully');

    // Récupérer l'email du client depuis shipping_address
    const customerEmail = order.shipping_address?.email || null;
    const customerName = order.shipping_address?.firstName || 'Cher client';

    // Envoyer un email de confirmation au client
    if (customerEmail && process.env.RESEND_API_KEY) {
      try {
        await resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL || 'Essence Féminine <noreply@essencefeminine.nl>',
          to: customerEmail,
          subject: `Commande ${order.order_number} confirmée`,
          html: `
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="utf-8">
              <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #d4a574 0%, #c9a082 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                .header h1 { color: #fff; margin: 0; }
                .content { background: #faf7f2; padding: 30px; border-radius: 0 0 10px 10px; }
                .success-box { background: #10b981; color: #fff; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>Commande confirmée !</h1>
                </div>
                <div class="content">
                  <div class="success-box">
                    <h2 style="margin: 0;">✓ Votre paiement a été confirmé</h2>
                  </div>
                  <p>Bonjour ${customerName},</p>
                  <p>Nous avons bien reçu et validé votre reçu de virement pour la commande <strong>${order.order_number}</strong>.</p>
                  <p>Votre commande est maintenant en cours de traitement et sera expédiée sous peu.</p>
                  <p>Vous pouvez suivre l'état de votre commande depuis votre <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/compte" style="color: #d4a574; text-decoration: underline;">espace client</a>.</p>
                  <p>Merci pour votre confiance !</p>
                  <p>L'équipe Essence Féminine</p>
                </div>
              </div>
            </body>
            </html>
          `,
        });
      } catch (emailError) {
        console.error('Error sending confirmation email:', emailError);
      }
    }

    // Rediriger vers une page de succès
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    return NextResponse.redirect(`${baseUrl}/admin?confirmed=${orderId}`);
  } catch (error: any) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Une erreur inattendue est survenue' },
      { status: 500 }
    );
  }
}

/**
 * POST - Confirme une commande depuis le dashboard admin
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await params;
    const supabase = await createClient();

    // Vérifier l'authentification
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

    // Utiliser le client admin pour récupérer et mettre à jour la commande
    const adminSupabase = createAdminClient();
    
    console.log('POST: Looking for order with ID:', orderId);
    
    // Récupérer la commande
    const { data: order, error: orderError } = await adminSupabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (orderError) {
      console.error('POST: Error fetching order:', orderError);
      return NextResponse.json(
        { error: 'Erreur lors de la récupération de la commande', details: orderError.message },
        { status: 500 }
      );
    }

    if (!order) {
      console.error('POST: Order not found with ID:', orderId);
      return NextResponse.json(
        { error: 'Commande non trouvée', orderId },
        { status: 404 }
      );
    }
    
    console.log('POST: Order found:', order.order_number);

    // Mettre à jour le statut de la commande
    console.log('POST: Updating order:', orderId, 'to processing');
    const { error: updateError } = await adminSupabase
      .from('orders')
      .update({
        status: 'processing',
        payment_status: 'paid',
        updated_at: new Date().toISOString()
      })
      .eq('id', orderId);

    if (updateError) {
      console.error('POST: Update error:', updateError);
      console.error('POST: Update error details:', JSON.stringify(updateError, null, 2));
      return NextResponse.json(
        { 
          error: 'Erreur lors de la mise à jour de la commande',
          details: updateError.message,
          code: updateError.code,
          hint: updateError.code === '42501' ? 'Vérifiez que la politique RLS "Admins can update all orders" est créée dans Supabase. Exécutez le script admin_rls_policies.sql' : updateError.message
        },
        { status: 500 }
      );
    }
    
    console.log('POST: Order updated successfully');

    // Récupérer l'email du client depuis shipping_address
    const customerEmail = order.shipping_address?.email || null;
    const customerName = order.shipping_address?.firstName || 'Cher client';

    // Envoyer un email de confirmation au client
    if (customerEmail && process.env.RESEND_API_KEY) {
      try {
        await resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL || 'Essence Féminine <noreply@essencefeminine.nl>',
          to: customerEmail,
          subject: `Commande ${order.order_number} confirmée`,
          html: `
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="utf-8">
              <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #d4a574 0%, #c9a082 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                .header h1 { color: #fff; margin: 0; }
                .content { background: #faf7f2; padding: 30px; border-radius: 0 0 10px 10px; }
                .success-box { background: #10b981; color: #fff; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>Commande confirmée !</h1>
                </div>
                <div class="content">
                  <div class="success-box">
                    <h2 style="margin: 0;">✓ Votre paiement a été confirmé</h2>
                  </div>
                  <p>Bonjour ${customerName},</p>
                  <p>Nous avons bien reçu et validé votre reçu de virement pour la commande <strong>${order.order_number}</strong>.</p>
                  <p>Votre commande est maintenant en cours de traitement et sera expédiée sous peu.</p>
                  <p>Vous pouvez suivre l'état de votre commande depuis votre <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/compte" style="color: #d4a574; text-decoration: underline;">espace client</a>.</p>
                  <p>Merci pour votre confiance !</p>
                  <p>L'équipe Essence Féminine</p>
                </div>
              </div>
            </body>
            </html>
          `,
        });
      } catch (emailError) {
        console.error('Error sending confirmation email:', emailError);
      }
    }

    return NextResponse.json({ 
      success: true,
      message: 'Commande confirmée avec succès'
    });
  } catch (error: any) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Une erreur inattendue est survenue' },
      { status: 500 }
    );
  }
}
