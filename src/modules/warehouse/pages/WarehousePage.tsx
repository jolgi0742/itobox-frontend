import React, { useState, useEffect } from 'react';
import { 
  Package, Search, Plus, Plane, Ship, Mail, Trash2, 
  CheckCircle, AlertCircle, Clock
} from 'lucide-react';

// Interfaces básicas
interface WHRPackage {
  id?: string;
  whrNumber?: string;
  invoiceNumber: string;
  poNumber: string;
  shipper: string;
  consignee: string;
  carrier: string;
  partida: string;
  description: string;
  quantity: number;
  unitValue: number;
  weight: number;
  length: number;
  width: number;
  height: number;
  estimatedArrivalCR: string;
  status?: string;
  totalValue?: number;
  createdAt?: string;
}

interface WHRStats {
  total: number;
  pending: number;
  classified_awb: number;
  classified_bl: number;
  averageUnitValue: number;
  totalValue: number;
}

const WarehousePage: React.FC = () => {
  const [whrs, setWHRs] = useState<WHRPackage[]>([]);
  const [stats, setStats] = useState<WHRStats>({
    total: 0,
    pending: 0,
    classified_awb: 0,
    classified_bl: 0,
    averageUnitValue: 0,
    totalValue: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking');
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Nuevo WHR form data
  const [formData, setFormData] = useState({
    invoiceNumber: '',
    poNumber: '',
    shipper: '',
    consignee: '',
    carrier: 'DHL',
    partida: '',
    description: '',
    quantity: 1,
    unitValue: 0,
    weight: 0,
    length: 0,
    width: 0,
    height: 0,
    estimatedArrivalCR: '',
  });

  // Función simple para hacer requests
  const makeRequest = async (endpoint: string, options: RequestInit = {}) => {
    try {
      const response = await fetch(`http://localhost:5000/api/warehouse${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  };

  // Verificar conexión con backend
  const checkConnection = async () => {
    try {
      console.log('🔄 Verificando conexión...');
      setConnectionStatus('checking');
      
      const response = await makeRequest('/health');
      console.log('✅ Respuesta health:', response);
      
      if (response.success) {
        setConnectionStatus('connected');
        setError(null);
        await loadData();
      } else {
        setConnectionStatus('disconnected');
        setError('Backend respondió pero con error');
      }
    } catch (error) {
      console.error('❌ Error conexión:', error);
      setConnectionStatus('disconnected');
      setError('No se puede conectar con el backend: ' + (error as Error).message);
    }
  };

  // Cargar datos del backend
  const loadData = async () => {
    try {
      setLoading(true);
      console.log('📊 Cargando datos...');
      
      // Cargar stats
      const statsResponse = await makeRequest('/stats');
      console.log('📈 Stats:', statsResponse);
      
      if (statsResponse.success && statsResponse.data) {
        setStats(statsResponse.data);
      }
      
      // Cargar WHRs
      const whrsResponse = await makeRequest('/whr');
      console.log('📦 WHRs:', whrsResponse);
      
      if (whrsResponse.success && whrsResponse.data) {
        setWHRs(Array.isArray(whrsResponse.data) ? whrsResponse.data : []);
      }
      
      setError(null);
    } catch (error) {
      console.error('❌ Error cargando datos:', error);
      setError('Error cargando datos: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // Crear nuevo WHR
  const handleCreateWHR = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log('🆕 Creando WHR:', formData);
      
      const response = await makeRequest('/whr', {
        method: 'POST',
        body: JSON.stringify(formData),
      });
      
      console.log('✅ WHR creado:', response);
      
      if (response.success) {
        setShowCreateForm(false);
        // Reset form
        setFormData({
          invoiceNumber: '',
          poNumber: '',
          shipper: '',
          consignee: '',
          carrier: 'DHL',
          partida: '',
          description: '',
          quantity: 1,
          unitValue: 0,
          weight: 0,
          length: 0,
          width: 0,
          height: 0,
          estimatedArrivalCR: '',
        });
        await loadData();
        alert('✅ WHR creado exitosamente!');
      }
    } catch (error) {
      console.error('❌ Error creando WHR:', error);
      alert('❌ Error creando WHR: ' + (error as Error).message);
    }
  };

  // Clasificar WHR
  const classifyWHR = async (id: string, type: 'awb' | 'bl') => {
    try {
      console.log(`🏷️ Clasificando WHR ${id} como ${type.toUpperCase()}`);
      
      const response = await makeRequest(`/whr/${id}/classify`, {
        method: 'PUT',
        body: JSON.stringify({ type }),
      });
      
      console.log('✅ Clasificación:', response);
      
      if (response.success) {
        await loadData();
        alert(`✅ WHR clasificado como ${type.toUpperCase()} exitosamente!`);
      }
    } catch (error) {
      console.error('❌ Error clasificando:', error);
      alert('❌ Error clasificando: ' + (error as Error).message);
    }
  };

  // Enviar email
  const sendEmail = async (id: string) => {
    try {
      console.log(`📧 Enviando email para WHR ${id}`);
      
      const response = await makeRequest(`/whr/${id}/email`, {
        method: 'POST',
      });
      
      console.log('✅ Email enviado:', response);
      
      if (response.success) {
        await loadData();
        alert('✅ Email enviado exitosamente!');
      }
    } catch (error) {
      console.error('❌ Error enviando email:', error);
      alert('❌ Error enviando email: ' + (error as Error).message);
    }
  };

  // Eliminar WHR
  const deleteWHR = async (id: string) => {
    if (!window.confirm('¿Estás seguro de eliminar este WHR?')) {
      return;
    }
    
    try {
      console.log(`🗑️ Eliminando WHR ${id}`);
      
      const response = await makeRequest(`/whr/${id}`, {
        method: 'DELETE',
      });
      
      console.log('✅ WHR eliminado:', response);
      
      if (response.success) {
        await loadData();
        alert('✅ WHR eliminado exitosamente!');
      }
    } catch (error) {
      console.error('❌ Error eliminando:', error);
      alert('❌ Error eliminando: ' + (error as Error).message);
    }
  };

  // Effect inicial
  useEffect(() => {
    console.log('🚀 Iniciando WarehousePage...');
    checkConnection();
  }, []);

  // Render basado en estado de conexión
  if (connectionStatus === 'checking') {
    return (
      <div className="p-6 flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Conectando con backend...</p>
          <p className="text-sm text-gray-500 mt-2">Verificando puerto 5000...</p>
        </div>
      </div>
    );
  }

  if (connectionStatus === 'disconnected') {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-red-900 mb-2">Backend Desconectado</h3>
          <p className="text-red-700 mb-4">No se puede conectar con el servidor backend en puerto 5000</p>
          <p className="text-sm text-red-600 mb-4">
            Error: {error}
          </p>
          <button 
            onClick={() => {
              console.log('🔄 Reintentando conexión...');
              checkConnection();
            }}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            🔄 Reintentar Conexión
          </button>
          <div className="mt-4 text-xs text-gray-600">
            <p>Backend health check: http://localhost:5000/api/warehouse/health</p>
          </div>
        </div>
      </div>
    );
  }

  // Render principal cuando está conectado
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              🏠 WAREHOUSE-USA
              <span className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                ✅ CONECTADO
              </span>
            </h1>
            <p className="text-gray-600">Sistema de gestión de warehouse receipts</p>
          </div>
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            Crear WHR
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Package className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-2xl font-semibold text-gray-900">{stats.total}</p>
              <p className="text-sm text-gray-500">Total WHRs</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-yellow-600" />
            <div className="ml-4">
              <p className="text-2xl font-semibold text-gray-900">{stats.pending}</p>
              <p className="text-sm text-gray-500">Pendientes</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Plane className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-2xl font-semibold text-gray-900">{stats.classified_awb}</p>
              <p className="text-sm text-gray-500">AWB (Aéreo)</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Ship className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-2xl font-semibold text-gray-900">{stats.classified_bl}</p>
              <p className="text-sm text-gray-500">BL (Marítimo)</p>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de WHRs */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Lista de WHRs</h3>
        </div>
        
        {loading ? (
          <div className="p-6 text-center">
            <div className="animate-spin h-6 w-6 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-2"></div>
            <p className="text-gray-600">Cargando...</p>
          </div>
        ) : whrs.length === 0 ? (
          <div className="p-6 text-center">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No hay WHRs registrados</p>
            <button 
              onClick={() => setShowCreateForm(true)}
              className="mt-2 text-blue-600 hover:text-blue-800"
            >
              Crear el primer WHR
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    WHR Number
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Invoice / PO
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Consignee
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Carrier
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {whrs.map((whr) => (
                  <tr key={whr.id || whr.whrNumber} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {whr.whrNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div>
                        <div className="font-medium">{whr.invoiceNumber}</div>
                        <div className="text-xs text-gray-400">{whr.poNumber}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {whr.consignee}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {whr.carrier}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        whr.status === 'pending' 
                          ? 'bg-yellow-100 text-yellow-800'
                          : whr.status === 'classified_awb'
                          ? 'bg-green-100 text-green-800'
                          : whr.status === 'classified_bl'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {whr.status === 'pending' ? 'Pendiente' :
                         whr.status === 'classified_awb' ? 'AWB' :
                         whr.status === 'classified_bl' ? 'BL' :
                         whr.status || 'Nuevo'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex space-x-2">
                        {(!whr.status || whr.status === 'pending') && (
                          <>
                            <button
                              onClick={() => classifyWHR(whr.id!, 'awb')}
                              className="bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded text-xs flex items-center transition-colors"
                              title="Clasificar como AWB (Aéreo)"
                            >
                              <Plane className="h-3 w-3" />
                            </button>
                            <button
                              onClick={() => classifyWHR(whr.id!, 'bl')}
                              className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded text-xs flex items-center transition-colors"
                              title="Clasificar como BL (Marítimo)"
                            >
                              <Ship className="h-3 w-3" />
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => sendEmail(whr.id!)}
                          className="bg-purple-600 hover:bg-purple-700 text-white px-2 py-1 rounded text-xs flex items-center transition-colors"
                          title="Enviar Email"
                        >
                          <Mail className="h-3 w-3" />
                        </button>
                        <button
                          onClick={() => deleteWHR(whr.id!)}
                          className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded text-xs flex items-center transition-colors"
                          title="Eliminar WHR"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Crear WHR */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-2xl shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Crear Nuevo WHR</h3>
              <button
                onClick={() => setShowCreateForm(false)}
                className="text-gray-400 hover:text-gray-600 text-xl"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleCreateWHR} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Invoice Number</label>
                  <input
                    type="text"
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                    value={formData.invoiceNumber}
                    onChange={(e) => setFormData({...formData, invoiceNumber: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">PO Number</label>
                  <input
                    type="text"
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                    value={formData.poNumber}
                    onChange={(e) => setFormData({...formData, poNumber: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Shipper</label>
                  <input
                    type="text"
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                    value={formData.shipper}
                    onChange={(e) => setFormData({...formData, shipper: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Consignee</label>
                  <input
                    type="text"
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                    value={formData.consignee}
                    onChange={(e) => setFormData({...formData, consignee: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Carrier</label>
                  <select
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                    value={formData.carrier}
                    onChange={(e) => setFormData({...formData, carrier: e.target.value})}
                  >
                    <option value="DHL">DHL</option>
                    <option value="FEDEX">FEDEX</option>
                    <option value="UPS">UPS</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Partida Arancelaria</label>
                  <input
                    type="text"
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                    value={formData.partida}
                    onChange={(e) => setFormData({...formData, partida: e.target.value})}
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    required
                    rows={2}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Quantity</label>
                  <input
                    type="number"
                    required
                    min="1"
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                    value={formData.quantity}
                    onChange={(e) => setFormData({...formData, quantity: parseInt(e.target.value) || 1})}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Unit Value ($)</label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                    value={formData.unitValue}
                    onChange={(e) => setFormData({...formData, unitValue: parseFloat(e.target.value) || 0})}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Weight (kg)</label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.1"
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                    value={formData.weight}
                    onChange={(e) => setFormData({...formData, weight: parseFloat(e.target.value) || 0})}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Length (cm)</label>
                  <input
                    type="number"
                    required
                    min="0"
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                    value={formData.length}
                    onChange={(e) => setFormData({...formData, length: parseFloat(e.target.value) || 0})}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Width (cm)</label>
                  <input
                    type="number"
                    required
                    min="0"
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                    value={formData.width}
                    onChange={(e) => setFormData({...formData, width: parseFloat(e.target.value) || 0})}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Height (cm)</label>
                  <input
                    type="number"
                    required
                    min="0"
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                    value={formData.height}
                    onChange={(e) => setFormData({...formData, height: parseFloat(e.target.value) || 0})}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Estimated Arrival CR</label>
                  <input
                    type="date"
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                    value={formData.estimatedArrivalCR}
                    onChange={(e) => setFormData({...formData, estimatedArrivalCR: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Crear WHR
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Debug Info */}
      <div className="mt-6 bg-gray-100 rounded-lg p-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">🔍 Debug Info</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-gray-600">
          <div>
            <span className="font-medium">Backend Status:</span> {connectionStatus}
          </div>
          <div>
            <span className="font-medium">Total WHRs:</span> {stats.total}
          </div>
          <div>
            <span className="font-medium">Loading:</span> {loading ? 'Yes' : 'No'}
          </div>
        </div>
        {error && (
          <div className="mt-2 text-xs text-red-600">
            <span className="font-medium">Error:</span> {error}
          </div>
        )}
        <div className="mt-2 text-xs text-gray-500">
          <span className="font-medium">API URL:</span> http://localhost:5000/api/warehouse
        </div>
      </div>
    </div>
  );
};

export default WarehousePage;