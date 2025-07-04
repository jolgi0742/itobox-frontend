 import React, { useState } from 'react';
import {
  Users,
  Search,
  Plus,
  Eye,
  Edit3,
  Trash2,
  MapPin,
  Mail,
  Phone,
  Building2,
  Calendar,
  DollarSign,
  Package,
  Star,
  X,
  User,
  Globe,
  CheckCircle
} from 'lucide-react';

// Interfaces
interface Client {
  id: string;
  company: {
    name: string;
    taxId: string;
    industry: string;
    website?: string;
  };
  contact: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    position: string;
  };
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  preferences: {
    preferredCommunication: 'email' | 'phone' | 'both';
    specialInstructions?: string;
  };
  stats: {
    totalPackages: number;
    totalSpent: number;
    averageRating: number;
    lastOrder?: string;
  };
  status: 'active' | 'inactive' | 'pending';
  createdAt: string;
}

// Mock data
const mockClients: Client[] = [
  {
    id: '1',
    company: {
      name: 'TechCorp Solutions',
      taxId: '123-456-789',
      industry: 'Tecnología',
      website: 'https://techcorp.com'
    },
    contact: {
      firstName: 'Ana',
      lastName: 'García',
      email: 'ana.garcia@techcorp.com',
      phone: '+1-555-0100',
      position: 'Gerente de Logística'
    },
    address: {
      street: '123 Tech Street',
      city: 'Miami',
      state: 'Florida',
      zipCode: '33101',
      country: 'Estados Unidos'
    },
    preferences: {
      preferredCommunication: 'email',
      specialInstructions: 'Envíos urgentes solo por la mañana'
    },
    stats: {
      totalPackages: 45,
      totalSpent: 12750.00,
      averageRating: 4.8,
      lastOrder: '2024-12-10'
    },
    status: 'active',
    createdAt: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    company: {
      name: 'Global Imports Ltd.',
      taxId: '987-654-321',
      industry: 'Importación',
      website: 'https://globalimports.com'
    },
    contact: {
      firstName: 'Carlos',
      lastName: 'Rodríguez',
      email: 'carlos@globalimports.com',
      phone: '+1-555-0200',
      position: 'Director de Operaciones'
    },
    address: {
      street: '456 Import Avenue',
      city: 'Houston',
      state: 'Texas',
      zipCode: '77001',
      country: 'Estados Unidos'
    },
    preferences: {
      preferredCommunication: 'both',
      specialInstructions: 'Consolidar envíos semanalmente'
    },
    stats: {
      totalPackages: 78,
      totalSpent: 23400.00,
      averageRating: 4.9,
      lastOrder: '2024-12-12'
    },
    status: 'active',
    createdAt: '2024-02-20T14:30:00Z'
  },
  {
    id: '3',
    company: {
      name: 'StartUp Innovations',
      taxId: '555-123-999',
      industry: 'Startup',
      website: 'https://startupinno.com'
    },
    contact: {
      firstName: 'María',
      lastName: 'López',
      email: 'maria@startupinno.com',
      phone: '+1-555-0300',
      position: 'CEO'
    },
    address: {
      street: '789 Innovation Blvd',
      city: 'San Francisco',
      state: 'California',
      zipCode: '94102',
      country: 'Estados Unidos'
    },
    preferences: {
      preferredCommunication: 'email'
    },
    stats: {
      totalPackages: 12,
      totalSpent: 3200.00,
      averageRating: 4.6,
      lastOrder: '2024-12-05'
    },
    status: 'active',
    createdAt: '2024-11-01T09:15:00Z'
  },
  {
    id: '4',
    company: {
      name: 'Legacy Manufacturing',
      taxId: '111-222-333',
      industry: 'Manufactura'
    },
    contact: {
      firstName: 'Roberto',
      lastName: 'Martínez',
      email: 'roberto@legacy.com',
      phone: '+1-555-0400',
      position: 'Gerente de Compras'
    },
    address: {
      street: '321 Factory Road',
      city: 'Detroit',
      state: 'Michigan',
      zipCode: '48201',
      country: 'Estados Unidos'
    },
    preferences: {
      preferredCommunication: 'phone',
      specialInstructions: 'Verificar calidad antes del envío'
    },
    stats: {
      totalPackages: 156,
      totalSpent: 87500.00,
      averageRating: 4.7,
      lastOrder: '2024-12-08'
    },
    status: 'active',
    createdAt: '2023-05-10T16:45:00Z'
  },
  {
    id: '5',
    company: {
      name: 'Dormant Corp',
      taxId: '999-888-777',
      industry: 'Servicios'
    },
    contact: {
      firstName: 'Laura',
      lastName: 'Pérez',
      email: 'laura@dormant.com',
      phone: '+1-555-0500',
      position: 'Coordinadora'
    },
    address: {
      street: '999 Inactive Street',
      city: 'Phoenix',
      state: 'Arizona',
      zipCode: '85001',
      country: 'Estados Unidos'
    },
    preferences: {
      preferredCommunication: 'email'
    },
    stats: {
      totalPackages: 5,
      totalSpent: 850.00,
      averageRating: 4.2,
      lastOrder: '2024-08-15'
    },
    status: 'inactive',
    createdAt: '2024-03-15T11:20:00Z'
  }
];

const ClientsPage: React.FC = () => {
  const [clients, setClients] = useState<Client[]>(mockClients);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterIndustry, setFilterIndustry] = useState<string>('all');

  const [clientForm, setClientForm] = useState({
    companyName: '',
    taxId: '',
    industry: '',
    website: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    position: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    preferredCommunication: 'email' as 'email' | 'phone' | 'both',
    specialInstructions: ''
  });

  const filteredClients = clients.filter(client => {
    const matchesSearch = 
      client.company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.contact.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.contact.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.contact.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || client.status === filterStatus;
    const matchesIndustry = filterIndustry === 'all' || client.company.industry === filterIndustry;
    
    return matchesSearch && matchesStatus && matchesIndustry;
  });

  const industries = Array.from(new Set(clients.map(client => client.company.industry))).sort();

  const resetForm = () => {
    setClientForm({
      companyName: '',
      taxId: '',
      industry: '',
      website: '',
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      position: '',
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
      preferredCommunication: 'email',
      specialInstructions: ''
    });
  };

  const handleCreateClient = () => {
    const newClient: Client = {
      id: Date.now().toString(),
      company: {
        name: clientForm.companyName,
        taxId: clientForm.taxId,
        industry: clientForm.industry,
        website: clientForm.website
      },
      contact: {
        firstName: clientForm.firstName,
        lastName: clientForm.lastName,
        email: clientForm.email,
        phone: clientForm.phone,
        position: clientForm.position
      },
      address: {
        street: clientForm.street,
        city: clientForm.city,
        state: clientForm.state,
        zipCode: clientForm.zipCode,
        country: clientForm.country
      },
      preferences: {
        preferredCommunication: clientForm.preferredCommunication,
        specialInstructions: clientForm.specialInstructions
      },
      stats: {
        totalPackages: 0,
        totalSpent: 0,
        averageRating: 0
      },
      status: 'active',
      createdAt: new Date().toISOString()
    };

    setClients([newClient, ...clients]);
    setShowCreateModal(false);
    resetForm();
    alert('✅ Cliente creado exitosamente!');
  };

  const handleEditClient = () => {
    if (!selectedClient) return;

    const updatedClients = clients.map(client =>
      client.id === selectedClient.id
        ? {
            ...client,
            company: {
              ...client.company,
              name: clientForm.companyName,
              taxId: clientForm.taxId,
              industry: clientForm.industry,
              website: clientForm.website
            },
            contact: {
              ...client.contact,
              firstName: clientForm.firstName,
              lastName: clientForm.lastName,
              email: clientForm.email,
              phone: clientForm.phone,
              position: clientForm.position
            },
            address: {
              ...client.address,
              street: clientForm.street,
              city: clientForm.city,
              state: clientForm.state,
              zipCode: clientForm.zipCode,
              country: clientForm.country
            },
            preferences: {
              ...client.preferences,
              preferredCommunication: clientForm.preferredCommunication,
              specialInstructions: clientForm.specialInstructions
            }
          }
        : client
    );

    setClients(updatedClients);
    setShowEditModal(false);
    setSelectedClient(null);
    alert('✅ Cliente actualizado exitosamente!');
  };

  const openEditModal = (client: Client) => {
    setSelectedClient(client);
    setClientForm({
      companyName: client.company.name,
      taxId: client.company.taxId,
      industry: client.company.industry,
      website: client.company.website || '',
      firstName: client.contact.firstName,
      lastName: client.contact.lastName,
      email: client.contact.email,
      phone: client.contact.phone,
      position: client.contact.position,
      street: client.address.street,
      city: client.address.city,
      state: client.address.state,
      zipCode: client.address.zipCode,
      country: client.address.country,
      preferredCommunication: client.preferences.preferredCommunication,
      specialInstructions: client.preferences.specialInstructions || ''
    });
    setShowEditModal(true);
  };

  const handleDeleteClient = (id: string) => {
    if (window.confirm('¿Estás seguro de eliminar este cliente?')) {
      setClients(clients.filter(client => client.id !== id));
      alert('✅ Cliente eliminado exitosamente!');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCommunicationIcon = (preference: string) => {
    switch (preference) {
      case 'email': return <Mail className="w-4 h-4" />;
      case 'phone': return <Phone className="w-4 h-4" />;
      case 'both': return <><Mail className="w-3 h-3" /><Phone className="w-3 h-3" /></>;
      default: return <Mail className="w-4 h-4" />;
    }
  };

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Users className="w-8 h-8 text-blue-600" />
            Gestión de Clientes
          </h1>
          <p className="text-gray-600 mt-2">
            Administra tu cartera de clientes y sus información comercial
          </p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowCreateModal(true);
          }}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 shadow-lg"
        >
          <Plus className="w-5 h-5" />
          Agregar Cliente
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Clientes</p>
              <p className="text-2xl font-bold text-gray-900">{clients.length}</p>
            </div>
            <Users className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Clientes Activos</p>
              <p className="text-2xl font-bold text-green-600">
                {clients.filter(c => c.status === 'active').length}
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Ingresos Totales</p>
              <p className="text-2xl font-bold text-purple-600">
                ${clients.reduce((sum, c) => sum + c.stats.totalSpent, 0).toLocaleString()}
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-purple-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Paquetes Totales</p>
              <p className="text-2xl font-bold text-orange-600">
                {clients.reduce((sum, c) => sum + c.stats.totalPackages, 0)}
              </p>
            </div>
            <Package className="w-8 h-8 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row lg:items-center gap-4">
        <div className="relative flex-1">
          <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar clientes por nombre, empresa o email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">Todos los estados</option>
          <option value="active">Activos</option>
          <option value="inactive">Inactivos</option>
          <option value="pending">Pendientes</option>
        </select>
        <select
          value={filterIndustry}
          onChange={(e) => setFilterIndustry(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">Todas las industrias</option>
          {industries.map((industry) => (
            <option key={industry} value={industry}>{industry}</option>
          ))}
        </select>
      </div>

      {/* Clients Table */}
      <div className="bg-white rounded-xl shadow-sm border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left py-4 px-6 font-medium text-gray-900">Cliente</th>
                <th className="text-left py-4 px-6 font-medium text-gray-900">Empresa</th>
                <th className="text-left py-4 px-6 font-medium text-gray-900">Industria</th>
                <th className="text-left py-4 px-6 font-medium text-gray-900">Contacto</th>
                <th className="text-left py-4 px-6 font-medium text-gray-900">Paquetes</th>
                <th className="text-left py-4 px-6 font-medium text-gray-900">Total Gastado</th>
                <th className="text-left py-4 px-6 font-medium text-gray-900">Estado</th>
                <th className="text-left py-4 px-6 font-medium text-gray-900">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredClients.map((client) => (
                <tr key={client.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                        {client.contact.firstName.charAt(0)}{client.contact.lastName.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">
                          {client.contact.firstName} {client.contact.lastName}
                        </p>
                        <p className="text-sm text-gray-500">{client.contact.position}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div>
                      <p className="font-medium text-gray-900">{client.company.name}</p>
                      <p className="text-sm text-gray-500">ID: {client.company.taxId}</p>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {client.company.industry}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail className="w-4 h-4" />
                        {client.contact.email}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone className="w-4 h-4" />
                        {client.contact.phone}
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        {getCommunicationIcon(client.preferences.preferredCommunication)}
                        <span className="text-gray-500">
                          {client.preferences.preferredCommunication === 'both' ? 'Email y Teléfono' :
                           client.preferences.preferredCommunication === 'email' ? 'Email' : 'Teléfono'}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-center">
                      <p className="text-lg font-semibold text-gray-900">{client.stats.totalPackages}</p>
                      <div className="flex items-center justify-center gap-1 mt-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-600">{client.stats.averageRating.toFixed(1)}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <p className="text-lg font-semibold text-gray-900">
                      ${client.stats.totalSpent.toLocaleString()}
                    </p>
                    {client.stats.lastOrder && (
                      <p className="text-sm text-gray-500">
                        Último: {new Date(client.stats.lastOrder).toLocaleDateString()}
                      </p>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(client.status)}`}>
                      {client.status === 'active' ? 'Activo' :
                       client.status === 'inactive' ? 'Inactivo' : 'Pendiente'}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedClient(client);
                          setShowViewModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-800 p-1"
                        title="Ver detalles"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openEditModal(client)}
                        className="text-green-600 hover:text-green-800 p-1"
                        title="Editar"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteClient(client.id)}
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

      {/* View Client Modal */}
      {showViewModal && selectedClient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-900">Detalles del Cliente</h2>
              <button onClick={() => setShowViewModal(false)} className="text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="flex items-start gap-6">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {selectedClient.contact.firstName.charAt(0)}{selectedClient.contact.lastName.charAt(0)}
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900">{selectedClient.company.name}</h3>
                  <p className="text-lg text-gray-600 mt-1">{selectedClient.contact.firstName} {selectedClient.contact.lastName}</p>
                  <p className="text-gray-500">{selectedClient.contact.position}</p>
                  <div className="flex items-center gap-4 mt-3">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedClient.status)}`}>
                      {selectedClient.status === 'active' ? 'Activo' : selectedClient.status === 'inactive' ? 'Inactivo' : 'Pendiente'}
                    </span>
                    <div className="flex items-center gap-1">
                      <Star className="w-5 h-5 text-yellow-400 fill-current" />
                      <span className="font-semibold">{selectedClient.stats.averageRating.toFixed(1)}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => { setShowViewModal(false); openEditModal(selectedClient); }}
                  className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700"
                >
                  Editar Cliente
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-blue-50 p-6 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Package className="w-8 h-8 text-blue-600" />
                    <div>
                      <p className="text-2xl font-bold text-blue-900">{selectedClient.stats.totalPackages}</p>
                      <p className="text-blue-700">Paquetes Enviados</p>
                    </div>
                  </div>
                </div>
                <div className="bg-green-50 p-6 rounded-xl">
                  <div className="flex items-center gap-3">
                    <DollarSign className="w-8 h-8 text-green-600" />
                    <div>
                      <p className="text-2xl font-bold text-green-900">${selectedClient.stats.totalSpent.toLocaleString()}</p>
                      <p className="text-green-700">Total Gastado</p>
                    </div>
                  </div>
                </div>
                <div className="bg-yellow-50 p-6 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Star className="w-8 h-8 text-yellow-600" />
                    <div>
                      <p className="text-2xl font-bold text-yellow-900">{selectedClient.stats.averageRating.toFixed(1)}</p>
                      <p className="text-yellow-700">Calificación Promedio</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <div>
		    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Building2 className="w-5 h-5 text-blue-600" />
                      Información de la Empresa
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-gray-500">Nombre de la Empresa</label>
                        <p className="text-gray-900">{selectedClient.company.name}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">ID Fiscal</label>
                        <p className="text-gray-900">{selectedClient.company.taxId}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Industria</label>
                        <p className="text-gray-900">{selectedClient.company.industry}</p>
                      </div>
                      {selectedClient.company.website && (
                        <div>
                          <label className="text-sm font-medium text-gray-500">Sitio Web</label>
                          <p className="text-blue-600 flex items-center gap-2">
                            <Globe className="w-4 h-4" />
                            <a href={selectedClient.company.website} target="_blank" rel="noopener noreferrer" className="hover:underline">
                              {selectedClient.company.website}
                            </a>
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <User className="w-5 h-5 text-purple-600" />
                      Información de Contacto
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-gray-500">Nombre Completo</label>
                        <p className="text-gray-900">{selectedClient.contact.firstName} {selectedClient.contact.lastName}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Posición</label>
                        <p className="text-gray-900">{selectedClient.contact.position}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Email</label>
                        <p className="text-gray-900 flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          <a href={`mailto:${selectedClient.contact.email}`} className="text-blue-600 hover:underline">
                            {selectedClient.contact.email}
                          </a>
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Teléfono</label>
                        <p className="text-gray-900 flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          <a href={`tel:${selectedClient.contact.phone}`} className="text-blue-600 hover:underline">
                            {selectedClient.contact.phone}
                          </a>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-green-600" />
                      Dirección
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-gray-500">Dirección</label>
                        <p className="text-gray-900">{selectedClient.address.street}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-gray-500">Ciudad</label>
                          <p className="text-gray-900">{selectedClient.address.city}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Estado</label>
                          <p className="text-gray-900">{selectedClient.address.state}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-gray-500">Código Postal</label>
                          <p className="text-gray-900">{selectedClient.address.zipCode}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">País</label>
                          <p className="text-gray-900">{selectedClient.address.country}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Preferencias</h4>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-gray-500">Comunicación Preferida</label>
                        <p className="text-gray-900 flex items-center gap-2">
                          {getCommunicationIcon(selectedClient.preferences.preferredCommunication)}
                          {selectedClient.preferences.preferredCommunication === 'both' ? 'Email y Teléfono' :
                           selectedClient.preferences.preferredCommunication === 'email' ? 'Email' : 'Teléfono'}
                        </p>
                      </div>
                      {selectedClient.preferences.specialInstructions && (
                        <div>
                          <label className="text-sm font-medium text-gray-500">Instrucciones Especiales</label>
                          <p className="text-gray-900 bg-yellow-50 p-3 rounded-lg">
                            {selectedClient.preferences.specialInstructions}
                          </p>
                        </div>
                      )}
                      <div>
                        <label className="text-sm font-medium text-gray-500">Cliente Desde</label>
                        <p className="text-gray-900 flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          {new Date(selectedClient.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4 p-6 border-t">
              <button onClick={() => setShowViewModal(false)} className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Client Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-900">Crear Nuevo Cliente</h2>
              <button onClick={() => setShowCreateModal(false)} className="text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 space-y-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-blue-600" />
                  Información de la Empresa
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nombre de la Empresa *</label>
                    <input type="text" value={clientForm.companyName} onChange={(e) => setClientForm({...clientForm, companyName: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">ID Fiscal / RUC *</label>
                    <input type="text" value={clientForm.taxId} onChange={(e) => setClientForm({...clientForm, taxId: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Industria *</label>
                    <select value={clientForm.industry} onChange={(e) => setClientForm({...clientForm, industry: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" required>
                      <option value="">Seleccionar industria</option>
                      <option value="Tecnología">Tecnología</option>
                      <option value="Manufactura">Manufactura</option>
                      <option value="Importación">Importación</option>
                      <option value="Exportación">Exportación</option>
                      <option value="Retail">Retail</option>
                      <option value="Servicios">Servicios</option>
                      <option value="Startup">Startup</option>
                      <option value="Automotriz">Automotriz</option>
                      <option value="Textil">Textil</option>
                      <option value="Alimentación">Alimentación</option>
                      <option value="Otros">Otros</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Sitio Web</label>
                    <input type="url" value={clientForm.website} onChange={(e) => setClientForm({...clientForm, website: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="https://ejemplo.com" />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-purple-600" />
                  Información de Contacto
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nombre *</label>
                    <input type="text" value={clientForm.firstName} onChange={(e) => setClientForm({...clientForm, firstName: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Apellido *</label>
                    <input type="text" value={clientForm.lastName} onChange={(e) => setClientForm({...clientForm, lastName: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                    <input type="email" value={clientForm.email} onChange={(e) => setClientForm({...clientForm, email: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Teléfono *</label>
                    <input type="tel" value={clientForm.phone} onChange={(e) => setClientForm({...clientForm, phone: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" required />
                  </div>
                  <div className="lg:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Posición / Cargo *</label>
                    <input type="text" value={clientForm.position} onChange={(e) => setClientForm({...clientForm, position: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" required />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-green-600" />
                  Dirección
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="lg:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Dirección *</label>
                    <input type="text" value={clientForm.street} onChange={(e) => setClientForm({...clientForm, street: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Ciudad *</label>
                    <input type="text" value={clientForm.city} onChange={(e) => setClientForm({...clientForm, city: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Estado / Provincia *</label>
                    <input type="text" value={clientForm.state} onChange={(e) => setClientForm({...clientForm, state: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Código Postal *</label>
                    <input type="text" value={clientForm.zipCode} onChange={(e) => setClientForm({...clientForm, zipCode: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">País *</label>
                    <select value={clientForm.country} onChange={(e) => setClientForm({...clientForm, country: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" required>
                      <option value="">Seleccionar país</option>
                      <option value="Estados Unidos">Estados Unidos</option>
                      <option value="Costa Rica">Costa Rica</option>
                      <option value="México">México</option>
                      <option value="Colombia">Colombia</option>
                      <option value="Panamá">Panamá</option>
                      <option value="Guatemala">Guatemala</option>
                      <option value="España">España</option>
                      <option value="Otros">Otros</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Preferencias</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Método de Comunicación Preferido</label>
                    <select value={clientForm.preferredCommunication} onChange={(e) => setClientForm({...clientForm, preferredCommunication: e.target.value as 'email' | 'phone' | 'both'})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option value="email">Email</option>
                      <option value="phone">Teléfono</option>
                      <option value="both">Email y Teléfono</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Instrucciones Especiales</label>
                    <textarea value={clientForm.specialInstructions} onChange={(e) => setClientForm({...clientForm, specialInstructions: e.target.value})} rows={3} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Instrucciones especiales para el manejo de envíos..." />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4 p-6 border-t">
              <button onClick={() => setShowCreateModal(false)} className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">Cancelar</button>
              <button onClick={handleCreateClient} className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700">Crear Cliente</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Client Modal */}
      {showEditModal && selectedClient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-900">Editar Cliente</h2>
              <button onClick={() => setShowEditModal(false)} className="text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 space-y-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-blue-600" />
                  Información de la Empresa
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nombre de la Empresa *</label>
                    <input type="text" value={clientForm.companyName} onChange={(e) => setClientForm({...clientForm, companyName: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">ID Fiscal / RUC *</label>
                    <input type="text" value={clientForm.taxId} onChange={(e) => setClientForm({...clientForm, taxId: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Industria *</label>
                    <select value={clientForm.industry} onChange={(e) => setClientForm({...clientForm, industry: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" required>
                      <option value="">Seleccionar industria</option>
                      <option value="Tecnología">Tecnología</option>
                      <option value="Manufactura">Manufactura</option>
                      <option value="Importación">Importación</option>
                      <option value="Exportación">Exportación</option>
                      <option value="Retail">Retail</option>
                      <option value="Servicios">Servicios</option>
                      <option value="Startup">Startup</option>
                      <option value="Automotriz">Automotriz</option>
                      <option value="Textil">Textil</option>
                      <option value="Alimentación">Alimentación</option>
                      <option value="Otros">Otros</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Sitio Web</label>
                    <input type="url" value={clientForm.website} onChange={(e) => setClientForm({...clientForm, website: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="https://ejemplo.com" />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-purple-600" />
                  Información de Contacto
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nombre *</label>
                    <input type="text" value={clientForm.firstName} onChange={(e) => setClientForm({...clientForm, firstName: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Apellido *</label>
                    <input type="text" value={clientForm.lastName} onChange={(e) => setClientForm({...clientForm, lastName: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                    <input type="email" value={clientForm.email} onChange={(e) => setClientForm({...clientForm, email: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Teléfono *</label>
                    <input type="tel" value={clientForm.phone} onChange={(e) => setClientForm({...clientForm, phone: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" required />
                  </div>
                  <div className="lg:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Posición / Cargo *</label>
                    <input type="text" value={clientForm.position} onChange={(e) => setClientForm({...clientForm, position: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" required />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-green-600" />
                  Dirección
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="lg:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Dirección *</label>
                    <input type="text" value={clientForm.street} onChange={(e) => setClientForm({...clientForm, street: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Ciudad *</label>
                    <input type="text" value={clientForm.city} onChange={(e) => setClientForm({...clientForm, city: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Estado / Provincia *</label>
                    <input type="text" value={clientForm.state} onChange={(e) => setClientForm({...clientForm, state: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Código Postal *</label>
                    <input type="text" value={clientForm.zipCode} onChange={(e) => setClientForm({...clientForm, zipCode: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">País *</label>
                    <select value={clientForm.country} onChange={(e) => setClientForm({...clientForm, country: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" required>
                      <option value="">Seleccionar país</option>
                      <option value="Estados Unidos">Estados Unidos</option>
                      <option value="Costa Rica">Costa Rica</option>
                      <option value="México">México</option>
                      <option value="Colombia">Colombia</option>
                      <option value="Panamá">Panamá</option>
                      <option value="Guatemala">Guatemala</option>
                      <option value="España">España</option>
                      <option value="Otros">Otros</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Preferencias</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Método de Comunicación Preferido</label>
                    <select value={clientForm.preferredCommunication} onChange={(e) => setClientForm({...clientForm, preferredCommunication: e.target.value as 'email' | 'phone' | 'both'})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option value="email">Email</option>
                      <option value="phone">Teléfono</option>
                      <option value="both">Email y Teléfono</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Instrucciones Especiales</label>
                    <textarea value={clientForm.specialInstructions} onChange={(e) => setClientForm({...clientForm, specialInstructions: e.target.value})} rows={3} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Instrucciones especiales para el manejo de envíos..." />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-4 p-6 border-t">
              <button onClick={() => setShowEditModal(false)} className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">Cancelar</button>
              <button onClick={handleEditClient} className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700">Actualizar Cliente</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientsPage;