import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

// Tipos para idiomas
export type SupportedLanguage = 'es' | 'en';

export interface LanguageContextType {
  currentLanguage: SupportedLanguage;
  changeLanguage: (language: SupportedLanguage) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  isRTL: boolean;
}

// Traducciones básicas
const translations: Record<SupportedLanguage, Record<string, string>> = {
  es: {
    'nav.dashboard': 'Dashboard',
    'nav.packages': 'Paquetes',
    'nav.clients': 'Clientes',
    'nav.couriers': 'Couriers',
    'nav.reports': 'Reportes',
    'nav.warehouse': 'Almacén',
    'nav.tracking': 'Tracking',
    'nav.billing': 'Facturación',
    'nav.notifications': 'Notificaciones',
    'nav.settings': 'Configuración',
    'common.search': 'Buscar',
    'common.loading': 'Cargando...',
    'common.save': 'Guardar',
    'common.cancel': 'Cancelar',
    'common.delete': 'Eliminar',
    'common.edit': 'Editar',
    'common.view': 'Ver',
    'common.create': 'Crear',
    'common.update': 'Actualizar',
    'auth.login': 'Iniciar Sesión',
    'auth.logout': 'Cerrar Sesión',
    'auth.register': 'Registrarse',
    'auth.email': 'Email',
    'auth.password': 'Contraseña',
    'packages.total': 'Total Paquetes',
    'packages.in_transit': 'En Tránsito',
    'packages.delivered': 'Entregados',
    'clients.total': 'Total Clientes',
    'clients.active': 'Clientes Activos',
  },
  en: {
    'nav.dashboard': 'Dashboard',
    'nav.packages': 'Packages',
    'nav.clients': 'Clients',
    'nav.couriers': 'Couriers',
    'nav.reports': 'Reports',
    'nav.warehouse': 'Warehouse',
    'nav.tracking': 'Tracking',
    'nav.billing': 'Billing',
    'nav.notifications': 'Notifications',
    'nav.settings': 'Settings',
    'common.search': 'Search',
    'common.loading': 'Loading...',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.view': 'View',
    'common.create': 'Create',
    'common.update': 'Update',
    'auth.login': 'Login',
    'auth.logout': 'Logout',
    'auth.register': 'Register',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'packages.total': 'Total Packages',
    'packages.in_transit': 'In Transit',
    'packages.delivered': 'Delivered',
    'clients.total': 'Total Clients',
    'clients.active': 'Active Clients',
  }
};

// Crear el contexto
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Provider del contexto
export interface LanguageProviderProps {
  children: ReactNode;
  defaultLanguage?: SupportedLanguage;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ 
  children, 
  defaultLanguage = 'es' 
}) => {
  const [currentLanguage, setCurrentLanguage] = useState<SupportedLanguage>(() => {
    // Intentar cargar idioma desde localStorage
    const savedLanguage = localStorage.getItem('itobox_language') as SupportedLanguage;
    return savedLanguage || defaultLanguage;
  });

  // Función para cambiar idioma
  const changeLanguage = useCallback((language: SupportedLanguage) => {
    setCurrentLanguage(language);
    localStorage.setItem('itobox_language', language);
    
    // Actualizar atributo lang del documento
    document.documentElement.lang = language;
  }, []);

  // Función de traducción
  const t = useCallback((key: string, params?: Record<string, string | number>): string => {
    const translation = translations[currentLanguage]?.[key] || key;
    
    // Reemplazar parámetros si existen
    if (params) {
      return Object.entries(params).reduce((text, [paramKey, paramValue]) => {
        return text.replace(`{{${paramKey}}}`, String(paramValue));
      }, translation);
    }
    
    return translation;
  }, [currentLanguage]);

  // Determinar si es RTL (Right-to-Left)
  const isRTL = false; // Español e inglés son LTR

  const contextValue: LanguageContextType = {
    currentLanguage,
    changeLanguage,
    t,
    isRTL
  };

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
};

// Hook para usar idioma
export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// Export default
export default LanguageContext;