// src/components/layout/MainLayout.tsx
import React, { useState } from 'react';
import {
  LayoutDashboard,
  Package,
  Users,
  Truck,
  BarChart3,
  CreditCard,
  Search,
  MapPin,
  Bell,
  Settings,
  User,
  LogOut,
  Menu,
  X,
  Archive // ✅ Nuevo icono para Warehouse
} from 'lucide-react';
import { useNavigation } from '../../contexts/NavigationContext';

interface MainLayoutProps {
  children: React.ReactNode;
  onLogout: () => void;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children, onLogout }) => {
  const { currentPage, navigate } = useNavigation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', page: 'DashboardPage', icon: LayoutDashboard, current: currentPage === 'DashboardPage' },
    { name: 'Paquetes', page: 'PackagesPage', icon: Package, current: currentPage === 'PackagesPage', badge: '12' },
    { name: 'Clientes', page: 'ClientsPage', icon: Users, current: currentPage === 'ClientsPage' },
    { name: 'Couriers', page: 'CouriersPage', icon: Truck, current: currentPage === 'CouriersPage' },
    { name: 'Warehouse', page: 'WarehousePage', icon: Archive, current: currentPage === 'WarehousePage' }, // ✅ Nueva página
    { name: 'Reportes', page: 'ReportsPage', icon: BarChart3, current: currentPage === 'ReportsPage' },
    { name: 'Facturación', page: 'BillingPage', icon: CreditCard, current: currentPage === 'BillingPage' },
    { name: 'Tracking', page: 'TrackingPage', icon: MapPin, current: currentPage === 'TrackingPage' },
    { name: 'Notificaciones', page: 'NotificationsPage', icon: Bell, current: currentPage === 'NotificationsPage', badge: '3' },
    { name: 'Configuración', page: 'SettingsPage', icon: Settings, current: currentPage === 'SettingsPage' }
  ];

  const handleNavigation = (page: string) => {
    navigate(page);
    setSidebarOpen(false);
  };

  return (
    <div className="h-screen flex overflow-hidden bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Sidebar para móvil */}
      <div className={`fixed inset-0 flex z-40 lg:hidden ${sidebarOpen ? '' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        
        <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white/90 backdrop-blur-xl border-r border-white/20">
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-6 w-6 text-white" />
            </button>
          </div>
          
          <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
            <div className="flex-shrink-0 flex items-center px-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                  <Truck className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    ITOBOX
                  </h1>
                  <p className="text-xs text-gray-500">Courier System</p>
                </div>
              </div>
            </div>
            
            <nav className="mt-8 px-3">
              <div className="space-y-1">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.name}
                      onClick={() => handleNavigation(item.page)}
                      className={`${
                        item.current
                          ? 'bg-gradient-to-r from-blue-50 to-purple-50 border-r-4 border-blue-500 text-blue-700'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      } group flex items-center px-2 py-2 text-sm font-medium rounded-l-lg transition-all duration-200 w-full text-left`}
                    >
                      <Icon className={`${item.current ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'} mr-3 h-5 w-5`} />
                      <span className="flex-1">{item.name}</span>
                      {item.badge && (
                        <span className="ml-3 inline-block py-0.5 px-2 text-xs bg-blue-100 text-blue-600 rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </nav>
          </div>
          
          <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
            <div className="flex items-center space-x-3 w-full">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">Juan Pérez</p>
                <p className="text-xs text-gray-500">Admin</p>
              </div>
              <button
                onClick={onLogout}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar para desktop */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-72">
          <div className="flex flex-col h-0 flex-1 bg-white/90 backdrop-blur-xl border-r border-white/20 shadow-xl">
            <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
              <div className="flex items-center flex-shrink-0 px-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Truck className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      ITOBOX
                    </h1>
                    <p className="text-sm text-gray-500">Courier System</p>
                  </div>
                </div>
              </div>
              
              <nav className="mt-8 flex-1 px-4">
                <div className="space-y-2">
                  {navigation.map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.name}
                        onClick={() => handleNavigation(item.page)}
                        className={`${
                          item.current
                            ? 'bg-gradient-to-r from-blue-50 to-purple-50 border-r-4 border-blue-500 text-blue-700 shadow-sm'
                            : 'text-gray-600 hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50 hover:text-gray-900'
                        } group flex items-center px-3 py-3 text-sm font-medium rounded-l-xl transition-all duration-200 w-full text-left`}
                      >
                        <Icon className={`${item.current ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'} mr-4 h-5 w-5`} />
                        <span className="flex-1">{item.name}</span>
                        {item.badge && (
                          <span className="ml-3 inline-block py-0.5 px-2 text-xs bg-blue-100 text-blue-600 rounded-full">
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </nav>
            </div>
            
            <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
              <div className="flex items-center space-x-3 w-full">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">Juan Pérez</p>
                  <p className="text-xs text-gray-500">Admin</p>
                </div>
                <button
                  onClick={onLogout}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        {/* Header */}
        <div className="relative z-10 flex-shrink-0 flex h-16 bg-white/80 backdrop-blur-xl border-b border-white/20 shadow-sm lg:border-none">
          <button
            className="px-4 border-r border-gray-200 text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
          
          <div className="flex-1 px-4 flex justify-between items-center lg:px-8">
            <div className="flex-1 flex items-center">
              <div className="w-full flex lg:ml-0">
                <div className="relative w-full text-gray-400 focus-within:text-gray-600">
                  <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none">
                    <Search className="h-5 w-5" />
                  </div>
                  <input
                    className="block w-full h-full pl-8 pr-3 py-2 border-transparent text-gray-900 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-0 focus:border-transparent bg-gray-50/50 rounded-lg"
                    placeholder="Buscar paquetes, clientes, tracking..."
                    type="search"
                  />
                </div>
              </div>
            </div>
            
            <div className="ml-4 flex items-center lg:ml-6">
              <button className="bg-white/80 backdrop-blur-sm p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 relative">
                <Bell className="h-6 w-6" />
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-xs font-medium text-white">3</span>
                </span>
              </button>
              
              <div className="ml-3 relative">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm font-medium text-gray-700 hidden lg:block">Juan Pérez</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contenido principal con el fix del -mt-20 */}
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="lg:pl-0 -mt-20"> {/* ✅ Mantenemos el -mt-20 para alineación */}
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export { MainLayout };