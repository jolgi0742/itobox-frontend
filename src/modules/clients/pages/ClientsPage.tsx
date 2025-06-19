import React, { useState, useContext } from 'react';
import { Search, Filter, Plus, Eye, Edit, Trash2, Building, User, Phone, Mail, MapPin, Star } from 'lucide-react';
import { useNavigation } from '../../../contexts/NavigationContext';

const ClientsPage: React.FC = () => {
  const { navigate  } = useNavigation();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  const clients = [
    {
      id: 1,
      name: 'Tecnología Avanzada S.A.',
      type: 'company',
      contact: 'María García',
      email: 'maria@tecnoavanzada.com',
      phone: '+1 (555) 123-4567',
      address: 'Av. Tecnológica 123, Miami, FL',
      packages: 45,
      totalSpent: 12500,
      rating: 4.8,
      status: 'active',
      lastOrder: '2024-06-15'
    },
    {
      id: 2,
      name: 'Juan Carlos Rodríguez',
      type: 'individual',
      contact: 'Juan Carlos Rodríguez',
      email: 'juan.rodriguez@email.com',
      phone: '+1 (555) 987-6543',
      address: '456 Personal St, Orlando, FL',
      packages: 12,
      totalSpent: 3200,
      rating: 4.5,
      status: 'active',
      lastOrder: '2024-06-14'
    },
    {
      id: 3,
      name: 'Importaciones del Caribe',
      type: 'company',
      contact: 'Ana Martínez',
      email: 'ana@importcaribe.com',
      phone: '+1 (555) 456-7890',
      address: 'Zona Industrial 789, Tampa, FL',
      packages: 89,
      totalSpent: 25600,
      rating: 4.9,
      status: 'active',
      lastOrder: '2024-06-16'
    },
    {
      id: 4,
      name: 'Distribuidora MegaCorp',
      type: 'company',
      contact: 'Roberto Silva',
      email: 'roberto@megacorp.com',
      phone: '+1 (555) 321-0987',
      address: '321 Business Blvd, Jacksonville, FL',
      packages: 156,
      totalSpent: 45800,
      rating: 4.7,
      status: 'premium',
      lastOrder: '2024-06-16'
    },
    {
      id: 5,
      name: 'Elena Fernández',
      type: 'individual',
      contact: 'Elena Fernández',
      email: 'elena.fernandez@gmail.com',
      phone: '+1 (555) 654-3210',
      address: '789 Residential Ave, Key West, FL',
      packages: 8,
      totalSpent: 1850,
      rating: 4.3,
      status: 'active',
      lastOrder: '2024-06-13'
    }
  ];

  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterType === 'all' || 
                         (filterType === 'company' && client.type === 'company') ||
                         (filterType === 'individual' && client.type === 'individual') ||
                         (filterType === 'premium' && client.status === 'premium');
    
    return matchesSearch && matchesFilter;
  });

  const handleViewClient = (clientId: number) => {
    console.log('Ver cliente:', clientId);
    navigate('client-profile');
  };

  const handleEditClient = (clientId: number) => {
    console.log('Editar cliente:', clientId);
    navigate('edit-client');
  };

  const handleDeleteClient = (clientId: number) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este cliente?')) {
      console.log('Eliminar cliente:', clientId);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      active: 'bg-green-100 text-green-800',
      premium: 'bg-purple-100 text-purple-800',
      inactive: 'bg-gray-100 text-gray-800'
    };
    
    const labels = {
      active: 'Activo',
      premium: 'Premium',
      inactive: 'Inactivo'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status as keyof typeof styles]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  return (
    <div className="p-6 lg:p-8 -mt-20">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
        <div className="flex items-center space-x-3 mb-4 lg:mb-0">
          <User className="w-8 h-8 text-gray-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestión de Clientes</h1>
            <p className="text-gray-600">Administra tu base de clientes y sus datos</p>
          </div>
        </div>
        
        <button 
          onClick={() => navigate('new-client')}
          className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          <Plus className="w-5 h-5" />
          <span>Nuevo Cliente</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Clientes</p>
              <p className="text-2xl font-bold text-gray-900">{clients.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Empresas</p>
              <p className="text-2xl font-bold text-gray-900">{clients.filter(c => c.type === 'company').length}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <Building className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Clientes Premium</p>
              <p className="text-2xl font-bold text-gray-900">{clients.filter(c => c.status === 'premium').length}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <Star className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Ingresos Totales</p>
              <p className="text-2xl font-bold text-gray-900">${clients.reduce((sum, c) => sum + c.totalSpent, 0).toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
              <Building className="w-6 h-6 text-orange-600" />
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
                placeholder="Buscar clientes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select 
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Todos los clientes</option>
                <option value="company">Empresas</option>
                <option value="individual">Individuales</option>
                <option value="premium">Premium</option>
              </select>
            </div>
          </div>

          <div className="text-sm text-gray-600">
            Mostrando {filteredClients.length} de {clients.length} clientes
          </div>
        </div>
      </div>

      {/* Clients Table */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contacto</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ubicación</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estadísticas</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredClients.map((client) => (
                <tr key={client.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        client.type === 'company' ? 'bg-blue-100' : 'bg-green-100'
                      }`}>
                        {client.type === 'company' ? 
                          <Building className={`w-5 h-5 ${client.type === 'company' ? 'text-blue-600' : 'text-green-600'}`} /> :
                          <User className="w-5 h-5 text-green-600" />
                        }
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{client.name}</p>
                        <p className="text-sm text-gray-500">{client.type === 'company' ? 'Empresa' : 'Individual'}</p>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-900">{client.contact}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{client.email}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{client.phone}</span>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{client.address}</span>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">{client.packages} paquetes</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-green-600">${client.totalSpent.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-600">{client.rating}</span>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    {getStatusBadge(client.status)}
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => handleViewClient(client.id)}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                        title="Ver cliente"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleEditClient(client.id)}
                        className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                        title="Editar cliente"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteClient(client.id)}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                        title="Eliminar cliente"
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

        {/* Pagination - SECCIÓN CORREGIDA */}
        {filteredClients.length > 0 && (
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Mostrando {filteredClients.length} de {clients.length} clientes
            </div>
            <div className="flex items-center space-x-2">
              <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                Anterior
              </button>
              <button className="px-3 py-2 bg-purple-600 text-white rounded-lg">
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
        )}
      </div>
    </div>
  );
};

export default ClientsPage;