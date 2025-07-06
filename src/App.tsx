import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { NavigationProvider } from './contexts/NavigationContext';

// Import existing pages
import MainLayout from './components/layout/MainLayout';
import DashboardPage from './modules/dashboard/pages/DashboardPage';
import PackagesPage from './modules/packages/pages/PackagesPage';
import ClientsPage from './modules/clients/pages/ClientsPage';
import CouriersPage from './modules/couriers/pages/CouriersPage';
import ReportsPage from './modules/reports/pages/ReportsPage';
import SettingsPage from './modules/settings/pages/SettingsPage';
import BillingPage from './modules/billing/pages/BillingPage';
import TrackingPage from './modules/tracking/pages/TrackingPage';
import NotificationsPage from './modules/notifications/pages/NotificationsPage';

// Import auth pages
import LoginPage from './pages/auth/LoginPage';

// Import client portal
import ClientPortalPage from './pages/client/ClientPortalPage';

// Import Warehouse (WHR Module) 
import WarehousePage from './modules/warehouse/pages/WarehousePage';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <NavigationProvider>
        <Router>
          <Routes>
            {/* Auth Routes */}
            <Route path="/login" element={<LoginPage />} />
            
            {/* Client Portal Route (outside MainLayout) */}
            <Route path="/client-portal" element={<ClientPortalPage />} />
            
            {/* Main App Routes with Layout */}
            <Route path="/*" element={
              <MainLayout>
                <Routes>
                  <Route path="/" element={<DashboardPage />} />
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/packages" element={<PackagesPage />} />
                  <Route path="/clients" element={<ClientsPage />} />
                  <Route path="/couriers" element={<CouriersPage />} />
                  <Route path="/reports" element={<ReportsPage />} />
                  <Route path="/billing" element={<BillingPage />} />
                  <Route path="/tracking" element={<TrackingPage />} />
                  <Route path="/notifications" element={<NotificationsPage />} />
                  <Route path="/settings" element={<SettingsPage />} />
                  <Route path="/warehouse" element={<WarehousePage />} />
                  {/* Redirect any unknown routes to dashboard */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </MainLayout>
            } />
          </Routes>
        </Router>
      </NavigationProvider>
    </AuthProvider>
  );
};

export default App;