// src/modules/billing/pages/BillingDetailPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigation } from '../../../contexts/NavigationContext';
import Badge from '../../../components/ui/Badge';
import Button from '../../../components/ui/Button';
import Modal from '../../../components/ui/Modal';
import { 
  ArrowLeft, 
  DollarSign, 
  FileText, 
  Calendar,
  User,
  Package,
  CreditCard,
  Download,
  Send,
  Eye,
  Edit3,
  Trash2,
  CheckCircle,
  AlertTriangle,
  Clock,
  Receipt,
  PlusCircle,
  MinusCircle,
  Calculator,
  Building,
  Phone,
  Mail,
  MapPin,
  Printer
} from 'lucide-react';

interface BillingDetail {
  id: string;
  invoiceNumber: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  client: {
    id: string;
    name: string;
    company: string;
    email: string;
    phone: string;
    address: string;
    taxId: string;
  };
  dates: {
    created: string;
    issued: string;
    due: string;
    paid?: string;
  };
  items: Array<{
    id: string;
    type: 'package' | 'service' | 'extra';
    description: string;
    trackingNumber?: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }>;
  summary: {
    subtotal: number;
    tax: number;
    taxRate: number;
    discount: number;
    total: number;
    paid: number;
    balance: number;
  };
  payments: Array<{
    id: string;
    date: string;
    method: 'cash' | 'card' | 'transfer' | 'check';
    amount: number;
    reference: string;
    notes?: string;
  }>;
  notes: string;
  terms: string;
}

const BillingDetailPage: React.FC = () => {
  const navigate = (path: string) => {
  window.location.hash = path;
  window.location.reload();
};
  const billingId = getParam('id');
  
  const [billingData, setBillingData] = useState<BillingDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'details' | 'payments' | 'history'>('details');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSendModal, setShowSendModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [newPayment, setNewPayment] = useState({
    amount: '',
    method: 'cash' as const,
    reference: '',
    notes: ''
  });

  // Datos simulados mejorados
  useEffect(() => {
    const loadBillingData = () => {
      setLoading(true);
      
      setTimeout(() => {
        const mockData: BillingDetail = {
          id: billingId || 'INV001',
          invoiceNumber: `INV-2025-${Math.random().toString().substr(2, 6)}`,
          status: ['draft', 'sent', 'paid', 'overdue'][Math.floor(Math.random() * 4)] as any,
          client: {
            id: 'CLI001',
            name: 'María González',
            company: 'Tech Solutions Corp',
            email: 'mgonzalez@techsolutions.com',
            phone: '+1 (305) 555-0123',
            address: '123 Biscayne Blvd, Miami, FL 33132',
            taxId: 'US-123456789'
          },
          dates: {
            created: '2025-06-10',
            issued: '2025-06-12',
            due: '2025-06-27',
            paid: Math.random() > 0.5 ? '2025-06-15' : undefined
          },
          items: [
            {
              id: 'ITEM001',
              type: 'package',
              description: 'Envío Express - Electrónicos',
              trackingNumber: 'ITB12345678',
              quantity: 1,
              unitPrice: 45.00,
              total: 45.00
            },
            {
              id: 'ITEM002',
              type: 'package',
              description: 'Envío Estándar - Documentos',
              trackingNumber: 'ITB12345679',
              quantity: 2,
              unitPrice: 25.00,
              total: 50.00
            },
            {
              id: 'ITEM003',
              type: 'service',
              description: 'Seguro de carga',
              quantity: 1,
              unitPrice: 15.00,
              total: 15.00
            },
            {
              id: 'ITEM004',
              type: 'extra',
              description: 'Recolección en domicilio',
              quantity: 1,
              unitPrice: 10.00,
              total: 10.00
            }
          ],
          summary: {
            subtotal: 120.00,
            tax: 10.80,
            taxRate: 9.0,
            discount: 5.00,
            total: 125.80,
            paid: Math.random() > 0.5 ? 125.80 : Math.random() * 125.80,
            balance: 0
          },
          payments: [
            {
              id: 'PAY001',
              date: '2025-06-15',
              method: 'card',
              amount: 125.80,
              reference: 'CARD-****1234',
              notes: 'Pago completo con tarjeta de crédito'
            }
          ],
          notes: 'Gracias por su preferencia. Todos los servicios incluyen seguro básico.',
          terms: 'Pago a 15 días. Recargo del 2% mensual por pagos atrasados.'
        };

        // Calcular balance
        mockData.summary.balance = mockData.summary.total - mockData.summary.paid;
        
        setBillingData(mockData);
        setLoading(false);
      }, 1000);
    };

    loadBillingData();
  }, [billingId]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'overdue': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'sent': return <Clock className="w-4 h-4 text-blue-500" />;
      case 'draft': return <FileText className="w-4 h-4 text-gray-500" />;
      case 'cancelled': return <MinusCircle className="w-4 h-4 text-red-500" />;
      default: return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      case 'sent': return 'bg-blue-100 text-blue-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getItemTypeIcon = (type: string) => {
    switch (type) {
      case 'package': return <Package className="w-4 h-4 text-blue-500" />;
      case 'service': return <FileText className="w-4 h-4 text-green-500" />;
      case 'extra': return <PlusCircle className="w-4 h-4 text-purple-500" />;
      default: return <Receipt className="w-4 h-4 text-gray-500" />;
    }
  };

  const handleDelete = () => {
    setShowDeleteModal(false);
    console.log('Eliminando factura:', billingId);
    navigate('billing');
  };

  const handleSendInvoice = () => {
    setShowSendModal(false);
    if (billingData) {
      const subject = `Factura ${billingData.invoiceNumber} - ITOBOX Courier`;
      const body = `Estimado/a ${billingData.client.name},\n\nAdjuntamos la factura ${billingData.invoiceNumber} por un total de $${billingData.summary.total}.\n\nVence el: ${billingData.dates.due}\n\nSaludos,\nEquipo ITOBOX Courier`;
      const mailtoUrl = `mailto:${billingData.client.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      window.open(mailtoUrl);
    }
  };

  const handleAddPayment = () => {
    if (!billingData || !newPayment.amount) return;
    
    const payment = {
      id: `PAY${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      method: newPayment.method,
      amount: parseFloat(newPayment.amount),
      reference: newPayment.reference || `${newPayment.method.toUpperCase()}-${Date.now()}`,
      notes: newPayment.notes
    };

    const updatedData = {
      ...billingData,
      payments: [...billingData.payments, payment],
      summary: {
        ...billingData.summary,
        paid: billingData.summary.paid + payment.amount,
        balance: billingData.summary.total - (billingData.summary.paid + payment.amount)
      }
    };

    setBillingData(updatedData);
    setShowPaymentModal(false);
    setNewPayment({ amount: '', method: 'cash', reference: '', notes: '' });
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="p-6 lg:p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="h-40 bg-gray-200 rounded-lg"></div>
              <div className="h-60 bg-gray-200 rounded-lg"></div>
            </div>
            <div className="space-y-6">
              <div className="h-32 bg-gray-200 rounded-lg"></div>
              <div className="h-48 bg-gray-200 rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!billingData) {
    return (
      <div className="p-6 lg:p-8">
        <div className="text-center py-12">
          <FileText className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Factura no encontrada</h3>
          <p className="mt-1 text-sm text-gray-500">La factura solicitada no existe o ha sido eliminada.</p>
          <div className="mt-6">
            <Button onClick={() => navigate('billing')} variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver a Facturación
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate('billing')}
            className="hover:bg-gray-100"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {billingData.invoiceNumber}
            </h1>
            <p className="text-sm text-gray-500">
              Cliente: {billingData.client.company}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <Badge className={getStatusColor(billingData.status)}>
            {getStatusIcon(billingData.status)}
            <span className="ml-1 capitalize">
              {billingData.status}
            </span>
          </Badge>
          
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={handlePrint}>
              <Printer className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => setShowSendModal(true)}>
              <Send className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => navigate('billing-edit', { id: billingId! })}>
              <Edit3 className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => setShowDeleteModal(true)} className="text-red-600 hover:text-red-700">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Invoice Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <DollarSign className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total</p>
              <p className="text-2xl font-bold text-gray-900">${billingData.summary.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Pagado</p>
              <p className="text-2xl font-bold text-gray-900">${billingData.summary.paid}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Saldo</p>
              <p className="text-2xl font-bold text-gray-900">${billingData.summary.balance}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Calendar className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Vence</p>
              <p className="text-2xl font-bold text-gray-900">{billingData.dates.due}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {['details', 'payments', 'history'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`py-2 px-1 border-b-2 font-medium text-sm capitalize ${
                activeTab === tab
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab === 'details' && <Eye className="inline mr-2 h-4 w-4" />}
              {tab === 'payments' && <CreditCard className="inline mr-2 h-4 w-4" />}
              {tab === 'history' && <FileText className="inline mr-2 h-4 w-4" />}
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {activeTab === 'details' && (
            <>
              {/* Client Info */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <Building className="mr-2 h-5 w-5" />
                  Información del Cliente
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Empresa</label>
                    <p className="mt-1 text-sm text-gray-900">{billingData.client.company}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Contacto</label>
                    <p className="mt-1 text-sm text-gray-900">{billingData.client.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Email</label>
                    <p className="mt-1 text-sm text-gray-900 flex items-center">
                      <Mail className="mr-1 h-4 w-4" />
                      {billingData.client.email}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Teléfono</label>
                    <p className="mt-1 text-sm text-gray-900 flex items-center">
                      <Phone className="mr-1 h-4 w-4" />
                      {billingData.client.phone}
                    </p>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-500">Dirección</label>
                    <p className="mt-1 text-sm text-gray-900 flex items-start">
                      <MapPin className="mr-1 h-4 w-4 mt-0.5" />
                      {billingData.client.address}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Tax ID</label>
                    <p className="mt-1 text-sm text-gray-900">{billingData.client.taxId}</p>
                  </div>
                </div>
              </div>

              {/* Invoice Items */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <Receipt className="mr-2 h-5 w-5" />
                  Elementos de la Factura
                </h3>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Descripción
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Cantidad
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Precio Unit.
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Total
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {billingData.items.map((item) => (
                        <tr key={item.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              {getItemTypeIcon(item.type)}
                              <div className="ml-3">
                                <div className="text-sm font-medium text-gray-900">
                                  {item.description}
                                </div>
                                {item.trackingNumber && (
                                  <div className="text-sm text-gray-500">
                                    Tracking: {item.trackingNumber}
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {item.quantity}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ${item.unitPrice.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            ${item.total.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Summary */}
                <div className="mt-6 border-t pt-6">
                  <div className="flex justify-end">
                    <div className="w-full max-w-sm space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Subtotal:</span>
                        <span className="text-gray-900">${billingData.summary.subtotal.toFixed(2)}</span>
                      </div>
                      
                      {billingData.summary.discount > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Descuento:</span>
                          <span className="text-red-600">-${billingData.summary.discount.toFixed(2)}</span>
                        </div>
                      )}
                      
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Impuesto ({billingData.summary.taxRate}%):</span>
                        <span className="text-gray-900">${billingData.summary.tax.toFixed(2)}</span>
                      </div>
                      
                      <div className="border-t pt-2 flex justify-between font-medium text-base">
                        <span className="text-gray-900">Total:</span>
                        <span className="text-gray-900">${billingData.summary.total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notes and Terms */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Notas</h3>
                  <p className="text-sm text-gray-700">{billingData.notes}</p>
                </div>
                
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Términos y Condiciones</h3>
                  <p className="text-sm text-gray-700">{billingData.terms}</p>
                </div>
              </div>
            </>
          )}

          {activeTab === 'payments' && (
            <div className="space-y-6">
              {/* Payment Summary */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900 flex items-center">
                    <CreditCard className="mr-2 h-5 w-5" />
                    Historial de Pagos
                  </h3>
                  {billingData.summary.balance > 0 && (
                    <Button onClick={() => setShowPaymentModal(true)}>
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Registrar Pago
                    </Button>
                  )}
                </div>
                
                <div className="space-y-4">
                  {billingData.payments.length > 0 ? (
                    billingData.payments.map((payment) => (
                      <div key={payment.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3">
                              <Badge className="bg-green-100 text-green-800">
                                {payment.method.toUpperCase()}
                              </Badge>
                              <span className="text-sm font-medium text-gray-900">
                                ${payment.amount.toFixed(2)}
                              </span>
                              <span className="text-sm text-gray-500">{payment.date}</span>
                            </div>
                            <p className="mt-1 text-sm text-gray-500">
                              Referencia: {payment.reference}
                            </p>
                            {payment.notes && (
                              <p className="mt-1 text-sm text-gray-500">{payment.notes}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <CreditCard className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900">Sin pagos registrados</h3>
                      <p className="mt-1 text-sm text-gray-500">No hay pagos registrados para esta factura.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Payment Status */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <Calculator className="mr-2 h-5 w-5" />
                  Estado del Pago
                </h3>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Total de la Factura:</span>
                    <span className="text-lg font-medium text-gray-900">${billingData.summary.total.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Total Pagado:</span>
                    <span className="text-lg font-medium text-green-600">${billingData.summary.paid.toFixed(2)}</span>
                  </div>
                  
                  <div className="border-t pt-4 flex justify-between items-center">
                    <span className="text-base font-medium text-gray-900">Saldo Pendiente:</span>
                    <span className={`text-xl font-bold ${billingData.summary.balance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                      ${billingData.summary.balance.toFixed(2)}
                    </span>
                  </div>
                  
                  {billingData.summary.balance > 0 && (
                    <div className="mt-4 p-4 bg-orange-50 rounded-lg">
                      <div className="flex">
                        <AlertTriangle className="h-5 w-5 text-orange-400" />
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-orange-800">
                            Pago Pendiente
                          </h3>
                          <div className="mt-2 text-sm text-orange-700">
                            <p>
                              Esta factura tiene un saldo pendiente de ${billingData.summary.balance.toFixed(2)}.
                              Vence el {billingData.dates.due}.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-6 flex items-center">
                <FileText className="mr-2 h-5 w-5" />
                Historial de la Factura
              </h3>
              
              <div className="flow-root">
                <ul className="-mb-8">
                  <li>
                    <div className="relative pb-8">
                      <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
                      <div className="relative flex space-x-3">
                        <div>
                          <span className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center ring-8 ring-white">
                            <FileText className="h-5 w-5 text-white" />
                          </span>
                        </div>
                        <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                          <div>
                            <p className="text-sm text-gray-500">
                              <span className="font-medium text-gray-900">Factura creada</span>
                            </p>
                            <p className="mt-1 text-sm text-gray-500">Factura generada en el sistema</p>
                          </div>
                          <div className="text-right text-sm whitespace-nowrap text-gray-500">
                            <time>{billingData.dates.created}</time>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                  
                  <li>
                    <div className="relative pb-8">
                      <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
                      <div className="relative flex space-x-3">
                        <div>
                          <span className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center ring-8 ring-white">
                            <Send className="h-5 w-5 text-white" />
                          </span>
                        </div>
                        <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                          <div>
                            <p className="text-sm text-gray-500">
                              <span className="font-medium text-gray-900">Factura enviada</span>
                            </p>
                            <p className="mt-1 text-sm text-gray-500">Enviada por email al cliente</p>
                          </div>
                          <div className="text-right text-sm whitespace-nowrap text-gray-500">
                            <time>{billingData.dates.issued}</time>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                  
                  {billingData.dates.paid && (
                    <li>
                      <div className="relative">
                        <div className="relative flex space-x-3">
                          <div>
                            <span className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center ring-8 ring-white">
                              <CheckCircle className="h-5 w-5 text-white" />
                            </span>
                          </div>
                          <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                            <div>
                              <p className="text-sm text-gray-500">
                                <span className="font-medium text-gray-900">Pago completado</span>
                              </p>
                              <p className="mt-1 text-sm text-gray-500">Factura pagada completamente</p>
                            </div>
                            <div className="text-right text-sm whitespace-nowrap text-gray-500">
                              <time>{billingData.dates.paid}</time>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Acciones Rápidas</h3>
            
            <div className="space-y-3">
              <Button className="w-full justify-start" onClick={() => setShowSendModal(true)}>
                <Send className="mr-2 h-4 w-4" />
                Enviar por Email
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={handlePrint}>
                <Printer className="mr-2 h-4 w-4" />
                Imprimir Factura
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => navigate('billing-edit', { id: billingId! })}>
                <Edit3 className="mr-2 h-4 w-4" />
                Editar Factura
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Download className="mr-2 h-4 w-4" />
                Descargar PDF
              </Button>
              {billingData.summary.balance > 0 && (
                <Button variant="outline" className="w-full justify-start" onClick={() => setShowPaymentModal(true)}>
                  <CreditCard className="mr-2 h-4 w-4" />
                  Registrar Pago
                </Button>
              )}
            </div>
          </div>

          {/* Invoice Details */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <FileText className="mr-2 h-5 w-5" />
              Detalles de la Factura
            </h3>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-500">Número de Factura</label>
                <p className="mt-1 text-sm text-gray-900">{billingData.invoiceNumber}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Fecha de Creación</label>
                <p className="mt-1 text-sm text-gray-900">{billingData.dates.created}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Fecha de Emisión</label>
                <p className="mt-1 text-sm text-gray-900">{billingData.dates.issued}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Fecha de Vencimiento</label>
                <p className="mt-1 text-sm text-gray-900">{billingData.dates.due}</p>
              </div>
              {billingData.dates.paid && (
                <div>
                  <label className="block text-sm font-medium text-gray-500">Fecha de Pago</label>
                  <p className="mt-1 text-sm text-gray-900">{billingData.dates.paid}</p>
                </div>
              )}
            </div>
          </div>

          {/* Client Quick Info */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <User className="mr-2 h-5 w-5" />
              Cliente
            </h3>
            
            <div className="space-y-3">
              <div>
                <p className="font-medium text-gray-900">{billingData.client.company}</p>
                <p className="text-sm text-gray-500">{billingData.client.name}</p>
              </div>
              <div className="flex space-x-2">
                <Button size="sm" variant="outline" onClick={() => window.open(`tel:${billingData.client.phone}`)}>
                  <Phone className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline" onClick={() => window.open(`mailto:${billingData.client.email}`)}>
                  <Mail className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline" onClick={() => navigate('client-detail', { id: billingData.client.id })}>
                  <Eye className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Confirmar Eliminación"
        description={`¿Estás seguro de que deseas eliminar la factura ${billingData.invoiceNumber}? Esta acción no se puede deshacer.`}
        actions={
          <div className="flex space-x-3">
            <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Eliminar
            </Button>
          </div>
        }
      />

      {/* Send Invoice Modal */}
      <Modal
        isOpen={showSendModal}
        onClose={() => setShowSendModal(false)}
        title="Enviar Factura"
        description={`¿Deseas enviar la factura ${billingData.invoiceNumber} por email a ${billingData.client.email}?`}
        actions={
          <div className="flex space-x-3">
            <Button variant="outline" onClick={() => setShowSendModal(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSendInvoice}>
              Enviar
            </Button>
          </div>
        }
      />

      {/* Add Payment Modal */}
      <Modal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        title="Registrar Pago"
        description="Registra un nuevo pago para esta factura"
        actions={
          <div className="flex space-x-3">
            <Button variant="outline" onClick={() => setShowPaymentModal(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAddPayment} disabled={!newPayment.amount}>
              Registrar Pago
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Monto</label>
            <input
              type="number"
              step="0.01"
              max={billingData.summary.balance}
              value={newPayment.amount}
              onChange={(e) => setNewPayment({ ...newPayment, amount: e.target.value })}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="0.00"
            />
            <p className="mt-1 text-xs text-gray-500">
              Saldo pendiente: ${billingData.summary.balance.toFixed(2)}
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Método de Pago</label>
            <select
              value={newPayment.method}
              onChange={(e) => setNewPayment({ ...newPayment, method: e.target.value as any })}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="cash">Efectivo</option>
              <option value="card">Tarjeta</option>
              <option value="transfer">Transferencia</option>
              <option value="check">Cheque</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Referencia</label>
            <input
              type="text"
              value={newPayment.reference}
              onChange={(e) => setNewPayment({ ...newPayment, reference: e.target.value })}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Número de referencia..."
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Notas (opcional)</label>
            <textarea
              rows={3}
              value={newPayment.notes}
              onChange={(e) => setNewPayment({ ...newPayment, notes: e.target.value })}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Notas adicionales..."
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default BillingDetailPage;
