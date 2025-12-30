export default function LegalNoticePage() {
  return (
    <div className="section-padding bg-beige-light min-h-screen">
      <div className="container-custom max-w-4xl">
        <h1 className="font-elegant text-4xl md:text-5xl text-brown-dark mb-12 text-center">
          Mentions Légales
        </h1>

        <div className="bg-white-cream rounded-2xl p-8 md:p-12 shadow-md space-y-8 text-brown-soft leading-relaxed">
          <section>
            <h2 className="font-elegant text-2xl text-brown-dark mb-4">1. Informations légales</h2>
            <div className="space-y-2">
              <p><strong>Raison sociale :</strong> Essence Féminine S.P.R.L.</p>
              <p><strong>Forme juridique :</strong> Société à responsabilité limitée (S.P.R.L.)</p>
              <p><strong>Siège social :</strong> Avenue Louise 123, 1050 Bruxelles, Belgique</p>
              <p><strong>Numéro d'entreprise BCE :</strong> BE 1234.567.890</p>
              <p><strong>Numéro TVA :</strong> BE 1234.567.890</p>
              <p><strong>Email :</strong> contact@essencefeminine.be</p>
            </div>
          </section>

          <section>
            <h2 className="font-elegant text-2xl text-brown-dark mb-4">2. Directeur de publication</h2>
            <p>
              Le directeur de la publication est le représentant légal de Essence Féminine S.P.R.L.
            </p>
          </section>

          <section>
            <h2 className="font-elegant text-2xl text-brown-dark mb-4">3. Hébergement</h2>
            <p>
              Le site essencefeminine.be est hébergé par un prestataire d'hébergement conforme aux normes 
              de sécurité et de protection des données en vigueur en Europe.
            </p>
          </section>

          <section>
            <h2 className="font-elegant text-2xl text-brown-dark mb-4">4. Propriété intellectuelle</h2>
            <p>
              L'ensemble de ce site relève de la législation belge et internationale sur le droit 
              d'auteur et la propriété intellectuelle. Tous les droits de reproduction sont réservés, 
              y compris pour les documents téléchargeables et les représentations iconographiques et photographiques.
            </p>
            <p className="mt-3">
              La reproduction de tout ou partie de ce site sur un support électronique quel qu'il soit 
              est formellement interdite sauf autorisation expresse du directeur de publication.
            </p>
          </section>

          <section>
            <h2 className="font-elegant text-2xl text-brown-dark mb-4">5. Responsabilité</h2>
            <p>
              Essence Féminine S.P.R.L. s'efforce d'assurer l'exactitude et la mise à jour des informations diffusées 
              sur ce site, dont elle se réserve le droit de corriger, à tout moment et sans préavis, le contenu. 
              Toutefois, Essence Féminine S.P.R.L. ne peut garantir l'exactitude, la précision ou l'exhaustivité des 
              informations mises à disposition sur ce site.
            </p>
            <p className="mt-3">
              En conséquence, Essence Féminine S.P.R.L. décline toute responsabilité pour tout dommage résultant d'une 
              intrusion frauduleuse d'un tiers ayant entraîné une modification des informations mises à disposition 
              sur le site ou pour tout dommage, direct ou indirect, quelle qu'en soit la cause, l'origine, la nature 
              ou les conséquences, provoqué à raison de l'accès de quiconque au site ou de l'impossibilité d'y accéder.
            </p>
          </section>

          <section>
            <h2 className="font-elegant text-2xl text-brown-dark mb-4">6. Liens hypertextes</h2>
            <p>
              La mise en place d'un lien hypertexte vers le site essencefeminine.be nécessite une autorisation 
              préalable écrite de Essence Féminine S.P.R.L. Les liens hypertextes mis en place en direction d'autres sites 
              à partir de essencefeminine.be ne sauraient, en aucun cas, engager la responsabilité de Essence Féminine S.P.R.L.
            </p>
          </section>

          <section>
            <h2 className="font-elegant text-2xl text-brown-dark mb-4">7. Droit applicable</h2>
            <p>
              Les présentes mentions légales sont régies par le droit belge. En cas de litige et à défaut 
              d'accord amiable, le litige sera porté devant les tribunaux compétents de Bruxelles, conformément 
              aux règles de compétence en vigueur.
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

