// src/modules/auth/pages/RegisterPage.tsx - FIXED
import React, { useState } from 'react';
import { 
  Eye, 
  EyeOff, 
  User, 
  Mail, 
  Lock, 
  Phone, 
  MapPin, 
  Building, 
  CreditCard, 
  CheckCircle,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';

// Navigation hook simple
const useNavigate = () => {
  return (path: string) => {
    window.location.hash = path;
    window.location.reload();
  };
};

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Form data
  const [formData, setFormData] = useState({
    // Step 1: Personal Info
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    
    // Step 2: Company Info
    companyName: '',
    companyType: '',
    taxId: '',
    address: '',
    city: '',
    country: '',
    
    // Step 3: Account Security
    password: '',
    confirmPassword: '',
    acceptTerms: false,
    acceptPrivacy: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Handle input change
  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  // Validate current step
  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.firstName.trim()) newErrors.firstName = 'Nombre es requerido';
      if (!formData.lastName.trim()) newErrors.lastName = 'Apellido es requerido';
      if (!formData.email.trim()) newErrors.email = 'Email es requerido';
      if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Email inválido';
      }
      if (!formData.phone.trim()) newErrors.phone = 'Teléfono es requerido';
    }

    if (step === 2) {
      if (!formData.companyName.trim()) newErrors.companyName = 'Nombre de empresa es requerido';
      if (!formData.companyType) newErrors.companyType = 'Tipo de empresa es requerido';
      if (!formData.address.trim()) newErrors.address = 'Dirección es requerida';
      if (!formData.city.trim()) newErrors.city = 'Ciudad es requerida';
      if (!formData.country) newErrors.country = 'País es requerido';
    }

    if (step === 3) {
      if (!formData.password) newErrors.password = 'Contraseña es requerida';
      if (formData.password && formData.password.length < 6) {
        newErrors.password = 'Contraseña debe tener al menos 6 caracteres';
      }
      if (!formData.confirmPassword) newErrors.confirmPassword = 'Confirmar contraseña es requerida';
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Las contraseñas no coinciden';
      }
      if (!formData.acceptTerms) newErrors.acceptTerms = 'Debe aceptar los términos y condiciones';
      if (!formData.acceptPrivacy) newErrors.acceptPrivacy = 'Debe aceptar la política de privacidad';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Next step
  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 3));
    }
  };

  // Previous step
  const handlePrevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep(3)) return;

    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Registro exitoso:', formData);
      
      // Redirect to login
      navigate('/login');
      
    } catch (error) {
      console.error('Error en registro:', error);
      setErrors({ submit: 'Error en el registro. Por favor intenta nuevamente.' });
    } finally {
      setIsLoading(false);
    }
  };

  // Countries list
  const countries = [
    'Costa Rica', 'Guatemala', 'Honduras', 'El Salvador', 'Nicaragua', 
    'Panamá', 'México', 'Estados Unidos', 'Canadá', 'Colombia', 'Otro'
  ];

  // Company types
  const companyTypes = [
    'Importador', 'Exportador', 'Freight Forwarder', 'Agente de Carga',
    'Courier', 'E-commerce', 'Retail', 'Manufactura', 'Otro'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-2 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              ITOBOX Courier
            </h1>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Crear Cuenta</h2>
          <p className="text-gray-600">Complete el registro para acceder al sistema</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center font-bold
                  ${currentStep >= step 
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white' 
                    : 'bg-gray-200 text-gray-500'
                  }
                `}>
                  {currentStep > step ? <CheckCircle className="w-5 h-5" /> : step}
                </div>
                {step < 3 && (
                  <div className={`
                    w-20 h-1 mx-2
                    ${currentStep > step ? 'bg-gradient-to-r from-blue-500 to-indigo-500' : 'bg-gray-200'}
                  `} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Información Personal</span>
            <span>Información de Empresa</span>
            <span>Seguridad</span>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-8">
          <form onSubmit={handleSubmit}>
            {/* Step 1: Personal Info */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Información Personal</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        className={`w-full pl-12 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${
                          errors.firstName ? 'border-red-300 bg-red-50' : 'border-gray-300'
                        }`}
                        placeholder="Tu nombre"
                      />
                    </div>
                    {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Apellido *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        className={`w-full pl-12 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${
                          errors.lastName ? 'border-red-300 bg-red-50' : 'border-gray-300'
                        }`}
                        placeholder="Tu apellido"
                      />
                    </div>
                    {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className={`w-full pl-12 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${
                        errors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                      placeholder="tu@email.com"
                    />
                  </div>
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Teléfono *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className={`w-full pl-12 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${
                        errors.phone ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                      placeholder="+506 8888-8888"
                    />
                  </div>
                  {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                </div>
              </div>
            )}

            {/* Step 2: Company Info */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Información de Empresa</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre de Empresa *
                  </label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      value={formData.companyName}
                      onChange={(e) => handleInputChange('companyName', e.target.value)}
                      className={`w-full pl-12 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${
                        errors.companyName ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                      placeholder="Mi Empresa S.A."
                    />
                  </div>
                  {errors.companyName && <p className="text-red-500 text-sm mt-1">{errors.companyName}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tipo de Empresa *
                    </label>
                    <select
                      value={formData.companyType}
                      onChange={(e) => handleInputChange('companyType', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${
                        errors.companyType ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Seleccionar tipo</option>
                      {companyTypes.map((type) => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                    {errors.companyType && <p className="text-red-500 text-sm mt-1">{errors.companyType}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cédula Jurídica / Tax ID
                    </label>
                    <div className="relative">
                      <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        value={formData.taxId}
                        onChange={(e) => handleInputChange('taxId', e.target.value)}
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                        placeholder="3-101-123456"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dirección *
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      className={`w-full pl-12 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${
                        errors.address ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                      placeholder="Dirección completa"
                    />
                  </div>
                  {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ciudad *
                    </label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${
                        errors.city ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                      placeholder="San José"
                    />
                    {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      País *
                    </label>
                    <select
                      value={formData.country}
                      onChange={(e) => handleInputChange('country', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${
                        errors.country ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Seleccionar país</option>
                      {countries.map((country) => (
                        <option key={country} value={country}>{country}</option>
                      ))}
                    </select>
                    {errors.country && <p className="text-red-500 text-sm mt-1">{errors.country}</p>}
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Security */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Seguridad de la Cuenta</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contraseña *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      className={`w-full pl-12 pr-12 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${
                        errors.password ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
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
                  {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirmar Contraseña *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      className={`w-full pl-12 pr-12 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${
                        errors.confirmPassword ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                      placeholder="Repetir contraseña"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
                </div>

                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      id="acceptTerms"
                      checked={formData.acceptTerms}
                      onChange={(e) => handleInputChange('acceptTerms', e.target.checked)}
                      className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="acceptTerms" className="text-sm text-gray-700">
                      Acepto los{' '}
                      <a href="#" className="text-blue-600 hover:text-blue-800 font-medium">
                        Términos y Condiciones
                      </a>{' '}
                      del servicio *
                    </label>
                  </div>
                  {errors.acceptTerms && <p className="text-red-500 text-sm">{errors.acceptTerms}</p>}

                  <div className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      id="acceptPrivacy"
                      checked={formData.acceptPrivacy}
                      onChange={(e) => handleInputChange('acceptPrivacy', e.target.checked)}
                      className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="acceptPrivacy" className="text-sm text-gray-700">
                      Acepto la{' '}
                      <a href="#" className="text-blue-600 hover:text-blue-800 font-medium">
                        Política de Privacidad
                      </a>{' '}
                      y el tratamiento de mis datos *
                    </label>
                  </div>
                  {errors.acceptPrivacy && <p className="text-red-500 text-sm">{errors.acceptPrivacy}</p>}
                </div>

                {errors.submit && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                    <p className="text-red-600 text-sm">{errors.submit}</p>
                  </div>
                )}
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
              <div>
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="flex items-center space-x-2 px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Anterior</span>
                  </button>
                )}
              </div>

              <div className="flex items-center space-x-4">
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  ¿Ya tienes cuenta? Iniciar sesión
                </button>

                {currentStep < 3 ? (
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-8 py-3 rounded-xl hover:from-blue-600 hover:to-indigo-600 transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    <span>Siguiente</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex items-center space-x-2 bg-gradient-to-r from-green-500 to-blue-500 text-white px-8 py-3 rounded-xl hover:from-green-600 hover:to-blue-600 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Creando cuenta...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        <span>Crear Cuenta</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            © 2024 ITOBOX Courier. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
