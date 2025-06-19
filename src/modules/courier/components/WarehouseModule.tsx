// src/modules/courier/components/WarehouseModule.tsx - FIXED VERSION
import React, { useState, useEffect } from 'react';
import { 
  Package, 
  Search, 
  Plus, 
  Mail, 
  Plane, 
  Ship, 
  Eye, 
  Trash2, 
  Scale,
  Box,
  Calendar,
  User,
  Building,
  MapPin,
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  RefreshCw
} from 'lucide-react';
import { OperativeWarehouseService, type WHRPackage, type WHRCreateData, type WHRStats } from '../../../services/warehouseService';

// ✅ INTERFACES LOCALES
interface WHRFormData {
  trackingNumber: string;
  receivedBy: string;
  carrier: string;
  shipperName: string;
  shipperCompany: string;
  shipperAddress: string;
  shipperPhone: string;
  consigneeName: string;
  consigneeCompany: string;
  consigneeAddress: string;
  consigneePhone: string;
  consigneeEmail: string;
  content: string;
  pieces: number;
  weight: number;
  length: number;
  width: number;
  height: number;
  declaredValue: number;
  invoiceNumber: string;
  poNumber: string;
  departureDate: string;
  transport: 'air' | 'sea';
  estimatedArrivalCR: string;
  notes: string;
}

const WHROperativeModule: React.FC = () => {
  // ✅ ESTADOS PRINCIPALES
  const [whrList, setWhrList] = useState<WHRPackage[]>([]);
  const [stats, setStats] = useState<WHRStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [isBackendHealthy, setIsBackendHealthy] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterClassification, setFilterClassification] = useState<'all' | 'pending' | 'awb' | 'bl'>('all');
  const [activeTab, setActiveTab] = useState<'arrivals' | 'inventory' | 'classification' | 'reports'>('arrivals');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ✅ FORMULARIO STATE
  const [formData, setFormData] = useState<WHRFormData>({
    trackingNumber: '',
    receivedBy: 'Admin Usuario',
    carrier: '',
    shipperName: '',
    shipperCompany: '',
    shipperAddress: '',
    shipperPhone: '',
    consigneeName: '',
    consigneeCompany: '',
    consigneeAddress: '',
    consigneePhone: '',
    consigneeEmail: '',
    content: '',
    pieces: 1,
    weight: 0,
    length: 0,
    width: 0,
    height: 0,
    declaredValue: 0,
    invoiceNumber: '',
    poNumber: '',
    departureDate: '',
    transport: 'air',
    estimatedArrivalCR: '',
    notes: ''
  });

  // ✅ DATOS CALCULADOS
  const [calculatedMetrics, setCalculatedMetrics] = useState({
    volume: 0,
    volumeWeight: 0
  });

  // ✅ EFECTOS
  useEffect(() => {
    initializeModule();
  }, []);

  useEffect(() => {
    // Recalcular métricas cuando cambien las dimensiones
    if (formData.length && formData.width && formData.height) {
      const metrics = OperativeWarehouseService.calculateCAMCAMetrics(
        formData.length,
        formData.width,
        formData.height
      );
      setCalculatedMetrics(metrics);
    }
  }, [formData.length, formData.width, formData.height]);

  // ✅ INICIALIZACIÓN DEL MÓDULO
  const initializeModule = async () => {
    setLoading(true);
    
    try {
      // Check backend health
      const healthy = await OperativeWarehouseService.healthCheck();
      setIsBackendHealthy(healthy);
      
      if (healthy) {
        await Promise.all([
          loadWHRList(),
          loadStats()
        ]);
      }
    } catch (error) {
      console.error('❌ Error initializing module:', error);
      setIsBackendHealthy(false);
    } finally {
      setLoading(false);
    }
  };

  // ✅ CARGAR LISTA DE WHRs
  const loadWHRList = async () => {
    try {
      const filters = {
        search: searchTerm || undefined,
        classification: filterClassification !== 'all' ? filterClassification : undefined
      };
      
      const response = await OperativeWarehouseService.getWHRList(filters);
      
      console.log('🔄 Response from backend:', response);
      console.log('🔍 Response.data type:', typeof response.data);
      console.log('🔍 Response.data content:', response.data);
      
      if (response.success && response.data) {
        // ✅ FIX: El backend ahora devuelve directamente el array en data
        if (Array.isArray(response.data)) {
          console.log('✅ Setting WHR list directly:', response.data.length);
          console.log('🔍 First WHR data:', response.data[0]);
          setWhrList(response.data);
        } else if (response.data.whrList && Array.isArray(response.data.whrList)) {
          console.log('✅ Setting WHR list from whrList:', response.data.whrList.length);
          setWhrList(response.data.whrList);
        } else {
          console.warn('⚠️ Unexpected response format:', response.data);
          setWhrList([]);
        }
      } else {
        console.warn('⚠️ Backend response not successful:', response);
        setWhrList([]);
      }
    } catch (error) {
      console.error('❌ Error loading WHR list:', error);
      setWhrList([]);
    }
  };

  // ✅ CARGAR ESTADÍSTICAS
  const loadStats = async () => {
    try {
      const response = await OperativeWarehouseService.getWHRStats();
      
      if (response.success && response.data) {
        // ✅ FIX: Manejo correcto de stats
        const statsData = response.data.stats || response.data;
        setStats(statsData);
      } else {
        console.warn('⚠️ Stats response format unexpected:', response);
        setStats({
          total: 0,
          pending: 0,
          awb: 0,
          bl: 0,
          emails_pending: 0,
          in_miami: 0,
          by_air: 0,
          by_sea: 0,
          total_pieces: 0,
          avg_weight: 0,
          avg_volume: 0,
          total_value: 0,
          next_whr_number: OperativeWarehouseService.generateWHRNumber()
        });
      }
    } catch (error) {
      console.error('❌ Error loading stats:', error);
      setStats(null);
    }
  };

  // ✅ CREAR NUEVO WHR
  const handleCreateWHR = async () => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      // Validar datos
      const validation = OperativeWarehouseService.validateWHRData(formData);
      
      if (!validation.isValid) {
        alert('❌ Errores de validación:\n' + validation.errors.join('\n'));
        return;
      }

      console.log('🔄 Creating WHR with data:', formData);
      
      // ✅ FIX: Mapear datos correctamente usando la interface WHRCreateData
      const whrData: WHRCreateData = {
        trackingNumber: formData.trackingNumber,
        receivedBy: formData.receivedBy,
        carrier: formData.carrier,
        shipperName: formData.shipperName,
        shipperCompany: formData.shipperCompany,
        shipperAddress: formData.shipperAddress,
        shipperPhone: formData.shipperPhone,
        consigneeName: formData.consigneeName,
        consigneeCompany: formData.consigneeCompany,
        consigneeAddress: formData.consigneeAddress,
        consigneePhone: formData.consigneePhone,
        consigneeEmail: formData.consigneeEmail,
        content: formData.content,
        pieces: Number(formData.pieces),
        weight: Number(formData.weight),
        length: Number(formData.length),
        width: Number(formData.width),
        height: Number(formData.height),
        declaredValue: Number(formData.declaredValue),
        invoiceNumber: formData.invoiceNumber,
        poNumber: formData.poNumber,
        departureDate: formData.departureDate,
        transport: formData.transport,
        estimatedArrivalCR: formData.estimatedArrivalCR,
        notes: formData.notes
      };

      // Crear WHR
      const result = await OperativeWarehouseService.createWHR(whrData);
      
      console.log('✅ WHR creation result:', result);
      
      // ✅ FIX: Tipado correcto y manejo de diferentes formatos de respuesta
      let newWHR: WHRPackage | null = null;
      
      // Verificar si result es directamente el WHR
      if (result && typeof result === 'object' && 'id' in result && 'whrNumber' in result) {
        newWHR = result as WHRPackage;
      } 
      // Verificar si result tiene estructura { data: whr }
      else if (result && typeof result === 'object' && 'data' in result) {
        const resultWithData = result as { data: WHRPackage };
        if (resultWithData.data && 'id' in resultWithData.data) {
          newWHR = resultWithData.data;
        }
      }
      
      if (newWHR) {
        console.log('✅ Adding WHR to list:', newWHR);
        setWhrList(prev => [newWHR as WHRPackage, ...prev]);
        
        // Recargar stats y lista completa para sincronizar
        await Promise.all([loadStats(), loadWHRList()]);
        
        // Reset form
        setFormData({
          trackingNumber: '',
          receivedBy: 'Admin Usuario',
          carrier: '',
          shipperName: '',
          shipperCompany: '',
          shipperAddress: '',
          shipperPhone: '',
          consigneeName: '',
          consigneeCompany: '',
          consigneeAddress: '',
          consigneePhone: '',
          consigneeEmail: '',
          content: '',
          pieces: 1,
          weight: 0,
          length: 0,
          width: 0,
          height: 0,
          declaredValue: 0,
          invoiceNumber: '',
          poNumber: '',
          departureDate: '',
          transport: 'air',
          estimatedArrivalCR: '',
          notes: ''
        });
        
        setShowCreateModal(false);
        alert('✅ WHR creado exitosamente!');
      } else {
        console.error('❌ Could not extract WHR from result:', result);
        // Aún así recargar la lista para mostrar el WHR creado
        await loadWHRList();
        setShowCreateModal(false);
        alert('✅ WHR creado exitosamente! Recargando lista...');
      }
      
    } catch (error) {
      console.error('❌ Error creating WHR:', error);
      alert('❌ Error creando WHR: ' + (error as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ✅ CLASIFICAR WHR
  const handleClassifyWHR = async (whrId: string, classification: 'awb' | 'bl') => {
    try {
      const updatedWHR = await OperativeWarehouseService.classifyWHR(whrId, classification);
      
      // ✅ FIX: Verificar que updatedWHR existe
      if (updatedWHR && updatedWHR.id) {
        setWhrList(prev => prev.map(whr => 
          whr.id === whrId ? updatedWHR : whr
        ));
        
        await loadStats();
        alert(`✅ WHR clasificado como ${classification.toUpperCase()}`);
      }
    } catch (error) {
      console.error('❌ Error classifying WHR:', error);
      alert('❌ Error clasificando WHR');
    }
  };

  // ✅ ENVIAR EMAIL
  const handleSendEmail = async (whrId: string) => {
    try {
      const response = await OperativeWarehouseService.sendWHREmail(whrId);
      
      if (response.success && response.data.whr) {
        setWhrList(prev => prev.map(whr => 
          whr.id === whrId ? response.data.whr : whr
        ));
        
        alert('✅ Email enviado exitosamente');
      }
    } catch (error) {
      console.error('❌ Error sending email:', error);
      alert('❌ Error enviando email');
    }
  };

  // ✅ ELIMINAR WHR
  const handleDeleteWHR = async (whrId: string) => {
    if (!window.confirm('¿Estás seguro de eliminar este WHR?')) return;
    
    try {
      const success = await OperativeWarehouseService.deleteWHR(whrId);
      
      if (success) {
        setWhrList(prev => prev.filter(whr => whr.id !== whrId));
        await loadStats();
        alert('✅ WHR eliminado exitosamente');
      }
    } catch (error) {
      console.error('❌ Error deleting WHR:', error);
      alert('❌ Error eliminando WHR');
    }
  };

  // ✅ ACTUALIZAR DATOS
  const handleRefresh = async () => {
    await initializeModule();
  };

  // ✅ FILTRAR WHRs
  const filteredWHRs = whrList.filter(whr => {
    const matchesSearch = !searchTerm || 
      whr.whrNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      whr.trackingNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      whr.consignee?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterClassification === 'all' || 
      whr.classification === filterClassification;
    
    return matchesSearch && matchesFilter;
  });

  // ✅ RENDER
  return (
    <div className="space-y-6">
      {/* ✅ HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Módulo Operativo - Gestión WHR</h2>
          <p className="text-gray-600 mt-1">Sistema WHR (Warehouse Receipt) - ITOBOX Courier</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Actualizar
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <Plus className="w-4 h-4" />
            Registrar Llegada
          </button>
        </div>
      </div>

      {/* ✅ ALERTAS DE ESTADO */}
      {!isBackendHealthy && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <XCircle className="w-5 h-5 text-red-600" />
            <span className="text-red-800 font-medium">Servicio de backend no disponible</span>
            <button 
              onClick={handleRefresh}
              className="ml-auto text-red-600 hover:text-red-800 underline"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {!isBackendHealthy && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-yellow-600" />
            <span className="text-yellow-800">Servicio backend no disponible. Funcionando en modo offline.</span>
          </div>
        </div>
      )}

      {/* ✅ DEBUG INFO */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm">
        <span className="text-blue-800">
          📊 Debug Info: WHRs = Array({whrList.length}) | Filtered = Array({filteredWHRs.length}) | Healthy = {isBackendHealthy ? 'YES' : 'NO'}
        </span>
      </div>

      {/* ✅ TABS */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'arrivals', name: 'Llegadas WHR', icon: Package },
            { id: 'inventory', name: 'Inventario Operativo', icon: Box },
            { id: 'classification', name: 'Clasificación AWB/BL', icon: Plane },
            { id: 'reports', name: 'Reportes Operativos', icon: Eye }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* ✅ ESTADÍSTICAS */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total WHRs</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <Package className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pendientes</p>
                <p className="text-2xl font-bold text-orange-600">{stats.pending}</p>
              </div>
              <Clock className="w-8 h-8 text-orange-600" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">AWB (Aéreo)</p>
                <p className="text-2xl font-bold text-blue-600">{stats.awb}</p>
              </div>
              <Plane className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">BL (Marítimo)</p>
                <p className="text-2xl font-bold text-cyan-600">{stats.bl}</p>
              </div>
              <Ship className="w-8 h-8 text-cyan-600" />
            </div>
          </div>
        </div>
      )}

      {/* ✅ CONTENIDO POR TAB */}
      {activeTab === 'arrivals' && (
        <div className="space-y-4">
          {/* Búsqueda y filtros */}
          <div className="flex gap-4 items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar por WHR, tracking, consignee, contenido..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <select
              value={filterClassification}
              onChange={(e) => setFilterClassification(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Todas las clasificaciones</option>
              <option value="pending">Pendientes</option>
              <option value="awb">AWB (Aéreo)</option>
              <option value="bl">BL (Marítimo)</option>
            </select>
            
            <button
              onClick={() => setSearchTerm('')}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Limpiar
            </button>
          </div>

          {/* Lista de WHRs */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                WHRs Registrados en Módulo Operativo ({filteredWHRs.length})
              </h3>
            </div>
            
            {loading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Cargando WHRs...</p>
              </div>
            ) : filteredWHRs.length === 0 ? (
              <div className="p-8 text-center">
                <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">No hay WHRs registrados en el Módulo Operativo</p>
                <p className="text-sm text-gray-500 mb-4">
                  Comience registrando la primera llegada de paquete en el Módulo Operativo
                </p>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4" />
                  Registrar Primera Llegada
                </button>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {filteredWHRs.map((whr) => (
                  <div key={whr.id} className="p-6 hover:bg-gray-50">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* ✅ FIX: Verificar propiedades antes de usarlas */}
                        <div>
                          <h4 className="font-semibold text-gray-900">{whr.whrNumber || 'N/A'}</h4>
                          <p className="text-sm text-gray-600">Tracking: {whr.trackingNumber || 'N/A'}</p>
                          <p className="text-sm text-gray-600">
                            Consignee: {whr.consignee?.name || 'N/A'}
                          </p>
                        </div>
                        
                        <div>
                          <p className="text-sm text-gray-600">
                            Piezas: {whr.pieces || 0} | Peso: {whr.weight || 0} lb
                          </p>
                          <p className="text-sm text-gray-600">
                            Volumen: {whr.volume?.toFixed(4) || '0.0000'} ft³
                          </p>
                          <p className="text-sm text-gray-600">
                            Valor: ${whr.declaredValue?.toFixed(2) || '0.00'}
                          </p>
                        </div>
                        
                        <div>
                          <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            whr.classification === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            whr.classification === 'awb' ? 'bg-blue-100 text-blue-800' :
                            whr.classification === 'bl' ? 'bg-cyan-100 text-cyan-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {whr.classification === 'pending' && <Clock className="w-3 h-3 mr-1" />}
                            {whr.classification === 'awb' && <Plane className="w-3 h-3 mr-1" />}
                            {whr.classification === 'bl' && <Ship className="w-3 h-3 mr-1" />}
                            {whr.classification?.toUpperCase() || 'UNKNOWN'}
                          </div>
                          
                          {whr.emailSent && (
                            <div className="flex items-center mt-1 text-xs text-green-600">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Email enviado
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Acciones */}
                      <div className="flex items-center gap-2 ml-4">
                        {whr.classification === 'pending' && (
                          <>
                            <button
                              onClick={() => handleClassifyWHR(whr.id, 'awb')}
                              className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                              title="Clasificar como AWB (Aéreo)"
                            >
                              <Plane className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleClassifyWHR(whr.id, 'bl')}
                              className="p-1 text-cyan-600 hover:bg-cyan-50 rounded"
                              title="Clasificar como BL (Marítimo)"
                            >
                              <Ship className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        
                        {!whr.emailSent && (
                          <button
                            onClick={() => handleSendEmail(whr.id)}
                            className="p-1 text-green-600 hover:bg-green-50 rounded"
                            title="Enviar email de notificación"
                          >
                            <Mail className="w-4 h-4" />
                          </button>
                        )}
                        
                        <button
                          onClick={() => handleDeleteWHR(whr.id)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                          title="Eliminar WHR"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ✅ OTRAS TABS (simplificadas para el fix) */}
      {activeTab === 'inventory' && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Inventario Operativo</h3>
          <p className="text-gray-600">Gestión de inventario WHR en tiempo real.</p>
        </div>
      )}

      {activeTab === 'classification' && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Clasificación AWB/BL</h3>
          <p className="text-gray-600">Centro de clasificación de transporte aéreo y marítimo.</p>
        </div>
      )}

      {activeTab === 'reports' && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Reportes Operativos</h3>
          <p className="text-gray-600">Reportes y análisis del Módulo Operativo.</p>
        </div>
      )}

      {/* ✅ MODAL DE CREACIÓN */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Registrar Nueva Llegada WHR</h3>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Información básica */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tracking Number *
                  </label>
                  <input
                    type="text"
                    value={formData.trackingNumber}
                    onChange={(e) => setFormData(prev => ({ ...prev, trackingNumber: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Ejemplo: TRK241216001"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Carrier/Transportista *
                  </label>
                  <input
                    type="text"
                    value={formData.carrier}
                    onChange={(e) => setFormData(prev => ({ ...prev, carrier: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Ejemplo: DHL, FedEx, UPS"
                  />
                </div>
              </div>

              {/* Información del Shipper */}
              <div className="border-t pt-6">
                <h4 className="text-md font-semibold text-gray-900 mb-4">Información del Shipper</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre del Shipper *
                    </label>
                    <input
                      type="text"
                      value={formData.shipperName}
                      onChange={(e) => setFormData(prev => ({ ...prev, shipperName: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Nombre completo del remitente"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Compañía del Shipper
                    </label>
                    <input
                      type="text"
                      value={formData.shipperCompany}
                      onChange={(e) => setFormData(prev => ({ ...prev, shipperCompany: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Nombre de la empresa (opcional)"
                    />
                  </div>
                </div>
              </div>

              {/* Información del Consignee */}
              <div className="border-t pt-6">
                <h4 className="text-md font-semibold text-gray-900 mb-4">Información del Consignee</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre del Consignee *
                    </label>
                    <input
                      type="text"
                      value={formData.consigneeName}
                      onChange={(e) => setFormData(prev => ({ ...prev, consigneeName: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Nombre completo del destinatario"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email del Consignee
                    </label>
                    <input
                      type="email"
                      value={formData.consigneeEmail}
                      onChange={(e) => setFormData(prev => ({ ...prev, consigneeEmail: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="email@ejemplo.com"
                    />
                  </div>
                </div>
              </div>

              {/* Información del Paquete */}
              <div className="border-t pt-6">
                <h4 className="text-md font-semibold text-gray-900 mb-4">Información del Paquete</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Contenido/Descripción *
                    </label>
                    <input
                      type="text"
                      value={formData.content}
                      onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Descripción del contenido del paquete"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Número de Piezas *
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={formData.pieces}
                      onChange={(e) => setFormData(prev => ({ ...prev, pieces: parseInt(e.target.value) || 1 }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Dimensiones y Peso */}
              <div className="border-t pt-6">
                <h4 className="text-md font-semibold text-gray-900 mb-4">Dimensiones y Peso</h4>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Peso (lb) *
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      value={formData.weight}
                      onChange={(e) => setFormData(prev => ({ ...prev, weight: parseFloat(e.target.value) || 0 }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="0.0"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Largo (cm) *
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      value={formData.length}
                      onChange={(e) => setFormData(prev => ({ ...prev, length: parseFloat(e.target.value) || 0 }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="0.0"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ancho (cm) *
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      value={formData.width}
                      onChange={(e) => setFormData(prev => ({ ...prev, width: parseFloat(e.target.value) || 0 }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="0.0"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Alto (cm) *
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      value={formData.height}
                      onChange={(e) => setFormData(prev => ({ ...prev, height: parseFloat(e.target.value) || 0 }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="0.0"
                    />
                  </div>
                </div>
                
                {/* Cálculos automáticos */}
                {calculatedMetrics.volume > 0 && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                    <h5 className="text-sm font-medium text-blue-900 mb-2">Cálculos Automáticos WHR:</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-blue-700">Volumen: </span>
                        <span className="font-medium">{calculatedMetrics.volume} ft³</span>
                      </div>
                      <div>
                        <span className="text-blue-700">Peso Volumétrico: </span>
                        <span className="font-medium">{calculatedMetrics.volumeWeight} vlb</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Valor Declarado y Transporte */}
              <div className="border-t pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Valor Declarado (USD) *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.declaredValue}
                      onChange={(e) => setFormData(prev => ({ ...prev, declaredValue: parseFloat(e.target.value) || 0 }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="0.00"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tipo de Transporte *
                    </label>
                    <select
                      value={formData.transport}
                      onChange={(e) => setFormData(prev => ({ ...prev, transport: e.target.value as 'air' | 'sea' }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="air">Aéreo (AWB)</option>
                      <option value="sea">Marítimo (BL)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Notas adicionales */}
              <div className="border-t pt-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notas Adicionales
                </label>
                <textarea
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Información adicional sobre el paquete o instrucciones especiales..."
                />
              </div>
            </div>
            
            {/* Botones del modal */}
            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => setShowCreateModal(false)}
                disabled={isSubmitting}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreateWHR}
                disabled={isSubmitting}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
              >
                {isSubmitting && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>}
                {isSubmitting ? 'Creando...' : 'Crear WHR'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WHROperativeModule;