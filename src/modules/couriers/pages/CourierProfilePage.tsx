import React, { useState, useContext } from 'react';
import { Truck, User, Phone, Mail, MapPin, Star, Package, DollarSign, Clock, CheckCircle, AlertTriangle, Edit, Trash2, ArrowLeft, Eye, Calendar, Car, Award, TrendingUp } from 'lucide-react';
import { useNavigation } from '../../../contexts/NavigationContext';

interface CourierData {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  photo?: string;
  employeeId: string;
  joinDate: string;
  status: 'active' | 'inactive' | 'suspended' | 'on-leave';
  vehicle: {
    type: string;
    make: string;
    model: string;
    year: number;
    licensePlate: string;
    color: string;
  };
  stats: {
    totalDeliveries: number;
    successRate: number;
    rating: number;
    totalEarnings: number;
    avgDeliveryTime: number;
    onTimeDeliveries: number;
    customerRating: number;
    monthlyDeliveries: number;
  };
  recentDeliveries: Array<{
    id: number;
    trackingNumber: string;
    customer: string;
    destination: string;
    status: 'completed' | 'failed' | 'in-progress';
    date: string;
    earnings: number;
    rating?: number;
  }>;
  performance: Array<{
    month: string;
    deliveries: number;
    earnings: number;
    rating: number;
  }>;
  specializations: string[];
  workSchedule: {
    availability: string[];
    preferredZones: string[];
    maxPackagesPerDay: number;
  };
}

const CourierProfilePage: React.FC = () => {
  const { navigate  } = useNavigation();
  const [activeTab, setActiveTab] = useState('overview');

  // Datos simulados del courier
  const courierData: CourierData = {
    id: 1,
    firstName: 'Carlos',
    lastName: 'Rodríguez',
    email: 'carlos.rodriguez@itobox.com',
    phone: '+1 (555) 234-5678',
    address: '789 Courier Lane, Miami, FL 33125',
    employeeId: 'CTR-001',
    joinDate: '2023-03-15',
    status: 'active',
    vehicle: {
      type: 'Van',
      make: 'Ford',
      model: 'Transit',
      year: 2022,
      licensePlate: 'ITB-456',
      color: 'Blanco'
    },
    stats: {
      totalDeliveries: 1247,
      successRate: 98.5,
      rating: 4.9,
      totalEarnings: 23650.75,
      avgDeliveryTime: 35,
      onTimeDeliveries: 1227,
      customerRating: 4.8,
      monthlyDeliveries: 89
    },
    recentDeliveries: [
      {
        id: 1,
        trackingNumber: 'ITB241215A001',
        customer: 'María García',
        destination: 'Orlando, FL',
        status: 'completed',
        date: '2024-06-15',
        earnings: 45.50,
        rating: 5
      },
      {
        id: 2,
        trackingNumber: 'ITB241214B002',
        customer: 'Tech Solutions Inc.',
        destination: 'Tampa, FL',
        status: 'completed',
        date: '2024-06-14',
        earnings: 78.25,
        rating: 4.8
      },
      {
        id: 3,
        trackingNumber: 'ITB241213C003',
        customer: 'Ana Martínez',
        destination: 'Jacksonville, FL',
        status: 'completed',
        date: '2024-06-13',
        earnings: 32.00,
        rating: 4.9
      },
      {
        id: 4,
        trackingNumber: 'ITB241212D004',
        customer: 'Roberto Silva',
        destination: 'Key West, FL',
        status: 'completed',
        date: '2024-06-12',
        earnings: 95.75,
        rating: 5
      },
      {
        id: 5,
        trackingNumber: 'ITB241211E005',
        customer: 'Elena Fernández',
        destination: 'Fort Lauderdale, FL',
        status: 'failed',
        date: '2024-06-11',
        earnings: 0,
        rating: 2
      }
    ],
    performance: [
      { month: 'Enero', deliveries: 78, earnings: 1890, rating: 4.7 },
      { month: 'Febrero', deliveries: 85, earnings: 2140, rating: 4.8 },
      { month: 'Marzo', deliveries: 92, earnings: 2380, rating: 4.9 },
      { month: 'Abril', deliveries: 88, earnings: 2250, rating: 4.8 },
      { month: 'Mayo', deliveries: 95, earnings: 2470, rating: 4.9 },
      { month: 'Junio', deliveries: 89, earnings: 2290, rating: 4.9 }
    ],
    specializations: ['Paquetes Frágiles', 'Entregas Express', 'Documentos Legales'],
    workSchedule: {
      availability: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
      preferredZones: ['Miami-Dade', 'Broward', 'Orlando'],
      maxPackagesPerDay: 30
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-gray-100 text-gray-800',
      suspended: 'bg-red-100 text-red-800',
      'on-leave': 'bg-yellow-100 text-yellow-800'
    };
    
    const labels = {
      active: 'Activo',
      inactive: 'Inactivo',
      suspended: 'Suspendido',
      'on-leave': 'En Licencia'
    };

    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${styles[status as keyof typeof styles]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  const getDeliveryStatusInfo = (status: string) => {
    const statusMap = {
      completed: { label: 'Completada', color: 'bg-green-100 text-green-800', icon: CheckCircle },
      failed: { label: 'Fallida', color: 'bg-red-100 text-red-800', icon: AlertTriangle },
      'in-progress': { label: 'En Progreso', color: 'bg-blue-100 text-blue-800', icon: Clock }
    };
    
    return statusMap[status as keyof typeof statusMap] || statusMap.completed;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleEditCourier = () => {
    console.log('Editar courier:', courierData.id);
    navigate('edit-courier');
  };

  const handleDeleteCourier = () => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este courier?')) {
      console.log('Eliminar courier:', courierData.id);
      navigate('couriers');
    }
  };

  const handleViewDelivery = (trackingNumber: string) => {
    console.log('Ver entrega:', trackingNumber);
    navigate('package-details');
  };

  return (
    <div className="p-6 lg:p-8 -mt-20">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => navigate('couriers')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </button>
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
            {courierData.firstName.charAt(0)}{courierData.lastName.charAt(0)}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {courierData.firstName} {courierData.lastName}
            </h1>
            <p className="text-gray-600">
              ID: {courierData.employeeId} • Courier desde {formatDate(courierData.joinDate)}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {getStatusBadge(courierData.status)}
          <button 
            onClick={handleEditCourier}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Edit className="w-4 h-4" />
            <span>Editar</span>
          </button>
          <button 
            onClick={handleDeleteCourier}
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
              <p className="text-sm font-medium text-gray-600">Total Entregas</p>
              <p className="text-2xl font-bold text-blue-600">{courierData.stats.totalDeliveries.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tasa de Éxito</p>
              <p className="text-2xl font-bold text-green-600">{courierData.stats.successRate}%</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Ganancias Totales</p>
              <p className="text-2xl font-bold text-purple-600">${courierData.stats.totalEarnings.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Calificación</p>
              <div className="flex items-center space-x-1">
                <p className="text-2xl font-bold text-orange-600">{courierData.stats.rating}</p>
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
              { id: 'deliveries', label: 'Entregas', icon: Package },
              { id: 'performance', label: 'Rendimiento', icon: TrendingUp },
              { id: 'vehicle', label: 'Vehículo', icon: Car },
              { id: 'schedule', label: 'Horario', icon: Calendar }
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
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Información Personal</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <User className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Nombre Completo</p>
                        <p className="font-medium text-gray-900">{courierData.firstName} {courierData.lastName}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Mail className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Email</p>
                        <p className="font-medium text-gray-900">{courierData.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Phone className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Teléfono</p>
                        <p className="font-medium text-gray-900">{courierData.phone}</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <MapPin className="w-5 h-5 text-gray-400 mt-1" />
                      <div>
                        <p className="text-sm text-gray-600">Dirección</p>
                        <p className="font-medium text-gray-900">{courierData.address}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Fecha de Ingreso</p>
                        <p className="font-medium text-gray-900">{formatDate(courierData.joinDate)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Performance Metrics */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Métricas de Rendimiento</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Clock className="w-5 h-5 text-blue-600" />
                      <h4 className="font-medium text-blue-900">Tiempo Promedio</h4>
                    </div>
                    <p className="text-2xl font-bold text-blue-700">{courierData.stats.avgDeliveryTime} min</p>
                    <p className="text-sm text-blue-600">Por entrega</p>
                  </div>

                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <h4 className="font-medium text-green-900">Entregas a Tiempo</h4>
                    </div>
                    <p className="text-2xl font-bold text-green-700">{courierData.stats.onTimeDeliveries}</p>
                    <p className="text-sm text-green-600">De {courierData.stats.totalDeliveries} totales</p>
                  </div>

                  <div className="p-4 bg-orange-50 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Star className="w-5 h-5 text-orange-600" />
                      <h4 className="font-medium text-orange-900">Calificación de Clientes</h4>
                    </div>
                    <p className="text-2xl font-bold text-orange-700">{courierData.stats.customerRating}</p>
                    <p className="text-sm text-orange-600">Promedio de clientes</p>
                  </div>
                </div>
              </div>

              {/* Specializations */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Especializaciones</h3>
                <div className="flex flex-wrap gap-2">
                  {courierData.specializations.map((spec, index) => (
                    <span key={index} className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                      {spec}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Deliveries Tab */}
          {activeTab === 'deliveries' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Entregas Recientes</h3>
                <button 
                  onClick={() => navigate('new-package')}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Package className="w-4 h-4" />
                  <span>Asignar Entrega</span>
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
                        Cliente
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
                        Ganancias
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Calificación
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {courierData.recentDeliveries.map((delivery) => {
                      const statusInfo = getDeliveryStatusInfo(delivery.status);
                      const StatusIcon = statusInfo.icon;
                      
                      return (
                        <tr key={delivery.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="font-mono text-sm font-medium text-blue-600">
                              {delivery.trackingNumber}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center space-x-2">
                              <User className="w-4 h-4 text-gray-400" />
                              <span className="text-sm text-gray-900">{delivery.customer}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center space-x-2">
                              <MapPin className="w-4 h-4 text-gray-400" />
                              <span className="text-sm text-gray-900">{delivery.destination}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                              <StatusIcon className="w-3 h-3" />
                              <span>{statusInfo.label}</span>
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatDate(delivery.date)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`text-sm font-medium ${delivery.earnings > 0 ? 'text-green-600' : 'text-gray-400'}`}>
                              ${delivery.earnings.toFixed(2)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {delivery.rating ? (
                              <div className="flex items-center space-x-1">
                                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                <span className="text-sm text-gray-900">{delivery.rating}</span>
                              </div>
                            ) : (
                              <span className="text-sm text-gray-400">N/A</span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button 
                              onClick={() => handleViewDelivery(delivery.trackingNumber)}
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

          {/* Performance Tab */}
          {activeTab === 'performance' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Rendimiento Mensual</h3>
              
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="text-md font-medium text-gray-900 mb-4">Últimos 6 Meses</h4>
                <div className="space-y-4">
                  {courierData.performance.map((perf, index) => {
                    const maxDeliveries = Math.max(...courierData.performance.map(p => p.deliveries));
                    const maxEarnings = Math.max(...courierData.performance.map(p => p.earnings));
                    
                    return (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-900">{perf.month}</span>
                          <div className="flex items-center space-x-4 text-sm">
                            <span className="text-blue-600">{perf.deliveries} entregas</span>
                            <span className="text-green-600">${perf.earnings.toLocaleString()}</span>
                            <span className="text-orange-600">★ {perf.rating}</span>
                          </div>
                        </div>
                        
                        <div className="space-y-1">
                          <div className="w-full bg-blue-200 rounded-full h-2">
                            <div 
                              className="bg-blue-500 h-2 rounded-full" 
                              style={{ width: `${(perf.deliveries / maxDeliveries) * 100}%` }}
                            ></div>
                          </div>
                          <div className="w-full bg-green-200 rounded-full h-2">
                            <div 
                              className="bg-green-500 h-2 rounded-full" 
                              style={{ width: `${(perf.earnings / maxEarnings) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Awards and Achievements */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-yellow-50 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Award className="w-5 h-5 text-yellow-600" />
                    <h4 className="font-medium text-yellow-900">Logros Destacados</h4>
                  </div>
                  <ul className="text-sm text-yellow-800 space-y-1">
                    <li>• Top Courier del Mes (Mayo 2024)</li>
                    <li>• 1000+ Entregas Completadas</li>
                    <li>• 98%+ Tasa de Éxito</li>
                  </ul>
                </div>
                
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    <h4 className="font-medium text-green-900">Tendencias</h4>
                  </div>
                  <ul className="text-sm text-green-800 space-y-1">
                    <li>• Incremento del 15% en entregas</li>
                    <li>• Mejora en calificación (+0.3)</li>
                    <li>• Tiempo de entrega reducido (-5 min)</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Vehicle Tab */}
          {activeTab === 'vehicle' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Información del Vehículo</h3>
              
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-600">Tipo de Vehículo</p>
                      <p className="font-medium text-gray-900">{courierData.vehicle.type}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Marca</p>
                      <p className="font-medium text-gray-900">{courierData.vehicle.make}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Modelo</p>
                      <p className="font-medium text-gray-900">{courierData.vehicle.model}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-600">Año</p>
                      <p className="font-medium text-gray-900">{courierData.vehicle.year}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Placa</p>
                      <p className="font-medium text-gray-900">{courierData.vehicle.licensePlate}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Color</p>
                      <p className="font-medium text-gray-900">{courierData.vehicle.color}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Estado del Vehículo</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-blue-700 font-medium">Seguro:</span>
                    <span className="text-green-600 ml-2">Vigente</span>
                  </div>
                  <div>
                    <span className="text-blue-700 font-medium">Inspección:</span>
                    <span className="text-green-600 ml-2">Al día</span>
                  </div>
                  <div>
                    <span className="text-blue-700 font-medium">Mantenimiento:</span>
                    <span className="text-yellow-600 ml-2">Próximo en 15 días</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Schedule Tab */}
          {activeTab === 'schedule' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Horario y Preferencias</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 border border-gray-200 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-3">Disponibilidad</h4>
                  <div className="space-y-2">
                    {['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'].map((day) => (
                      <div key={day} className="flex items-center justify-between">
                        <span className="text-sm text-gray-900">{day}</span>
                        <span className={`text-sm ${
                          courierData.workSchedule.availability.includes(day) 
                            ? 'text-green-600 font-medium' 
                            : 'text-gray-400'
                        }`}>
                          {courierData.workSchedule.availability.includes(day) ? 'Disponible' : 'No disponible'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 border border-gray-200 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-3">Zonas Preferidas</h4>
                  <div className="space-y-2">
                    {courierData.workSchedule.preferredZones.map((zone, index) => (
                      <span key={index} className="inline-block px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm mr-2 mb-2">
                        {zone}
                      </span>
                    ))}
                  </div>
                  
                  <div className="mt-4">
                    <h5 className="text-sm font-medium text-gray-700 mb-2">Capacidad Diaria</h5>
                    <p className="text-lg font-semibold text-gray-900">
                      Hasta {courierData.workSchedule.maxPackagesPerDay} paquetes por día
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-3">Horario de Trabajo Habitual</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Días de Semana</p>
                    <p className="font-medium text-gray-900">8:00 AM - 6:00 PM</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Sábados</p>
                    <p className="font-medium text-gray-900">9:00 AM - 3:00 PM</p>
                  </div>
                </div>
              </div>

              <div className="flex space-x-4">
                <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <Calendar className="w-4 h-4" />
                  <span>Modificar Horario</span>
                </button>
                <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                  <Package className="w-4 h-4" />
                  <span>Asignar Ruta</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourierProfilePage;