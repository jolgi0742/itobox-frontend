import React from 'react';
import { useNavigation } from '../../../contexts/NavigationContext';
import { 
  Package, 
  Users, 
  Truck, 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  MapPin,
  Plus,
  FileText,
  Eye,
  MoreHorizontal
} from 'lucide-react';

const DashboardPage: React.FC = () => {
  const { navigate } = useNavigation();

  // Función de test para debug
  const handleTestNavigation = (page: string) => {
    console.log('🔥 BOTÓN CLICKEADO:', page);
    console.log('🔍 Navigate function:', navigate);
    
    try {
      navigate(page);
      console.log('✅ Navigate ejecutado exitosamente');
    } catch (error) {
      console.error('❌ Error en navigate:', error);
    }
  };

  // Datos simulados para el dashboard
  const stats = [
    {
      title: 'Paquetes Totales',
      value: '2,543',
      change: '+12.5%',
      trend: 'up' as const,
      icon: Package,
      color: 'bg-gradient-to-br from-blue-400 to-blue-600'
    },
    {
      title: 'Clientes Activos',
      value: '847',
      change: '+8.2%',
      trend: 'up' as const,
      icon: Users,
      color: 'bg-gradient-to-br from-green-400 to-green-600'
    },
    {
      title: 'Couriers',
      value: '24',
      change: '+2',
      trend: 'up' as const,
      icon: Truck,
      color: 'bg-gradient-to-br from-purple-400 to-purple-600'
    },
    {
      title: 'Ingresos del Mes',
      value: '$45,280',
      change: '-3.1%',
      trend: 'down' as const,
      icon: DollarSign,
      color: 'bg-gradient-to-br from-yellow-400 to-orange-500'
    }
  ];

  const recentActivity = [
    {
      id: 1,
      type: 'package',
      title: 'Nuevo paquete creado',
      description: 'PKG-2024-001 de Ana García a Carlos López',
      time: 'Hace 5 minutos',
      icon: Package,
      color: 'text-blue-600'
    },
    {
      id: 2,
      type: 'delivery',
      title: 'Paquete entregado',
      description: 'PKG-2024-002 entregado por Carlos Mendoza',
      time: 'Hace 15 minutos',
      icon: MapPin,
      color: 'text-green-600'
    },
    {
      id: 3,
      type: 'client',
      title: 'Nuevo cliente registrado',
      description: 'María Rodríguez se unió al sistema',
      time: 'Hace 1 hora',
      icon: Users,
      color: 'text-purple-600'
    },
    {
      id: 4,
      type: 'alert',
      title: 'Retraso en entrega',
      description: 'PKG-2024-003 con retraso de 30 minutos',
      time: 'Hace 2 horas',
      icon: Clock,
      color: 'text-orange-600'
    }
  ];

  const topCouriers = [
    {
      id: 1,
      name: 'Carlos Mendoza',
      deliveries: 47,
      rating: 4.9,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face'
    },
    {
      id: 2,
      name: 'Ana Pérez',
      deliveries: 43,
      rating: 4.8,
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b332b63e?w=40&h=40&fit=crop&crop=face'
    },
    {
      id: 3,
      name: 'Luis García',
      deliveries: 39,
      rating: 4.7,
      avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=40&h=40&fit=crop&crop=face'
    }
  ];

  return (
    <div className="relative p-6 lg:p-8 pt-4 space-y-6">
      {/* Debug Info */}
      <div className="bg-yellow-100 border border-yellow-400 rounded-lg p-4 mb-4">
        <h4 className="font-bold text-yellow-800">🔧 DEBUG INFO:</h4>
        <p className="text-yellow-700">Navigate function disponible: {typeof navigate === 'function' ? '✅ SÍ' : '❌ NO'}</p>
        <p className="text-yellow-700">Abrir DevTools Console para ver logs de navegación</p>
      </div>

      {/* Header con búsqueda */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-gray-600 mt-1">
            Resumen de actividad y métricas clave
          </p>
        </div>
        
        {/* Barra de búsqueda */}
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar paquetes, clientes..."
            className="w-full lg:w-80 pl-4 pr-4 py-3 bg-white/70 backdrop-blur-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          const TrendIcon = stat.trend === 'up' ? TrendingUp : TrendingDown;
          
          return (
            <div
              key={index}
              className="relative overflow-hidden bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    {stat.title}
                  </p>
                  <p className="text-3xl font-bold text-gray-900 mb-2">
                    {stat.value}
                  </p>
                  <div className={`flex items-center space-x-1 ${
                    stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    <TrendIcon className="w-4 h-4" />
                    <span className="text-sm font-medium">{stat.change}</span>
                  </div>
                </div>
                <div className={`${stat.color} p-3 rounded-xl shadow-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Estado de Entregas Hoy</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Entregados</span>
              <span className="font-semibold text-green-600">87</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">En tránsito</span>
              <span className="font-semibold text-blue-600">45</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Pendientes</span>
              <span className="font-semibold text-orange-600">23</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Con retraso</span>
              <span className="font-semibold text-red-600">8</span>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Couriers del Mes</h3>
          <div className="space-y-3">
            {topCouriers.map((courier, index) => (
              <div key={courier.id} className="flex items-center space-x-3">
                <span className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {index + 1}
                </span>
                <img
                  src={courier.avatar}
                  alt={courier.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {courier.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {courier.deliveries} entregas
                  </p>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="text-xs font-medium text-yellow-600">★</span>
                  <span className="text-xs text-gray-600">{courier.rating}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Acciones Rápidas</h3>
          <div className="space-y-3">
            <button 
              onClick={() => handleTestNavigation('package-create')}
              className="w-full flex items-center space-x-3 p-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Plus className="w-5 h-5" />
              <span className="font-medium">Crear Paquete</span>
            </button>
            
            <button 
              onClick={() => handleTestNavigation('client-create')}
              className="w-full flex items-center space-x-3 p-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Users className="w-5 h-5" />
              <span className="font-medium">Nuevo Cliente</span>
            </button>
            
            <button 
              onClick={() => handleTestNavigation('courier-create')}
              className="w-full flex items-center space-x-3 p-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Truck className="w-5 h-5" />
              <span className="font-medium">Agregar Courier</span>
            </button>
            
            <button 
              onClick={() => handleTestNavigation('warehouse')}
              className="w-full flex items-center space-x-3 p-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Package className="w-5 h-5" />
              <span className="font-medium">Warehouse</span>
            </button>
          </div>
        </div>
      </div>

      {/* Actividad Reciente */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900">Actividad Reciente</h3>
          <button 
            onClick={() => handleTestNavigation('notifications')}
            className="text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors duration-200"
          >
            Ver todas
          </button>
        </div>
        
        <div className="space-y-4">
          {recentActivity.map((activity) => {
            const Icon = activity.icon;
            return (
              <div
                key={activity.id}
                className="flex items-start space-x-4 p-4 hover:bg-gray-50 rounded-xl transition-colors duration-200"
              >
                <div className={`p-2 rounded-lg bg-gray-50 ${activity.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    {activity.title}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {activity.description}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {activity.time}
                  </p>
                </div>
                <button className="text-gray-400 hover:text-gray-600 transition-colors duration-200">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;