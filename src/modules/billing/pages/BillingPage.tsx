import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  DollarSign,
  Eye, 
  Edit3, 
  Trash2,
  Download,
  Mail,
  CreditCard,
  Calendar,
  FileText,
  AlertTriangle,
  CheckCircle,
  Clock,
  X,
  User,
  Building,
  Package,
  Archive,
  Star,
  Send,
  Printer,
  XCircle
} from 'lucide-react';

interface Invoice {
  id: string;
  invoiceNumber: string;
  clientId: string;
  clientName: string;
  clientEmail: string;
  clientType: 'individual' | 'company';
  amount: number;
  tax: number;
  total: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  priority: 'normal' | 'important';
  issueDate: string;
  dueDate: string;
  paidDate?: string;
  services: {
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }[];
  notes?: string;
  paymentMethod?: string;
  isArchived?: boolean;
}

const BillingPage: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [newInvoice, setNewInvoice] = useState<Partial<Invoice>>({
    clientName: '',
    clientEmail: '',
    clientType: 'individual',
    amount: 0,
    tax: 0,
    services: [{ description: '', quantity: 1, unitPrice: 0, total: 0 }],
    notes: '',
    priority: 'normal'
  });

  useEffect(() => {
    const mockInvoices: Invoice[] = [
      {
        id: '1',
        invoiceNumber: 'INV-2024-001',
        clientId: '1',
        clientName: 'Juan Pérez González',
        clientEmail: 'juan.perez@email.com',
        clientType: 'individual',
        amount: 150.00,
        tax: 22.50,
        total: 172.50,
        status: 'paid',
        priority: 'normal',
        issueDate: '2024-06-01T10:30:00Z',
        dueDate: '2024-06-15T10:30:00Z',
        paidDate: '2024-06-10T14:20:00Z',
        services: [
          { description: 'Entrega Express - 3 paquetes', quantity: 3, unitPrice: 50.00, total: 150.00 }
        ],
        notes: 'Cliente frecuente',
        paymentMethod: 'Transferencia bancaria'
      },
      {
        id: '2',
        invoiceNumber: 'INV-2024-002',
        clientId: '2',
        clientName: 'Empresa ABC S.A.',
        clientEmail: 'maria@empresaabc.com',
        clientType: 'company',
        amount: 500.00,
        tax: 75.00,
        total: 575.00,
        status: 'sent',
        priority: 'important',
        issueDate: '2024-06-10T08:15:00Z',
        dueDate: '2024-06-25T08:15:00Z',
        services: [
          { description: 'Servicios de courier mensual', quantity: 1, unitPrice: 500.00, total: 500.00 }
        ],
        notes: 'Factura mensual - Descuento corporativo aplicado'
      }
    ];
    setInvoices(mockInvoices);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'sent': return 'bg-blue-100 text-blue-800';
      case 'paid': return 'bg-green-100 text-green-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      case 'cancelled': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'draft': return <FileText className="w-4 h-4" />;
      case 'sent': return <Send className="w-4 h-4" />;
      case 'paid': return <CheckCircle className="w-4 h-4" />;
      case 'overdue': return <AlertTriangle className="w-4 h-4" />;
      case 'cancelled': return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const calculateInvoiceTotal = (services: typeof newInvoice.services) => {
    const subtotal = services?.reduce((sum, service) => sum + (service.total || 0), 0) || 0;
    const tax = subtotal * 0.15;
    return { subtotal, tax, total: subtotal + tax };
  };

  const handleCreateInvoice = () => {
    const { subtotal, tax, total } = calculateInvoiceTotal(newInvoice.services);
    const invoiceNumber = `INV-${new Date().getFullYear()}-${String(invoices.length + 1).padStart(3, '0')}`;
    
    const invoiceData: Invoice = {
      id: Date.now().toString(),
      invoiceNumber,
      clientId: Date.now().toString(),
      clientName: newInvoice.clientName!,
      clientEmail: newInvoice.clientEmail!,
      clientType: newInvoice.clientType!,
      amount: subtotal,
      tax,
      total,
      status: 'draft',
      priority: newInvoice.priority!,
      issueDate: new Date().toISOString(),
      dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
      services: newInvoice.services!,
      notes: newInvoice.notes
    };

    setInvoices([invoiceData, ...invoices]);
    setShowCreateModal(false);
    setNewInvoice({
      clientName: '',
      clientEmail: '',
      clientType: 'individual',
      amount: 0,
      tax: 0,
      services: [{ description: '', quantity: 1, unitPrice: 0, total: 0 }],
      notes: '',
      priority: 'normal'
    });
    
    alert(`✅ Factura ${invoiceNumber} creada exitosamente!`);
  };

  const handleInvoiceAction = (action: string, invoice: Invoice) => {
    switch (action) {
      case 'archive':
        setInvoices(prev => prev.map(inv => 
          inv.id === invoice.id ? { ...inv, isArchived: true } : inv
        ));
        alert(`✅ Factura ${invoice.invoiceNumber} archivada`);
        break;
      case 'important':
        setInvoices(prev => prev.map(inv => 
          inv.id === invoice.id ? { ...inv, priority: inv.priority === 'important' ? 'normal' : 'important' } : inv
        ));
        alert(`✅ Prioridad actualizada`);
        break;
      case 'email':
        alert(`📧 Enviando factura por email a ${invoice.clientEmail}`);
        break;
      case 'print':
        alert(`🖨️ Imprimiendo factura ${invoice.invoiceNumber}`);
        break;
      case 'paid':
        setInvoices(prev => prev.map(inv => 
          inv.id === invoice.id ? { 
            ...inv, 
            status: 'paid',
            paidDate: new Date().toISOString(),
            paymentMethod: 'Marcado manualmente'
          } : inv
        ));
        alert(`✅ Factura marcada como pagada`);
        break;
      default:
        alert(`Acción "${action}" ejecutada`);
    }
  };

  const addService = () => {
    setNewInvoice({
      ...newInvoice,
      services: [...(newInvoice.services || []), { description: '', quantity: 1, unitPrice: 0, total: 0 }]
    });
  };

  const updateService = (index: number, field: string, value: any) => {
    const updatedServices = [...(newInvoice.services || [])];
    updatedServices[index] = {
      ...updatedServices[index],
      [field]: value,
      total: field === 'quantity' || field === 'unitPrice' 
        ? (field === 'quantity' ? value : updatedServices[index].quantity) * 
          (field === 'unitPrice' ? value : updatedServices[index].unitPrice)
        : updatedServices[index].total
    };
    setNewInvoice({ ...newInvoice, services: updatedServices });
  };

  const removeService = (index: number) => {
    const updatedServices = newInvoice.services?.filter((_, i) => i !== index) || [];
    setNewInvoice({ ...newInvoice, services: updatedServices });
  };

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.clientName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || invoice.status === filterStatus;
    return matchesSearch && matchesFilter && !invoice.isArchived;
  });

  const totals = filteredInvoices.reduce((acc, invoice) => ({
    totalAmount: acc.totalAmount + invoice.total,
    paidAmount: acc.paidAmount + (invoice.status === 'paid' ? invoice.total : 0),
    pendingAmount: acc.pendingAmount + (invoice.status !== 'paid' && invoice.status !== 'cancelled' ? invoice.total : 0)
  }), { totalAmount: 0, paidAmount: 0, pendingAmount: 0 });

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Facturación</h1>
          <p className="text-gray-600 mt-2">Gestión de facturas y pagos</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          <Plus className="w-5 h-5" />
          Nueva Factura
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Facturas</p>
              <p className="text-2xl font-bold text-gray-900">{filteredInvoices.length}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Facturado</p>
              <p className="text-2xl font-bold text-purple-600">${totals.totalAmount.toLocaleString()}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <DollarSign className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Cobrado</p>
              <p className="text-2xl font-bold text-green-600">${totals.paidAmount.toLocaleString()}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pendiente</p>
              <p className="text-2xl font-bold text-orange-600">${totals.pendingAmount.toLocaleString()}</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-lg">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar por número, cliente o email..."
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="flex gap-4">
            <select
              className="px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">Todos los estados</option>
              <option value="draft">Borrador</option>
              <option value="sent">Enviada</option>
              <option value="paid">Pagada</option>
              <option value="overdue">Vencida</option>
            </select>
            <button
              onClick={() => alert('Generando reporte de facturación...')}
              className="px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Reporte
            </button>
          </div>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Factura</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Monto</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredInvoices.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="font-medium text-gray-900">{invoice.invoiceNumber}</div>
                      {invoice.priority === 'important' && (
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      )}
                    </div>
                    <div className="text-sm text-gray-500">${invoice.total.toLocaleString()}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium ${
                        invoice.clientType === 'company' ? 'bg-purple-500' : 'bg-blue-500'
                      }`}>
                        {invoice.clientType === 'company' ? <Building className="w-4 h-4" /> : <User className="w-4 h-4" />}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{invoice.clientName}</div>
                        <div className="text-sm text-gray-500">{invoice.clientEmail}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      <div>Subtotal: ${invoice.amount.toLocaleString()}</div>
                      <div>Impuestos: ${invoice.tax.toLocaleString()}</div>
                      <div className="font-semibold">Total: ${invoice.total.toLocaleString()}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(invoice.status)}`}>
                      {getStatusIcon(invoice.status)}
                      {invoice.status === 'draft' ? 'Borrador' : 
                       invoice.status === 'sent' ? 'Enviada' : 
                       invoice.status === 'paid' ? 'Pagada' : 'Vencida'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedInvoice(invoice);
                          setShowViewModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-800 p-1"
                        title="Ver"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedInvoice(invoice);
                          setShowEditModal(true);
                        }}
                        className="text-green-600 hover:text-green-800 p-1"
                        title="Editar"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <div className="relative group">
                        <button className="text-gray-600 hover:text-gray-800 p-1">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                        <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-10 hidden group-hover:block min-w-[120px]">
                          <button
                            onClick={() => handleInvoiceAction('archive', invoice)}
                            className="w-full text-left px-3 py-1 hover:bg-gray-50 text-sm flex items-center gap-2"
                          >
                            <Archive className="w-3 h-3" />
                            Archivar
                          </button>
                          <button
                            onClick={() => handleInvoiceAction('important', invoice)}
                            className="w-full text-left px-3 py-1 hover:bg-gray-50 text-sm flex items-center gap-2"
                          >
                            <Star className="w-3 h-3" />
                            Importante
                          </button>
                          <button
                            onClick={() => handleInvoiceAction('email', invoice)}
                            className="w-full text-left px-3 py-1 hover:bg-gray-50 text-sm flex items-center gap-2"
                          >
                            <Mail className="w-3 h-3" />
                            Email
                          </button>
                          <button
                            onClick={() => handleInvoiceAction('print', invoice)}
                            className="w-full text-left px-3 py-1 hover:bg-gray-50 text-sm flex items-center gap-2"
                          >
                            <Printer className="w-3 h-3" />
                            Imprimir
                          </button>
                          <button
                            onClick={() => handleInvoiceAction('paid', invoice)}
                            className="w-full text-left px-3 py-1 hover:bg-gray-50 text-sm flex items-center gap-2"
                          >
                            <CheckCircle className="w-3 h-3" />
                            Marcar Pagada
                          </button>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Invoice Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-900">Nueva Factura</h2>
              <button onClick={() => setShowCreateModal(false)} className="text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Client Information */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Información del Cliente</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Nombre del cliente"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                    value={newInvoice.clientName || ''}
                    onChange={(e) => setNewInvoice({...newInvoice, clientName: e.target.value})}
                  />
                  <input
                    type="email"
                    placeholder="Email del cliente"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                    value={newInvoice.clientEmail || ''}
                    onChange={(e) => setNewInvoice({...newInvoice, clientEmail: e.target.value})}
                  />
                </div>
              </div>

              {/* Services */}
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Servicios</h3>
                  <button onClick={addService} className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm">
                    Agregar Servicio
                  </button>
                </div>
                <div className="space-y-3">
                  {newInvoice.services?.map((service, index) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-3 items-end">
                      <input
                        type="text"
                        placeholder="Descripción"
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                        value={service.description}
                        onChange={(e) => updateService(index, 'description', e.target.value)}
                      />
                      <input
                        type="number"
                        placeholder="Cantidad"
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                        value={service.quantity}
                        onChange={(e) => updateService(index, 'quantity', parseInt(e.target.value) || 0)}
                      />
                      <input
                        type="number"
                        step="0.01"
                        placeholder="Precio"
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                        value={service.unitPrice}
                        onChange={(e) => updateService(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                      />
                      <input
                        type="number"
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50"
                        value={service.total}
                        readOnly
                      />
                      <button
                        onClick={() => removeService(index)}
                        className="px-2 py-2 text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 pt-4 border-t border-green-200">
                  <div className="flex justify-end">
                    <div className="w-64 space-y-2">
                      {(() => {
                        const { subtotal, tax, total } = calculateInvoiceTotal(newInvoice.services);
                        return (
                          <>
                            <div className="flex justify-between">
                              <span>Subtotal:</span>
                              <span>${subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Impuestos (15%):</span>
                              <span>${tax.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between font-bold text-lg border-t pt-2">
                              <span>Total:</span>
                              <span>${total.toFixed(2)}</span>
                            </div>
                          </>
                        );
                      })()}
                    </div>
                  </div>
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
                onClick={handleCreateInvoice}
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700"
              >
                Crear Factura
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {showViewModal && selectedInvoice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-900">Factura {selectedInvoice.invoiceNumber}</h2>
              <button onClick={() => setShowViewModal(false)} className="text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg mb-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">{selectedInvoice.invoiceNumber}</h3>
                    <p className="text-gray-600">Cliente: {selectedInvoice.clientName}</p>
                    <p className="text-gray-600">Email: {selectedInvoice.clientEmail}</p>
                  </div>
                  <span className={`inline-flex items-center gap-1 px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(selectedInvoice.status)}`}>
                    {getStatusIcon(selectedInvoice.status)}
                    {selectedInvoice.status === 'draft' ? 'Borrador' : 
                     selectedInvoice.status === 'sent' ? 'Enviada' : 
                     selectedInvoice.status === 'paid' ? 'Pagada' : 'Vencida'}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-3">Fechas</h4>
                  <div className="space-y-2 text-sm">
                    <div><span className="font-medium">Emisión:</span> {new Date(selectedInvoice.issueDate).toLocaleDateString()}</div>
                    <div><span className="font-medium">Vencimiento:</span> {new Date(selectedInvoice.dueDate).toLocaleDateString()}</div>
                    {selectedInvoice.paidDate && (
                      <div className="text-green-600"><span className="font-medium">Pago:</span> {new Date(selectedInvoice.paidDate).toLocaleDateString()}</div>
                    )}
                  </div>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-3">Totales</h4>
                  <div className="space-y-2 text-sm">
                    <div><span className="font-medium">Subtotal:</span> ${selectedInvoice.amount.toLocaleString()}</div>
                    <div><span className="font-medium">Impuestos:</span> ${selectedInvoice.tax.toLocaleString()}</div>
                    <div className="text-lg font-bold"><span className="font-medium">Total:</span> ${selectedInvoice.total.toLocaleString()}</div>
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-3">Servicios</h4>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">Descripción</th>
                        <th className="text-right py-2">Cantidad</th>
                        <th className="text-right py-2">Precio Unit.</th>
                        <th className="text-right py-2">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedInvoice.services.map((service, index) => (
                        <tr key={index} className="border-b">
                          <td className="py-2">{service.description}</td>
                          <td className="text-right py-2">{service.quantity}</td>
                          <td className="text-right py-2">${service.unitPrice.toFixed(2)}</td>
                          <td className="text-right py-2">${service.total.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4 p-6 border-t">
              <button
                onClick={() => setShowViewModal(false)}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cerrar
              </button>
              <button
                onClick={() => handleInvoiceAction('email', selectedInvoice)}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <Mail className="w-4 h-4" />
                Enviar Email
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedInvoice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-900">Editar Factura</h2>
              <button onClick={() => setShowEditModal(false)} className="text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                <select
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={selectedInvoice.status}
                  onChange={(e) => setSelectedInvoice({
                    ...selectedInvoice,
                    status: e.target.value as Invoice['status']
                  })}
                >
                  <option value="draft">Borrador</option>
                  <option value="sent">Enviada</option>
                  <option value="paid">Pagada</option>
                  <option value="overdue">Vencida</option>
                  <option value="cancelled">Cancelada</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Prioridad</label>
                <select
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={selectedInvoice.priority}
                  onChange={(e) => setSelectedInvoice({
                    ...selectedInvoice,
                    priority: e.target.value as Invoice['priority']
                  })}
                >
                  <option value="normal">Normal</option>
                  <option value="important">Importante</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notas</label>
                <textarea
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={selectedInvoice.notes || ''}
                  onChange={(e) => setSelectedInvoice({
                    ...selectedInvoice,
                    notes: e.target.value
                  })}
                />
              </div>
            </div>

            <div className="flex justify-end gap-4 p-6 border-t">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  const updatedInvoices = invoices.map(inv => 
                    inv.id === selectedInvoice.id ? selectedInvoice : inv
                  );
                  setInvoices(updatedInvoices);
                  setShowEditModal(false);
                  alert('✅ Factura actualizada exitosamente!');
                }}
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700"
              >
                Guardar Cambios
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BillingPage;