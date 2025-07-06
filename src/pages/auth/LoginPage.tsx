import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  LogIn, 
  Package, 
  Truck, 
  Users,
  ArrowRight,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

const LoginPage: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [localError, setLocalError] = useState('');

  const { login, isLoading, error, clearError, isAuthenticated } = useAuth();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      window.location.href = '/';
    }
  }, [isAuthenticated]);

  // Clear errors when form changes
  useEffect(() => {
    if (error || localError) {
      const timer = setTimeout(() => {
        clearError();
        setLocalError('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, localError, clearError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');

    // Basic validation
    if (!formData.email.trim()) {
      setLocalError('El email es requerido');
      return;
    }

    if (!formData.password.trim()) {
      setLocalError('La contraseña es requerida');
      return;
    }

    if (formData.password.length < 3) {
      setLocalError('La contraseña debe tener al menos 3 caracteres');
      return;
    }

    try {
      const success = await login(formData);
      if (success) {
        console.log('Login successful');
      }
    } catch (err) {
      setLocalError('Error inesperado. Inténtalo de nuevo.');
    }
  };

  const handleQuickLogin = (userType: 'admin' | 'courier' | 'client') => {
    const credentials = {
      admin: { email: 'admin@itobox.com', password: 'admin123' },
      courier: { email: 'courier@itobox.com', password: 'courier123' },
      client: { email: 'client@itobox.com', password: 'client123' }
    };

    setFormData(credentials[userType]);
  };

  const currentError = error || localError;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-br from-blue-400/30 to-purple-600/30 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-gradient-to-br from-purple-400/30 to-pink-600/30 rounded-full blur-3xl transform translate-x-1/2 translate-y-1/2"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-gradient-to-br from-indigo-400/20 to-blue-600/20 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
      </div>

      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10">
        {/* Left Side - Branding */}
        <div className="hidden lg:flex flex-col justify-center items-center text-center p-8">
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-2xl">
            <div className="flex items-center justify-center mb-8">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 rounded-2xl shadow-lg">
                <Package className="w-12 h-12 text-white" />
              </div>
            </div>
            
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              ITOBOX Courier
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Sistema profesional de gestión de paquetes y logística para Costa Rica
            </p>

            <div className="grid grid-cols-1 gap-4 text-left">
              {[
                { icon: Package, title: 'Gestión de Paquetes', desc: 'Control completo de envíos y tracking' },
                { icon: Truck, title: 'Red de Couriers', desc: 'Seguimiento en tiempo real de entregas' },
                { icon: Users, title: 'Portal de Clientes', desc: 'Acceso directo para tus clientes' }
              ].map((feature, index) => (
                <div key={index} className="flex items-center gap-4 p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/10">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-2 rounded-lg">
                    <feature.icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{feature.title}</h3>
                    <p className="text-sm text-gray-600">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="flex items-center justify-center">
          <div className="w-full max-w-md">
            <div className="bg-white/70 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-white/20">
              {/* Header */}
              <div className="text-center mb-8">
                <div className="flex justify-center mb-4 lg:hidden">
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-xl shadow-lg">
                    <Package className="w-8 h-8 text-white" />
                  </div>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Iniciar Sesión</h2>
                <p className="text-gray-600">Accede a tu cuenta de ITOBOX Courier</p>
              </div>

              {/* Error Alert */}
              {currentError && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                  <span className="text-red-700 text-sm">{currentError}</span>
                </div>
              )}

              {/* Quick Login Buttons */}
              <div className="mb-6">
                <p className="text-sm font-medium text-gray-700 mb-3">Acceso rápido:</p>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { type: 'admin', label: 'Admin', color: 'from-red-500 to-red-600' },
                    { type: 'courier', label: 'Courier', color: 'from-blue-500 to-blue-600' },
                    { type: 'client', label: 'Cliente', color: 'from-green-500 to-green-600' }
                  ].map((btn) => (
                    <button
                      key={btn.type}
                      onClick={() => handleQuickLogin(btn.type as any)}
                      disabled={isLoading}
                      className={`p-2 text-xs font-medium text-white rounded-lg bg-gradient-to-r ${btn.color} hover:shadow-lg transition-all duration-200 disabled:opacity-50`}
                    >
                      {btn.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white/70 text-gray-500">o ingresa manualmente</span>
                </div>
              </div>

              {/* Login Form */}
              <div className="space-y-6">
                {/* Email Field */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      id="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/80 backdrop-blur-sm placeholder-gray-400 transition-all duration-200"
                      placeholder="tu@email.com"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Contraseña
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      value={formData.password}
                      onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                      className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/80 backdrop-blur-sm placeholder-gray-400 transition-all duration-200"
                      placeholder="••••••••"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      disabled={isLoading}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Remember Me */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      disabled={isLoading}
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                      Recordarme
                    </label>
                  </div>
                  <button
                    type="button"
                    className="text-sm text-blue-600 hover:text-blue-500 font-medium"
                    disabled={isLoading}
                  >
                    ¿Olvidaste tu contraseña?
                  </button>
                </div>

                {/* Submit Button */}
                <button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-lg text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-xl"
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <LogIn className="w-5 h-5" />
                      Iniciar Sesión
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

              {/* Footer */}
              <div className="mt-8 text-center">
                <p className="text-sm text-gray-600">
                  ¿No tienes cuenta?{' '}
                  <button className="font-medium text-blue-600 hover:text-blue-500">
                    Solicitar acceso
                  </button>
                </p>
              </div>

              {/* Demo Info */}
              <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-blue-900">Demo Disponible</h4>
                    <p className="text-xs text-blue-700 mt-1">
                      Usa cualquier email y contraseña para probar el sistema, o los botones de acceso rápido arriba.
                    </p>
                  </div>
                </div>
              </div>

              {/* Credenciales de Prueba */}
              <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <h5 className="text-xs font-semibold text-gray-700 mb-2">Credenciales de Prueba:</h5>
                <div className="text-xs text-gray-600 space-y-1">
                  <div><strong>Admin:</strong> admin@itobox.com / admin123</div>
                  <div><strong>Courier:</strong> courier@itobox.com / courier123</div>
                  <div><strong>Cliente:</strong> client@itobox.com / client123</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;