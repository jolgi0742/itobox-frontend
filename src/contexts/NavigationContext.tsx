// src/contexts/NavigationContext.tsx
// REEMPLAZAR CONTENIDO COMPLETO - Con navigate() que acepta parámetros

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface NavigationContextType {
  currentPage: string;
  navigateTo: (page: string) => void;
  navigate: (path: string, params?: Record<string, any>) => void; // MEJORADO - Acepta parámetros opcionales
  getParam: (paramName: string) => string | null;
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
  breadcrumbs: string[];
  setBreadcrumbs: (breadcrumbs: string[]) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

interface NavigationProviderProps {
  children: ReactNode;
}

export const NavigationProvider: React.FC<NavigationProviderProps> = ({ children }) => {
  const [currentPage, setCurrentPage] = useState<string>('dashboard');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [breadcrumbs, setBreadcrumbs] = useState<string[]>(['Dashboard']);
  const [currentParams, setCurrentParams] = useState<Record<string, any>>({});

  const navigateTo = (page: string) => {
    setIsLoading(true);
    setCurrentPage(page);
    
    // Simular navegación real
    setTimeout(() => {
      setIsLoading(false);
      
      // Actualizar breadcrumbs
      const pageNames: { [key: string]: string } = {
        dashboard: 'Dashboard',
        packages: 'Paquetes',
        'package-detail': 'Detalle de Paquete',
        'package-edit': 'Editar Paquete',
        'package-create': 'Crear Paquete',
        'package-tracking': 'Rastrear Paquete',
        clients: 'Clientes',
        'client-detail': 'Detalle de Cliente',
        'client-edit': 'Editar Cliente',
        'client-create': 'Crear Cliente',
        couriers: 'Couriers',
        'courier-detail': 'Detalle de Courier',
        'courier-edit': 'Editar Courier',
        'courier-schedule': 'Calendario de Courier',
        'courier-reports': 'Reportes de Courier',
        reports: 'Reportes',
        'reports-detail': 'Detalle de Reporte',
        billing: 'Facturación',
        'billing-detail': 'Detalle de Factura',
        'billing-edit': 'Editar Factura',
        'billing-create': 'Crear Factura',
        'invoice-detail': 'Detalle de Factura',
        'invoice-edit': 'Editar Factura',
        tracking: 'Tracking',
        notifications: 'Notificaciones',
        settings: 'Configuración',
        warehouse: 'Almacén'
      };
      
      setBreadcrumbs(['Dashboard', pageNames[page] || page]);
      
      // Navegar usando window.location para compatibilidad
      if (typeof window !== 'undefined') {
        window.history.pushState(null, '', `/${page}`);
      }
    }, 100);
  };

  // MÉTODO NAVIGATE MEJORADO - Acepta parámetros opcionales y PREVIENE retorno a dashboard
  const navigate = (path: string, params?: Record<string, any>) => {
    console.log('🚀 Navigate called with path:', path, 'params:', params);
    
    // PREVENIR navegación automática al dashboard
    if (path === 'dashboard' || path === '/' || path === '') {
      console.log('⚠️ Prevented automatic navigation to dashboard');
      return;
    }
    
    // Guardar parámetros para getParam
    if (params) {
      setCurrentParams(prevParams => ({ ...prevParams, ...params }));
    }
    
    // Extraer la página del path
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    const page = cleanPath.split('/')[0] || 'dashboard';
    
    // Construir URL con parámetros si los hay
    let finalUrl = cleanPath;
    if (params) {
      // Para rutas con ID, agregarlo al path
      if (params.id) {
        finalUrl = `${cleanPath}/${params.id}`;
      }
      // Para otros parámetros, usar query strings
      const otherParams = Object.keys(params).filter(key => key !== 'id');
      if (otherParams.length > 0) {
        const queryString = otherParams
          .map(key => `${key}=${encodeURIComponent(params[key])}`)
          .join('&');
        finalUrl += finalUrl.includes('?') ? `&${queryString}` : `?${queryString}`;
      }
    }
    
    console.log('📍 Final URL:', finalUrl);
    
    // SIMULAR NAVEGACIÓN en lugar de cambiar window.location
    // Esto evita que regrese al dashboard automáticamente
    setLoading(true);
    setCurrentPage(page);
    
    setTimeout(() => {
      setLoading(false);
      console.log('✅ Navigation simulated successfully');
      
      // Mostrar modal o acción específica basada en la ruta
      if (path.includes('detail')) {
        console.log('📋 Showing detail view for:', params?.id || 'unknown');
      } else if (path.includes('edit')) {
        console.log('✏️ Showing edit form for:', params?.id || 'unknown');
      } else if (path.includes('create')) {
        console.log('➕ Showing create form');
      }
    }, 300);
  };

  // MÉTODO GETPARAM MEJORADO - Busca en parámetros guardados y URL
  const getParam = (paramName: string): string | null => {
    // Primero buscar en parámetros guardados del contexto
    if (currentParams[paramName]) {
      return String(currentParams[paramName]);
    }
    
    if (typeof window === 'undefined') return null;
    
    try {
      // Intentar obtener parámetro de URL search params
      const urlParams = new URLSearchParams(window.location.search);
      const searchParam = urlParams.get(paramName);
      if (searchParam) return searchParam;
      
      // Intentar obtener parámetro del path
      const pathParts = window.location.pathname.split('/');
      
      // Para 'id', buscar el último segmento numérico o alfanumérico válido
      if (paramName === 'id') {
        // Buscar el último segmento que no sea una palabra clave de ruta
        const routeKeywords = ['detail', 'edit', 'create', 'view', 'track', 'reports', 'schedule'];
        for (let i = pathParts.length - 1; i >= 0; i--) {
          const segment = pathParts[i];
          if (segment && !routeKeywords.includes(segment) && segment !== '') {
            return segment;
          }
        }
        // ID por defecto para desarrollo
        return 'MOCK_ID_001';
      }
      
      // Para otros parámetros, buscar en el path
      const paramIndex = pathParts.findIndex(part => part === paramName);
      if (paramIndex !== -1 && paramIndex + 1 < pathParts.length) {
        return pathParts[paramIndex + 1];
      }
      
      return null;
    } catch (error) {
      console.warn('Error getting param:', paramName, error);
      
      // Valores por defecto para desarrollo
      if (paramName === 'id') return 'MOCK_ID_001';
      if (paramName === 'client') return 'MOCK_CLIENT_001';
      if (paramName === 'courier') return 'MOCK_COURIER_001';
      if (paramName === 'type') return 'general';
      if (paramName === 'action') return 'view';
      
      return null;
    }
  };

  const setLoading = (loading: boolean) => {
    setIsLoading(loading);
  };

  const value: NavigationContextType = {
    currentPage,
    navigateTo,
    navigate, // MEJORADO - Acepta parámetros
    getParam, // MEJORADO - Busca en contexto y URL
    isLoading,
    setLoading,
    breadcrumbs,
    setBreadcrumbs
  };

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
};

// Hook para usar el contexto
export const useNavigation = (): NavigationContextType => {
  const context = useContext(NavigationContext);
  
  if (context === undefined) {
    throw new Error('useNavigation debe ser usado dentro de NavigationProvider');
  }
  
  return context;
};

export default NavigationContext;