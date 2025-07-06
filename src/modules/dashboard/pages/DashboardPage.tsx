import React, { useState, useEffect } from 'react';
import { 
  Package, 
  Users, 
  Truck, 
  DollarSign, 
  TrendingUp, 
  Bell,
  Plus,
  Search,
  Filter,
  Star,
  MapPin,
  Clock,
  CheckCircle,
  AlertCircle,
  Calendar,
  Activity,
  ArrowUp,
  ArrowDown,
  BarChart3,
  Eye
} from 'lucide-react';

interface DashboardStats {
  totalPackages: number;
  activeClients: number;
  activeCouriers: number;
  monthlyRevenue: number;
  weeklyGrowth: number;
  deliveryRate: number;
}

interface QuickStat {
  label: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: React.ElementType;
}

interface Activity {
  id: string;
  type: 'package' | 'delivery' | 'client' | 'courier';
  title: string;
  description: string;
  time: string;
  status: 'success' | 'warning' | 'info';
}

interface TopCourier {
  id: string;
  name: string;
  deliveries: number;
  rating: number;
  avatar: string;
}

const DashboardPage: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [stats] = useState<DashboardStats>({
    totalPackages: 1247,
    activeClients: 89,
    activeCouriers: 23,
    monthlyRevenue: 45600,
    weeklyGrowth: 12.5,
    deliveryRate: 98.2
  });

  const [quickStats] = useState<QuickStat[]>([
    {
      label: 'Entregas Hoy',
      value: '124',
      change: '+8.2%',
      trend: 'up',
      icon: CheckCircle
    },
    {
      label: 'En Tránsito',
      value: '67',
      change: '-2.1%',
      trend: 'down',
      icon: Truck
    },
    {
      label: 'Pendientes',
      value: '23',
      change: '+5.4%',
      trend: 'up',
      icon: Clock
    },
    {
      label: 'Problemas',
      value: '3',
      change: '-1.2%',
      trend: 'down',
      icon: AlertCircle
    }
  ]);

  const [recentActivity] = useState<Activity[]>([
    {
      id: '1',
      type: 'delivery',
      title: 'Paquete entregado',
      description: 'ITB240705001 entregado en San José',
      time: 'Hace 5 min',
      status: 'success'
    },
    {
      id: '2',
      type: 'package',
      title: 'Nuevo paquete creado',
      description: 'ITB240705045 - Cartago a Heredia',
      time: 'Hace 12 min',
      status: 'info'
    },
    {
      id: '3',
      type: 'client',
      title: 'Cliente registrado',
      description: 'Tech Solutions S.A. se unió',
      time: 'Hace 1 hora',
      status: 'success'
    },
    {
      id: '4',
      type: 'courier',
      title: 'Courier en ruta',
      description: 'Carlos Rodríguez recogió 8 paquetes',
      time: 'Hace 2 horas',
      status: 'info'
    },
    {
      id: '5',
      type: 'delivery',
      title: 'Retraso reportado',
      description: 'ITB240705023 - Tráfico en San Pedro',
      time: 'Hace 3 horas',
      status: 'warning'
    }
  ]);

  const [topCouriers] = useState<TopCourier[]>([
    {
      id: '1',
      name: 'Carlos Rodríguez',
      deliveries: 156,
      rating: 4.9,
      avatar: 'CR'
    },
    {
      id: '2',
      name: 'María Fernández',
      deliveries: 142,
      rating: 4.8,
      avatar: 'MF'
    },
    {
      id: '3',
      name: 'Luis Mora',
      deliveries: 128,
      rating: 4.7,
      avatar: 'LM'
    }
  ]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-600 bg-green-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'info': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'package': return Package;
      case 'delivery': return Truck;
      case 'client': return Users;
      case 'courier': return MapPin;
      default: return Bell;
    }
  };

  const getTrendIcon = (trend: 'up' | 'down') => {
    return trend === 'up' ? 
      <ArrowUp className="w-3 h-3" /> : 
      <ArrowDown className="w-3 h-3" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 relative">
      {/* Glassmorphism Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-green-400/20 to-blue-600/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-gradient-to-br from-indigo-400/10 to-pink-600/10 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
      </div>

      <div className="relative p-3 lg:p-4">
        {/* Header - Extra compacto */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
          <div>
            <h1 className="text-xl lg:text-2xl font-bold text-gray-900 mb-1">
              Dashboard
            </h1>
            <p className="text-gray-600 text-sm">
              Bienvenido de vuelta, aquí tienes el resumen de hoy
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2 mt-3 lg:mt-0">
            <div className="flex items-center gap-2 text-gray-600 text-sm">
              <Calendar className="w-4 h-4" />
              <span>
                {currentTime.toLocaleDateString('es-CR', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </div>
            <div className="flex items-center gap-2 text-gray-600 text-sm">
              <Clock className="w-4 h-4" />
              <span>
                {currentTime.toLocaleTimeString('es-CR', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons - Extra compactos */}
        <div className="flex flex-wrap gap-2 mb-4">
          <button className="px-3 py-1.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-md font-medium hover:shadow-lg hover:scale-105 transition-all duration-200 flex items-center gap-1.5 text-xs">
            <Plus className="w-3 h-3" />
            Nuevo Paquete
          </button>
          <button className="px-3 py-1.5 bg-white/70 backdrop-blur-md text-gray-700 rounded-md font-medium hover:bg-white/80 transition-all duration-200 border border-white/20 flex items-center gap-1.5 text-xs">
            <Search className="w-3 h-3" />
            Buscar
          </button>
          <button className="px-3 py-1.5 bg-white/70 backdrop-blur-md text-gray-700 rounded-md font-medium hover:bg-white/80 transition-all duration-200 border border-white/20 flex items-center gap-1.5 text-xs">
            <Filter className="w-3 h-3" />
            Filtros
          </button>
        </div>

        {/* Main Stats Cards - Extra compactos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
          {[
            { icon: Package, label: 'Total Paquetes', value: stats.totalPackages.toLocaleString(), color: 'from-blue-500 to-blue-600', bgColor: 'from-blue-50 to-blue-100' },
            { icon: Users, label: 'Clientes Activos', value: stats.activeClients.toString(), color: 'from-green-500 to-green-600', bgColor: 'from-green-50 to-green-100' },
            { icon: Truck, label: 'Couriers Activos', value: stats.activeCouriers.toString(), color: 'from-purple-500 to-purple-600', bgColor: 'from-purple-50 to-purple-100' },
            { icon: DollarSign, label: 'Ingresos del Mes', value: `${stats.monthlyRevenue.toLocaleString()}`, color: 'from-orange-500 to-orange-600', bgColor: 'from-orange-50 to-orange-100' }
          ].map((stat, index) => (
            <div key={index} className={`bg-gradient-to-br ${stat.bgColor} backdrop-blur-md rounded-lg p-3 border border-white/20 hover:shadow-lg hover:scale-105 transition-all duration-300 group`}>
              <div className="flex items-center justify-between mb-2">
                <div className={`p-1.5 rounded-md bg-gradient-to-r ${stat.color} shadow-md group-hover:scale-110 transition-transform duration-200`}>
                  <stat.icon className="w-4 h-4 text-white" />
                </div>
                <div className="flex items-center text-green-600 text-xs font-medium">
                  <TrendingUp className="w-2 h-2 mr-1" />
                  +{stats.weeklyGrowth}%
                </div>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-0.5">{stat.value}</h3>
              <p className="text-gray-600 text-xs">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Quick Stats - Extra compactos */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 mb-4">
          {quickStats.map((stat, index) => (
            <div key={index} className="bg-white/60 backdrop-blur-md rounded-md p-2 border border-white/20 hover:shadow-md hover:bg-white/70 transition-all duration-200">
              <div className="flex items-center justify-between mb-1">
                <stat.icon className="w-3 h-3 text-gray-600" />
                <span className={`text-xs font-medium flex items-center gap-0.5 ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                  {getTrendIcon(stat.trend)}
                  {stat.change}
                </span>
              </div>
              <h4 className="text-base font-bold text-gray-900">{stat.value}</h4>
              <p className="text-gray-600 text-xs">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <div className="bg-white/70 backdrop-blur-md rounded-xl border border-white/20 shadow-md">
              <div className="p-4 border-b border-white/20 bg-gradient-to-r from-white/50 to-white/30 rounded-t-xl">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    Actividad Reciente
                  </h2>
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1 hover:scale-105 transition-all">
                    <Eye className="w-4 h-4" />
                    Ver todo
                  </button>
                </div>
              </div>
              
              <div className="p-4">
                <div className="space-y-3">
                  {recentActivity.map((activity) => {
                    const Icon = getActivityIcon(activity.type);
                    return (
                      <div key={activity.id} className="flex items-start gap-3 p-2 rounded-lg hover:bg-white/60 transition-all duration-200 group">
                        <div className={`p-1.5 rounded-md ${getStatusColor(activity.status)} group-hover:scale-110 transition-transform`}>
                          <Icon className="w-3 h-3" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 truncate text-sm">{activity.title}</h4>
                          <p className="text-gray-600 text-xs truncate">{activity.description}</p>
                        </div>
                        <span className="text-xs text-gray-500 whitespace-nowrap">{activity.time}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Top Couriers */}
            <div className="bg-white/70 backdrop-blur-md rounded-xl border border-white/20 shadow-md">
              <div className="p-4 border-b border-white/20 bg-gradient-to-r from-white/50 to-white/30 rounded-t-xl">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <Star className="w-5 h-5" />
                    Top Couriers
                  </h2>
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium hover:scale-105 transition-all">
                    Ranking
                  </button>
                </div>
              </div>
              
              <div className="p-4">
                <div className="space-y-3">
                  {topCouriers.map((courier, index) => (
                    <div key={courier.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/60 transition-all duration-200 group">
                      <div className="relative">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xs group-hover:scale-110 transition-transform">
                          {courier.avatar}
                        </div>
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center text-xs font-bold text-yellow-900">
                          {index + 1}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 truncate text-sm">{courier.name}</h4>
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                          <span>{courier.deliveries} entregas</span>
                          <div className="flex items-center gap-1">
                            <Star className="w-2 h-2 text-yellow-400 fill-current" />
                            <span>{courier.rating}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white/70 backdrop-blur-md rounded-xl border border-white/20 shadow-md">
              <div className="p-4 border-b border-white/20 bg-gradient-to-r from-white/50 to-white/30 rounded-t-xl">
                <h2 className="text-lg font-bold text-gray-900">Acciones Rápidas</h2>
              </div>
              
              <div className="p-4">
                <div className="grid grid-cols-1 gap-2">
                  {[
                    { icon: Package, label: 'Crear Paquete', color: 'from-blue-500 to-blue-600' },
                    { icon: Users, label: 'Nuevo Cliente', color: 'from-green-500 to-green-600' },
                    { icon: Search, label: 'Buscar Tracking', color: 'from-purple-500 to-purple-600' },
                    { icon: BarChart3, label: 'Ver Reportes', color: 'from-orange-500 to-orange-600' }
                  ].map((action, index) => (
                    <button
                      key={index}
                      className="flex items-center gap-2 p-2 rounded-lg bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 hover:scale-105 transition-all duration-200 text-left w-full group"
                    >
                      <div className={`p-1.5 rounded-md bg-gradient-to-r ${action.color} shadow-sm group-hover:scale-110 transition-transform`}>
                        <action.icon className="w-3 h-3 text-white" />
                      </div>
                      <span className="font-medium text-gray-700 text-sm">{action.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;