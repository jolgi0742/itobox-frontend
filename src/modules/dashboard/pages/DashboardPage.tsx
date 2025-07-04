import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Users, Truck, DollarSign, TrendingUp, TrendingDown, Plus } from 'lucide-react';

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="p-6 lg:p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Bienvenido al sistema ITOBOX Courier - Resumen de actividad y métricas clave</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Paquetes Totales */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-white/20 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <Package className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="ml-4">
              <div className="flex items-center">
                <p className="text-2xl font-bold text-gray-900">2,543</p>
                <div className="ml-2 flex items-center text-sm text-green-600">
                  <TrendingUp className="h-4 w-4" />
                  <span className="ml-1">12.5%</span>
                </div>
              </div>
              <p className="text-sm text-gray-600">Paquetes Totales</p>
            </div>
          </div>
        </div>

        {/* Clientes Activos */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-white/20 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                <Users className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="ml-4">
              <div className="flex items-center">
                <p className="text-2xl font-bold text-gray-900">847</p>
                <div className="ml-2 flex items-center text-sm text-green-600">
                  <TrendingUp className="h-4 w-4" />
                  <span className="ml-1">8.2%</span>
                </div>
              </div>
              <p className="text-sm text-gray-600">Clientes Activos</p>
            </div>
          </div>
        </div>

        {/* Couriers */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-white/20 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Truck className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="ml-4">
              <div className="flex items-center">
                <p className="text-2xl font-bold text-gray-900">24</p>
                <div className="ml-2 flex items-center text-sm text-green-600">
                  <TrendingUp className="h-4 w-4" />
                  <span className="ml-1">+2</span>
                </div>
              </div>
              <p className="text-sm text-gray-600">Couriers Activos</p>
            </div>
          </div>
        </div>

        {/* Ingresos del Mes */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-white/20 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="ml-4">
              <div className="flex items-center">
                <p className="text-2xl font-bold text-gray-900">$45,280</p>
                <div className="ml-2 flex items-center text-sm text-red-600">
                  <TrendingDown className="h-4 w-4" />
                  <span className="ml-1">3.1%</span>
                </div>
              </div>
              <p className="text-sm text-gray-600">Ingresos del Mes</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Estado de Entregas Hoy */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-white/20">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Estado de Entregas Hoy</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                  <span className="text-sm font-medium text-gray-700">Entregados</span>
                </div>
                <span className="text-lg font-bold text-green-600">87</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                  <span className="text-sm font-medium text-gray-700">En tránsito</span>
                </div>
                <span className="text-lg font-bold text-blue-600">45</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full mr-3"></div>
                  <span className="text-sm font-medium text-gray-700">Pendientes</span>
                </div>
                <span className="text-lg font-bold text-yellow-600">23</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-red-500 rounded-full mr-3"></div>
                  <span className="text-sm font-medium text-gray-700">Con retraso</span>
                </div>
                <span className="text-lg font-bold text-red-600">8</span>
              </div>
            </div>
          </div>

          {/* Actividad Reciente */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-white/20">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Actividad Reciente</h3>
              <button className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors">
                Ver todas
              </button>
            </div>
            <div className="space-y-4">
              <div className="flex items-start space-x-4 p-4 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Package className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">
                    <span className="font-medium">WHR-2025-001</span> creado exitosamente
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Hace 5 minutos • Warehouse USA</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4 p-4 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Users className="h-5 w-5 text-green-600" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">
                    Nuevo cliente registrado: <span className="font-medium">Industrial CR</span>
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Hace 15 minutos • Sistema</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4 p-4 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <Truck className="h-5 w-5 text-purple-600" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">
                    Courier <span className="font-medium">Carlos Mendoza</span> inició ruta matutina
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Hace 1 hora • Operaciones</p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-4 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                    <Package className="h-5 w-5 text-orange-600" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">
                    Paquete <span className="font-medium">#PKG-2025-048</span> entregado
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Hace 2 horas • Ana Pérez</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          
          {/* Top Couriers del Mes */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-white/20">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Top Couriers del Mes</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="flex-shrink-0">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm">
                    CM
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900">Carlos Mendoza</p>
                  <p className="text-xs text-gray-500">47 entregas este mes</p>
                </div>
                <div className="flex items-center text-sm text-yellow-500">
                  <span className="mr-1">★</span>
                  <span className="font-medium">4.9</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="flex-shrink-0">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center text-white font-bold text-sm">
                    AP
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900">Ana Pérez</p>
                  <p className="text-xs text-gray-500">43 entregas este mes</p>
                </div>
                <div className="flex items-center text-sm text-yellow-500">
                  <span className="mr-1">★</span>
                  <span className="font-medium">4.8</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="flex-shrink-0">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-r from-purple-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                    LG
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900">Luis García</p>
                  <p className="text-xs text-gray-500">39 entregas este mes</p>
                </div>
                <div className="flex items-center text-sm text-yellow-500">
                  <span className="mr-1">★</span>
                  <span className="font-medium">4.7</span>
                </div>
              </div>
            </div>
          </div>

          {/* Acciones Rápidas */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-white/20">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Acciones Rápidas</h3>
            <div className="space-y-3">
              <button 
                onClick={() => navigate('/packages')}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <Plus className="h-4 w-4 mr-2" />
                Crear Paquete
              </button>
              
              <button 
                onClick={() => navigate('/clients')}
                className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Cliente
              </button>
              
              <button 
                onClick={() => navigate('/couriers')}
                className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <Plus className="h-4 w-4 mr-2" />
                Agregar Courier
              </button>
              
              <button 
                onClick={() => navigate('/warehouse')}
                className="w-full bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                🏠 Warehouse USA
              </button>
            </div>
          </div>

          {/* Métricas Warehouse */}
          <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl shadow-lg p-6 border border-orange-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-orange-900">🏠 WAREHOUSE-USA</h3>
              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
                ACTIVO
              </span>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-orange-800">WHRs Activos:</span>
                <span className="font-bold text-orange-900">0</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-orange-800">Clasificados AWB:</span>
                <span className="font-bold text-orange-900">0</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-orange-800">Clasificados BL:</span>
                <span className="font-bold text-orange-900">0</span>
              </div>
              <div className="pt-2 border-t border-orange-300">
                <button 
                  onClick={() => navigate('/warehouse')}
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Ir a Warehouse
                </button>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-white/20">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Resumen Rápido</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <span className="text-sm font-medium text-blue-900">Entregas Hoy</span>
                <span className="text-lg font-bold text-blue-600">87</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <span className="text-sm font-medium text-green-900">Satisfacción</span>
                <span className="text-lg font-bold text-green-600">98.5%</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <span className="text-sm font-medium text-purple-900">Tiempo Promedio</span>
                <span className="text-lg font-bold text-purple-600">24h</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <span className="text-sm font-medium text-yellow-900">Ingresos Hoy</span>
                <span className="text-lg font-bold text-yellow-600">$2,340</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section - Sistema Status */}
      <div className="mt-8">
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold mb-2">🚀 Sistema ITOBOX Courier</h3>
              <p className="text-indigo-100">
                Sistema courier profesional con módulo WAREHOUSE-USA completamente operativo
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">100%</div>
              <div className="text-indigo-200 text-sm">Operativo</div>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-lg font-semibold">✅ Frontend</div>
              <div className="text-indigo-200 text-sm">React + TypeScript</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold">✅ Backend</div>
              <div className="text-indigo-200 text-sm">Node.js + Express</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold">✅ APIs</div>
              <div className="text-indigo-200 text-sm">REST Funcionales</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold">✅ Warehouse</div>
              <div className="text-indigo-200 text-sm">USA Compliance</div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-6 text-center text-sm text-gray-500">
        <p>ITOBOX Courier System v2.0 - Última actualización: Junio 2025</p>
      </div>
    </div>
  );
};

export default DashboardPage;