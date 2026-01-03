'use client';

import { useState } from 'react';
import { FiMail } from 'react-icons/fi';

export default function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email.trim(), name: name.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Fout bij inschrijving');
      }

      setMessage({ type: 'success', text: data.message || 'U bent nu ingeschreven voor onze nieuwsbrief !' });
      setEmail('');
      setName('');
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Er is een fout opgetreden' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Uw voornaam (optioneel)"
          className="flex-1 px-4 py-3 rounded-lg border-2 border-white-cream/30 bg-white-cream/10 text-white-cream placeholder-white-cream/70 focus:border-white-cream outline-none backdrop-blur-sm"
        />
        <div className="flex-1 relative">
          <FiMail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white-cream/70 w-5 h-5" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Uw e-mail"
            required
            className="w-full pl-12 pr-4 py-3 rounded-lg border-2 border-white-cream/30 bg-white-cream/10 text-white-cream placeholder-white-cream/70 focus:border-white-cream outline-none backdrop-blur-sm"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 bg-white-cream text-brown-dark rounded-lg font-semibold hover:bg-beige transition disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
        >
          {loading ? 'Inschrijven...' : 'Inschrijven'}
        </button>
      </div>
      {message && (
        <div className={`p-3 rounded-lg text-sm ${
          message.type === 'success'
            ? 'bg-green-500/20 text-green-200 border border-green-500/30'
            : 'bg-red-500/20 text-red-200 border border-red-500/30'
        }`}>
          {message.text}
        </div>
      )}
      <p className="text-xs text-white-cream/70">
        Door u in te schrijven, accepteert u het ontvangen van onze nieuwsbrieven. U kunt zich op elk moment uitschrijven.
      </p>
    </form>
  );
}
















