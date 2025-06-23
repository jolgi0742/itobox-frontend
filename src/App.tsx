import React from 'react';
import { NavigationProvider, useNavigation } from './contexts/NavigationContext';
import MainLayout from './components/layout/MainLayout';

// Páginas principales
import DashboardPage from './modules/dashboard/pages/DashboardPage';
import PackagesPage from './modules/packages/pages/PackagesPage';
import ClientsPage from './modules/clients/pages/ClientsPage';
import CouriersPage from './modules/couriers/pages/CouriersPage';
import ReportsPage from './modules/reports/pages/ReportsPage';
import BillingPage from './modules/billing/pages/BillingPage';
import TrackingPage from './modules/tracking/pages/TrackingPage';
import NotificationsPage from './modules/notifications/pages/NotificationsPage';
import SettingsPage from './modules/settings/pages/SettingsPage';

// Páginas de detalle y creación
import ClientDetailPage from './modules/clients/pages/ClientDetailPage';
import ClientEditPage from './modules/clients/pages/ClientEditPage';
import PackageDetailPage from './modules/packages/pages/PackageDetailPage';

// Módulo Warehouse
import WarehouseModule from './modules/courier/components/WarehouseModule';

// Páginas de creación (placeholders funcionales)
const NewClientPage: React.FC = () => (
  <div className="p-6">
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Nuevo Cliente</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre completo
            </label>
            <input 
              type="text" 
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ingrese el nombre completo"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input 
              type="email" 
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ingrese el email"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Teléfono
            </label>
            <input 
              type="tel" 
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ingrese el teléfono"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Empresa
            </label>
            <input 
              type="text" 
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ingrese la empresa"
            />
          </div>
        </div>
        <div className="mt-6 flex justify-end space-x-3">
          <button className="px-4 py-2 text-gray-600 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors">
            Cancelar
          </button>
          <button className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
            Guardar Cliente
          </button>
        </div>
      </div>
    </div>
  </div>
);

const NewPackagePage: React.FC = () => (
  <div className="p-6">
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Nuevo Paquete</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Remitente
            </label>
            <input 
              type="text" 
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Nombre del remitente"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Destinatario
            </label>
            <input 
              type="text" 
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Nombre del destinatario"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Peso (kg)
            </label>
            <input 
              type="number" 
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="0.00"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de servicio
            </label>
            <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option>Seleccionar servicio</option>
              <option>Express</option>
              <option>Estándar</option>
              <option>Económico</option>
            </select>
          </div>
        </div>
        <div className="mt-6 flex justify-end space-x-3">
          <button className="px-4 py-2 text-gray-600 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors">
            Cancelar
          </button>
          <button className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
            Crear Paquete
          </button>
        </div>
      </div>
    </div>
  </div>
);

const NewCourierPage: React.FC = () => (
  <div className="p-6">
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Nuevo Courier</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre completo
            </label>
            <input 
              type="text" 
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Nombre del courier"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Licencia de conducir
            </label>
            <input 
              type="text" 
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Número de licencia"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Vehículo
            </label>
            <input 
              type="text" 
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Marca y modelo del vehículo"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Zona asignada
            </label>
            <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option>Seleccionar zona</option>
              <option>Norte</option>
              <option>Sur</option>
              <option>Este</option>
              <option>Oeste</option>
              <option>Centro</option>
            </select>
          </div>
        </div>
        <div className="mt-6 flex justify-end space-x-3">
          <button className="px-4 py-2 text-gray-600 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors">
            Cancelar
          </button>
          <button className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
            Agregar Courier
          </button>
        </div>
      </div>
    </div>
  </div>
);

const NewInvoicePage: React.FC = () => (
  <div className="p-6">
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Nueva Factura</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cliente
            </label>
            <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option>Seleccionar cliente</option>
              <option>Ana García</option>
              <option>Carlos López</option>
              <option>María Rodríguez</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fecha de vencimiento
            </label>
            <input 
              type="date" 
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Concepto
            </label>
            <input 
              type="text" 
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Servicios de courier"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Monto
            </label>
            <input 
              type="number" 
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="0.00"
            />
          </div>
        </div>
        <div className="mt-6 flex justify-end space-x-3">
          <button className="px-4 py-2 text-gray-600 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors">
            Cancelar
          </button>
          <button className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
            Crear Factura
          </button>
        </div>
      </div>
    </div>
  </div>
);

const EditPackagePage: React.FC = () => {
  const packageId = "PKG-001"; // Placeholder

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            Editar Paquete {packageId}
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estado
              </label>
              <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option>Pendiente</option>
                <option>Recogido</option>
                <option>En tránsito</option>
                <option>En reparto</option>
                <option>Entregado</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Courier asignado
              </label>
              <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option>Carlos Mendoza</option>
                <option>Ana Pérez</option>
                <option>Luis García</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notas especiales
              </label>
              <textarea 
                rows={4}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Agregar notas especiales para este paquete..."
              />
            </div>
          </div>
          <div className="mt-6 flex justify-end space-x-3">
            <button className="px-4 py-2 text-gray-600 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors">
              Cancelar
            </button>
            <button className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
              Guardar Cambios
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const PackageTrackingPage: React.FC = () => {
  const packageId = "PKG-001"; // Placeholder

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            Tracking - {packageId}
          </h1>
          
          {/* Timeline de tracking */}
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-4 h-4 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">Paquete entregado</p>
                <p className="text-sm text-gray-500">15:30 - 22 Jun 2025</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">En reparto</p>
                <p className="text-sm text-gray-500">09:15 - 22 Jun 2025</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">En tránsito</p>
                <p className="text-sm text-gray-500">18:45 - 21 Jun 2025</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-4 h-4 bg-gray-400 rounded-full"></div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">Paquete recogido</p>
                <p className="text-sm text-gray-500">14:20 - 21 Jun 2025</p>
              </div>
            </div>
          </div>

          <div className="mt-8 bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-2">Información del paquete</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Remitente:</span>
                <span className="ml-2 text-gray-900">Ana García</span>
              </div>
              <div>
                <span className="text-gray-500">Destinatario:</span>
                <span className="ml-2 text-gray-900">Carlos López</span>
              </div>
              <div>
                <span className="text-gray-500">Peso:</span>
                <span className="ml-2 text-gray-900">2.5 kg</span>
              </div>
              <div>
                <span className="text-gray-500">Courier:</span>
                <span className="ml-2 text-gray-900">Carlos Mendoza</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const InvoiceDetailPage: React.FC = () => {
  const { navigate } = useNavigation();
  
  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Detalle de Factura</h1>
            <button 
              onClick={() => navigate('billing')}
              className="px-4 py-2 text-gray-600 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Volver
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Información de Factura</h3>
              <p><strong>Número:</strong> FAC-2024-001</p>
              <p><strong>Fecha:</strong> 22 Jun 2024</p>
              <p><strong>Vencimiento:</strong> 30 Jun 2024</p>
              <p><strong>Estado:</strong> <span className="text-green-600">Pagada</span></p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Cliente</h3>
              <p><strong>Nombre:</strong> Ana García Morales</p>
              <p><strong>Email:</strong> ana.garcia@email.com</p>
              <p><strong>Empresa:</strong> Distribuidora Central</p>
            </div>
          </div>
          
          <div className="mt-6">
            <h3 className="font-semibold text-gray-900 mb-4">Servicios Facturados</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <span>Servicios de courier - Junio 2024</span>
                <span className="font-bold">$450.75</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ReportsDetailPage: React.FC = () => {
  const { navigate } = useNavigation();
  
  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Reporte Detallado</h1>
            <button 
              onClick={() => navigate('reports')}
              className="px-4 py-2 text-gray-600 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Volver a Reportes
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-blue-50 p-4 rounded-lg text-center">
              <h3 className="font-semibold text-blue-900">Paquetes Procesados</h3>
              <p className="text-3xl font-bold text-blue-600">1,247</p>
              <p className="text-sm text-blue-600">Este mes</p>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg text-center">
              <h3 className="font-semibold text-green-900">Ingresos Generados</h3>
              <p className="text-3xl font-bold text-green-600">$45,280</p>
              <p className="text-sm text-green-600">Este mes</p>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg text-center">
              <h3 className="font-semibold text-purple-900">Eficiencia</h3>
              <p className="text-3xl font-bold text-purple-600">94.2%</p>
              <p className="text-sm text-purple-600">Entregas a tiempo</p>
            </div>
          </div>
          
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-4">Análisis Detallado</h3>
            <p className="text-gray-700 mb-4">
              Este reporte muestra el rendimiento detallado del sistema de courier durante el período seleccionado.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <NavigationProvider>
      <AppContent />
    </NavigationProvider>
  );
}

function AppContent() {
  const { currentPage, navigate } = useNavigation();

  console.log('📱 App renderizado con página:', currentPage); // Debug log

  const renderPage = () => {
    console.log('🔍 Renderizando página:', currentPage); // Debug log
    
    switch (currentPage) {
      case 'dashboard':
        return <DashboardPage />;
      case 'packages':
        return <PackagesPage />;
      case 'clients':
        return <ClientsPage />;
      case 'couriers':
        return <CouriersPage />;
      case 'reports':
        return <ReportsPage />;
      case 'billing':
        return <BillingPage />;
      case 'tracking':
        return <TrackingPage />;
      case 'notifications':
        return <NotificationsPage />;
      case 'settings':
        return <SettingsPage />;
      case 'warehouse':
        return <WarehouseModule />;
      
      // Páginas de detalle
      case 'client-detail':
        return <ClientDetailPage />;
      case 'client-edit':
        return <ClientEditPage />;
      case 'package-detail':
        return <PackageDetailPage />;
      
      // Páginas de creación
      case 'client-create':
        return <NewClientPage />;
      case 'package-create':
        return <NewPackagePage />;
      case 'courier-create':
        return <NewCourierPage />;
      case 'invoice-create':
        return <NewInvoicePage />;
      
      // Páginas de edición
      case 'package-edit':
        return <EditPackagePage />;
      case 'package-tracking':
        return <PackageTrackingPage />;
      
      // Páginas adicionales
      case 'invoice-detail':
        return <InvoiceDetailPage />;
      case 'reports-detail':
        return <ReportsDetailPage />;
      
      default:
        console.log('⚠️ Página no encontrada:', currentPage, '- Redirigiendo a Dashboard');
        return <DashboardPage />;
    }
  };

  return (
    <div className="App">
      <MainLayout currentPage={currentPage} onNavigate={navigate}>
        {renderPage()}
      </MainLayout>
    </div>
  );
}

export default App;