// src/modules/courier/components/ConsolidationModule.tsx
import React, { useState } from 'react';
import { 
  Package, 
  Plus, 
  Search, 
  Filter, 
  Truck, 
  Plane, 
  Ship, 
  Lock, 
  Unlock, 
  FileText, 
  Calendar, 
  MapPin, 
  Scale, // ✅ Cambiado de Weight
  Users,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';

interface ConsolidatedShipment {
  id: string;
  manifestNumber: string;
  destination: string;
  transportType: string;
  status: string;
  packages: ConsolidatedPackage[];
  totalWeight: number;
  totalVolume: number;
  createdDate: string;
  estimatedDeparture: string;
  actualDeparture?: string;
  notes: string;
}

interface ConsolidatedPackage {
  id: string;
  trackingNumber: string;
  clientName: string;
  weight: number;
  volume: number;
  description: string;
}

interface NewConsolidation {
  destination: string;
  transportType: string;
  estimatedDeparture: string;
  description: string;
  selectedPackages: string[];
}

const ConsolidationModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'consolidations' | 'packages' | 'manifests'>('consolidations');
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewConsolidationModal, setShowNewConsolidationModal] = useState(false);
  const [selectedPackages, setSelectedPackages] = useState<string[]>([]);

  const [newConsolidation, setNewConsolidation] = useState<NewConsolidation>({
    destination: 'Venezuela',
    transportType: 'air',
    estimatedDeparture: '',
    description: '',
    selectedPackages: []
  });

  // Mock data para consolidaciones
  const [consolidations] = useState<ConsolidatedShipment[]>([
    {
      id: '1',
      manifestNumber: 'MAN-2024-001',
      destination: 'Venezuela',
      transportType: 'air',
      status: 'Abierto',
      packages: [
        { id: '1', trackingNumber: 'UPS123456', clientName: 'Juan Pérez', weight: 5.2, volume: 2.1, description: 'Electrónicos' },
        { id: '2', trackingNumber: 'FDX789012', clientName: 'María García', weight: 3.8, volume: 1.5, description: 'Ropa' }
      ],
      totalWeight: 9.0,
      totalVolume: 3.6,
      createdDate: '2024-12-15',
      estimatedDeparture: '2024-12-20',
      notes: 'Envío regular programado'
    },
    {
      id: '2',
      manifestNumber: 'MAN-2024-002',
      destination: 'Colombia',
      transportType: 'maritime',
      status: 'Cerrado',
      packages: [
        { id: '3', trackingNumber: 'DHL345678', clientName: 'Carlos López', weight: 12.5, volume: 8.2, description: 'Muebles' },
        { id: '4', trackingNumber: 'UPS901234', clientName: 'Ana Ruiz', weight: 7.3, volume: 4.1, description: 'Electrodomésticos' }
      ],
      totalWeight: 19.8,
      totalVolume: 12.3,
      createdDate: '2024-12-10',
      estimatedDeparture: '2024-12-25',
      actualDeparture: '2024-12-24',
      notes: 'Envío marítimo completo'
    }
  ]);

  // Paquetes disponibles para consolidar
  const [availablePackages] = useState([
    { id: '5', trackingNumber: 'UPS555666', clientName: 'Pedro Morales', weight: 4.2, volume: 1.8, description: 'Libros', status: 'ready' },
    { id: '6', trackingNumber: 'FDX777888', clientName: 'Lucia Fernández', weight: 6.1, volume: 2.9, description: 'Juguetes', status: 'ready' },
    { id: '7', trackingNumber: 'DHL999000', clientName: 'Roberto Silva', weight: 8.5, volume: 5.2, description: 'Herramientas', status: 'ready' }
  ]);

  const getStatusIcon = (status: string) => { // ✅ Corregido con tipo
    switch(status) {
      case 'Abierto': return <Unlock size={16} color="#10b981" />;
      case 'Cerrado': return <Lock size={16} color="#ef4444" />;
      case 'En Tránsito': return <Truck size={16} color="#3b82f6" />;
      case 'Entregado': return <Package size={16} color="#8b5cf6" />;
      default: return <Package size={16} color="#6b7280" />;
    }
  };

  const getStatusColor = (status: string) => { // ✅ Corregido con tipo
    switch(status) {
      case 'Abierto': return '#10b981';
      case 'Cerrado': return '#ef4444';
      case 'En Tránsito': return '#3b82f6';
      case 'Entregado': return '#8b5cf6';
      default: return '#6b7280';
    }
  };

  const getTypeIcon = (type: string) => { // ✅ Corregido con tipo
    switch(type) {
      case 'Aéreo': return <Plane size={16} color="#3b82f6" />;
      case 'Marítimo': return <Ship size={16} color="#0ea5e9" />;
      case 'Terrestre': return <Truck size={16} color="#059669" />;
      default: return <Truck size={16} color="#6b7280" />;
    }
  };

  const createConsolidation = () => {
    const selectedPkgs = availablePackages.filter(pkg => 
      newConsolidation.selectedPackages.includes(pkg.id)
    );

    const consolidation: ConsolidatedShipment = {
      id: Date.now().toString(),
      manifestNumber: `MAN-2024-${String(consolidations.length + 1).padStart(3, '0')}`,
      destination: newConsolidation.destination,
      transportType: newConsolidation.transportType,
      status: 'Abierto',
      packages: selectedPkgs.map(pkg => ({
        id: pkg.id,
        trackingNumber: pkg.trackingNumber,
        clientName: pkg.clientName,
        weight: pkg.weight,
        volume: pkg.volume,
        description: pkg.description
      })),
      totalWeight: selectedPkgs.reduce((sum, pkg) => sum + pkg.weight, 0),
      totalVolume: selectedPkgs.reduce((sum, pkg) => sum + pkg.volume, 0),
      createdDate: new Date().toISOString().split('T')[0],
      estimatedDeparture: newConsolidation.estimatedDeparture,
      notes: newConsolidation.description
    };

    console.log('Creando consolidación:', consolidation);
    setShowNewConsolidationModal(false);
    setNewConsolidation({
      destination: 'Venezuela',
      transportType: 'air',
      estimatedDeparture: '',
      description: '',
      selectedPackages: []
    });
  };

  const filteredConsolidations = consolidations.filter(cons =>
    cons.manifestNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cons.destination.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Package className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Consolidación de Envíos</h2>
              <p className="text-sm text-gray-500">Gestión de manifiestos y consolidaciones</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setShowNewConsolidationModal(true)}
              className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors flex items-center"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nueva Consolidación
            </button>
          </div>
        </div>

        {/* Pestañas */}
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('consolidations')}
            className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'consolidations'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Package className="h-4 w-4 inline mr-2" />
            Consolidaciones
          </button>
          <button
            onClick={() => setActiveTab('packages')}
            className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'packages'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Scale className="h-4 w-4 inline mr-2" />
            Paquetes Disponibles
          </button>
          <button
            onClick={() => setActiveTab('manifests')}
            className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'manifests'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <FileText className="h-4 w-4 inline mr-2" />
            Manifiestos
          </button>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
          <Package size={32} color="#ea580c" style={{ marginBottom: '12px', margin: '0 auto' }} />
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#1f2937', marginTop: '12px' }}>
            {consolidations.length}
          </div>
          <div style={{ color: '#64748b' }}>Consolidaciones</div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
          <Unlock size={32} color="#10b981" style={{ marginBottom: '12px', margin: '0 auto' }} />
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#1f2937', marginTop: '12px' }}>
            {consolidations.filter(c => c.status === 'Abierto').length}
          </div>
          <div style={{ color: '#64748b' }}>Abiertas</div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
          <Scale size={32} color="#3b82f6" style={{ marginBottom: '12px', margin: '0 auto' }} />
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#1f2937', marginTop: '12px' }}>
            {consolidations.reduce((sum, c) => sum + c.totalWeight, 0).toFixed(1)} Lb
          </div>
          <div style={{ color: '#64748b' }}>Peso Total</div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
          <Package size={32} color="#8b5cf6" style={{ marginBottom: '12px', margin: '0 auto' }} />
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#1f2937', marginTop: '12px' }}>
            {consolidations.reduce((sum, c) => sum + c.packages.length, 0)}
          </div>
          <div style={{ color: '#64748b' }}>Paquetes</div>
        </div>
      </div>

      {/* Barra de búsqueda */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Buscar por manifiesto, destino..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex space-x-2">
            <button className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 flex items-center">
              <Filter className="h-4 w-4 mr-2" />
              Filtros
            </button>
          </div>
        </div>
      </div>

      {/* Contenido según pestaña activa */}
      {activeTab === 'consolidations' && (
        <div className="space-y-4">
          {filteredConsolidations.map((consolidation) => (
            <div key={consolidation.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(consolidation.status)}
                    <span className="font-medium text-lg">{consolidation.manifestNumber}</span>
                  </div>
                  <span 
                    className="px-3 py-1 text-sm font-medium rounded-full"
                    style={{ 
                      backgroundColor: getStatusColor(consolidation.status) + '20',
                      color: getStatusColor(consolidation.status)
                    }}
                  >
                    {consolidation.status}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-400 hover:text-gray-600">
                    <Eye className="h-4 w-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600">
                    <Edit className="h-4 w-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-red-600">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">Destino: {consolidation.destination}</span>
                </div>
                <div className="flex items-center space-x-2">
                  {getTypeIcon(consolidation.transportType)}
                  <span className="text-sm text-gray-600">
                    {consolidation.transportType === 'air' ? 'Aéreo' : 
                     consolidation.transportType === 'maritime' ? 'Marítimo' : 'Terrestre'}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Scale className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{consolidation.totalWeight.toFixed(1)} Lb</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    Salida: {consolidation.estimatedDeparture}
                  </span>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <h4 className="font-medium text-gray-900 mb-2">
                  Paquetes ({consolidation.packages.length})
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {consolidation.packages.map((pkg) => (
                    <div key={pkg.id} className="bg-gray-50 rounded-md p-3">
                      <div className="font-medium text-sm">{pkg.trackingNumber}</div>
                      <div className="text-xs text-gray-600">{pkg.clientName}</div>
                      <div className="text-xs text-gray-500">{pkg.weight} Lb • {pkg.description}</div>
                    </div>
                  ))}
                </div>
              </div>

              {consolidation.notes && (
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <p className="text-sm text-gray-600">{consolidation.notes}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {activeTab === 'packages' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Paquetes Disponibles para Consolidar</h3>
            <div className="space-y-3">
              {availablePackages.map((pkg) => (
                <div key={pkg.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <input 
                        type="checkbox"
                        checked={selectedPackages.includes(pkg.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedPackages([...selectedPackages, pkg.id]);
                          } else {
                            setSelectedPackages(selectedPackages.filter(id => id !== pkg.id));
                          }
                        }}
                        className="h-4 w-4 text-orange-600 rounded"
                      />
                      <div>
                        <div className="font-medium text-gray-900">{pkg.trackingNumber}</div>
                        <div className="text-sm text-gray-500">{pkg.clientName}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900">{pkg.weight} Lb</div>
                        <div className="text-xs text-gray-500">{pkg.volume} CF</div>
                      </div>
                      <div className="text-sm text-gray-600">{pkg.description}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {selectedPackages.length > 0 && (
              <div className="mt-4 p-4 bg-orange-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-orange-800">
                    {selectedPackages.length} paquete(s) seleccionado(s)
                  </span>
                  <button
                    onClick={() => setShowNewConsolidationModal(true)}
                    className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700"
                  >
                    Crear Consolidación
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'manifests' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Manifiestos Generados</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Manifiesto
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Destino
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Transporte
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Paquetes
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Peso Total
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
                  {consolidations.map((consolidation) => (
                    <tr key={consolidation.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{consolidation.manifestNumber}</div>
                        <div className="text-sm text-gray-500">{consolidation.createdDate}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {consolidation.destination}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getTypeIcon(consolidation.transportType)}
                          <span className="ml-2 text-sm text-gray-900">
                            {consolidation.transportType === 'air' ? 'Aéreo' : 
                             consolidation.transportType === 'maritime' ? 'Marítimo' : 'Terrestre'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {consolidation.packages.length}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {consolidation.totalWeight.toFixed(1)} Lb
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span 
                          className="px-2 py-1 text-xs font-medium rounded-full"
                          style={{ 
                            backgroundColor: getStatusColor(consolidation.status) + '20',
                            color: getStatusColor(consolidation.status)
                          }}
                        >
                          {consolidation.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button className="text-orange-600 hover:text-orange-900 mr-3">
                          Descargar
                        </button>
                        <button className="text-gray-600 hover:text-gray-900">
                          Ver
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Modal Nueva Consolidación */}
      {showNewConsolidationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl m-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Nueva Consolidación</h3>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Destino
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    value={newConsolidation.destination}
                    onChange={(e) => setNewConsolidation({...newConsolidation, destination: e.target.value})}
                  >
                    <option value="Venezuela">Venezuela</option>
                    <option value="Colombia">Colombia</option>
                    <option value="Panama">Panamá</option>
                    <option value="Ecuador">Ecuador</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de Transporte
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    value={newConsolidation.transportType}
                    onChange={(e) => setNewConsolidation({...newConsolidation, transportType: e.target.value})}
                  >
                    <option value="air">Aéreo</option>
                    <option value="maritime">Marítimo</option>
                    <option value="ground">Terrestre</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha Estimada de Salida
                </label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  value={newConsolidation.estimatedDeparture}
                  onChange={(e) => setNewConsolidation({...newConsolidation, estimatedDeparture: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción
                </label>
                <textarea 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  rows={3} // ✅ Corregido: rows={3} en lugar de rows="3"
                  value={newConsolidation.description}
                  onChange={(e) => setNewConsolidation({...newConsolidation, description: e.target.value})}
                  placeholder="Descripción opcional de la consolidación..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Paquetes Seleccionados ({selectedPackages.length})
                </label>
                <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-md p-3">
                  {selectedPackages.length > 0 ? (
                    selectedPackages.map(id => {
                      const pkg = availablePackages.find(p => p.id === id);
                      return pkg ? (
                        <div key={id} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                          <div>
                            <div className="font-medium text-sm">{pkg.trackingNumber}</div>
                            <div className="text-xs text-gray-500">{pkg.clientName}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm">{pkg.weight} Lb</div>
                            <div className="text-xs text-gray-500">{pkg.volume} CF</div>
                          </div>
                        </div>
                      ) : null;
                    })
                  ) : (
                    <div className="text-center text-gray-500 py-4">
                      No hay paquetes seleccionados
                    </div>
                  )}
                </div>
              </div>

              {selectedPackages.length > 0 && (
                <div className="bg-orange-50 rounded-lg p-4">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-lg font-bold text-orange-600">
                        {selectedPackages.length}
                      </div>
                      <div className="text-sm text-orange-800">Paquetes</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-orange-600">
                        {availablePackages
                          .filter(pkg => selectedPackages.includes(pkg.id))
                          .reduce((sum, pkg) => sum + pkg.weight, 0)
                          .toFixed(1)} Lb
                      </div>
                      <div className="text-sm text-orange-800">Peso Total</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-orange-600">
                        {availablePackages
                          .filter(pkg => selectedPackages.includes(pkg.id))
                          .reduce((sum, pkg) => sum + pkg.volume, 0)
                          .toFixed(1)} CF
                      </div>
                      <div className="text-sm text-orange-800">Volumen Total</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowNewConsolidationModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={createConsolidation}
                disabled={selectedPackages.length === 0}
                className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Crear Consolidación
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConsolidationModule;