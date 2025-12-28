'use client';

import { useEffect } from 'react';
import { FiCheckCircle, FiX, FiAlertCircle, FiInfo } from 'react-icons/fi';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastProps {
  message: string;
  type?: ToastType;
  duration?: number;
  onClose: () => void;
}

export default function Toast({ message, type = 'success', duration = 3000, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const icons = {
    success: FiCheckCircle,
    error: FiAlertCircle,
    info: FiInfo,
    warning: FiAlertCircle,
  };

  const colors = {
    success: 'bg-green-500 text-white',
    error: 'bg-red-500 text-white',
    info: 'bg-blue-500 text-white',
    warning: 'bg-yellow-500 text-white',
  };

  const Icon = icons[type];
  const colorClass = colors[type];

  return (
    <div className="fixed top-4 right-2 sm:right-4 z-50 animate-slide-in-right max-w-[calc(100vw-1rem)] sm:max-w-md">
      <div className={`${colorClass} rounded-lg shadow-lg p-3 sm:p-4 flex items-center gap-2 sm:gap-3 w-full`}>
        <Icon className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
        <p className="flex-1 text-xs sm:text-sm font-medium break-words">{message}</p>
        <button
          onClick={onClose}
          className="flex-shrink-0 hover:opacity-80 transition-opacity"
          aria-label="Fermer"
        >
          <FiX className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

