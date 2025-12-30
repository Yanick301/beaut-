export default function CGVPage() {
  return (
    <div className="section-padding bg-beige-light min-h-screen">
      <div className="container-custom max-w-4xl">
        <h1 className="font-elegant text-4xl md:text-5xl text-brown-dark mb-12 text-center">
          Conditions Générales de Vente
        </h1>

        <div className="bg-white-cream rounded-2xl p-8 md:p-12 shadow-md space-y-8 text-brown-soft leading-relaxed">
          <section>
            <h2 className="font-elegant text-2xl text-brown-dark mb-4">1. Objet</h2>
            <p>
              Les présentes Conditions Générales de Vente (CGV) régissent les relations entre Essence Féminine S.P.R.L., 
              société immatriculée en Belgique, et les clients effectuant des achats sur le site essencefeminine.be.
            </p>
          </section>

          <section>
            <h2 className="font-elegant text-2xl text-brown-dark mb-4">2. Acceptation des conditions</h2>
            <p>
              Toute commande implique l'acceptation sans réserve des présentes CGV. Ces conditions prévalent 
              sur toute autre condition, sauf accord écrit contraire.
            </p>
          </section>

          <section>
            <h2 className="font-elegant text-2xl text-brown-dark mb-4">3. Prix</h2>
            <p>
              Les prix indiqués sur le site sont exprimés en euros, toutes taxes comprises (TVA incluse). 
              Les prix sont valables uniquement pour les commandes passées sur le site internet. 
              Essence Féminine se réserve le droit de modifier ses prix à tout moment, étant toutefois entendu 
              que le prix figurant au moment de la commande sera le seul applicable à l'acheteur.
            </p>
          </section>

          <section>
            <h2 className="font-elegant text-2xl text-brown-dark mb-4">4. Commande</h2>
            <p>
              Toute commande vaut acceptation des prix et descriptions des produits disponibles à la vente. 
              La validation de votre commande vaut confirmation de celle-ci. Un email de confirmation 
              vous sera envoyé. La vente ne sera considérée comme définitive qu'après l'envoi au client 
              de l'email de confirmation de l'acceptation de la commande par Essence Féminine.
            </p>
          </section>

          <section>
            <h2 className="font-elegant text-2xl text-brown-dark mb-4">5. Paiement</h2>
            <p>
              Le paiement s'effectue par carte bancaire (Visa, Mastercard, Bancontact), virement bancaire ou PayPal. 
              Le débit de la carte bancaire intervient au moment de la commande. En cas de paiement par virement bancaire, 
              les coordonnées bancaires vous seront communiquées par email. Tous les paiements sont sécurisés et cryptés.
            </p>
          </section>

          <section>
            <h2 className="font-elegant text-2xl text-brown-dark mb-4">6. Livraison</h2>
            <p>
              Les délais de livraison indiqués sont donnés à titre indicatif et ne sont pas garantis. 
              En cas de retard de livraison, Essence Féminine informera le client par email. Les risques sont 
              transférés au client au moment de la livraison. La livraison est effectuée à l'adresse 
              indiquée par le client lors de la commande.
            </p>
          </section>

          <section>
            <h2 className="font-elegant text-2xl text-brown-dark mb-4">7. Droit de rétractation</h2>
            <p>
              Conformément à la législation européenne, le client dispose d'un délai de 14 jours à compter 
              de la réception de sa commande pour exercer son droit de rétractation, sans avoir à justifier 
              de motifs. Les frais de retour sont à la charge du client, sauf en cas de produit défectueux.
            </p>
          </section>

          <section>
            <h2 className="font-elegant text-2xl text-brown-dark mb-4">8. Propriété intellectuelle</h2>
            <p>
              L'ensemble de ce site relève de la législation belge et internationale sur le droit 
              d'auteur et la propriété intellectuelle. Tous les droits de reproduction sont réservés.
            </p>
          </section>

          <section>
            <h2 className="font-elegant text-2xl text-brown-dark mb-4">9. Données personnelles</h2>
            <p>
              Les données personnelles collectées sont nécessaires au traitement de votre commande. 
              Elles sont conservées en toute sécurité et ne sont jamais communiquées à des tiers. 
              Conformément au RGPD, vous disposez d'un droit d'accès, de rectification et de suppression 
              de vos données.
            </p>
          </section>

          <section>
            <h2 className="font-elegant text-2xl text-brown-dark mb-4">10. Litiges</h2>
            <p>
              Les présentes CGV sont régies par le droit belge. En cas de litige, et après 
              tentative de résolution amiable, les tribunaux compétents seront ceux de Bruxelles, Belgique.
            </p>
          </section>

          <section className="pt-4 border-t border-nude">
            <p className="text-sm text-brown-soft/80">
              Dernière mise à jour : {new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

