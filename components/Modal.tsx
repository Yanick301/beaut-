"use client";

import React, { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { FiCheckCircle, FiXCircle, FiInfo, FiArrowRight, FiRefreshCw } from 'react-icons/fi';
import { useModalStore } from '@/lib/modal-store';

export default function Modal() {
  const router = useRouter();
  const { visible, title, message, type, action, hideModal } = useModalStore();
  const dialogRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!visible) return;
    const previousActive = document.activeElement as HTMLElement | null;

    // Focus first focusable element in modal
    const focusable = dialogRef.current?.querySelector<HTMLElement>("button, [href], input, textarea, select, [tabindex]:not([tabindex='-1'])");
    focusable?.focus();

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') hideModal();
      if (e.key === 'Tab' && dialogRef.current) {
        // Basic focus trap
        const focusableEls = Array.from(dialogRef.current.querySelectorAll<HTMLElement>("button, [href], input, textarea, select, [tabindex]:not([tabindex='-1'])")).filter(Boolean);
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
    hideModal();
    if (action?.href) router.push(action.href);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={hideModal} />

      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full mx-4 p-6 transform transition-all duration-200 ease-out scale-95 opacity-0 animate-modal-in"
      >
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 mt-1">
            <div className="w-12 h-12 rounded-full bg-white-50 flex items-center justify-center">
              <Icon />
            </div>
          </div>

          <div className="flex-1">
            <h3 id="modal-title" className="text-xl font-semibold text-brown-dark mb-2">{title}</h3>
            <p className="text-sm text-brown-soft mb-4">{message}</p>

            <div className="flex gap-3">
              {action?.href && (
                <button onClick={handleAction} className="btn-primary flex items-center gap-2">
                  <span>{action.label || 'Aller au compte'}</span>
                  <FiArrowRight />
                </button>
              )}

              {!action?.href && (
                <button onClick={hideModal} className="btn-outline">
                  Fermer
                </button>
              )}

              {/* Error-specific retry */}
              {type === 'error' && action?.href && (
                <button onClick={handleAction} className="btn-outline flex items-center gap-2">
                  <FiRefreshCw />
                  <span>Réessayer</span>
                </button>
              )}
            </div>
          </div>

          <div>
            <button
              onClick={hideModal}
              className="text-brown-soft hover:text-brown-dark ml-4"
              aria-label="Close"
            >
              <span className="text-xl">✕</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

