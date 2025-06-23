// App.js - Integración con el sistema completo
import React, { useState } from 'react';
import { 
  Package, 
  Users, 
  BarChart3, 
  Settings, 
  Home,
  Search,
  Bell
} from 'lucide-react';

// Importar componentes de paquetes y clientes
import PackageManager from './components/packages/PackageManager';
import ClientManager from './components/clients/ClientManager';
import PublicTracking from './components/tracking/PublicTracking';

// Componentes existentes (simulados)
import Dashboard from './components/Dashboard';
import Analytics from './components/Analytics';
import SettingsComponent from './components/Settings';

const App = () => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [navigationParams, setNavigationParams] = useState({});
  const [user] = useState({ name: 'Admin ITOBOX', role: 'admin' });

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'packages', label: 'Paquetes', icon: Package },
    { id: 'clients', label: 'Clientes', icon: Users }, // ← NUEVA SECCIÓN
    { id: 'analytics', label: 'Analíticas', icon: BarChart3 },
    { id: 'tracking', label: 'Tracking Público', icon: Search },
    { id: 'settings', label: 'Configuración', icon: Settings }
  ];

  const handleNavigation = (view, params = {}) => {
    setCurrentView(view);
    setNavigationParams(params);
  };

  const renderContent = () => {
    switch (currentView) {
      case 'packages':
        return (
          <PackageManager 
            initialView={navigationParams.view}
            preselectedClientId={navigationParams.preselectedClientId}
          />
        );
      case 'clients':
        return (
          <ClientManager 
            onNavigateToPackages={(view, params) => handleNavigation('packages', { view, ...params })}
          />
        );
      case 'tracking':
        return <PublicTracking />;
      case 'analytics':
        return <Analytics />;
      case 'settings':
        return <SettingsComponent />;
      default:
        return (
          <Dashboard 
            onNavigateToPackages={() => handleNavigation('packages')}
            onNavigateToClients={() => handleNavigation('clients')}
            onNavigateToTracking={() => handleNavigation('tracking')}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg">
        <div className="flex items-center justify-center h-16 border-b border-gray-200">
          <Package className="h-8 w-8 text-blue-600 mr-2" />
          <h1 className="text-xl font-bold text-gray-900">ITOBOX Courier</h1>
        </div>
        
        <nav className="mt-5 px-2">
          <div className="space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id)}
                  className={`group flex items-center px-2 py-2 text-base font-medium rounded-md w-full ${
                    isActive
                      ? 'bg-blue-100 text-blue-900'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon
                    className={`mr-4 h-6 w-6 ${
                      isActive ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'
                    }`}
                  />
                  {item.label}
                </button>
              );
            })}
          </div>
        </nav>
      </div>

      {/* Main content */}
      <div className="ml-64 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div className="flex-1">
                <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate">
                  {navigationItems.find(item => item.id === currentView)?.label || 'Dashboard'}
                </h2>
              </div>
              
              <div className="ml-4 flex items-center md:ml-6">
                <button className="bg-white p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  <Bell className="h-6 w-6" />
                </button>
                
                <div className="ml-3 relative">
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-700 mr-2">{user.name}</span>
                    <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
                      <span className="text-sm font-medium text-white">
                        {user.name.charAt(0)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default App;