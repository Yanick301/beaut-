import { FiTruck, FiPackage, FiRefreshCw, FiShield } from 'react-icons/fi';

export default function DeliveryReturnsPage() {
  return (
    <div className="section-padding bg-beige-light min-h-screen">
      <div className="container-custom max-w-4xl">
        <h1 className="font-elegant text-4xl md:text-5xl text-brown-dark mb-12 text-center">
          Verzending & Retour
        </h1>

        {/* Delivery */}
        <section className="bg-white-cream rounded-2xl p-8 md:p-12 shadow-md mb-12">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-rose-soft/20 rounded-full flex items-center justify-center">
              <FiTruck className="w-8 h-8 text-rose-soft" />
            </div>
            <h2 className="font-elegant text-3xl text-brown-dark">Verzending</h2>
          </div>

          <div className="space-y-6 text-brown-soft leading-relaxed">
            <div>
              <h3 className="font-semibold text-brown-dark text-xl mb-3">Leveringstermijnen</h3>
              <ul className="space-y-2 ml-4">
                <li className="list-disc">
                  <strong>Standaard levering :</strong> 2-3 werkdagen
                </li>
                <li className="list-disc">
                  <strong>Express levering :</strong> 1 werkdag
                </li>
              </ul>
              <p className="mt-3 text-brown-soft">
                <strong>Opmerking :</strong> Wij leveren alleen in Nederland.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-brown-dark text-xl mb-3">Verzendkosten</h3>
              <ul className="space-y-2 ml-4">
                <li className="list-disc">
                  <strong>Gratis verzending</strong> voor alle bestellingen van €150 of meer
                </li>
                <li className="list-disc">
                  <strong>Standaard verzending :</strong> €2,99 voor bestellingen onder de €150
                </li>
              </ul>
              <p className="mt-4 p-4 bg-rose-soft/10 border border-rose-soft/30 rounded-lg text-brown-dark">
                <strong>💡 Tip :</strong> Voeg producten toe aan uw winkelwagen om gratis verzending te krijgen vanaf €150!
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-brown-dark text-xl mb-3">Bestelling volgen</h3>
              <p>
                Zodra uw bestelling is verzonden, ontvangt u een e-mail met uw trackingnummer. 
                U kunt uw pakket in real-time volgen tot levering.
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
            <h2 className="font-elegant text-3xl text-brown-dark">Retour & Wissel</h2>
          </div>

          <div className="space-y-6 text-brown-soft leading-relaxed">
            <div>
              <h3 className="font-semibold text-brown-dark text-xl mb-3">Herroepingsrecht</h3>
              <p>
                Overeenkomstig de Europese wetgeving heeft u 14 dagen na ontvangst van uw bestelling om uw koop te herroepen, 
                zonder motivering te geven of een boete te betalen. Na 14 dagen na levering is retourneren niet langer mogelijk.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-brown-dark text-xl mb-3">Retourvoorwaarden</h3>
              <ul className="space-y-2 ml-4">
                <li className="list-disc">Producten moeten worden geretourneerd in de originele verpakking</li>
                <li className="list-disc">Producten moeten ongebruikt en in originele staat zijn</li>
                <li className="list-disc">Intieme hygiëneproducten en gepersonaliseerde producten kunnen niet worden geretourneerd</li>
                <li className="list-disc">De retour moet plaatsvinden binnen 14 dagen na levering</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-brown-dark text-xl mb-3">Retourprocedure</h3>
              <ol className="space-y-2 ml-4 list-decimal">
                <li>Neem contact met ons op via contact@heressence.nl met uw bestelnummer</li>
                <li>Wij sturen u een retourlabel (indien van toepassing)</li>
                <li>Verpak de te retourneren artikelen zorgvuldig</li>
                <li>Zend het pakket naar het opgegeven adres</li>
                <li>Bij ontvangst zullen wij de terugbetaling binnen 14 dagen verwerken</li>
              </ol>
            </div>

            <div>
              <h3 className="font-semibold text-brown-dark text-xl mb-3">Retourkosten</h3>
              <p>
                De retourkosten zijn voor uw rekening, behalve in geval van een defect product, 
                een fout van onze kant of een product dat niet overeenkomt met de beschrijving.
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
            Al onze producten worden gegarandeerd conform hun beschrijving geleverd. In geval van een defect product 
            of een afwijkend product, garanderen wij volledige terugbetaling of ruil zonder extra kosten. 
            Aarzel niet om contact met ons op te nemen voor vragen over uw bestelling.
          </p>
        </section>
      </div>
    </div>
  );
}

