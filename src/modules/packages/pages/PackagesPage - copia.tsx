import React, { useState } from 'react';
import { 
  Package, 
  Search, 
  Filter, 
  Plus, 
  Eye, 
  MapPin, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Truck,
  Calendar,
  MoreVertical,
  ArrowRight,
  Zap,
  Shield,
  Star
} from 'lucide-react';

const ModernPackages = () => {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const packages = [
    {
      id: 'ITB2024001',
      sender: 'Electronics Store Miami',
      recipient: 'Juan Carlos Pérez',
      origin: 'Miami, FL',
      destination: 'San José, CR',
      status: 'in_transit',
      priority: 'express',
      weight: '2.5 kg',
      value: '$450.00',
      estimatedDelivery: '2024-06-12',
      progress: 75,
      timeline: [
        { step: 'Recogido', completed: true, time: '09:30 AM' },
        { step: 'En tránsito', completed: true, time: '02:45 PM' },
        { step: 'En aduana', completed: true, time: '06:20 PM' },
        { step: 'Para entrega', completed: false, time: 'Estimado: 10:00 AM' }
      ]
    },
    {
      id: 'ITB2024002',
      sender: 'Fashion Boutique',
      recipient: 'María González',
      origin: 'New York, NY',
      destination: 'Cartago, CR',
      status: 'delivered',
      priority: 'standard',
      weight: '1.2 kg',
      value: '$89.99',
      estimatedDelivery: '2024-06-10',
      progress: 100,
      deliveredAt: '2024-06-10 14:30'
    },
    {
      id: 'ITB2024003',
      sender: 'Tech Gadgets Inc',
      recipient: 'Carlos Ramírez',
      origin: 'Los Angeles, CA',
      destination: 'Alajuela, CR',
      status: 'pending',
      priority: 'economy',
      weight: '5.8 kg',
      value: '$1,250.00',
      estimatedDelivery: '2024-06-15',
      progress: 25
    },
    {
      id: 'ITB2024004',
      sender: 'Book Store Online',
      recipient: 'Ana Villalobos',
      origin: 'Chicago, IL',
      destination: 'Heredia, CR',
      status: 'problem',
      priority: 'express',
      weight: '0.8 kg',
      value: '$45.50',
      estimatedDelivery: '2024-06-11',
      progress: 60,
      issue: 'Dirección incompleta'
    }
  ];

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'from-yellow-400 to-orange-500',
      in_transit: 'from-blue-500 to-cyan-500',
      delivered: 'from-green-500 to-emerald-500',
      problem: 'from-red-500 to-pink-500'
    };
    return colors[status] || 'from-gray-400 to-gray-500';
  };

  const getStatusText = (status: string) => {
    const texts: Record<string, string> = {
      pending: 'Pendiente',
      in_transit: 'En Tránsito',
      delivered: 'Entregado',
      problem: 'Problema'
    };
    return texts[status] || 'Desconocido';
  };

  const getPriorityIcon = (priority: string) => {
    if (priority === 'express') return <Zap className="w-4 h-4 text-orange-500" />;
    if (priority === 'standard') return <Shield className="w-4 h-4 text-blue-500" />;
    return <Clock className="w-4 h-4 text-gray-500" />;
  };

  const filteredPackages = packages.filter(pkg => {
    const matchesFilter = filter === 'all' || pkg.status === filter;
    const matchesSearch = pkg.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pkg.recipient.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-lg border-b border-white/20 shadow-lg">
        <div className="px-6 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Gestión de Paquetes
              </h1>
              <p className="text-gray-600 mt-1">
                Administra y rastrea todos los paquetes en tiempo real
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Buscar por ID o destinatario..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-white/70 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent backdrop-blur-sm w-80"
                />
              </div>
              <button className="bg-gradient-to-r from-purple-500 to-pink-600 text-white px-6 py-2 rounded-xl hover:shadow-lg transition-all duration-300 flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Nuevo Paquete
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-3 mt-6">
            <Filter className="w-5 h-5 text-gray-600" />
            <div className="flex gap-2">
              {[
                { key: 'all', label: 'Todos', count: packages.length },
                { key: 'pending', label: 'Pendientes', count: packages.filter(p => p.status === 'pending').length },
                { key: 'in_transit', label: 'En Tránsito', count: packages.filter(p => p.status === 'in_transit').length },
                { key: 'delivered', label: 'Entregados', count: packages.filter(p => p.status === 'delivered').length },
                { key: 'problem', label: 'Problemas', count: packages.filter(p => p.status === 'problem').length }
              ].map(({ key, label, count }) => (
                <button
                  key={key}
                  onClick={() => setFilter(key)}
                  className={`px-4 py-2 rounded-lg transition-all duration-300 flex items-center gap-2 ${
                    filter === key
                      ? 'bg-purple-500 text-white shadow-lg'
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

      {/* Packages Grid */}
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredPackages.map((pkg) => (
            <div
              key={pkg.id}
              className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
            >
              {/* Package Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-lg text-gray-900">{pkg.id}</h3>
                    {getPriorityIcon(pkg.priority)}
                  </div>
                  <p className="text-sm text-gray-600">{pkg.sender}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium text-white bg-gradient-to-r ${getStatusColor(pkg.status)}`}>
                    {getStatusText(pkg.status)}
                  </span>
                  <button className="p-1 hover:bg-gray-100 rounded-lg">
                    <MoreVertical className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              </div>

              {/* Route */}
              <div className="flex items-center gap-3 mb-4 p-3 bg-white/50 rounded-xl">
                <div className="flex items-center gap-2 flex-1">
                  <MapPin className="w-4 h-4 text-blue-500" />
                  <span className="text-sm font-medium text-gray-700">{pkg.origin}</span>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400" />
                <div className="flex items-center gap-2 flex-1 justify-end">
                  <span className="text-sm font-medium text-gray-700">{pkg.destination}</span>
                  <MapPin className="w-4 h-4 text-green-500" />
                </div>
              </div>

              {/* Recipient */}
              <div className="mb-4">
                <p className="text-sm text-gray-600">Destinatario:</p>
                <p className="font-semibold text-gray-900">{pkg.recipient}</p>
              </div>

              {/* Package Details */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Peso</p>
                  <p className="font-semibold text-gray-900">{pkg.weight}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Valor</p>
                  <p className="font-semibold text-gray-900">{pkg.value}</p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Progreso</span>
                  <span className="text-sm text-gray-500">{pkg.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full bg-gradient-to-r ${getStatusColor(pkg.status)} transition-all duration-500`}
                    style={{ width: `${pkg.progress}%` }}
                  ></div>
                </div>
              </div>

              {/* Status Info */}
              {pkg.status === 'delivered' && (
                <div className="flex items-center gap-2 p-3 bg-green-50 rounded-xl mb-4">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-green-700">Entregado el {pkg.deliveredAt}</span>
                </div>
              )}

              {pkg.status === 'problem' && (
                <div className="flex items-center gap-2 p-3 bg-red-50 rounded-xl mb-4">
                  <AlertCircle className="w-4 h-4 text-red-500" />
                  <span className="text-sm text-red-700">{pkg.issue}</span>
                </div>
              )}

              {/* Timeline for in-transit packages */}
              {pkg.status === 'in_transit' && pkg.timeline && (
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Estado del Envío</p>
                  <div className="space-y-2">
                    {pkg.timeline.map((step, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${
                          step.completed ? 'bg-green-500' : 'bg-gray-300'
                        }`}></div>
                        <div className="flex-1">
                          <span className={`text-sm ${
                            step.completed ? 'text-gray-900 font-medium' : 'text-gray-500'
                          }`}>
                            {step.step}
                          </span>
                          <span className="text-xs text-gray-400 ml-2">{step.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2">
                <button className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 px-4 rounded-xl hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2">
                  <Eye className="w-4 h-4" />
                  Ver Detalles
                </button>
                <button className="bg-white/70 border border-gray-200 text-gray-700 py-2 px-4 rounded-xl hover:bg-white/90 transition-all duration-300 flex items-center justify-center gap-2">
                  <Truck className="w-4 h-4" />
                  Rastrear
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredPackages.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No hay paquetes</h3>
            <p className="text-gray-600">No se encontraron paquetes que coincidan con los filtros seleccionados.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModernPackages;