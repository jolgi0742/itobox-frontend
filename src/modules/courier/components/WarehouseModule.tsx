import React, { useState, useEffect } from 'react';
import {
  Package,
  Search,
  Filter,
  Plus,
  Edit3,
  Trash2,
  Eye,
  Download,
  Upload,
  QrCode,
  Scale,
  Ruler,
  DollarSign,
  MapPin,
  Calendar,
  User,
  Building,
  X,
  Save,
  FileText,
  Hash
} from 'lucide-react';

interface Product {
  id: string;
  partNumber: string;
  name: string;
  description: string;
  category: string;
  unitPrice: number;
  quantity: number;
  totalValue: number;
  weight: number;
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  location: string;
  QrCode?: string;
  supplier?: string;
  notes?: string;
}

interface WHRPackage {
  id: string;
  whrNumber: string;
  clientName: string;
  clientCompany?: string;
  consigneeName: string;
  consigneeAddress: string;
  status: 'pending' | 'classified' | 'email_sent' | 'delivered';
  transportType: 'air' | 'sea' | 'pending';
  createdDate: string;
  weight: number;
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  volume: number;
  volumeWeight: number;
  products: Product[];
  totalValue: number;
  notes?: string;
  trackingNumber?: string;
  estimatedDelivery?: string;
}

const WarehouseModule: React.FC = () => {
  const [packages, setPackages] = useState<WHRPackage[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<WHRPackage | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [newPackage, setNewPackage] = useState<Partial<WHRPackage>>({
    clientName: '',
    clientCompany: '',
    consigneeName: '',
    consigneeAddress: '',
    weight: 0,
    dimensions: { length: 0, width: 0, height: 0 },
    products: [],
    notes: '',
    trackingNumber: ''
  });

  useEffect(() => {
    // Simular carga de datos
    const mockPackages: WHRPackage[] = [
      {
        id: '1',
        whrNumber: 'WHR241216001',
        clientName: 'Juan Pérez',
        clientCompany: 'Empresa ABC',
        consigneeName: 'María González',
        consigneeAddress: 'San José, Costa Rica',
        status: 'classified',
        transportType: 'air',
        createdDate: '2024-06-16T10:30:00Z',
        weight: 15.5,
        dimensions: { length: 50, width: 30, height: 20 },
        volume: 0.03,
        volumeWeight: 32.4,
        products: [
          {
            id: '1',
            partNumber: 'PN-001-2024',
            name: 'Laptop Dell Inspiron',
            description: 'Laptop para oficina, 8GB RAM, 256GB SSD',
            category: 'Electrónicos',
            unitPrice: 850.00,
            quantity: 2,
            totalValue: 1700.00,
            weight: 4.5,
            dimensions: { length: 35, width: 25, height: 2 },
            location: 'A1-B2-C3',
            QrCode: '1234567890123',
            supplier: 'Dell Costa Rica',
            notes: 'Embalaje especial requerido'
          },
          {
            id: '2',
            partNumber: 'PN-002-2024',
            name: 'Monitor Samsung 24"',
            description: 'Monitor LED Full HD 1920x1080',
            category: 'Electrónicos',
            unitPrice: 250.00,
            quantity: 1,
            totalValue: 250.00,
            weight: 3.2,
            dimensions: { length: 60, width: 40, height: 8 },
            location: 'A1-B2-C4',
            QrCode: '2345678901234',
            supplier: 'Samsung CR'
          }
        ],
        totalValue: 1950.00,
        notes: 'Productos frágiles - Manejar con cuidado',
        trackingNumber: 'TRK001234567',
        estimatedDelivery: '2024-06-20T15:00:00Z'
      }
    ];

    setPackages(mockPackages);
  }, []);

  const calculateVolume = (length: number, width: number, height: number) => {
    return (length * width * height) * 0.000001; // Convert to cubic meters
  };

  const calculateVolumeWeight = (volume: number) => {
    return volume * 167; // Aviation standard
  };

  const addProduct = () => {
    const newProduct: Product = {
      id: Date.now().toString(),
      partNumber: '',
      name: '',
      description: '',
      category: '',
      unitPrice: 0,
      quantity: 1,
      totalValue: 0,
      weight: 0,
      dimensions: { length: 0, width: 0, height: 0 },
      location: '',
      QrCode: '',
      supplier: '',
      notes: ''
    };

    setNewPackage({
      ...newPackage,
      products: [...(newPackage.products || []), newProduct]
    });
  };

  const updateProduct = (index: number, field: string, value: any) => {
    const updatedProducts = [...(newPackage.products || [])];
    updatedProducts[index] = {
      ...updatedProducts[index],
      [field]: value
    };

    // Recalcular total si es quantity o unitPrice
    if (field === 'quantity' || field === 'unitPrice') {
      updatedProducts[index].totalValue = updatedProducts[index].quantity * updatedProducts[index].unitPrice;
    }

    setNewPackage({ ...newPackage, products: updatedProducts });
  };

  const removeProduct = (index: number) => {
    const updatedProducts = newPackage.products?.filter((_, i) => i !== index) || [];
    setNewPackage({ ...newPackage, products: updatedProducts });
  };

  const handleCreateWHR = () => {
    const volume = calculateVolume(
      newPackage.dimensions?.length || 0,
      newPackage.dimensions?.width || 0,
      newPackage.dimensions?.height || 0
    );
    const volumeWeight = calculateVolumeWeight(volume);
    const totalValue = newPackage.products?.reduce((sum, product) => sum + product.totalValue, 0) || 0;

    const whrData: WHRPackage = {
      id: Date.now().toString(),
      whrNumber: `WHR${new Date().toISOString().slice(2, 10).replace(/-/g, '')}${String(packages.length + 1).padStart(3, '0')}`,
      clientName: newPackage.clientName!,
      clientCompany: newPackage.clientCompany,
      consigneeName: newPackage.consigneeName!,
      consigneeAddress: newPackage.consigneeAddress!,
      status: 'pending',
      transportType: 'pending',
      createdDate: new Date().toISOString(),
      weight: newPackage.weight!,
      dimensions: newPackage.dimensions!,
      volume,
      volumeWeight,
      products: newPackage.products!,
      totalValue,
      notes: newPackage.notes,
      trackingNumber: newPackage.trackingNumber
    };

    setPackages([whrData, ...packages]);
    setShowCreateModal(false);
    setNewPackage({
      clientName: '',
      clientCompany: '',
      consigneeName: '',
      consigneeAddress: '',
      weight: 0,
      dimensions: { length: 0, width: 0, height: 0 },
      products: [],
      notes: '',
      trackingNumber: ''
    });

    alert(`✅ WHR ${whrData.whrNumber} creado exitosamente!`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'classified': return 'bg-blue-100 text-blue-800';
      case 'email_sent': return 'bg-green-100 text-green-800';
      case 'delivered': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredPackages = packages.filter(pkg => {
    const matchesSearch = pkg.whrNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pkg.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pkg.consigneeName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || pkg.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Warehouse Receipt (WHR)</h1>
          <p className="text-gray-600 mt-2">Gestión de recibos de almacén y productos</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          <Plus className="w-5 h-5" />
          Crear WHR
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total WHRs</p>
              <p className="text-2xl font-bold text-gray-900">{packages.length}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Valor Total</p>
              <p className="text-2xl font-bold text-green-600">
                ${packages.reduce((sum, pkg) => sum + pkg.totalValue, 0).toLocaleString()}
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Peso Total</p>
              <p className="text-2xl font-bold text-purple-600">
                {packages.reduce((sum, pkg) => sum + pkg.weight, 0).toFixed(1)} kg
              </p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <Scale className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Productos</p>
              <p className="text-2xl font-bold text-orange-600">
                {packages.reduce((sum, pkg) => sum + pkg.products.length, 0)}
              </p>
            </div>
            <div className="bg-orange-100 p-3 rounded-lg">
              <FileText className="w-6 h-6 text-orange-600" />
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
                placeholder="Buscar por WHR, cliente o consignatario..."
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
              <option value="pending">Pendiente</option>
              <option value="classified">Clasificado</option>
              <option value="email_sent">Email Enviado</option>
              <option value="delivered">Entregado</option>
            </select>
          </div>
        </div>
      </div>

      {/* WHR List */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">WHR</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Productos</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Peso/Valor</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPackages.map((pkg) => (
                <tr key={pkg.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{pkg.whrNumber}</div>
                    <div className="text-sm text-gray-500">{new Date(pkg.createdDate).toLocaleDateString()}</div>
                    {pkg.trackingNumber && (
                      <div className="text-xs text-blue-600">TRK: {pkg.trackingNumber}</div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{pkg.clientName}</div>
                    {pkg.clientCompany && (
                      <div className="text-sm text-gray-500">{pkg.clientCompany}</div>
                    )}
                    <div className="text-sm text-gray-500">→ {pkg.consigneeName}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{pkg.products.length} productos</div>
                    <div className="text-xs text-gray-500">
                      {pkg.products.slice(0, 2).map(p => p.name).join(', ')}
                      {pkg.products.length > 2 && ` +${pkg.products.length - 2} más`}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{pkg.weight} kg</div>
                    <div className="text-sm text-green-600">${pkg.totalValue.toLocaleString()}</div>
                    <div className="text-xs text-gray-500">Vol: {pkg.volume.toFixed(3)} m³</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(pkg.status)}`}>
                      {pkg.status === 'pending' ? 'Pendiente' :
                       pkg.status === 'classified' ? 'Clasificado' :
                       pkg.status === 'email_sent' ? 'Email Enviado' : 'Entregado'}
                    </span>
                    {pkg.transportType !== 'pending' && (
                      <div className="text-xs text-gray-500 mt-1">
                        {pkg.transportType === 'air' ? '✈️ Aéreo' : '🚢 Marítimo'}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedPackage(pkg);
                          setShowViewModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-800 p-1"
                        title="Ver detalles"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedPackage(pkg);
                          setShowEditModal(true);
                        }}
                        className="text-green-600 hover:text-green-800 p-1"
                        title="Editar"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => alert(`Eliminando WHR ${pkg.whrNumber}`)}
                        className="text-red-600 hover:text-red-800 p-1"
                        title="Eliminar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create WHR Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-6xl w-full max-h-[95vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-900">Crear Nuevo WHR</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Client Information */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Información del Cliente
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del Cliente *</label>
                    <input
                      type="text"
                      required
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                      value={newPackage.clientName || ''}
                      onChange={(e) => setNewPackage({
                        ...newPackage,
                        clientName: e.target.value
                      })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Empresa (Opcional)</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                      value={newPackage.clientCompany || ''}
                      onChange={(e) => setNewPackage({
                        ...newPackage,
                        clientCompany: e.target.value
                      })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Consignatario *</label>
                    <input
                      type="text"
                      required
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                      value={newPackage.consigneeName || ''}
                      onChange={(e) => setNewPackage({
                        ...newPackage,
                        consigneeName: e.target.value
                      })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Dirección del Consignatario *</label>
                    <input
                      type="text"
                      required
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                      value={newPackage.consigneeAddress || ''}
                      onChange={(e) => setNewPackage({
                        ...newPackage,
                        consigneeAddress: e.target.value
                      })}
                    />
                  </div>
                </div>
              </div>

              {/* Package Information */}
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Información del Paquete
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Peso Total (kg) *</label>
                    <input
                      type="number"
                      step="0.1"
                      required
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500"
                      value={newPackage.weight || ''}
                      onChange={(e) => setNewPackage({
                        ...newPackage,
                        weight: parseFloat(e.target.value) || 0
                      })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Largo (cm)</label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500"
                      value={newPackage.dimensions?.length || ''}
                      onChange={(e) => setNewPackage({
                        ...newPackage,
                        dimensions: {
                          ...newPackage.dimensions!,
                          length: parseInt(e.target.value) || 0
                        }
                      })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ancho (cm)</label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500"
                      value={newPackage.dimensions?.width || ''}
                      onChange={(e) => setNewPackage({
                        ...newPackage,
                        dimensions: {
                          ...newPackage.dimensions!,
                          width: parseInt(e.target.value) || 0
                        }
                      })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Alto (cm)</label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500"
                      value={newPackage.dimensions?.height || ''}
                      onChange={(e) => setNewPackage({
                        ...newPackage,
                        dimensions: {
                          ...newPackage.dimensions!,
                          height: parseInt(e.target.value) || 0
                        }
                      })}
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Número de Tracking (Opcional)</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500"
                    placeholder="Ej: TRK001234567"
                    value={newPackage.trackingNumber || ''}
                    onChange={(e) => setNewPackage({
                      ...newPackage,
                      trackingNumber: e.target.value
                    })}
                  />
                </div>
              </div>

              {/* Products List */}
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Lista de Productos
                  </h3>
                  <button
                    onClick={addProduct}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Agregar Producto
                  </button>
                </div>

                <div className="space-y-4">
                  {newPackage.products?.map((product, index) => (
                    <div key={product.id} className="bg-white p-4 rounded-lg border border-purple-200">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="font-medium text-gray-900">Producto #{index + 1}</h4>
                        <button
                          onClick={() => removeProduct(index)}
                          className="text-red-600 hover:text-red-800 p-1"
                          title="Eliminar producto"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Row 1: Basic Info */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            <Hash className="w-4 h-4 inline mr-1" />
                            Número de Partida *
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="PN-001-2024"
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500"
                            value={product.partNumber}
                            onChange={(e) => updateProduct(index, 'partNumber', e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del Producto *</label>
                          <input
                            type="text"
                            required
                            placeholder="Ej: Laptop Dell Inspiron"
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500"
                            value={product.name}
                            onChange={(e) => updateProduct(index, 'name', e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
                          <select
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500"
                            value={product.category}
                            onChange={(e) => updateProduct(index, 'category', e.target.value)}
                          >
                            <option value="">Seleccionar categoría</option>
                            <option value="Electrónicos">Electrónicos</option>
                            <option value="Ropa">Ropa</option>
                            <option value="Hogar">Hogar</option>
                            <option value="Libros">Libros</option>
                            <option value="Juguetes">Juguetes</option>
                            <option value="Otros">Otros</option>
                          </select>
                        </div>

                        {/* Row 2: Description */}
                        <div className="md:col-span-3">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            <FileText className="w-4 h-4 inline mr-1" />
                            Descripción Detallada *
                          </label>
                          <textarea
                            rows={2}
                            required
                            placeholder="Descripción completa del producto, características, modelo, etc."
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500"
                            value={product.description}
                            onChange={(e) => updateProduct(index, 'description', e.target.value)}
                          />
                        </div>

                        {/* Row 3: Quantities and Pricing */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Cantidad *</label>
                          <input
                            type="number"
                            min="1"
                            required
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500"
                            value={product.quantity}
                            onChange={(e) => updateProduct(index, 'quantity', parseInt(e.target.value) || 1)}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            <DollarSign className="w-4 h-4 inline mr-1" />
                            Valor Unitario * (USD)
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            required
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500"
                            value={product.unitPrice}
                            onChange={(e) => updateProduct(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Valor Total (USD)</label>
                          <input
                            type="number"
                            step="0.01"
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50"
                            value={product.totalValue.toFixed(2)}
                            readOnly
                          />
                        </div>

                        {/* Row 4: Physical Properties */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            <Scale className="w-4 h-4 inline mr-1" />
                            Peso (kg)
                          </label>
                          <input
                            type="number"
                            step="0.1"
                            min="0"
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500"
                            value={product.weight}
                            onChange={(e) => updateProduct(index, 'weight', parseFloat(e.target.value) || 0)}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            <MapPin className="w-4 h-4 inline mr-1" />
                            Ubicación en Almacén
                          </label>
                          <input
                            type="text"
                            placeholder="Ej: A1-B2-C3"
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500"
                            value={product.location}
                            onChange={(e) => updateProduct(index, 'location', e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            <QrCode className="w-4 h-4 inline mr-1" />
                            Código de Barras
                          </label>
                          <input
                            type="text"
                            placeholder="1234567890123"
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500"
                            value={product.QrCode}
                            onChange={(e) => updateProduct(index, 'QrCode', e.target.value)}
                          />
                        </div>

                        {/* Row 5: Dimensions */}
                        <div className="md:col-span-3">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            <Ruler className="w-4 h-4 inline mr-1" />
                            Dimensiones del Producto (cm)
                          </label>
                          <div className="grid grid-cols-3 gap-2">
                            <input
                              type="number"
                              placeholder="Largo"
                              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500"
                              value={product.dimensions.length}
                              onChange={(e) => updateProduct(index, 'dimensions', {
                                ...product.dimensions,
                                length: parseInt(e.target.value) || 0
                              })}
                            />
                            <input
                              type="number"
                              placeholder="Ancho"
                              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500"
                              value={product.dimensions.width}
                              onChange={(e) => updateProduct(index, 'dimensions', {
                                ...product.dimensions,
                                width: parseInt(e.target.value) || 0
                              })}
                            />
                            <input
                              type="number"
                              placeholder="Alto"
                              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500"
                              value={product.dimensions.height}
                              onChange={(e) => updateProduct(index, 'dimensions', {
                                ...product.dimensions,
                                height: parseInt(e.target.value) || 0
                              })}
                            />
                          </div>
                        </div>

                        {/* Row 6: Additional Info */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            <Building className="w-4 h-4 inline mr-1" />
                            Proveedor/Fabricante
                          </label>
                          <input
                            type="text"
                            placeholder="Ej: Dell Costa Rica"
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500"
                            value={product.supplier}
                            onChange={(e) => updateProduct(index, 'supplier', e.target.value)}
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Notas Especiales</label>
                          <input
                            type="text"
                            placeholder="Ej: Frágil, Requiere refrigeración, etc."
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500"
                            value={product.notes}
                            onChange={(e) => updateProduct(index, 'notes', e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  {(!newPackage.products || newPackage.products.length === 0) && (
                    <div className="text-center py-8 border-2 border-dashed border-purple-300 rounded-lg">
                      <FileText className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                      <p className="text-gray-600">No hay productos agregados</p>
                      <p className="text-sm text-gray-500">Haz clic en "Agregar Producto" para comenzar</p>
                    </div>
                  )}
                </div>

                {/* Products Summary */}
                {newPackage.products && newPackage.products.length > 0 && (
                  <div className="mt-6 pt-4 border-t border-purple-200">
                    <div className="flex justify-end">
                      <div className="w-80 space-y-2 bg-white p-4 rounded-lg">
                        <h4 className="font-semibold text-gray-900 mb-3">Resumen de Productos</h4>
                        <div className="flex justify-between">
                          <span>Total productos:</span>
                          <span>{newPackage.products.length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Cantidad total:</span>
                          <span>{newPackage.products.reduce((sum, p) => sum + p.quantity, 0)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Peso total productos:</span>
                          <span>{newPackage.products.reduce((sum, p) => sum + (p.weight * p.quantity), 0).toFixed(1)} kg</span>
                        </div>
                        <div className="flex justify-between font-bold text-lg border-t pt-2">
                          <span>Valor total:</span>
                          <span>${newPackage.products.reduce((sum, p) => sum + p.totalValue, 0).toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Notes */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Notas Adicionales</h3>
                <textarea
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-500"
                  placeholder="Instrucciones especiales, notas sobre el manejo, etc..."
                  value={newPackage.notes || ''}
                  onChange={(e) => setNewPackage({
                    ...newPackage,
                    notes: e.target.value
                  })}
                />
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
                onClick={handleCreateWHR}
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Crear WHR
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {showViewModal && selectedPackage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-6xl w-full max-h-[95vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-900">WHR {selectedPackage.whrNumber}</h2>
              <button onClick={() => setShowViewModal(false)} className="text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Header Info */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Información General</h3>
                    <p><span className="font-medium">WHR:</span> {selectedPackage.whrNumber}</p>
                    <p><span className="font-medium">Fecha:</span> {new Date(selectedPackage.createdDate).toLocaleDateString()}</p>
                    <p><span className="font-medium">Estado:</span> 
                      <span className={`ml-2 px-2 py-1 rounded-full text-xs ${getStatusColor(selectedPackage.status)}`}>
                        {selectedPackage.status}
                      </span>
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Cliente</h3>
                    <p><span className="font-medium">Nombre:</span> {selectedPackage.clientName}</p>
                    {selectedPackage.clientCompany && (
                      <p><span className="font-medium">Empresa:</span> {selectedPackage.clientCompany}</p>
                    )}
                    <p><span className="font-medium">Consignatario:</span> {selectedPackage.consigneeName}</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Métricas</h3>
                    <p><span className="font-medium">Peso:</span> {selectedPackage.weight} kg</p>
                    <p><span className="font-medium">Volumen:</span> {selectedPackage.volume.toFixed(3)} m³</p>
                    <p><span className="font-medium">Valor total:</span> ${selectedPackage.totalValue.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              {/* Products */}
              <div className="bg-white border border-gray-200 rounded-lg">
                <div className="p-4 border-b bg-gray-50">
                  <h3 className="text-lg font-semibold text-gray-900">Productos ({selectedPackage.products.length})</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Partida</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Producto</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Descripción</th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Cant.</th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Valor Unit.</th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Total</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ubicación</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {selectedPackage.products.map((product) => (
                        <tr key={product.id}>
                          <td className="px-4 py-3 text-sm font-mono text-blue-600">{product.partNumber}</td>
                          <td className="px-4 py-3">
                            <div className="text-sm font-medium text-gray-900">{product.name}</div>
                            <div className="text-xs text-gray-500">{product.category}</div>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900 max-w-xs truncate" title={product.description}>
                            {product.description}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900 text-right">{product.quantity}</td>
                          <td className="px-4 py-3 text-sm text-gray-900 text-right">${product.unitPrice.toFixed(2)}</td>
                          <td className="px-4 py-3 text-sm font-medium text-gray-900 text-right">${product.totalValue.toFixed(2)}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">{product.location || 'N/A'}</td>
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
                onClick={() => alert('Generando reporte PDF...')}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Descargar PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WarehouseModule;