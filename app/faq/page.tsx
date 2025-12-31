'use client';

import { useState } from 'react';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: 'Wat zijn de leveringstermijnen?',
    answer: 'De standaard levering duurt 2-3 werkdagen in België. De levering is gratis vanaf €150 bestelling, anders zijn de verzendkosten €2,99. We leveren enkel in België.',
  },
  {
    question: 'Welke betalingsmethodes accepteert u?',
    answer: 'We accepteren bankkaarten (Visa, Mastercard, Bancontact), overschrijvingen en PayPal. Alle betalingen zijn beveiligd en versleuteld.',
  },
  {
    question: 'Kan ik een product retourneren?',
    answer: 'Ja, u heeft 30 dagen na ontvangst om een ongeopend product in originele verpakking terug te sturen. Retourkosten zijn voor uw rekening, tenzij het product defect is.',
  },
  {
    question: 'Worden uw producten getest op dieren?',
    answer: 'Nee, absoluut niet. Al onze producten zijn cruelty-free en wij zorgen ervoor dat er nooit op dieren wordt getest.',
  },
  {
    question: 'Zijn de producten geschikt voor alle huidtypes?',
    answer: 'Elk product geeft de aanbevolen huidtypes aan in de beschrijving. We bieden een breed scala aan dat geschikt is voor gevoelige, droge, meng- en oliehuid. Aarzel niet om contact met ons op te nemen voor persoonlijk advies.',
  },
  {
    question: 'Hoe kan ik mijn bestelling volgen?',
    answer: 'Zodra uw bestelling verzonden is, ontvangt u een e-mail met een track & trace nummer en een link om uw pakket in real-time te volgen.',
  },
  {
    question: 'Biedt u monsters aan?',
    answer: 'Ja, sommige producten bevatten monsters in uw bestelling. U kunt deze ook toevoegen bij het afrekenen indien beschikbaar.',
  },
  {
    question: 'Que faire en cas de problème avec ma commande ?',
    answer: 'Neem onmiddellijk contact met ons op via contact@heressence.nl. Ons team lost het probleem snel op en reageert binnen 24 werkdagen.'
  },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="section-padding bg-beige-light min-h-screen">
      <div className="container-custom max-w-4xl">
        <h1 className="font-elegant text-4xl md:text-5xl text-brown-dark mb-4 text-center">
          Veelgestelde Vragen
        </h1>
        <p className="text-lg text-brown-soft text-center mb-12 max-w-2xl mx-auto">
          Vind snel antwoord op uw meest gestelde vragen
        </p>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white-cream rounded-2xl shadow-md overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full p-6 flex items-center justify-between text-left hover:bg-beige transition"
              >
                <span className="font-semibold text-brown-dark text-lg pr-8">
                  {faq.question}
                </span>
                {openIndex === index ? (
                  <FiChevronUp className="w-6 h-6 text-rose-soft flex-shrink-0" />
                ) : (
                  <FiChevronDown className="w-6 h-6 text-rose-soft flex-shrink-0" />
                )}
              </button>
              {openIndex === index && (
                <div className="px-6 pb-6">
                  <p className="text-brown-soft leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 bg-gradient-to-r from-rose-powder to-beige rounded-2xl p-8 text-center">
          <h2 className="font-elegant text-2xl text-brown-dark mb-4">
            Vindt u uw antwoord niet?
          </h2>
          <p className="text-brown-soft mb-6">
            Ons team staat klaar om u te helpen
          </p>
          <a href="/contact" className="btn-primary">
            Neem contact met ons op
          </a>
        </div>
      </div>
    </div>
  );
}

