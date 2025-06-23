// src/hooks/useNotifications.ts
import { useCallback } from 'react';
import { Notification } from '../types';

export function useNotifications() {
  
  const showNotification = useCallback((
    title: string,
    message: string,
    type: 'success' | 'error' | 'warning' | 'info' = 'info'
  ) => {
    const notification: Notification = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      title,
      message,
      type,
      createdAt: new Date(), // CORREGIDO: usar createdAt en lugar de timestamp
      isRead: false, // CORREGIDO: usar isRead en lugar de read
      duration: 5000
    };

    // En una implementación real, esto se conectaría con NotificationContext
    console.log('Notification:', notification);
    
    // Simular notificación en el navegador
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, {
        body: message,
        icon: '/favicon.ico'
      });
    }

    return notification;
  }, []);

  const showSuccess = useCallback((title: string, message: string) => {
    return showNotification(title, message, 'success');
  }, [showNotification]);

  const showError = useCallback((title: string, message: string) => {
    return showNotification(title, message, 'error');
  }, [showNotification]);

  const showWarning = useCallback((title: string, message: string) => {
    return showNotification(title, message, 'warning');
  }, [showNotification]);

  const showInfo = useCallback((title: string, message: string) => {
    return showNotification(title, message, 'info');
  }, [showNotification]);

  const requestPermission = useCallback(async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return false;
  }, []);

  return {
    showNotification,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    requestPermission
  };
}