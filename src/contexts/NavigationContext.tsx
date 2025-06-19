// src/contexts/NavigationContext.tsx
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

// ====== TIPOS E INTERFACES ======
export interface NavigationParams {
  [key: string]: string | undefined;
}

export interface NavigationQuery {
  [key: string]: string | undefined;
}

export interface NavigationContextType {
  // Estado principal
  currentPage: string;
  params: NavigationParams;
  query: NavigationQuery;
  history: string[];
  historyIndex: number;
  
  // Funciones de navegación
  navigate: (page: string, params?: NavigationParams, query?: NavigationQuery) => void;
  goBack: () => void;
  goForward: () => void;
  canGoBack: () => boolean;
  canGoForward: () => boolean;
  
  // Utilidades
  getCurrentPath: () => string;
  isCurrentPage: (page: string) => boolean;
  getParam: (key: string) => string | undefined;
  getQueryParam: (key: string) => string | undefined;
  setQueryParam: (key: string, value: string | undefined) => void;
  getBreadcrumbs: () => string[];
}

// ====== CONTEXTO ======
const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

// ====== PROVIDER ======
interface NavigationProviderProps {
  children: ReactNode;
}

export const NavigationProvider: React.FC<NavigationProviderProps> = ({ children }) => {
  const [currentPage, setCurrentPage] = useState('DashboardPage');
  const [params, setParams] = useState<NavigationParams>({});
  const [query, setQuery] = useState<NavigationQuery>({});
  const [history, setHistory] = useState<string[]>(['DashboardPage']);
  const [historyIndex, setHistoryIndex] = useState(0);

  // ====== FUNCIONES DE NAVEGACIÓN ======
  const navigate = (
    page: string, 
    newParams: NavigationParams = {}, 
    newQuery: NavigationQuery = {}
  ) => {
    console.log(`🧭 NavigationContext: Navegando a ${page}`, { params: newParams, query: newQuery });
    
    setCurrentPage(page);
    setParams(newParams);
    setQuery(newQuery);
    
    // Actualizar history
    const newHistory = [...history.slice(0, historyIndex + 1), page];
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    
    // Actualizar URL del navegador
    updateBrowserURL(page, newParams, newQuery);
  };

  const goBack = () => {
    if (canGoBack()) {
      const newIndex = historyIndex - 1;
      const previousPage = history[newIndex];
      setHistoryIndex(newIndex);
      setCurrentPage(previousPage);
      console.log(`🔙 NavigationContext: Volviendo a ${previousPage}`);
    }
  };

  const goForward = () => {
    if (canGoForward()) {
      const newIndex = historyIndex + 1;
      const nextPage = history[newIndex];
      setHistoryIndex(newIndex);
      setCurrentPage(nextPage);
      console.log(`▶️ NavigationContext: Avanzando a ${nextPage}`);
    }
  };

  const canGoBack = () => historyIndex > 0;
  const canGoForward = () => historyIndex < history.length - 1;

  // ====== UTILIDADES ======
  const getCurrentPath = (): string => {
    let path = `/${pageToRoute(currentPage)}`;
    
    // Agregar parámetros
    Object.keys(params).forEach(key => {
      if (params[key]) {
        path = path.replace(`:${key}`, params[key]!);
      }
    });
    
    // Agregar query string
    const queryString = Object.keys(query)
      .filter(key => query[key] !== undefined)
      .map(key => `${key}=${encodeURIComponent(query[key]!)}`)
      .join('&');
    
    if (queryString) {
      path += `?${queryString}`;
    }
    
    return path;
  };

  const isCurrentPage = (page: string): boolean => currentPage === page;

  const getParam = (key: string): string | undefined => params[key];

  const getQueryParam = (key: string): string | undefined => query[key];

  const setQueryParam = (key: string, value: string | undefined) => {
    const newQuery = { ...query };
    if (value === undefined) {
      delete newQuery[key];
    } else {
      newQuery[key] = value;
    }
    setQuery(newQuery);
    updateBrowserURL(currentPage, params, newQuery);
  };

  const getBreadcrumbs = (): string[] => {
    const breadcrumbs = [currentPage];
    
    // Agregar contexto basado en parámetros
    if (params.id) {
      breadcrumbs.push(`${currentPage.replace('Page', '')} #${params.id}`);
    }
    
    return breadcrumbs;
  };

  // ====== HELPERS ======
  const pageToRoute = (page: string): string => {
    const routes: { [key: string]: string } = {
      'DashboardPage': '',
      'PackagesPage': 'packages',
      'PackageDetailsPage': 'packages/:id',
      'NewPackagePage': 'packages/new',
      'EditPackagePage': 'packages/:id/edit',
      'ClientsPage': 'clients',
      'ClientProfilePage': 'clients/:id',
      'NewClientPage': 'clients/new',
      'CouriersPage': 'couriers',
      'CourierProfilePage': 'couriers/:id',
      'NewCourierPage': 'couriers/new',
      'WarehousePage': 'warehouse',
      'ReportsPage': 'reports',
      'BillingPage': 'billing',
      'TrackingPage': 'tracking',
      'NotificationsPage': 'notifications',
      'SettingsPage': 'settings',
      'LoginPage': 'login',
      'RegisterPage': 'register',
      'ForgotPasswordPage': 'forgot-password'
    };
    
    return routes[page] || page.toLowerCase().replace('page', '');
  };

  const updateBrowserURL = (
    page: string, 
    params: NavigationParams, 
    query: NavigationQuery
  ) => {
    try {
      const path = getCurrentPath();
      const newHash = `#${path}`;
      
      if (window.location.hash !== newHash) {
        window.history.pushState(null, '', newHash);
        console.log(`🌐 URL actualizada: ${newHash}`);
      }
    } catch (error) {
      console.error('Error actualizando URL:', error);
    }
  };

  // ====== SINCRONIZACIÓN CON BROWSER ======
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.substring(1); // Remover #
      if (hash) {
        parseURLAndNavigate(hash);
      }
    };

    const parseURLAndNavigate = (path: string) => {
      const [pathPart, queryPart] = path.split('?');
      const segments = pathPart.split('/').filter(Boolean);
      
      // Determinar página basada en la ruta
      let targetPage = 'DashboardPage';
      const newParams: NavigationParams = {};
      
      if (segments.length === 0) {
        targetPage = 'DashboardPage';
      } else if (segments[0] === 'packages') {
        if (segments.length === 1) {
          targetPage = 'PackagesPage';
        } else if (segments[1] === 'new') {
          targetPage = 'NewPackagePage';
        } else if (segments[1] && !isNaN(Number(segments[1]))) {
          targetPage = 'PackageDetailsPage';
          newParams.id = segments[1];
        }
      } else if (segments[0] === 'clients') {
        if (segments.length === 1) {
          targetPage = 'ClientsPage';
        } else if (segments[1] === 'new') {
          targetPage = 'NewClientPage';
        } else if (segments[1]) {
          targetPage = 'ClientProfilePage';
          newParams.id = segments[1];
        }
      } else if (segments[0] === 'couriers') {
        if (segments.length === 1) {
          targetPage = 'CouriersPage';
        } else if (segments[1] === 'new') {
          targetPage = 'NewCourierPage';
        } else if (segments[1]) {
          targetPage = 'CourierProfilePage';
          newParams.id = segments[1];
        }
      } else {
        // Mapeo directo para otras páginas
        const routeToPage: { [key: string]: string } = {
          'warehouse': 'WarehousePage',
          'reports': 'ReportsPage',
          'billing': 'BillingPage',
          'tracking': 'TrackingPage',
          'notifications': 'NotificationsPage',
          'settings': 'SettingsPage',
          'login': 'LoginPage',
          'register': 'RegisterPage',
          'forgot-password': 'ForgotPasswordPage'
        };
        
        targetPage = routeToPage[segments[0]] || 'DashboardPage';
      }
      
      // Parsear query string
      const newQuery: NavigationQuery = {};
      if (queryPart) {
        const queryParams = new URLSearchParams(queryPart);
        queryParams.forEach((value, key) => {
          newQuery[key] = value;
        });
      }
      
      console.log(`📍 URL parseada: ${targetPage}`, { params: newParams, query: newQuery });
      
      // Actualizar estado sin triggerar actualización de URL
      setCurrentPage(targetPage);
      setParams(newParams);
      setQuery(newQuery);
    };

    // Parse URL inicial
    if (window.location.hash) {
      parseURLAndNavigate(window.location.hash.substring(1));
    }

    // Escuchar cambios en hash
    window.addEventListener('hashchange', handleHashChange);
    
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  // ====== CONTEXT VALUE ======
  const contextValue: NavigationContextType = {
    currentPage,
    params,
    query,
    history,
    historyIndex,
    navigate,
    goBack,
    goForward,
    canGoBack,
    canGoForward,
    getCurrentPath,
    isCurrentPage,
    getParam,
    getQueryParam,
    setQueryParam,
    getBreadcrumbs
  };

  return (
    <NavigationContext.Provider value={contextValue}>
      {children}
    </NavigationContext.Provider>
  );
};

// ====== HOOK PERSONALIZADO ======
export const useNavigation = (): NavigationContextType => {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error('useNavigation debe ser usado dentro de NavigationProvider');
  }
  return context;
};

// ====== HOOKS ESPECIALIZADOS ======
export const useParam = (key: string): string | undefined => {
  const { getParam } = useNavigation();
  return getParam(key);
};

export const useParams = (): NavigationParams => {
  const { params } = useNavigation();
  return params;
};

export const useQuery = (): NavigationQuery => {
  const { query } = useNavigation();
  return query;
};

export const useQueryParam = (key: string): [string | undefined, (value: string | undefined) => void] => {
  const { getQueryParam, setQueryParam } = useNavigation();
  const value = getQueryParam(key);
  const setValue = (newValue: string | undefined) => setQueryParam(key, newValue);
  return [value, setValue];
};

export const useBreadcrumbs = (): string[] => {
  const { getBreadcrumbs } = useNavigation();
  return getBreadcrumbs();
};

export const useCurrentPage = (): string => {
  const { currentPage } = useNavigation();
  return currentPage;
};

export const useIsInSection = (section: string): boolean => {
  const { currentPage } = useNavigation();
  return currentPage.toLowerCase().includes(section.toLowerCase());
};

// ====== COMPONENTES AUXILIARES ======
interface LinkProps {
  to: string;
  children: ReactNode;
  className?: string;
  activeClassName?: string;
  params?: NavigationParams;
  query?: NavigationQuery;
}

export const Link: React.FC<LinkProps> = ({ 
  to, 
  children, 
  className = '', 
  activeClassName = '',
  params = {},
  query = {}
}) => {
  const { navigate, isCurrentPage } = useNavigation();
  
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate(to, params, query);
  };
  
  const isActive = isCurrentPage(to);
  const finalClassName = `${className} ${isActive ? activeClassName : ''}`;
  
  return (
    <a href="#" onClick={handleClick} className={finalClassName}>
      {children}
    </a>
  );
};

interface RedirectProps {
  to: string;
  condition: boolean;
  params?: NavigationParams;
  query?: NavigationQuery;
}

export const Redirect: React.FC<RedirectProps> = ({ to, condition, params = {}, query = {} }) => {
  const { navigate } = useNavigation();
  
  React.useEffect(() => {
    if (condition) {
      navigate(to, params, query);
    }
  }, [condition, to, params, query]);
  
  return null;
};

export default NavigationContext;