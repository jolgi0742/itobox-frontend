// src/contexts/NavigationContext.tsx - LIMPIO

import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { NavigationContextType, BreadcrumbItem } from '../types';

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

interface NavigationProviderProps {
  children: ReactNode;
}

export function NavigationProvider({ children }: NavigationProviderProps) {
  const [currentPath, setCurrentPath] = useState<string>(window.location.pathname);
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([]);

  // Mapeo de rutas para breadcrumbs
  const routeLabels: { [key: string]: string } = {
    '/': 'Dashboard',
    '/packages': 'Paquetes',
    '/clients': 'Clientes',
    '/couriers': 'Couriers',
    '/warehouse': 'Almacén',
    '/tracking': 'Tracking',
    '/reports': 'Reportes',
    '/billing': 'Facturación',
    '/notifications': 'Notificaciones',
    '/settings': 'Configuración'
  };

  // Función navigate
  const navigate = useCallback((path: string) => {
    setCurrentPath(path);
    window.history.pushState({}, '', path);
    updateBreadcrumbs(path);
  }, []);

  // Actualizar breadcrumbs basado en la ruta
  const updateBreadcrumbs = useCallback((path: string) => {
    const newBreadcrumbs: BreadcrumbItem[] = [];
    
    if (path !== '/') {
      newBreadcrumbs.push({ label: 'Dashboard', path: '/', icon: 'Home' });
    }
    
    if (path !== '/') {
      const label = routeLabels[path] || path.split('/').pop()?.replace('-', ' ') || 'Página';
      newBreadcrumbs.push({ 
        label: label.charAt(0).toUpperCase() + label.slice(1), 
        path,
        icon: getIconForPath(path)
      });
    }
    
    setBreadcrumbs(newBreadcrumbs);
  }, []);

  // Obtener icono para cada ruta
  const getIconForPath = (path: string): string => {
    const iconMap: { [key: string]: string } = {
      '/packages': 'Package',
      '/clients': 'Users',
      '/couriers': 'Truck',
      '/warehouse': 'Building2',
      '/tracking': 'MapPin',
      '/reports': 'BarChart3',
      '/billing': 'CreditCard',
      '/notifications': 'Bell',
      '/settings': 'Settings'
    };
    return iconMap[path] || 'ChevronRight';
  };

  // Verificar si una ruta está activa
  const isActivePath = useCallback((path: string): boolean => {
    if (path === '/') {
      return currentPath === '/';
    }
    return currentPath === path || currentPath.startsWith(path + '/');
  }, [currentPath]);

  // Navegación del navegador
  const goBack = useCallback(() => {
    window.history.back();
  }, []);

  const goForward = useCallback(() => {
    window.history.forward();
  }, []);

  // Escuchar cambios en el navegador
  useEffect(() => {
    const handlePopState = () => {
      const newPath = window.location.pathname;
      setCurrentPath(newPath);
      updateBreadcrumbs(newPath);
    };

    window.addEventListener('popstate', handlePopState);
    updateBreadcrumbs(currentPath);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [currentPath, updateBreadcrumbs]);

  const value: NavigationContextType = {
    currentPath,
    navigate,
    isActivePath,
    goBack,
    goForward,
    breadcrumbs
  };

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation(): NavigationContextType {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
}
