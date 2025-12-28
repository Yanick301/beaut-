'use client';

import { useState } from 'react';
import { FiMail, FiPhone, FiMapPin, FiSend } from 'react-icons/fi';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would send this to your backend
    alert('Merci pour votre message ! Nous vous répondrons dans les plus brefs délais.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="section-padding bg-beige-light min-h-screen">
      <div className="container-custom max-w-5xl">
        <h1 className="font-elegant text-4xl md:text-5xl text-brown-dark mb-8 text-center">
          Contactez-nous
        </h1>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div>
            <div className="bg-white-cream rounded-2xl p-8 shadow-md mb-8">
              <h2 className="font-elegant text-2xl text-brown-dark mb-6">Informations de contact</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-rose-soft/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <FiMail className="w-6 h-6 text-rose-soft" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-brown-dark mb-1">Email</h3>
                    <a href="mailto:contact@essencefeminine.nl" className="text-brown-soft hover:text-rose-soft transition">
                      contact@essencefeminine.nl
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-rose-soft/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <FiPhone className="w-6 h-6 text-rose-soft" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-brown-dark mb-1">Téléphone</h3>
                    <a href="tel:+31201234567" className="text-brown-soft hover:text-rose-soft transition">
                      +31 20 123 4567
                    </a>
                    <p className="text-sm text-brown-soft/80 mt-1">Lun-Ven: 9h-18h</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-rose-soft/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <FiMapPin className="w-6 h-6 text-rose-soft" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-brown-dark mb-1">Adresse</h3>
                    <p className="text-brown-soft">
                      Essence Féminine B.V.<br />
                      Amsterdam, Pays-Bas
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-rose-powder to-beige rounded-2xl p-8 shadow-md">
              <h3 className="font-elegant text-2xl text-brown-dark mb-4">Heures d'ouverture</h3>
              <div className="space-y-2 text-brown-soft">
                <div className="flex justify-between">
                  <span>Lundi - Vendredi</span>
                  <span className="font-semibold">9h00 - 18h00</span>
                </div>
                <div className="flex justify-between">
                  <span>Samedi</span>
                  <span className="font-semibold">10h00 - 16h00</span>
                </div>
                <div className="flex justify-between">
                  <span>Dimanche</span>
                  <span className="font-semibold">Fermé</span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white-cream rounded-2xl p-8 shadow-md">
            <h2 className="font-elegant text-2xl text-brown-dark mb-6">Envoyez-nous un message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-brown-dark font-medium mb-2">Nom complet *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border-2 border-nude focus:border-rose-soft outline-none transition"
                />
              </div>

              <div>
                <label className="block text-brown-dark font-medium mb-2">Email *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border-2 border-nude focus:border-rose-soft outline-none transition"
                />
              </div>

              <div>
                <label className="block text-brown-dark font-medium mb-2">Sujet *</label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border-2 border-nude focus:border-rose-soft outline-none transition"
                />
              </div>

              <div>
                <label className="block text-brown-dark font-medium mb-2">Message *</label>
                <textarea
                  required
                  rows={6}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border-2 border-nude focus:border-rose-soft outline-none transition resize-none"
                />
              </div>

              <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2">
                <FiSend className="w-5 h-5" />
                Envoyer le message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

