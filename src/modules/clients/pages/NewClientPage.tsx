import React, { useState, useContext } from 'react';
import { Users, ArrowLeft, Save, User, Building, Phone, Mail, MapPin, CreditCard } from 'lucide-react';
import { useNavigation } from '../../../contexts/NavigationContext';

const NewClientPage: React.FC = () => {
  const { navigate  } = useNavigation();
  const [clientType, setClientType] = useState<'individual' | 'company'>('individual');
  const [formData, setFormData] = useState({
    // Información básica
    firstName: '',
    lastName: '',
    companyName: '',
    email: '',
    phone: '',
    
    // Dirección
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'USA',
    
    // Información de facturación
    taxId: '',
    creditLimit: '',
    
    // Configuraciones
    preferredService: 'standard',
    emailNotifications: true,
    smsNotifications: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      // Simular API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generar ID de cliente simulado
      const clientId = `CLI${Date.now().toString().slice(-6)}`;
      
      console.log('👤 Nuevo cliente creado:', {
        ...formData,
        clientId,
        type: clientType,
        status: 'active',
        createdAt: new Date().toISOString()
      });

      // Volver a la lista de clientes
      navigate('clients');
    } catch (error) {
      console.error('Error creando cliente:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('clients')}
            className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Volver a Clientes</span>
          </button>
        </div>
        <div className="flex items-center space-x-3">
          <Users className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">Nuevo Cliente</h1>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl mx-auto">
        <div className="space-y-8">
          {/* Tipo de Cliente */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Tipo de Cliente</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <button
                onClick={() => setClientType('individual')}
                className={`p-6 rounded-xl border-2 transition-all ${
                  clientType === 'individual'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <User className="w-8 h-8 mx-auto mb-3 text-blue-600" />
                <h3 className="font-semibold text-gray-900">Persona Individual</h3>
                <p className="text-sm text-gray-600 mt-2">Para clientes particulares</p>
              </button>
              
              <button
                onClick={() => setClientType('company')}
                className={`p-6 rounded-xl border-2 transition-all ${
                  clientType === 'company'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Building className="w-8 h-8 mx-auto mb-3 text-blue-600" />
                <h3 className="font-semibold text-gray-900">Empresa</h3>
                <p className="text-sm text-gray-600 mt-2">Para clientes corporativos</p>
              </button>
            </div>
          </div>

          {/* Información Básica */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="flex items-center space-x-3 mb-6">
              <User className="w-6 h-6 text-green-600" />
              <h2 className="text-xl font-semibold text-gray-900">Información Básica</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              {clientType === 'individual' ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre *
                    </label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Nombre del cliente"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Apellido *
                    </label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Apellido del cliente"
                    />
                  </div>
                </>
              ) : (
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre de la Empresa *
                  </label>
                  <input
                    type="text"
                    value={formData.companyName}
                    onChange={(e) => handleInputChange('companyName', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nombre de la empresa"
                  />
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="email@ejemplo.com"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Teléfono *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>

              {clientType === 'company' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tax ID / RUC
                  </label>
                  <input
                    type="text"
                    value={formData.taxId}
                    onChange={(e) => handleInputChange('taxId', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="12-3456789"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Dirección */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="flex items-center space-x-3 mb-6">
              <MapPin className="w-6 h-6 text-orange-600" />
              <h2 className="text-xl font-semibold text-gray-900">Dirección</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dirección *
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Calle y número"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ciudad *
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ciudad"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estado
                </label>
                <input
                  type="text"
                  value={formData.state}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Estado/Provincia"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Código Postal
                </label>
                <input
                  type="text"
                  value={formData.zipCode}
                  onChange={(e) => handleInputChange('zipCode', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="12345"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  País *
                </label>
                <select
                  value={formData.country}
                  onChange={(e) => handleInputChange('country', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="USA">Estados Unidos</option>
                  <option value="CR">Costa Rica</option>
                  <option value="MX">México</option>
                  <option value="PA">Panamá</option>
                  <option value="GT">Guatemala</option>
                </select>
              </div>
            </div>
          </div>

          {/* Configuración de Cuenta */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="flex items-center space-x-3 mb-6">
              <CreditCard className="w-6 h-6 text-purple-600" />
              <h2 className="text-xl font-semibold text-gray-900">Configuración de Cuenta</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Límite de Crédito ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.creditLimit}
                  onChange={(e) => handleInputChange('creditLimit', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.00"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Servicio Preferido
                </label>
                <select
                  value={formData.preferredService}
                  onChange={(e) => handleInputChange('preferredService', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="economy">Económico</option>
                  <option value="standard">Estándar</option>
                  <option value="express">Express</option>
                </select>
              </div>
              
              <div className="md:col-span-2">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Preferencias de Notificación</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="emailNotifications"
                      checked={formData.emailNotifications}
                      onChange={(e) => handleInputChange('emailNotifications', e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="emailNotifications" className="text-sm text-gray-700">
                      Recibir notificaciones por email
                    </label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="smsNotifications"
                      checked={formData.smsNotifications}
                      onChange={(e) => handleInputChange('smsNotifications', e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="smsNotifications" className="text-sm text-gray-700">
                      Recibir notificaciones por SMS
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-4">
            <button
              onClick={() => navigate('clients')}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              <Save className="w-5 h-5" />
              <span>{isSubmitting ? 'Creando...' : 'Crear Cliente'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewClientPage;