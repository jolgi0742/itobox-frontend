// src/components/layout/MainLayout.tsx - FIXED
import React, { useState, useEffect } from 'react';
import { 
  Home, 
  Package, 
  Users, 
  Truck, 
  BarChart3, 
  Settings, 
  CreditCard, 
  Search, 
  Bell, 
  User,
  Menu,
  X,
  ChevronDown,
  LogOut,
  UserCircle
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

// Hook de navegación simple
const useNavigate = () => {
  return (path: string) => {
    window.location.hash = path;
    window.location.reload();
  };
};

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  // Hooks
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  // Estados locales
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Detectar página actual
  const [currentPage, setCurrentPage] = useState('dashboard');

  useEffect(() => {
    const hash = window.location.hash.slice(1) || 'dashboard';
    setCurrentPage(hash);
  }, []);

  // Navegación
  const handleNavigation = (path: string) => {
    setCurrentPage(path);
    navigate(`/${path}`);
    setIsSidebarOpen(false);
  };

  // Logout
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Menú de navegación
  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, badge: null },
    { id: 'packages', label: 'Paquetes', icon: Package, badge: '12' },
    { id: 'clients', label: 'Clientes', icon: Users, badge: null },
    { id: 'couriers', label: 'Couriers', icon: Truck, badge: null },
    { id: 'reports', label: 'Reportes', icon: BarChart3, badge: null },
    { id: 'billing', label: 'Facturación', icon: CreditCard, badge: '3' },
    { id: 'tracking', label: 'Tracking', icon: Search, badge: null },
    { id: 'notifications', label: 'Notificaciones', icon: Bell, badge: '5' },
    { id: 'settings', label: 'Configuración', icon: Settings, badge: null },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Sidebar Overlay (Mobile) */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-full w-72 bg-white/80 backdrop-blur-xl border-r border-white/20 
        shadow-xl z-50 transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
      `}>
        {/* Logo */}
        <div className="flex items-center justify-between p-6 border-b border-white/20">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                ITOBOX
              </h1>
              <p className="text-sm text-gray-500">Courier System</p>
            </div>
          </div>
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Barra de búsqueda */}
        <div className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Buscar..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-50/50 border border-gray-200/50 rounded-xl 
                       focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50
                       transition-all duration-200"
            />
          </div>
        </div>

        {/* Navegación */}
        <nav className="px-4 space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.id)}
                className={`
                  w-full flex items-center justify-between px-4 py-3 text-left rounded-xl
                  transition-all duration-200 group
                  ${isActive 
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg' 
                    : 'text-gray-600 hover:bg-gray-50/80 hover:text-gray-900'
                  }
                `}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-600'}`} />
                  <span className="font-medium">{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`
                    px-2 py-1 text-xs font-bold rounded-full
                    ${isActive 
                      ? 'bg-white/20 text-white' 
                      : 'bg-blue-100 text-blue-600'
                    }
                  `}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Usuario */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/20 bg-white/50">
          <div className="relative">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-gray-50/80 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-gray-900">{user?.firstName || 'Admin'} User</p>
                  <p className="text-sm text-gray-500">{user?.email || 'admin@itobox.com'}</p>
                </div>
              </div>
              <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown menu */}
            {isUserMenuOpen && (
              <div className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-xl shadow-lg border border-gray-200/50 backdrop-blur-xl">
                <div className="p-2">
                  <button 
                    onClick={() => handleNavigation('profile')}
                    className="w-full flex items-center space-x-3 px-3 py-2 text-left rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <UserCircle className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-700">Mi Perfil</span>
                  </button>
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-3 px-3 py-2 text-left rounded-lg hover:bg-red-50 text-red-600 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Cerrar Sesión</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:pl-72">
        {/* Top Bar (Mobile) */}
        <div className="lg:hidden flex items-center justify-between p-4 bg-white/80 backdrop-blur-xl border-b border-white/20">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <Package className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-gray-900">ITOBOX</span>
          </div>
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
        </div>

        {/* Page Content */}
        <main className="relative">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
