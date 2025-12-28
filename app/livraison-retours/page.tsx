import { FiTruck, FiPackage, FiRefreshCw, FiShield } from 'react-icons/fi';

export default function DeliveryReturnsPage() {
  return (
    <div className="section-padding bg-beige-light min-h-screen">
      <div className="container-custom max-w-4xl">
        <h1 className="font-elegant text-4xl md:text-5xl text-brown-dark mb-12 text-center">
          Livraison & Retours
        </h1>

        {/* Delivery */}
        <section className="bg-white-cream rounded-2xl p-8 md:p-12 shadow-md mb-12">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-rose-soft/20 rounded-full flex items-center justify-center">
              <FiTruck className="w-8 h-8 text-rose-soft" />
            </div>
            <h2 className="font-elegant text-3xl text-brown-dark">Livraison</h2>
          </div>

          <div className="space-y-6 text-brown-soft leading-relaxed">
            <div>
              <h3 className="font-semibold text-brown-dark text-xl mb-3">Délais de livraison</h3>
              <ul className="space-y-2 ml-4">
                <li className="list-disc">
                  <strong>Pays-Bas :</strong> 2-3 jours ouvrés (livraison standard), 1 jour ouvré (livraison express)
                </li>
                <li className="list-disc">
                  <strong>Belgique :</strong> 3-4 jours ouvrés
                </li>
                <li className="list-disc">
                  <strong>France, Allemagne :</strong> 4-5 jours ouvrés
                </li>
                <li className="list-disc">
                  <strong>Autres pays européens :</strong> 5-7 jours ouvrés
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-brown-dark text-xl mb-3">Frais de livraison</h3>
              <ul className="space-y-2 ml-4">
                <li className="list-disc">
                  <strong>Livraison gratuite</strong> pour toute commande supérieure à €50
                </li>
                <li className="list-disc">
                  <strong>Livraison standard :</strong> €5,99 (Pays-Bas) / €7,99 (Europe)
                </li>
                <li className="list-disc">
                  <strong>Livraison express :</strong> €9,99 (Pays-Bas uniquement)
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-brown-dark text-xl mb-3">Suivi de commande</h3>
              <p>
                Une fois votre commande expédiée, vous recevrez un email avec votre numéro de suivi. 
                Vous pourrez suivre votre colis en temps réel jusqu'à sa livraison.
              </p>
            </div>
          </div>
        </section>

        {/* Returns */}
        <section className="bg-white-cream rounded-2xl p-8 md:p-12 shadow-md mb-12">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-rose-soft/20 rounded-full flex items-center justify-center">
              <FiRefreshCw className="w-8 h-8 text-rose-soft" />
            </div>
            <h2 className="font-elegant text-3xl text-brown-dark">Retours & Échanges</h2>
          </div>

          <div className="space-y-6 text-brown-soft leading-relaxed">
            <div>
              <h3 className="font-semibold text-brown-dark text-xl mb-3">Droit de rétractation</h3>
              <p>
                Conformément à la législation européenne, vous disposez d'un délai de 14 jours 
                à compter de la réception de votre commande pour exercer votre droit de rétractation, 
                sans avoir à justifier de motifs ni à payer de pénalité.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-brown-dark text-xl mb-3">Conditions de retour</h3>
              <ul className="space-y-2 ml-4">
                <li className="list-disc">Les produits doivent être retournés dans leur emballage d'origine</li>
                <li className="list-disc">Les produits doivent être non utilisés et dans leur état d'origine</li>
                <li className="list-disc">Les produits d'hygiène intime et les produits personnalisés ne peuvent pas être retournés</li>
                <li className="list-disc">Le retour doit être effectué dans un délai de 30 jours après réception</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-brown-dark text-xl mb-3">Procédure de retour</h3>
              <ol className="space-y-2 ml-4 list-decimal">
                <li>Contactez-nous à contact@essencefeminine.nl avec votre numéro de commande</li>
                <li>Nous vous enverrons une étiquette de retour (si applicable)</li>
                <li>Emballez soigneusement les articles à retourner</li>
                <li>Envoyez le colis à l'adresse fournie</li>
                <li>Dès réception, nous procéderons au remboursement sous 14 jours</li>
              </ol>
            </div>

            <div>
              <h3 className="font-semibold text-brown-dark text-xl mb-3">Frais de retour</h3>
              <p>
                Les frais de retour sont à votre charge, sauf en cas de produit défectueux, 
                d'erreur de notre part ou de non-conformité du produit avec sa description.
              </p>
            </div>
          </div>
        </section>

        {/* Warranty */}
        <section className="bg-gradient-to-r from-rose-powder to-beige rounded-2xl p-8 md:p-12 shadow-md">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-white-cream/50 rounded-full flex items-center justify-center">
              <FiShield className="w-8 h-8 text-brown-dark" />
            </div>
            <h2 className="font-elegant text-3xl text-brown-dark">Garantie</h2>
          </div>

          <p className="text-brown-dark leading-relaxed text-lg">
            Tous nos produits sont garantis conformes à leur description. En cas de produit défectueux 
            ou non conforme, nous garantissons le remboursement complet ou l'échange sans frais. 
            N'hésitez pas à nous contacter pour toute question concernant votre commande.
          </p>
        </section>
      </div>
    </div>
  );
}

