import React, { useState } from 'react';
import { useNavigation } from '../../../contexts/NavigationContext';
import { 
  DollarSign, 
  FileText, 
  Download, 
  Plus, 
  Eye, 
  Search, 
  Filter,
  Calendar,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  Clock,
  AlertCircle,
  MoreHorizontal
} from 'lucide-react';

interface Invoice {
  id: string;
  number: string;
  client: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
  dueDate: string;
  createdDate: string;
  description: string;
}

const BillingPage: React.FC = () => {
  const { navigate } = useNavigation();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Datos simulados de facturas
  const invoices: Invoice[] = [
    {
      id: 'INV-001',
      number: 'FAC-2024-001',
      client: 'Ana García Morales',
      amount: 450.75,
      status: 'paid',
      dueDate: '2024-06-30',
      createdDate: '2024-06-15',
      description: 'Servicios de courier - Junio 2024'
    },
    {
      id: 'INV-002',
      number: 'FAC-2024-002',
      client: 'Carlos López Rivera',
      amount: 320.50,
      status: 'pending',
      dueDate: '2024-06-25',
      createdDate: '2024-06-18',
      description: 'Envíos express y estándar'
    },
    {
      id: 'INV-003',
      number: 'FAC-2024-003',
      client: 'Roberto Silva Mendez',
      amount: 875.00,
      status: 'overdue',
      dueDate: '2024-06-20',
      createdDate: '2024-06-10',
      description: 'Servicios corporativos - Mayo 2024'
    },
    {
      id: 'INV-004',
      number: 'FAC-2024-004',
      client: 'María Rodríguez Castro',
      amount: 125.25,
      status: 'paid',
      dueDate: '2024-07-05',
      createdDate: '2024-06-20',
      description: 'Envíos personales'
    },
    {
      id: 'INV-005',
      number: 'FAC-2024-005',
      client: 'Laura Monge Vargas',
      amount: 680.90,
      status: 'pending',
      dueDate: '2024-06-28',
      createdDate: '2024-06-22',
      description: 'Envíos para boutique'
    }
  ];

  const getStatusInfo = (status: string) => {
    const statusMap = {
      paid: { label: 'Pagada', color: 'bg-green-100 text-green-800', icon: CheckCircle },
      pending: { label: 'Pendiente', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      overdue: { label: 'Vencida', color: 'bg-red-100 text-red-800', icon: AlertCircle }
    };
    return statusMap[status as keyof typeof statusMap] || statusMap.pending;
  };

  // Filtros
  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = 
      invoice.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Estadísticas
  const stats = {
    total: invoices.reduce((sum, inv) => sum + inv.amount, 0),
    paid: invoices.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + inv.amount, 0),
    pending: invoices.filter(inv => inv.status === 'pending').reduce((sum, inv) => sum + inv.amount, 0),
    overdue: invoices.filter(inv => inv.status === 'overdue').reduce((sum, inv) => sum + inv.amount, 0)
  };

  const handleDownload = (invoiceId: string) => {
    console.log(`Descargando factura ${invoiceId}`);
    
    // Crear contenido del PDF simulado
    const pdfContent = `FACTURA ${invoiceId}\n\nFecha: ${new Date().toLocaleDateString()}\nCliente: Ana García Morales\nMonto: $450.75\n\nGracias por su preferencia.`;
    
    // Crear blob y descarga
    const blob = new Blob([pdfContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `factura-${invoiceId}-${Date.now()}.txt`;
    
    // Agregar al DOM, hacer clic y remover
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Limpiar URL
    window.URL.revokeObjectURL(url);
    
    console.log(`✅ Factura ${invoiceId} descargada exitosamente`);
  };

  const handleMoreActions = (invoiceId: string, action: string) => {
    switch (action) {
      case 'duplicate':
        console.log(`Duplicar factura ${invoiceId}`);
        break;
      case 'send':
        console.log(`Enviar factura ${invoiceId} por email`);
        break;
      case 'mark-paid':
        console.log(`Marcar factura ${invoiceId} como pagada`);
        break;
      case 'reminder':
        console.log(`Enviar recordatorio factura ${invoiceId}`);
        break;
      case 'cancel':
        console.log(`Cancelar factura ${invoiceId}`);
        break;
      case 'edit':
        console.log(`Editar factura ${invoiceId}`);
        break;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Facturación</h1>
          <p className="text-gray-600 mt-1">
            Administra facturas, pagos y estados financieros
          </p>
        </div>
        
        <button
          onClick={() => navigate('invoice-create')}
          className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-3 rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          <Plus className="w-5 h-5" />
          <span className="font-medium">Nueva Factura</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Facturado</p>
              <p className="text-3xl font-bold text-gray-900">${stats.total.toLocaleString()}</p>
              <div className="flex items-center space-x-1 text-green-600 mt-1">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm font-medium">+12.5%</span>
              </div>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pagadas</p>
              <p className="text-3xl font-bold text-green-600">${stats.paid.toLocaleString()}</p>
              <div className="flex items-center space-x-1 text-green-600 mt-1">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm font-medium">+8.2%</span>
              </div>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pendientes</p>
              <p className="text-3xl font-bold text-yellow-600">${stats.pending.toLocaleString()}</p>
              <div className="flex items-center space-x-1 text-yellow-600 mt-1">
                <Clock className="w-4 h-4" />
                <span className="text-sm font-medium">+5.1%</span>
              </div>
            </div>
            <div className="bg-yellow-100 p-3 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Vencidas</p>
              <p className="text-3xl font-bold text-red-600">${stats.overdue.toLocaleString()}</p>
              <div className="flex items-center space-x-1 text-red-600 mt-1">
                <TrendingDown className="w-4 h-4" />
                <span className="text-sm font-medium">-2.3%</span>
              </div>
            </div>
            <div className="bg-red-100 p-3 rounded-lg">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filtros y búsqueda */}
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Búsqueda */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar por número, cliente o descripción..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          
          {/* Filtro por estado */}
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="all">Todos los estados</option>
              <option value="paid">Pagadas</option>
              <option value="pending">Pendientes</option>
              <option value="overdue">Vencidas</option>
            </select>
          </div>
        </div>
      </div>

      {/* Lista de facturas */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Factura
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Monto
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vencimiento
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredInvoices.map((invoice) => {
                const statusInfo = getStatusInfo(invoice.status);
                const StatusIcon = statusInfo.icon;
                
                return (
                  <tr key={invoice.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {invoice.number}
                        </div>
                        <div className="text-sm text-gray-500">
                          {invoice.createdDate}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {invoice.client}
                        </div>
                        <div className="text-sm text-gray-500">
                          {invoice.description}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-gray-900">
                        ${invoice.amount.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.color}`}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {statusInfo.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-900">{invoice.dueDate}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => navigate('invoice-detail', { id: invoice.id })}
                          className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          Ver
                        </button>
                        <button
                          onClick={() => handleDownload(invoice.id)}
                          className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                        >
                          <Download className="w-4 h-4 mr-1" />
                          Descargar
                        </button>
                        
                        {/* Dropdown de más acciones */}
                        <div className="relative group">
                          <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors">
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                          
                          {/* Dropdown menu */}
                          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                            <div className="py-1">
                              <button
                                onClick={() => handleMoreActions(invoice.id, 'duplicate')}
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                              >
                                Duplicar factura
                              </button>
                              <button
                                onClick={() => handleMoreActions(invoice.id, 'send')}
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                              >
                                Enviar por email
                              </button>
                              <button
                                onClick={() => handleMoreActions(invoice.id, 'mark-paid')}
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                              >
                                Marcar como pagada
                              </button>
                              <button
                                onClick={() => handleMoreActions(invoice.id, 'reminder')}
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                              >
                                Enviar recordatorio
                              </button>
                              <button
                                onClick={() => handleMoreActions(invoice.id, 'edit')}
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                              >
                                Editar factura
                              </button>
                              <button
                                onClick={() => handleMoreActions(invoice.id, 'cancel')}
                                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                              >
                                Cancelar
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        {filteredInvoices.length === 0 && (
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No se encontraron facturas</h3>
            <p className="mt-1 text-sm text-gray-500">
              Intenta ajustar los filtros de búsqueda.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BillingPage;