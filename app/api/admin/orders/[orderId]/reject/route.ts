import { createClient } from '@/lib/supabase/server';
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
 * GET - Rejette une commande depuis le lien dans l'email
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
      const currentUrl = `${baseUrl}/api/admin/orders/${orderId}/reject`;
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

    const searchParams = request.nextUrl.searchParams;
    const reason = searchParams.get('reason') || 'Reçu de virement non valide ou montant incorrect';

    console.log('GET REJECT: Looking for order with ID:', orderId);
    
    // Récupérer la commande
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (orderError) {
      console.error('GET REJECT: Error fetching order:', orderError);
      return NextResponse.json(
        { error: 'Erreur lors de la récupération de la commande', details: orderError.message },
        { status: 500 }
      );
    }

    if (!order) {
      console.error('GET REJECT: Order not found with ID:', orderId);
      return NextResponse.json(
        { error: 'Commande non trouvée', orderId },
        { status: 404 }
      );
    }
    
    console.log('GET REJECT: Order found:', order.order_number);

    // Mettre à jour le statut de la commande
    console.log('Updating order:', orderId, 'to cancelled');
    const { error: updateError } = await supabase
      .from('orders')
      .update({
        status: 'cancelled',
        payment_status: 'failed',
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

    // Envoyer un email au client
    if (customerEmail && process.env.RESEND_API_KEY) {
      try {
        await resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL || 'Essence Féminine <noreply@essencefeminine.nl>',
          to: customerEmail,
          subject: `Commande ${order.order_number} - Problème de paiement`,
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
                .warning-box { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 20px; border-radius: 8px; margin: 20px 0; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>Problème avec votre commande</h1>
                </div>
                <div class="content">
                  <div class="warning-box">
                    <h2 style="margin-top: 0; color: #92400e;">Attention</h2>
                    <p style="margin-bottom: 0; color: #78350f;">Votre reçu de virement n'a pas pu être validé.</p>
                  </div>
                  <p>Bonjour ${customerName},</p>
                  <p>Nous avons examiné le reçu de virement que vous avez téléversé pour la commande <strong>${order.order_number}</strong>.</p>
                  <p><strong>Raison du rejet :</strong> ${reason}</p>
                  <p>Veuillez nous contacter à <a href="mailto:contact@essencefeminine.nl" style="color: #d4a574; text-decoration: underline;">contact@essencefeminine.nl</a> si vous pensez qu'il s'agit d'une erreur.</p>
                  <p>Vous pouvez également téléverser un nouveau reçu depuis votre <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/compte" style="color: #d4a574; text-decoration: underline;">espace client</a>.</p>
                  <p>Merci de votre compréhension.</p>
                  <p>L'équipe Essence Féminine</p>
                </div>
              </div>
            </body>
            </html>
          `,
        });
      } catch (emailError) {
        console.error('Error sending rejection email:', emailError);
      }
    }

    // Rediriger vers le dashboard admin
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    return NextResponse.redirect(`${baseUrl}/admin?rejected=${orderId}`);
  } catch (error: any) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Une erreur inattendue est survenue' },
      { status: 500 }
    );
  }
}

/**
 * POST - Rejette une commande depuis le dashboard admin
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

    const body = await request.json();
    const reason = body.reason || 'Reçu de virement non valide ou montant incorrect';

    console.log('GET REJECT: Looking for order with ID:', orderId);
    
    // Récupérer la commande
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (orderError) {
      console.error('GET REJECT: Error fetching order:', orderError);
      return NextResponse.json(
        { error: 'Erreur lors de la récupération de la commande', details: orderError.message },
        { status: 500 }
      );
    }

    if (!order) {
      console.error('GET REJECT: Order not found with ID:', orderId);
      return NextResponse.json(
        { error: 'Commande non trouvée', orderId },
        { status: 404 }
      );
    }
    
    console.log('GET REJECT: Order found:', order.order_number);

    // Mettre à jour le statut de la commande
    console.log('Updating order:', orderId, 'to cancelled');
    const { error: updateError } = await supabase
      .from('orders')
      .update({
        status: 'cancelled',
        payment_status: 'failed',
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

    // Envoyer un email au client
    if (customerEmail && process.env.RESEND_API_KEY) {
      try {
        await resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL || 'Essence Féminine <noreply@essencefeminine.nl>',
          to: customerEmail,
          subject: `Commande ${order.order_number} - Problème de paiement`,
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
                .warning-box { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 20px; border-radius: 8px; margin: 20px 0; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>Problème avec votre commande</h1>
                </div>
                <div class="content">
                  <div class="warning-box">
                    <h2 style="margin-top: 0; color: #92400e;">Attention</h2>
                    <p style="margin-bottom: 0; color: #78350f;">Votre reçu de virement n'a pas pu être validé.</p>
                  </div>
                  <p>Bonjour ${customerName},</p>
                  <p>Nous avons examiné le reçu de virement que vous avez téléversé pour la commande <strong>${order.order_number}</strong>.</p>
                  <p><strong>Raison du rejet :</strong> ${reason}</p>
                  <p>Veuillez nous contacter à <a href="mailto:contact@essencefeminine.nl" style="color: #d4a574; text-decoration: underline;">contact@essencefeminine.nl</a> si vous pensez qu'il s'agit d'une erreur.</p>
                  <p>Vous pouvez également téléverser un nouveau reçu depuis votre <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/compte" style="color: #d4a574; text-decoration: underline;">espace client</a>.</p>
                  <p>Merci de votre compréhension.</p>
                  <p>L'équipe Essence Féminine</p>
                </div>
              </div>
            </body>
            </html>
          `,
        });
      } catch (emailError) {
        console.error('Error sending rejection email:', emailError);
      }
    }

    return NextResponse.json({ 
      success: true,
      message: 'Commande rejetée avec succès'
    });
  } catch (error: any) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Une erreur inattendue est survenue' },
      { status: 500 }
    );
  }
}
