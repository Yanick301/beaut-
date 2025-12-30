export default function PrivacyPage() {
  return (
    <div className="section-padding bg-beige-light min-h-screen">
      <div className="container-custom max-w-4xl">
        <h1 className="font-elegant text-4xl md:text-5xl text-brown-dark mb-4 text-center">
          Politique de Confidentialité
        </h1>
        <p className="text-center text-brown-soft mb-12">
          Conformément au Règlement Général sur la Protection des Données (RGPD)
        </p>

        <div className="bg-white-cream rounded-2xl p-8 md:p-12 shadow-md space-y-8 text-brown-soft leading-relaxed">
          <section>
            <h2 className="font-elegant text-2xl text-brown-dark mb-4">1. Responsable du traitement</h2>
            <p>
              Essence Féminine S.P.R.L., située à Bruxelles, Belgique, est responsable du traitement de vos données personnelles. 
              Nous nous engageons à protéger votre vie privée et à traiter vos données personnelles en toute sécurité 
              et conformément au RGPD et à la législation belge en matière de protection des données.
            </p>
          </section>

          <section>
            <h2 className="font-elegant text-2xl text-brown-dark mb-4">2. Données collectées</h2>
            <p className="mb-3">Nous collectons les données suivantes :</p>
            <ul className="space-y-2 ml-6 list-disc">
              <li>Nom, prénom, adresse email</li>
              <li>Adresse postale et numéro de téléphone</li>
              <li>Données de paiement (traitées de manière sécurisée par nos prestataires)</li>
              <li>Historique de commandes</li>
              <li>Données de navigation (cookies, adresse IP)</li>
            </ul>
          </section>

          <section>
            <h2 className="font-elegant text-2xl text-brown-dark mb-4">3. Finalités du traitement</h2>
            <p className="mb-3">Vos données personnelles sont utilisées pour :</p>
            <ul className="space-y-2 ml-6 list-disc">
              <li>Le traitement et la livraison de vos commandes</li>
              <li>La gestion de votre compte client</li>
              <li>L&apos;amélioration de nos services et de votre expérience</li>
              <li>L&apos;envoi de communications marketing (avec votre consentement)</li>
              <li>Le respect de nos obligations légales</li>
            </ul>
          </section>

          <section>
            <h2 className="font-elegant text-2xl text-brown-dark mb-4">4. Base légale</h2>
            <p>
              Le traitement de vos données personnelles est fondé sur l&apos;exécution d&apos;un contrat (traitement de votre commande), 
              votre consentement (marketing), nos intérêts légitimes (amélioration des services) et le respect de nos obligations légales.
            </p>
          </section>

          <section>
            <h2 className="font-elegant text-2xl text-brown-dark mb-4">5. Conservation des données</h2>
            <p>
              Nous conservons vos données personnelles uniquement le temps nécessaire aux finalités pour lesquelles elles ont été 
              collectées, et conformément aux obligations légales applicables. Les données de commande sont conservées pendant 
              10 ans conformément aux obligations comptables belges.
            </p>
          </section>

          <section>
            <h2 className="font-elegant text-2xl text-brown-dark mb-4">6. Vos droits</h2>
            <p className="mb-3">Conformément au RGPD, vous disposez des droits suivants :</p>
            <ul className="space-y-2 ml-6 list-disc">
              <li><strong>Droit d&apos;accès :</strong> Vous pouvez demander une copie de vos données personnelles</li>
              <li><strong>Droit de rectification :</strong> Vous pouvez corriger vos données inexactes</li>
              <li><strong>Droit à l&apos;effacement :</strong> Vous pouvez demander la suppression de vos données</li>
              <li><strong>Droit à la portabilité :</strong> Vous pouvez récupérer vos données dans un format structuré</li>
              <li><strong>Droit d&apos;opposition :</strong> Vous pouvez vous opposer au traitement de vos données</li>
              <li><strong>Droit à la limitation :</strong> Vous pouvez demander la limitation du traitement</li>
              <li><strong>Droit de retirer votre consentement :</strong> À tout moment pour les communications marketing</li>
            </ul>
            <p className="mt-4">
              Pour exercer ces droits, contactez-nous à : contact@essencefeminine.be ou par courrier à notre adresse 
              (Avenue Louise 123, 1050 Bruxelles, Belgique). Nous nous engageons à répondre à votre demande dans les meilleurs délais.
            </p>
          </section>

          <section>
            <h2 className="font-elegant text-2xl text-brown-dark mb-4">7. Cookies</h2>
            <p>
              Notre site utilise des cookies pour améliorer votre expérience de navigation et analyser le trafic. 
              Vous pouvez gérer vos préférences de cookies dans les paramètres de votre navigateur.
            </p>
          </section>

          <section>
            <h2 className="font-elegant text-2xl text-brown-dark mb-4">8. Partage des données</h2>
            <p>
              Nous ne vendons jamais vos données personnelles. Nous pouvons partager vos données avec nos prestataires 
              de services (livraison, paiement) dans le strict cadre de l&apos;exécution de votre commande. Tous nos partenaires 
              sont conformes au RGPD et opèrent en Europe.
            </p>
          </section>

          <section>
            <h2 className="font-elegant text-2xl text-brown-dark mb-4">9. Sécurité</h2>
            <p>
              Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données 
              personnelles contre tout accès non autorisé, perte ou destruction. Toutes les transactions sont sécurisées 
              et cryptées selon les standards européens.
            </p>
          </section>

          <section>
            <h2 className="font-elegant text-2xl text-brown-dark mb-4">10. Contact</h2>
            <p>
              Pour toute question concernant cette politique de confidentialité ou le traitement de vos données personnelles, 
              contactez-nous à : contact@essencefeminine.be. Nous nous engageons à vous répondre dans les meilleurs délais.
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


