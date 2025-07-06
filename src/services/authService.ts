// 🔐 src/services/authService.ts - SERVICIO DE AUTENTICACIÓN FRONTEND
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'courier' | 'client';
  phone?: string;
  avatar?: string;
  emailVerified: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role?: 'admin' | 'courier' | 'client';
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
  };
}

export interface ApiError {
  success: false;
  message: string;
  errors?: any[];
}

class AuthService {
  private readonly baseUrl = `${API_BASE_URL}/api/auth`;
  private token: string | null = null;
  private user: User | null = null;

  constructor() {
    // Cargar token del localStorage al inicializar
    this.loadFromStorage();
  }

  // 💾 GESTIÓN DE ALMACENAMIENTO LOCAL
  private loadFromStorage(): void {
    try {
      const token = localStorage.getItem('auth_token');
      const userData = localStorage.getItem('auth_user');
      
      if (token && userData) {
        this.token = token;
        this.user = JSON.parse(userData);
      }
    } catch (error) {
      console.error('❌ Error cargando datos de auth:', error);
      this.clearStorage();
    }
  }

  private saveToStorage(token: string, user: User): void {
    try {
      localStorage.setItem('auth_token', token);
      localStorage.setItem('auth_user', JSON.stringify(user));
      this.token = token;
      this.user = user;
    } catch (error) {
      console.error('❌ Error guardando datos de auth:', error);
    }
  }

  private clearStorage(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    this.token = null;
    this.user = null;
  }

  // 🌐 CLIENTE HTTP
  private async makeRequest(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<any> {
    try {
      const url = `${this.baseUrl}${endpoint}`;
      
      const config: RequestInit = {
        headers: {
          'Content-Type': 'application/json',
          ...(this.token && { Authorization: `Bearer ${this.token}` }),
          ...options.headers,
        },
        ...options,
      };

      console.log(`📡 AUTH API: ${options.method || 'GET'} ${url}`);
      
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          success: false,
          message: `HTTP Error ${response.status}: ${response.statusText}`
        }));
        
        throw new Error(errorData.message || 'Error en la petición');
      }

      const data = await response.json();
      console.log(`✅ AUTH API Response:`, data);
      
      return data;
      
    } catch (error) {
      console.error(`❌ AUTH API Error:`, error);
      throw error;
    }
  }

  // 🔐 LOGIN
  async login(credentials: LoginRequest): Promise<User> {
    try {
      console.log('🔐 Iniciando login para:', credentials.email);
      
      const response = await this.makeRequest('/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });

      if (!response.success) {
        throw new Error(response.message);
      }

      const { user, token } = response.data;
      this.saveToStorage(token, user);
      
      console.log('✅ Login exitoso:', user.email, 'Rol:', user.role);
      return user;
      
    } catch (error) {
      console.error('❌ Error en login:', error);
      throw error;
    }
  }

  // 📝 REGISTRO
  async register(userData: RegisterRequest): Promise<User> {
    try {
      console.log('📝 Iniciando registro para:', userData.email);
      
      const response = await this.makeRequest('/register', {
        method: 'POST',
        body: JSON.stringify(userData),
      });

      if (!response.success) {
        throw new Error(response.message);
      }

      const { user, token } = response.data;
      this.saveToStorage(token, user);
      
      console.log('✅ Registro exitoso:', user.email);
      return user;
      
    } catch (error) {
      console.error('❌ Error en registro:', error);
      throw error;
    }
  }

  // 🔓 LOGOUT
  async logout(): Promise<void> {
    try {
      console.log('🔓 Iniciando logout');
      
      if (this.token) {
        await this.makeRequest('/logout', {
          method: 'POST',
        }).catch(error => {
          console.warn('⚠️ Error en logout del servidor:', error);
        });
      }
      
      this.clearStorage();
      console.log('✅ Logout completado');
      
    } catch (error) {
      console.error('❌ Error en logout:', error);
      this.clearStorage(); // Limpiar local aunque falle el servidor
    }
  }

  // 👤 OBTENER PERFIL
  async getProfile(): Promise<User> {
    try {
      const response = await this.makeRequest('/profile');
      
      if (!response.success) {
        throw new Error(response.message);
      }
      
      const user = response.data.user;
      this.user = user;
      localStorage.setItem('auth_user', JSON.stringify(user));
      
      return user;
      
    } catch (error) {
      console.error('❌ Error obteniendo perfil:', error);
      throw error;
    }
  }

  // 🔄 ACTUALIZAR PERFIL
  async updateProfile(updates: Partial<RegisterRequest>): Promise<User> {
    try {
      console.log('🔄 Actualizando perfil');
      
      const response = await this.makeRequest('/profile', {
        method: 'PUT',
        body: JSON.stringify(updates),
      });

      if (!response.success) {
        throw new Error(response.message);
      }

      const user = response.data.user;
      this.user = user;
      localStorage.setItem('auth_user', JSON.stringify(user));
      
      console.log('✅ Perfil actualizado');
      return user;
      
    } catch (error) {
      console.error('❌ Error actualizando perfil:', error);
      throw error;
    }
  }

  // 🔑 FORGOT PASSWORD
  async forgotPassword(email: string): Promise<void> {
    try {
      console.log('🔑 Solicitando reset de contraseña para:', email);
      
      const response = await this.makeRequest('/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email }),
      });

      if (!response.success) {
        throw new Error(response.message);
      }
      
      console.log('✅ Email de reset enviado');
      
    } catch (error) {
      console.error('❌ Error en forgot password:', error);
      throw error;
    }
  }

  // 🔄 RESET PASSWORD
  async resetPassword(token: string, newPassword: string): Promise<void> {
    try {
      console.log('🔄 Restableciendo contraseña');
      
      const response = await this.makeRequest('/reset-password', {
        method: 'POST',
        body: JSON.stringify({ token, newPassword }),
      });

      if (!response.success) {
        throw new Error(response.message);
      }
      
      console.log('✅ Contraseña restablecida');
      
    } catch (error) {
      console.error('❌ Error restableciendo contraseña:', error);
      throw error;
    }
  }

  // ✅ VERIFICAR TOKEN
  async verifyToken(): Promise<boolean> {
    try {
      if (!this.token) return false;
      
      const response = await this.makeRequest('/verify-token');
      return response.success;
      
    } catch (error) {
      console.warn('⚠️ Token inválido, limpiando sesión');
      this.clearStorage();
      return false;
    }
  }

  // 📊 GETTERS
  getCurrentUser(): User | null {
    return this.user;
  }

  getToken(): string | null {
    return this.token;
  }

  isAuthenticated(): boolean {
    return !!(this.token && this.user);
  }

  hasRole(role: string): boolean {
    return this.user?.role === role;
  }

  isAdmin(): boolean {
    return this.hasRole('admin');
  }

  isCourier(): boolean {
    return this.hasRole('courier');
  }

  isClient(): boolean {
    return this.hasRole('client');
  }

  // 🧪 TEST CONNECTION
  async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/health`);
      const data = await response.json();
      return data.success;
    } catch (error) {
      console.error('❌ Error conectando con auth service:', error);
      return false;
    }
  }
}

// Singleton instance
export const authService = new AuthService();
export default authService;