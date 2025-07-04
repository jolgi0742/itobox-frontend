// src/App.tsx - Minimal Version

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Import only existing pages
import DashboardPage from './modules/dashboard/pages/DashboardPage';
import PackagesPage from './modules/packages/pages/PackagesPage';
import ClientsPage from './modules/clients/pages/ClientsPage';
import CouriersPage from './modules/couriers/pages/CouriersPage';
import BillingPage from './modules/billing/pages/BillingPage';
import TrackingPage from './modules/tracking/pages/TrackingPage';
import ReportsPage from './modules/reports/pages/ReportsPage';
import NotificationsPage from './modules/notifications/pages/NotificationsPage';
import SettingsPage from './modules/settings/pages/SettingsPage';

// ✅ WAREHOUSE-USA PAGES
import WarehousePage from './modules/warehouse/pages/WarehousePage';
import WarehouseTestStandalone from './components/WarehouseTestStandalone';

// CSS
import './App.css';

// Simple Login Page
const LoginPage: React.FC = () => {
  const handleLogin = () => {
    localStorage.setItem('isAuthenticated', 'true');
    window.location.href = '/dashboard';
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6">ITOBOX Courier</h2>
        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
        >
          Entrar al Sistema
        </button>
      </div>
    </div>
  );
};

// Protected Route Component
interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

// Main App Component
const App: React.FC = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* ============= PUBLIC ROUTES ============= */}
          
          {/* Login */}
          <Route path="/login" element={<LoginPage />} />

          {/* ✅ WAREHOUSE TESTING - Public Access */}
          <Route path="/warehouse-test" element={<WarehouseTestStandalone />} />

          {/* ============= PROTECTED ROUTES ============= */}
          
          {/* Dashboard */}
          <Route path="/" element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          } />
          
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          } />

          {/* ✅ WAREHOUSE-USA ROUTES */}
          <Route path="/warehouse" element={
            <ProtectedRoute>
              <WarehousePage />
            </ProtectedRoute>
          } />

          {/* Other Main Routes */}
          <Route path="/packages" element={
            <ProtectedRoute>
              <PackagesPage />
            </ProtectedRoute>
          } />

          <Route path="/clients" element={
            <ProtectedRoute>
              <ClientsPage />
            </ProtectedRoute>
          } />

          <Route path="/couriers" element={
            <ProtectedRoute>
              <CouriersPage />
            </ProtectedRoute>
          } />

          <Route path="/billing" element={
            <ProtectedRoute>
              <BillingPage />
            </ProtectedRoute>
          } />

          <Route path="/tracking" element={
            <ProtectedRoute>
              <TrackingPage />
            </ProtectedRoute>
          } />
          
          <Route path="/reports" element={
            <ProtectedRoute>
              <ReportsPage />
            </ProtectedRoute>
          } />
          
          <Route path="/notifications" element={
            <ProtectedRoute>
              <NotificationsPage />
            </ProtectedRoute>
          } />
          
          <Route path="/settings" element={
            <ProtectedRoute>
              <SettingsPage />
            </ProtectedRoute>
          } />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
          
        </Routes>
      </div>
    </Router>
  );
};

export default App;