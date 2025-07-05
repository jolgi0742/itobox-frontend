// src/modules/courier/components/WarehouseModule.tsx
// ITOBOX Courier - WAREHOUSE-USA Edition - Production Ready

import React, { useState, useEffect } from 'react';
import { Package, Search, Plus, Mail, Plane, Ship, Trash2, AlertCircle, CheckCircle, Clock, Scale, DollarSign } from 'lucide-react';
import { 
  warehouseService, 
  WHRPackage, 
  WHRCreateData, 
  WHRStats
} from '../../../services/warehouseService';

interface WarehouseModuleProps {
  className?: string;
}

const WarehouseModule: React.FC<WarehouseModuleProps> = ({ className = '' }) => {
  // Estados principales
  const [activeTab, setActiveTab] = useState<'list' | 'create' | 'stats'>('list');
  const [whrs, setWHRs] = useState<WHRPackage[]>([]);
  const [stats, setStats] = useState<WHRStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isConnected, setIsConnected] = useState(false);

  // Estados del formulario
  const [formData, setFormData] = useState<WHRCreateData>({
    invoiceNumber: '',
    poNumber: '',
    shipper: '',
    consignee: '',
    carrier: '',
    partida: '',
    description: '',
    quantity: 1,
    unitValue: 0,
    weight: 0,
    length: 0,
    width: 0,
    height: 0,
    estimatedArrivalCR: ''
  });

  // Función para cargar datos
  const loadData = async () => {
    setLoading(true);
    try {
      const response = await warehouseService.getWHRs();
      setWHRs(response.data || []);
      setStats(response.stats || null);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Test de conexión inicial
  useEffect(() => {
    const testConnection = async () => {
      try {
        const response = await warehouseService.healthCheck();
        setIsConnected(response.success);
        
        if (response.success) {
          loadData();
        }
      } catch (error) {
        console.error('Connection test failed:', error);
        setIsConnected(false);
      }
    };

    testConnection();
  }, []);

  // Recargar cuando cambie el término de búsqueda
  useEffect(() => {
    if (isConnected && searchTerm.length === 0) {
      loadData();
    }
  }, [searchTerm, isConnected]);

  // Manejar envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isConnected) {
      alert('No hay conexión con el backend. Verificar configuración.');
      return;
    }

    setLoading(true);
    try {
      const response = await warehouseService.createWHR(formData);
      
      if (response.success) {
        // Resetear formulario
        setFormData({
          invoiceNumber: '',
          poNumber: '',
          shipper: '',
          consignee: '',
          carrier: '',
          partida: '',
          description: '',
          quantity: 1,
          unitValue: 0,
          weight: 0,
          length: 0,
          width: 0,
          height: 0,
          estimatedArrivalCR: ''
        });
        
        // Volver a la lista y recargar datos
        setActiveTab('list');
        await loadData();
        
        alert(`WHR ${response.data?.whrNumber || 'nuevo'} creado exitosamente`);
      }
    } catch (error) {
      console.error('Error creating WHR:', error);
      alert('Error al crear WHR: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // Clasificar WHR como Aéreo
  const handleClassifyAWB = async (id: string) => {
    if (!isConnected) return;

    try {
      const response = await warehouseService.classifyAsAWB(id);
      if (response.success) {
        await loadData();
        alert('WHR clasificado como Aéreo (AWB)');
      }
    } catch (error) {
      console.error('Error classifying WHR as AWB:', error);
      alert('Error al clasificar WHR como Aéreo');
    }
  };

  // Clasificar WHR como Marítimo
  const handleClassifyBL = async (id: string) => {
    if (!isConnected) return;

    try {
      const response = await warehouseService.classifyAsBL(id);
      if (response.success) {
        await loadData();
        alert('WHR clasificado como Marítimo (BL)');
      }
    } catch (error) {
      console.error('Error classifying WHR as BL:', error);
      alert('Error al clasificar WHR como Marítimo');
    }
  };

  // Enviar email
  const handleSendEmail = async (id: string) => {
    if (!isConnected) return;

    try {
      const response = await warehouseService.sendEmail(id);
      if (response.success) {
        await loadData();
        alert('Notificación enviada exitosamente');
      }
    } catch (error) {
      console.error('Error sending email:', error);
      alert('Error al enviar notificación');
    }
  };

  // Eliminar WHR
  const handleDelete = async (id: string, whrNumber?: string) => {
    if (!isConnected) return;

    if (window.confirm(`¿Está seguro de eliminar el WHR ${whrNumber || id}?`)) {
      try {
        const response = await warehouseService.deleteWHR(id);
        if (response.success) {
          await loadData();
          alert('WHR eliminado exitosamente');
        }
      } catch (error) {
        console.error('Error deleting WHR:', error);
        alert('Error al eliminar WHR');
      }
    }
  };

  // Cálculos automáticos
  const volume = warehouseService.calculateVolume(formData.length, formData.width, formData.height);
  const volumeWeight = warehouseService.calculateVolumeWeight(volume);
  const totalValue = formData.quantity * formData.unitValue;

  // Filtrar WHRs
  const filteredWHRs = whrs.filter(whr =>
    (whr.whrNumber?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
    (whr.consignee?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
    (whr.carrier?.toLowerCase().includes(searchTerm.toLowerCase()) || false)
  );

  // Formatear moneda
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  // Formatear peso
  const formatWeight = (weight: number): string => {
    return `${weight.toFixed(2)} kg`;
  };

  return (
    <div className={`bg-white rounded-xl shadow-lg ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Módulo Operativo</h2>
              <p className="text-sm text-gray-600">Gestión de WHR - Warehouse Receipts</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            {/* Status de conexión */}
            <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm ${
              isConnected 
                ? 'bg-green-100 text-green-700' 
                : 'bg-red-100 text-red-700'
            }`}>
              <div className={`w-2 h-2 rounded-full ${
                isConnected ? 'bg-green-500' : 'bg-red-500'
              }`} />
              <span>{isConnected ? 'Conectado' : 'Desconectado'}</span>
            </div>
            
            {isConnected && (
              <button
                onClick={() => setActiveTab('create')}
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Crear WHR</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex space-x-6">
          <button
            onClick={() => setActiveTab('list')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              activeTab === 'list'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Lista de WHRs
          </button>
          <button
            onClick={() => setActiveTab('create')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              activeTab === 'create'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Crear WHR
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              activeTab === 'stats'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Estadísticas
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {!isConnected && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <span className="text-red-700 font-medium">Sin conexión al backend</span>
            </div>
            <p className="text-red-600 text-sm mt-1">
              Verificar que el backend esté funcionando en el servidor de producción.
            </p>
          </div>
        )}

        {/* Lista de WHRs */}
        {activeTab === 'list' && (
          <div className="space-y-6">
            {/* Barra de búsqueda */}
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por WHR, consignee, carrier..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Loading */}
            {loading && (
              <div className="text-center py-8">
                <Clock className="w-8 h-8 text-gray-400 animate-spin mx-auto mb-2" />
                <p className="text-gray-600">Cargando WHRs...</p>
              </div>
            )}

            {/* Lista de WHRs */}
            {!loading && (
              <div className="space-y-4">
                {filteredWHRs.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No hay WHRs</h3>
                    <p className="text-gray-600">
                      {searchTerm ? 'No se encontraron resultados para la búsqueda.' : 'Comienza creando tu primer WHR.'}
                    </p>
                  </div>
                ) : (
                  filteredWHRs.map((whr) => (
                    <div key={whr.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold text-gray-900">{whr.whrNumber || whr.id}</h3>
                          <p className="text-sm text-gray-600">Invoice: {whr.invoiceNumber}</p>
                          {whr.poNumber && (
                            <p className="text-sm text-gray-600">PO: {whr.poNumber}</p>
                          )}
                        </div>
                        <div className="flex space-x-2">
                          {(!whr.transportType || whr.transportType === 'pending') && (
                            <>
                              <button
                                onClick={() => handleClassifyAWB(whr.id!)}
                                className="flex items-center space-x-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm hover:bg-blue-200 transition-colors"
                              >
                                <Plane className="w-3 h-3" />
                                <span>AWB</span>
                              </button>
                              <button
                                onClick={() => handleClassifyBL(whr.id!)}
                                className="flex items-center space-x-1 bg-cyan-100 text-cyan-700 px-3 py-1 rounded-full text-sm hover:bg-cyan-200 transition-colors"
                              >
                                <Ship className="w-3 h-3" />
                                <span>BL</span>
                              </button>
                            </>
                          )}
                          {whr.transportType && whr.transportType !== 'pending' && (
                            <span className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm ${
                              whr.transportType === 'air' 
                                ? 'bg-blue-100 text-blue-700' 
                                : 'bg-cyan-100 text-cyan-700'
                            }`}>
                              {whr.transportType === 'air' ? <Plane className="w-3 h-3" /> : <Ship className="w-3 h-3" />}
                              <span>{whr.transportType === 'air' ? 'AWB' : 'BL'}</span>
                            </span>
                          )}
                          {!whr.emailSent && whr.transportType && whr.transportType !== 'pending' && (
                            <button
                              onClick={() => handleSendEmail(whr.id!)}
                              className="flex items-center space-x-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm hover:bg-green-200 transition-colors"
                            >
                              <Mail className="w-3 h-3" />
                              <span>Email</span>
                            </button>
                          )}
                          {whr.emailSent && (
                            <span className="flex items-center space-x-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                              <CheckCircle className="w-3 h-3" />
                              <span>Enviado</span>
                            </span>
                          )}
                          <button
                            onClick={() => handleDelete(whr.id!, whr.whrNumber)}
                            className="flex items-center space-x-1 bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm hover:bg-red-200 transition-colors"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Consignee:</span>
                          <p className="font-medium">{whr.consignee}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Carrier:</span>
                          <p className="font-medium">{whr.carrier}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Peso:</span>
                          <p className="font-medium">{formatWeight(whr.weight)}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Valor:</span>
                          <p className="font-medium">{formatCurrency(whr.totalValue || 0)}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}

        {/* Crear WHR */}
        {activeTab === 'create' && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Información del documento */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Información del Documento</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Número de Factura *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.invoiceNumber}
                    onChange={(e) => setFormData({ ...formData, invoiceNumber: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="INV-2024-001"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Número PO
                  </label>
                  <input
                    type="text"
                    value={formData.poNumber}
                    onChange={(e) => setFormData({ ...formData, poNumber: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="PO-2024-001"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Carrier *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.carrier}
                    onChange={(e) => setFormData({ ...formData, carrier: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="DHL, FedEx, UPS, etc."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Partida Arancelaria
                  </label>
                  <input
                    type="text"
                    value={formData.partida}
                    onChange={(e) => setFormData({ ...formData, partida: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="8517.12.00"
                  />
                </div>
              </div>

              {/* Información del remitente y destinatario */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Remitente y Destinatario</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Remitente (Shipper) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.shipper}
                    onChange={(e) => setFormData({ ...formData, shipper: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="PREMIER GLOBAL USA CORP"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Destinatario (Consignee) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.consignee}
                    onChange={(e) => setFormData({ ...formData, consignee: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nombre del cliente en Costa Rica"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fecha Estimada de Llegada CR
                  </label>
                  <input
                    type="date"
                    value={formData.estimatedArrivalCR}
                    onChange={(e) => setFormData({ ...formData, estimatedArrivalCR: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descripción *
                  </label>
                  <textarea
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                    placeholder="Descripción detallada del contenido"
                  />
                </div>
              </div>

              {/* Información del paquete */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Información del Paquete</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cantidad *
                    </label>
                    <input
                      type="number"
                      min="1"
                      required
                      value={formData.quantity}
                      onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 1 })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Peso (kg) *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      required
                      value={formData.weight}
                      onChange={(e) => setFormData({ ...formData, weight: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Largo (cm)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      value={formData.length}
                      onChange={(e) => setFormData({ ...formData, length: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ancho (cm)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      value={formData.width}
                      onChange={(e) => setFormData({ ...formData, width: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Alto (cm)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      value={formData.height}
                      onChange={(e) => setFormData({ ...formData, height: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Valor Unitario (USD) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={formData.unitValue}
                    onChange={(e) => setFormData({ ...formData, unitValue: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Cálculos automáticos */}
            {(formData.length > 0 && formData.width > 0 && formData.height > 0) && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-2 flex items-center">
                  <Scale className="w-4 h-4 mr-2" />
                  Cálculos Automáticos
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-blue-700">Volumen:</span>
                    <p className="font-medium text-blue-900">{volume.toFixed(4)} ft³</p>
                  </div>
                  <div>
                    <span className="text-blue-700">Peso Volumétrico:</span>
                    <p className="font-medium text-blue-900">{formatWeight(volumeWeight)}</p>
                  </div>
                  <div>
                    <span className="text-blue-700">Valor Total:</span>
                    <p className="font-medium text-blue-900">{formatCurrency(totalValue)}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Botones */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => setActiveTab('list')}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading || !isConnected}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Creando...' : 'Crear WHR'}
              </button>
            </div>
          </form>
        )}

        {/* Estadísticas */}
        {activeTab === 'stats' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Estadísticas del Sistema</h3>
            
            {stats ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-blue-600 text-sm font-medium">Total WHRs</p>
                        <p className="text-2xl font-bold text-blue-900">{stats.totalWHRs || stats.total || 0}</p>
                      </div>
                      <Package className="w-8 h-8 text-blue-500" />
                    </div>
                  </div>

                  <div className="bg-green-50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-green-600 text-sm font-medium">Valor Total</p>
                        <p className="text-2xl font-bold text-green-900">{formatCurrency(stats.totalValue || 0)}</p>
                      </div>
                      <DollarSign className="w-8 h-8 text-green-500" />
                    </div>
                  </div>

                  <div className="bg-purple-50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-purple-600 text-sm font-medium">Valor Promedio</p>
                        <p className="text-2xl font-bold text-purple-900">{formatCurrency(stats.averageUnitValue || 0)}</p>
                      </div>
                      <Scale className="w-8 h-8 text-purple-500" />
                    </div>
                  </div>

                  <div className="bg-orange-50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-orange-600 text-sm font-medium">Pendientes</p>
                        <p className="text-2xl font-bold text-orange-900">{stats.pending || 0}</p>
                      </div>
                      <Clock className="w-8 h-8 text-orange-500" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-4">Por Clasificación</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                          <Plane className="w-4 h-4 text-blue-500" />
                          <span className="text-gray-700">Aéreo (AWB)</span>
                        </div>
                        <span className="font-medium text-gray-900">{stats.classifiedAWB || stats.classified_awb || 0}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                          <Ship className="w-4 h-4 text-cyan-500" />
                          <span className="text-gray-700">Marítimo (BL)</span>
                        </div>
                        <span className="font-medium text-gray-900">{stats.classifiedBL || stats.classified_bl || 0}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-yellow-500" />
                          <span className="text-gray-700">Pendiente</span>
                        </div>
                        <span className="font-medium text-gray-900">{stats.pending || 0}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-4">WAREHOUSE-USA Metrics</h4>
                    <div className="space-y-3">
                      {stats.warehouseUSA ? (
                        <>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-700">Tasa de Completitud</span>
                            <span className="font-medium text-gray-900">{stats.warehouseUSA.completionRate}%</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-700">Con Invoice</span>
                            <span className="font-medium text-gray-900">{stats.warehouseUSA.withInvoice}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-700">Con PO</span>
                            <span className="font-medium text-gray-900">{stats.warehouseUSA.withPO}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-700">Con Carrier</span>
                            <span className="font-medium text-gray-900">{stats.warehouseUSA.withCarrier}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-700">Con Partida</span>
                            <span className="font-medium text-gray-900">{stats.warehouseUSA.withPartida}</span>
                          </div>
                        </>
                      ) : (
                        <p className="text-gray-500 text-sm">No hay datos WAREHOUSE-USA disponibles</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* WHRs Recientes */}
                {stats.recentWHRs && stats.recentWHRs.length > 0 && (
                  <div className="bg-white border border-gray-200 rounded-lg">
                    <div className="p-4 border-b bg-gray-50">
                      <h4 className="font-semibold text-gray-900">WHRs Recientes</h4>
                    </div>
                    <div className="p-4">
                      <div className="space-y-3">
                        {stats.recentWHRs.slice(0, 5).map((whr, index) => (
                          <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                            <div>
                              <p className="font-medium text-gray-900">{whr.whrNumber || `WHR-${index + 1}`}</p>
                              <p className="text-sm text-gray-600">{whr.consignee}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium text-gray-900">{formatCurrency(whr.totalValue || 0)}</p>
                              <p className="text-sm text-gray-600">{formatWeight(whr.weight)}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Sin estadísticas</h3>
                <p className="text-gray-600">
                  {!isConnected ? 'Conecta con el backend para ver estadísticas.' : 'No hay datos suficientes para mostrar estadísticas.'}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default WarehouseModule;