// src/contexts/AuthContext.tsx - Actualizar ProtectedRoute
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { User, AuthContextType, RegisterFormData } from '../types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Simular verificación de token al cargar la app
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        const userData = localStorage.getItem('user_data');
        
        if (token && userData) {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
        }
      } catch (error) {
        console.error('Error checking auth:', error);
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_data');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    try {
      // Simulación de login - reemplazar con API real
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Usuario mock
      const mockUser: User = {
        id: '1',
        email,
        firstName: 'Usuario',
        lastName: 'Demo',
        name: 'Usuario Demo',
        role: email.includes('admin') ? 'admin' : 'client',
        phone: '+506 1234 5678',
        address: 'San José, Costa Rica',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const mockToken = 'mock-jwt-token-' + Date.now();
      
      localStorage.setItem('auth_token', mockToken);
      localStorage.setItem('user_data', JSON.stringify(mockUser));
      
      setUser(mockUser);
    } catch (error) {
      console.error('Login error:', error);
      throw new Error('Credenciales inválidas');
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterFormData): Promise<void> => {
    setIsLoading(true);
    try {
      // Simulación de registro - reemplazar con API real
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newUser: User = {
        id: 'new-' + Date.now(),
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        name: `${data.firstName} ${data.lastName}`,
        role: 'client',
        phone: data.phone,
        address: '',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const mockToken = 'mock-jwt-token-' + Date.now();
      
      localStorage.setItem('auth_token', mockToken);
      localStorage.setItem('user_data', JSON.stringify(newUser));
      
      setUser(newUser);
    } catch (error) {
      console.error('Register error:', error);
      throw new Error('Error en el registro');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    setIsLoading(true);
    try {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = (userData: Partial<User>): void => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('user_data', JSON.stringify(updatedUser));
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    updateUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Componente de ruta protegida MEJORADO con redirección automática
interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: Array<'admin' | 'courier' | 'client' | 'operator'>;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  allowedRoles 
}) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  // Redirección automática al login si no está autenticado
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-center mb-4">Acceso Denegado</h2>
          <p className="text-gray-600 text-center">
            No tienes permisos para acceder a esta página.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthContext;