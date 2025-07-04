import React, { useState, useEffect } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell,
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';
import { 
  Plus, 
  Search, 
  Filter, 
  Download,
  Calendar,
  TrendingUp,
  Package,
  DollarSign,
  Users,
  Truck,
  Clock,
  Target,
  FileText,
  BarChart3,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon,
  X
} from 'lucide-react';

interface ReportData {
  id: string;
  name: string;
  type: 'packages' | 'revenue' | 'couriers' | 'clients' | 'performance';
  dateRange: string;
  createdAt: string;
  status: 'completed' | 'processing' | 'failed';
}

const ReportsPage: React.FC = () => {
  const [reports, setReports] = useState<ReportData[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedReportType, setSelectedReportType] = useState('packages');
  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });
  
  // Sample data for charts
  const packagesData = [
    { month: 'Ene', packages: 120, delivered: 115, pending: 5 },
    { month: 'Feb', packages: 150, delivered: 145, pending: 5 },
    { month: 'Mar', packages: 180, delivered: 170, pending: 10 },
    { month: 'Abr', packages: 200, delivered: 185, pending: 15 },
    { month: 'May', packages: 220, delivered: 210, pending: 10 },
    { month: 'Jun', packages: 250, delivered: 240, pending: 10 }
  ];

  const revenueData = [
    { month: 'Ene', revenue: 15000, expenses: 8000, profit: 7000 },
    { month: 'Feb', revenue: 18000, expenses: 9000, profit: 9000 },
    { month: 'Mar', revenue: 22000, expenses: 10000, profit: 12000 },
    { month: 'Abr', revenue: 25000, expenses: 11000, profit: 14000 },
    { month: 'May', revenue: 28000, expenses: 12000, profit: 16000 },
    { month: 'Jun', revenue: 32000, expenses: 13000, profit: 19000 }
  ];

  const performanceData = [
    { courier: 'Carlos R.', deliveries: 125, rating: 4.8, onTime: 95 },
    { courier: 'Ana V.', deliveries: 110, rating: 4.9, onTime: 98 },
    { courier: 'Luis M.', deliveries: 98, rating: 4.7, onTime: 92 },
    { courier: 'Patricia J.', deliveries: 75, rating: 4.6, onTime: 88 }
  ];

  const serviceTypeData = [
    { name: 'Express', value: 40, color: '#8884d8' },
    { name: 'Standard', value: 45, color: '#82ca9d' },
    { name: 'Economy', value: 15, color: '#ffc658' }
  ];

  const clientTypeData = [
    { name: 'Empresas', value: 35, color: '#8884d8' },
    { name: 'Individuales', value: 65, color: '#82ca9d' }
  ];

  useEffect(() => {
    // Simular carga de reportes guardados
    const mockReports: ReportData[] = [
      {
        id: '1',
        name: 'Reporte Mensual de Paquetes',
        type: 'packages',
        dateRange: 'Mayo 2024',
        createdAt: '2024-06-01T10:30:00Z',
        status: 'completed'
      },
      {
        id: '2',
        name: 'Análisis de Ingresos Q2',
        type: 'revenue',
        dateRange: 'Abr-Jun 2024',
        createdAt: '2024-06-15T14:20:00Z',
        status: 'completed'
      },
      {
        id: '3',
        name: 'Performance de Couriers',
        type: 'couriers',
        dateRange: 'Junio 2024',
        createdAt: '2024-06-16T09:15:00Z',
        status: 'processing'
      }
    ];
    setReports(mockReports);
  }, []);

  const handleCreateReport = () => {
    const newReport: ReportData = {
      id: Date.now().toString(),
      name: `Reporte ${selectedReportType} - ${new Date().toLocaleDateString()}`,
      type: selectedReportType as ReportData['type'],
      dateRange: `${dateRange.start} - ${dateRange.end}`,
      createdAt: new Date().toISOString(),
      status: 'processing'
    };

    setReports([newReport, ...reports]);
    setShowCreateModal(false);
    
    // Simular procesamiento
    setTimeout(() => {
      setReports(prev => prev.map(report => 
        report.id === newReport.id 
          ? { ...report, status: 'completed' }
          : report
      ));
    }, 2000);
    
    alert(`✅ Reporte "${newReport.name}" creado y en procesamiento`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'processing': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'packages': return <Package className="w-4 h-4" />;
      case 'revenue': return <DollarSign className="w-4 h-4" />;
      case 'couriers': return <Truck className="w-4 h-4" />;
      case 'clients': return <Users className="w-4 h-4" />;
      case 'performance': return <Target className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reportes y Analytics</h1>
          <p className="text-gray-600 mt-2">Análisis detallado del rendimiento del negocio</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          <Plus className="w-5 h-5" />
          Nuevo Reporte
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Paquetes este mes</p>
              <p className="text-2xl font-bold text-blue-600">250</p>
              <p className="text-xs text-green-600">+12% vs mes anterior</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Ingresos</p>
              <p className="text-2xl font-bold text-green-600">$32,000</p>
              <p className="text-xs text-green-600">+18% vs mes anterior</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tasa de entrega</p>
              <p className="text-2xl font-bold text-purple-600">96%</p>
              <p className="text-xs text-green-600">+2% vs mes anterior</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <Target className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Clientes activos</p>
              <p className="text-2xl font-bold text-orange-600">145</p>
              <p className="text-xs text-green-600">+8% vs mes anterior</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-lg">
              <Users className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Packages Chart */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Tendencia de Paquetes
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={packagesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="delivered" stackId="a" fill="#10b981" name="Entregados" />
              <Bar dataKey="pending" stackId="a" fill="#f59e0b" name="Pendientes" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue Chart */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <LineChartIcon className="w-5 h-5" />
            Análisis de Ingresos
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => [`${value.toLocaleString()}`, '']} />
              <Legend />
              <Area type="monotone" dataKey="revenue" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} name="Ingresos" />
              <Area type="monotone" dataKey="expenses" stackId="2" stroke="#ef4444" fill="#ef4444" fillOpacity={0.6} name="Gastos" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Service Types Pie Chart */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <PieChartIcon className="w-5 h-5" />
            Distribución por Tipo de Servicio
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={serviceTypeData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({name, percent}) => `${name} ${percent ? (percent * 100).toFixed(0) : '0'}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {serviceTypeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Performance Chart */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Performance de Couriers
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={performanceData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="courier" type="category" width={80} />
              <Tooltip />
              <Legend />
              <Bar dataKey="deliveries" fill="#8884d8" name="Entregas" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Reports Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-900">Reportes Generados</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reporte</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Período</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Creado</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {reports.map((report) => (
                <tr key={report.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {getTypeIcon(report.type)}
                      <span className="font-medium text-gray-900">{report.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="capitalize text-gray-600">{report.type}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-gray-600">{report.dateRange}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                      {report.status === 'completed' ? 'Completado' : 
                       report.status === 'processing' ? 'Procesando' : 'Error'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-gray-600">{new Date(report.createdAt).toLocaleDateString()}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => alert(`Descargando reporte: ${report.name}`)}
                        className="text-blue-600 hover:text-blue-800 p-1"
                        title="Descargar"
                        disabled={report.status !== 'completed'}
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => alert(`Ver reporte: ${report.name}`)}
                        className="text-green-600 hover:text-green-800 p-1"
                        title="Ver"
                        disabled={report.status !== 'completed'}
                      >
                        <FileText className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Reports */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Reportes Rápidos</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => alert('Generando reporte de entregas del día...')}
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left"
          >
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-2 rounded-lg">
                <Clock className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Entregas del Día</h4>
                <p className="text-sm text-gray-600">Resumen de entregas de hoy</p>
              </div>
            </div>
          </button>
          
          <button
            onClick={() => alert('Generando reporte de ingresos semanales...')}
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left"
          >
            <div className="flex items-center gap-3">
              <div className="bg-green-100 p-2 rounded-lg">
                <DollarSign className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Ingresos Semanales</h4>
                <p className="text-sm text-gray-600">Resumen financiero de la semana</p>
              </div>
            </div>
          </button>
          
          <button
            onClick={() => alert('Generando ranking de couriers...')}
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left"
          >
            <div className="flex items-center gap-3">
              <div className="bg-purple-100 p-2 rounded-lg">
                <TrendingUp className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Ranking Couriers</h4>
                <p className="text-sm text-gray-600">Top performers del mes</p>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Create Report Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-900">Crear Nuevo Reporte</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Report Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Tipo de Reporte</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    { id: 'packages', label: 'Paquetes', icon: Package, desc: 'Análisis de entregas y estados' },
                    { id: 'revenue', label: 'Ingresos', icon: DollarSign, desc: 'Reporte financiero' },
                    { id: 'couriers', label: 'Couriers', icon: Truck, desc: 'Performance del equipo' },
                    { id: 'clients', label: 'Clientes', icon: Users, desc: 'Análisis de clientes' }
                  ].map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setSelectedReportType(type.id)}
                      className={`p-4 border rounded-lg text-left ${
                        selectedReportType === type.id 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <type.icon className="w-5 h-5 text-gray-600" />
                        <div>
                          <h4 className="font-medium text-gray-900">{type.label}</h4>
                          <p className="text-sm text-gray-600">{type.desc}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Date Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Rango de Fechas</label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Fecha Inicio</label>
                    <input
                      type="date"
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                      value={dateRange.start}
                      onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Fecha Fin</label>
                    <input
                      type="date"
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                      value={dateRange.end}
                      onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              {/* Quick Presets */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Presets Rápidos</label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { label: 'Últimos 7 días', days: 7 },
                    { label: 'Último mes', days: 30 },
                    { label: 'Últimos 3 meses', days: 90 },
                    { label: 'Este año', days: 365 }
                  ].map((preset) => (
                    <button
                      key={preset.label}
                      onClick={() => {
                        const end = new Date().toISOString().split('T')[0];
                        const start = new Date(Date.now() - preset.days * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
                        setDateRange({ start, end });
                      }}
                      className="px-3 py-1 text-sm border border-gray-200 rounded-full hover:bg-gray-50"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4 p-6 border-t">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreateReport}
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700"
              >
                Generar Reporte
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportsPage;