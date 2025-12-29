'use client';

import { useToastStore } from '@/lib/toast-store';
import Toast, { ToastType } from './Toast';

interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
}

export default function ToastContainer() {
  const toasts = useToastStore((state) => state.toasts);
  const removeToast = useToastStore((state) => state.removeToast);

  return (
    <>
      {toasts.map((toast: ToastItem) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </>
  );
}




