import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  Plus, 
  Mail, 
  Phone, 
  MapPin, 
  Package, 
  DollarSign,
  Eye,
  Edit,
  MoreVertical,
  Star,
  Calendar,
  TrendingUp,
  Building,
  Globe,
  CreditCard
} from 'lucide-react';

const ModernClients = () => {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const clients = [
    {
      id: 'CLI001',
      name: 'Juan Carlos Pérez',
      email: 'juan.perez@email.com',
      phone: '+506 8888-9999',
      company: 'Tech Solutions CR',
      address: 'San José, Costa Rica',
      avatar: 'JP',
      status: 'active',
      type: 'premium',
      packagesCount: 47,
      totalSpent: 12450.00,
      lastOrder: '2024-06-10',
      rating: 4.9,
      joinDate: '2023-01-15',
      preferredService: 'Express'
    },
    {
      id: 'CLI002',
      name: 'María González',
      email: 'maria.g@fashionstore.com',
      phone: '+506 7777-8888',
      company: 'Fashion Store',
      address: 'Cartago, Costa Rica',
      avatar: 'MG',
      status: 'active',
      type: 'business',
      packagesCount: 89,
      totalSpent: 28900.50,
      lastOrder: '2024-06-09',
      rating: 4.8,
      joinDate: '2022-08-20',
      preferredService: 'Standard'
    },
    {
      id: 'CLI003',
      name: 'Carlos Ramírez',
      email: 'carlos.ramirez@personal.com',
      phone: '+506 6666-7777',
      company: 'Personal',
      address: 'Alajuela, Costa Rica',
      avatar: 'CR',
      status: 'inactive',
      type: 'regular',
      packagesCount: 12,
      totalSpent: 890.25,
      lastOrder: '2024-05-15',
      rating: 4.2,
      joinDate: '2023-11-03',
      preferredService: 'Economy'
    },
    {
      id: 'CLI004',
      name: 'Ana Villalobos',
      email: 'ana.v@bookworld.com',
      phone: '+506 5555-6666',
      company: 'Book World',
      address: 'Heredia, Costa Rica',
      avatar: 'AV',
      status: 'active',
      type: 'premium',
      packagesCount: 156,
      totalSpent: 45200.75,
      lastOrder: '2024-06-11',
      rating: 5.0,
      joinDate: '2021-05-10',
      preferredService: 'Express'
    },
    {
      id: 'CLI005',
      name: 'Roberto Fernández',
      email: 'roberto@gadgets.com',
      phone: '+506 4444-5555',
      company: 'Gadgets Import',
      address: 'Puntarenas, Costa Rica',
      avatar: 'RF',
      status: 'pending',
      type: 'business',
      packagesCount: 0,
      totalSpent: 0,
      lastOrder: null,
      rating: 0,
      joinDate: '2024-06-01',
      preferredService: 'Standard'
    }
  ];

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      active: 'from-green-500 to-emerald-500',
      inactive: 'from-gray-400 to-gray-500',
      pending: 'from-yellow-400 to-orange-500'
    };
    return colors[status] || 'from-gray-400 to-gray-500';
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      premium: 'from-purple-500 to-purple-600',
      business: 'from-blue-500 to-blue-600',
      regular: 'from-gray-500 to-gray-600'
    };
    return colors[type] || 'from-gray-500 to-gray-600';
  };

  const getStatusText = (status: string) => {
    const texts: Record<string, string> = {
      active: 'Activo',
      inactive: 'Inactivo',
      pending: 'Pendiente'
    };
    return texts[status] || 'Desconocido';
  };

  const getTypeText = (type: string) => {
    const texts: Record<string, string> = {
      premium: 'Premium',
      business: 'Empresarial',
      regular: 'Regular'
    };
    return texts[type] || 'Regular';
  };

  const filteredClients = clients.filter(client => {
    const matchesFilter = filter === 'all' || client.status === filter || client.type === filter;
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.company.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-3 h-3 ${
              star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
            }`}
          />
        ))}
        <span className="text-xs text-gray-600 ml-1">{rating.toFixed(1)}</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-lg border-b border-white/20 shadow-lg">
        <div className="px-6 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                Gestión de Clientes
              </h1>
              <p className="text-gray-600 mt-1">
                Administra tu base de clientes y sus estadísticas
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Buscar clientes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-white/70 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm w-80"
                />
              </div>
              <button className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white px-6 py-2 rounded-xl hover:shadow-lg transition-all duration-300 flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Nuevo Cliente
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-3 mt-6">
            <Filter className="w-5 h-5 text-gray-600" />
            <div className="flex gap-2 flex-wrap">
              {[
                { key: 'all', label: 'Todos', count: clients.length },
                { key: 'active', label: 'Activos', count: clients.filter(c => c.status === 'active').length },
                { key: 'premium', label: 'Premium', count: clients.filter(c => c.type === 'premium').length },
                { key: 'business', label: 'Empresariales', count: clients.filter(c => c.type === 'business').length },
                { key: 'pending', label: 'Pendientes', count: clients.filter(c => c.status === 'pending').length }
              ].map(({ key, label, count }) => (
                <button
                  key={key}
                  onClick={() => setFilter(key)}
                  className={`px-4 py-2 rounded-lg transition-all duration-300 flex items-center gap-2 ${
                    filter === key
                      ? 'bg-blue-500 text-white shadow-lg'
                      : 'bg-white/70 text-gray-600 hover:bg-white/90'
                  }`}
                >
                  {label}
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    filter === key ? 'bg-white/20' : 'bg-gray-200'
                  }`}>
                    {count}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Clients Grid */}
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredClients.map((client) => (
            <div
              key={client.id}
              className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
            >
              {/* Client Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                    {client.avatar}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">{client.name}</h3>
                    <p className="text-sm text-gray-600 flex items-center gap-1">
                      <Building className="w-3 h-3" />
                      {client.company}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium text-white bg-gradient-to-r ${getStatusColor(client.status)}`}>
                    {getStatusText(client.status)}
                  </span>
                  <button className="p-1 hover:bg-gray-100 rounded-lg">
                    <MoreVertical className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              </div>

              {/* Client Type Badge */}
              <div className="mb-4">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium text-white bg-gradient-to-r ${getTypeColor(client.type)}`}>
                  {getTypeText(client.type)}
                </span>
              </div>

              {/* Contact Info */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail className="w-4 h-4 text-blue-500" />
                  <span className="truncate">{client.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Phone className="w-4 h-4 text-green-500" />
                  <span>{client.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4 text-red-500" />
                  <span className="truncate">{client.address}</span>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-white/50 rounded-xl p-3">
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-purple-500" />
                    <span className="text-xs text-gray-500 uppercase tracking-wide">Paquetes</span>
                  </div>
                  <p className="text-xl font-bold text-gray-900">{client.packagesCount}</p>
                </div>
                <div className="bg-white/50 rounded-xl p-3">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-green-500" />
                    <span className="text-xs text-gray-500 uppercase tracking-wide">Total</span>
                  </div>
                  <p className="text-xl font-bold text-gray-900">${client.totalSpent.toLocaleString()}</p>
                </div>
              </div>

              {/* Rating and Last Order */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Calificación</p>
                  {client.rating > 0 ? renderStars(client.rating) : (
                    <span className="text-xs text-gray-400">Sin calificar</span>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Último Pedido</p>
                  <p className="text-sm font-medium text-gray-900">
                    {client.lastOrder ? new Date(client.lastOrder).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
              </div>

              {/* Additional Info */}
              <div className="grid grid-cols-2 gap-4 mb-4 text-xs">
                <div>
                  <p className="text-gray-500 uppercase tracking-wide">Miembro desde</p>
                  <p className="font-medium text-gray-900">{new Date(client.joinDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-gray-500 uppercase tracking-wide">Servicio Preferido</p>
                  <p className="font-medium text-gray-900">{client.preferredService}</p>
                </div>
              </div>

              {/* Monthly Trend (Fake data for demo) */}
              <div className="mb-4 p-3 bg-white/50 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-500 uppercase tracking-wide">Tendencia Mensual</span>
                  <TrendingUp className="w-4 h-4 text-green-500" />
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full w-3/4"></div>
                  </div>
                  <span className="text-xs text-green-600 font-medium">+15%</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-2 px-4 rounded-xl hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2">
                  <Eye className="w-4 h-4" />
                  Ver Perfil
                </button>
                <button className="bg-white/70 border border-gray-200 text-gray-700 py-2 px-4 rounded-xl hover:bg-white/90 transition-all duration-300 flex items-center justify-center gap-2">
                  <Edit className="w-4 h-4" />
                  Editar
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredClients.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No hay clientes</h3>
            <p className="text-gray-600">No se encontraron clientes que coincidan con los filtros seleccionados.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModernClients;