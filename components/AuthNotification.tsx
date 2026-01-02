"use client";

import { useEffect } from 'react';
import { useModalStore } from '@/lib/modal-store';

export default function AuthNotification() {
  const showModal = useModalStore((s) => s.showModal);

  useEffect(() => {
    try {
      const url = new URL(window.location.href);
      const success = url.searchParams.get('success');
      const error = url.searchParams.get('error');

      if (success) {
        const map: Record<string, { title: string; message: string } > = {
          signup_auto_login: { title: 'Account aangemaakt', message: 'Uw account is aangemaakt en u bent automatisch ingelogd.' },
          magic_link_login: { title: 'Ingebruikt via e-mail', message: 'U bent ingelogd via de ontvangen inloglink.' },
          email_changed: { title: 'E-mail gewijzigd', message: 'Uw e-mailadres is succesvol bijgewerkt.' },
        };

        const payload = map[success] || { title: 'Actie voltooid', message: 'De actie is succesvol uitgevoerd.' };
        // default action: go to account
        showModal(payload.title, payload.message, 'success', { label: 'Naar mijn account', href: '/compte' });
      }

      if (error) {
        const mapErr: Record<string, { title: string; message: string }> = {
          invalid_or_expired_link: { title: 'Link ongeldig', message: 'De link is ongeldig of verlopen. Vraag een nieuwe link aan.' },
          auth_callback_failed: { title: 'Authenticatie mislukt', message: 'Authenticatie is mislukt. Probeer opnieuw.' },
          no_code_provided: { title: 'Geen code', message: 'Geen code ontvangen. Probeer opnieuw.' },
        };

        const payload = mapErr[error] || { title: 'Fout', message: 'Er is een fout opgetreden.' };
        // provide retry hrefs depending on error
        const errorHrefMap: Record<string, string> = {
          invalid_or_expired_link: '/mot-de-passe-oublie',
          auth_callback_failed: '/connexion',
          no_code_provided: '/connexion',
        };
        showModal(payload.title, payload.message, 'error', { label: 'Réessayer', href: errorHrefMap[error] || '/connexion' });
      }

      // Remove query params to avoid repeated toasts
      if (success || error) {
        url.searchParams.delete('success');
        url.searchParams.delete('error');
        // Replace state without reloading
        window.history.replaceState({}, document.title, url.pathname + url.search + url.hash);
      }
    } catch (e) {
      // ignore
    }
  }, [showModal]);

  return null;
}
