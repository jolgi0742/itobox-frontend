import React, { useState } from 'react';
import { BarChart3, TrendingUp, Calendar, Download, Filter, DollarSign, Package, Users, Truck } from 'lucide-react';

const ReportsPage: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('30days');
  const [selectedReport, setSelectedReport] = useState('overview');

  // Data para gráficos
  const salesData = [
    { month: 'Enero', revenue: 25400, packages: 156 },
    { month: 'Febrero', revenue: 28900, packages: 189 },
    { month: 'Marzo', revenue: 32100, packages: 203 },
    { month: 'Abril', revenue: 29800, packages: 178 },
    { month: 'Mayo', revenue: 35600, packages: 234 },
    { month: 'Junio', revenue: 41200, packages: 267 }
  ];

  const deliveryStats = {
    onTime: 94.5,
    delayed: 4.2,
    failed: 1.3
  };

  const topRoutes = [
    { route: 'Miami → Orlando', packages: 145, revenue: 18750 },
    { route: 'Tampa → Jacksonville', packages: 98, revenue: 12340 },
    { route: 'Key West → Miami', packages: 76, revenue: 9800 },
    { route: 'Fort Lauderdale → Tampa', packages: 65, revenue: 8200 },
    { route: 'Pensacola → Tallahassee', packages: 45, revenue: 5600 }
  ];

  const courierPerformance = [
    { name: 'Carlos Rodríguez', deliveries: 234, rating: 4.9, revenue: 15600 },
    { name: 'Ana María López', deliveries: 198, rating: 4.8, revenue: 13200 },
    { name: 'Roberto Fernández', deliveries: 176, rating: 4.7, revenue: 11800 },
    { name: 'Elena Martínez', deliveries: 167, rating: 4.8, revenue: 10900 },
    { name: 'José Luis García', deliveries: 134, rating: 4.6, revenue: 9400 }
  ];

  const renderChart = (data: any[], type: 'revenue' | 'packages') => {
    const maxValue = Math.max(...data.map(item => type === 'revenue' ? item.revenue : item.packages));
    
    return (
      <div className="space-y-3">
        {data.map((item, index) => (
          <div key={index} className="space-y-2">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium">
                {type === 'revenue' ? `$${item.revenue.toLocaleString()}` : `${item.packages} paquetes`}
              </span>
              <span className="text-xs text-gray-500">
                {((item.revenue || item.packages) / maxValue * 100).toFixed(0)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${type === 'revenue' ? 'bg-green-500' : 'bg-blue-500'}`}
                style={{ width: `${(item.revenue || item.packages) / maxValue * 100}%` }}
              ></div>
            </div>
            <div className="text-xs text-gray-600 font-medium">{item.month}</div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="p-6 lg:p-8 -mt-20">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
        <div className="flex items-center space-x-3 mb-4 lg:mb-0">
          <BarChart3 className="w-8 h-8 text-gray-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Reportes y Analytics</h1>
            <p className="text-gray-600">Análisis detallado del rendimiento del negocio</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-gray-400" />
            <select 
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="7days">Últimos 7 días</option>
              <option value="30days">Últimos 30 días</option>
              <option value="90days">Últimos 90 días</option>
              <option value="year">Este año</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select 
              value={selectedReport}
              onChange={(e) => setSelectedReport(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="overview">Vista General</option>
              <option value="financial">Financiero</option>
              <option value="operational">Operacional</option>
              <option value="performance">Rendimiento</option>
            </select>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Ingresos Totales</p>
              <p className="text-2xl font-bold text-green-600">$193,000</p>
              <p className="text-xs text-green-600 mt-1">↗ +12.5% vs mes anterior</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Paquetes</p>
              <p className="text-2xl font-bold text-blue-600">1,267</p>
              <p className="text-xs text-blue-600 mt-1">↗ +8.3% vs mes anterior</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Clientes Activos</p>
              <p className="text-2xl font-bold text-purple-600">89</p>
              <p className="text-xs text-purple-600 mt-1">↗ +15.2% vs mes anterior</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tasa de Entrega</p>
              <p className="text-2xl font-bold text-orange-600">94.5%</p>
              <p className="text-xs text-orange-600 mt-1">↗ +2.1% vs mes anterior</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
              <Truck className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Revenue Chart */}
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Ingresos por Mes</h3>
            <div className="flex items-center space-x-2">
              <DollarSign className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium text-green-600">Total: $193,000</span>
            </div>
          </div>
          {renderChart(salesData, 'revenue')}
        </div>

        {/* Packages Chart */}
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Paquetes por Mes</h3>
            <div className="flex items-center space-x-2">
              <Package className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-blue-600">Total: 1,267</span>
            </div>
          </div>
          {renderChart(salesData, 'packages')}
        </div>
      </div>

      {/* Performance and Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Delivery Performance */}
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Rendimiento de Entregas</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">A Tiempo</span>
                <span className="text-sm font-medium text-green-600">{deliveryStats.onTime}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-green-500 h-3 rounded-full" 
                  style={{ width: `${deliveryStats.onTime}%` }}
                ></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Retrasadas</span>
                <span className="text-sm font-medium text-yellow-600">{deliveryStats.delayed}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-yellow-500 h-3 rounded-full" 
                  style={{ width: `${deliveryStats.delayed}%` }}
                ></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Fallidas</span>
                <span className="text-sm font-medium text-red-600">{deliveryStats.failed}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-red-500 h-3 rounded-full" 
                  style={{ width: `${deliveryStats.failed}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-green-50 rounded-lg">
            <p className="text-sm text-green-800 font-medium">Excelente rendimiento</p>
            <p className="text-xs text-green-600 mt-1">94.5% de entregas a tiempo este mes</p>
          </div>
        </div>

        {/* Top Routes */}
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Rutas Principales</h3>
          <div className="space-y-4">
            {topRoutes.map((route, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-900">{route.route}</p>
                  <p className="text-xs text-gray-600">{route.packages} paquetes</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-green-600">${route.revenue.toLocaleString()}</p>
                  <p className="text-xs text-gray-600">ingresos</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Courier Performance */}
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Top Couriers</h3>
          <div className="space-y-4">
            {courierPerformance.map((courier, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{courier.name}</p>
                  <div className="flex items-center space-x-4 text-xs text-gray-600">
                    <span>{courier.deliveries} entregas</span>
                    <span>★ {courier.rating}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-green-600">${courier.revenue.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Additional Insights */}
      <div className="mt-8 bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Insights y Recomendaciones</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              <h4 className="font-medium text-blue-900">Crecimiento Sostenido</h4>
            </div>
            <p className="text-sm text-blue-800">
              Los ingresos han crecido consistentemente un 12.5% mensual. 
              Considera expandir la flota para satisfacer la demanda creciente.
            </p>
          </div>

          <div className="p-4 bg-green-50 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Package className="w-5 h-5 text-green-600" />
              <h4 className="font-medium text-green-900">Eficiencia Operativa</h4>
            </div>
            <p className="text-sm text-green-800">
              La tasa de entrega a tiempo del 94.5% está por encima del promedio de la industria (90%). 
              Excelente trabajo del equipo.
            </p>
          </div>

          <div className="p-4 bg-orange-50 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Users className="w-5 h-5 text-orange-600" />
              <h4 className="font-medium text-orange-900">Retención de Clientes</h4>
            </div>
            <p className="text-sm text-orange-800">
              La ruta Miami-Orlando genera el mayor volumen. 
              Considera ofertas especiales para clientes frecuentes en esta ruta.
            </p>
          </div>
        </div>
      </div>

      {/* Export Options */}
      <div className="mt-8 bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Opciones de Exportación</h3>
        <div className="flex flex-wrap gap-4">
          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Download className="w-4 h-4" />
            <span>Reporte PDF</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Download className="w-4 h-4" />
            <span>Datos Excel</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Download className="w-4 h-4" />
            <span>CSV Raw Data</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Calendar className="w-4 h-4" />
            <span>Programar Reporte</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;