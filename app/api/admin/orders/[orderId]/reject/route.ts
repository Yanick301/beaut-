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
 * GET - Keurt een bestelling af via de link in de e-mail
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
      const currentUrl = `${baseUrl}/api/admin/orders/${orderId}/reject`;
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
    
    const searchParams = request.nextUrl.searchParams;
    const reason = searchParams.get('reason') || 'Overschrijvingsbewijs ongeldig of verkeerd bedrag';

    console.log('GET REJECT: Looking for order with ID:', orderId);
    
    // Haal de bestelling op
    const { data: order, error: orderError } = await adminSupabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (orderError) {
      console.error('GET REJECT: Error fetching order:', orderError);
      return NextResponse.json(
        { error: 'Fout bij het ophalen van de bestelling', details: orderError.message },
        { status: 500 }
      );
    }

    if (!order) {
      console.error('GET REJECT: Order not found with ID:', orderId);
      return NextResponse.json(
        { error: 'Bestelling niet gevonden', orderId },
        { status: 404 }
      );
    }
    
    console.log('GET REJECT: Order found:', order.order_number);

    // Werk de status van de bestelling bij
    console.log('Updating order:', orderId, 'to cancelled');
    const { error: updateError } = await adminSupabase
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

    // Verzend e-mail naar de klant
    if (customerEmail && process.env.RESEND_API_KEY) {
      try {
        await resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL || 'Her Essence <noreply@heressence.nl>',
          to: customerEmail,
          subject: `Bestelling ${order.order_number} - Betalingsprobleem`,
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
                  <h1>Probleem met uw bestelling</h1>
                </div>
                <div class="content">
                  <div class="warning-box">
                    <h2 style="margin-top: 0; color: #92400e;">Let op</h2>
                    <p style="margin-bottom: 0; color: #78350f;">Uw overschrijvingsbewijs kon niet worden gevalideerd.</p>
                  </div>
                  <p>Beste ${customerName},</p>
                  <p>Wij hebben het overschrijvingsbewijs bekeken dat u heeft geüpload voor bestelling <strong>${order.order_number}</strong>.</p>
                  <p><strong>Reden van afwijzing :</strong> ${reason}</p>
                  <p>Neem contact met ons op via <a href="mailto:contact@heressence.nl" style="color: #d4a574; text-decoration: underline;">contact@heressence.nl</a> als u denkt dat dit een fout is.</p>
                  <p>U kunt ook een nieuw bewijs uploaden via uw <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/compte" style="color: #d4a574; text-decoration: underline;">mijn account</a>.</p>
                  <p>Bedankt voor uw begrip.</p>
                  <p>Het Her Essence team</p>
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

    // Redirect naar het admin dashboard
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    return NextResponse.redirect(`${baseUrl}/admin?rejected=${orderId}`);
  } catch (error: any) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Er is een onverwachte fout opgetreden' },
      { status: 500 }
    );
  }
}

/**
 * POST - Keurt een bestelling af via het admin dashboard
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await params;
    const supabase = await createClient();

    // Controleer authenticatie
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
    
    const body = await request.json();
    const reason = body.reason || 'Overschrijvingsbewijs ongeldig of verkeerd bedrag';

    console.log('POST REJECT: Looking for order with ID:', orderId);
    
    // Haal de bestelling op
    const { data: order, error: orderError } = await adminSupabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (orderError) {
      console.error('POST REJECT: Error fetching order:', orderError);
      return NextResponse.json(
        { error: 'Fout bij het ophalen van de bestelling', details: orderError.message },
        { status: 500 }
      );
    }

    if (!order) {
      console.error('POST REJECT: Order not found with ID:', orderId);
      return NextResponse.json(
        { error: 'Bestelling niet gevonden', orderId },
        { status: 404 }
      );
    }
    
    console.log('POST REJECT: Order found:', order.order_number);

    // Werk de status van de bestelling bij
    console.log('Updating order:', orderId, 'to cancelled');
    const { error: updateError } = await adminSupabase
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

    // Verzend e-mail naar de klant
    if (customerEmail && process.env.RESEND_API_KEY) {
      try {
        await resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL || 'Her Essence <noreply@heressence.nl>',
          to: customerEmail,
          subject: `Bestelling ${order.order_number} - Betalingsprobleem`,
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
                  <h1>Probleem met uw bestelling</h1>
                </div>
                <div class="content">
                  <div class="warning-box">
                    <h2 style="margin-top: 0; color: #92400e;">Let op</h2>
                    <p style="margin-bottom: 0; color: #78350f;">Uw overschrijvingsbewijs kon niet worden gevalideerd.</p>
                  </div>
                  <p>Beste ${customerName},</p>
                  <p>Wij hebben het overschrijvingsbewijs bekeken dat u heeft geüpload voor bestelling <strong>${order.order_number}</strong>.</p>
                  <p><strong>Reden van afwijzing :</strong> ${reason}</p>
                  <p>Neem contact met ons op via <a href="mailto:contact@heressence.nl" style="color: #d4a574; text-decoration: underline;">contact@heressence.nl</a> als u denkt dat dit een fout is.</p>
                  <p>U kunt ook een nieuw bewijs uploaden via uw <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/compte" style="color: #d4a574; text-decoration: underline;">mijn account</a>.</p>
                  <p>Bedankt voor uw begrip.</p>
                  <p>Het Her Essence team</p>
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
      { error: 'Er is een onverwachte fout opgetreden' },
      { status: 500 }
    );
  }
}
