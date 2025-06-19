// src/components/layout/Sidebar.tsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Package, 
  Users, 
  Truck, 
  BarChart3, 
  CreditCard, 
  Map, 
  Bell, 
  Settings,
  LogOut
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

interface NavItem {
  name: string;
  href: string;
  icon: any; // Simplificado para evitar errores de tipos
  badge?: number;
}

const Sidebar: React.FC = () => {
  const location = useLocation();
  const { user, logout } = useAuth();

  const navigation: NavItem[] = [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'Paquetes', href: '/packages', icon: Package },
    { name: 'Clientes', href: '/clients', icon: Users },
    { name: 'Couriers', href: '/couriers', icon: Truck },
    { name: 'Reportes', href: '/reports', icon: BarChart3 },
    { name: 'Facturación', href: '/billing', icon: CreditCard },
    { name: 'Tracking', href: '/tracking', icon: Map },
    { name: 'Notificaciones', href: '/notifications', icon: Bell, badge: 3 },
    { name: 'Configuración', href: '/settings', icon: Settings },
  ];

  const isActive = (href: string) => {
    if (href === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(href);
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <div className="h-full flex flex-col bg-white shadow-sm border-r border-gray-200">
      {/* Logo */}
      <div className="flex items-center justify-center h-16 px-4 border-b border-gray-200">
        <div className="flex items-center">
          <div className="flex items-center justify-center w-8 h-8 bg-blue-600 rounded-lg">
            <Package className="w-5 h-5 text-white" />
          </div>
          <span className="ml-2 text-xl font-bold text-gray-900">ITOBOX</span>
        </div>
      </div>

      {/* User Info */}
      {user && (
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-gray-700">
                  {user.firstName?.[0]}{user.lastName?.[0]}
                </span>
              </div>
            </div>
            <div className="ml-3 min-w-0 flex-1">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {user.role}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
        {navigation.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={`
                group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors
                ${isActive(item.href)
                  ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }
              `}
            >
              <Icon
                className={`
                  mr-3 h-5 w-5 flex-shrink-0
                  ${isActive(item.href) ? 'text-blue-700' : 'text-gray-400 group-hover:text-gray-500'}
                `}
              />
              <span className="flex-1">{item.name}</span>
              {item.badge && (
                <span className="ml-3 inline-block py-0.5 px-2 text-xs font-medium bg-red-100 text-red-600 rounded-full">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-2 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="group flex items-center w-full px-2 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900 transition-colors"
        >
          <LogOut className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" />
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
};

export default Sidebar;