// src/modules/billing/pages/BillingDetailPage.tsx - FIXED
import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft,
  Download,
  Send,
  Edit,
  Trash2,
  Calendar,
  User,
  Building,
  Phone,
  Mail,
  MapPin,
  DollarSign,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  Package,
  Truck,
  CreditCard,
  Eye,
  Share2,
  Printer
} from 'lucide-react';

// Interfaces
interface BillingDetail {
  id: string;
  invoiceNumber: string;
  clientId: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  clientAddress: string;
  amount: number;
  subtotal: number;
  tax: number;
  discount: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  issueDate: string;
  dueDate: string;
  paidDate?: string;
  description: string;
  notes?: string;
  services: BillingService[];
  paymentMethod?: string;
  referenceNumber?: string;
}

interface BillingService {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
  type: 'shipping' | 'handling' | 'insurance' | 'storage' | 'other';
}

interface PaymentRecord {
  id: string;
  amount: number;
  date: string;
  method: string;
  reference: string;
  status: 'completed' | 'pending' | 'failed';
}

const BillingDetailPage: React.FC = () => {
  // Navigation simple
  const navigate = (path: string) => {
    window.location.hash = path;
    window.location.reload();
  };
  
  // Get URL parameters - FIXED
  const getUrlParam = (param: string): string | null => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
  };
  
  const billingId = getUrlParam('id') || '1';
  
  const [billingData, setBillingData] = useState<BillingDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('details');
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Mock payment records
  const [paymentRecords] = useState<PaymentRecord[]>([
    {
      id: '1',
      amount: 1500,
      date: '2024-07-15',
      method: 'Transferencia Bancaria',
      reference: 'TXN-2024-001',
      status: 'completed'
    },
    {
      id: '2',
      amount: 850,
      date: '2024-07-10',
      method: 'Tarjeta de Crédito',
      reference: 'CC-2024-002',
      status: 'completed'
    }
  ]);

  // Simular carga de datos
  useEffect(() => {
    const timer = setTimeout(() => {
      setBillingData({
        id: billingId,
        invoiceNumber: `INV-2024-${billingId.padStart(3, '0')}`,
        clientId: 'client-1',
        clientName: 'Empresa XYZ S.A.',
        clientEmail: 'facturacion@empresaxyz.com',
        clientPhone: '+506 2222-3333',
        clientAddress: 'San José, Costa Rica, 200m norte del parque central',
        amount: 2850,
        subtotal: 2500,
        tax: 350,
        discount: 0,
        status: 'paid',
        issueDate: '2024-07-01',
        dueDate: '2024-07-15',
        paidDate: '2024-07-14',
        description: 'Servicios de courier mes de julio 2024',
        notes: 'Pago realizado mediante transferencia bancaria',
        paymentMethod: 'Transferencia Bancaria',
        referenceNumber: 'TXN-2024-001',
        services: [
          {
            id: '1',
            description: 'Envío Express Nacional',
            quantity: 15,
            unitPrice: 120,
            total: 1800,
            type: 'shipping'
          },
          {
            id: '2',
            description: 'Seguro de paquetes',
            quantity: 10,
            unitPrice: 50,
            total: 500,
            type: 'insurance'
          },
          {
            id: '3',
            description: 'Embalaje especial',
            quantity: 5,
            unitPrice: 40,
            total: 200,
            type: 'handling'
          }
        ]
      });
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [billingId]);

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
      month: 'long',
      day: 'numeric'
    });
  };

  // Status badge component
  const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
    const getStatusConfig = (status: string) => {
      switch (status) {
        case 'paid':
          return { color: 'bg-green-100 text-green-800', icon: CheckCircle, label: 'Pagado' };
        case 'sent':
          return { color: 'bg-blue-100 text-blue-800', icon: Send, label: 'Enviado' };
        case 'draft':
          return { color: 'bg-gray-100 text-gray-800', icon: Edit, label: 'Borrador' };
        case 'overdue':
          return { color: 'bg-red-100 text-red-800', icon: AlertCircle, label: 'Vencido' };
        case 'cancelled':
          return { color: 'bg-red-100 text-red-800', icon: Trash2, label: 'Cancelado' };
        default:
          return { color: 'bg-gray-100 text-gray-800', icon: Clock, label: 'Desconocido' };
      }
    };

    const config = getStatusConfig(status);
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
        <Icon className="w-4 h-4 mr-1" />
        {config.label}
      </span>
    );
  };

  // Service type icon
  const getServiceIcon = (type: string) => {
    switch (type) {
      case 'shipping':
        return <Truck className="w-4 h-4" />;
      case 'handling':
        return <Package className="w-4 h-4" />;
      case 'insurance':
        return <CheckCircle className="w-4 h-4" />;
      case 'storage':
        return <Building className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  // Actions
  const handleDownloadPDF = () => {
    console.log('Downloading PDF for invoice:', billingData?.invoiceNumber);
    // Implementar descarga de PDF
  };

  const handleSendEmail = () => {
    console.log('Sending email for invoice:', billingData?.invoiceNumber);
    // Implementar envío de email
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDelete = () => {
    console.log('Deleting invoice:', billingData?.invoiceNumber);
    setShowDeleteModal(false);
    navigate('/billing');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!billingData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Factura no encontrada</h2>
          <p className="text-gray-600 mb-4">La factura que buscas no existe o ha sido eliminada.</p>
          <button
            onClick={() => navigate('/billing')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Volver a Facturación
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
              onClick={() => navigate('/billing')}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Volver</span>
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {billingData.invoiceNumber}
              </h1>
              <p className="text-gray-600">
                Factura para {billingData.clientName}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <StatusBadge status={billingData.status} />
            <div className="flex space-x-2">
              <button
                onClick={handlePrint}
                className="flex items-center space-x-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Printer className="w-4 h-4" />
                <span>Imprimir</span>
              </button>
              <button
                onClick={handleDownloadPDF}
                className="flex items-center space-x-2 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>PDF</span>
              </button>
              <button
                onClick={handleSendEmail}
                className="flex items-center space-x-2 px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
              >
                <Send className="w-4 h-4" />
                <span>Enviar</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column - Invoice Details */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Invoice Info Card */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Company Info */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">De:</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Building className="w-4 h-4 text-gray-400" />
                    <span className="font-medium">ITOBOX Courier</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">San José, Costa Rica</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">+506 2222-0000</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">facturacion@itobox.com</span>
                  </div>
                </div>
              </div>

              {/* Client Info */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Para:</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-gray-400" />
                    <span className="font-medium">{billingData.clientName}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{billingData.clientAddress}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{billingData.clientPhone}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{billingData.clientEmail}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Invoice Dates */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-200">
              <div>
                <p className="text-sm font-medium text-gray-500">Fecha de Emisión</p>
                <p className="text-sm text-gray-900">{formatDate(billingData.issueDate)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Fecha de Vencimiento</p>
                <p className="text-sm text-gray-900">{formatDate(billingData.dueDate)}</p>
              </div>
              {billingData.paidDate && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Fecha de Pago</p>
                  <p className="text-sm text-gray-900">{formatDate(billingData.paidDate)}</p>
                </div>
              )}
            </div>
          </div>

          {/* Services Table */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Servicios</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50/50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Servicio
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cantidad
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Precio Unit.
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {billingData.services.map((service) => (
                    <tr key={service.id}>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-3">
                          <div className="text-gray-400">
                            {getServiceIcon(service.type)}
                          </div>
                          <span className="text-sm font-medium text-gray-900">
                            {service.description}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                        {service.quantity}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(service.unitPrice)}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {formatCurrency(service.total)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Subtotal:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {formatCurrency(billingData.subtotal)}
                  </span>
                </div>
                {billingData.discount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Descuento:</span>
                    <span className="text-sm font-medium text-red-600">
                      -{formatCurrency(billingData.discount)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Impuestos (IVA):</span>
                  <span className="text-sm font-medium text-gray-900">
                    {formatCurrency(billingData.tax)}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-gray-200">
                  <span className="text-lg font-semibold text-gray-900">Total:</span>
                  <span className="text-lg font-bold text-blue-600">
                    {formatCurrency(billingData.amount)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment History */}
          {billingData.status === 'paid' && paymentRecords.length > 0 && (
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Historial de Pagos</h3>
              <div className="space-y-3">
                {paymentRecords.map((payment) => (
                  <div key={payment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {payment.method}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatDate(payment.date)} • {payment.reference}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-green-600">
                        {formatCurrency(payment.amount)}
                      </p>
                      <p className="text-xs text-gray-500 capitalize">
                        {payment.status}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          {billingData.notes && (
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Notas</h3>
              <p className="text-gray-600">{billingData.notes}</p>
            </div>
          )}
        </div>

        {/* Right Column - Actions & Summary */}
        <div className="space-y-6">
          
          {/* Quick Actions */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Acciones</h3>
            <div className="space-y-3">
              <button
                onClick={() => setShowEditModal(true)}
                className="w-full flex items-center space-x-3 px-4 py-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <Edit className="w-4 h-4" />
                <span>Editar Factura</span>
              </button>
              
              <button
                onClick={() => navigate(`/billing/duplicate/${billingId}`)}
                className="w-full flex items-center space-x-3 px-4 py-3 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <FileText className="w-4 h-4" />
                <span>Duplicar</span>
              </button>
              
              <button
                onClick={() => navigate(`/billing/client/${billingData.clientId}`)}
                className="w-full flex items-center space-x-3 px-4 py-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
              >
                <User className="w-4 h-4" />
                <span>Ver Cliente</span>
              </button>
              
              <button
                onClick={() => setShowDeleteModal(true)}
                className="w-full flex items-center space-x-3 px-4 py-3 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span>Eliminar</span>
              </button>
            </div>
          </div>

          {/* Payment Summary */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumen de Pago</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Estado:</span>
                <StatusBadge status={billingData.status} />
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Monto Total:</span>
                <span className="text-lg font-bold text-gray-900">
                  {formatCurrency(billingData.amount)}
                </span>
              </div>
              
              {billingData.paymentMethod && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Método de Pago:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {billingData.paymentMethod}
                  </span>
                </div>
              )}
              
              {billingData.referenceNumber && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Referencia:</span>
                  <span className="text-sm font-mono text-gray-900">
                    {billingData.referenceNumber}
                  </span>
                </div>
              )}
            </div>

            {billingData.status === 'sent' && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <button className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                  <CreditCard className="w-4 h-4" />
                  <span>Registrar Pago</span>
                </button>
              </div>
            )}
          </div>

          {/* Related Links */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Enlaces Relacionados</h3>
            <div className="space-y-2">
              <button
                onClick={() => navigate(`/clients/${billingData.clientId}`)}
                className="w-full text-left px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                Ver perfil del cliente
              </button>
              <button
                onClick={() => navigate(`/billing/client/${billingData.clientId}/history`)}
                className="w-full text-left px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                Historial de facturación
              </button>
              <button
                onClick={() => navigate('/billing/reports')}
                className="w-full text-left px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                Reportes de facturación
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Eliminar Factura</h3>
            </div>
            <p className="text-gray-600 mb-6">
              ¿Estás seguro de que quieres eliminar la factura {billingData.invoiceNumber}? 
              Esta acción no se puede deshacer.
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

export default BillingDetailPage;
