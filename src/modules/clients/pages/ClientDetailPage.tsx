// src/modules/clients/pages/ClientDetailPage.tsx - FIXED
import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft,
  Edit,
  Trash2,
  Phone,
  Mail,
  MapPin,
  Building,
  User,
  Calendar,
  Package,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Star,
  FileText,
  Send,
  Plus,
  Filter,
  Search,
  Download,
  Eye
} from 'lucide-react';

// Interfaces
interface ClientDetail {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  company: string;
  contactPerson: string;
  registrationDate: string;
  status: 'active' | 'inactive' | 'suspended';
  creditLimit: number;
  currentBalance: number;
  totalOrders: number;
  totalSpent: number;
  averageOrderValue: number;
  lastOrderDate: string;
  preferredServices: string[];
  notes: string;
}

interface ClientOrder {
  id: string;
  orderNumber: string;
  date: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  amount: number;
  services: string[];
  trackingNumber?: string;
}

interface ClientInvoice {
  id: string;
  invoiceNumber: string;
  date: string;
  dueDate: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
  description: string;
}

const ClientDetailPage: React.FC = () => {
  // Navigation and URL params - FIXED
  const navigate = (path: string) => {
    window.location.hash = path;
    window.location.reload();
  };
  
  const getUrlParam = (param: string): string | null => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
  };
  
  const clientId = getUrlParam('id') || '1';
  
  const [clientData, setClientData] = useState<ClientDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Mock data
  const [orders] = useState<ClientOrder[]>([
    {
      id: '1',
      orderNumber: 'ORD-2024-001',
      date: '2024-07-15',
      status: 'delivered',
      amount: 850,
      services: ['Express Shipping'],
      trackingNumber: 'ITB2407150001'
    },
    {
      id: '2',
      orderNumber: 'ORD-2024-002',
      date: '2024-07-10',
      status: 'shipped',
      amount: 1200,
      services: ['Standard Shipping', 'Insurance'],
      trackingNumber: 'ITB2407100002'
    },
    {
      id: '3',
      orderNumber: 'ORD-2024-003',
      date: '2024-07-05',
      status: 'processing',
      amount: 650,
      services: ['Economy Shipping']
    }
  ]);

  const [invoices] = useState<ClientInvoice[]>([
    {
      id: '1',
      invoiceNumber: 'INV-2024-001',
      date: '2024-07-15',
      dueDate: '2024-07-30',
      amount: 850,
      status: 'paid',
      description: 'Servicios de courier julio'
    },
    {
      id: '2',
      invoiceNumber: 'INV-2024-002',
      date: '2024-07-10',
      dueDate: '2024-07-25',
      amount: 1200,
      status: 'pending',
      description: 'Envíos múltiples'
    }
  ]);

  // Simular carga de datos
  useEffect(() => {
    const timer = setTimeout(() => {
      setClientData({
        id: clientId,
        name: 'Empresa XYZ S.A.',
        email: 'contacto@empresaxyz.com',
        phone: '+506 2222-3333',
        address: 'San José, Costa Rica, 200m norte del parque central',
        company: 'Empresa XYZ S.A.',
        contactPerson: 'Juan Pérez',
        registrationDate: '2024-01-15',
        status: 'active',
        creditLimit: 5000,
        currentBalance: 1200,
        totalOrders: 45,
        totalSpent: 15750,
        averageOrderValue: 350,
        lastOrderDate: '2024-07-15',
        preferredServices: ['Express Shipping', 'Insurance'],
        notes: 'Cliente preferencial con descuento del 10% en servicios express'
      });
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [clientId]);

  // Formatear moneda
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CR', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  // Formatear fecha
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-CR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Status badge component
  const StatusBadge: React.FC<{ status: string; type?: 'client' | 'order' | 'invoice' }> = ({ status, type = 'client' }) => {
    const getStatusConfig = (status: string, type: string) => {
      if (type === 'client') {
        switch (status) {
          case 'active':
            return { color: 'bg-green-100 text-green-800', icon: CheckCircle, label: 'Activo' };
          case 'inactive':
            return { color: 'bg-gray-100 text-gray-800', icon: Clock, label: 'Inactivo' };
          case 'suspended':
            return { color: 'bg-red-100 text-red-800', icon: AlertCircle, label: 'Suspendido' };
          default:
            return { color: 'bg-gray-100 text-gray-800', icon: Clock, label: 'Desconocido' };
        }
      } else if (type === 'order') {
        switch (status) {
          case 'delivered':
            return { color: 'bg-green-100 text-green-800', icon: CheckCircle, label: 'Entregado' };
          case 'shipped':
            return { color: 'bg-blue-100 text-blue-800', icon: Package, label: 'Enviado' };
          case 'processing':
            return { color: 'bg-yellow-100 text-yellow-800', icon: Clock, label: 'Procesando' };
          case 'pending':
            return { color: 'bg-gray-100 text-gray-800', icon: Clock, label: 'Pendiente' };
          case 'cancelled':
            return { color: 'bg-red-100 text-red-800', icon: AlertCircle, label: 'Cancelado' };
          default:
            return { color: 'bg-gray-100 text-gray-800', icon: Clock, label: 'Desconocido' };
        }
      } else { // invoice
        switch (status) {
          case 'paid':
            return { color: 'bg-green-100 text-green-800', icon: CheckCircle, label: 'Pagado' };
          case 'pending':
            return { color: 'bg-yellow-100 text-yellow-800', icon: Clock, label: 'Pendiente' };
          case 'overdue':
            return { color: 'bg-red-100 text-red-800', icon: AlertCircle, label: 'Vencido' };
          default:
            return { color: 'bg-gray-100 text-gray-800', icon: Clock, label: 'Desconocido' };
        }
      }
    };

    const config = getStatusConfig(status, type);
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="w-3 h-3 mr-1" />
        {config.label}
      </span>
    );
  };

  // Actions
  const handleEdit = () => {
    setShowEditModal(true);
  };

  const handleDelete = () => {
    console.log('Deleting client:', clientData?.name);
    setShowDeleteModal(false);
    navigate('/clients');
  };

  const handleSendEmail = () => {
    console.log('Sending email to:', clientData?.email);
  };

  const handleCreateOrder = () => {
    navigate(`/orders/create?clientId=${clientId}`);
  };

  const handleCreateInvoice = () => {
    navigate(`/billing/create?clientId=${clientId}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!clientData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Cliente no encontrado</h2>
          <p className="text-gray-600 mb-4">El cliente que buscas no existe o ha sido eliminado.</p>
          <button
            onClick={() => navigate('/clients')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Volver a Clientes
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/clients')}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Volver</span>
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {clientData.name}
              </h1>
              <p className="text-gray-600">
                Cliente desde {formatDate(clientData.registrationDate)}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <StatusBadge status={clientData.status} type="client" />
            <div className="flex space-x-2">
              <button
                onClick={handleSendEmail}
                className="flex items-center space-x-2 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
              >
                <Send className="w-4 h-4" />
                <span>Email</span>
              </button>
              <button
                onClick={handleEdit}
                className="flex items-center space-x-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Edit className="w-4 h-4" />
                <span>Editar</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Gastado</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(clientData.totalSpent)}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Órdenes</p>
              <p className="text-2xl font-bold text-gray-900">{clientData.totalOrders}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Promedio por Orden</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(clientData.averageOrderValue)}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Balance Actual</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(clientData.currentBalance)}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column - Client Info & Tabs */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Client Info Card */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Información del Cliente</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Building className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Empresa</p>
                    <p className="font-medium text-gray-900">{clientData.company}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <User className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Persona de Contacto</p>
                    <p className="font-medium text-gray-900">{clientData.contactPerson}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium text-gray-900">{clientData.email}</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Teléfono</p>
                    <p className="font-medium text-gray-900">{clientData.phone}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Dirección</p>
                    <p className="font-medium text-gray-900">{clientData.address}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Último Pedido</p>
                    <p className="font-medium text-gray-900">{formatDate(clientData.lastOrderDate)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Preferred Services */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-sm font-medium text-gray-500 mb-2">Servicios Preferidos</p>
              <div className="flex flex-wrap gap-2">
                {clientData.preferredServices.map((service, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                  >
                    {service}
                  </span>
                ))}
              </div>
            </div>

            {/* Notes */}
            {clientData.notes && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-sm font-medium text-gray-500 mb-2">Notas</p>
                <p className="text-gray-700">{clientData.notes}</p>
              </div>
            )}
          </div>

          {/* Tabs */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/20 shadow-lg">
            <div className="border-b border-gray-200/50">
              <nav className="flex space-x-8 px-6">
                {[
                  { id: 'orders', label: 'Órdenes', icon: Package, count: orders.length },
                  { id: 'invoices', label: 'Facturas', icon: FileText, count: invoices.length },
                  { id: 'analytics', label: 'Analytics', icon: TrendingUp },
                ].map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                        activeTab === tab.id
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{tab.label}</span>
                      {tab.count && (
                        <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">
                          {tab.count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {activeTab === 'orders' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="text-lg font-semibold text-gray-900">Órdenes Recientes</h4>
                    <button
                      onClick={handleCreateOrder}
                      className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Nueva Orden</span>
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    {orders.map((order) => (
                      <div key={order.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div>
                              <p className="font-medium text-gray-900">{order.orderNumber}</p>
                              <p className="text-sm text-gray-500">{formatDate(order.date)}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">{order.services.join(', ')}</p>
                              {order.trackingNumber && (
                                <p className="text-xs text-blue-600 font-mono">{order.trackingNumber}</p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <p className="font-bold text-gray-900">{formatCurrency(order.amount)}</p>
                            <StatusBadge status={order.status} type="order" />
                            <button
                              onClick={() => navigate(`/orders/${order.id}`)}
                              className="text-blue-600 hover:text-blue-800 transition-colors"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'invoices' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="text-lg font-semibold text-gray-900">Facturas</h4>
                    <button
                      onClick={handleCreateInvoice}
                      className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Nueva Factura</span>
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    {invoices.map((invoice) => (
                      <div key={invoice.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-900">{invoice.invoiceNumber}</p>
                            <p className="text-sm text-gray-500">{invoice.description}</p>
                            <p className="text-xs text-gray-400">
                              Emitida: {formatDate(invoice.date)} • Vence: {formatDate(invoice.dueDate)}
                            </p>
                          </div>
                          <div className="flex items-center space-x-3">
                            <p className="font-bold text-gray-900">{formatCurrency(invoice.amount)}</p>
                            <StatusBadge status={invoice.status} type="invoice" />
                            <button
                              onClick={() => navigate(`/billing/invoice/${invoice.id}`)}
                              className="text-blue-600 hover:text-blue-800 transition-colors"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'analytics' && (
                <div className="text-center py-12">
                  <TrendingUp className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-gray-900 mb-2">
                    Analytics del Cliente
                  </h4>
                  <p className="text-gray-500 mb-4">
                    Análisis detallado del comportamiento y métricas del cliente
                  </p>
                  <button
                    onClick={() => navigate(`/analytics/client/${clientId}`)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Ver Analytics Completo
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Actions & Credit Info */}
        <div className="space-y-6">
          
          {/* Quick Actions */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Acciones Rápidas</h3>
            <div className="space-y-3">
              <button
                onClick={handleCreateOrder}
                className="w-full flex items-center space-x-3 px-4 py-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Nueva Orden</span>
              </button>
              
              <button
                onClick={handleCreateInvoice}
                className="w-full flex items-center space-x-3 px-4 py-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
              >
                <FileText className="w-4 h-4" />
                <span>Nueva Factura</span>
              </button>
              
              <button
                onClick={handleSendEmail}
                className="w-full flex items-center space-x-3 px-4 py-3 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors"
              >
                <Send className="w-4 h-4" />
                <span>Enviar Email</span>
              </button>
              
              <button
                onClick={() => navigate(`/analytics/client/${clientId}`)}
                className="w-full flex items-center space-x-3 px-4 py-3 bg-yellow-50 text-yellow-700 rounded-lg hover:bg-yellow-100 transition-colors"
              >
                <TrendingUp className="w-4 h-4" />
                <span>Ver Analytics</span>
              </button>
            </div>
          </div>

          {/* Credit Information */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Información Crediticia</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Límite de Crédito:</span>
                <span className="font-bold text-gray-900">
                  {formatCurrency(clientData.creditLimit)}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Balance Actual:</span>
                <span className="font-bold text-gray-900">
                  {formatCurrency(clientData.currentBalance)}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Crédito Disponible:</span>
                <span className="font-bold text-green-600">
                  {formatCurrency(clientData.creditLimit - clientData.currentBalance)}
                </span>
              </div>
              
              {/* Credit Usage Bar */}
              <div className="mt-4">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Uso de Crédito</span>
                  <span>{Math.round((clientData.currentBalance / clientData.creditLimit) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(clientData.currentBalance / clientData.creditLimit) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Client Rating */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Calificación del Cliente</h3>
            <div className="text-center">
              <div className="flex justify-center space-x-1 mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star 
                    key={star}
                    className={`w-6 h-6 ${star <= 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                  />
                ))}
              </div>
              <p className="text-2xl font-bold text-gray-900">4.0</p>
              <p className="text-sm text-gray-500">Basado en {clientData.totalOrders} órdenes</p>
            </div>
            
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Puntualidad de Pago</span>
                <span className="font-medium text-green-600">Excelente</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Frecuencia de Pedidos</span>
                <span className="font-medium text-blue-600">Alta</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Valor Promedio</span>
                <span className="font-medium text-purple-600">Medio-Alto</span>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Actividad Reciente</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div>
                  <p className="text-gray-900">Pago recibido</p>
                  <p className="text-gray-500">Hace 2 días</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 text-sm">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div>
                  <p className="text-gray-900">Nueva orden creada</p>
                  <p className="text-gray-500">Hace 5 días</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 text-sm">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <div>
                  <p className="text-gray-900">Factura enviada</p>
                  <p className="text-gray-500">Hace 1 semana</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 text-sm">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <div>
                  <p className="text-gray-900">Perfil actualizado</p>
                  <p className="text-gray-500">Hace 2 semanas</p>
                </div>
              </div>
            </div>
            
            <button
              onClick={() => navigate(`/clients/${clientId}/activity`)}
              className="w-full mt-4 pt-4 border-t border-gray-200 text-sm text-blue-600 hover:text-blue-800 transition-colors"
            >
              Ver toda la actividad
            </button>
          </div>

          {/* Danger Zone */}
          <div className="bg-red-50/80 backdrop-blur-xl rounded-2xl p-6 border border-red-200/50 shadow-lg">
            <h3 className="text-lg font-semibold text-red-900 mb-4">Zona de Peligro</h3>
            <div className="space-y-3">
              <button
                onClick={() => navigate(`/clients/${clientId}/suspend`)}
                className="w-full flex items-center space-x-3 px-4 py-3 bg-yellow-50 text-yellow-700 rounded-lg hover:bg-yellow-100 transition-colors"
              >
                <AlertCircle className="w-4 h-4" />
                <span>Suspender Cliente</span>
              </button>
              
              <button
                onClick={() => setShowDeleteModal(true)}
                className="w-full flex items-center space-x-3 px-4 py-3 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span>Eliminar Cliente</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Editar Cliente</h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <AlertCircle className="w-6 h-6" />
              </button>
            </div>
            
            <div className="text-center py-8">
              <Edit className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-900 mb-2">
                Formulario de Edición
              </h4>
              <p className="text-gray-500 mb-4">
                Aquí iría el formulario para editar la información del cliente
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => {
                    console.log('Saving client changes');
                    setShowEditModal(false);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Guardar Cambios
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Eliminar Cliente</h3>
            </div>
            <p className="text-gray-600 mb-6">
              ¿Estás seguro de que quieres eliminar a {clientData.name}? 
              Esta acción no se puede deshacer y se perderán todos los datos asociados.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientDetailPage;
