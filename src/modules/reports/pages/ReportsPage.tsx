import React, { useState } from 'react';
import { useNavigation } from '../../../contexts/NavigationContext';
import { 
  BarChart3, 
  TrendingUp, 
  Download, 
  FileText, 
  Calendar,
  Package,
  Users,
  DollarSign,
  Truck,
  Eye,
  Filter,
  RefreshCw
} from 'lucide-react';

const ReportsPage: React.FC = () => {
  const { navigate } = useNavigation();
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedReport, setSelectedReport] = useState('general');

  // Datos simulados para reportes
  const generalStats = {
    packagesDelivered: 1247,
    activeClients: 89,
    totalRevenue: 45280,
    avgDeliveryTime: 2.4,
    customerSatisfaction: 4.7
  };

  const monthlyData = [
    { month: 'Ene', packages: 980, revenue: 38400, clients: 78 },
    { month: 'Feb', packages: 1120, revenue: 41200, clients: 82 },
    { month: 'Mar', packages: 1050, revenue: 39800, clients: 79 },
    { month: 'Abr', packages: 1180, revenue: 43600, clients: 85 },
    { month: 'May', packages: 1340, revenue: 48200, clients: 91 },
    { month: 'Jun', packages: 1247, revenue: 45280, clients: 89 }
  ];

  const courierPerformance = [
    { name: 'Carlos Mendoza', deliveries: 156, rating: 4.9, efficiency: 98 },
    { name: 'Ana Pérez', deliveries: 143, rating: 4.8, efficiency: 96 },
    { name: 'Luis García', deliveries: 128, rating: 4.7, efficiency: 94 },
    { name: 'María López', deliveries: 119, rating: 4.6, efficiency: 92 },
    { name: 'Diego Vargas', deliveries: 105, rating: 4.5, efficiency: 89 }
  ];

  const topClients = [
    { name: 'Distribuidora Central', packages: 89, revenue: 12400, growth: '+15%' },
    { name: 'TechSolutions CR', packages: 76, revenue: 10800, growth: '+22%' },
    { name: 'Comercial López', packages: 54, revenue: 7650, growth: '+8%' },
    { name: 'Boutique Elegancia', packages: 43, revenue: 6200, growth: '+12%' },
    { name: 'Farmacia Nacional', packages: 38, revenue: 5400, growth: '+5%' }
  ];

  const deliveryRegions = [
    { region: 'San José Centro', packages: 445, percentage: 35.7, color: 'bg-blue-500' },
    { region: 'Cartago', packages: 287, percentage: 23.0, color: 'bg-green-500' },
    { region: 'Heredia', packages: 198, percentage: 15.9, color: 'bg-purple-500' },
    { region: 'Alajuela', packages: 174, percentage: 14.0, color: 'bg-yellow-500' },
    { region: 'Escazú', packages: 143, percentage: 11.5, color: 'bg-red-500' }
  ];

  const handleExportPDF = () => {
    console.log('Exportando reporte en PDF...');
    
    // Crear contenido del reporte
    const reportContent = `REPORTE DE RENDIMIENTO - ${selectedPeriod.toUpperCase()}

Fecha de generación: ${new Date().toLocaleDateString()}

ESTADÍSTICAS GENERALES:
- Paquetes entregados: ${generalStats.packagesDelivered}
- Clientes activos: ${generalStats.activeClients}
- Ingresos totales: ${generalStats.totalRevenue}
- Tiempo promedio entrega: ${generalStats.avgDeliveryTime} días
- Satisfacción del cliente: ${generalStats.customerSatisfaction}/5

TOP COURIERS:
${courierPerformance.map((courier, index) => 
  `${index + 1}. ${courier.name} - ${courier.deliveries} entregas - Rating: ${courier.rating}`
).join('\n')}

PRINCIPALES CLIENTES:
${topClients.map((client, index) => 
  `${index + 1}. ${client.name} - ${client.packages} paquetes - ${client.revenue}`
).join('\n')}

Generado por ITOBOX Courier System`;
    
    // Crear blob y descarga
    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `reporte-${selectedReport}-${selectedPeriod}-${Date.now()}.txt`;
    
    // Ejecutar descarga
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    console.log('✅ Reporte PDF descargado exitosamente');
  };

  const handleExportExcel = () => {
    console.log('Exportando reporte en Excel...');
    
    // Crear contenido CSV (simulando Excel)
    const csvContent = `Tipo,Nombre,Valor,Porcentaje
Estadísticas,Paquetes Entregados,${generalStats.packagesDelivered},
Estadísticas,Clientes Activos,${generalStats.activeClients},
Estadísticas,Ingresos Totales,${generalStats.totalRevenue},
Estadísticas,Tiempo Promedio,${generalStats.avgDeliveryTime} días,
Estadísticas,Satisfacción,${generalStats.customerSatisfaction}/5,

Couriers,Nombre,Entregas,Rating
${courierPerformance.map(courier => 
  `Courier,${courier.name},${courier.deliveries},${courier.rating}`
).join('\n')}

Clientes,Nombre,Paquetes,Ingresos
${topClients.map(client => 
  `Cliente,${client.name},${client.packages},${client.revenue}`
).join('\n')}`;
    
    // Crear blob CSV y descarga
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `reporte-${selectedReport}-${selectedPeriod}-${Date.now()}.csv`;
    
    // Ejecutar descarga
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    console.log('✅ Reporte Excel (CSV) descargado exitosamente');
  };

  const handleViewDetailed = (reportType: string) => {
    console.log(`Navegando a reporte detallado: ${reportType}`);
    navigate('reports-detail', { type: reportType });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reportes y Analytics</h1>
          <p className="text-gray-600 mt-1">
            Análisis detallado del rendimiento y métricas del negocio
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={handleExportPDF}
            className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            <FileText className="w-4 h-4" />
            <span>Exportar PDF</span>
          </button>
          <button
            onClick={handleExportExcel}
            className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Exportar Excel</span>
          </button>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <span className="text-sm font-medium text-gray-700">Período:</span>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="week">Esta semana</option>
              <option value="month">Este mes</option>
              <option value="quarter">Este trimestre</option>
              <option value="year">Este año</option>
            </select>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">Tipo de reporte:</span>
            <select
              value={selectedReport}
              onChange={(e) => setSelectedReport(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="general">Reporte general</option>
              <option value="packages">Análisis de paquetes</option>
              <option value="financial">Reporte financiero</option>
              <option value="couriers">Rendimiento de couriers</option>
              <option value="clients">Análisis de clientes</option>
            </select>
          </div>
          
          <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <RefreshCw className="w-4 h-4" />
            <span>Actualizar</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Paquetes Entregados</p>
              <p className="text-3xl font-bold">{generalStats.packagesDelivered.toLocaleString()}</p>
              <div className="flex items-center space-x-1 mt-2">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm">+12.5%</span>
              </div>
            </div>
            <Package className="w-8 h-8 text-blue-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Clientes Activos</p>
              <p className="text-3xl font-bold">{generalStats.activeClients}</p>
              <div className="flex items-center space-x-1 mt-2">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm">+8.2%</span>
              </div>
            </div>
            <Users className="w-8 h-8 text-green-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">Ingresos Totales</p>
              <p className="text-3xl font-bold">${generalStats.totalRevenue.toLocaleString()}</p>
              <div className="flex items-center space-x-1 mt-2">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm">+15.3%</span>
              </div>
            </div>
            <DollarSign className="w-8 h-8 text-purple-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100 text-sm font-medium">Tiempo Promedio</p>
              <p className="text-3xl font-bold">{generalStats.avgDeliveryTime} días</p>
              <div className="flex items-center space-x-1 mt-2">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm">-0.3 días</span>
              </div>
            </div>
            <Truck className="w-8 h-8 text-yellow-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-pink-500 to-red-500 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-pink-100 text-sm font-medium">Satisfacción</p>
              <p className="text-3xl font-bold">{generalStats.customerSatisfaction}/5</p>
              <div className="flex items-center space-x-1 mt-2">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm">+0.2</span>
              </div>
            </div>
            <BarChart3 className="w-8 h-8 text-pink-200" />
          </div>
        </div>
      </div>

      {/* Gráficos y datos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Rendimiento Mensual */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Rendimiento Mensual</h3>
            <button 
              onClick={() => handleViewDetailed('monthly')}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              Ver detalle
            </button>
          </div>
          
          <div className="space-y-4">
            {monthlyData.map((data, index) => (
              <div key={data.month} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 w-12">{data.month}</span>
                <div className="flex-1 mx-4">
                  <div className="bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${(data.packages / 1400) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-gray-900">{data.packages}</div>
                  <div className="text-xs text-gray-500">${data.revenue.toLocaleString()}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Couriers */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Top Couriers</h3>
            <button 
              onClick={() => handleViewDetailed('couriers')}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              Ver todos
            </button>
          </div>
          
          <div className="space-y-4">
            {courierPerformance.map((courier, index) => (
              <div key={courier.name} className="flex items-center space-x-4">
                <span className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-bold rounded-full flex items-center justify-center">
                  {index + 1}
                </span>
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900">{courier.name}</div>
                  <div className="text-xs text-gray-500">{courier.deliveries} entregas</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-gray-900">★ {courier.rating}</div>
                  <div className="text-xs text-gray-500">{courier.efficiency}% eficiencia</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Clientes */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Principales Clientes</h3>
            <button 
              onClick={() => handleViewDetailed('clients')}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              Ver ranking completo
            </button>
          </div>
          
          <div className="space-y-4">
            {topClients.map((client, index) => (
              <div key={client.name} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="w-6 h-6 bg-green-100 text-green-600 text-xs font-bold rounded-full flex items-center justify-center">
                    {index + 1}
                  </span>
                  <div>
                    <div className="text-sm font-medium text-gray-900">{client.name}</div>
                    <div className="text-xs text-gray-500">{client.packages} paquetes</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-gray-900">${client.revenue.toLocaleString()}</div>
                  <div className="text-xs text-green-600">{client.growth}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Distribución por Regiones */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Distribución por Regiones</h3>
            <button 
              onClick={() => handleViewDetailed('regions')}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              Ver mapa
            </button>
          </div>
          
          <div className="space-y-4">
            {deliveryRegions.map((region) => (
              <div key={region.region} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">{region.region}</span>
                  <span className="text-sm text-gray-500">{region.packages} ({region.percentage}%)</span>
                </div>
                <div className="bg-gray-200 rounded-full h-2">
                  <div 
                    className={`${region.color} h-2 rounded-full transition-all duration-500`}
                    style={{ width: `${region.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;