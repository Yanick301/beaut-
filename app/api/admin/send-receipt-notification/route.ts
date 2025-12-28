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
 * POST - Envoie un email à l'admin avec le reçu de virement
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { orderId, orderNumber, receiptUrl, receiptFileName, receiptOriginalFileName, receiptFileBase64, receiptFileType, customerName, totalAmount } = body;

    if (!orderId || !orderNumber || !receiptUrl) {
      return NextResponse.json(
        { error: 'Données manquantes' },
        { status: 400 }
      );
    }

    // Utiliser le fichier directement envoyé par le client (pas besoin de télécharger depuis Storage)
    let attachment: { filename: string; content: Buffer; mimeType: string } | null = null;
    let imageDataUri: string | null = null; // Pour afficher l'image directement dans l'email
    let isPdf = false;
    
    if (receiptFileBase64 && receiptFileName) {
      try {
        // Convertir le base64 en Buffer
        const buffer = Buffer.from(receiptFileBase64, 'base64');
        
        // Déterminer le type MIME et l'extension
        const extension = receiptFileName.split('.').pop()?.toLowerCase();
        let mimeType = receiptFileType || 'application/octet-stream';
        isPdf = extension === 'pdf' || mimeType === 'application/pdf';
        
        // S'assurer que le mimeType est correct
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

        // Utiliser le nom original du fichier uploadé par le client
        const originalFileName = receiptOriginalFileName || `recu-commande-${orderNumber}.${extension || 'pdf'}`;
        
        attachment = {
          filename: originalFileName,
          content: buffer,
          mimeType: mimeType,
        };

        // Si c'est une image (pas un PDF), créer un data URI pour l'afficher dans l'email
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
        // Continuer sans pièce jointe si le traitement échoue
      }
    }

    // Récupérer l'email admin depuis les variables d'environnement
    const adminEmail = process.env.ADMIN_EMAIL || process.env.ADMIN_EMAILS?.split(',')[0]?.trim();
    
    if (!adminEmail) {
      return NextResponse.json(
        { error: 'Email admin non configuré' },
        { status: 500 }
      );
    }

    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json(
        { error: 'Resend API key non configurée' },
        { status: 500 }
      );
    }

    // URLs pour confirmer/rejeter la commande
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_VERCEL_URL 
      ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}` 
      : 'http://localhost:3000';
    
    const confirmUrl = `${baseUrl}/api/admin/orders/${orderId}/confirm`;
    const rejectUrl = `${baseUrl}/api/admin/orders/${orderId}/reject`;

    console.log('Sending email to admin:', adminEmail);
    console.log('Resend API Key exists:', !!process.env.RESEND_API_KEY);
    console.log('From email:', process.env.RESEND_FROM_EMAIL || 'Essence Féminine <noreply@essencefeminine.nl>');
    console.log('Attachment:', attachment ? `Yes (${attachment.filename}, ${attachment.mimeType})` : 'No');
    console.log('Image Data URI:', imageDataUri ? 'Yes' : 'No');
    console.log('Is PDF:', isPdf);
    
    // Préparer les pièces jointes pour Resend
    // Resend attend: { filename: string, content: string (base64) }
    const attachments = attachment ? [{
      filename: attachment.filename,
      content: attachment.content.toString('base64'),
    }] : [];
    
    console.log('Attachments prepared:', attachments.length);

    // Envoyer l'email à l'admin
    const emailPayload: any = {
      from: process.env.RESEND_FROM_EMAIL || 'Essence Féminine <noreply@essencefeminine.nl>',
      to: adminEmail,
      subject: `Nouveau reçu de virement - Commande ${orderNumber}`,
    };

    // Ajouter les pièces jointes si disponibles
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
              <h1>Nouveau reçu de virement reçu</h1>
            </div>
            <div class="content">
              <p>Bonjour,</p>
              <p>Un nouveau reçu de virement a été téléversé pour la commande suivante :</p>
              
              <div class="info-box">
                <h2>Détails de la commande</h2>
                <div class="info-row">
                  <span class="info-label">Numéro de commande :</span>
                  <span class="info-value"><strong>${orderNumber}</strong></span>
                </div>
                <div class="info-row">
                  <span class="info-label">Client :</span>
                  <span class="info-value">${customerName || 'Non renseigné'}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Montant total :</span>
                  <span class="info-value"><strong>€${parseFloat(totalAmount || 0).toFixed(2)}</strong></span>
                </div>
              </div>

              <div class="receipt-box">
                <h2>Reçu de virement</h2>
                ${attachment ? `<p style="color: #10b981; font-weight: bold; margin-bottom: 15px;">📎 Le reçu est disponible en pièce jointe (${attachment.filename})</p>` : ''}
                <p style="margin-bottom: 15px;">
                  <a href="${receiptUrl}" target="_blank" style="color: #d4a574; text-decoration: underline; font-weight: bold;">Voir le reçu complet en ligne</a>
                </p>
                ${isPdf ? `
                  <div style="background: #f3f4f6; padding: 40px; border-radius: 8px; text-align: center; border: 2px solid #d4a574;">
                    <p style="font-size: 48px; margin: 0;">📄</p>
                    <p style="margin-top: 15px; font-weight: bold; color: #5a4a3a;">Document PDF</p>
                    <p style="color: #666; font-size: 14px;">Le reçu est disponible en pièce jointe</p>
                    <p style="margin-top: 10px;">
                      <a href="${receiptUrl}" target="_blank" style="color: #d4a574; text-decoration: underline;">Ouvrir le PDF</a>
                    </p>
                  </div>
                ` : imageDataUri ? `
                  <img src="${imageDataUri}" alt="Reçu de virement" style="max-width: 100%; height: auto; border-radius: 8px; margin-top: 10px; border: 2px solid #d4a574; display: block; margin: 15px auto;" />
                ` : `
                  <img src="${receiptUrl}" alt="Reçu de virement" style="max-width: 100%; height: auto; border-radius: 8px; margin-top: 10px; border: 2px solid #d4a574; display: block; margin: 15px auto;" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';" />
                  <div style="display: none; background: #f3f4f6; padding: 40px; border-radius: 8px; text-align: center; border: 2px solid #d4a574;">
                    <p style="font-size: 48px; margin: 0;">📎</p>
                    <p style="margin-top: 15px; font-weight: bold; color: #5a4a3a;">Reçu disponible en pièce jointe</p>
                    <p style="margin-top: 10px;">
                      <a href="${receiptUrl}" target="_blank" style="color: #d4a574; text-decoration: underline;">Voir le reçu</a>
                    </p>
                  </div>
                `}
              </div>

              <div class="buttons">
                <p style="margin-bottom: 15px; font-weight: bold; color: #5a4a3a;">Actions :</p>
                <a href="${confirmUrl}" class="btn btn-confirm">✓ Confirmer la commande</a>
                <a href="${rejectUrl}" class="btn btn-reject">✗ Rejeter la commande</a>
              </div>

              <p style="margin-top: 30px; font-size: 14px; color: #666;">
                <strong>Note :</strong> Vous pouvez également gérer cette commande depuis le 
                <a href="${baseUrl}/admin" style="color: #d4a574; text-decoration: underline;">tableau de bord admin</a>.
              </p>
            </div>
            <div class="footer">
              <p>Essence Féminine - Système de gestion des commandes</p>
              <p>Cet email a été envoyé automatiquement, merci de ne pas y répondre.</p>
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
      { error: 'Une erreur inattendue est survenue', details: error.message },
      { status: 500 }
    );
  }
}

