// src/components/ui/Alert.tsx
import React, { ReactNode } from 'react';
import { AlertCircle, CheckCircle, AlertTriangle, Info } from 'lucide-react';

interface AlertProps {
  children: ReactNode;
  variant?: 'default' | 'destructive' | 'success' | 'warning' | 'info' | 'error';
  className?: string;
}

const Alert: React.FC<AlertProps> = ({ 
  children, 
  variant = 'default', 
  className = '' 
}) => {
  const baseClasses = 'relative w-full rounded-lg border p-4 flex items-start space-x-3';
  
  const variantClasses = {
    default: 'border-gray-200 bg-gray-50 text-gray-900',
    destructive: 'border-red-200 bg-red-50 text-red-900',
    error: 'border-red-200 bg-red-50 text-red-900',
    success: 'border-green-200 bg-green-50 text-green-900',
    warning: 'border-yellow-200 bg-yellow-50 text-yellow-900',
    info: 'border-blue-200 bg-blue-50 text-blue-900'
  };

  const getIcon = () => {
    const iconProps = { 
      className: "h-4 w-4 flex-shrink-0 mt-0.5",
      'aria-hidden': true as const
    };

    switch (variant) {
      case 'destructive':
      case 'error':
        return <AlertCircle {...iconProps} className="h-4 w-4 text-red-500" />;
      case 'success':
        return <CheckCircle {...iconProps} className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertTriangle {...iconProps} className="h-4 w-4 text-yellow-500" />;
      case 'info':
        return <Info {...iconProps} className="h-4 w-4 text-blue-500" />;
      default:
        return <Info {...iconProps} className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
      {getIcon()}
      <div className="flex-1 min-w-0">
        {children}
      </div>
    </div>
  );
};

interface AlertTitleProps {
  children: ReactNode;
  className?: string;
}

export const AlertTitle: React.FC<AlertTitleProps> = ({ children, className = '' }) => {
  return (
    <h5 className={`mb-1 font-medium leading-none tracking-tight ${className}`}>
      {children}
    </h5>
  );
};

interface AlertDescriptionProps {
  children: ReactNode;
  className?: string;
}

export const AlertDescription: React.FC<AlertDescriptionProps> = ({ children, className = '' }) => {
  return (
    <div className={`text-sm opacity-90 ${className}`}>
      {children}
    </div>
  );
};

export default Alert;