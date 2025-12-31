export default function PrivacyPage() {
  return (
    <div className="section-padding bg-beige-light min-h-screen">
      <div className="container-custom max-w-4xl">
        <h1 className="font-elegant text-4xl md:text-5xl text-brown-dark mb-4 text-center">
          Privacybeleid
        </h1>
        <p className="text-center text-brown-soft mb-12">
          Overeenkomstig de Algemene Verordening Gegevensbescherming (AVG)
        </p>

        <div className="bg-white-cream rounded-2xl p-8 md:p-12 shadow-md space-y-8 text-brown-soft leading-relaxed">
          <section>
            <h2 className="font-elegant text-2xl text-brown-dark mb-4">1. Verantwoordelijke voor de verwerking</h2>
            <p>
              Her Essence B.V., gevestigd in Amsterdam, Nederland, is verantwoordelijk voor de verwerking van uw persoonsgegevens. 
              Wij verbinden ons ertoe uw privacy te beschermen en uw persoonsgegevens op een veilige manier te verwerken 
              en conform de AVG en de Nederlandse wetgeving op het gebied van gegevensbescherming.
            </p>
          </section>

          <section>
            <h2 className="font-elegant text-2xl text-brown-dark mb-4">2. Verzamelde gegevens</h2>
            <p className="mb-3">Wij verzamelen de volgende gegevens :</p>
            <ul className="space-y-2 ml-6 list-disc">
              <li>Naam, voornaam, e-mailadres</li>
              <li>Postadres en telefoonnummer</li>
              <li>Betalingsgegevens (veilig verwerkt door onze dienstverleners)</li>
              <li>Bestelgeschiedenis</li>
              <li>Navigatiegegevens (cookies, IP-adres)</li>
            </ul>
          </section>

          <section>
            <h2 className="font-elegant text-2xl text-brown-dark mb-4">3. Doeleinden van de verwerking</h2>
            <p className="mb-3">Uw persoonsgegevens worden gebruikt voor :</p>
            <ul className="space-y-2 ml-6 list-disc">
              <li>De verwerking en levering van uw bestellingen</li>
              <li>Het beheer van uw klantaccount</li>
              <li>De verbetering van onze diensten en uw ervaring</li>
              <li>Het verzenden van marketingcommunicatie (met uw toestemming)</li>
              <li>Het nakomen van onze wettelijke verplichtingen</li>
            </ul>
          </section>

          <section>
            <h2 className="font-elegant text-2xl text-brown-dark mb-4">4. Wettelijke grondslag</h2>
            <p>
              De verwerking van uw persoonsgegevens is gebaseerd op de uitvoering van een contract (verwerking van uw bestelling), 
              uw toestemming (marketing), onze gerechtvaardigde belangen (verbetering van diensten) en het nakomen van onze wettelijke verplichtingen.
            </p>
          </section>

          <section>
            <h2 className="font-elegant text-2xl text-brown-dark mb-4">5. Bewaring van gegevens</h2>
            <p>
              Wij bewaren uw persoonsgegevens uitsluitend zolang als nodig is voor de doeleinden waarvoor ze zijn 
              verzameld, en conform de toepasselijke wettelijke verplichtingen. Bestelgegevens worden bewaard gedurende 
              10 jaar conform de Belgische boekhoudverplichtingen.
            </p>
          </section>

          <section>
            <h2 className="font-elegant text-2xl text-brown-dark mb-4">6. Uw rechten</h2>
            <p className="mb-3">Overeenkomstig de AVG beschikt u over de volgende rechten :</p>
            <ul className="space-y-2 ml-6 list-disc">
              <li><strong>Inzage recht :</strong> U kunt een kopie van uw persoonsgegevens aanvragen</li>
              <li><strong>Rectificatie recht :</strong> U kunt onjuiste gegevens corrigeren</li>
              <li><strong>Wischrecht :</strong> U kunt de verwijdering van uw gegevens aanvragen</li>
              <li><strong>Recht op gegevensoverdraagbaarheid :</strong> U kunt uw gegevens in een gestructureerd formaat ophalen</li>
              <li><strong>Verzetrecht :</strong> U kunt bezwaar maken tegen de verwerking van uw gegevens</li>
              <li><strong>Beperkingsrecht :</strong> U kunt beperking van de verwerking aanvragen</li>
              <li><strong>Recht om uw toestemming in te trekken :</strong> Te allen tijde voor marketingcommunicatie</li>
            </ul>
            <p className="mt-4">
              Om deze rechten uit te oefenen, kunt u contact met ons opnemen via: contact@heressence.nl of per post op ons adres 
              (Herengracht 123, 1015 Amsterdam, Nederland). Wij zullen ons inzetten om zo snel mogelijk op uw aanvraag te reageren.
            </p>
          </section>

          <section>
            <h2 className="font-elegant text-2xl text-brown-dark mb-4">7. Cookies</h2>
            <p>
              Onze website gebruikt cookies om uw surfervaring te verbeteren en verkeer te analyseren. 
              U kunt uw cookievoorkeuren beheren in de instellingen van uw browser.
            </p>
          </section>

          <section>
            <h2 className="font-elegant text-2xl text-brown-dark mb-4">8. Delen van gegevens</h2>
            <p>
              Wij verkopen uw persoonsgegevens nooit. Wij kunnen uw gegevens delen met onze dienstverleners 
              (verzending, betaling) binnen het strikte kader van de uitvoering van uw bestelling. Al onze partners 
              zijn AVG-conform en opereren in Europa.
            </p>
          </section>

          <section>
            <h2 className="font-elegant text-2xl text-brown-dark mb-4">9. Beveiliging</h2>
            <p>
              Wij nemen passende technische en organisatorische maatregelen om uw gegevens 
              te beschermen tegen ongeoorloofde toegang, verlies of vernietiging. Alle transacties zijn beveiligd 
              en versleuteld volgens de Europese normen.
            </p>
          </section>

          <section>
            <h2 className="font-elegant text-2xl text-brown-dark mb-4">10. Contact</h2>
            <p>
              Voor vragen over dit privacybeleid of de verwerking van uw persoonsgegevens, 
              kunt u contact met ons opnemen via: contact@heressence.nl. Wij zullen ons inzetten om u zo snel mogelijk te antwoorden.
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


