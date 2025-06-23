// src/modules/couriers/pages/CourierDetailPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigation } from '../../../contexts/NavigationContext';
import Badge from '../../../components/ui/Badge';
import Button from '../../../components/ui/Button';
import Modal from '../../../components/ui/Modal';
import { 
  ArrowLeft, 
  User, 
  Phone, 
  Mail, 
  MapPin,
  Truck,
  Star,
  Calendar,
  Package,
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
  Edit3,
  Trash2,
  Send,
  UserCheck,
  TrendingUp,
  Award,
  Activity,
  Navigation,
  FileText
} from 'lucide-react';

interface CourierDetail {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  status: 'active' | 'inactive' | 'busy' | 'offline';
  avatar?: string;
  vehicle: {
    type: string;
    model: string;
    plate: string;
    capacity: string;
  };
  stats: {
    totalDeliveries: number;
    successRate: number;
    rating: number;
    totalEarnings: number;
    completedToday: number;
    onTimeDeliveries: number;
    avgDeliveryTime: number;
  };
  schedule: {
    startTime: string;
    endTime: string;
    workDays: string[];
    currentShift: boolean;
  };
  currentPackages: Array<{
    id: string;
    trackingNumber: string;
    destination: string;
    priority: 'low' | 'medium' | 'high';
    estimatedDelivery: string;
    status: string;
  }>;
  recentActivity: Array<{
    date: string;
    time: string;
    action: string;
    packageId: string;
    location: string;
  }>;
  performance: {
    thisMonth: {
      packages: number;
      earnings: number;
      rating: number;
    };
    lastMonth: {
      packages: number;
      earnings: number;
      rating: number;
    };
  };
  certifications: string[];
  joinDate: string;
}

const CourierDetailPage: React.FC = () => {
  const { navigate, getParam } = useNavigation();
  const courierId = getParam('id');
  
  const [courierData, setCourierData] = useState<CourierDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'packages' | 'performance' | 'schedule'>('overview');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);

  // Datos simulados mejorados
  useEffect(() => {
    const loadCourierData = () => {
      setLoading(true);
      
      setTimeout(() => {
        const mockData: CourierDetail = {
          id: courierId || 'COU001',
          name: 'Roberto Silva Martinez',
          email: 'roberto.silva@itobox.com',
          phone: '+1 (305) 555-0789',
          address: '789 Coral Way, Miami, FL 33145',
          status: ['active', 'busy', 'inactive', 'offline'][Math.floor(Math.random() * 4)] as any,
          avatar: `https://ui-avatars.com/api/?name=Roberto+Silva&background=0ea5e9&color=fff`,
          vehicle: {
            type: 'Van',
            model: 'Ford Transit 2023',
            plate: 'ABC-123',
            capacity: '500 kg / 15 m³'
          },
          stats: {
            totalDeliveries: 1247,
            successRate: 98.5,
            rating: 4.8,
            totalEarnings: 45780,
            completedToday: 12,
            onTimeDeliveries: 1228,
            avgDeliveryTime: 2.3
          },
          schedule: {
            startTime: '08:00',
            endTime: '18:00',
            workDays: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
            currentShift: Math.random() > 0.3
          },
          currentPackages: [
            {
              id: 'PKG001',
              trackingNumber: 'ITB12345678',
              destination: 'Downtown Miami',
              priority: 'high',
              estimatedDelivery: '14:30',
              status: 'En ruta'
            },
            {
              id: 'PKG002',
              trackingNumber: 'ITB12345679',
              destination: 'Coral Gables',
              priority: 'medium',
              estimatedDelivery: '16:00',
              status: 'Recolectado'
            },
            {
              id: 'PKG003',
              trackingNumber: 'ITB12345680',
              destination: 'Brickell',
              priority: 'low',
              estimatedDelivery: '17:30',
              status: 'Pendiente'
            }
          ],
          recentActivity: [
            {
              date: '2025-06-16',
              time: '13:45',
              action: 'Paquete entregado',
              packageId: 'ITB12345677',
              location: 'Aventura Mall'
            },
            {
              date: '2025-06-16',
              time: '12:30',
              action: 'Paquete recolectado',
              packageId: 'ITB12345678',
              location: 'Miami Beach'
            },
            {
              date: '2025-06-16',
              time: '11:15',
              action: 'Inicio de ruta',
              packageId: '-',
              location: 'Base Central'
            }
          ],
          performance: {
            thisMonth: {
              packages: 156,
              earnings: 4680,
              rating: 4.8
            },
            lastMonth: {
              packages: 142,
              earnings: 4260,
              rating: 4.7
            }
          },
          certifications: ['Manejo Defensivo', 'Carga Peligrosa', 'Primeros Auxilios'],
          joinDate: '2023-03-15'
        };
        
        setCourierData(mockData);
        setLoading(false);
      }, 1000);
    };

    loadCourierData();
  }, [courierId]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'busy': return <Clock className="w-4 h-4 text-orange-500" />;
      case 'inactive': return <AlertCircle className="w-4 h-4 text-gray-500" />;
      case 'offline': return <AlertCircle className="w-4 h-4 text-red-500" />;
      default: return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'busy': return 'bg-orange-100 text-orange-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'offline': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleEdit = () => {
    setShowEditModal(false);
    navigate('courier-edit', { id: courierId! });
  };

  const handleDelete = () => {
    setShowDeleteModal(false);
    console.log('Eliminando courier:', courierId);
    navigate('couriers');
  };

  const handleAssignPackage = () => {
    setShowAssignModal(false);
    if (courierId) {
  navigate('packages', { action: 'assign', courierId });
}
};

  const handleSendMessage = () => {
    if (courierData) {
      const subject = `Mensaje del sistema - ITOBOX Courier`;
      const body = `Hola ${courierData.name},\n\nTe enviamos este mensaje desde el sistema.\n\nSaludos,\nEquipo ITOBOX Courier`;
      const mailtoUrl = `mailto:${courierData.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
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

  if (!courierData) {
    return (
      <div className="p-6 lg:p-8">
        <div className="text-center py-12">
          <User className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Courier no encontrado</h3>
          <p className="mt-1 text-sm text-gray-500">El courier solicitado no existe o ha sido eliminado.</p>
          <div className="mt-6">
            <Button onClick={() => navigate('couriers')} variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver a Couriers
            </Button>
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
          <Button 
            variant="ghost" 
            onClick={() => navigate('couriers')}
            className="hover:bg-gray-100"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver
          </Button>
          <div className="flex items-center space-x-3">
            <img
              className="h-12 w-12 rounded-full"
              src={courierData.avatar}
              alt={courierData.name}
            />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {courierData.name}
              </h1>
              <p className="text-sm text-gray-500">
                Courier desde {courierData.joinDate}
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <Badge className={getStatusColor(courierData.status)}>
            {getStatusIcon(courierData.status)}
            <span className="ml-1 capitalize">
              {courierData.status}
            </span>
          </Badge>
          
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={() => setShowAssignModal(true)}>
              <Package className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={handleSendMessage}>
              <Send className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => setShowEditModal(true)}>
              <Edit3 className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => setShowDeleteModal(true)} className="text-red-600 hover:text-red-700">
              <Trash2 className="h-4 w-4" />
            </Button>
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
              <p className="text-sm font-medium text-gray-500">Total Entregas</p>
              <p className="text-2xl font-bold text-gray-900">{courierData.stats.totalDeliveries}</p>
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
              <p className="text-2xl font-bold text-gray-900">{courierData.stats.rating}/5</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Tasa Éxito</p>
              <p className="text-2xl font-bold text-gray-900">{courierData.stats.successRate}%</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Ganancias</p>
              <p className="text-2xl font-bold text-gray-900">${courierData.stats.totalEarnings}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {['overview', 'packages', 'performance', 'schedule'].map((tab) => (
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
              {tab === 'performance' && <TrendingUp className="inline mr-2 h-4 w-4" />}
              {tab === 'schedule' && <Calendar className="inline mr-2 h-4 w-4" />}
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
              {/* Personal Info */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <User className="mr-2 h-5 w-5" />
                  Información Personal
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Email</label>
                    <p className="mt-1 text-sm text-gray-900 flex items-center">
                      <Mail className="mr-1 h-4 w-4" />
                      {courierData.email}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Teléfono</label>
                    <p className="mt-1 text-sm text-gray-900 flex items-center">
                      <Phone className="mr-1 h-4 w-4" />
                      {courierData.phone}
                    </p>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-500">Dirección</label>
                    <p className="mt-1 text-sm text-gray-900 flex items-start">
                      <MapPin className="mr-1 h-4 w-4 mt-0.5" />
                      {courierData.address}
                    </p>
                  </div>
                </div>
              </div>

              {/* Vehicle Info */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <Truck className="mr-2 h-5 w-5" />
                  Información del Vehículo
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Tipo</label>
                    <p className="mt-1 text-sm text-gray-900">{courierData.vehicle.type}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Modelo</label>
                    <p className="mt-1 text-sm text-gray-900">{courierData.vehicle.model}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Placa</label>
                    <p className="mt-1 text-sm text-gray-900">{courierData.vehicle.plate}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Capacidad</label>
                    <p className="mt-1 text-sm text-gray-900">{courierData.vehicle.capacity}</p>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <Activity className="mr-2 h-5 w-5" />
                  Actividad Reciente
                </h3>
                
                <div className="flow-root">
                  <ul className="-mb-8">
                    {courierData.recentActivity.map((activity, activityIdx) => (
                      <li key={activityIdx}>
                        <div className="relative pb-8">
                          {activityIdx !== courierData.recentActivity.length - 1 ? (
                            <span
                              className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                              aria-hidden="true"
                            />
                          ) : null}
                          <div className="relative flex space-x-3">
                            <div>
                              <span className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center ring-8 ring-white">
                                <CheckCircle className="h-5 w-5 text-white" />
                              </span>
                            </div>
                            <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                              <div>
                                <p className="text-sm text-gray-500">
                                  <span className="font-medium text-gray-900">{activity.action}</span>
                                  {activity.packageId !== '-' && (
                                    <span> - {activity.packageId}</span>
                                  )}
                                </p>
                                <p className="mt-1 text-sm text-gray-500">{activity.location}</p>
                              </div>
                              <div className="text-right text-sm whitespace-nowrap text-gray-500">
                                <time>{activity.date} {activity.time}</time>
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </>
          )}

          {activeTab === 'packages' && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-6 flex items-center">
                <Package className="mr-2 h-5 w-5" />
                Paquetes Actuales ({courierData.currentPackages.length})
              </h3>
              
              <div className="space-y-4">
                {courierData.currentPackages.map((pkg) => (
                  <div key={pkg.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <h4 className="text-sm font-medium text-gray-900">{pkg.trackingNumber}</h4>
                          <Badge className={getPriorityColor(pkg.priority)}>
                            {pkg.priority}
                          </Badge>
                          <Badge className="bg-blue-100 text-blue-800">
                            {pkg.status}
                          </Badge>
                        </div>
                        <p className="mt-1 text-sm text-gray-500 flex items-center">
                          <MapPin className="mr-1 h-4 w-4" />
                          {pkg.destination}
                        </p>
                        <p className="mt-1 text-sm text-gray-500 flex items-center">
                          <Clock className="mr-1 h-4 w-4" />
                          Entrega estimada: {pkg.estimatedDelivery}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" onClick={() => navigate('package-detail', { id: pkg.id })}>
                          Ver
                        </Button>
                        <Button size="sm" onClick={() => navigate('tracking', { id: pkg.id })}>
                          Rastrear
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                
                {courierData.currentPackages.length === 0 && (
                  <div className="text-center py-8">
                    <Package className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">Sin paquetes asignados</h3>
                    <p className="mt-1 text-sm text-gray-500">Este courier no tiene paquetes asignados actualmente.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'performance' && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-6 flex items-center">
                  <TrendingUp className="mr-2 h-5 w-5" />
                  Comparativa Mensual
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-500">Paquetes</p>
                    <div className="mt-2">
                      <p className="text-2xl font-bold text-gray-900">{courierData.performance.thisMonth.packages}</p>
                      <p className={`text-sm ${courierData.performance.thisMonth.packages > courierData.performance.lastMonth.packages ? 'text-green-600' : 'text-red-600'}`}>
                        {courierData.performance.thisMonth.packages > courierData.performance.lastMonth.packages ? '↗' : '↘'} 
                        {Math.abs(courierData.performance.thisMonth.packages - courierData.performance.lastMonth.packages)} vs mes anterior
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-500">Ganancias</p>
                    <div className="mt-2">
                      <p className="text-2xl font-bold text-gray-900">${courierData.performance.thisMonth.earnings}</p>
                      <p className={`text-sm ${courierData.performance.thisMonth.earnings > courierData.performance.lastMonth.earnings ? 'text-green-600' : 'text-red-600'}`}>
                        {courierData.performance.thisMonth.earnings > courierData.performance.lastMonth.earnings ? '↗' : '↘'} 
                        ${Math.abs(courierData.performance.thisMonth.earnings - courierData.performance.lastMonth.earnings)} vs mes anterior
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-500">Rating</p>
                    <div className="mt-2">
                      <p className="text-2xl font-bold text-gray-900">{courierData.performance.thisMonth.rating}/5</p>
                      <p className={`text-sm ${courierData.performance.thisMonth.rating >= courierData.performance.lastMonth.rating ? 'text-green-600' : 'text-red-600'}`}>
                        {courierData.performance.thisMonth.rating >= courierData.performance.lastMonth.rating ? '↗' : '↘'} 
                        {Math.abs(courierData.performance.thisMonth.rating - courierData.performance.lastMonth.rating).toFixed(1)} vs mes anterior
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <Award className="mr-2 h-5 w-5" />
                  Certificaciones
                </h3>
                
                <div className="flex flex-wrap gap-2">
                  {courierData.certifications.map((cert, index) => (
                    <Badge key={index} className="bg-blue-100 text-blue-800">
                      {cert}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'schedule' && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-6 flex items-center">
                <Calendar className="mr-2 h-5 w-5" />
                Horario de Trabajo
              </h3>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Hora de Inicio</label>
                    <p className="mt-1 text-sm text-gray-900">{courierData.schedule.startTime}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Hora de Fin</label>
                    <p className="mt-1 text-sm text-gray-900">{courierData.schedule.endTime}</p>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-2">Días de Trabajo</label>
                  <div className="flex flex-wrap gap-2">
                    {courierData.schedule.workDays.map((day) => (
                      <Badge key={day} className="bg-green-100 text-green-800">
                        {day}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-500">Estado Actual</label>
                  <div className="mt-2 flex items-center">
                    {courierData.schedule.currentShift ? (
                      <Badge className="bg-green-100 text-green-800">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        En turno
                      </Badge>
                    ) : (
                      <Badge className="bg-gray-100 text-gray-800">
                        <Clock className="w-4 h-4 mr-1" />
                        Fuera de turno
                      </Badge>
                    )}
                  </div>
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
              <Button className="w-full justify-start" onClick={() => setShowAssignModal(true)}>
                <Package className="mr-2 h-4 w-4" />
                Asignar Paquete
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={handleSendMessage}>
                <Send className="mr-2 h-4 w-4" />
                Enviar Mensaje
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => navigate('courier-schedule', { id: courierId! })}>
                <Calendar className="mr-2 h-4 w-4" />
                Ver Calendario
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => navigate('courier-reports', { id: courierId! })}>
                <FileText className="mr-2 h-4 w-4" />
                Ver Reportes
              </Button>
            </div>
          </div>

          {/* Current Status */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <Activity className="mr-2 h-5 w-5" />
              Estado Actual
            </h3>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Estado:</span>
                <Badge className={getStatusColor(courierData.status)}>
                  {getStatusIcon(courierData.status)}
                  <span className="ml-1 capitalize">{courierData.status}</span>
                </Badge>
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Completados Hoy:</span>
                <span className="text-sm text-gray-900">{courierData.stats.completedToday}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Paquetes Activos:</span>
                <span className="text-sm text-gray-900">{courierData.currentPackages.length}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Tiempo Promedio:</span>
                <span className="text-sm text-gray-900">{courierData.stats.avgDeliveryTime}h</span>
              </div>
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <TrendingUp className="mr-2 h-5 w-5" />
              Métricas de Rendimiento
            </h3>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Tasa de Éxito</span>
                  <span className="text-gray-900">{courierData.stats.successRate}%</span>
                </div>
                <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full" 
                    style={{ width: `${courierData.stats.successRate}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Entregas a Tiempo</span>
                  <span className="text-gray-900">{Math.round((courierData.stats.onTimeDeliveries / courierData.stats.totalDeliveries) * 100)}%</span>
                </div>
                <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${(courierData.stats.onTimeDeliveries / courierData.stats.totalDeliveries) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Rating Cliente</span>
                  <span className="text-gray-900">{courierData.stats.rating}/5</span>
                </div>
                <div className="flex mt-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-4 w-4 ${
                        star <= courierData.stats.rating
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <Phone className="mr-2 h-5 w-5" />
              Información de Contacto
            </h3>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-500">Teléfono Principal</label>
                <p className="mt-1 text-sm text-gray-900">{courierData.phone}</p>
                <Button variant="outline" size="sm" className="mt-1 w-full" onClick={() => window.open(`tel:${courierData.phone}`)}>
                  <Phone className="mr-2 h-4 w-4" />
                  Llamar
                </Button>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-500">Email</label>
                <p className="mt-1 text-sm text-gray-900 break-words">{courierData.email}</p>
                <Button variant="outline" size="sm" className="mt-1 w-full" onClick={handleSendMessage}>
                  <Mail className="mr-2 h-4 w-4" />
                  Enviar Email
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Confirmar Eliminación"
        description={`¿Estás seguro de que deseas eliminar al courier ${courierData.name}? Esta acción no se puede deshacer.`}
        actions={
          <div className="flex space-x-3">
            <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Eliminar
            </Button>
          </div>
        }
      />

      {/* Edit Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Editar Courier"
        description="¿Deseas editar la información de este courier?"
        actions={
          <div className="flex space-x-3">
            <Button variant="outline" onClick={() => setShowEditModal(false)}>
              Cancelar
            </Button>
            <Button onClick={handleEdit}>
              Editar
            </Button>
          </div>
        }
      />

      {/* Assign Package Modal */}
      <Modal
        isOpen={showAssignModal}
        onClose={() => setShowAssignModal(false)}
        title="Asignar Paquete"
        description={`¿Deseas asignar un nuevo paquete a ${courierData.name}?`}
        actions={
          <div className="flex space-x-3">
            <Button variant="outline" onClick={() => setShowAssignModal(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAssignPackage}>
              Asignar
            </Button>
          </div>
        }
      />
    </div>
  );
};

export default CourierDetailPage;