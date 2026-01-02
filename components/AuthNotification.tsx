"use client";

import { useEffect, useRef } from 'react';
import { useModalStore } from '@/lib/modal-store';

export default function AuthNotification() {
  const showModal = useModalStore((s) => s.showModal);
  const processedRef = useRef(false);

  useEffect(() => {
    // Only process once per mount
    if (processedRef.current) return;
    processedRef.current = true;

    try {
      const url = new URL(window.location.href);
      const success = url.searchParams.get('success');
      const error = url.searchParams.get('error');

      // Success messages
      if (success) {
        const map: Record<string, { title: string; message: string }> = {
          signup_auto_login: {
            title: 'Compte créé !',
            message: 'Votre compte a été créé avec succès et vous êtes connecté.',
          },
          magic_link_login: {
            title: 'Connexion réussie',
            message: 'Vous êtes connecté via le lien de connexion reçu par e-mail.',
          },
          email_changed: {
            title: 'E-mail changé',
            message: 'Votre adresse e-mail a été mise à jour avec succès.',
          },
        };

        const payload = map[success] || { title: 'Succès', message: 'L\'action a été complétée.' };
        showModal(payload.title, payload.message, 'success', {
          label: 'Voir mon compte',
          href: '/compte',
        });

        // Clean up URL
        url.searchParams.delete('success');
        window.history.replaceState({}, '', url.toString());
      }

      // Error messages
      if (error) {
        const mapErr: Record<string, { title: string; message: string }> = {
          invalid_or_expired_link: {
            title: 'Lien expiré',
            message: 'Le lien n\'est plus valide. Demandez un nouveau lien.',
          },
          auth_callback_failed: {
            title: 'Authentification échouée',
            message: 'Une erreur s\'est produite lors de la connexion. Réessayez.',
          },
          no_code_provided: {
            title: 'Accès non autorisé',
            message: 'Aucun code d\'authentification n\'a été fourni. Reconnectez-vous.',
          },
        };

        const payload = mapErr[error] || { title: 'Erreur', message: 'Une erreur est survenue.' };
        const errorHrefMap: Record<string, string> = {
          invalid_or_expired_link: '/mot-de-passe-oublie',
          auth_callback_failed: '/connexion',
          no_code_provided: '/connexion',
        };

        showModal(payload.title, payload.message, 'error', {
          label: 'Réessayer',
          href: errorHrefMap[error] || '/connexion',
        });

        // Clean up URL
        url.searchParams.delete('error');
        window.history.replaceState({}, '', url.toString());
      }
    } catch (err) {
      console.error('[AuthNotification] Error:', err);
    }
  }, [showModal]);

  return null;
}
