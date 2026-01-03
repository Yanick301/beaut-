import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Controleert of gebruiker admin is
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
 * GET - Bevestigt een bestelling via de link in de e-mail
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await params;
    const supabase = await createClient();

    // Controleer authenticatie en admin rechten
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      // Redirect naar login met redirect naar deze pagina
      const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
      const currentUrl = `${baseUrl}/api/admin/orders/${orderId}/confirm`;
      return NextResponse.redirect(`${baseUrl}/connexion?redirect=${encodeURIComponent(currentUrl)}`);
    }

    // Controleer admin rechten
    const userIsAdmin = await isAdmin(user.id, user.email);
    if (!userIsAdmin) {
      return NextResponse.json(
        { error: 'Toegang geweigerd. Administrator rechten vereist.' },
        { status: 403 }
      );
    }

    // Utiliser le client admin pour récupérer et mettre à jour la commande
    const adminSupabase = createAdminClient();
    
    // Haal de bestelling op
    const { data: order, error: orderError } = await adminSupabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (orderError || !order) {
      return NextResponse.json(
        { error: 'Bestelling niet gevonden' },
        { status: 404 }
      );
    }

    // Werk de status van de bestelling bij
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
          error: 'Fout bij het bijwerken van de bestelling',
          details: updateError.message,
          code: updateError.code,
          hint: updateError.code === '42501' ? 'Controleer of het RLS-beleid "Admins can update all orders" is aangemaakt in Supabase. Voer het script admin_rls_policies.sql uit' : updateError.message
        },
        { status: 500 }
      );
    }
    
    console.log('Order updated successfully');

    // Haal de klant e-mail op uit shipping_address
    const customerEmail = order.shipping_address?.email || null;
    const customerName = order.shipping_address?.firstName || 'Geachte klant';

    // Verzend bevestigingsmail naar de klant
    if (customerEmail && process.env.RESEND_API_KEY) {
      try {
        await resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL || 'Her Essence <noreply@heressence.nl>',
          to: customerEmail,
          subject: `Bestelling ${order.order_number} bevestigd`,
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
                  <h1>Bestelling bevestigd!</h1>
                </div>
                <div class="content">
                  <div class="success-box">
                    <h2 style="margin: 0;">✓ Uw betaling is bevestigd</h2>
                  </div>
                  <p>Beste ${customerName},</p>
                  <p>Wij hebben uw overschrijvingsbewijs voor bestelling <strong>${order.order_number}</strong> goed ontvangen en gevalideerd.</p>
                  <p>Uw bestelling wordt nu verwerkt en zal binnenkort verzonden worden.</p>
                  <p>U kunt de status van uw bestelling volgen via uw <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/compte" style="color: #d4a574; text-decoration: underline;">mijn account</a>.</p>
                  <p>Bedankt voor uw vertrouwen!</p>
                  <p>Het Her Essence team</p>
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
      { error: 'Er is een onverwachte fout opgetreden' },
      { status: 500 }
    );
  }
}

/**
 * POST - Bevestigt een bestelling via het admin dashboard
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

    // Controleer admin rechten
    const userIsAdmin = await isAdmin(user.id, user.email);
    if (!userIsAdmin) {
      return NextResponse.json(
        { error: 'Toegang geweigerd. Administrator rechten vereist.' },
        { status: 403 }
      );
    }

    // Utiliser le client admin pour récupérer et mettre à jour la commande
    const adminSupabase = createAdminClient();
    
    console.log('POST: Looking for order with ID:', orderId);
    
    // Haal de bestelling op
    const { data: order, error: orderError } = await adminSupabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (orderError) {
      console.error('POST: Error fetching order:', orderError);
      return NextResponse.json(
        { error: 'Fout bij het ophalen van de bestelling', details: orderError.message },
        { status: 500 }
      );
    }

    if (!order) {
      console.error('POST: Order not found with ID:', orderId);
      return NextResponse.json(
        { error: 'Bestelling niet gevonden', orderId },
        { status: 404 }
      );
    }
    
    console.log('POST: Order found:', order.order_number);

    // Werk de status van de bestelling bij
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
          error: 'Fout bij het bijwerken van de bestelling',
          details: updateError.message,
          code: updateError.code,
          hint: updateError.code === '42501' ? 'Controleer of het RLS-beleid "Admins can update all orders" is aangemaakt in Supabase. Voer het script admin_rls_policies.sql uit' : updateError.message
        },
        { status: 500 }
      );
    }
    
    console.log('POST: Order updated successfully');

    // Haal de klant e-mail op uit shipping_address
    const customerEmail = order.shipping_address?.email || null;
    const customerName = order.shipping_address?.firstName || 'Geachte klant';

    // Verzend bevestigingsmail naar de klant
    if (customerEmail && process.env.RESEND_API_KEY) {
      try {
        await resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL || 'Her Essence <noreply@heressence.nl>',
          to: customerEmail,
          subject: `Bestelling ${order.order_number} bevestigd`,
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
                  <h1>Bestelling bevestigd!</h1>
                </div>
                <div class="content">
                  <div class="success-box">
                    <h2 style="margin: 0;">✓ Uw betaling is bevestigd</h2>
                  </div>
                  <p>Beste ${customerName},</p>
                  <p>Wij hebben uw overschrijvingsbewijs voor bestelling <strong>${order.order_number}</strong> goed ontvangen en gevalideerd.</p>
                  <p>Uw bestelling wordt nu verwerkt en zal binnenkort verzonden worden.</p>
                  <p>U kunt de status van uw bestelling volgen via uw <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/compte" style="color: #d4a574; text-decoration: underline;">mijn account</a>.</p>
                  <p>Bedankt voor uw vertrouwen!</p>
                  <p>Het Her Essence team</p>
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
      message: 'Bestelling succesvol bevestigd'
    });
  } catch (error: any) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Er is een onverwachte fout opgetreden' },
      { status: 500 }
    );
  }
}
