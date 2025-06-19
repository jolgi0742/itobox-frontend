// src/hooks/useNotifications.ts
import { useCallback } from 'react';
import { Notification } from '../types';

export const useNotifications = () => {
  const showToast = useCallback((message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') => {
    const toast: Notification = {
      id: Date.now().toString(),
      title: '',
      message,
      type,
      timestamp: new Date(),
      read: false,
      duration: 5000
    };

    console.log('Toast:', toast);
    // Aquí normalmente mostrarías el toast en la UI
  }, []);

  const hideToast = useCallback((id: string) => {
    console.log('Hide toast:', id);
  }, []);

  const clearAllToasts = useCallback(() => {
    console.log('Clear all toasts');
  }, []);

  return {
    toasts: [] as Notification[],
    showToast,
    hideToast,
    clearAllToasts
  };
};

export default useNotifications;