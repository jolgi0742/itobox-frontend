// src/modules/auth/services/authService.ts
export interface LoginResponse {
  success: boolean;
  data?: {
    user: {
      id: string;
      email: string;
      name: string;
      role: 'admin' | 'employee' | 'customer';
      createdAt: string;
    };
    token: string;
  };
  error?: string;
}

export interface RegisterResponse {
  success: boolean;
  data?: {
    user: {
      id: string;
      email: string;
      name: string;
      role: 'admin' | 'employee' | 'customer';
      createdAt: string;
    };
    token: string;
  };
  error?: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role?: 'admin' | 'employee' | 'customer';
}

class AuthService {
  private baseUrl = '/api/auth';

  async login(email: string, password: string): Promise<LoginResponse> {
    try {
      // Simulación de API call - reemplaza con tu lógica real
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock success response
      if (email === 'admin@itobox.com' && password === 'admin123') {
        return {
          success: true,
          data: {
            user: {
              id: '1',
              email: email,
              name: 'Admin User',
              role: 'admin',
              createdAt: new Date().toISOString(),
            },
            token: 'mock-jwt-token-' + Date.now(),
          },
        };
      }
      
      if (email === 'user@test.com' && password === 'test123') {
        return {
          success: true,
          data: {
            user: {
              id: '2',
              email: email,
              name: 'Test User',
              role: 'customer',
              createdAt: new Date().toISOString(),
            },
            token: 'mock-jwt-token-' + Date.now(),
          },
        };
      }
      
      return {
        success: false,
        error: 'Credenciales incorrectas',
      };
    } catch (error) {
      return {
        success: false,
        error: 'Error de conexión',
      };
    }
  }

  async register(userData: RegisterData): Promise<RegisterResponse> {
    try {
      // Simulación de API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock success response
      return {
        success: true,
        data: {
          user: {
            id: 'new-' + Date.now(),
            email: userData.email,
            name: userData.name,
            role: userData.role || 'customer',
            createdAt: new Date().toISOString(),
          },
          token: 'mock-jwt-token-' + Date.now(),
        },
      };
    } catch (error) {
      return {
        success: false,
        error: 'Error al crear cuenta',
      };
    }
  }

  async verifyToken(token: string): Promise<boolean> {
    try {
      // Simulación de verificación de token
      await new Promise(resolve => setTimeout(resolve, 500));
      return token.startsWith('mock-jwt-token-');
    } catch (error) {
      return false;
    }
  }

  async logout(): Promise<void> {
    try {
      // Simulación de logout
      await new Promise(resolve => setTimeout(resolve, 300));
    } catch (error) {
      console.error('Error during logout:', error);
    }
  }

  async refreshToken(token: string): Promise<{ token: string } | null> {
    try {
      // Simulación de refresh token
      await new Promise(resolve => setTimeout(resolve, 500));
      return {
        token: 'mock-jwt-token-refreshed-' + Date.now(),
      };
    } catch (error) {
      return null;
    }
  }
}

export const authService = new AuthService();