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
    const { orderId, orderNumber, receiptUrl, receiptFileName, receiptOriginalFileName, receiptFileBase64, receiptFileType, customerName, totalAmount } = body;

    if (!orderId || !orderNumber || !receiptUrl) {
      return NextResponse.json(
        { error: 'Ontbrekende gegevens' },
        { status: 400 }
      );
    }

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
      subject: `Nieuw overschrijvingsbewijs - Bestelling ${orderNumber}`,
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
            .info-box { background: #fff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #d4a574; }
            .info-box h2 { margin-top: 0; color: #5a4a3a; }
            .info-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
            .info-row:last-child { border-bottom: none; }
            .info-label { font-weight: bold; color: #5a4a3a; }
            .info-value { color: #333; }
            .receipt-box { background: #fff; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center; }
            .receipt-box img { max-width: 100%; height: auto; border-radius: 8px; margin-top: 10px; }
            .buttons { margin: 30px 0; text-align: center; }
            .btn { display: inline-block; padding: 12px 30px; margin: 10px; text-decoration: none; border-radius: 25px; font-weight: bold; transition: all 0.3s; }
            .btn-confirm { background: #10b981; color: #fff; }
            .btn-confirm:hover { background: #059669; }
            .btn-reject { background: #ef4444; color: #fff; }
            .btn-reject:hover { background: #dc2626; }
            .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Nieuw overschrijvingsbewijs ontvangen</h1>
            </div>
            <div class="content">
              <p>Goedendag,</p>
              <p>Er is een nieuw overschrijvingsbewijs geüpload voor de volgende bestelling:</p>
              
              <div class="info-box">
                <h2>Bestelgegevens</h2>
                <div class="info-row">
                  <span class="info-label">Bestelnummer :</span>
                  <span class="info-value"><strong>${orderNumber}</strong></span>
                </div>
                <div class="info-row">
                  <span class="info-label">Klant :</span>
                  <span class="info-value">${customerName || 'Niet opgegeven'}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Totaalbedrag :</span>
                  <span class="info-value"><strong>€${parseFloat(totalAmount || 0).toFixed(2)}</strong></span>
                </div>
              </div>

              <div class="receipt-box">
                <h2>Overschrijvingsbewijs</h2>
                ${attachment ? `<p style="color: #10b981; font-weight: bold; margin-bottom: 15px;">📎 Het bewijs is beschikbaar als bijlage (${attachment.filename})</p>` : ''}
                <p style="margin-bottom: 15px;">
                  <a href="${receiptUrl}" target="_blank" style="color: #d4a574; text-decoration: underline; font-weight: bold;">Bekijk het volledige bewijs online</a>
                </p>
                ${isPdf ? `
                  <div style="background: #f3f4f6; padding: 40px; border-radius: 8px; text-align: center; border: 2px solid #d4a574;">
                    <p style="font-size: 48px; margin: 0;">📄</p>
                    <p style="margin-top: 15px; font-weight: bold; color: #5a4a3a;">PDF Document</p>
                    <p style="color: #666; font-size: 14px;">Het bewijs is beschikbaar als bijlage</p>
                    <p style="margin-top: 10px;">
                      <a href="${receiptUrl}" target="_blank" style="color: #d4a574; text-decoration: underline;">Open PDF</a>
                    </p>
                  </div>
                ` : imageDataUri ? `
                  <img src="${imageDataUri}" alt="Overschrijvingsbewijs" style="max-width: 100%; height: auto; border-radius: 8px; margin-top: 10px; border: 2px solid #d4a574; display: block; margin: 15px auto;" />
                ` : `
                  <img src="${receiptUrl}" alt="Overschrijvingsbewijs" style="max-width: 100%; height: auto; border-radius: 8px; margin-top: 10px; border: 2px solid #d4a574; display: block; margin: 15px auto;" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';" />
                  <div style="display: none; background: #f3f4f6; padding: 40px; border-radius: 8px; text-align: center; border: 2px solid #d4a574;">
                    <p style="font-size: 48px; margin: 0;">📎</p>
                    <p style="margin-top: 15px; font-weight: bold; color: #5a4a3a;">Bewijs beschikbaar als bijlage</p>
                    <p style="margin-top: 10px;">
                      <a href="${receiptUrl}" target="_blank" style="color: #d4a574; text-decoration: underline;">Bekijk het bewijs</a>
                    </p>
                  </div>
                `}
              </div>

              <div class="buttons">
                <p style="margin-bottom: 15px; font-weight: bold; color: #5a4a3a;">Acties :</p>
                <a href="${confirmUrl}" class="btn btn-confirm">✓ Bestelling bevestigen</a>
                <a href="${rejectUrl}" class="btn btn-reject">✗ Bestelling afwijzen</a>
              </div>

              <p style="margin-top: 30px; font-size: 14px; color: #666;">
                <strong>Note :</strong> U kunt deze bestelling ook beheren via het 
                <a href="${baseUrl}/admin" style="color: #d4a574; text-decoration: underline;">admin dashboard</a>.
              </p>
            </div>
            <div class="footer">
              <p>Her Essence - Bestelbeheersysteem</p>
              <p>Deze e-mail is automatisch verzonden, gelieve niet te beantwoorden.</p>
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
          error: 'Erreur lors de l\'envoi de l\'email', 
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

