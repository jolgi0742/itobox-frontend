// src/components/layout/MainLayout.tsx
// REEMPLAZAR CONTENIDO COMPLETO - Con navegación funcional y botones operativos

import React, { ReactNode, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigation } from '../../contexts/NavigationContext';
import { 
  Home, Package, Users, Truck, BarChart3, CreditCard, 
  Search, Bell, Settings, User, ChevronDown, Menu, X,
  MapPin, MessageSquare, Warehouse, LogOut, Eye, 
  CheckCircle2, AlertTriangle, Info
} from 'lucide-react';

// Definir la interfaz para las props
interface MainLayoutProps {
  children?: ReactNode;
}

// Interface para notificaciones
interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  timestamp: string;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { navigate: contextNavigate } = useNavigation();
  
  // Estados locales
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // Datos mock de notificaciones
  const [notifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'Nuevo paquete',
      message: 'PKG-2024-001 creado por Ana García',
      type: 'info',
      read: false,
      timestamp: '2024-06-22T10:30:00Z'
    },
    {
      id: '2',
      title: 'Entrega completada',
      message: 'PKG-2024-002 entregado exitosamente',
      type: 'success',
      read: false,
      timestamp: '2024-06-22T09:15:00Z'
    },
    {
      id: '3',
      title: 'Factura vencida',
      message: 'FAC-2024-003 requiere atención',
      type: 'warning',
      read: true,
      timestamp: '2024-06-21T16:45:00Z'
    }
  ]);

  const navigation = [
    { name: 'Dashboard', href: '/', icon: Home, current: window.location.pathname === '/' },
    { name: 'Paquetes', href: '/packages', icon: Package, current: window.location.pathname.startsWith('/packages'), badge: '12' },
    { name: 'Clientes', href: '/clients', icon: Users, current: window.location.pathname.startsWith('/clients') },
    { name: 'Couriers', href: '/couriers', icon: Truck, current: window.location.pathname.startsWith('/couriers') },
    { name: 'Reportes', href: '/reports', icon: BarChart3, current: window.location.pathname.startsWith('/reports') },
    { name: 'Facturación', href: '/billing', icon: CreditCard, current: window.location.pathname.startsWith('/billing'), badge: '3' },
    { name: 'Tracking', href: '/tracking', icon: MapPin, current: window.location.pathname.startsWith('/tracking') },
    { name: 'Almacén', href: '/warehouse', icon: Warehouse, current: window.location.pathname.startsWith('/warehouse') },
    { name: 'Notificaciones', href: '/notifications', icon: MessageSquare, current: window.location.pathname.startsWith('/notifications'), badge: notifications.filter(n => !n.read).length.toString() },
    { name: 'Configuración', href: '/settings', icon: Settings, current: window.location.pathname.startsWith('/settings') },
  ];

  // ✅ NAVEGACIÓN CORREGIDA - Usa React Router en lugar de window.location
  const handleNavigation = (href: string) => {
    console.log('🚀 Navegando a:', href);
    
    try {
      // Usar React Router para navegación SPA
      navigate(href);
      setIsSidebarOpen(false); // Cerrar sidebar en móvil
      
      // También actualizar el contexto de navegación
      const cleanPath = href.startsWith('/') ? href.slice(1) : href;
      contextNavigate(cleanPath || 'dashboard');
      
      console.log('✅ Navegación exitosa:', href);
    } catch (error) {
      console.error('❌ Error en navegación:', error);
      // Fallback a window.location solo en caso de error
      window.location.href = href;
    }
  };

  // ✅ BOTÓN DE NOTIFICACIONES FUNCIONAL
  const handleNotificationsClick = () => {
    console.log('🔔 Abriendo notificaciones');
    setShowNotifications(!showNotifications);
  };

  // ✅ BOTÓN DE CONFIGURACIÓN FUNCIONAL  
  const handleSettingsClick = () => {
    console.log('⚙️ Navegando a configuración');
    handleNavigation('/settings');
  };

  // ✅ SISTEMA DE LOGOUT FUNCIONAL
  const handleLogoutClick = () => {
    console.log('🚪 Solicitando logout');
    setShowLogoutConfirm(true);
    setShowUserMenu(false);
  };

  const confirmLogout = () => {
    console.log('✅ Logout confirmado');
    try {
      logout(); // Llamar al método logout del AuthContext
      setShowLogoutConfirm(false);
      navigate('/login'); // Redirigir al login
    } catch (error) {
      console.error('❌ Error en logout:', error);
      // Fallback
      window.location.href = '/login';
    }
  };

  // Función para obtener el icono de notificación
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success': return CheckCircle2;
      case 'warning': return AlertTriangle;
      case 'error': return AlertTriangle;
      default: return Info;
    }
  };

  // Función para obtener el color de notificación
  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'success': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'error': return 'text-red-600';
      default: return 'text-blue-600';
    }
  };

  // Formatear timestamp
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Ahora';
    if (diffMins < 60) return `${diffMins}m`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h`;
    return `${Math.floor(diffMins / 1440)}d`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-72 bg-white/80 backdrop-blur-xl border-r border-white/20 shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between h-20 px-6 border-b border-gray-200/50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                ITOBOX
              </h1>
              <p className="text-xs text-gray-500">Courier System</p>
            </div>
          </div>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="mt-6 px-4">
          <div className="space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.name}
                  onClick={() => handleNavigation(item.href)}
                  className={`w-full group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                    item.current
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25'
                      : 'text-gray-700 hover:bg-white/60 hover:text-blue-600'
                  }`}
                >
                  <Icon className={`mr-3 h-5 w-5 transition-colors ${
                    item.current ? 'text-white' : 'text-gray-400 group-hover:text-blue-500'
                  }`} />
                  <span className="flex-1 text-left">{item.name}</span>
                  {item.badge && (
                    <span className={`ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      item.current 
                        ? 'bg-white/20 text-white' 
                        : 'bg-blue-100 text-blue-600 group-hover:bg-blue-200'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </nav>

        {/* User Profile */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200/50">
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="w-full flex items-center space-x-3 p-3 rounded-xl bg-gradient-to-r from-gray-50 to-blue-50 hover:from-blue-50 hover:to-purple-50 transition-all duration-200"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 min-w-0 text-left">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {(user?.firstName && user?.lastName) 
  ? `${user.firstName} ${user.lastName}` 
  : user?.email || 'Usuario'}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {user?.email || 'admin@itobox.com'}
                </p>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </button>

            {/* User Dropdown Menu */}
            {showUserMenu && (
              <div className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-xl shadow-lg border border-gray-200/50 backdrop-blur-xl z-10">
                <div className="p-2">
                  <button
                    onClick={() => {
                      handleNavigation('/profile');
                      setShowUserMenu(false);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <User className="w-4 h-4" />
                    Mi Perfil
                  </button>
                  <button
                    onClick={() => {
                      handleNavigation('/settings');
                      setShowUserMenu(false);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                    Configuración
                  </button>
                  <hr className="my-2 border-gray-200" />
                  <button
                    onClick={handleLogoutClick}
                    className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Cerrar Sesión
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile sidebar overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="lg:pl-72">
        {/* Top bar */}
        <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-white/20 shadow-sm">
          <div className="flex items-center justify-between h-14 px-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              >
                <Menu className="w-5 h-5" />
              </button>
              
              {/* Search bar */}
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Buscar..."
                  className="pl-10 pr-4 py-2 w-80 text-sm bg-white/60 border border-gray-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300"
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* ✅ BOTÓN DE NOTIFICACIONES FUNCIONAL */}
              <div className="relative">
                <button 
                  onClick={handleNotificationsClick}
                  className="relative p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-white/60 transition-colors"
                  title="Notificaciones"
                >
                  <Bell className="w-5 h-5" />
                  {notifications.filter(n => !n.read).length > 0 && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
                  )}
                </button>

                {/* Dropdown de notificaciones */}
                {showNotifications && (
                  <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200/50 backdrop-blur-xl z-50">
                    <div className="p-4 border-b border-gray-200">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-gray-900">Notificaciones</h3>
                        <button
                          onClick={() => handleNavigation('/notifications')}
                          className="text-sm text-blue-600 hover:text-blue-800"
                        >
                          Ver todas
                        </button>
                      </div>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {notifications.slice(0, 5).map((notification) => {
                        const Icon = getNotificationIcon(notification.type);
                        const colorClass = getNotificationColor(notification.type);
                        
                        return (
                          <div
                            key={notification.id}
                            className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                              !notification.read ? 'bg-blue-50' : ''
                            }`}
                            onClick={() => {
                              handleNavigation('/notifications');
                              setShowNotifications(false);
                            }}
                          >
                            <div className="flex items-start space-x-3">
                              <Icon className={`w-4 h-4 mt-0.5 ${colorClass}`} />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900">
                                  {notification.title}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                  {notification.message}
                                </p>
                                <p className="text-xs text-gray-400 mt-1">
                                  {formatTimestamp(notification.timestamp)}
                                </p>
                              </div>
                              {!notification.read && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full mt-1"></div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    {notifications.length === 0 && (
                      <div className="p-4 text-center text-gray-500">
                        No hay notificaciones
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* ✅ BOTÓN DE CONFIGURACIÓN FUNCIONAL */}
              <button 
                onClick={handleSettingsClick}
                className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-white/60 transition-colors"
                title="Configuración"
              >
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Page content */}
        <div className="min-h-screen pt-2">
          {children || <Outlet />}
        </div>
      </div>

      {/* ✅ MODAL DE CONFIRMACIÓN DE LOGOUT */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <LogOut className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Cerrar Sesión
                </h3>
                <p className="text-sm text-gray-500">
                  ¿Estás seguro de que quieres salir?
                </p>
              </div>
            </div>
            
            <p className="text-gray-600 mb-6">
              Tu sesión se cerrará y deberás iniciar sesión nuevamente para acceder al sistema.
            </p>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={confirmLogout}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Click outside handlers */}
      {showNotifications && (
        <div 
          className="fixed inset-0 z-40"
          onClick={() => setShowNotifications(false)}
        />
      )}
      
      {showUserMenu && (
        <div 
          className="fixed inset-0 z-10"
          onClick={() => setShowUserMenu(false)}
        />
      )}
    </div>
  );
};

export default MainLayout;