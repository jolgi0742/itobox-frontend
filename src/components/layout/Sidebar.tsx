import React from 'react';
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  Truck, 
  BarChart3, 
  Settings,
  CreditCard,
  Search,
  Bell,
  MapPin,
  FileText,
  LogOut,
  User
} from 'lucide-react';

interface SidebarProps {
  currentPage?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ currentPage = 'dashboard' }) => {
  const menuItems = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard, href: '/' },
    { id: 'packages', name: 'Paquetes', icon: Package, href: '/packages' },
    { id: 'clients', name: 'Clientes', icon: Users, href: '/clients' },
    { id: 'couriers', name: 'Couriers', icon: Truck, href: '/couriers' },
    { id: 'reports', name: 'Reportes', icon: BarChart3, href: '/reports' },
    { id: 'billing', name: 'Facturación', icon: CreditCard, href: '/billing' },
    { id: 'tracking', name: 'Tracking', icon: MapPin, href: '/tracking' },
    { id: 'documents', name: 'Documentos', icon: FileText, href: '/documents' },
    { id: 'notifications', name: 'Notificaciones', icon: Bell, href: '/notifications' },
    { id: 'settings', name: 'Configuración', icon: Settings, href: '/settings' }
  ];

  const handleNavigation = (href: string) => {
    window.location.href = href;
  };

  return (
    <div className="fixed left-0 top-0 w-72 h-full bg-white/70 backdrop-blur-lg border-r border-white/20 shadow-xl z-40">
      {/* Header */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <Package className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800">ITOBOX</h1>
            <p className="text-sm text-gray-600">Courier System</p>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="p-6 border-b border-white/10">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50/50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-6 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => handleNavigation(item.href)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                  : 'text-gray-700 hover:bg-gray-100/50 hover:text-gray-900'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.name}</span>
              {item.id === 'notifications' && (
                <span className="ml-auto bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  3
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* User Profile */}
      <div className="p-6 border-t border-white/10">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-teal-600 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-gray-800">Admin User</p>
            <p className="text-sm text-gray-600">admin@itobox.com</p>
          </div>
        </div>
        
        <button
          onClick={() => handleNavigation('/login')}
          className="w-full flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-100/50 rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span className="text-sm">Cerrar Sesión</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;