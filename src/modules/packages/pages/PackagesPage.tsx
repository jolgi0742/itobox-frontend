import React, { useState, useEffect } from 'react';
import { 
  Package, Search, Filter, Plus, Eye, Edit, Trash2, MapPin, Calendar, 
  Scale, DollarSign, Truck, Clock, CheckCircle, XCircle, AlertCircle,
  RefreshCw, User, Navigation, FileText, ChevronDown, ChevronUp
} from 'lucide-react';

// Interfaces
interface PackageItem {
  id: string;
  trackingNumber: string;
  senderName: string;
  senderEmail: string;
  senderPhone: string;
  senderAddress: string;
  recipientName: string;
  recipientEmail: string;
  recipientPhone: string;
  recipientAddress: string;
  weight: number;
  dimensions: { length: number; width: number; height: number; };
  declaredValue: number;
  serviceType: 'express' | 'standard' | 'economy';
  status: 'pending' | 'picked_up' | 'in_transit' | 'out_for_delivery' | 'delivered' | 'returned' | 'cancelled';
  estimatedDelivery: string;
  actualDelivery?: string;
  specialInstructions?: string;
  isFragile: boolean;
  requiresSignature: boolean;
  insurance: number;
  pickupDate?: string;
  createdAt: string;
  updatedAt: string;
  courierName?: string;
  courierPhone?: string;
  currentLocation?: string;
  deliveryAttempts: number;
  notes?: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
}

interface PackageStats {
  total: number;
  pending: number;
  inTransit: number;
  delivered: number;
  revenue: number;
  averageWeight: number;
}

interface StatusConfig {
  color: string;
  icon: React.ComponentType<{ className?: string }>;
  text: string;
}

interface ServiceConfig {
  color: string;
  text: string;
}

interface PriorityConfig {
  color: string;
  text: string;
}
const PackagesPage: React.FC = () => {
  const [packages, setPackages] = useState<PackageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedService, setSelectedService] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [stats, setStats] = useState<PackageStats>({
    total: 0, pending: 0, inTransit: 0, delivered: 0, revenue: 0, averageWeight: 0
  });

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<PackageItem | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const [formData, setFormData] = useState<Partial<PackageItem>>({
    senderName: '', senderEmail: '', senderPhone: '', senderAddress: '',
    recipientName: '', recipientEmail: '', recipientPhone: '', recipientAddress: '',
    weight: 0, dimensions: { length: 0, width: 0, height: 0 }, declaredValue: 0,
    serviceType: 'standard', status: 'pending', isFragile: false,
    requiresSignature: false, insurance: 0, priority: 'normal', specialInstructions: ''
  });
// Datos mock
  useEffect(() => {
    const mockPackages: PackageItem[] = [
      {
        id: '1', trackingNumber: 'ITB2024001234', senderName: 'Juan Pérez',
        senderEmail: 'juan.perez@email.com', senderPhone: '+506 8888-9999',
        senderAddress: 'San José, Costa Rica, Av. Central 123',
        recipientName: 'María González', recipientEmail: 'maria.gonzalez@email.com',
        recipientPhone: '+1 305-555-0123', recipientAddress: 'Miami, FL 33166, NW 72nd St 8548',
        weight: 2.5, dimensions: { length: 30, width: 20, height: 15 }, declaredValue: 150.00,
        serviceType: 'express', status: 'in_transit', estimatedDelivery: '2024-12-20',
        isFragile: true, requiresSignature: true, insurance: 15.00, pickupDate: '2024-12-18',
        createdAt: '2024-12-18T10:30:00Z', updatedAt: '2024-12-19T14:22:00Z',
        courierName: 'Carlos Ramírez', courierPhone: '+506 7777-8888',
        currentLocation: 'Centro de Distribución Miami', deliveryAttempts: 0,
        priority: 'high', notes: 'Paquete frágil - manejar con cuidado'
      },
      {
        id: '2', trackingNumber: 'ITB2024001235', senderName: 'Tech Solutions SRL',
        senderEmail: 'ventas@techsolutions.co.cr', senderPhone: '+506 2222-3333',
        senderAddress: 'Cartago, Costa Rica, Zona Industrial',
        recipientName: 'Roberto Martinez', recipientEmail: 'roberto.martinez@company.com',
        recipientPhone: '+1 954-555-0456', recipientAddress: 'Fort Lauderdale, FL 33301, Las Olas Blvd 456',
        weight: 5.2, dimensions: { length: 45, width: 35, height: 25 }, declaredValue: 800.00,
        serviceType: 'standard', status: 'delivered', estimatedDelivery: '2024-12-17',
        actualDelivery: '2024-12-17T16:45:00Z', isFragile: false, requiresSignature: true,
        insurance: 40.00, pickupDate: '2024-12-15', createdAt: '2024-12-15T09:15:00Z',
        updatedAt: '2024-12-17T16:45:00Z', courierName: 'Ana López',
        courierPhone: '+1 954-555-0789', currentLocation: 'Entregado',
        deliveryAttempts: 1, priority: 'normal', notes: 'Entrega exitosa - firmado por destinatario'
      },
      {
        id: '3', trackingNumber: 'ITB2024001236', senderName: 'Isabella Vargas',
        senderEmail: 'isabella.vargas@personal.com', senderPhone: '+506 8765-4321',
        senderAddress: 'Alajuela, Costa Rica, Centro Comercial',
        recipientName: 'David Thompson', recipientEmail: 'david.thompson@email.com',
        recipientPhone: '+1 786-555-0987', recipientAddress: 'Coral Gables, FL 33134, Miracle Mile 789',
        weight: 1.1, dimensions: { length: 25, width: 15, height: 8 }, declaredValue: 85.00,
        serviceType: 'economy', status: 'pending', estimatedDelivery: '2024-12-25',
        isFragile: false, requiresSignature: false, insurance: 0,
        createdAt: '2024-12-19T15:20:00Z', updatedAt: '2024-12-19T15:20:00Z',
        deliveryAttempts: 0, priority: 'low', notes: 'Regalo de navidad - no urgente'
      },
      {
        id: '4', trackingNumber: 'ITB2024001237', senderName: 'Farmacia Central',
        senderEmail: 'pedidos@farmaciacentral.cr', senderPhone: '+506 2444-5555',
        senderAddress: 'Heredia, Costa Rica, Centro Médico',
        recipientName: 'Dr. Michael Rodriguez', recipientEmail: 'dr.rodriguez@medcenter.com',
        recipientPhone: '+1 305-555-1234', recipientAddress: 'Miami, FL 33131, Brickell Ave 1010',
        weight: 0.8, dimensions: { length: 20, width: 12, height: 6 }, declaredValue: 320.00,
        serviceType: 'express', status: 'out_for_delivery', estimatedDelivery: '2024-12-19',
        isFragile: true, requiresSignature: true, insurance: 25.00, pickupDate: '2024-12-18',
        createdAt: '2024-12-18T08:00:00Z', updatedAt: '2024-12-19T11:30:00Z',
        courierName: 'Luis Fernández', courierPhone: '+1 305-555-4567',
        currentLocation: 'En ruta de entrega - Miami Downtown', deliveryAttempts: 0,
        priority: 'urgent', notes: 'Medicamentos - entregar hoy obligatorio'
      },
      {
        id: '5', trackingNumber: 'ITB2024001238', senderName: 'Artesanías Típicas',
        senderEmail: 'info@artesanias.co.cr', senderPhone: '+506 2777-8888',
        senderAddress: 'Puntarenas, Costa Rica, Mercado Central',
        recipientName: 'Sarah Williams', recipientEmail: 'sarah.williams@tourism.com',
        recipientPhone: '+1 239-555-0654', recipientAddress: 'Naples, FL 34102, 5th Avenue 234',
        weight: 3.7, dimensions: { length: 40, width: 30, height: 20 }, declaredValue: 200.00,
        serviceType: 'standard', status: 'returned', estimatedDelivery: '2024-12-16',
        isFragile: true, requiresSignature: false, insurance: 10.00, pickupDate: '2024-12-14',
        createdAt: '2024-12-14T11:45:00Z', updatedAt: '2024-12-18T09:15:00Z',
        courierName: 'Pedro Jiménez', courierPhone: '+1 239-555-9876',
        currentLocation: 'Devuelto al remitente', deliveryAttempts: 3,
        priority: 'normal', notes: 'Destinatario no localizado después de 3 intentos'
      }
    ];

    setPackages(mockPackages);
    
    const totalPackages = mockPackages.length;
    const pendingCount = mockPackages.filter(p => p.status === 'pending').length;
    const inTransitCount = mockPackages.filter(p => ['picked_up', 'in_transit', 'out_for_delivery'].includes(p.status)).length;
    const deliveredCount = mockPackages.filter(p => p.status === 'delivered').length;
    const totalRevenue = mockPackages.reduce((sum, p) => sum + p.declaredValue, 0);
    const avgWeight = mockPackages.reduce((sum, p) => sum + p.weight, 0) / totalPackages;

    setStats({
      total: totalPackages, pending: pendingCount, inTransit: inTransitCount,
      delivered: deliveredCount, revenue: totalRevenue, averageWeight: avgWeight
    });

    setLoading(false);
  }, []);
// Funciones de filtrado
  const filteredPackages = packages.filter(pkg => {
    const matchesSearch = pkg.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pkg.senderName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pkg.recipientName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || pkg.status === selectedStatus;
    const matchesService = selectedService === 'all' || pkg.serviceType === selectedService;
    return matchesSearch && matchesStatus && matchesService;
  });

  // Sorting
  const sortedPackages = [...filteredPackages].sort((a, b) => {
    let aVal: any, bVal: any;
    switch (sortBy) {
      case 'trackingNumber': aVal = a.trackingNumber; bVal = b.trackingNumber; break;
      case 'senderName': aVal = a.senderName; bVal = b.senderName; break;
      case 'status': aVal = a.status; bVal = b.status; break;
      case 'weight': aVal = a.weight; bVal = b.weight; break;
      case 'declaredValue': aVal = a.declaredValue; bVal = b.declaredValue; break;
      default: aVal = a.createdAt; bVal = b.createdAt;
    }
    if (typeof aVal === 'string') {
      return sortOrder === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    }
    return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
  });

  // Paginación
  const totalPages = Math.ceil(sortedPackages.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPackages = sortedPackages.slice(startIndex, startIndex + itemsPerPage);

  // Funciones de utilidad para badges
  const getStatusBadge = (status: string) => {
    const statusConfigs: Record<string, StatusConfig> = {
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock, text: 'Pendiente' },
      picked_up: { color: 'bg-blue-100 text-blue-800', icon: Package, text: 'Recogido' },
      in_transit: { color: 'bg-purple-100 text-purple-800', icon: Truck, text: 'En Tránsito' },
      out_for_delivery: { color: 'bg-indigo-100 text-indigo-800', icon: Navigation, text: 'En Entrega' },
      delivered: { color: 'bg-green-100 text-green-800', icon: CheckCircle, text: 'Entregado' },
      returned: { color: 'bg-red-100 text-red-800', icon: XCircle, text: 'Devuelto' },
      cancelled: { color: 'bg-gray-100 text-gray-800', icon: AlertCircle, text: 'Cancelado' }
    };

    const config = statusConfigs[status] || { color: 'bg-gray-100 text-gray-800', icon: AlertCircle, text: 'Desconocido' };
    const IconComponent = config.icon;

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        <IconComponent className="w-3 h-3" />
        {config.text}
      </span>
    );
  };

  const getServiceBadge = (service: string) => {
    const serviceConfigs: Record<string, ServiceConfig> = {
      express: { color: 'bg-red-100 text-red-800', text: 'Express' },
      standard: { color: 'bg-blue-100 text-blue-800', text: 'Estándar' },
      economy: { color: 'bg-green-100 text-green-800', text: 'Económico' }
    };

    const config = serviceConfigs[service] || { color: 'bg-gray-100 text-gray-800', text: 'Desconocido' };

    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.text}
      </span>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const priorityConfigs: Record<string, PriorityConfig> = {
      low: { color: 'bg-gray-100 text-gray-600', text: 'Baja' },
      normal: { color: 'bg-blue-100 text-blue-600', text: 'Normal' },
      high: { color: 'bg-orange-100 text-orange-600', text: 'Alta' },
      urgent: { color: 'bg-red-100 text-red-600', text: 'Urgente' }
    };

    const config = priorityConfigs[priority] || { color: 'bg-gray-100 text-gray-600', text: 'Normal' };

    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.text}
      </span>
    );
  };
// Funciones de acciones
  const handleView = (pkg: PackageItem) => {
    setSelectedPackage(pkg);
    setShowViewModal(true);
  };

  const handleEdit = (pkg: PackageItem) => {
    setSelectedPackage(pkg);
    setFormData(pkg);
    setShowEditModal(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este paquete?')) {
      setPackages(packages.filter(p => p.id !== id));
    }
  };

  const handleCreate = () => {
    setFormData({
      senderName: '', senderEmail: '', senderPhone: '', senderAddress: '',
      recipientName: '', recipientEmail: '', recipientPhone: '', recipientAddress: '',
      weight: 0, dimensions: { length: 0, width: 0, height: 0 }, declaredValue: 0,
      serviceType: 'standard', status: 'pending', isFragile: false,
      requiresSignature: false, insurance: 0, priority: 'normal', specialInstructions: ''
    });
    setShowCreateModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedPackage) {
      setPackages(packages.map(p => 
        p.id === selectedPackage.id 
          ? { ...p, ...formData, updatedAt: new Date().toISOString() }
          : p
      ));
      setShowEditModal(false);
    } else {
      const newPackage: PackageItem = {
        id: Date.now().toString(),
        trackingNumber: `ITB${new Date().getFullYear()}${String(Date.now()).slice(-6)}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        deliveryAttempts: 0,
        estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        ...formData
      } as PackageItem;
      
      setPackages([newPackage, ...packages]);
      setShowCreateModal(false);
    }
    
    setSelectedPackage(null);
  };

  const handleInputChange = (field: string, value: any) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: { ...(prev[parent as keyof typeof prev] as any), [child]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedStatus('all');
    setSelectedService('all');
    setSortBy('createdAt');
    setSortOrder('desc');
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
          <span className="text-gray-600">Cargando paquetes...</span>
        </div>
      </div>
    );
  }
return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestión de Paquetes</h1>
              <p className="text-gray-600">Administra y rastrea todos los envíos del sistema</p>
            </div>
            <button
              onClick={handleCreate}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium inline-flex items-center gap-2 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Nuevo Paquete
            </button>
          </div>

          {/* Estadísticas */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
            <div className="bg-white rounded-lg p-4 shadow-sm border">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Package className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total</p>
                  <p className="text-xl font-bold text-gray-900">{stats.total}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm border">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Clock className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Pendientes</p>
                  <p className="text-xl font-bold text-gray-900">{stats.pending}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm border">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Truck className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">En Tránsito</p>
                  <p className="text-xl font-bold text-gray-900">{stats.inTransit}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm border">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Entregados</p>
                  <p className="text-xl font-bold text-gray-900">{stats.delivered}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm border">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-100 rounded-lg">
                  <DollarSign className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Ingresos</p>
                  <p className="text-xl font-bold text-gray-900">${stats.revenue.toFixed(2)}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm border">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Scale className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Peso Prom.</p>
                  <p className="text-xl font-bold text-gray-900">{stats.averageWeight.toFixed(1)} kg</p>
                </div>
              </div>
            </div>
          </div>
{/* Filtros y búsqueda */}
          <div className="bg-white rounded-lg p-4 shadow-sm border mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Buscar por tracking, remitente, destinatario..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 text-sm"
                >
                  <option value="all">Todos los estados</option>
                  <option value="pending">Pendiente</option>
                  <option value="picked_up">Recogido</option>
                  <option value="in_transit">En Tránsito</option>
                  <option value="out_for_delivery">En Entrega</option>
                  <option value="delivered">Entregado</option>
                  <option value="returned">Devuelto</option>
                  <option value="cancelled">Cancelado</option>
                </select>

                <select
                  value={selectedService}
                  onChange={(e) => setSelectedService(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 text-sm"
                >
                  <option value="all">Todos los servicios</option>
                  <option value="express">Express</option>
                  <option value="standard">Estándar</option>
                  <option value="economy">Económico</option>
                </select>

                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="px-3 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 text-sm inline-flex items-center gap-2"
                >
                  <Filter className="w-4 h-4" />
                  Filtros
                  {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>

                <button
                  onClick={resetFilters}
                  className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm"
                >
                  Limpiar
                </button>
              </div>
            </div>

            {/* Filtros expandidos */}
            {showFilters && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ordenar por</label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="createdAt">Fecha de creación</option>
                      <option value="trackingNumber">Número de tracking</option>
                      <option value="senderName">Remitente</option>
                      <option value="status">Estado</option>
                      <option value="weight">Peso</option>
                      <option value="declaredValue">Valor declarado</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Orden</label>
                    <select
                      value={sortOrder}
                      onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="desc">Descendente</option>
                      <option value="asc">Ascendente</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Items por página</label>
                    <select
                      value={itemsPerPage}
                      onChange={() => setCurrentPage(1)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value={10}>10</option>
                      <option value={25}>25</option>
                      <option value={50}>50</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
{/* Tabla de paquetes */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tracking</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Remitente</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Destinatario</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Servicio</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Peso</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedPackages.map((pkg) => (
                  <tr key={pkg.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <div className="text-sm font-medium text-gray-900">{pkg.trackingNumber}</div>
                        <div className="text-xs text-gray-500">{getPriorityBadge(pkg.priority)}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8">
                          <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                            <User className="h-4 w-4 text-blue-600" />
                          </div>
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">{pkg.senderName}</div>
                          <div className="text-sm text-gray-500">{pkg.senderEmail}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8">
                          <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                            <MapPin className="h-4 w-4 text-green-600" />
                          </div>
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">{pkg.recipientName}</div>
                          <div className="text-sm text-gray-500 truncate max-w-32">{pkg.recipientAddress}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(pkg.status)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{getServiceBadge(pkg.serviceType)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center gap-1">
                        <Scale className="w-4 h-4 text-gray-400" />
                        {pkg.weight} kg
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4 text-gray-400" />
                        {pkg.declaredValue.toFixed(2)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        {new Date(pkg.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleView(pkg)}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded transition-colors"
                          title="Ver detalles"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEdit(pkg)}
                          className="text-indigo-600 hover:text-indigo-900 p-1 rounded transition-colors"
                          title="Editar"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(pkg.id)}
                          className="text-red-600 hover:text-red-900 p-1 rounded transition-colors"
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
{/* Paginación */}
          {totalPages > 1 && (
            <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm text-gray-700">
                  <span>
                    Mostrando {startIndex + 1} a {Math.min(startIndex + itemsPerPage, filteredPackages.length)} de{' '}
                    {filteredPackages.length} resultados
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Anterior
                  </button>
                  
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const page = i + Math.max(1, currentPage - 2);
                    if (page > totalPages) return null;
                    
                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-1 text-sm border rounded ${
                          currentPage === page
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'border-gray-300 hover:bg-gray-100'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                  
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Siguiente
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
{/* Modal Ver Paquete */}
        {showViewModal && selectedPackage && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900">
                    Detalles del Paquete #{selectedPackage.trackingNumber}
                  </h2>
                  <button
                    onClick={() => setShowViewModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XCircle className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Información del remitente */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <User className="w-5 h-5" />
                      Información del Remitente
                    </h3>
                    <div className="space-y-2">
                      <div>
                        <span className="text-sm text-gray-600">Nombre:</span>
                        <p className="font-medium">{selectedPackage.senderName}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Email:</span>
                        <p className="font-medium">{selectedPackage.senderEmail}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Teléfono:</span>
                        <p className="font-medium">{selectedPackage.senderPhone}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Dirección:</span>
                        <p className="font-medium">{selectedPackage.senderAddress}</p>
                      </div>
                    </div>
                  </div>

                  {/* Información del destinatario */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <MapPin className="w-5 h-5" />
                      Información del Destinatario
                    </h3>
                    <div className="space-y-2">
                      <div>
                        <span className="text-sm text-gray-600">Nombre:</span>
                        <p className="font-medium">{selectedPackage.recipientName}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Email:</span>
                        <p className="font-medium">{selectedPackage.recipientEmail}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Teléfono:</span>
                        <p className="font-medium">{selectedPackage.recipientPhone}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Dirección:</span>
                        <p className="font-medium">{selectedPackage.recipientAddress}</p>
                      </div>
                    </div>
                  </div>

                  {/* Detalles del paquete */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Package className="w-5 h-5" />
                      Detalles del Paquete
                    </h3>
                    <div className="space-y-2">
                      <div>
                        <span className="text-sm text-gray-600">Peso:</span>
                        <p className="font-medium">{selectedPackage.weight} kg</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Dimensiones:</span>
                        <p className="font-medium">
                          {selectedPackage.dimensions.length} x {selectedPackage.dimensions.width} x {selectedPackage.dimensions.height} cm
                        </p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Valor declarado:</span>
                        <p className="font-medium">${selectedPackage.declaredValue.toFixed(2)}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Seguro:</span>
                        <p className="font-medium">${selectedPackage.insurance.toFixed(2)}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600">Frágil:</span>
                          {selectedPackage.isFragile ? (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          ) : (
                            <XCircle className="w-4 h-4 text-gray-400" />
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600">Requiere firma:</span>
                          {selectedPackage.requiresSignature ? (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          ) : (
                            <XCircle className="w-4 h-4 text-gray-400" />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Estado y tracking */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Truck className="w-5 h-5" />
                      Estado y Tracking
                    </h3>
                    <div className="space-y-2">
                      <div>
                        <span className="text-sm text-gray-600">Estado actual:</span>
                        <div className="mt-1">{getStatusBadge(selectedPackage.status)}</div>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Servicio:</span>
                        <div className="mt-1">{getServiceBadge(selectedPackage.serviceType)}</div>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Prioridad:</span>
                        <div className="mt-1">{getPriorityBadge(selectedPackage.priority)}</div>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Entrega estimada:</span>
                        <p className="font-medium">{new Date(selectedPackage.estimatedDelivery).toLocaleDateString()}</p>
                      </div>
                      {selectedPackage.currentLocation && (
                        <div>
                          <span className="text-sm text-gray-600">Ubicación actual:</span>
                          <p className="font-medium">{selectedPackage.currentLocation}</p>
                        </div>
                      )}
                      <div>
                        <span className="text-sm text-gray-600">Intentos de entrega:</span>
                        <p className="font-medium">{selectedPackage.deliveryAttempts}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Courier asignado */}
                {selectedPackage.courierName && (
                  <div className="mt-6 bg-blue-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <User className="w-5 h-5" />
                      Courier Asignado
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <span className="text-sm text-gray-600">Nombre:</span>
                        <p className="font-medium">{selectedPackage.courierName}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Teléfono:</span>
                        <p className="font-medium">{selectedPackage.courierPhone}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Notas especiales */}
                {selectedPackage.notes && (
                  <div className="mt-6 bg-yellow-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      Notas Especiales
                    </h3>
                    <p className="text-gray-700">{selectedPackage.notes}</p>
                  </div>
                )}

                {/* Instrucciones especiales */}
                {selectedPackage.specialInstructions && (
                  <div className="mt-6 bg-purple-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <AlertCircle className="w-5 h-5" />
                      Instrucciones Especiales
                    </h3>
                    <p className="text-gray-700">{selectedPackage.specialInstructions}</p>
                  </div>
                )}
              </div>

              <div className="p-6 border-t border-gray-200">
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setShowViewModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Cerrar
                  </button>
                  <button
                    onClick={() => {
                      setShowViewModal(false);
                      handleEdit(selectedPackage);
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Editar Paquete
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
{/* Modal Crear/Editar Paquete */}
        {(showCreateModal || showEditModal) && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900">
                    {selectedPackage ? 'Editar Paquete' : 'Crear Nuevo Paquete'}
                  </h2>
                  <button
                    onClick={() => {
                      setShowCreateModal(false);
                      setShowEditModal(false);
                      setSelectedPackage(null);
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XCircle className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Información del remitente */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                      <User className="w-5 h-5" />
                      Información del Remitente
                    </h3>
                    
                    <input
                      type="text"
                      required
                      value={formData.senderName || ''}
                      onChange={(e) => handleInputChange('senderName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Nombre del remitente"
                    />

                    <input
                      type="email"
                      required
                      value={formData.senderEmail || ''}
                      onChange={(e) => handleInputChange('senderEmail', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Email del remitente"
                    />

                    <input
                      type="tel"
                      required
                      value={formData.senderPhone || ''}
                      onChange={(e) => handleInputChange('senderPhone', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Teléfono del remitente"
                    />

                    <textarea
                      required
                      rows={3}
                      value={formData.senderAddress || ''}
                      onChange={(e) => handleInputChange('senderAddress', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Dirección completa del remitente"
                    />
                  </div>

                  {/* Información del destinatario */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                      <MapPin className="w-5 h-5" />
                      Información del Destinatario
                    </h3>
                    
                    <input
                      type="text"
                      required
                      value={formData.recipientName || ''}
                      onChange={(e) => handleInputChange('recipientName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Nombre del destinatario"
                    />

                    <input
                      type="email"
                      required
                      value={formData.recipientEmail || ''}
                      onChange={(e) => handleInputChange('recipientEmail', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Email del destinatario"
                    />

                    <input
                      type="tel"
                      required
                      value={formData.recipientPhone || ''}
                      onChange={(e) => handleInputChange('recipientPhone', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Teléfono del destinatario"
                    />

                    <textarea
                      required
                      rows={3}
                      value={formData.recipientAddress || ''}
                      onChange={(e) => handleInputChange('recipientAddress', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Dirección completa del destinatario"
                    />
                  </div>
                </div>
{/* Detalles del paquete */}
                <div className="mt-6 space-y-4">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    Detalles del Paquete
                  </h3>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      required
                      value={formData.weight || ''}
                      onChange={(e) => handleInputChange('weight', parseFloat(e.target.value) || 0)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Peso (kg)"
                    />

                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      required
                      value={formData.dimensions?.length || ''}
                      onChange={(e) => handleInputChange('dimensions.length', parseFloat(e.target.value) || 0)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Largo (cm)"
                    />

                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      required
                      value={formData.dimensions?.width || ''}
                      onChange={(e) => handleInputChange('dimensions.width', parseFloat(e.target.value) || 0)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Ancho (cm)"
                    />

                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      required
                      value={formData.dimensions?.height || ''}
                      onChange={(e) => handleInputChange('dimensions.height', parseFloat(e.target.value) || 0)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Alto (cm)"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      required
                      value={formData.declaredValue || ''}
                      onChange={(e) => handleInputChange('declaredValue', parseFloat(e.target.value) || 0)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Valor declarado ($)"
                    />

                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.insurance || ''}
                      onChange={(e) => handleInputChange('insurance', parseFloat(e.target.value) || 0)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Seguro ($)"
                    />

                    <select
                      required
                      value={formData.serviceType || 'standard'}
                      onChange={(e) => handleInputChange('serviceType', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="economy">Económico (5-7 días)</option>
                      <option value="standard">Estándar (3-5 días)</option>
                      <option value="express">Express (1-2 días)</option>
                    </select>

                    <select
                      value={formData.priority || 'normal'}
                      onChange={(e) => handleInputChange('priority', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="low">Baja prioridad</option>
                      <option value="normal">Normal</option>
                      <option value="high">Alta prioridad</option>
                      <option value="urgent">Urgente</option>
                    </select>
                  </div>

                  <div className="flex gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.isFragile || false}
                        onChange={(e) => handleInputChange('isFragile', e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">Paquete frágil</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.requiresSignature || false}
                        onChange={(e) => handleInputChange('requiresSignature', e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">Requiere firma</span>
                    </label>
                  </div>

                  <textarea
                    rows={3}
                    value={formData.specialInstructions || ''}
                    onChange={(e) => handleInputChange('specialInstructions', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Instrucciones especiales para el manejo del paquete..."
                  />
                </div>

                {/* Botones de acción */}
                <div className="mt-8 flex justify-end gap-3 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateModal(false);
                      setShowEditModal(false);
                      setSelectedPackage(null);
                    }}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {selectedPackage ? 'Actualizar Paquete' : 'Crear Paquete'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Mensajes de estado */}
        {filteredPackages.length === 0 && !loading && (
          <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron paquetes</h3>
            <p className="text-gray-500 mb-6">
              {searchTerm || selectedStatus !== 'all' || selectedService !== 'all'
                ? 'Intenta ajustar los filtros de búsqueda.'
                : 'Comienza creando tu primer paquete.'}
            </p>
            {!searchTerm && selectedStatus === 'all' && selectedService === 'all' && (
              <button
                onClick={handleCreate}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium inline-flex items-center gap-2 transition-colors"
              >
                <Plus className="w-5 h-5" />
                Crear Primer Paquete
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PackagesPage;