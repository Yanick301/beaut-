"use client";

import React, { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { FiCheckCircle, FiXCircle, FiInfo, FiArrowRight, FiRefreshCw, FiX } from 'react-icons/fi';
import { useModalStore } from '@/lib/modal-store';

export default function Modal() {
  const router = useRouter();
  const { visible, title, message, type, action, hideModal } = useModalStore();
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const focusTrapRef = useRef(false);

  useEffect(() => {
    if (!visible) return;

    const previousActive = document.activeElement as HTMLElement | null;

    // Focus first focusable element in modal after render
    const timer = setTimeout(() => {
      const focusable = dialogRef.current?.querySelector<HTMLElement>(
        'button:not([aria-hidden]), [href]:not([aria-hidden]), [tabindex]:not([tabindex="-1"])'
      );
      focusable?.focus();
    }, 50);

    const handleKey = (e: KeyboardEvent) => {
      // Escape closes modal
      if (e.key === 'Escape') {
        hideModal();
        return;
      }

      // Tab focus trap (basic)
      if (e.key === 'Tab' && dialogRef.current && !focusTrapRef.current) {
        focusTrapRef.current = true;
        setTimeout(() => {
          focusTrapRef.current = false;
        }, 100);

        const focusableEls = Array.from(
          dialogRef.current.querySelectorAll<HTMLElement>(
            'button:not([aria-hidden]), [href]:not([aria-hidden]), [tabindex]:not([tabindex="-1"])'
          )
        ).filter((el) => !el.hasAttribute('aria-hidden'));

        if (focusableEls.length === 0) return;

        const first = focusableEls[0];
        const last = focusableEls[focusableEls.length - 1];

        if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        } else if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      }
    };

    window.addEventListener('keydown', handleKey);
    return () => {
      window.removeEventListener('keydown', handleKey);
      clearTimeout(timer);
      previousActive?.focus();
    };
  }, [visible, hideModal]);

  if (!visible) return null;

  const Icon = () => {
    if (type === 'success') return <FiCheckCircle className="w-8 h-8 text-green-600" />;
    if (type === 'error') return <FiXCircle className="w-8 h-8 text-red-600" />;
    return <FiInfo className="w-8 h-8 text-blue-600" />;
  };

  const handleAction = () => {
    if (action?.href) {
      hideModal();
      // Small delay to ensure modal is hidden before navigation
      setTimeout(() => {
        router.push(action.href!);
      }, 100);
    } else {
      hideModal();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 transition-opacity duration-200 cursor-pointer"
        onClick={hideModal}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        aria-describedby="modal-message"
        className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full transform transition-all duration-300 ease-out scale-95 sm:scale-100 opacity-0 sm:opacity-100 animate-modal-in"
      >
        <div className="p-6 sm:p-8">
          <div className="flex items-start gap-4">
            {/* Icon */}
            <div className="flex-shrink-0 mt-1">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-white-50 to-beige-light flex items-center justify-center">
                <Icon />
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <h3 id="modal-title" className="text-xl sm:text-2xl font-semibold text-brown-dark mb-2">
                {title}
              </h3>
              <p id="modal-message" className="text-sm sm:text-base text-brown-soft mb-6 leading-relaxed">
                {message}
              </p>

              {/* Actions */}
              <div className="flex gap-3 flex-col sm:flex-row">
                {action?.href ? (
                  <>
                    <button
                      onClick={handleAction}
                      className={`${
                        type === 'success' ? 'btn-primary' : 'btn-outline'
                      } flex items-center justify-center gap-2 py-2 px-4 rounded-lg transition`}
                    >
                      <span>{action.label || 'Continuer'}</span>
                      <FiArrowRight className="w-4 h-4" />
                    </button>

                    <button
                      onClick={hideModal}
                      className="btn-outline py-2 px-4 rounded-lg transition"
                    >
                      Fermer
                    </button>
                  </>
                ) : (
                  <button
                    onClick={hideModal}
                    className="btn-outline py-2 px-4 rounded-lg transition w-full sm:w-auto"
                  >
                    Fermer
                  </button>
                )}
              </div>
            </div>

            {/* Close button */}
            <button
              onClick={hideModal}
              className="flex-shrink-0 text-brown-soft hover:text-brown-dark transition p-1 ml-2"
              aria-label="Fermer"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

