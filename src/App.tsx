// src/App.tsx
// REEMPLAZAR CONTENIDO COMPLETO para agregar NavigationProvider

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { NavigationProvider } from './contexts/NavigationContext'; // NUEVO
import { NotificationProvider } from './contexts/NotificationContext';
import MainLayout from './components/layout/MainLayout';

// Import pages
import DashboardPage from './modules/dashboard/pages/DashboardPage';
import PackagesPage from './modules/packages/pages/PackagesPage';
import ClientsPage from './modules/clients/pages/ClientsPage';
import CouriersPage from './modules/couriers/pages/CouriersPage';
import ReportsPage from './modules/reports/pages/ReportsPage';
import BillingPage from './modules/billing/pages/BillingPage';
import TrackingPage from './modules/tracking/pages/TrackingPage';
import NotificationsPage from './modules/notifications/pages/NotificationsPage';
import SettingsPage from './modules/settings/pages/SettingsPage';

// Import auth pages
import LoginPage from './modules/auth/pages/LoginPage';
import RegisterPage from './modules/auth/pages/RegisterPage';

// Import Warehouse (WHR Module)
import WarehousePage from './modules/courier/pages/WarehousePage';

function App() {
  return (
    <AuthProvider>
      <NavigationProvider> {/* AGREGADO - Envolver toda la app */}
        <NotificationProvider>
          <Router>
            <div className="App">
              <Routes>
                {/* Auth Routes */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                
                {/* Protected Routes with Layout */}
                <Route path="/" element={<MainLayout />}>
                  <Route index element={<DashboardPage />} />
                  <Route path="dashboard" element={<DashboardPage />} />
                  <Route path="packages" element={<PackagesPage />} />
                  <Route path="clients" element={<ClientsPage />} />
                  <Route path="couriers" element={<CouriersPage />} />
                  <Route path="reports" element={<ReportsPage />} />
                  <Route path="billing" element={<BillingPage />} />
                  <Route path="tracking" element={<TrackingPage />} />
                  <Route path="notifications" element={<NotificationsPage />} />
                  <Route path="settings" element={<SettingsPage />} />
                  <Route path="warehouse" element={<WarehousePage />} />
                </Route>

                {/* Redirect any unknown route to dashboard */}
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </div>
          </Router>
        </NotificationProvider>
      </NavigationProvider> {/* CERRAR NavigationProvider */}
    </AuthProvider>
  );
}

export default App;