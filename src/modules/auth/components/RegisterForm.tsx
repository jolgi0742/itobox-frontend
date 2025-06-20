import React, { useState } from 'react';
import { User, Mail, Lock, Eye, EyeOff, CreditCard, Phone, MapPin } from 'lucide-react';

interface RegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  identificationType: 'cedula' | 'passport' | 'dimex';
  identificationNumber: string;
  address: string;
  acceptTerms: boolean;
}

const RegisterForm: React.FC = () => {
  const [formData, setFormData] = useState<RegisterFormData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    identificationType: 'cedula',
    identificationNumber: '',
    address: '',
    acceptTerms: false
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<RegisterFormData>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));

    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[name as keyof RegisterFormData]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<RegisterFormData> = {};

    // Validar nombres
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Los nombres son requeridos';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Los apellidos son requeridos';
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = 'El email es requerido';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Formato de email inválido';
    }

    // Validar contraseña
    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    // Validar confirmación de contraseña
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirma tu contraseña';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    // Validar teléfono
    if (!formData.phone.trim()) {
      newErrors.phone = 'El teléfono es requerido';
    }

    // Validar identificación
    if (!formData.identificationNumber.trim()) {
      newErrors.identificationNumber = 'El número de identificación es requerido';
    }

    // Validar términos
    if (!formData.acceptTerms) {
      newErrors.acceptTerms = 'Debes aceptar los términos y condiciones';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Simular registro
      console.log('📝 Registrando usuario:', {
        ...formData,
        password: '[HIDDEN]',
        confirmPassword: '[HIDDEN]'
      });

      await new Promise(resolve => setTimeout(resolve, 2000));

      alert('¡Registro exitoso! Bienvenido a ITOBOX Courier');
      
      // Redirigir al dashboard (simulado)
      window.location.href = '/';

    } catch (error) {
      console.error('Error en registro:', error);
      alert('Error al registrar usuario. Inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const goToLogin = () => {
    // En una aplicación real, usarías React Router
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="w-full max-w-4xl">
        <div className="bg-white/70 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
          <div className="flex flex-col lg:flex-row">
            {/* Panel izquierdo - Información */}
            <div className="lg:w-2/5 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 p-12 text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-8">
                  <User className="w-8 h-8" />
                </div>
                <h1 className="text-4xl font-bold mb-6">
                  Únete a ITOBOX
                </h1>
                <p className="text-xl mb-8 text-blue-100">
                  Regístrate y comienza a disfrutar de nuestros servicios de courier profesional
                </p>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                    <span>Envíos rápidos y seguros</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                    <span>Tracking en tiempo real</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                    <span>Soporte 24/7</span>
                  </div>
                </div>
                <div className="mt-12">
                  <p className="text-blue-100">¿Ya tienes cuenta?</p>
                  <button
                    onClick={goToLogin}
                    className="text-white font-semibold hover:underline mt-2"
                  >
                    Inicia sesión aquí
                  </button>
                </div>
              </div>
            </div>

            {/* Panel derecho - Formulario */}
            <div className="lg:w-3/5 p-12">
              <div className="max-w-md mx-auto">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Crear Cuenta</h2>
                <p className="text-gray-600 mb-8">Completa los datos para registrarte</p>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Información Personal */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nombres
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          className={`w-full pl-12 pr-4 py-3 rounded-xl border ${
                            errors.firstName ? 'border-red-300' : 'border-gray-200'
                          } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                          placeholder="Tus nombres"
                        />
                      </div>
                      {errors.firstName && (
                        <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Apellidos
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          className={`w-full pl-12 pr-4 py-3 rounded-xl border ${
                            errors.lastName ? 'border-red-300' : 'border-gray-200'
                          } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                          placeholder="Tus apellidos"
                        />
                      </div>
                      {errors.lastName && (
                        <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
                      )}
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`w-full pl-12 pr-4 py-3 rounded-xl border ${
                          errors.email ? 'border-red-300' : 'border-gray-200'
                        } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                        placeholder="tu@email.com"
                      />
                    </div>
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                    )}
                  </div>

                  {/* Contraseñas */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Contraseña
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          className={`w-full pl-12 pr-12 py-3 rounded-xl border ${
                            errors.password ? 'border-red-300' : 'border-gray-200'
                          } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                          placeholder="Mínimo 6 caracteres"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                      {errors.password && (
                        <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Confirmar Contraseña
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          className={`w-full pl-12 pr-12 py-3 rounded-xl border ${
                            errors.confirmPassword ? 'border-red-300' : 'border-gray-200'
                          } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                          placeholder="Repite tu contraseña"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                      {errors.confirmPassword && (
                        <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
                      )}
                    </div>
                  </div>

                  {/* Teléfono */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Teléfono
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className={`w-full pl-12 pr-4 py-3 rounded-xl border ${
                          errors.phone ? 'border-red-300' : 'border-gray-200'
                        } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                        placeholder="+506 1234-5678"
                      />
                    </div>
                    {errors.phone && (
                      <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                    )}
                  </div>

                  {/* Identificación */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tipo de Identificación
                      </label>
                      <div className="relative">
                        <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <select
                          name="identificationType"
                          value={formData.identificationType}
                          onChange={handleInputChange}
                          className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none bg-white"
                        >
                          <option value="cedula">Cédula Nacional</option>
                          <option value="passport">Pasaporte</option>
                          <option value="dimex">DIMEX</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Número de Identificación
                      </label>
                      <input
                        type="text"
                        name="identificationNumber"
                        value={formData.identificationNumber}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 rounded-xl border ${
                          errors.identificationNumber ? 'border-red-300' : 'border-gray-200'
                        } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                        placeholder="1-1234-5678"
                      />
                      {errors.identificationNumber && (
                        <p className="text-red-500 text-sm mt-1">{errors.identificationNumber}</p>
                      )}
                    </div>
                  </div>

                  {/* Dirección */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Dirección
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-4 w-5 h-5 text-gray-400" />
                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                        placeholder="Tu dirección completa"
                      />
                    </div>
                  </div>

                  {/* Términos y Condiciones */}
                  <div>
                    <label className="flex items-start space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        name="acceptTerms"
                        checked={formData.acceptTerms}
                        onChange={handleInputChange}
                        className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500 mt-0.5"
                      />
                      <span className="text-sm text-gray-700">
                        Acepto los{' '}
                        <a href="#" className="text-blue-600 hover:underline">
                          términos y condiciones
                        </a>{' '}
                        y la{' '}
                        <a href="#" className="text-blue-600 hover:underline">
                          política de privacidad
                        </a>
                      </span>
                    </label>
                    {errors.acceptTerms && (
                      <p className="text-red-500 text-sm mt-1">{errors.acceptTerms}</p>
                    )}
                  </div>

                  {/* Botón de registro */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Registrando...
                      </>
                    ) : (
                      'Crear Cuenta'
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;