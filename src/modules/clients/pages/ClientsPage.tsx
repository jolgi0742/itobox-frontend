import React, { useState } from 'react';
import { useNavigation } from '../../../contexts/NavigationContext';
import { 
  Users, 
  Search, 
  Filter, 
  Plus, 
  Eye, 
  Edit, 
  Mail, 
  Phone, 
  MapPin,
  Star,
  Package,
  DollarSign,
  Calendar
} from 'lucide-react';

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  address: string;
  city: string;
  status: 'active' | 'inactive' | 'pending';
  totalPackages: number;
  totalSpent: number;
  lastOrder: string;
  rating: number;
  avatar: string;
  joinDate: string;
}

const ClientsPage: React.FC = () => {
  const { navigate } = useNavigation();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Datos simulados de clientes
  const clients: Client[] = [
    {
      id: 'CLI-001',
      name: 'Ana García Morales',
      email: 'ana.garcia@email.com',
      phone: '+506 8888-1234',
      company: 'Distribuidora Central',
      address: 'Av. Central, 200m norte del Banco Nacional',
      city: 'San José',
      status: 'active',
      totalPackages: 47,
      totalSpent: 2840.50,
      lastOrder: '2024-06-22',
      rating: 4.8,
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b332b63e?w=40&h=40&fit=crop&crop=face',
      joinDate: '2024-01-15'
    },
    {
      id: 'CLI-002',
      name: 'Carlos López Rivera',
      email: 'carlos.lopez@empresa.com',
      phone: '+506 8777-5678',
      company: 'Comercial López',
      address: 'Centro Comercial Plaza Real, Local 45',
      city: 'Cartago',
      status: 'active',
      totalPackages: 32,
      totalSpent: 1950.75,
      lastOrder: '2024-06-21',
      rating: 4.6,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
      joinDate: '2024-02-10'
    },
    {
      id: 'CLI-003',
      name: 'María Rodríguez Castro',
      email: 'maria.rodriguez@gmail.com',
      phone: '+506 8666-9012',
      company: 'Independiente',
      address: 'Residencial Los Laureles, Casa 25',
      city: 'Heredia',
      status: 'pending',
      totalPackages: 8,
      totalSpent: 450.25,
      lastOrder: '2024-06-20',
      rating: 4.9,
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face',
      joinDate: '2024-06-01'
    },
    {
      id: 'CLI-004',
      name: 'Roberto Silva Mendez',
      email: 'roberto.silva@tech.com',
      phone: '+506 8555-3456',
      company: 'TechSolutions CR',
      address: 'Oficentro La Sabana, Torre Norte, Piso 8',
      city: 'San José',
      status: 'active',
      totalPackages: 63,
      totalSpent: 4125.00,
      lastOrder: '2024-06-22',
      rating: 4.7,
      avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=40&h=40&fit=crop&crop=face',
      joinDate: '2023-11-20'
    },
    {
      id: 'CLI-005',
      name: 'Laura Monge Vargas',
      email: 'laura.monge@boutique.com',
      phone: '+506 8444-7890',
      company: 'Boutique Elegancia',
      address: 'Multiplaza Escazú, Local 234',
      city: 'Escazú',
      status: 'inactive',
      totalPackages: 15,
      totalSpent: 875.50,
      lastOrder: '2024-05-15',
      rating: 4.2,
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=40&h=40&fit=crop&crop=face',
      joinDate: '2024-03-05'
    }
  ];

  const getStatusInfo = (status: string) => {
    const statusMap = {
      active: { label: 'Activo', color: 'bg-green-100 text-green-800', dot: 'bg-green-400' },
      inactive: { label: 'Inactivo', color: 'bg-gray-100 text-gray-800', dot: 'bg-gray-400' },
      pending: { label: 'Pendiente', color: 'bg-yellow-100 text-yellow-800', dot: 'bg-yellow-400' }
    };
    return statusMap[status as keyof typeof statusMap] || statusMap.active;
  };

  // Filtros
  const filteredClients = clients.filter(client => {
    const matchesSearch = 
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.city.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || client.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Estadísticas
  const stats = {
    total: clients.length,
    active: clients.filter(c => c.status === 'active').length,
    inactive: clients.filter(c => c.status === 'inactive').length,
    pending: clients.filter(c => c.status === 'pending').length
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Clientes</h1>
          <p className="text-gray-600 mt-1">
            Administra y monitorea todos los clientes del sistema
          </p>
        </div>
        
        <button
          onClick={() => navigate('client-create')}
          className="flex items-center space-x-2 bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          <Plus className="w-5 h-5" />
          <span className="font-medium">Nuevo Cliente</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Clientes</p>
              <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Activos</p>
              <p className="text-3xl font-bold text-green-600">{stats.active}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <Users className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pendientes</p>
              <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-lg">
              <Users className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Inactivos</p>
              <p className="text-3xl font-bold text-gray-600">{stats.inactive}</p>
            </div>
            <div className="bg-gray-100 p-3 rounded-lg">
              <Users className="w-6 h-6 text-gray-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filtros y búsqueda */}
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Búsqueda */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar por nombre, email, empresa o ciudad..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          
          {/* Filtro por estado */}
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="all">Todos los estados</option>
              <option value="active">Activos</option>
              <option value="inactive">Inactivos</option>
              <option value="pending">Pendientes</option>
            </select>
          </div>
        </div>
      </div>

      {/* Lista de clientes */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="grid grid-cols-1 divide-y divide-gray-200">
          {filteredClients.map((client) => {
            const statusInfo = getStatusInfo(client.status);
            
            return (
              <div key={client.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start space-x-4">
                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    <img
                      src={client.avatar}
                      alt={client.name}
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-gray-200"
                    />
                  </div>
                  
                  {/* Información principal */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="text-lg font-semibold text-gray-900">{client.name}</h3>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.color}`}>
                            <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${statusInfo.dot}`}></span>
                            {statusInfo.label}
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-500 mb-2">
                          <div className="flex items-center space-x-1">
                            <Mail className="w-4 h-4" />
                            <span>{client.email}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Phone className="w-4 h-4" />
                            <span>{client.phone}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                          <div className="flex items-center space-x-1">
                            <MapPin className="w-4 h-4" />
                            <span>{client.company} • {client.city}</span>
                          </div>
                        </div>
                        
                        {/* Métricas */}
                        <div className="flex items-center space-x-6 text-sm">
                          <div className="flex items-center space-x-1">
                            <Package className="w-4 h-4 text-blue-500" />
                            <span className="font-medium text-gray-900">{client.totalPackages}</span>
                            <span className="text-gray-500">paquetes</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <DollarSign className="w-4 h-4 text-green-500" />
                            <span className="font-medium text-gray-900">${client.totalSpent.toLocaleString()}</span>
                            <span className="text-gray-500">gastado</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 text-yellow-500" />
                            <span className="font-medium text-gray-900">{client.rating}</span>
                            <span className="text-gray-500">rating</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4 text-purple-500" />
                            <span className="text-gray-500">Último: {client.lastOrder}</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Acciones */}
                      <div className="flex items-center space-x-2 ml-4">
                        <button
                          onClick={() => navigate('client-detail', { id: client.id })}
                          className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          Ver
                        </button>
                        <button
                          onClick={() => navigate('client-edit', { id: client.id })}
                          className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Editar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {filteredClients.length === 0 && (
          <div className="text-center py-12">
            <Users className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No se encontraron clientes</h3>
            <p className="mt-1 text-sm text-gray-500">
              Intenta ajustar los filtros de búsqueda.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientsPage;