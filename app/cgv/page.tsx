export default function CGVPage() {
  return (
    <div className="section-padding bg-beige-light min-h-screen">
      <div className="container-custom max-w-4xl">
        <h1 className="font-elegant text-4xl md:text-5xl text-brown-dark mb-12 text-center">
          Algemene verkoopvoorwaarden
        </h1>

        <div className="bg-white-cream rounded-2xl p-8 md:p-12 shadow-md space-y-8 text-brown-soft leading-relaxed">
          <section>
            <h2 className="font-elegant text-2xl text-brown-dark mb-4">1. Onderwerp</h2>
            <p>
              De onderhavige Algemene Verkoopvoorwaarden (AV) regelen de relaties tussen Her Essence B.V., 
              een in Nederland gevestigd bedrijf, en de klanten die aankopen doen op de website heressence.nl.
            </p>
          </section>

          <section>
            <h2 className="font-elegant text-2xl text-brown-dark mb-4">2. Betrouwbaarheid en legitimiteit</h2>
            <p>
              Her Essence B.V. is een betrouwbaar en volledig gecertificeerd bedrijf gevestigd in Nederland. 
              Wij nemen volledige verantwoordelijkheid voor onze dienstverlening en producten. Onze winkel 
              voldoet aan alle wettelijke vereisten voor e-commerce activiteiten in Nederland en Europa. 
              Klanten kunnen met vertrouwen winkelen bij Her Essence, aangezien wij garant staan voor de 
              kwaliteit van onze producten en de veiligheid van uw persoonlijke gegevens.
            </p>
          </section>

          <section>
            <h2 className="font-elegant text-2xl text-brown-dark mb-4">3. Aanvaarding van de voorwaarden</h2>
            <p>
              Elke bestelling impliceert de onvoorbehoudelijke aanvaarding van de onderhavige AV. Deze voorwaarden hebben 
              voorrang op alle andere voorwaarden, tenzij schriftelijk anders overeengekomen.
            </p>
          </section>

          <section>
            <h2 className="font-elegant text-2xl text-brown-dark mb-4">4. Prijzen</h2>
            <p>
              De op de website vermelde prijzen zijn uitgedrukt in euro's, inclusief alle belastingen (btw inbegrepen). 
              De prijzen zijn geldig uitsluitend voor bestellingen geplaatst via de website. 
              Her Essence behoudt zich het recht voor om de prijzen op elk moment te wijzigen, met het begrip 
              dat de prijs op het moment van bestelling de enige toepasselijke prijs is voor de koper.
            </p>
          </section>

          <section>
            <h2 className="font-elegant text-2xl text-brown-dark mb-4">5. Bestelling</h2>
            <p>
              Elke bestelling betekent aanvaarding van de prijzen en beschrijvingen van de producten die te koop zijn. De bevestiging van uw bestelling geldt als bevestiging hiervan. De verkoop wordt pas als definitief beschouwd nadat de status van de bestelling is veranderd naar "In behandeling", wat de acceptatie van de bestelling door Her Essence bevestigt.
            </p>
          </section>

          <section>
            <h2 className="font-elegant text-2xl text-brown-dark mb-4">6. Betaling</h2>
            <p>
              De betaling gebeurt uitsluitend via bankoverschrijving, uitgevoerd door de klant zelf. Na het plaatsen van de bestelling, verandert de status van uw bestelling van "Verificatie" naar "In behandeling". Zodra uw betalingsbewijs is goedgekeurd, verandert de status naar "Verzonden" wanneer uw pakket onderweg is naar u. Zodra het pakket is ontvangen, verandert de status van de bestelling naar "Geleverd".
            </p>
          </section>

          <section>
            <h2 className="font-elegant text-2xl text-brown-dark mb-4">7. Levering</h2>
            <p>
              De vermelde leveringstermijnen zijn slechts indicatief en worden niet gegarandeerd. 
              In geval van vertraging bij de levering zal Her Essence de klant per e-mail informeren. De risico's gaan 
              over op de klant op het moment van levering. De levering vindt plaats op het adres 
              dat de klant heeft opgegeven bij het plaatsen van de bestelling.
            </p>
          </section>

          <section>
            <h2 className="font-elegant text-2xl text-brown-dark mb-4">8. Herroepingsrecht</h2>
            <p>
              Overeenkomstig de Europese wetgeving beschikt de klant over een herroepingsrecht van 14 dagen, 
              te rekenen vanaf de dag na ontvangst van de bestelling, zonder dat motivering vereist is. 
              Na 14 dagen na levering is retourneren niet langer mogelijk. De retourkosten zijn voor rekening van de klant, 
              tenzij het product defect is.
            </p>
          </section>

          <section>
            <h2 className="font-elegant text-2xl text-brown-dark mb-4">9. Intellectueel eigendom</h2>
            <p>
              Deze website valt onder de Nederlandse en internationale wetgeving betreffende het 
              auteursrecht en intellectuele eigendom. Alle reproductierechten zijn voorbehouden.
            </p>
          </section>

          <section>
            <h2 className="font-elegant text-2xl text-brown-dark mb-4">10. Persoonsgegevens</h2>
            <p>
              De verzamelde persoonsgegevens zijn nodig voor de verwerking van uw bestelling. 
              Ze worden veilig opgeslagen en nooit gedeeld met derden. 
              Overeenkomstig de AVG beschikt u over een recht op inzage, rectificatie en verwijdering 
              van uw gegevens.
            </p>
          </section>

          <section>
            <h2 className="font-elegant text-2xl text-brown-dark mb-4">11. Geschillen</h2>
            <p>
              De onderhavige AV worden beheerst door het Nederlandse recht. In geval van geschil, en na 
              poging tot schikking, zullen de bevoegde rechterlijke instanties in Amsterdam, Nederland, 
              bevoegd zijn.
            </p>
          </section>

          <section className="pt-4 border-t border-nude">
            <p className="text-sm text-brown-soft/80">
              Laatste update : {new Date().toLocaleDateString('nl-NL', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

