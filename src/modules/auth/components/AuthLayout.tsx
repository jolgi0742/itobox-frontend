import React from 'react';
import { ErrorBoundary } from '@/components/layout/ErrorBoundary';
import { useTheme } from '@/contexts/ThemeContext';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  const { actualTheme } = useTheme();

  return (
    <ErrorBoundary>
      <div className="min-h-screen flex">
        {/* Left side - Form */}
        <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
          {children}
        </div>

        {/* Right side - Image/Branding */}
        <div className="hidden lg:block lg:w-1/2 xl:w-2/5">
          <div className="h-full relative bg-gradient-to-br from-itobox-primary to-itobox-accent">
            <div className="absolute inset-0 bg-black bg-opacity-20" />
            
            {/* Content */}
            <div className="relative h-full flex flex-col justify-center p-12 text-white">
              <div className="max-w-md">
                <h1 className="text-4xl font-bold mb-6">
                  Bienvenido a ITOBOX
                </h1>
                <p className="text-xl mb-8 text-white/90">
                  Tu sistema integral de gestión de casillero internacional. 
                  Seguimiento en tiempo real, gestión automatizada y experiencia profesional.
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-white rounded-full mr-3" />
                    <span>Tracking en tiempo real de todos tus paquetes</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-white rounded-full mr-3" />
                    <span>Gestión completa de clientes y envíos</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-white rounded-full mr-3" />
                    <span>Dashboard administrativo avanzado</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-white rounded-full mr-3" />
                    <span>Reportes y analytics en tiempo real</span>
                  </div>
                </div>
              </div>

              {/* Background Pattern */}
              <div className="absolute bottom-0 right-0 opacity-10">
                <svg width="400" height="400" viewBox="0 0 400 400" className="text-white">
                  <defs>
                    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1"/>
                    </pattern>
                  </defs>
                  <rect width="400" height="400" fill="url(#grid)" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};