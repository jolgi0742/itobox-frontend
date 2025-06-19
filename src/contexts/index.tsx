// src/contexts/index.tsx
import React from 'react';
import { AuthProvider } from './AuthContext';

// Simple notification provider
const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <>{children}</>;
};

// Simple app provider wrapper
const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <>{children}</>;
};

// Combined providers
interface AppProvidersProps {
  children: React.ReactNode;
}

export const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  return (
    <AuthProvider>
      <NotificationProvider>
        <AppProvider>
          {children}
        </AppProvider>
      </NotificationProvider>
    </AuthProvider>
  );
};

// Individual exports
export { AuthProvider } from './AuthContext';
export { NotificationProvider };
export { AppProvider };