'use client';

import { Toaster } from 'sonner';

/**
 * Toast notification provider using Sonner.
 */
export function ToastProvider() {
  return (
    <Toaster
      position="bottom-right"
      toastOptions={{
        duration: 5000,
      }}
      richColors
      closeButton
    />
  );
}
