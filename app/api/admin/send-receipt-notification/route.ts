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
    const { orderId, orderNumber, receiptUrl, customerName, totalAmount } = body;

    if (!orderId || !orderNumber || !receiptUrl) {
      return NextResponse.json(
        { error: 'Données manquantes' },
        { status: 400 }
      );
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
    
    // Envoyer l'email à l'admin
    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'Essence Féminine <noreply@essencefeminine.nl>',
      to: adminEmail,
      subject: `Nouveau reçu de virement - Commande ${orderNumber}`,
      html: `
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
                <p><a href="${receiptUrl}" target="_blank" style="color: #d4a574; text-decoration: underline;">Voir le reçu complet</a></p>
                <img src="${receiptUrl}" alt="Reçu de virement" style="max-width: 100%; height: auto; border-radius: 8px; margin-top: 10px;" />
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
      `,
    });

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

