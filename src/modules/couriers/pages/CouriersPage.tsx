import React, { useState, useMemo } from 'react';
import { Search, Filter, Plus, Phone, Mail, MapPin, Car, Truck, Bike, Star, Circle, MoreVertical } from 'lucide-react';
import Badge from '../../../components/ui/Badge';
import Button from '../../../components/ui/Button';
import Modal from '../../../components/ui/Modal';

interface Courier {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  status: 'available' | 'busy' | 'offline';
  rating: number;
  totalDeliveries: number;
  monthlyEarnings: number;
  vehicle: {
    type: 'car' | 'truck' | 'motorcycle';
    brand: string;
    model: string;
    plate: string;
  };
  specialties: string[];
  currentLocation?: string;
  avatar: string;
  joinedDate: string;
}

const mockCouriers: Courier[] = [
  {
    id: '1',
    firstName: 'Carlos',
    lastName: 'Rodriguez',
    email: 'carlos.rodriguez@email.com',
    phone: '+1 (555) 123-4567',
    status: 'available',
    rating: 4.8,
    totalDeliveries: 234,
    monthlyEarnings: 2450,
    vehicle: {
      type: 'motorcycle',
      brand: 'Honda',
      model: 'CB190R',
      plate: 'ABC-123'
    },
    specialties: ['Express', 'Downtown'],
    currentLocation: 'Downtown Miami',
    avatar: 'CR',
    joinedDate: '2023-01-15'
  },
  {
    id: '2',
    firstName: 'Maria',
    lastName: 'Garcia',
    email: 'maria.garcia@email.com',
    phone: '+1 (555) 234-5678',
    status: 'busy',
    rating: 4.9,
    totalDeliveries: 189,
    monthlyEarnings: 2180,
    vehicle: {
      type: 'car',
      brand: 'Toyota',
      model: 'Corolla',
      plate: 'XYZ-789'
    },
    specialties: ['Fragile', 'Documents'],
    currentLocation: 'Coral Gables',
    avatar: 'MG',
    joinedDate: '2023-03-22'
  },
  {
    id: '3',
    firstName: 'Roberto',
    lastName: 'Silva',
    email: 'roberto.silva@email.com',
    phone: '+1 (555) 345-6789',
    status: 'offline',
    rating: 4.7,
    totalDeliveries: 312,
    monthlyEarnings: 2890,
    vehicle: {
      type: 'truck',
      brand: 'Ford',
      model: 'Transit',
      plate: 'DEF-456'
    },
    specialties: ['Heavy Cargo', 'Furniture'],
    currentLocation: 'Hialeah',
    avatar: 'RS',
    joinedDate: '2022-11-08'
  },
  {
    id: '4',
    firstName: 'Ana',
    lastName: 'Martinez',
    email: 'ana.martinez@email.com',
    phone: '+1 (555) 456-7890',
    status: 'available',
    rating: 4.6,
    totalDeliveries: 156,
    monthlyEarnings: 1920,
    vehicle: {
      type: 'motorcycle',
      brand: 'Yamaha',
      model: 'MT-07',
      plate: 'GHI-789'
    },
    specialties: ['Express', 'Medical'],
    currentLocation: 'Brickell',
    avatar: 'AM',
    joinedDate: '2023-05-10'
  },
  {
    id: '5',
    firstName: 'Luis',
    lastName: 'Fernandez',
    email: 'luis.fernandez@email.com',
    phone: '+1 (555) 567-8901',
    status: 'available',
    rating: 4.5,
    totalDeliveries: 98,
    monthlyEarnings: 1650,
    vehicle: {
      type: 'car',
      brand: 'Honda',
      model: 'Civic',
      plate: 'JKL-012'
    },
    specialties: ['Documents', 'Same Day'],
    currentLocation: 'Kendall',
    avatar: 'LF',
    joinedDate: '2023-08-03'
  }
];

const CouriersPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [vehicleFilter, setVehicleFilter] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedCourier, setSelectedCourier] = useState<Courier | null>(null);

  const filteredCouriers = useMemo(() => {
    return mockCouriers.filter(courier => {
      const matchesSearch = 
        courier.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        courier.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        courier.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        courier.phone.includes(searchTerm);

      const matchesStatus = statusFilter === 'all' || courier.status === statusFilter;
      const matchesVehicle = vehicleFilter === 'all' || courier.vehicle.type === vehicleFilter;

      return matchesSearch && matchesStatus && matchesVehicle;
    });
  }, [searchTerm, statusFilter, vehicleFilter]);

  const getStatusColor = (status: Courier['status']) => {
    switch (status) {
      case 'available': return 'bg-green-500';
      case 'busy': return 'bg-yellow-500';
      case 'offline': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: Courier['status']) => {
    switch (status) {
      case 'available': return 'Disponible';
      case 'busy': return 'Ocupado';
      case 'offline': return 'Desconectado';
      default: return 'Desconocido';
    }
  };

  const getVehicleIcon = (type: string) => {
    switch (type) {
      case 'car': return <Car className="w-4 h-4" />;
      case 'truck': return <Truck className="w-4 h-4" />;
      case 'motorcycle': return <Bike className="w-4 h-4" />;
      default: return <Car className="w-4 h-4" />;
    }
  };

  const getVehicleTypeLabel = (type: string) => {
    switch (type) {
      case 'car': return 'Auto';
      case 'truck': return 'Camión';
      case 'motorcycle': return 'Moto';
      default: return 'Vehículo';
    }
  };

  const getAverageRating = () => {
    const total = filteredCouriers.reduce((sum, courier) => sum + courier.rating, 0);
    return (total / filteredCouriers.length).toFixed(1);
  };

  const getTotalDeliveries = () => {
    return filteredCouriers.reduce((sum, courier) => sum + courier.totalDeliveries, 0);
  };

  const getTotalEarnings = () => {
    return filteredCouriers.reduce((sum, courier) => sum + courier.monthlyEarnings, 0);
  };

  const getAvailableCount = () => {
    return filteredCouriers.filter(courier => courier.status === 'available').length;
  };

  const handleCloseDetails = () => {
    setShowDetailsModal(false);
    setSelectedCourier(null);
  };

  const handleViewDetails = (courier: Courier) => {
    setSelectedCourier(courier);
    setShowDetailsModal(true);
  };

  const handleMoreActions = (courier: Courier) => {
    console.log('⚙️ Más acciones para courier:', courier.firstName, courier.lastName);
    
    const actions = [
      '📝 Editar información',
      '🚛 Asignar ruta',
      '💰 Ver ganancias',
      '📊 Ver estadísticas',
      '📞 Enviar mensaje',
      '🚫 Desactivar courier'
    ];
    
    const selectedAction = prompt(
      `⚙️ Acciones para ${courier.firstName} ${courier.lastName}:\n\n` +
      actions.map((action, index) => `${index + 1}. ${action}`).join('\n') +
      '\n\nSelecciona una opción (1-6):'
    );
    
    if (selectedAction && selectedAction >= '1' && selectedAction <= '6') {
      const actionIndex = parseInt(selectedAction) - 1;
      alert(`✅ Acción seleccionada: ${actions[actionIndex]}\n\nEsta función ejecutaría: ${actions[actionIndex]} para ${courier.firstName} ${courier.lastName}`);
    }
  };

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Couriers</h1>
          <p className="text-gray-600 mt-1">Gestiona tu equipo de delivery</p>
        </div>
        <Button
          onClick={() => setShowAddModal(true)}
          className="lg:w-auto"
        >
          <Plus className="w-4 h-4 mr-2" />
          Agregar Courier
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Couriers</p>
              <p className="text-2xl font-bold text-gray-900">{filteredCouriers.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Car className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Disponibles</p>
              <p className="text-2xl font-bold text-green-600">{getAvailableCount()}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Circle className="w-6 h-6 text-green-600 fill-current" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Entregas</p>
              <p className="text-2xl font-bold text-gray-900">{getTotalDeliveries().toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Star className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Rating Promedio</p>
              <p className="text-2xl font-bold text-yellow-600">{getAverageRating()}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Star className="w-6 h-6 text-yellow-600 fill-current" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar por nombre, email o teléfono..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="lg:w-48">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Todos los estados</option>
              <option value="available">Disponible</option>
              <option value="busy">Ocupado</option>
              <option value="offline">Desconectado</option>
            </select>
          </div>

          {/* Vehicle Filter */}
          <div className="lg:w-48">
            <select
              value={vehicleFilter}
              onChange={(e) => setVehicleFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Todos los vehículos</option>
              <option value="motorcycle">Motocicleta</option>
              <option value="car">Auto</option>
              <option value="truck">Camión</option>
            </select>
          </div>

          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filtros
          </Button>
        </div>
      </div>

      {/* Couriers List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Courier
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vehículo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Entregas
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rating
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ingresos Mes
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ubicación
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCouriers.map((courier) => (
                <tr key={courier.id} className="hover:bg-gray-50 transition-colors duration-150">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                        {courier.avatar}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {courier.firstName} {courier.lastName}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center space-x-2">
                          <Mail className="w-3 h-3" />
                          <span>{courier.email}</span>
                        </div>
                        <div className="text-sm text-gray-500 flex items-center space-x-2">
                          <Phone className="w-3 h-3" />
                          <span>{courier.phone}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(courier.status)}`}></div>
                      <Badge variant={courier.status === 'available' ? 'success' : courier.status === 'busy' ? 'warning' : 'danger'}>
                        {getStatusText(courier.status)}
                      </Badge>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      {getVehicleIcon(courier.vehicle.type)}
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {courier.vehicle.brand} {courier.vehicle.model}
                        </div>
                        <div className="text-xs text-gray-500">
                          {getVehicleTypeLabel(courier.vehicle.type)} • {courier.vehicle.plate}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{courier.totalDeliveries}</div>
                    <div className="text-xs text-gray-500">entregas</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium text-gray-900">{courier.rating}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      ${courier.monthlyEarnings.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500">este mes</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-1 text-sm text-gray-500">
                      <MapPin className="w-3 h-3" />
                      <span>{courier.currentLocation}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => handleViewDetails(courier)}
                        className="inline-flex items-center px-3 py-1.5 bg-blue-100 text-blue-700 text-xs font-medium rounded-md hover:bg-blue-200 transition-colors"
                      >
                        Ver
                      </button>
                      <button
                        onClick={() => handleMoreActions(courier)}
                        className="inline-flex items-center px-2 py-1.5 bg-gray-100 text-gray-700 text-xs font-medium rounded-md hover:bg-gray-200 transition-colors"
                        title="Más acciones"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredCouriers.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500">
              <Car className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">No se encontraron couriers</p>
              <p className="mt-1">Intenta ajustar los filtros de búsqueda</p>
            </div>
          </div>
        )}
      </div>

      {/* Add Courier Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Agregar Nuevo Courier"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Nombre del courier"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Apellido
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Apellido del courier"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="email@ejemplo.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Teléfono
            </label>
            <input
              type="tel"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="+1 (555) 123-4567"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de Vehículo
            </label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option value="">Seleccionar tipo</option>
              <option value="motorcycle">Motocicleta</option>
              <option value="car">Auto</option>
              <option value="truck">Camión</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Marca del Vehículo
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Honda, Toyota, etc."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Modelo
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Civic, Corolla, etc."
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Placa del Vehículo
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="ABC-123"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <Button
              variant="outline"
              onClick={() => setShowAddModal(false)}
            >
              Cancelar
            </Button>
            <Button onClick={() => {
              console.log('Agregar courier');
              setShowAddModal(false);
            }}>
              Agregar Courier
            </Button>
          </div>
        </div>
      </Modal>

      {/* Courier Details Modal */}
      {selectedCourier && (
        <Modal
          isOpen={showDetailsModal}
          onClose={handleCloseDetails}
          title={`${selectedCourier.firstName} ${selectedCourier.lastName}`}
        >
          <div className="space-y-6">
            {/* Basic Info */}
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                {selectedCourier.avatar}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {selectedCourier.firstName} {selectedCourier.lastName}
                </h3>
                <div className="flex items-center space-x-2 mt-1">
                  <div className={`w-2 h-2 rounded-full ${getStatusColor(selectedCourier.status)}`}></div>
                  <span className="text-sm text-gray-600">{getStatusText(selectedCourier.status)}</span>
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-500">Email</label>
                  <div className="flex items-center space-x-2 mt-1">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-900">{selectedCourier.email}</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Teléfono</label>
                  <div className="flex items-center space-x-2 mt-1">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-900">{selectedCourier.phone}</span>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-500">Ubicación Actual</label>
                  <div className="flex items-center space-x-2 mt-1">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-900">{selectedCourier.currentLocation}</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Fecha de Ingreso</label>
                  <span className="text-sm text-gray-900">{new Date(selectedCourier.joinedDate).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            {/* Vehicle Info */}
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-3">Información del Vehículo</h4>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  {getVehicleIcon(selectedCourier.vehicle.type)}
                  <div>
                    <div className="font-medium text-gray-900">
                      {selectedCourier.vehicle.brand} {selectedCourier.vehicle.model}
                    </div>
                    <div className="text-sm text-gray-500">
                      {getVehicleTypeLabel(selectedCourier.vehicle.type)} • Placa: {selectedCourier.vehicle.plate}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-3">Estadísticas</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">{selectedCourier.totalDeliveries}</div>
                  <div className="text-sm text-blue-600">Entregas Totales</div>
                </div>
                <div className="bg-yellow-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-yellow-600">{selectedCourier.rating}</div>
                  <div className="text-sm text-yellow-600">Rating</div>
                </div>
                <div className="bg-green-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">${selectedCourier.monthlyEarnings.toLocaleString()}</div>
                  <div className="text-sm text-green-600">Ingresos del Mes</div>
                </div>
              </div>
            </div>

            {/* Specialties */}
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-3">Especialidades</h4>
              <div className="flex flex-wrap gap-2">
                {selectedCourier.specialties.map((specialty, index) => (
                  <Badge key={index} variant="secondary">
                    {specialty}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <Button variant="outline" onClick={handleCloseDetails}>
                Cerrar
              </Button>
              <Button onClick={() => {
                console.log('Editar courier:', selectedCourier.id);
                handleCloseDetails();
              }}>
                Editar Courier
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default CouriersPage;