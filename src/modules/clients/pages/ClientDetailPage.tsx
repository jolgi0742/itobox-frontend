// src/modules/clients/pages/ClientDetailPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigation } from '../../../contexts/NavigationContext';
import { 
  ArrowLeft, 
  Building, 
  User, 
  Mail, 
  Phone, 
  MapPin,
  Calendar,
  Package,
  DollarSign,
  TrendingUp,
  Star,
  Edit3,
  Trash2,
  Send,
  FileText,
  Activity,
  Award,
  CreditCard
} from 'lucide-react';

interface ClientDetail {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  taxId: string;
  status: 'active' | 'inactive' | 'pending';
  joinDate: string;
  avatar?: string;
  stats: {
    totalPackages: number;
    totalSpent: number;
    avgOrderValue: number;
    onTimeDeliveries: number;
    rating: number;
    lastOrder: string;
  };
  recentPackages: Array<{
    id: string;
    trackingNumber: string;
    description: string;
    status: string;
    date: string;
    value: number;
  }>;
  billingInfo: {
    paymentMethod: string;
    creditLimit: number;
    currentBalance: number;
    lastPayment: string;
  };
}

const ClientDetailPage: React.FC = () => {
  const { navigate, getParam } = useNavigation();
  const clientId = getParam('id');
  
  const [clientData, setClientData] = useState<ClientDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'packages' | 'billing'>('overview');

  useEffect(() => {
    const loadClientData = () => {
      setLoading(true);
      
      setTimeout(() => {
        const mockData: ClientDetail = {
          id: clientId || 'CLI001',
          name: 'María González',
          company: 'Tech Solutions Corp',
          email: 'maria.gonzalez@techsolutions.com',
          phone: '+1 (305) 555-0123',
          address: '123 Biscayne Blvd, Suite 500',
          city: 'Miami',
          country: 'Estados Unidos',
          taxId: 'US-123456789',
          status: 'active',
          joinDate: '2024-01-15',
          avatar: `https://ui-avatars.com/api/?name=Maria+Gonzalez&background=0ea5e9&color=fff`,
          stats: {
            totalPackages: 47,
            totalSpent: 2580.50,
            avgOrderValue: 54.90,
            onTimeDeliveries: 45,
            rating: 4.8,
            lastOrder: '2025-06-15'
          },
          recentPackages: [
            {
              id: 'PKG001',
              trackingNumber: 'ITB12345678',
              description: 'Electronics - Laptop',
              status: 'Delivered',
              date: '2025-06-15',
              value: 125.50
            },
            {
              id: 'PKG002',
              trackingNumber: 'ITB12345679',
              description: 'Documents - Contracts',
              status: 'In Transit',
              date: '2025-06-14',
              value: 35.00
            },
            {
              id: 'PKG003',
              trackingNumber: 'ITB12345680',
              description: 'Fashion - Samples',
              status: 'Pending',
              date: '2025-06-13',
              value: 89.75
            }
          ],
          billingInfo: {
            paymentMethod: 'Credit Card **** 1234',
            creditLimit: 5000.00,
            currentBalance: 0.00,
            lastPayment: '2025-06-10'
          }
        };
        
        setClientData(mockData);
        setLoading(false);
      }, 1000);
    };

    loadClientData();
  }, [clientId]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Activo';
      case 'inactive': return 'Inactivo';
      case 'pending': return 'Pendiente';
      default: return status;
    }
  };

  const getPackageStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'in transit': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleEdit = () => {
    navigate('client-edit', { id: clientId! });
  };

  const handleDelete = () => {
    if (window.confirm(`¿Estás seguro de que deseas eliminar al cliente ${clientData?.name}?`)) {
      console.log('Eliminando cliente:', clientId);
      navigate('clients');
    }
  };

  const handleSendEmail = () => {
    if (clientData) {
      const subject = `Mensaje desde ITOBOX Courier`;
      const body = `Estimado/a ${clientData.name},\n\nEsperamos que se encuentre bien.\n\nSaludos,\nEquipo ITOBOX Courier`;
      const mailtoUrl = `mailto:${clientData.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      window.open(mailtoUrl);
    }
  };

  if (loading) {
    return (
      <div className="p-6 lg:p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="h-40 bg-gray-200 rounded-lg"></div>
              <div className="h-60 bg-gray-200 rounded-lg"></div>
            </div>
            <div className="space-y-6">
              <div className="h-32 bg-gray-200 rounded-lg"></div>
              <div className="h-48 bg-gray-200 rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!clientData) {
    return (
      <div className="p-6 lg:p-8">
        <div className="text-center py-12">
          <User className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Cliente no encontrado</h3>
          <p className="mt-1 text-sm text-gray-500">El cliente solicitado no existe o ha sido eliminado.</p>
          <div className="mt-6">
            <button
              onClick={() => navigate('clients')}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver a Clientes
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => navigate('clients')}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver
          </button>
          <div className="flex items-center space-x-3">
            <img
              className="h-12 w-12 rounded-full"
              src={clientData.avatar}
              alt={clientData.name}
            />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {clientData.name}
              </h1>
              <p className="text-sm text-gray-500">
                {clientData.company}
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(clientData.status)}`}>
            {getStatusText(clientData.status)}
          </span>
          
          <div className="flex space-x-2">
            <button
              onClick={handleSendEmail}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <Send className="h-4 w-4" />
            </button>
            <button
              onClick={handleEdit}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <Edit3 className="h-4 w-4" />
            </button>
            <button
              onClick={handleDelete}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-red-600 bg-white hover:bg-gray-50"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Package className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Paquetes</p>
              <p className="text-2xl font-bold text-gray-900">{clientData.stats.totalPackages}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Gastado</p>
              <p className="text-2xl font-bold text-gray-900">${clientData.stats.totalSpent.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Valor Promedio</p>
              <p className="text-2xl font-bold text-gray-900">${clientData.stats.avgOrderValue}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Star className="h-8 w-8 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Rating</p>
              <p className="text-2xl font-bold text-gray-900">{clientData.stats.rating}/5</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {['overview', 'packages', 'billing'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`py-2 px-1 border-b-2 font-medium text-sm capitalize ${
                activeTab === tab
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab === 'overview' && <User className="inline mr-2 h-4 w-4" />}
              {tab === 'packages' && <Package className="inline mr-2 h-4 w-4" />}
              {tab === 'billing' && <CreditCard className="inline mr-2 h-4 w-4" />}
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {activeTab === 'overview' && (
            <>
              {/* Client Info */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <Building className="mr-2 h-5 w-5" />
                  Información del Cliente
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Email</label>
                    <p className="mt-1 text-sm text-gray-900 flex items-center">
                      <Mail className="mr-1 h-4 w-4" />
                      {clientData.email}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Teléfono</label>
                    <p className="mt-1 text-sm text-gray-900 flex items-center">
                      <Phone className="mr-1 h-4 w-4" />
                      {clientData.phone}
                    </p>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-500">Dirección</label>
                    <p className="mt-1 text-sm text-gray-900 flex items-start">
                      <MapPin className="mr-1 h-4 w-4 mt-0.5" />
                      {clientData.address}, {clientData.city}, {clientData.country}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Tax ID</label>
                    <p className="mt-1 text-sm text-gray-900">{clientData.taxId}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Fecha de Registro</label>
                    <p className="mt-1 text-sm text-gray-900 flex items-center">
                      <Calendar className="mr-1 h-4 w-4" />
                      {clientData.joinDate}
                    </p>
                  </div>
                </div>
              </div>

              {/* Performance Metrics */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <Activity className="mr-2 h-5 w-5" />
                  Métricas de Rendimiento
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Entregas a Tiempo</span>
                      <span className="text-gray-900">{Math.round((clientData.stats.onTimeDeliveries / clientData.stats.totalPackages) * 100)}%</span>
                    </div>
                    <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full" 
                        style={{ width: `${(clientData.stats.onTimeDeliveries / clientData.stats.totalPackages) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Rating de Satisfacción</span>
                      <span className="text-gray-900">{clientData.stats.rating}/5</span>
                    </div>
                    <div className="flex mt-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-4 w-4 ${
                            star <= clientData.stats.rating
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'packages' && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-6 flex items-center">
                <Package className="mr-2 h-5 w-5" />
                Paquetes Recientes
              </h3>
              
              <div className="space-y-4">
                {clientData.recentPackages.map((pkg) => (
                  <div key={pkg.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <h4 className="text-sm font-medium text-gray-900">{pkg.trackingNumber}</h4>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPackageStatusColor(pkg.status)}`}>
                            {pkg.status}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-gray-500">{pkg.description}</p>
                        <div className="mt-2 flex items-center space-x-4 text-xs text-gray-500">
                          <span>Fecha: {pkg.date}</span>
                          <span>Valor: ${pkg.value}</span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => navigate('package-detail', { id: pkg.id })}
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          Ver detalles
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                
                <div className="text-center pt-4">
                  <button
                    onClick={() => navigate('packages', { client: clientId! })}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Ver todos los paquetes →
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'billing' && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-6 flex items-center">
                <CreditCard className="mr-2 h-5 w-5" />
                Información de Facturación
              </h3>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Método de Pago</label>
                    <p className="mt-1 text-sm text-gray-900">{clientData.billingInfo.paymentMethod}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Límite de Crédito</label>
                    <p className="mt-1 text-sm text-gray-900">${clientData.billingInfo.creditLimit.toLocaleString()}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Balance Actual</label>
                    <p className={`mt-1 text-sm font-medium ${clientData.billingInfo.currentBalance === 0 ? 'text-green-600' : 'text-red-600'}`}>
                      ${clientData.billingInfo.currentBalance.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Último Pago</label>
                    <p className="mt-1 text-sm text-gray-900">{clientData.billingInfo.lastPayment}</p>
                  </div>
                </div>
                
                <div className="pt-4 border-t">
                  <button
                    onClick={() => navigate('billing', { client: clientId! })}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    Ver Historial de Facturación
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Acciones Rápidas</h3>
            
            <div className="space-y-3">
              <button
                onClick={() => navigate('package-create', { client: clientId! })}
                className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                <Package className="mr-2 h-4 w-4" />
                Crear Paquete
              </button>
              <button
                onClick={handleSendEmail}
                className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <Send className="mr-2 h-4 w-4" />
                Enviar Email
              </button>
              <button
                onClick={() => navigate('billing-create', { client: clientId! })}
                className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <FileText className="mr-2 h-4 w-4" />
                Crear Factura
              </button>
              <button
                onClick={handleEdit}
                className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <Edit3 className="mr-2 h-4 w-4" />
                Editar Cliente
              </button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Estadísticas Rápidas</h3>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Paquetes este mes:</span>
                <span className="text-sm text-gray-900 font-medium">8</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Gasto este mes:</span>
                <span className="text-sm text-gray-900 font-medium">$425.50</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Última actividad:</span>
                <span className="text-sm text-gray-900 font-medium">{clientData.stats.lastOrder}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Días como cliente:</span>
                <span className="text-sm text-gray-900 font-medium">
                  {Math.floor((new Date().getTime() - new Date(clientData.joinDate).getTime()) / (1000 * 60 * 60 * 24))}
                </span>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Contacto Rápido</h3>
            
            <div className="space-y-3">
              <button
                onClick={() => window.open(`tel:${clientData.phone}`)}
                className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <Phone className="mr-2 h-4 w-4" />
                Llamar
              </button>
              <button
                onClick={handleSendEmail}
                className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <Mail className="mr-2 h-4 w-4" />
                Email
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientDetailPage;