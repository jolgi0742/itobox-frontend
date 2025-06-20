import React, { useState, useContext } from 'react';
import { Truck, Search, Filter, Plus, Eye, Edit, User, Phone, Mail, MapPin, Star, Package, DollarSign, Clock } from 'lucide-react';
import { useNavigation } from '../../../contexts/NavigationContext';

const CouriersPage: React.FC = () => {
  const { navigate  } = useNavigation();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const couriers = [
    {
      id: 1,
      name: 'Carlos Rodríguez',
      email: 'carlos.rodriguez@itobox.com',
      phone: '+1 (555) 234-5678',
      status: 'active',
      vehicle: 'Van Ford Transit',
      licensePlate: 'ITB-001',
      zone: 'Miami-Dade',
      rating: 4.9,
      deliveries: 234,
      earnings: 15600,
      joinDate: '2023-03-15',
      lastActive: '2024-06-16T10:30:00Z'
    },
    {
      id: 2,
      name: 'Ana María López',
      email: 'ana.lopez@itobox.com',
      phone: '+1 (555) 345-6789',
      status: 'active',
      vehicle: 'Motocicleta Honda',
      licensePlate: 'ITB-002',
      zone: 'Broward',
      rating: 4.8,
      deliveries: 198,
      earnings: 13200,
      joinDate: '2023-01-22',
      lastActive: '2024-06-16T09:15:00Z'
    },
    {
      id: 3,
      name: 'Roberto Fernández',
      email: 'roberto.fernandez@itobox.com',
      phone: '+1 (555) 456-7890',
      status: 'inactive',
      vehicle: 'Pickup Truck',
      licensePlate: 'ITB-003',
      zone: 'Palm Beach',
      rating: 4.7,
      deliveries: 176,
      earnings: 11800,
      joinDate: '2023-05-10',
      lastActive: '2024-06-15T16:45:00Z'
    },
    {
      id: 4,
      name: 'Elena Martínez',
      email: 'elena.martinez@itobox.com',
      phone: '+1 (555) 567-8901',
      status: 'active',
      vehicle: 'Van Mercedes Sprinter',
      licensePlate: 'ITB-004',
      zone: 'Orlando',
      rating: 4.8,
      deliveries: 167,
      earnings: 10900,
      joinDate: '2023-02-28',
      lastActive: '2024-06-16T11:20:00Z'
    },
    {
      id: 5,
      name: 'José Luis García',
      email: 'jose.garcia@itobox.com',
      phone: '+1 (555) 678-9012',
      status: 'on-break',
      vehicle: 'Bicicleta Eléctrica',
      licensePlate: 'ITB-005',
      zone: 'Tampa',
      rating: 4.6,
      deliveries: 134,
      earnings: 9400,
      joinDate: '2023-04-12',
      lastActive: '2024-06-16T08:00:00Z'
    }
  ];

  const filteredCouriers = couriers.filter(courier => {
    const matchesSearch = courier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         courier.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         courier.zone.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || courier.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (status: string) => {
    const styles = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-gray-100 text-gray-800',
      'on-break': 'bg-yellow-100 text-yellow-800',
      suspended: 'bg-red-100 text-red-800'
    };
    
    const labels = {
      active: 'Activo',
      inactive: 'Inactivo',
      'on-break': 'En Descanso',
      suspended: 'Suspendido'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status as keyof typeof styles]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleViewCourier = (courierId: number) => {
    console.log('Ver courier:', courierId);
    navigate('CourierProfilePage', { id: courierId.toString() });
  };

  const handleEditCourier = (courierId: number) => {
    console.log('Editar courier:', courierId);
    navigate('NewCourierPage');
  };

  const handleNewCourier = () => {
    navigate('new-courier');
  };

  return (
    <div className="p-6 lg:p-8 -mt-20">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
        <div className="flex items-center space-x-3 mb-4 lg:mb-0">
          <Truck className="w-8 h-8 text-gray-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestión de Couriers</h1>
            <p className="text-gray-600">Administra tu equipo de entrega y su rendimiento</p>
          </div>
        </div>
        
        <button
          onClick={handleNewCourier}
          className="flex items-center space-x-2 px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Nuevo Courier</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Couriers</p>
              <p className="text-2xl font-bold text-gray-900">{couriers.length}</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
              <Truck className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Activos</p>
              <p className="text-2xl font-bold text-gray-900">
                {couriers.filter(c => c.status === 'active').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Entregas Totales</p>
              <p className="text-2xl font-bold text-gray-900">
                {couriers.reduce((sum, c) => sum + c.deliveries, 0).toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Ingresos Generados</p>
              <p className="text-2xl font-bold text-gray-900">
                ${couriers.reduce((sum, c) => sum + c.earnings, 0).toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar couriers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent w-64"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select 
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="all">Todos los estados</option>
                <option value="active">Activos</option>
                <option value="inactive">Inactivos</option>
                <option value="on-break">En Descanso</option>
                <option value="suspended">Suspendidos</option>
              </select>
            </div>
          </div>

          <div className="text-sm text-gray-600">
            Mostrando {filteredCouriers.length} de {couriers.length} couriers
          </div>
        </div>
      </div>

      {/* Couriers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCouriers.map((courier) => (
          <div key={courier.id} className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-200">
            {/* Header */}
            <div className="p-6 bg-gradient-to-r from-orange-500 to-red-500 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {courier.name.split(' ').map(n => n.charAt(0)).join('')}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{courier.name}</h3>
                    <p className="text-orange-100 text-sm">{courier.zone}</p>
                  </div>
                </div>
                {getStatusBadge(courier.status)}
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Contact Info */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center space-x-3">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{courier.email}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{courier.phone}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Truck className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{courier.vehicle} - {courier.licensePlate}</span>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="font-semibold text-gray-900">{courier.rating}</span>
                  </div>
                  <p className="text-xs text-gray-600">Rating</p>
                </div>
                <div className="text-center">
                  <p className="font-semibold text-gray-900">{courier.deliveries}</p>
                  <p className="text-xs text-gray-600">Entregas</p>
                </div>
                <div className="text-center">
                  <p className="font-semibold text-green-600">${courier.earnings.toLocaleString()}</p>
                  <p className="text-xs text-gray-600">Ingresos</p>
                </div>
              </div>

              {/* Dates */}
              <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                <span>Ingreso: {formatDate(courier.joinDate)}</span>
                <span>Activo: {formatDate(courier.lastActive)}</span>
              </div>

              {/* Actions */}
              <div className="flex space-x-2">
                <button
                  onClick={() => handleViewCourier(courier.id)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Ver perfil"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleEditCourier(courier.id)}
                  className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                  title="Editar"
                >
                  <Edit className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {filteredCouriers.length > 0 && (
        <div className="mt-8 bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Mostrando {filteredCouriers.length} de {couriers.length} couriers
            </div>
            <div className="flex items-center space-x-2">
              <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                Anterior
              </button>
              <button className="px-3 py-2 bg-orange-600 text-white rounded-lg">
                1
              </button>
              <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                2
              </button>
              <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                Siguiente
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CouriersPage;