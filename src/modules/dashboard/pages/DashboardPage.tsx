import React, { useContext } from 'react';
import { 
  Package, 
  Users, 
  Truck, 
  DollarSign, 
  TrendingUp, 
  Clock, 
  MapPin, 
  Star,
  Plus,
  FileText,
  Eye
} from 'lucide-react';
import { useNavigation } from '../../../contexts/NavigationContext';

const DashboardPage: React.FC = () => {
  const { navigate  } = useNavigation();

  // Datos simulados
  const stats = {
    packages: {
      total: 2847,
      pending: 156,
      inTransit: 89,
      delivered: 2602
    },
    clients: {
      total: 342,
      active: 298,
      new: 12
    },
    couriers: {
      total: 24,
      active: 18,
      available: 12
    },
    revenue: {
      today: 15670,
      month: 456780,
      growth: 12.5
    }
  };

  const recentActivity = [
    {
      id: 1,
      type: 'package',
      description: 'Nuevo paquete ITB234567 creado',
      time: '5 min',
      icon: Package,
      color: 'text-blue-600'
    },
    {
      id: 2,
      type: 'delivery',
      description: 'Paquete ITB123456 entregado',
      time: '12 min',
      icon: Truck,
      color: 'text-green-600'
    },
    {
      id: 3,
      type: 'client',
      description: 'Nuevo cliente María González registrado',
      time: '25 min',
      icon: Users,
      color: 'text-purple-600'
    },
    {
      id: 4,
      type: 'payment',
      description: 'Pago de $1,250 recibido',
      time: '1 hora',
      icon: DollarSign,
      color: 'text-green-600'
    },
    {
      id: 5,
      type: 'courier',
      description: 'Courier Roberto Silva conectado',
      time: '2 horas',
      icon: MapPin,
      color: 'text-orange-600'
    }
  ];

  const topCouriers = [
    {
      id: 1,
      name: 'Roberto Silva',
      deliveries: 89,
      rating: 4.9,
      status: 'active'
    },
    {
      id: 2,
      name: 'Ana García',
      deliveries: 76,
      rating: 4.8,
      status: 'active'
    },
    {
      id: 3,
      name: 'Carlos López',
      deliveries: 64,
      rating: 4.7,
      status: 'available'
    },
    {
      id: 4,
      name: 'Marina Torres',
      deliveries: 58,
      rating: 4.9,
      status: 'active'
    }
  ];

  return (
    <div className="relative p-6 lg:p-8 -mt-20">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Bienvenido de vuelta. Aquí tienes un resumen de tu operación.</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Paquetes Total</p>
              <p className="text-2xl font-bold text-gray-900">{stats.packages.total.toLocaleString()}</p>
              <p className="text-xs text-green-600 flex items-center mt-1">
                <TrendingUp className="w-3 h-3 mr-1" />
                +{stats.revenue.growth}% vs mes anterior
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Clientes Activos</p>
              <p className="text-2xl font-bold text-gray-900">{stats.clients.active}</p>
              <p className="text-xs text-purple-600">
                +{stats.clients.new} nuevos este mes
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Couriers Activos</p>
              <p className="text-2xl font-bold text-gray-900">{stats.couriers.active}</p>
              <p className="text-xs text-orange-600">
                {stats.couriers.available} disponibles
              </p>
            </div>
            <div className="p-3 bg-orange-100 rounded-full">
              <Truck className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Ingresos del Mes</p>
              <p className="text-2xl font-bold text-gray-900">${stats.revenue.month.toLocaleString()}</p>
              <p className="text-xs text-green-600">
                ${stats.revenue.today.toLocaleString()} hoy
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats Detail */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-xl">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Estado de Paquetes</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Pendientes</span>
              <span className="font-semibold text-yellow-600">{stats.packages.pending}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">En Tránsito</span>
              <span className="font-semibold text-blue-600">{stats.packages.inTransit}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Entregados</span>
              <span className="font-semibold text-green-600">{stats.packages.delivered}</span>
            </div>
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-xl">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Rendimiento Hoy</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Entregas</span>
              <span className="font-semibold text-green-600">23</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Recogidas</span>
              <span className="font-semibold text-blue-600">18</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Eficiencia</span>
              <span className="font-semibold text-purple-600">94%</span>
            </div>
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-xl">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Acciones Rápidas</h3>
          <div className="space-y-3">
            <button
              onClick={() => navigate('NewPackagePage')}
              className="w-full flex items-center space-x-3 p-3 text-left bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
            >
              <Plus className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">Crear Paquete</span>
            </button>
            <button
              onClick={() => navigate('NewClientPage')}
              className="w-full flex items-center space-x-3 p-3 text-left bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
            >
              <Plus className="w-5 h-5 text-purple-600" />
              <span className="text-sm font-medium text-purple-900">Nuevo Cliente</span>
            </button>
            <button
              onClick={() => navigate('reports')}
              className="w-full flex items-center space-x-3 p-3 text-left bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
            >
              <FileText className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium text-green-900">Ver Reportes</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white/70 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Actividad Reciente</h3>
            <button
              onClick={() => navigate('notifications')}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              Ver todo
            </button>
          </div>
          <div className="space-y-4">
            {recentActivity.map((activity) => {
              const IconComponent = activity.icon;
              return (
                <div key={activity.id} className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className={`p-2 rounded-full bg-gray-100`}>
                    <IconComponent className={`w-4 h-4 ${activity.color}`} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{activity.description}</p>
                    <p className="text-xs text-gray-500 flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      hace {activity.time}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Couriers */}
        <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Top Couriers</h3>
            <button
              onClick={() => navigate('couriers')}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              Ver todos
            </button>
          </div>
          <div className="space-y-4">
            {topCouriers.map((courier) => (
              <div key={courier.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {courier.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{courier.name}</p>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-500">{courier.deliveries} entregas</span>
                      <div className="flex items-center space-x-1">
                        <Star className="w-3 h-3 text-yellow-400 fill-current" />
                        <span className="text-xs text-gray-500">{courier.rating}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className={`w-2 h-2 rounded-full ${
                  courier.status === 'active' ? 'bg-green-400' : 'bg-yellow-400'
                }`}></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;