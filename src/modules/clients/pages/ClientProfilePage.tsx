import React, { useState, useContext } from 'react';
import { User, Building, Mail, Phone, MapPin, Package, DollarSign, Star, Calendar, Edit, Trash2, ArrowLeft, Eye, TrendingUp, Clock, CheckCircle } from 'lucide-react';
import { useNavigation } from '../../../contexts/NavigationContext';

interface ClientData {
  id: number;
  name: string;
  type: 'company' | 'individual';
  contact: string;
  email: string;
  phone: string;
  address: string;
  businessInfo?: {
    taxId?: string;
    industry?: string;
    employees?: string;
    website?: string;
  };
  stats: {
    totalPackages: number;
    totalSpent: number;
    avgMonthlySpend: number;
    rating: number;
    joinDate: string;
    lastOrder: string;
    status: 'active' | 'premium' | 'inactive';
  };
  recentPackages: Array<{
    id: number;
    trackingNumber: string;
    destination: string;
    status: string;
    date: string;
    value: number;
  }>;
  monthlyStats: Array<{
    month: string;
    packages: number;
    revenue: number;
  }>;
}

const ClientProfilePage: React.FC = () => {
  const { navigate  } = useNavigation();
  const [activeTab, setActiveTab] = useState('overview');

  // Datos simulados del cliente
  const clientData: ClientData = {
    id: 1,
    name: 'Tecnología Avanzada S.A.',
    type: 'company',
    contact: 'María García',
    email: 'maria@tecnoavanzada.com',
    phone: '+1 (555) 123-4567',
    address: 'Av. Tecnológica 123, Miami, FL 33101',
    businessInfo: {
      taxId: 'TAX-123456789',
      industry: 'Tecnología',
      employees: '50-100',
      website: 'www.tecnoavanzada.com'
    },
    stats: {
      totalPackages: 145,
      totalSpent: 18750.50,
      avgMonthlySpend: 3125.08,
      rating: 4.8,
      joinDate: '2023-01-15',
      lastOrder: '2024-06-15',
      status: 'premium'
    },
    recentPackages: [
      {
        id: 1,
        trackingNumber: 'ITB241215A001',
        destination: 'Orlando, FL',
        status: 'delivered',
        date: '2024-06-15',
        value: 450.00
      },
      {
        id: 2,
        trackingNumber: 'ITB241214B002',
        destination: 'Tampa, FL',
        status: 'in_transit',
        date: '2024-06-14',
        value: 275.50
      },
      {
        id: 3,
        trackingNumber: 'ITB241213C003',
        destination: 'Jacksonville, FL',
        status: 'delivered',
        date: '2024-06-13',
        value: 125.00
      },
      {
        id: 4,
        trackingNumber: 'ITB241212D004',
        destination: 'Key West, FL',
        status: 'delivered',
        date: '2024-06-12',
        value: 380.25
      }
    ],
    monthlyStats: [
      { month: 'Enero', packages: 18, revenue: 2340 },
      { month: 'Febrero', packages: 22, revenue: 2890 },
      { month: 'Marzo', packages: 28, revenue: 3650 },
      { month: 'Abril', packages: 24, revenue: 3120 },
      { month: 'Mayo', packages: 31, revenue: 3980 },
      { month: 'Junio', packages: 22, revenue: 2770 }
    ]
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      active: 'bg-green-100 text-green-800',
      premium: 'bg-purple-100 text-purple-800',
      inactive: 'bg-gray-100 text-gray-800'
    };
    
    const labels = {
      active: 'Activo',
      premium: 'Premium',
      inactive: 'Inactivo'
    };

    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${styles[status as keyof typeof styles]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  const getPackageStatusInfo = (status: string) => {
    const statusMap = {
      delivered: { label: 'Entregado', color: 'bg-green-100 text-green-800', icon: CheckCircle },
      in_transit: { label: 'En Tránsito', color: 'bg-blue-100 text-blue-800', icon: Clock },
      pending: { label: 'Pendiente', color: 'bg-yellow-100 text-yellow-800', icon: Clock }
    };
    
    return statusMap[status as keyof typeof statusMap] || statusMap.pending;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleEditClient = () => {
    console.log('Editar cliente:', clientData.id);
    navigate('edit-client');
  };

  const handleDeleteClient = () => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este cliente?')) {
      console.log('Eliminar cliente:', clientData.id);
      navigate('clients');
    }
  };

  const handleViewPackage = (trackingNumber: string) => {
    console.log('Ver paquete:', trackingNumber);
    navigate('package-details');
  };

  return (
    <div className="p-6 lg:p-8 -mt-20">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => navigate('clients')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </button>
          {clientData.type === 'company' ? (
            <Building className="w-8 h-8 text-gray-600" />
          ) : (
            <User className="w-8 h-8 text-gray-600" />
          )}
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{clientData.name}</h1>
            <p className="text-gray-600">
              {clientData.type === 'company' ? 'Empresa' : 'Cliente Individual'} • 
              Cliente desde {formatDate(clientData.stats.joinDate)}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {getStatusBadge(clientData.stats.status)}
          <button 
            onClick={handleEditClient}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Edit className="w-4 h-4" />
            <span>Editar</span>
          </button>
          <button 
            onClick={handleDeleteClient}
            className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span>Eliminar</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Paquetes</p>
              <p className="text-2xl font-bold text-blue-600">{clientData.stats.totalPackages}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Gastado</p>
              <p className="text-2xl font-bold text-green-600">${clientData.stats.totalSpent.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Promedio Mensual</p>
              <p className="text-2xl font-bold text-purple-600">${clientData.stats.avgMonthlySpend.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Calificación</p>
              <div className="flex items-center space-x-1">
                <p className="text-2xl font-bold text-orange-600">{clientData.stats.rating}</p>
                <Star className="w-5 h-5 text-orange-400 fill-current" />
              </div>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
              <Star className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 mb-8">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'overview', label: 'Resumen', icon: User },
              { id: 'packages', label: 'Paquetes', icon: Package },
              { id: 'analytics', label: 'Analytics', icon: TrendingUp },
              { id: 'contact', label: 'Contacto', icon: Phone }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Contact Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Información de Contacto</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <User className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Contacto Principal</p>
                        <p className="font-medium text-gray-900">{clientData.contact}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Mail className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Email</p>
                        <p className="font-medium text-gray-900">{clientData.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Phone className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Teléfono</p>
                        <p className="font-medium text-gray-900">{clientData.phone}</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <MapPin className="w-5 h-5 text-gray-400 mt-1" />
                      <div>
                        <p className="text-sm text-gray-600">Dirección</p>
                        <p className="font-medium text-gray-900">{clientData.address}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Último Pedido</p>
                        <p className="font-medium text-gray-900">{formatDate(clientData.stats.lastOrder)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Business Information (only for companies) */}
              {clientData.type === 'company' && clientData.businessInfo && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Información Empresarial</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-600">ID Fiscal</p>
                        <p className="font-medium text-gray-900">{clientData.businessInfo.taxId}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Industria</p>
                        <p className="font-medium text-gray-900">{clientData.businessInfo.industry}</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-600">Empleados</p>
                        <p className="font-medium text-gray-900">{clientData.businessInfo.employees}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Sitio Web</p>
                        <p className="font-medium text-blue-600 hover:underline cursor-pointer">
                          {clientData.businessInfo.website}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Packages Tab */}
          {activeTab === 'packages' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Paquetes Recientes</h3>
                <button 
                  onClick={() => navigate('new-package')}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Package className="w-4 h-4" />
                  <span>Nuevo Paquete</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tracking
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Destino
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Estado
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Fecha
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Valor
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {clientData.recentPackages.map((pkg) => {
                      const statusInfo = getPackageStatusInfo(pkg.status);
                      const StatusIcon = statusInfo.icon;
                      
                      return (
                        <tr key={pkg.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="font-mono text-sm font-medium text-blue-600">
                              {pkg.trackingNumber}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center space-x-2">
                              <MapPin className="w-4 h-4 text-gray-400" />
                              <span className="text-sm text-gray-900">{pkg.destination}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                              <StatusIcon className="w-3 h-3" />
                              <span>{statusInfo.label}</span>
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatDate(pkg.date)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm font-medium text-green-600">
                              ${pkg.value.toFixed(2)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button 
                              onClick={() => handleViewPackage(pkg.trackingNumber)}
                              className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                              title="Ver detalles"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Analytics del Cliente</h3>
              
              {/* Monthly Performance Chart */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="text-md font-medium text-gray-900 mb-4">Performance Mensual</h4>
                <div className="space-y-4">
                  {clientData.monthlyStats.map((stat, index) => {
                    const maxRevenue = Math.max(...clientData.monthlyStats.map(s => s.revenue));
                    const maxPackages = Math.max(...clientData.monthlyStats.map(s => s.packages));
                    
                    return (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-900">{stat.month}</span>
                          <div className="flex items-center space-x-4 text-sm">
                            <span className="text-blue-600">{stat.packages} paquetes</span>
                            <span className="text-green-600">${stat.revenue.toLocaleString()}</span>
                          </div>
                        </div>
                        
                        <div className="space-y-1">
                          <div className="w-full bg-blue-200 rounded-full h-2">
                            <div 
                              className="bg-blue-500 h-2 rounded-full" 
                              style={{ width: `${(stat.packages / maxPackages) * 100}%` }}
                            ></div>
                          </div>
                          <div className="w-full bg-green-200 rounded-full h-2">
                            <div 
                              className="bg-green-500 h-2 rounded-full" 
                              style={{ width: `${(stat.revenue / maxRevenue) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Key Insights */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Tendencia de Crecimiento</h4>
                  <p className="text-sm text-blue-800">
                    Los envíos han incrementado un 15% en los últimos 3 meses, 
                    mostrando una tendencia positiva de crecimiento.
                  </p>
                </div>
                
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-medium text-green-900 mb-2">Cliente Preferencial</h4>
                  <p className="text-sm text-green-800">
                    Genera un promedio de ${clientData.stats.avgMonthlySpend.toLocaleString()} 
                    mensuales, calificando como cliente premium.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Contact Tab */}
          {activeTab === 'contact' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Información de Contacto Detallada</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-3">Contacto Principal</h4>
                    <div className="space-y-2">
                      <p className="text-sm"><strong>Nombre:</strong> {clientData.contact}</p>
                      <p className="text-sm"><strong>Email:</strong> {clientData.email}</p>
                      <p className="text-sm"><strong>Teléfono:</strong> {clientData.phone}</p>
                    </div>
                  </div>

                  <div className="p-4 border border-gray-200 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-3">Dirección de Servicio</h4>
                    <p className="text-sm text-gray-600">{clientData.address}</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-3">Preferencias de Comunicación</h4>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input type="checkbox" checked className="mr-2" readOnly />
                        <span className="text-sm">Notificaciones por Email</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" checked className="mr-2" readOnly />
                        <span className="text-sm">SMS para actualizaciones</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-2" readOnly />
                        <span className="text-sm">Llamadas telefónicas</span>
                      </label>
                    </div>
                  </div>

                  <div className="p-4 border border-gray-200 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-3">Horario de Contacto</h4>
                    <div className="space-y-1">
                      <p className="text-sm"><strong>Lunes - Viernes:</strong> 9:00 AM - 6:00 PM</p>
                      <p className="text-sm"><strong>Sábados:</strong> 9:00 AM - 2:00 PM</p>
                      <p className="text-sm"><strong>Domingos:</strong> Cerrado</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex space-x-4">
                <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <Mail className="w-4 h-4" />
                  <span>Enviar Email</span>
                </button>
                <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                  <Phone className="w-4 h-4" />
                  <span>Llamar</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientProfilePage;