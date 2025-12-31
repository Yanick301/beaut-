export default function LegalNoticePage() {
  return (
    <div className="section-padding bg-beige-light min-h-screen">
      <div className="container-custom max-w-4xl">
        <h1 className="font-elegant text-4xl md:text-5xl text-brown-dark mb-12 text-center">
          Juridische informatie
        </h1>

        <div className="bg-white-cream rounded-2xl p-8 md:p-12 shadow-md space-y-8 text-brown-soft leading-relaxed">
          <section>
            <h2 className="font-elegant text-2xl text-brown-dark mb-4">1. Juridische informatie</h2>
            <div className="space-y-2">
              <p><strong>Bedrijfsnaam :</strong> Her Essence B.V.</p>
              <p><strong>Rechtsvorm :</strong> Besloten vennootschap (B.V.)</p>
              <p><strong>Maatschappelijke zetel :</strong> Herengracht 123, 1015 Amsterdam, Nederland</p>
              <p><strong>KVK-nummer :</strong> NL 1234.567.890.B</p>
              <p><strong>BTW-nummer :</strong> NL 1234.567.890.B</p>
              <p><strong>Email :</strong> contact@heressence.nl</p>
            </div>
          </section>

          <section>
            <h2 className="font-elegant text-2xl text-brown-dark mb-4">2. Uitgever</h2>
            <p>
              De uitgever is de wettelijke vertegenwoordiger van Her Essence B.V.
            </p>
          </section>

          <section>
            <h2 className="font-elegant text-2xl text-brown-dark mb-4">3. Hosting</h2>
            <p>
              De website heressence.nl wordt gehost door een hostingprovider die voldoet aan de 
              beveiligings- en gegevensbeschermingsnormen zoals geldend in Europa.
            </p>
          </section>

          <section>
            <h2 className="font-elegant text-2xl text-brown-dark mb-4">4. Intellectueel eigendom</h2>
            <p>
              Deze website valt onder de Nederlandse en internationale wetgeving betreffende het 
              auteursrecht en intellectuele eigendom. Alle reproductierechten zijn voorbehouden, 
              inclusief voor downloadbare documenten en iconografische en fotografische weergaven.
            </p>
            <p className="mt-3">
              De reproductie van geheel of gedeeltelijk van deze website op welk elektronisch medium dan ook 
              is uitdrukkelijk verboden tenzij met schriftelijke toestemming van de uitgever.
            </p>
          </section>

          <section>
            <h2 className="font-elegant text-2xl text-brown-dark mb-4">5. Aansprakelijkheid</h2>
            <p>
              Her Essence B.V. streeft ernaar om de juistheid en actualiteit van de informatie op deze website 
              te garanderen, en behoudt zich het recht voor om op elk moment en zonder voorafgaande kennisgeving 
              de inhoud te wijzigen. Echter, Her Essence B.V. kan niet garanderen dat de informatie op deze website 
              volledig, nauwkeurig of actueel is.
            </p>
            <p className="mt-3">
              Derhalve is Her Essence B.V. niet aansprakelijk voor enige schade voortvloeiend uit een 
              frauduleuze inbraak door een derde partij die heeft geleid tot wijziging van de informatie op 
              de website of voor enige schade, direct of indirect, van welke aard dan ook, veroorzaakt 
              door toegang tot de website of de onmogelijkheid daartoe.
            </p>
          </section>

          <section>
            <h2 className="font-elegant text-2xl text-brown-dark mb-4">6. Hypertext links</h2>
            <p>
              Het plaatsen van een hyperlink naar de website heressence.nl vereist een voorafgaande 
              schriftelijke toestemming van Her Essence B.V. De hyperlinks naar andere websites vanaf 
              heressence.nl kunnen in geen geval de aansprakelijkheid van Her Essence B.V. oproepen.
            </p>
          </section>

          <section>
            <h2 className="font-elegant text-2xl text-brown-dark mb-4">7. Toepasselijk recht</h2>
            <p>
              De onderhavige juridische bepalingen worden beheerst door het Nederlandse recht. In geval van 
              geschil en bij gebrek aan een schikking, wordt het geschil voorgelegd aan de bevoegde rechter 
              in Amsterdam, overeenkomstig de van toepassing zijnde bevoegdheidsregels.
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

