import React, { useState } from 'react';
import { ArrowLeft, User, Phone, Mail, MapPin, Building, CreditCard, Save, AlertCircle } from 'lucide-react';

interface ClientData {
  // Información Personal/Empresa
  clientType: 'individual' | 'company';
  firstName: string;
  lastName: string;
  companyName: string;
  email: string;
  phone: string;
  
  // Identificación
  identificationType: 'cedula' | 'passport' | 'dimex';
  identificationNumber: string;
  
  // Dirección
  address: string;
  city: string;
  province: string;
  postalCode: string;
  country: string;
  
  // Información Comercial
  businessType: string;
  taxId: string;
  creditLimit: number;
  
  // Contacto Adicional
  alternativePhone: string;
  emergencyContact: string;
  emergencyPhone: string;
  
  // Preferencias
  preferredDeliveryTime: string;
  specialInstructions: string;
  marketingConsent: boolean;
}

interface FormErrors {
  [key: string]: string;
}

const NewClientPage: React.FC = () => {
  const [formData, setFormData] = useState<ClientData>({
    clientType: 'individual',
    firstName: '',
    lastName: '',
    companyName: '',
    email: '',
    phone: '',
    identificationType: 'cedula',
    identificationNumber: '',
    address: '',
    city: '',
    province: '',
    postalCode: '',
    country: 'Costa Rica',
    businessType: '',
    taxId: '',
    creditLimit: 0,
    alternativePhone: '',
    emergencyContact: '',
    emergencyPhone: '',
    preferredDeliveryTime: 'any',
    specialInstructions: '',
    marketingConsent: false
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [currentStep, setCurrentStep] = useState(1);

  const provinces = [
    { value: '', label: 'Seleccionar provincia' },
    { value: 'san-jose', label: 'San José' },
    { value: 'alajuela', label: 'Alajuela' },
    { value: 'cartago', label: 'Cartago' },
    { value: 'heredia', label: 'Heredia' },
    { value: 'guanacaste', label: 'Guanacaste' },
    { value: 'puntarenas', label: 'Puntarenas' },
    { value: 'limon', label: 'Limón' }
  ];

  const deliveryTimes = [
    { value: 'any', label: 'Cualquier horario' },
    { value: 'morning', label: 'Mañana (8:00 AM - 12:00 PM)' },
    { value: 'afternoon', label: 'Tarde (12:00 PM - 6:00 PM)' },
    { value: 'evening', label: 'Noche (6:00 PM - 10:00 PM)' },
    { value: 'business', label: 'Horario comercial (8:00 AM - 5:00 PM)' }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' 
        ? (e.target as HTMLInputElement).checked 
        : type === 'number' 
          ? parseFloat(value) || 0 
          : value
    }));

    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: FormErrors = {};

    if (step === 1) {
      // Validar información básica
      if (formData.clientType === 'individual') {
        if (!formData.firstName.trim()) {
          newErrors.firstName = 'Los nombres son requeridos';
        }
        if (!formData.lastName.trim()) {
          newErrors.lastName = 'Los apellidos son requeridos';
        }
      } else {
        if (!formData.companyName.trim()) {
          newErrors.companyName = 'El nombre de la empresa es requerido';
        }
      }

      // Validar email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!formData.email) {
        newErrors.email = 'El email es requerido';
      } else if (!emailRegex.test(formData.email)) {
        newErrors.email = 'Formato de email inválido';
      }

      // Validar teléfono
      if (!formData.phone.trim()) {
        newErrors.phone = 'El teléfono es requerido';
      }

      // Validar identificación
      if (!formData.identificationNumber.trim()) {
        newErrors.identificationNumber = 'El número de identificación es requerido';
      }
    }

    if (step === 2) {
      // Validar dirección
      if (!formData.address.trim()) {
        newErrors.address = 'La dirección es requerida';
      }
      if (!formData.city.trim()) {
        newErrors.city = 'La ciudad es requerida';
      }
      if (!formData.province) {
        newErrors.province = 'La provincia es requerida';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep(currentStep)) {
      return;
    }

    setIsLoading(true);

    try {
      // Simular envío al backend
      console.log('📝 Creando nuevo cliente:', formData);

      // Simular llamada API
      const response = await fetch('/api/clients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Error al crear cliente');
      }

      // Simular delay de red
      await new Promise(resolve => setTimeout(resolve, 2000));

      alert('¡Cliente registrado exitosamente!');
      
      // Redirigir a la lista de clientes
      window.location.href = '/clients';

    } catch (error) {
      console.error('Error:', error);
      alert('Error al registrar cliente. Inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const goBack = () => {
    window.history.back();
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      <div className="flex items-center space-x-4">
        {[1, 2, 3].map((step) => (
          <React.Fragment key={step}>
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                step <= currentStep
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                  : 'bg-gray-200 text-gray-500'
              }`}
            >
              {step}
            </div>
            {step < 3 && (
              <div
                className={`w-16 h-1 ${
                  step < currentStep ? 'bg-gradient-to-r from-blue-500 to-purple-600' : 'bg-gray-200'
                }`}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-8">
      {/* Tipo de Cliente */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
          <User className="w-5 h-5" />
          Tipo de Cliente
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="flex items-center space-x-3 cursor-pointer p-4 border rounded-xl hover:bg-blue-50 transition-colors">
            <input
              type="radio"
              name="clientType"
              value="individual"
              checked={formData.clientType === 'individual'}
              onChange={handleInputChange}
              className="w-4 h-4 text-blue-600"
            />
            <div>
              <span className="font-medium text-gray-700">Persona Individual</span>
              <p className="text-sm text-gray-500">Cliente personal</p>
            </div>
          </label>
          <label className="flex items-center space-x-3 cursor-pointer p-4 border rounded-xl hover:bg-blue-50 transition-colors">
            <input
              type="radio"
              name="clientType"
              value="company"
              checked={formData.clientType === 'company'}
              onChange={handleInputChange}
              className="w-4 h-4 text-blue-600"
            />
            <div>
              <span className="font-medium text-gray-700">Empresa</span>
              <p className="text-sm text-gray-500">Cliente corporativo</p>
            </div>
          </label>
        </div>
      </div>

      {/* Información Personal/Empresa */}
      <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-2xl p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
          {formData.clientType === 'company' ? <Building className="w-5 h-5" /> : <User className="w-5 h-5" />}
          {formData.clientType === 'company' ? 'Información de la Empresa' : 'Información Personal'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {formData.clientType === 'company' ? (
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre de la Empresa *
              </label>
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 rounded-xl border ${
                  errors.companyName ? 'border-red-300' : 'border-gray-200'
                } focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all`}
                placeholder="Ingresa el nombre de la empresa"
              />
              {errors.companyName && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.companyName}
                </p>
              )}
            </div>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombres *
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 rounded-xl border ${
                    errors.firstName ? 'border-red-300' : 'border-gray-200'
                  } focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all`}
                  placeholder="Ingresa los nombres"
                />
                {errors.firstName && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.firstName}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Apellidos *
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 rounded-xl border ${
                    errors.lastName ? 'border-red-300' : 'border-gray-200'
                  } focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all`}
                  placeholder="Ingresa los apellidos"
                />
                {errors.lastName && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.lastName}
                  </p>
                )}
              </div>
            </>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email *
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
                } focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all`}
                placeholder="ejemplo@email.com"
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.email}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Teléfono Principal *
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
                } focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all`}
                placeholder="+506 1234-5678"
              />
            </div>
            {errors.phone && (
              <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.phone}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Identificación */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
          <CreditCard className="w-5 h-5" />
          Identificación
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Identificación
            </label>
            <select
              name="identificationType"
              value={formData.identificationType}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all appearance-none bg-white"
            >
              <option value="cedula">Cédula Nacional</option>
              <option value="passport">Pasaporte</option>
              <option value="dimex">DIMEX</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Número de Identificación *
            </label>
            <input
              type="text"
              name="identificationNumber"
              value={formData.identificationNumber}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 rounded-xl border ${
                errors.identificationNumber ? 'border-red-300' : 'border-gray-200'
              } focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all`}
              placeholder="1-1234-5678"
            />
            {errors.identificationNumber && (
              <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.identificationNumber}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-8">
      {/* Dirección */}
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          Dirección
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Dirección Completa *
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-4 w-5 h-5 text-gray-400" />
              <textarea
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                rows={3}
                className={`w-full pl-12 pr-4 py-3 rounded-xl border ${
                  errors.address ? 'border-red-300' : 'border-gray-200'
                } focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all resize-none`}
                placeholder="Dirección completa del cliente"
              />
            </div>
            {errors.address && (
              <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.address}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ciudad *
            </label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 rounded-xl border ${
                errors.city ? 'border-red-300' : 'border-gray-200'
              } focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all`}
              placeholder="San José"
            />
            {errors.city && (
              <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.city}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Provincia *
            </label>
            <select
              name="province"
              value={formData.province}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 rounded-xl border ${
                errors.province ? 'border-red-300' : 'border-gray-200'
              } focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all appearance-none bg-white`}
            >
              {provinces.map((province) => (
                <option key={province.value} value={province.value}>
                  {province.label}
                </option>
              ))}
            </select>
            {errors.province && (
              <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.province}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Código Postal
            </label>
            <input
              type="text"
              name="postalCode"
              value={formData.postalCode}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all"
              placeholder="10101"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              País
            </label>
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all"
              placeholder="Costa Rica"
            />
          </div>
        </div>
      </div>

      {/* Información Comercial */}
      {formData.clientType === 'company' && (
        <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
            <Building className="w-5 h-5" />
            Información Comercial
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Negocio
              </label>
              <input
                type="text"
                name="businessType"
                value={formData.businessType}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                placeholder="Ej: Comercio, Servicios, Manufactura"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cédula Jurídica
              </label>
              <input
                type="text"
                name="taxId"
                value={formData.taxId}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                placeholder="3-101-123456"
              />
            </div>
          </div>
        </div>
      )}

      {/* Contactos Adicionales */}
      <div className="bg-gradient-to-r from-rose-50 to-pink-50 rounded-2xl p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
          <Phone className="w-5 h-5" />
          Contactos Adicionales
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Teléfono Alternativo
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="tel"
                name="alternativePhone"
                value={formData.alternativePhone}
                onChange={handleInputChange}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
                placeholder="+506 9876-5432"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contacto de Emergencia
            </label>
            <input
              type="text"
              name="emergencyContact"
              value={formData.emergencyContact}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
              placeholder="Nombre del contacto"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Teléfono de Emergencia
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="tel"
                name="emergencyPhone"
                value={formData.emergencyPhone}
                onChange={handleInputChange}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
                placeholder="+506 1111-2222"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-8">
      {/* Información Financiera */}
      <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-2xl p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
          <CreditCard className="w-5 h-5" />
          Información Financiera
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Límite de Crédito (₡)
            </label>
            <input
              type="number"
              name="creditLimit"
              value={formData.creditLimit}
              onChange={handleInputChange}
              min="0"
              step="1000"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              placeholder="0"
            />
            <p className="text-sm text-gray-500 mt-1">
              Límite de crédito para el cliente (opcional)
            </p>
          </div>
        </div>
      </div>

      {/* Preferencias de Entrega */}
      <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-2xl p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          Preferencias de Entrega
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Horario Preferido de Entrega
            </label>
            <select
              name="preferredDeliveryTime"
              value={formData.preferredDeliveryTime}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all appearance-none bg-white"
            >
              {deliveryTimes.map((time) => (
                <option key={time.value} value={time.value}>
                  {time.label}
                </option>
              ))}
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Instrucciones Especiales
            </label>
            <textarea
              name="specialInstructions"
              value={formData.specialInstructions}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all resize-none"
              placeholder="Instrucciones especiales para la entrega (portón azul, segundo piso, etc.)"
            />
          </div>
        </div>
      </div>

      {/* Consentimientos */}
      <div className="bg-gradient-to-r from-violet-50 to-purple-50 rounded-2xl p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          Consentimientos y Términos
        </h2>
        <div className="space-y-4">
          <label className="flex items-start space-x-3 cursor-pointer">
            <input
              type="checkbox"
              name="marketingConsent"
              checked={formData.marketingConsent}
              onChange={handleInputChange}
              className="w-5 h-5 text-purple-600 rounded border-gray-300 focus:ring-purple-500 mt-0.5"
            />
            <div>
              <span className="text-sm font-medium text-gray-700">
                Acepto recibir comunicaciones de marketing
              </span>
              <p className="text-xs text-gray-500 mt-1">
                Recibirás ofertas especiales, promociones y actualizaciones del servicio por email y SMS
              </p>
            </div>
          </label>
        </div>
      </div>

      {/* Resumen */}
      <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-2xl p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
          <User className="w-5 h-5" />
          Resumen de Información
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium text-gray-600">Tipo de Cliente:</span>
            <p className="text-gray-800">{formData.clientType === 'individual' ? 'Persona Individual' : 'Empresa'}</p>
          </div>
          <div>
            <span className="font-medium text-gray-600">Nombre:</span>
            <p className="text-gray-800">
              {formData.clientType === 'individual' 
                ? `${formData.firstName} ${formData.lastName}` 
                : formData.companyName}
            </p>
          </div>
          <div>
            <span className="font-medium text-gray-600">Email:</span>
            <p className="text-gray-800">{formData.email}</p>
          </div>
          <div>
            <span className="font-medium text-gray-600">Teléfono:</span>
            <p className="text-gray-800">{formData.phone}</p>
          </div>
          <div>
            <span className="font-medium text-gray-600">Identificación:</span>
            <p className="text-gray-800">{formData.identificationNumber}</p>
          </div>
          <div>
            <span className="font-medium text-gray-600">Ciudad:</span>
            <p className="text-gray-800">{formData.city}, {provinces.find(p => p.value === formData.province)?.label}</p>
          </div>
          {formData.creditLimit > 0 && (
            <div>
              <span className="font-medium text-gray-600">Límite de Crédito:</span>
              <p className="text-gray-800">₡{formData.creditLimit.toLocaleString()}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderButtons = () => (
    <div className="flex gap-4 pt-6">
      {currentStep > 1 ? (
        <button
          type="button"
          onClick={handleBack}
          className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
        >
          Anterior
        </button>
      ) : (
        <button
          type="button"
          onClick={goBack}
          className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
        >
          Cancelar
        </button>
      )}
      
      {currentStep < 3 ? (
        <button
          type="button"
          onClick={handleNext}
          className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all"
        >
          Siguiente
        </button>
      ) : (
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-xl hover:from-green-600 hover:to-teal-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Guardando...
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              Guardar Cliente
            </>
          )}
        </button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={goBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Volver a Clientes</span>
          </button>
        </div>

        {/* Main Form */}
        <div className="bg-white/70 backdrop-blur-lg rounded-3xl shadow-xl border border-white/20 p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-600 rounded-2xl flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Nuevo Cliente</h1>
              <p className="text-gray-600">
                Paso {currentStep} de 3 - {
                  currentStep === 1 ? 'Información Básica' :
                  currentStep === 2 ? 'Dirección y Contactos' :
                  'Preferencias y Confirmación'
                }
              </p>
            </div>
          </div>

          {/* Step Indicator */}
          {renderStepIndicator()}

          <form onSubmit={handleSubmit}>
            {/* Step Content */}
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}

            {/* Buttons */}
            {renderButtons()}
          </form>

          {/* Progress Info */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>Progreso: {Math.round((currentStep / 3) * 100)}% completado</span>
              <span>* Campos requeridos</span>
            </div>
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-6 bg-blue-50/50 backdrop-blur-lg rounded-2xl p-6 border border-blue-100">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-800 mb-2">Ayuda y Consejos</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Asegúrate de completar todos los campos marcados con (*)</li>
                <li>• La información de contacto debe ser válida para notificaciones</li>
                <li>• El límite de crédito es opcional y puede modificarse después</li>
                <li>• Las instrucciones especiales ayudan a nuestros couriers</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewClientPage;