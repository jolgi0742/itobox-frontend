import React, { createContext, useContext, useState, ReactNode } from 'react';

interface NavigationContextType {
  currentPage: string;
  navigate: (page: string, params?: Record<string, string>) => void;
  getParam: (key: string) => string | undefined;
  params: Record<string, string>;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const NavigationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [params, setParams] = useState<Record<string, string>>({});

  const navigate = (page: string, newParams: Record<string, string> = {}) => {
    console.log('🚀 NAVEGANDO A:', page, newParams); // Debug log
    setCurrentPage(page);
    setParams(newParams);
    
    // Log adicional para verificar que se ejecuta
    console.log('✅ Navegación completada:', { currentPage: page, params: newParams });
  };

  const getParam = (key: string): string | undefined => {
    return params[key];
  };

  const value: NavigationContextType = {
    currentPage,
    navigate,
    getParam,
    params
  };

  console.log('🔄 NavigationContext renderizado:', { currentPage, params }); // Debug log

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = (): NavigationContextType => {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    console.error('❌ ERROR: useNavigation debe ser usado dentro de NavigationProvider');
    throw new Error('useNavigation debe ser usado dentro de NavigationProvider');
  }
  console.log('🎯 useNavigation called, context:', context);
  return context;
};