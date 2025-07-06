// src/components/layout/MainLayout.tsx - LIMPIO SIN DUPLICADOS

import React, { useState } from 'react';
import { 
  Home, Package, Users, Truck, Building2, MapPin, 
  BarChart3, CreditCard, Bell, Settings, Search, 
  Menu, X, ChevronDown, User, LogOut
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigation } from '../../contexts/NavigationContext';

interface MainLayoutProps {
  children: React.ReactNode;
}

interface NavItem {
  name: string;
  path: string;
  icon: React.ComponentType<any>;
  badge?: number;
}

const navigation: NavItem[] = [
  { name: 'Dashboard', path: '/', icon: Home },
  { name: 'Paquetes', path: '/packages', icon: Package, badge: 12 },
  { name: 'Clientes', path: '/clients', icon: Users },
  { name: 'Couriers', path: '/couriers', icon: Truck },
  { name: 'Almacén', path: '/warehouse', icon: Building2 },
  { name: 'Tracking', path: '/tracking', icon: MapPin },
  { name: 'Reportes', path: '/reports', icon: BarChart3 },
  { name: 'Facturación', path: '/billing', icon: CreditCard },
  { name: 'Notificaciones', path: '/notifications', icon: Bell, badge: 3 },
  { name: 'Configuración', path: '/settings', icon: Settings }
];

function MainLayout({ children }: MainLayoutProps) {
  // Hooks
  const { user, logout } = useAuth();
  const { currentPath, isActivePath, breadcrumbs } = useNavigation();
  
  // Estados locales
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Función para navegar
  const handleNavigation = (path: string) => {
    window.location.href = path;
    setIsSidebarOpen(false);
  };

  // Manejar búsqueda
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log('Searching for:', searchQuery);
    }
  };

  // Manejar logout
  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-72 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Backdrop glassmorphism */}
        <div className="absolute inset-0 bg-white/20 backdrop-blur-xl border-r border-white/30"></div>
        
        {/* Contenido del sidebar */}
        <div className="relative flex flex-col h-full">
          {/* Header del sidebar */}
          <div className="flex items-center justify-between p-6 border-b border-white/20">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Package className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  ITOBOX
                </h1>
                <p className="text-sm text-gray-600">Courier System</p>
              </div>
            </div>
            
            {/* Botón cerrar en móvil */}
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden p-2 rounded-lg hover:bg-white/20 transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Navegación */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = isActivePath(item.path);
              
              return (
                <button
                  key={item.name}
                  onClick={() => handleNavigation(item.path)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-700 shadow-lg'
                      : 'hover:bg-white/30 text-gray-700 hover:text-gray-900'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-gray-500 group-hover:text-gray-700'}`} />
                    <span className="font-medium">{item.name}</span>
                  </div>
                  
                  {item.badge && (
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      isActive 
                        ? 'bg-blue-100 text-blue-700' 
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* User info */}
          <div className="p-4 border-t border-white/20">
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="w-full flex items-center space-x-3 p-3 rounded-xl hover:bg-white/20 transition-colors"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-medium text-gray-900">{user?.firstName || 'Usuario'}</p>
                  <p className="text-sm text-gray-600">{user?.email || 'user@itobox.com'}</p>
                </div>
                <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${
                  isUserMenuOpen ? 'rotate-180' : ''
                }`} />
              </button>

              {/* Dropdown menu */}
              {isUserMenuOpen && (
                <div className="absolute bottom-full left-0 w-full mb-2 bg-white/90 backdrop-blur-sm rounded-xl shadow-xl border border-white/20 py-2">
                  <button
                    onClick={() => handleNavigation('/settings')}
                    className="w-full flex items-center space-x-3 px-4 py-2 hover:bg-gray-100/50 transition-colors"
                  >
                    <Settings className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-700">Configuración</span>
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-3 px-4 py-2 hover:bg-gray-100/50 transition-colors text-red-600"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Cerrar Sesión</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Overlay para móvil */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Contenido principal */}
      <div className="lg:pl-72">
        {/* Header superior */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-gray-200/50">
          <div className="flex items-center justify-between px-6 py-4">
            {/* Botón menú móvil */}
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100/50 transition-colors"
            >
              <Menu className="w-6 h-6 text-gray-600" />
            </button>

            {/* Breadcrumbs */}
            <div className="hidden lg:flex items-center space-x-2 text-sm">
              {breadcrumbs.map((crumb, index) => (
                <React.Fragment key={crumb.path}>
                  {index > 0 && <span className="text-gray-400">/</span>}
                  <button
                    onClick={() => handleNavigation(crumb.path)}
                    className="text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    {crumb.label}
                  </button>
                </React.Fragment>
              ))}
            </div>

            {/* Barra de búsqueda */}
            <div className="flex-1 max-w-md mx-4">
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar paquetes, clientes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white/50 border border-gray-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all placeholder-gray-500"
                />
              </form>
            </div>

            {/* Notificaciones */}
            <button
              onClick={() => handleNavigation('/notifications')}
              className="relative p-2 rounded-lg hover:bg-gray-100/50 transition-colors"
            >
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
            </button>
          </div>
        </header>

        {/* Contenido de la página */}
        <main className="relative p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

export default MainLayout;
