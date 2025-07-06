import React, { createContext, useContext, useState, ReactNode } from 'react';

interface NavigationState {
  currentPath: string;
  isCollapsed: boolean;
  notifications: number;
}

interface NavigationContextType {
  currentPath: string;
  isCollapsed: boolean;
  notifications: number;
  setCurrentPath: (path: string) => void;
  toggleSidebar: () => void;
  setNotifications: (count: number) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const NavigationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [navigationState, setNavigationState] = useState<NavigationState>({
    currentPath: window.location.pathname,
    isCollapsed: false,
    notifications: 3
  });

  const setCurrentPath = (path: string) => {
    setNavigationState(prev => ({ ...prev, currentPath: path }));
  };

  const toggleSidebar = () => {
    setNavigationState(prev => ({ ...prev, isCollapsed: !prev.isCollapsed }));
  };

  const setNotifications = (count: number) => {
    setNavigationState(prev => ({ ...prev, notifications: count }));
  };

  const contextValue: NavigationContextType = {
    currentPath: navigationState.currentPath,
    isCollapsed: navigationState.isCollapsed,
    notifications: navigationState.notifications,
    setCurrentPath,
    toggleSidebar,
    setNotifications
  };

  return (
    <NavigationContext.Provider value={contextValue}>
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = (): NavigationContextType => {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error('useNavigation debe ser usado dentro de NavigationProvider');
  }
  return context;
};

export default NavigationContext;