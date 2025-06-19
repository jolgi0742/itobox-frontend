import React, { useState, useContext } from 'react';
import { 
  CreditCard, 
  Search, 
  Bell, 
  Settings as SettingsIcon, 
  Download,
  Filter,
  Eye,
  Plus,
  DollarSign,
  Calendar,
  MapPin,
  User,
  Lock,
  Palette,
  Globe,
  Shield,
  Smartphone
} from 'lucide-react';
import { useNavigation } from '../../../contexts/NavigationContext';

// Billing Page
export const BillingPage: React.FC = () => {
  const [filterStatus, setFilterStatus] = useState('all');

  const invoices = [
    {
      id: 'INV-001',
      client: 'Tech Solutions Inc.',
      amount: 2450.00,
      status: 'paid',
      date: '2025-06-15',
      dueDate: '2025-06-30',
      packages: 25
    },
    {
      id: 'INV-002',
      client: 'Global Trading Corp',
      amount: 1890.00,
      status: 'pending',
      date: '2025-06-10',
      dueDate: '2025-06-25',
      packages: 18
    },
    {
      id: 'INV-003',
      client: 'Miami Imports LLC',
      amount: 3200.00,
      status: 'overdue',
      date: '2025-05-25',
      dueDate: '2025-06-10',
      packages: 32
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <CreditCard className="w-8 h-8 text-green-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Facturación</h1>
            <p className="text-gray-600">Gestiona facturas y pagos</p>
          </div>
        </div>
        <button className="flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
          <Plus className="w-5 h-5" />
          <span>Nueva Factura</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Ingresos del Mes</p>
              <p className="text-2xl font-bold text-green-600">$45,680</p>
            </div>
            <DollarSign className="w-6 h-6 text-green-600" />
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Facturas Pendientes</p>
              <p className="text-2xl font-bold text-yellow-600">12</p>
            </div>
            <Calendar className="w-6 h-6 text-yellow-600" />
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Vencidas</p>
              <p className="text-2xl font-bold text-red-600">3</p>
            </div>
            <Calendar className="w-6 h-6 text-red-600" />
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pagadas</p>
              <p className="text-2xl font-bold text-blue-600">89</p>
            </div>
            <CreditCard className="w-6 h-6 text-blue-600" />
          </div>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Facturas Recientes</h3>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2"
            >
              <option value="all">Todas</option>
              <option value="paid">Pagadas</option>
              <option value="pending">Pendientes</option>
              <option value="overdue">Vencidas</option>
            </select>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Factura</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Cliente</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Monto</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Vencimiento</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {invoices.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-gray-900">{invoice.id}</div>
                      <div className="text-sm text-gray-500">{invoice.packages} paquetes</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-900">{invoice.client}</td>
                  <td className="px-6 py-4 font-medium text-gray-900">${invoice.amount.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(invoice.status)}`}>
                      {invoice.status === 'paid' ? 'Pagada' : invoice.status === 'pending' ? 'Pendiente' : 'Vencida'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-900">{invoice.dueDate}</td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg">
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
export default BillingPage;