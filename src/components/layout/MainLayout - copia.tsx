// src/components/layout/MainLayout.tsx
// REEMPLAZAR CONTENIDO COMPLETO - Con espaciado corregido y navegación funcional

import React, { ReactNode } from 'react';
import { Outlet } from 'react-router-dom';
import { 
  Home, Package, Users, Truck, BarChart3, CreditCard, 
  Search, Bell, Settings, User, ChevronDown, Menu, X,
  MapPin, MessageSquare, Warehouse
} from 'lucide-react';

// Definir la interfaz para las props
interface MainLayoutProps {
  children?: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/', icon: Home, current: window.location.pathname === '/' },
    { name: 'Paquetes', href: '/packages', icon: Package, current: window.location.pathname.startsWith('/packages'), badge: '12' },
    { name: 'Clientes', href: '/clients', icon: Users, current: window.location.pathname.startsWith('/clients') },
    { name: 'Couriers', href: '/couriers', icon: Truck, current: window.location.pathname.startsWith('/couriers') },
    { name: 'Reportes', href: '/reports', icon: BarChart3, current: window.location.pathname.startsWith('/reports') },
    { name: 'Facturación', href: '/billing', icon: CreditCard, current: window.location.pathname.startsWith('/billing'), badge: '3' },
    { name: 'Tracking', href: '/tracking', icon: MapPin, current: window.location.pathname.startsWith('/tracking') },
    { name: 'Almacén', href: '/warehouse', icon: Warehouse, current: window.location.pathname.startsWith('/warehouse') },
    { name: 'Notificaciones', href: '/notifications', icon: MessageSquare, current: window.location.pathname.startsWith('/notifications'), badge: '5' },
    { name: 'Configuración', href: '/settings', icon: Settings, current: window.location.pathname.startsWith('/settings') },
  ];

  const handleNavigation = (href: string) => {
    // Navegación simple usando window.location - FUNCIONA CORRECTAMENTE
    console.log('Navegando a:', href);
    window.location.href = href;
    setIsSidebarOpen(false); // Cerrar sidebar en móvil
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
          <div className="flex items-center space-x-3 p-3 rounded-xl bg-gradient-to-r from-gray-50 to-blue-50 hover:from-blue-50 hover:to-purple-50 transition-all duration-200 cursor-pointer">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">Admin User</p>
              <p className="text-xs text-gray-500 truncate">admin@itobox.com</p>
            </div>
            <ChevronDown className="w-4 h-4 text-gray-400" />
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
        {/* Top bar - ALTURA REDUCIDA PARA EVITAR SOBREPOSICIÓN */}
        <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-white/20 shadow-sm">
          <div className="flex items-center justify-between h-14 px-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              >
                <Menu className="w-5 h-5" />
              </button>
              
              {/* Search bar - TAMAÑO REDUCIDO */}
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
              {/* Notifications */}
              <button className="relative p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-white/60 transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </button>

              {/* Settings */}
              <button className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-white/60 transition-colors">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Page content - SIN MARGIN NEGATIVO QUE CAUSA SOBREPOSICIÓN */}
        <div className="min-h-screen pt-2">
          {/* Usar children si se pasan, sino usar Outlet para React Router */}
          {children || <Outlet />}
        </div>
      </div>
    </div>
  );
};

export default MainLayout;