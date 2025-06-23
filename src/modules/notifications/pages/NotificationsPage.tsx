import React, { useState } from 'react';
import { useNavigation } from '../../../contexts/NavigationContext';
import { 
  Bell, 
  Settings, 
  Check, 
  X, 
  Eye, 
  Trash2, 
  Filter,
  Package,
  Users,
  DollarSign,
  AlertTriangle,
  Info,
  CheckCircle,
  Mail,
  MoreHorizontal
} from 'lucide-react';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  category: 'package' | 'client' | 'billing' | 'system';
  read: boolean;
  timestamp: string;
  actionUrl?: string;
}

const NotificationsPage: React.FC = () => {
  const { navigate } = useNavigation();
  const [filterType, setFilterType] = useState('all');
  const [filterRead, setFilterRead] = useState('all');

  // Datos simulados de notificaciones
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 'NOTIF-001',
      title: 'Nuevo paquete creado',
      message: 'Ana García ha creado un nuevo paquete PKG-2024-001 con destino a San José Centro.',
      type: 'info',
      category: 'package',
      read: false,
      timestamp: '2024-06-22T10:30:00Z',
      actionUrl: 'package-detail'
    },
    {
      id: 'NOTIF-002',
      title: 'Paquete entregado exitosamente',
      message: 'El paquete PKG-2024-002 ha sido entregado por Carlos Mendoza.',
      type: 'success',
      category: 'package',
      read: false,
      timestamp: '2024-06-22T09:15:00Z',
      actionUrl: 'package-tracking'
    },
    {
      id: 'NOTIF-003',
      title: 'Factura vencida',
      message: 'La factura FAC-2024-003 de Roberto Silva ha vencido. Monto: $875.00',
      type: 'warning',
      category: 'billing',
      read: true,
      timestamp: '2024-06-22T08:00:00Z',
      actionUrl: 'billing'
    },
    {
      id: 'NOTIF-004',
      title: 'Nuevo cliente registrado',
      message: 'María Rodríguez se ha registrado en el sistema y requiere verificación.',
      type: 'info',
      category: 'client',
      read: false,
      timestamp: '2024-06-21T16:45:00Z',
      actionUrl: 'client-detail'
    },
    {
      id: 'NOTIF-005',
      title: 'Error en el sistema',
      message: 'Se detectó un problema en la sincronización de datos. Se requiere atención técnica.',
      type: 'error',
      category: 'system',
      read: true,
      timestamp: '2024-06-21T14:20:00Z'
    },
    {
      id: 'NOTIF-006',
      title: 'Pago recibido',
      message: 'Se ha recibido el pago de $450.75 de Ana García para la factura FAC-2024-001.',
      type: 'success',
      category: 'billing',
      read: true,
      timestamp: '2024-06-21T11:30:00Z'
    }
  ]);

  const getNotificationIcon = (category: string, type: string) => {
    if (category === 'package') return Package;
    if (category === 'client') return Users;
    if (category === 'billing') return DollarSign;
    if (category === 'system') {
      if (type === 'error') return AlertTriangle;
      if (type === 'success') return CheckCircle;
      if (type === 'warning') return AlertTriangle;
      return Info;
    }
    return Bell;
  };

  const getNotificationColor = (type: string) => {
    const colorMap = {
      info: 'bg-blue-100 text-blue-600',
      success: 'bg-green-100 text-green-600',
      warning: 'bg-yellow-100 text-yellow-600',
      error: 'bg-red-100 text-red-600'
    };
    return colorMap[type as keyof typeof colorMap] || colorMap.info;
  };

  const getCategoryLabel = (category: string) => {
    const categoryMap = {
      package: 'Paquetes',
      client: 'Clientes',
      billing: 'Facturación',
      system: 'Sistema'
    };
    return categoryMap[category as keyof typeof categoryMap] || category;
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Ahora mismo';
    if (diffMins < 60) return `Hace ${diffMins} minutos`;
    if (diffHours < 24) return `Hace ${diffHours} horas`;
    if (diffDays < 7) return `Hace ${diffDays} días`;
    return date.toLocaleDateString();
  };

  // Filtros
  const filteredNotifications = notifications.filter(notif => {
    const matchesType = filterType === 'all' || notif.category === filterType;
    const matchesRead = filterRead === 'all' || 
      (filterRead === 'unread' && !notif.read) || 
      (filterRead === 'read' && notif.read);
    
    return matchesType && matchesRead;
  });

  // Estadísticas
  const stats = {
    total: notifications.length,
    unread: notifications.filter(n => !n.read).length,
    packages: notifications.filter(n => n.category === 'package').length,
    billing: notifications.filter(n => n.category === 'billing').length
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAsUnread = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: false } : notif
      )
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const deleteAllRead = () => {
    setNotifications(prev => prev.filter(notif => !notif.read));
  };

  const handleNotificationClick = (notification: Notification) => {
    markAsRead(notification.id);
    if (notification.actionUrl) {
      navigate(notification.actionUrl, { id: notification.id });
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Centro de Notificaciones</h1>
          <p className="text-gray-600 mt-1">
            Mantente informado sobre todas las actividades del sistema
          </p>
        </div>
        
        <button
          onClick={() => navigate('settings')}
          className="flex items-center space-x-2 bg-gradient-to-r from-gray-600 to-gray-700 text-white px-6 py-3 rounded-xl hover:from-gray-700 hover:to-gray-800 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          <Settings className="w-5 h-5" />
          <span className="font-medium">Configurar</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total</p>
              <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Bell className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Sin leer</p>
              <p className="text-3xl font-bold text-red-600">{stats.unread}</p>
            </div>
            <div className="bg-red-100 p-3 rounded-lg">
              <Mail className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Paquetes</p>
              <p className="text-3xl font-bold text-purple-600">{stats.packages}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <Package className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Facturación</p>
              <p className="text-3xl font-bold text-green-600">{stats.billing}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filtros y acciones masivas */}
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Filtros */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Todas las categorías</option>
                <option value="package">Paquetes</option>
                <option value="client">Clientes</option>
                <option value="billing">Facturación</option>
                <option value="system">Sistema</option>
              </select>
            </div>
            
            <select
              value={filterRead}
              onChange={(e) => setFilterRead(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Todas</option>
              <option value="unread">Sin leer</option>
              <option value="read">Leídas</option>
            </select>
          </div>
          
          {/* Acciones masivas */}
          <div className="flex items-center space-x-2">
            <button
              onClick={markAllAsRead}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Check className="w-4 h-4" />
              <span>Marcar todas como leídas</span>
            </button>
            <button
              onClick={deleteAllRead}
              className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              <span>Eliminar leídas</span>
            </button>
          </div>
        </div>
      </div>

      {/* Lista de notificaciones */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="divide-y divide-gray-200">
          {filteredNotifications.map((notification) => {
            const Icon = getNotificationIcon(notification.category, notification.type);
            const colorClass = getNotificationColor(notification.type);
            
            return (
              <div
                key={notification.id}
                className={`p-6 hover:bg-gray-50 transition-colors cursor-pointer ${
                  !notification.read ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                }`}
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="flex items-start space-x-4">
                  {/* Icono */}
                  <div className={`p-2 rounded-lg ${colorClass}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  
                  {/* Contenido */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className={`text-sm font-medium ${!notification.read ? 'text-gray-900' : 'text-gray-700'}`}>
                            {notification.title}
                          </h3>
                          {!notification.read && (
                            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                          )}
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-2">
                          {notification.message}
                        </p>
                        
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span className="bg-gray-100 px-2 py-1 rounded-full">
                            {getCategoryLabel(notification.category)}
                          </span>
                          <span>{formatTimestamp(notification.timestamp)}</span>
                        </div>
                      </div>
                      
                      {/* Acciones */}
                      <div className="flex items-center space-x-1 ml-4">
                        {notification.read ? (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              markAsUnread(notification.id);
                            }}
                            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                            title="Marcar como no leída"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              markAsRead(notification.id);
                            }}
                            className="p-1 text-gray-400 hover:text-green-600 transition-colors"
                            title="Marcar como leída"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        )}
                        
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNotification(notification.id);
                          }}
                          className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                          title="Eliminar notificación"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        
                        <div className="relative group">
                          <button 
                            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                            title="Más opciones"
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                          
                          {/* Dropdown menu */}
                          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                            <div className="py-1">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  console.log(`Archivar notificación ${notification.id}`);
                                }}
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                              >
                                Archivar
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  console.log(`Marcar importante ${notification.id}`);
                                }}
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                              >
                                Marcar importante
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  console.log(`Reenviar ${notification.id}`);
                                }}
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                              >
                                Reenviar por email
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  console.log(`Silenciar tipo ${notification.category}`);
                                }}
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                              >
                                Silenciar este tipo
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  console.log(`Reportar spam ${notification.id}`);
                                }}
                                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                              >
                                Reportar spam
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {filteredNotifications.length === 0 && (
          <div className="text-center py-12">
            <Bell className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No hay notificaciones</h3>
            <p className="mt-1 text-sm text-gray-500">
              {filterRead === 'unread' 
                ? 'No tienes notificaciones sin leer.'
                : 'No se encontraron notificaciones con los filtros seleccionados.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;