// src/App.tsx
import React from 'react';
import { NavigationProvider, useNavigation } from './contexts/NavigationContext';
import { MainLayout } from './components/layout/MainLayout';

// Importar páginas principales con default imports
import DashboardPage from './modules/dashboard/pages/DashboardPage';
import PackagesPage from './modules/packages/pages/PackagesPage';
import PackageDetailsPage from './modules/packages/pages/PackageDetailsPage';
import NewPackagePage from './modules/packages/pages/NewPackagePage';
import ClientsPage from './modules/clients/pages/ClientsPage';
import ClientProfilePage from './modules/clients/pages/ClientProfilePage';
import NewClientPage from './modules/clients/pages/NewClientPage';
import CouriersPage from './modules/couriers/pages/CouriersPage';
import CourierProfilePage from './modules/couriers/pages/CourierProfilePage';
import NewCourierPage from './modules/couriers/pages/NewCourierPage';
import ReportsPage from './modules/reports/pages/ReportsPage';
import BillingPage from './modules/billing/pages/BillingPage';
import TrackingPage from './modules/tracking/pages/TrackingPage';
import NotificationsPage from './modules/notifications/pages/NotificationsPage';
import SettingsPage from './modules/settings/pages/SettingsPage';

// Importar páginas de autenticación
import { LoginPage } from './modules/auth/pages/LoginPage';
import { RegisterPage } from './modules/auth/pages/RegisterPage';
import ForgotPasswordPage from './modules/auth/pages/ForgotPasswordPage';

// Importar WarehousePage (si existe)
let WarehousePage: React.ComponentType<any> | null = null;
try {
  WarehousePage = require('./modules/courier/pages/WarehousePage').default || 
                  require('./modules/warehouse/pages/WarehousePage').default ||
                  require('./modules/courier/components/WarehouseModule').default ||
                  null;
} catch (error) {
  console.log('ℹ️ WarehousePage no encontrada, usando placeholder');
}

// ====== COMPONENTE PLACEHOLDER ======
const PlaceholderPage: React.FC<{ pageName: string }> = ({ pageName }) => (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-6">
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/20 text-center max-w-md w-full">
      <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
        <span className="text-2xl text-white font-bold">📦</span>
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        {pageName}
      </h2>
      <p className="text-gray-600 mb-6">
        Esta página está en desarrollo
      </p>
      <button
        onClick={() => window.location.hash = '#/'}
        className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors"
      >
        Volver al Dashboard
      </button>
    </div>
  </div>
);

// ====== COMPONENTE PRINCIPAL DE ROUTING ======
const AppRouter: React.FC = () => {
  const { currentPage, params } = useNavigation();

  console.log(`🎯 App Router: Renderizando página ${currentPage}`, { params });

  // ====== FUNCIÓN PARA RENDERIZAR PÁGINAS ======
  const renderPage = () => {
    switch (currentPage) {
      // Dashboard
      case 'DashboardPage':
        return <DashboardPage />;

      // Package pages
      case 'PackagesPage':
        return <PackagesPage />;
      case 'NewPackagePage':
        return <NewPackagePage />;
      case 'PackageDetailsPage':
        return <PackageDetailsPage packageId={params.id || '1'} />;
      case 'EditPackagePage':
        return <PackageDetailsPage packageId={params.id || '1'} />; // Reutiliza el mismo componente

      // Client pages
      case 'ClientsPage':
        return <ClientsPage />;
      case 'ClientProfilePage':
        return <ClientProfilePage />;
      case 'NewClientPage':
        return <NewClientPage />;

      // Courier pages
      case 'CouriersPage':
        return <CouriersPage />;
      case 'CourierProfilePage':
        return <CourierProfilePage />;
      case 'NewCourierPage':
        return <NewCourierPage />;

      // Other main pages
      case 'WarehousePage':
        return WarehousePage ? <WarehousePage /> : <PlaceholderPage pageName="Warehouse" />;
      case 'ReportsPage':
        return <ReportsPage />;
      case 'BillingPage':
        return <BillingPage />;
      case 'TrackingPage':
        return <TrackingPage />;
      case 'NotificationsPage':
        return <NotificationsPage />;
      case 'SettingsPage':
        return <SettingsPage />;

      // Auth pages (renderizadas sin MainLayout)
      case 'LoginPage':
        return <LoginPage />;
      case 'RegisterPage':
        return <RegisterPage />;
      case 'ForgotPasswordPage':
        return ForgotPasswordPage ? <ForgotPasswordPage /> : <PlaceholderPage pageName="Recuperar Contraseña" />;

      // 404 - Página no encontrada
      default:
        return (
          <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
              <p className="text-xl text-gray-600 mb-8">Página no encontrada</p>
              <button
                onClick={() => window.location.hash = '#/'}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Volver al Dashboard
              </button>
            </div>
          </div>
        );
    }
  };

  // ====== DETERMINAR SI MOSTRAR LAYOUT ======
  const authPages = ['LoginPage', 'RegisterPage', 'ForgotPasswordPage'];
  const shouldShowLayout = !authPages.includes(currentPage);

  // ====== LOGOUT HANDLER ======
  const handleLogout = () => {
    console.log('🚪 Logout ejecutado');
    // Aquí puedes agregar lógica de logout real
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    window.location.hash = '#/login';
  };

  // ====== PÁGINAS SIN LAYOUT (AUTH) ======
  if (!shouldShowLayout) {
    return (
      <div className="auth-container">
        {renderPage()}
      </div>
    );
  }

  // ====== PÁGINAS CON LAYOUT PRINCIPAL ======
  return (
    <MainLayout onLogout={handleLogout}>
      {renderPage()}
    </MainLayout>
  );
};

// ====== COMPONENTE PRINCIPAL DE LA APP ======
const App: React.FC = () => {
  return (
    <NavigationProvider>
      <div className="App">
        <AppRouter />
      </div>
    </NavigationProvider>
  );
};

export default App;