import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Truck, 
  Eye, 
  Edit3, 
  Trash2,
  Phone,
  Mail,
  MapPin,
  Star,
  Clock,
  Package,
  DollarSign,
  Calendar,
  User,
  Car,
  FileText,
  X,
  CheckCircle,
  AlertTriangle,
  XCircle
} from 'lucide-react';

interface Courier {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  licenseNumber: string;
  vehicleType: 'motorcycle' | 'car' | 'truck' | 'bicycle';
  vehicleModel: string;
  vehiclePlate: string;
  status: 'available' | 'busy' | 'offline' | 'suspended';
  rating: number;
  totalDeliveries: number;
  completedToday: number;
  currentOrders: number;
  totalEarnings: number;
  joinDate: string;
  lastActiveDate: string;
  specializations: string[];
  workingHours: {
    start: string;
    end: string;
  };
  emergencyContact: {
    name: string;
    phone: string;
  };
  notes?: string;
}

const CouriersPage: React.FC = () => {
  const [couriers, setCouriers] = useState<Courier[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterVehicle, setFilterVehicle] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedCourier, setSelectedCourier] = useState<Courier | null>(null);
  const [newCourier, setNewCourier] = useState<Partial<Courier>>({
    name: '',
    email: '',
    phone: '',
    address: '',
    licenseNumber: '',
    vehicleType: 'motorcycle',
    vehicleModel: '',
    vehiclePlate: '',
    specializations: [],
    workingHours: { start: '08:00', end: '18:00' },
    emergencyContact: { name: '', phone: '' },
    notes: ''
  });

  useEffect(() => {
    // Simular carga de datos
    const mockCouriers: Courier[] = [
      {
        id: '1',
        name: 'Carlos Rodríguez Mora',
        email: 'carlos.rodriguez@courier.com',
        phone: '+506 8888-9999',
        address: 'San José Centro, Costa Rica',
        licenseNumber: 'A1-123456-2024',
        vehicleType: 'motorcycle',
        vehicleModel: 'Honda CB190R',
        vehiclePlate: 'SJ-1234',
        status: 'busy',
        rating: 4.8,
        totalDeliveries: 1250,
        completedToday: 8,
        currentOrders: 3,
        totalEarnings: 15750.50,
        joinDate: '2023-06-15T10:30:00Z',
        lastActiveDate: '2024-06-16T14:20:00Z',
        specializations: ['Documentos', 'Paquetes frágiles', 'Express'],
        workingHours: { start: '07:00', end: '19:00' },
        emergencyContact: { name: 'Ana Rodríguez', phone: '+506 7777-8888' },
        notes: 'Courier experimentado, excelente para entregas express'
      },
      {
        id: '2',
        name: 'Ana Vargas López',
        email: 'ana.vargas@courier.com',
        phone: '+506 7777-8888',
        address: 'Cartago Centro, Costa Rica',
        licenseNumber: 'B2-789012-2024',
        vehicleType: 'car',
        vehicleModel: 'Toyota Yaris',
        vehiclePlate: 'CT-5678',
        status: 'available',
        rating: 4.9,
        totalDeliveries: 890,
        completedToday: 5,
        currentOrders: 0,
        totalEarnings: 12850.25,
        joinDate: '2023-08-20T08:15:00Z',
        lastActiveDate: '2024-06-16T15:45:00Z',
        specializations: ['Paquetes grandes', 'Múltiples destinos'],
        workingHours: { start: '08:00', end: '17:00' },
        emergencyContact: { name: 'Luis Vargas', phone: '+506 6666-7777' },
        notes: 'Excelente para paquetes grandes, muy puntual'
      },
      {
        id: '3',
        name: 'Luis Morales Castro',
        email: 'luis.morales@courier.com',
        phone: '+506 6666-7777',
        address: 'Heredia, Costa Rica',
        licenseNumber: 'C3-345678-2024',
        vehicleType: 'truck',
        vehicleModel: 'Isuzu NPR',
        vehiclePlate: 'HD-9012',
        status: 'available',
        rating: 4.7,
        totalDeliveries: 650,
        completedToday: 2,
        currentOrders: 1,
        totalEarnings: 18200.75,
        joinDate: '2023-09-10T12:00:00Z',
        lastActiveDate: '2024-06-16T13:30:00Z',
        specializations: ['Carga pesada', 'Mudanzas', 'Consolidados'],
        workingHours: { start: '06:00', end: '16:00' },
        emergencyContact: { name: 'María Morales', phone: '+506 5555-6666' },
        notes: 'Especialista en carga pesada y consolidados'
      },
      {
        id: '4',
        name: 'Patricia Jiménez Solano',
        email: 'patricia.jimenez@courier.com',
        phone: '+506 5555-6666',
        address: 'Alajuela Centro, Costa Rica',
        licenseNumber: 'A2-901234-2024',
        vehicleType: 'motorcycle',
        vehicleModel: 'Yamaha FZ25',
        vehiclePlate: 'AL-3456',
        status: 'offline',
        rating: 4.6,
        totalDeliveries: 420,
        completedToday: 0,
        currentOrders: 0,
        totalEarnings: 6850.00,
        joinDate: '2024-01-20T09:00:00Z',
        lastActiveDate: '2024-06-15T18:00:00Z',
        specializations: ['Documentos', 'Centro de Alajuela'],
        workingHours: { start: '09:00', end: '18:00' },
        emergencyContact: { name: 'Roberto Jiménez', phone: '+506 4444-5555' },
        notes: 'Courier nueva, en proceso de entrenamiento'
      }
    ];

    setCouriers(mockCouriers);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'busy': return 'bg-yellow-100 text-yellow-800';
      case 'offline': return 'bg-gray-100 text-gray-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available': return <CheckCircle className="w-4 h-4" />;
      case 'busy': return <Clock className="w-4 h-4" />;
      case 'offline': return <XCircle className="w-4 h-4" />;
      case 'suspended': return <AlertTriangle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getVehicleIcon = (vehicleType: string) => {
    switch (vehicleType) {
      case 'motorcycle': return '🏍️';
      case 'car': return '🚗';
      case 'truck': return '🚛';
      case 'bicycle': return '🚲';
      default: return '🚗';
    }
  };

  const handleCreateCourier = () => {
    const courierData: Courier = {
      id: Date.now().toString(),
      name: newCourier.name!,
      email: newCourier.email!,
      phone: newCourier.phone!,
      address: newCourier.address!,
      licenseNumber: newCourier.licenseNumber!,
      vehicleType: newCourier.vehicleType!,
      vehicleModel: newCourier.vehicleModel!,
      vehiclePlate: newCourier.vehiclePlate!,
      status: 'offline',
      rating: 5.0,
      totalDeliveries: 0,
      completedToday: 0,
      currentOrders: 0,
      totalEarnings: 0,
      joinDate: new Date().toISOString(),
      lastActiveDate: new Date().toISOString(),
      specializations: newCourier.specializations || [],
      workingHours: newCourier.workingHours!,
      emergencyContact: newCourier.emergencyContact!,
      notes: newCourier.notes
    };

    setCouriers([...couriers, courierData]);
    setShowCreateModal(false);
    setNewCourier({
      name: '',
      email: '',
      phone: '',
      address: '',
      licenseNumber: '',
      vehicleType: 'motorcycle',
      vehicleModel: '',
      vehiclePlate: '',
      specializations: [],
      workingHours: { start: '08:00', end: '18:00' },
      emergencyContact: { name: '', phone: '' },
      notes: ''
    });
    
    alert(`✅ Courier "${courierData.name}" registrado exitosamente!`);
  };

  const handleEditCourier = () => {
    if (!selectedCourier) return;

    const updatedCouriers = couriers.map(courier => 
      courier.id === selectedCourier.id ? selectedCourier : courier
    );

    setCouriers(updatedCouriers);
    setShowEditModal(false);
    setSelectedCourier(null);
    
    alert('✅ Courier actualizado exitosamente!');
  };

  const handleDeleteCourier = (courier: Courier) => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar al courier "${courier.name}"?`)) {
      const updatedCouriers = couriers.filter(c => c.id !== courier.id);
      setCouriers(updatedCouriers);
      alert('✅ Courier eliminado exitosamente!');
    }
  };

  const handleStatusChange = (courierId: string, newStatus: Courier['status']) => {
    const updatedCouriers = couriers.map(courier => 
      courier.id === courierId 
        ? { 
            ...courier, 
            status: newStatus,
            lastActiveDate: new Date().toISOString()
          } 
        : courier
    );
    setCouriers(updatedCouriers);
    
    const courier = couriers.find(c => c.id === courierId);
    alert(`✅ Estado de ${courier?.name} cambiado a: ${newStatus}`);
  };

  const filteredCouriers = couriers.filter(courier => {
    const matchesSearch = courier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         courier.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         courier.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         courier.vehicleModel.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         courier.vehiclePlate.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || courier.status === filterStatus;
    const matchesVehicle = filterVehicle === 'all' || courier.vehicleType === filterVehicle;
    return matchesSearch && matchesStatus && matchesVehicle;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Couriers</h1>
          <p className="text-gray-600 mt-2">Administra el equipo de couriers</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          <Plus className="w-5 h-5" />
          Nuevo Courier
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Couriers</p>
              <p className="text-2xl font-bold text-gray-900">{couriers.length}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Truck className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Disponibles</p>
              <p className="text-2xl font-bold text-green-600">
                {couriers.filter(c => c.status === 'available').length}
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">En Servicio</p>
              <p className="text-2xl font-bold text-yellow-600">
                {couriers.filter(c => c.status === 'busy').length}
              </p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Entregas Hoy</p>
              <p className="text-2xl font-bold text-purple-600">
                {couriers.reduce((sum, c) => sum + c.completedToday, 0)}
              </p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <Package className="w-6 h-6 text-purple-600" />
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
                placeholder="Buscar por nombre, email, teléfono, vehículo o placa..."
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
              <option value="available">Disponible</option>
              <option value="busy">Ocupado</option>
              <option value="offline">Desconectado</option>
              <option value="suspended">Suspendido</option>
            </select>
            <select
              className="px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
              value={filterVehicle}
              onChange={(e) => setFilterVehicle(e.target.value)}
            >
              <option value="all">Todos los vehículos</option>
              <option value="motorcycle">Motocicleta</option>
              <option value="car">Automóvil</option>
              <option value="truck">Camión</option>
              <option value="bicycle">Bicicleta</option>
            </select>
          </div>
        </div>
      </div>

      {/* Couriers List */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Courier</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contacto</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehículo</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Performance</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCouriers.map((courier) => (
                <tr key={courier.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white w-10 h-10 rounded-full flex items-center justify-center font-semibold">
                        {courier.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="ml-4">
                        <div className="font-medium text-gray-900">{courier.name}</div>
                        <div className="text-sm text-gray-500">ID: {courier.licenseNumber}</div>
                        <div className="flex items-center mt-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-sm text-gray-500 ml-1">{courier.rating}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 flex items-center gap-1">
                      <Mail className="w-4 h-4 text-gray-400" />
                      {courier.email}
                    </div>
                    <div className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                      <Phone className="w-4 h-4 text-gray-400" />
                      {courier.phone}
                    </div>
                    <div className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      {courier.address.substring(0, 20)}...
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{getVehicleIcon(courier.vehicleType)}</span>
                      <div>
                        <div className="font-medium text-gray-900">{courier.vehicleModel}</div>
                        <div className="text-sm text-gray-500">{courier.vehiclePlate}</div>
                        <div className="text-xs text-gray-400 capitalize">{courier.vehicleType}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-2">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(courier.status)}`}>
                        {getStatusIcon(courier.status)}
                        {courier.status === 'available' ? 'Disponible' : 
                         courier.status === 'busy' ? 'Ocupado' : 
                         courier.status === 'offline' ? 'Desconectado' : 'Suspendido'}
                      </span>
                      <div className="text-xs text-gray-500">
                        Última actividad: {new Date(courier.lastActiveDate).toLocaleString()}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      <div className="flex items-center gap-1">
                        <Package className="w-4 h-4 text-blue-500" />
                        {courier.totalDeliveries} entregas
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        {courier.completedToday} hoy
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        <DollarSign className="w-4 h-4 text-purple-500" />
                        ${courier.totalEarnings.toLocaleString()}
                      </div>
                      {courier.currentOrders > 0 && (
                        <div className="text-xs text-orange-600 mt-1">
                          {courier.currentOrders} en curso
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedCourier(courier);
                          setShowViewModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-800 p-1"
                        title="Ver detalles"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedCourier(courier);
                          setShowEditModal(true);
                        }}
                        className="text-green-600 hover:text-green-800 p-1"
                        title="Editar"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteCourier(courier)}
                        className="text-red-600 hover:text-red-800 p-1"
                        title="Eliminar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <div className="relative">
                        <select
                          className="text-xs px-2 py-1 border border-gray-200 rounded"
                          value={courier.status}
                          onChange={(e) => handleStatusChange(courier.id, e.target.value as Courier['status'])}
                        >
                          <option value="available">Disponible</option>
                          <option value="busy">Ocupado</option>
                          <option value="offline">Desconectado</option>
                          <option value="suspended">Suspendido</option>
                        </select>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Courier Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-900">Registrar Nuevo Courier</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Personal Information */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Información Personal
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo *</label>
                    <input
                      type="text"
                      required
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                      value={newCourier.name || ''}
                      onChange={(e) => setNewCourier({
                        ...newCourier,
                        name: e.target.value
                      })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                    <input
                      type="email"
                      required
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                      value={newCourier.email || ''}
                      onChange={(e) => setNewCourier({
                        ...newCourier,
                        email: e.target.value
                      })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono *</label>
                    <input
                      type="tel"
                      required
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                      value={newCourier.phone || ''}
                      onChange={(e) => setNewCourier({
                        ...newCourier,
                        phone: e.target.value
                      })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Número de Licencia *</label>
                    <input
                      type="text"
                      required
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                      value={newCourier.licenseNumber || ''}
                      onChange={(e) => setNewCourier({
                        ...newCourier,
                        licenseNumber: e.target.value
                      })}
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Dirección *</label>
                  <textarea
                    rows={2}
                    required
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                    value={newCourier.address || ''}
                    onChange={(e) => setNewCourier({
                      ...newCourier,
                      address: e.target.value
                    })}
                  />
                </div>
              </div>

              {/* Vehicle Information */}
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Car className="w-5 h-5" />
                  Información del Vehículo
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Vehículo *</label>
                    <select
                      required
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500"
                      value={newCourier.vehicleType || 'motorcycle'}
                      onChange={(e) => setNewCourier({
                        ...newCourier,
                        vehicleType: e.target.value as Courier['vehicleType']
                      })}
                    >
                      <option value="bicycle">Bicicleta</option>
                      <option value="motorcycle">Motocicleta</option>
                      <option value="car">Automóvil</option>
                      <option value="truck">Camión</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Modelo del Vehículo *</label>
                    <input
                      type="text"
                      required
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500"
                      value={newCourier.vehicleModel || ''}
                      onChange={(e) => setNewCourier({
                        ...newCourier,
                        vehicleModel: e.target.value
                      })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Placa del Vehículo *</label>
                    <input
                      type="text"
                      required
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500"
                      value={newCourier.vehiclePlate || ''}
                      onChange={(e) => setNewCourier({
                        ...newCourier,
                        vehiclePlate: e.target.value
                      })}
                    />
                  </div>
                </div>
              </div>

              {/* Work Information */}
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Información Laboral
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Hora de Inicio</label>
                    <input
                      type="time"
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500"
                      value={newCourier.workingHours?.start || '08:00'}
                      onChange={(e) => setNewCourier({
                        ...newCourier,
                        workingHours: {
                          ...newCourier.workingHours!,
                          start: e.target.value
                        }
                      })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Hora de Finalización</label>
                    <input
                      type="time"
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500"
                      value={newCourier.workingHours?.end || '18:00'}
                      onChange={(e) => setNewCourier({
                        ...newCourier,
                        workingHours: {
                          ...newCourier.workingHours!,
                          end: e.target.value
                        }
                      })}
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Especializaciones</label>
                  <input
                    type="text"
                    placeholder="Ej: Documentos, Paquetes frágiles, Express (separados por coma)"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500"
                    value={newCourier.specializations?.join(', ') || ''}
                    onChange={(e) => setNewCourier({
                      ...newCourier,
                      specializations: e.target.value.split(',').map(s => s.trim()).filter(s => s)
                    })}
                  />
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="bg-orange-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Phone className="w-5 h-5" />
                  Contacto de Emergencia
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del Contacto</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500"
                      value={newCourier.emergencyContact?.name || ''}
                      onChange={(e) => setNewCourier({
                        ...newCourier,
                        emergencyContact: {
                          ...newCourier.emergencyContact!,
                          name: e.target.value
                        }
                      })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono de Emergencia</label>
                    <input
                      type="tel"
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500"
                      value={newCourier.emergencyContact?.phone || ''}
                      onChange={(e) => setNewCourier({
                        ...newCourier,
                        emergencyContact: {
                          ...newCourier.emergencyContact!,
                          phone: e.target.value
                        }
                      })}
                    />
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Notas Adicionales
                </h3>
                <textarea
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-500"
                  placeholder="Notas sobre el courier, experiencia previa, etc..."
                  value={newCourier.notes || ''}
                  onChange={(e) => setNewCourier({
                    ...newCourier,
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
                onClick={handleCreateCourier}
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700"
              >
                Registrar Courier
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Courier Modal */}
      {showViewModal && selectedCourier && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-900">Detalles del Courier</h2>
              <button
                onClick={() => setShowViewModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Header Info */}
              <div className="flex items-center gap-6 bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg">
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold">
                  {selectedCourier.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">{selectedCourier.name}</h3>
                  <p className="text-gray-600">ID: {selectedCourier.licenseNumber}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center gap-1">
                      <Star className="w-5 h-5 text-yellow-400 fill-current" />
                      <span className="font-semibold">{selectedCourier.rating}</span>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedCourier.status)}`}>
                      {selectedCourier.status === 'available' ? 'Disponible' : 
                       selectedCourier.status === 'busy' ? 'Ocupado' : 
                       selectedCourier.status === 'offline' ? 'Desconectado' : 'Suspendido'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                  <Package className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-blue-600">{selectedCourier.totalDeliveries}</p>
                  <p className="text-sm text-gray-600">Total Entregas</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg text-center">
                  <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-green-600">{selectedCourier.completedToday}</p>
                  <p className="text-sm text-gray-600">Entregas Hoy</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg text-center">
                  <DollarSign className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-purple-600">${selectedCourier.totalEarnings.toLocaleString()}</p>
                  <p className="text-sm text-gray-600">Ingresos Totales</p>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg text-center">
                  <Clock className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-orange-600">{selectedCourier.currentOrders}</p>
                  <p className="text-sm text-gray-600">Pedidos Activos</p>
                </div>
              </div>

              {/* Detailed Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Personal Info */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Información Personal
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span>{selectedCourier.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span>{selectedCourier.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span>{selectedCourier.address}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span>Desde: {new Date(selectedCourier.joinDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                {/* Vehicle Info */}
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Car className="w-5 h-5" />
                    Información del Vehículo
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{getVehicleIcon(selectedCourier.vehicleType)}</span>
                      <span className="capitalize">{selectedCourier.vehicleType}</span>
                    </div>
                    <div>
                      <span className="font-medium">Modelo:</span> {selectedCourier.vehicleModel}
                    </div>
                    <div>
                      <span className="font-medium">Placa:</span> {selectedCourier.vehiclePlate}
                    </div>
                  </div>
                </div>

                {/* Work Schedule */}
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Horario de Trabajo
                  </h4>
                  <div className="text-sm">
                    <div>
                      <span className="font-medium">Horario:</span> {selectedCourier.workingHours.start} - {selectedCourier.workingHours.end}
                    </div>
                    <div className="mt-2">
                      <span className="font-medium">Última actividad:</span>
                      <br />
                      {new Date(selectedCourier.lastActiveDate).toLocaleString()}
                    </div>
                  </div>
                </div>

                {/* Emergency Contact */}
                <div className="bg-orange-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Phone className="w-5 h-5" />
                    Contacto de Emergencia
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-medium">Nombre:</span> {selectedCourier.emergencyContact.name}
                    </div>
                    <div>
                      <span className="font-medium">Teléfono:</span> {selectedCourier.emergencyContact.phone}
                    </div>
                  </div>
                </div>
              </div>

              {/* Specializations */}
              {selectedCourier.specializations.length > 0 && (
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-3">Especializaciones</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedCourier.specializations.map((spec, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-yellow-200 text-yellow-800 rounded-full text-sm"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Notes */}
              {selectedCourier.notes && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Notas
                  </h4>
                  <p className="text-sm text-gray-700">{selectedCourier.notes}</p>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-4 p-6 border-t">
              <button
                onClick={() => setShowViewModal(false)}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cerrar
              </button>
              <button
                onClick={() => {
                  setShowViewModal(false);
                  setShowEditModal(true);
                }}
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700"
              >
                Editar Courier
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Courier Modal */}
      {showEditModal && selectedCourier && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-900">Editar Courier</h2>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Status Update */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Estado del Courier</h3>
                <select
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={selectedCourier.status}
                  onChange={(e) => setSelectedCourier({
                    ...selectedCourier,
                    status: e.target.value as Courier['status']
                  })}
                >
                  <option value="available">Disponible</option>
                  <option value="busy">Ocupado</option>
                  <option value="offline">Desconectado</option>
                  <option value="suspended">Suspendido</option>
                </select>
              </div>

              {/* Personal Information */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Información Personal
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                      value={selectedCourier.name}
                      onChange={(e) => setSelectedCourier({
                        ...selectedCourier,
                        name: e.target.value
                      })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                      value={selectedCourier.email}
                      onChange={(e) => setSelectedCourier({
                        ...selectedCourier,
                        email: e.target.value
                      })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                    <input
                      type="tel"
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                      value={selectedCourier.phone}
                      onChange={(e) => setSelectedCourier({
                        ...selectedCourier,
                        phone: e.target.value
                      })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Número de Licencia</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                      value={selectedCourier.licenseNumber}
                      onChange={(e) => setSelectedCourier({
                        ...selectedCourier,
                        licenseNumber: e.target.value
                      })}
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
                  <textarea
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                    value={selectedCourier.address}
                    onChange={(e) => setSelectedCourier({
                      ...selectedCourier,
                      address: e.target.value
                    })}
                  />
                </div>
              </div>

              {/* Vehicle Information */}
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Car className="w-5 h-5" />
                  Información del Vehículo
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Vehículo</label>
                    <select
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500"
                      value={selectedCourier.vehicleType}
                      onChange={(e) => setSelectedCourier({
                        ...selectedCourier,
                        vehicleType: e.target.value as Courier['vehicleType']
                      })}
                    >
                      <option value="bicycle">Bicicleta</option>
                      <option value="motorcycle">Motocicleta</option>
                      <option value="car">Automóvil</option>
                      <option value="truck">Camión</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Modelo del Vehículo</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500"
                      value={selectedCourier.vehicleModel}
                      onChange={(e) => setSelectedCourier({
                        ...selectedCourier,
                        vehicleModel: e.target.value
                      })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Placa del Vehículo</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500"
                      value={selectedCourier.vehiclePlate}
                      onChange={(e) => setSelectedCourier({
                        ...selectedCourier,
                        vehiclePlate: e.target.value
                      })}
                    />
                  </div>
                </div>
              </div>

              {/* Work Information */}
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Información Laboral
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Hora de Inicio</label>
                    <input
                      type="time"
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500"
                      value={selectedCourier.workingHours.start}
                      onChange={(e) => setSelectedCourier({
                        ...selectedCourier,
                        workingHours: {
                          ...selectedCourier.workingHours,
                          start: e.target.value
                        }
                      })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Hora de Finalización</label>
                    <input
                      type="time"
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500"
                      value={selectedCourier.workingHours.end}
                      onChange={(e) => setSelectedCourier({
                        ...selectedCourier,
                        workingHours: {
                          ...selectedCourier.workingHours,
                          end: e.target.value
                        }
                      })}
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Especializaciones</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500"
                    value={selectedCourier.specializations.join(', ')}
                    onChange={(e) => setSelectedCourier({
                      ...selectedCourier,
                      specializations: e.target.value.split(',').map(s => s.trim()).filter(s => s)
                    })}
                  />
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="bg-orange-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Phone className="w-5 h-5" />
                  Contacto de Emergencia
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del Contacto</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500"
                      value={selectedCourier.emergencyContact.name}
                      onChange={(e) => setSelectedCourier({
                        ...selectedCourier,
                        emergencyContact: {
                          ...selectedCourier.emergencyContact,
                          name: e.target.value
                        }
                      })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono de Emergencia</label>
                    <input
                      type="tel"
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500"
                      value={selectedCourier.emergencyContact.phone}
                      onChange={(e) => setSelectedCourier({
                        ...selectedCourier,
                        emergencyContact: {
                          ...selectedCourier.emergencyContact,
                          phone: e.target.value
                        }
                      })}
                    />
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Notas
                </h3>
                <textarea
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-500"
                  value={selectedCourier.notes || ''}
                  onChange={(e) => setSelectedCourier({
                    ...selectedCourier,
                    notes: e.target.value
                  })}
                />
              </div>
            </div>

            <div className="flex justify-end gap-4 p-6 border-t">
              <button
                onClick={handleEditCourier}
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

export default CouriersPage;