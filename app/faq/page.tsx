'use client';

import { useState } from 'react';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: 'Quels sont les délais de livraison ?',
    answer: 'La livraison standard prend 2-3 jours ouvrés. La livraison express (1 jour ouvré) est disponible pour une majoration de €9,99. La livraison est gratuite dès €50 d\'achat. Nous livrons uniquement aux Pays-Bas.',
  },
  {
    question: 'Quels modes de paiement acceptez-vous ?',
    answer: 'Nous acceptons iDEAL, les cartes bancaires (Visa, Mastercard, American Express) et PayPal. Tous les paiements sont sécurisés et cryptés.',
  },
  {
    question: 'Puis-je retourner un produit ?',
    answer: 'Oui, vous disposez de 30 jours après réception pour retourner un produit non ouvert et dans son emballage d\'origine. Les frais de retour sont à votre charge, sauf en cas de produit défectueux.',
  },
  {
    question: 'Vos produits sont-ils testés sur les animaux ?',
    answer: 'Non, absolument pas. Tous nos produits sont cruelty-free et nous nous engageons à ne jamais tester sur les animaux.',
  },
  {
    question: 'Les produits sont-ils adaptés à tous les types de peau ?',
    answer: 'Chaque produit indique les types de peau recommandés dans sa description. Nous proposons une large gamme adaptée aux peaux sensibles, sèches, mixtes et grasses. N\'hésitez pas à nous contacter pour des conseils personnalisés.',
  },
  {
    question: 'Comment puis-je suivre ma commande ?',
    answer: 'Une fois votre commande expédiée, vous recevrez un email avec un numéro de suivi et un lien pour suivre votre colis en temps réel.',
  },
  {
    question: 'Proposez-vous des échantillons ?',
    answer: 'Oui, certains produits incluent des échantillons dans votre commande. Vous pouvez également les ajouter lors du passage en caisse si disponibles.',
  },
  {
    question: 'Que faire en cas de problème avec ma commande ?',
    answer: 'Contactez-nous immédiatement à contact@essencefeminine.nl ou par téléphone au +31 20 123 4567. Notre équipe se chargera de résoudre le problème rapidement.',
  },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="section-padding bg-beige-light min-h-screen">
      <div className="container-custom max-w-4xl">
        <h1 className="font-elegant text-4xl md:text-5xl text-brown-dark mb-4 text-center">
          Questions Fréquentes
        </h1>
        <p className="text-lg text-brown-soft text-center mb-12 max-w-2xl mx-auto">
          Trouvez rapidement les réponses à vos questions les plus courantes
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
            Vous ne trouvez pas votre réponse ?
          </h2>
          <p className="text-brown-soft mb-6">
            Notre équipe est là pour vous aider
          </p>
          <a href="/contact" className="btn-primary">
            Contactez-nous
          </a>
        </div>
      </div>
    </div>
  );
}

