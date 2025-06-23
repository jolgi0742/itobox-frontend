import { useContext } from 'react';
import AuthContext, { type AuthContextType } from '../contexts/AuthContext';

/**
 * Hook para usar el contexto de autenticación
 * @returns {AuthContextType} Contexto de autenticación
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider');
  }
  
  return context;
};

export default useAuth;