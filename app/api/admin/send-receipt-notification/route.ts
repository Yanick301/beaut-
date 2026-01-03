import { createClient } from '@/lib/supabase/server';
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
 * POST - Verzendt een e-mail naar de admin met het overschrijvingsbewijs
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Niet geauthenticeerd' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { orderId, orderNumber, receiptUrl, receiptFileName, receiptOriginalFileName, receiptFileBase64, receiptFileType } = body;

    if (!orderId || !orderNumber || !receiptUrl) {
      return NextResponse.json(
        { error: 'Ontbrekende gegevens' },
        { status: 400 }
      );
    }

    // Récupérer les détails complets de la commande et les articles
    const { data: orderDetails, error: orderDetailsError } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (*)
      `)
      .eq('id', orderId)
      .single();

    if (orderDetailsError || !orderDetails) {
      console.error('Error fetching order details:', orderDetailsError);
      // On continue quand même avec les infos reçues dans le body si possible
    }

    // Récupérer les informations du profil client
    const { data: customerProfile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', orderDetails?.user_id || user.id)
      .single();

    if (profileError) {
      console.error('Error fetching customer profile:', profileError);
    }

    const shippingAddress = orderDetails?.shipping_address || {};
    const customerFullName = customerProfile
      ? `${customerProfile.first_name || ''} ${customerProfile.last_name || ''}`.trim()
      : `${shippingAddress.firstName || ''} ${shippingAddress.lastName || ''}`.trim();

    const displayCustomerName = customerFullName || 'Niet opgegeven';
    const customerEmail = customerProfile?.email || shippingAddress.email || user.email;
    const customerPhone = customerProfile?.phone || shippingAddress.phone || 'Niet opgegeven';


    // Gebruik het bestand direct verzonden door de klant (geen download nodig vanuit Storage)
    let attachment: { filename: string; content: Buffer; mimeType: string } | null = null;
    let imageDataUri: string | null = null; // Om de afbeelding direct in de e-mail weer te geven
    let isPdf = false;

    if (receiptFileBase64 && receiptFileName) {
      try {
        // Converteer base64 naar Buffer
        const buffer = Buffer.from(receiptFileBase64, 'base64');

        // Bepaal het MIME-type en de extensie
        const extension = receiptFileName.split('.').pop()?.toLowerCase();
        let mimeType = receiptFileType || 'application/octet-stream';
        isPdf = extension === 'pdf' || mimeType === 'application/pdf';

        // Zorg ervoor dat het MIME-type correct is
        if (!mimeType || mimeType === 'application/octet-stream') {
          if (isPdf) {
            mimeType = 'application/pdf';
          } else if (['jpg', 'jpeg'].includes(extension || '')) {
            mimeType = 'image/jpeg';
          } else if (extension === 'png') {
            mimeType = 'image/png';
          } else if (extension === 'webp') {
            mimeType = 'image/webp';
          }
        }

        // Gebruik de oorspronkelijke bestandsnaam geüpload door de klant
        const originalFileName = receiptOriginalFileName || `recu-commande-${orderNumber}.${extension || 'pdf'}`;

        attachment = {
          filename: originalFileName,
          content: buffer,
          mimeType: mimeType,
        };

        // Als het een afbeelding is (geen PDF), maak een data URI aan om het in de e-mail weer te geven
        if (!isPdf && mimeType.startsWith('image/')) {
          imageDataUri = `data:${mimeType};base64,${receiptFileBase64}`;
        }

        console.log('File processed:', {
          filename: attachment.filename,
          mimeType: attachment.mimeType,
          size: buffer.length,
          isPdf,
          hasImageDataUri: !!imageDataUri
        });
      } catch (error) {
        console.error('Error processing receipt file:', error);
        // Ga door zonder bijlage als verwerking mislukt
      }
    }

    // Haal de admin e-mail op uit de omgevingsvariabelen
    const adminEmail = process.env.ADMIN_EMAIL || process.env.ADMIN_EMAILS?.split(',')[0]?.trim();

    if (!adminEmail) {
      return NextResponse.json(
        { error: 'Admin e-mail niet geconfigureerd' },
        { status: 500 }
      );
    }

    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json(
        { error: 'Resend API-sleutel niet geconfigureerd' },
        { status: 500 }
      );
    }

    // URL's om de bestelling te bevestigen/afwijzen
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_VERCEL_URL
      ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
      : 'http://localhost:3000';

    const confirmUrl = `${baseUrl}/api/admin/orders/${orderId}/confirm`;
    const rejectUrl = `${baseUrl}/api/admin/orders/${orderId}/reject`;

    console.log('Sending email to admin:', adminEmail);
    console.log('Resend API Key exists:', !!process.env.RESEND_API_KEY);
    console.log('From email:', process.env.RESEND_FROM_EMAIL || 'Her Essence <noreply@heressence.nl>');
    console.log('Attachment:', attachment ? `Yes (${attachment.filename}, ${attachment.mimeType})` : 'No');
    console.log('Image Data URI:', imageDataUri ? 'Yes' : 'No');
    console.log('Is PDF:', isPdf);

    // Bereid bijlagen voor voor Resend
    // Resend verwacht: { filename: string, content: string (base64) }
    const attachments = attachment ? [{
      filename: attachment.filename,
      content: attachment.content.toString('base64'),
    }] : [];

    console.log('Attachments prepared:', attachments.length);

    // Verzend de e-mail naar de admin
    const emailPayload: any = {
      from: process.env.RESEND_FROM_EMAIL || 'Her Essence <noreply@heressence.nl>',
      to: adminEmail,
      subject: `Nieuw overschrijvingsbewijs - Bestelling ${orderNumber} - ${displayCustomerName}`,
    };

    // Voeg bijlagen toe indien beschikbaar
    if (attachments.length > 0) {
      emailPayload.attachments = attachments;
    }

    emailPayload.html = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #d4a574 0%, #c9a082 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .header h1 { color: #fff; margin: 0; font-size: 24px; }
            .content { background: #faf7f2; padding: 30px; border-radius: 0 0 10px 10px; }
            .info-box { background: #fff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #d4a574; box-shadow: 0 2px 4px rgba(0,0,0,0.05); }
            .info-box h2 { margin-top: 0; color: #5a4a3a; font-size: 18px; border-bottom: 2px solid #fcf2e9; padding-bottom: 10px; }
            .info-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f5f5f5; }
            .info-row:last-child { border-bottom: none; }
            .info-label { font-weight: bold; color: #5a4a3a; width: 40%; }
            .info-value { color: #333; width: 60%; text-align: right; }
            .items-table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            .items-table th { text-align: left; border-bottom: 2px solid #fcf2e9; padding: 10px; color: #5a4a3a; }
            .items-table td { padding: 10px; border-bottom: 1px solid #f5f5f5; }
            .totals { margin-top: 15px; border-top: 2px solid #d4a574; padding-top: 10px; }
            .total-row { display: flex; justify-content: space-between; padding: 5px 0; }
            .total-final { font-size: 18px; font-weight: bold; color: #d4a574; border-top: 1px solid #eee; margin-top: 10px; padding-top: 10px; }
            .receipt-box { background: #fff; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center; border: 1px solid #eee; }
            .buttons { margin: 30px 0; text-align: center; }
            .btn { display: inline-block; padding: 12px 25px; margin: 10px; text-decoration: none; border-radius: 25px; font-weight: bold; transition: all 0.3s; }
            .btn-confirm { background: #10b981; color: #fff; }
            .btn-reject { background: #ef4444; color: #fff; }
            .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Nieuwe Bestelling & Betalingsbewijs</h1>
            </div>
            <div class="content">
              <p>Goedendag,</p>
              <p>Er is een nieuwe bestelling geplaatst en een overschrijvingsbewijs is geüpload.</p>
              
              <div class="info-box">
                <h2>Klantgegevens (Profiel & Inschrijving)</h2>
                <div class="info-row">
                  <span class="info-label">Naam:</span>
                  <span class="info-value"><strong>${displayCustomerName}</strong></span>
                </div>
                <div class="info-row">
                  <span class="info-label">E-mail:</span>
                  <span class="info-value">${customerEmail}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Telefoon:</span>
                  <span class="info-value">${customerPhone}</span>
                </div>
                ${customerProfile?.created_at ? `
                <div class="info-row">
                  <span class="info-label">Klant sinds:</span>
                  <span class="info-value">${new Date(customerProfile.created_at).toLocaleDateString('nl-NL')}</span>
                </div>
                ` : ''}
              </div>

              <div class="info-box">
                <h2>Bezorgadres</h2>
                <div class="info-row">
                  <span class="info-label">Adres:</span>
                  <span class="info-value">${shippingAddress.address || 'Niet opgegeven'}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Stad:</span>
                  <span class="info-value">${shippingAddress.postalCode || ''} ${shippingAddress.city || ''}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Land:</span>
                  <span class="info-value">${shippingAddress.country || 'NL'}</span>
                </div>
              </div>

              <div class="info-box">
                <h2>Bestelgegevens</h2>
                <div class="info-row">
                  <span class="info-label">Bestelnummer:</span>
                  <span class="info-value"><strong>${orderNumber}</strong></span>
                </div>
                <div class="info-row">
                  <span class="info-label">Datum:</span>
                  <span class="info-value">${orderDetails?.created_at ? new Date(orderDetails.created_at).toLocaleString('nl-NL') : 'Onlangs'}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Betaalmethode:</span>
                  <span class="info-value">${orderDetails?.payment_method || 'Bankoverschrijving'}</span>
                </div>
                
                <h3 style="margin-top: 20px; font-size: 16px; color: #5a4a3a;">Artikelen</h3>
                <table class="items-table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th style="text-align: center;">Aantal</th>
                      <th style="text-align: right;">Prijs</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${orderDetails?.order_items?.map((item: any) => `
                      <tr>
                        <td>${item.product_name}</td>
                        <td style="text-align: center;">${item.quantity}</td>
                        <td style="text-align: right;">€${parseFloat(item.price).toFixed(2)}</td>
                      </tr>
                    `).join('') || `<tr><td colspan="3">Geen artikelen gevonden</td></tr>`}
                  </tbody>
                </table>

                <div class="totals">
                  <div class="total-row">
                    <span>Subtotaal:</span>
                    <span>€${parseFloat(orderDetails?.total_amount || 0).toFixed(2)}</span>
                  </div>
                  <div class="total-row">
                    <span>Verzendkosten:</span>
                    <span>€${parseFloat(orderDetails?.shipping_cost || 0).toFixed(2)}</span>
                  </div>
                  <div class="total-final">
                    <span>Totaalbedrag:</span>
                    <span>€${(parseFloat(orderDetails?.total_amount || 0) + parseFloat(orderDetails?.shipping_cost || 0)).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div class="receipt-box">
                <h2 style="color: #5a4a3a; font-size: 18px;">Betalingsbewijs</h2>
                ${attachment ? `<p style="color: #10b981; font-weight: bold; margin-bottom: 15px;">📎 Bijgevoegd: ${attachment.filename}</p>` : ''}
                <p style="margin-bottom: 15px;">
                  <a href="${receiptUrl}" target="_blank" style="color: #d4a574; text-decoration: underline; font-weight: bold;">Online bekijken</a>
                </p>
                ${isPdf ? `
                  <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; border: 1px dashed #d4a574;">
                    <p style="font-size: 24px; margin: 0;">📄 PDF</p>
                  </div>
                ` : imageDataUri ? `
                  <img src="${imageDataUri}" alt="Bewijs" style="max-width: 100%; border-radius: 8px; border: 2px solid #d4a574;" />
                ` : `
                  <img src="${receiptUrl}" alt="Bewijs" style="max-width: 100%; border-radius: 8px; border: 2px solid #d4a574;" />
                `}
              </div>

              <div class="buttons">
                <p style="font-weight: bold; color: #5a4a3a;">Admin Acties:</p>
                <a href="${confirmUrl}" class="btn btn-confirm">✓ Bevestigen</a>
                <a href="${rejectUrl}" class="btn btn-reject">✗ Afwijzen</a>
              </div>

              <p style="font-size: 12px; color: #999;">
                U kunt deze bestelling ook beheren via het <a href="${baseUrl}/admin" style="color: #d4a574;">dashboard</a>.
              </p>
            </div>
            <div class="footer">
              <p>Her Essence - Bestelbeheer</p>
            </div>
          </div>
        </body>
        </html>
      `;

    const { data, error } = await resend.emails.send(emailPayload);

    if (error) {
      console.error('Resend error:', error);
      console.error('Resend error details:', JSON.stringify(error, null, 2));
      return NextResponse.json(
        {
          error: 'Fout bij het verzenden van de e-mail',
          details: error instanceof Error ? error.message : String(error),
          resendError: error
        },
        { status: 500 }
      );
    }

    console.log('Email sent successfully:', data);

    return NextResponse.json({
      success: true,
      messageId: data?.id
    });
  } catch (error: any) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Er is een onverwachte fout opgetreden', details: error.message },
      { status: 500 }
    );
  }
}

