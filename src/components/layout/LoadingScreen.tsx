import React from 'react';
import { Package, Loader2, Truck } from 'lucide-react';

interface LoadingScreenProps {
  message?: string;
  subMessage?: string;
  type?: 'default' | 'splash' | 'inline';
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ 
  message = 'Cargando...',
  subMessage = 'Por favor espera un momento',
  type = 'default'
}) => {
  
  if (type === 'inline') {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-2" />
          <p className="text-sm text-gray-600 dark:text-gray-400">{message}</p>
        </div>
      </div>
    );
  }

  if (type === 'splash') {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center z-50">
        <div className="text-center text-white">
          <div className="relative mb-8">
            <div className="bg-white/20 rounded-2xl p-6 backdrop-blur-sm">
              <Package className="h-16 w-16 mx-auto mb-4" />
              <h1 className="text-2xl font-bold">ITOBOX Courier</h1>
              <p className="text-blue-100 mt-2">Sistema de gestión de paquetes</p>
            </div>
            <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
          <p className="text-blue-100">{message}</p>
        </div>
      </div>
    );
  }

  // Default loading screen
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <div className="relative mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="relative">
              <Package className="h-16 w-16 text-blue-600 mx-auto mb-4" />
              <div className="absolute -top-2 -right-2">
                <Truck className="h-6 w-6 text-blue-400 animate-bounce" />
              </div>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              ITOBOX Courier
            </h2>
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
              <span className="text-gray-600 dark:text-gray-400">{message}</span>
            </div>
            {subMessage && (
              <p className="text-sm text-gray-500 dark:text-gray-400">{subMessage}</p>
            )}
          </div>
        </div>

        {/* Loading animation */}
        <div className="flex justify-center space-x-1">
          <div className="w-3 h-3 bg-blue-600 rounded-full animate-pulse"></div>
          <div className="w-3 h-3 bg-blue-600 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-3 h-3 bg-blue-600 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>
    </div>
  );
};

// Hook para mostrar loading con delay
export const useDelayedLoading = (isLoading: boolean, delay: number = 200) => {
  const [showLoading, setShowLoading] = React.useState(false);

  React.useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (isLoading) {
      timeoutId = setTimeout(() => {
        setShowLoading(true);
      }, delay);
    } else {
      setShowLoading(false);
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [isLoading, delay]);

  return showLoading;
};

// Componente de Loading específico para botones
export const ButtonLoading: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
  const sizeClasses = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5'
  };

  return (
    <Loader2 className={`animate-spin ${sizeClasses[size]}`} />
  );
};

// Componente de Loading para tablas
export const TableLoading: React.FC<{ rows?: number; columns?: number }> = ({ 
  rows = 5, 
  columns = 4 
}) => {
  return (
    <div className="animate-pulse">
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex space-x-4 mb-4">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <div
              key={colIndex}
              className="h-4 bg-gray-200 dark:bg-gray-700 rounded flex-1"
            ></div>
          ))}
        </div>
      ))}
    </div>
  );
};

// Componente de Loading para cards
export const CardLoading: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 animate-pulse">
      <div className="flex items-center space-x-4 mb-4">
        <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
        <div className="flex-1">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-4/6"></div>
      </div>
    </div>
  );
};