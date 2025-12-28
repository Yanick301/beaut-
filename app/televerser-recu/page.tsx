'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { FiUpload, FiFile, FiCheckCircle, FiArrowLeft, FiX } from 'react-icons/fi';
import { createClient } from '@/lib/supabase/client';
import { useCartStore } from '@/lib/store';

function UploadReceiptContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const orderNumber = searchParams.get('orderNumber');
  const supabase = createClient();
  const { clearCart } = useCartStore();

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    async function loadOrder() {
      if (!orderId) {
        setError('Numéro de commande manquant');
        setLoading(false);
        return;
      }

      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push('/connexion');
          return;
        }

        const { data, error } = await supabase
          .from('orders')
          .select(`
            *,
            order_items (*)
          `)
          .eq('id', orderId)
          .eq('user_id', user.id)
          .single();

        if (error) throw error;
        if (!data) {
          setError('Commande non trouvée');
          setLoading(false);
          return;
        }

        setOrder(data);
      } catch (err: any) {
        console.error('Error loading order:', err);
        setError('Erreur lors du chargement de la commande');
      } finally {
        setLoading(false);
      }
    }

    loadOrder();
  }, [orderId, router, supabase]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // Vérifier le type de fichier
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'application/pdf'];
    if (!validTypes.includes(selectedFile.type)) {
      setError('Format de fichier non supporté. Veuillez téléverser une image (JPG, PNG, WEBP) ou un PDF.');
      return;
    }

    // Vérifier la taille (max 5MB)
    if (selectedFile.size > 5 * 1024 * 1024) {
      setError('Le fichier est trop volumineux. Taille maximale : 5MB');
      return;
    }

    setFile(selectedFile);
    setError(null);

    // Créer une preview pour les images
    if (selectedFile.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setPreview(null);
    }
  };

  const handleUpload = async () => {
    if (!file || !orderId) {
      setError('Veuillez sélectionner un fichier');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      // 1. Uploader le fichier vers Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${orderId}-${Date.now()}.${fileExt}`;
      const filePath = `receipts/${fileName}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('receipts')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      // 2. Obtenir l'URL publique du fichier
      const { data: { publicUrl } } = supabase.storage
        .from('receipts')
        .getPublicUrl(filePath);

      // 3. Mettre à jour la commande avec le reçu et le statut
      const { error: updateError } = await supabase
        .from('orders')
        .update({
          receipt_url: publicUrl,
          receipt_file_name: fileName,
          status: 'pending',
          payment_status: 'pending',
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId);

      if (updateError) throw updateError;

      // 4. Envoyer l'email à l'admin via l'API
      const response = await fetch('/api/admin/send-receipt-notification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId,
          orderNumber: order?.order_number || orderNumber,
          receiptUrl: publicUrl,
          receiptFileName: fileName,
          customerName: `${order?.shipping_address?.firstName || ''} ${order?.shipping_address?.lastName || ''}`.trim(),
          totalAmount: order?.total_amount,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        console.error('Error sending email to admin:', data);
        console.error('Response status:', response.status);
        // Ne pas bloquer si l'email échoue, le reçu est déjà uploadé
        // Mais afficher un avertissement
        alert('Reçu téléversé avec succès, mais l\'email à l\'admin n\'a pas pu être envoyé. Veuillez vérifier la configuration Resend.');
      } else {
        console.log('Email sent successfully to admin');
      }

      // Vider le panier maintenant que le reçu est téléversé
      clearCart();
      
      setSuccess(true);
      
      // Rediriger vers l'historique des commandes après 3 secondes
      setTimeout(() => {
        router.push('/compte?tab=orders');
      }, 3000);
    } catch (err: any) {
      console.error('Upload error:', err);
      setError(err.message || 'Erreur lors du téléversement du reçu');
      setUploading(false);
    }
  };

  const removeFile = () => {
    setFile(null);
    setPreview(null);
    setError(null);
  };

  if (loading) {
    return (
      <div className="section-padding bg-beige-light min-h-screen flex items-center justify-center">
        <div className="text-brown-soft">Chargement...</div>
      </div>
    );
  }

  if (error && !order) {
    return (
      <div className="section-padding bg-beige-light min-h-screen">
        <div className="container-custom max-w-2xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-700">{error}</p>
            <Link href="/compte" className="btn-primary mt-4 inline-block">
              Retour à mon compte
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="section-padding bg-beige-light min-h-screen">
        <div className="container-custom max-w-2xl mx-auto">
          <div className="bg-white-cream rounded-2xl p-12 text-center shadow-lg">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FiCheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h1 className="font-elegant text-4xl md:text-5xl text-brown-dark mb-4">
              Reçu téléversé avec succès !
            </h1>
            <p className="text-lg text-brown-soft mb-6">
              Votre reçu de virement a été reçu. Votre commande est maintenant <strong className="text-brown-dark">en attente de vérification</strong>.
            </p>
            <p className="text-base text-brown-soft mb-6">
              Nous allons vérifier votre reçu et confirmer votre commande sous peu. Vous recevrez un email de confirmation une fois que votre commande sera validée.
            </p>
            {orderNumber && (
              <p className="text-sm text-brown-soft mb-8">
                Numéro de commande : <span className="font-semibold text-brown-dark">{orderNumber}</span>
              </p>
            )}
            <p className="text-sm text-brown-soft mb-8">
              Vous serez automatiquement redirigé vers votre historique de commandes dans quelques secondes...
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/compte?tab=orders" className="btn-primary">
                Voir mes commandes maintenant
              </Link>
              <Link href="/" className="btn-secondary">
                Retour à l'accueil
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="section-padding bg-beige-light min-h-screen">
      <div className="container-custom max-w-5xl">
        <Link href="/checkout" className="flex items-center gap-2 text-brown-soft hover:text-brown-dark transition mb-8">
          <FiArrowLeft className="w-4 h-4" />
          Retour au checkout
        </Link>

        <h1 className="font-elegant text-4xl md:text-5xl text-brown-dark mb-8">
          Téléverser le reçu de virement
        </h1>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
          <p className="text-sm text-yellow-800">
            <strong>Rappel :</strong> Après avoir effectué le virement bancaire, veuillez téléverser une capture d'écran ou le reçu de virement ci-dessous.
            Votre commande sera traitée uniquement après validation du reçu par notre équipe.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white-cream rounded-2xl p-4 sm:p-6 shadow-md lg:sticky lg:top-24">
              <h2 className="font-elegant text-2xl text-brown-dark mb-6">Récapitulatif de commande</h2>
              
              {orderNumber && (
                <div className="mb-4 pb-4 border-b border-nude">
                  <p className="text-sm text-brown-soft">Numéro de commande</p>
                  <p className="text-lg font-semibold text-brown-dark">{orderNumber}</p>
                </div>
              )}

              {order?.order_items && (
                <div className="space-y-3 mb-6">
                  {order.order_items.map((item: any, index: number) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-brown-soft">
                        {item.product_name} x {item.quantity}
                      </span>
                      <span className="text-brown-dark">€{(parseFloat(item.price) * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="space-y-3 border-t border-nude pt-4">
                <div className="flex justify-between text-brown-soft">
                  <span>Sous-total</span>
                  <span>€{parseFloat(order?.total_amount || 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-brown-soft">
                  <span>Livraison</span>
                  <span>
                    {parseFloat(order?.shipping_cost || 0) === 0 ? (
                      <span className="text-rose-soft font-semibold">Gratuite</span>
                    ) : (
                      `€${parseFloat(order?.shipping_cost || 0).toFixed(2)}`
                    )}
                  </span>
                </div>
                <div className="border-t border-nude pt-4">
                  <div className="flex justify-between text-lg font-semibold text-brown-dark">
                    <span>Total</span>
                    <span>€{(parseFloat(order?.total_amount || 0) + parseFloat(order?.shipping_cost || 0)).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Upload Section */}
          <div className="lg:col-span-2">
            <div className="bg-white-cream rounded-2xl p-6 shadow-md">
              <h2 className="font-elegant text-2xl text-brown-dark mb-6">Valider ma commande</h2>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {error}
                </div>
              )}

              {!file ? (
                <div className="border-2 border-dashed border-nude rounded-lg p-12 text-center hover:border-rose-soft transition">
                  <input
                    type="file"
                    id="receipt-upload"
                    accept="image/jpeg,image/jpg,image/png,image/webp,application/pdf"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <label htmlFor="receipt-upload" className="cursor-pointer">
                    <FiUpload className="w-12 h-12 text-brown-soft mx-auto mb-4" />
                    <p className="text-brown-dark font-semibold mb-2">
                      Cliquez pour téléverser ou glissez-déposez
                    </p>
                    <p className="text-sm text-brown-soft">
                      Formats acceptés : JPG, PNG, WEBP, PDF (max 5MB)
                    </p>
                  </label>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="border-2 border-rose-soft rounded-lg p-4 bg-rose-soft/5">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <FiFile className="w-8 h-8 text-rose-soft" />
                        <div>
                          <p className="font-semibold text-brown-dark">{file.name}</p>
                          <p className="text-sm text-brown-soft">
                            {(file.size / 1024).toFixed(2)} KB
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={removeFile}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-full transition"
                        aria-label="Supprimer le fichier"
                      >
                        <FiX className="w-5 h-5" />
                      </button>
                    </div>

                    {preview && (
                      <div className="mt-4">
                        <p className="text-sm font-semibold text-brown-dark mb-2">Aperçu :</p>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={preview}
                          alt="Aperçu du reçu"
                          className="max-w-full h-auto rounded-lg border border-nude"
                        />
                      </div>
                    )}
                  </div>

                  <button
                    onClick={handleUpload}
                    disabled={uploading}
                    className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {uploading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Téléversement en cours...
                      </>
                    ) : (
                      <>
                        <FiCheckCircle className="w-5 h-5" />
                        Valider ma commande
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function UploadReceiptPage() {
  return (
    <Suspense fallback={
      <div className="section-padding bg-beige-light min-h-screen flex items-center justify-center">
        <div className="text-brown-soft">Chargement...</div>
      </div>
    }>
      <UploadReceiptContent />
    </Suspense>
  );
}

