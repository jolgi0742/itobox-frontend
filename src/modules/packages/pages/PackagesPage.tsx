import React, { useState } from 'react';
import { useNavigation } from '../../../contexts/NavigationContext';
import { 
  Package, 
  Search, 
  Filter, 
  Plus, 
  Eye, 
  MapPin, 
  Edit, 
  MoreHorizontal,
  Clock,
  Truck,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface PackageItem {
  id: string;
  trackingNumber: string;
  sender: string;
  recipient: string;
  destination: string;
  weight: number;
  status: 'pending' | 'picked_up' | 'in_transit' | 'delivered' | 'delayed';
  service: 'express' | 'standard' | 'economy';
  courier: string;
  createdAt: string;
  estimatedDelivery: string;
}

const PackagesPage: React.FC = () => {
  const { navigate } = useNavigation();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [serviceFilter, setServiceFilter] = useState('all');

  // Datos simulados de paquetes
  const packages: PackageItem[] = [
    {
      id: 'PKG-001',
      trackingNumber: 'ITB240001',
      sender: 'Ana García',
      recipient: 'Carlos López',
      destination: 'San José Centro',
      weight: 2.5,
      status: 'in_transit',
      service: 'express',
      courier: 'Carlos Mendoza',
      createdAt: '2024-06-22',
      estimatedDelivery: '2024-06-23'
    },
    {
      id: 'PKG-002',
      trackingNumber: 'ITB240002',
      sender: 'María Rodríguez',
      recipient: 'Luis Fernández',
      destination: 'Cartago',
      weight: 1.8,
      status: 'delivered',
      service: 'standard',
      courier: 'Ana Pérez',
      createdAt: '2024-06-21',
      estimatedDelivery: '2024-06-22'
    },
    {
      id: 'PKG-003',
      trackingNumber: 'ITB240003',
      sender: 'Roberto Silva',
      recipient: 'Carmen Jiménez',
      destination: 'Heredia',
      weight: 3.2,
      status: 'pending',
      service: 'economy',
      courier: 'No asignado',
      createdAt: '2024-06-22',
      estimatedDelivery: '2024-06-24'
    },
    {
      id: 'PKG-004',
      trackingNumber: 'ITB240004',
      sender: 'Laura Monge',
      recipient: 'Diego Vargas',
      destination: 'Alajuela',
      weight: 4.1,
      status: 'picked_up',
      service: 'express',
      courier: 'Luis García',
      createdAt: '2024-06-22',
      estimatedDelivery: '2024-06-23'
    },
    {
      id: 'PKG-005',
      trackingNumber: 'ITB240005',
      sender: 'José Ramírez',
      recipient: 'Patricia Mora',
      destination: 'Puntarenas',
      weight: 2.0,
      status: 'delayed',
      service: 'standard',
      courier: 'Carlos Mendoza',
      createdAt: '2024-06-20',
      estimatedDelivery: '2024-06-22'
    }
  ];

  const getStatusInfo = (status: string) => {
    const statusMap = {
      pending: { label: 'Pendiente', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      picked_up: { label: 'Recogido', color: 'bg-blue-100 text-blue-800', icon: Package },
      in_transit: { label: 'En tránsito', color: 'bg-purple-100 text-purple-800', icon: Truck },
      delivered: { label: 'Entregado', color: 'bg-green-100 text-green-800', icon: CheckCircle },
      delayed: { label: 'Retrasado', color: 'bg-red-100 text-red-800', icon: AlertCircle }
    };
    return statusMap[status as keyof typeof statusMap] || statusMap.pending;
  };

  const getServiceInfo = (service: string) => {
    const serviceMap = {
      express: { label: 'Express', color: 'bg-red-100 text-red-800' },
      standard: { label: 'Estándar', color: 'bg-blue-100 text-blue-800' },
      economy: { label: 'Económico', color: 'bg-green-100 text-green-800' }
    };
    return serviceMap[service as keyof typeof serviceMap] || serviceMap.standard;
  };

  // Filtros
  const filteredPackages = packages.filter(pkg => {
    const matchesSearch = 
      pkg.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pkg.sender.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pkg.recipient.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pkg.destination.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || pkg.status === statusFilter;
    const matchesService = serviceFilter === 'all' || pkg.service === serviceFilter;
    
    return matchesSearch && matchesStatus && matchesService;
  });

  // Estadísticas
  const stats = {
    total: packages.length,
    pending: packages.filter(p => p.status === 'pending').length,
    in_transit: packages.filter(p => p.status === 'in_transit').length,
    delivered: packages.filter(p => p.status === 'delivered').length
  };

  const handleMoreActions = (packageId: string, action: string) => {
    switch (action) {
      case 'duplicate':
        console.log(`Duplicar paquete ${packageId}`);
        break;
      case 'print':
        console.log(`Imprimir etiqueta ${packageId}`);
        break;
      case 'delete':
        console.log(`Eliminar paquete ${packageId}`);
        break;
      case 'assign':
        console.log(`Asignar courier ${packageId}`);
        break;
      case 'priority':
        console.log(`Marcar como prioritario ${packageId}`);
        break;
      case 'notes':
        console.log(`Agregar notas ${packageId}`);
        break;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Paquetes</h1>
          <p className="text-gray-600 mt-1">
            Administra y monitorea todos los paquetes del sistema
          </p>
        </div>
        
        <button
          onClick={() => navigate('package-create')}
          className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          <Plus className="w-5 h-5" />
          <span className="font-medium">Nuevo Paquete</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total</p>
              <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Package className="w-6 h-6 text-blue-600" />
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
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">En Tránsito</p>
              <p className="text-3xl font-bold text-purple-600">{stats.in_transit}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <Truck className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Entregados</p>
              <p className="text-3xl font-bold text-green-600">{stats.delivered}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filtros y búsqueda */}
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar por tracking, remitente, destinatario..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Todos los estados</option>
              <option value="pending">Pendiente</option>
              <option value="picked_up">Recogido</option>
              <option value="in_transit">En tránsito</option>
              <option value="delivered">Entregado</option>
              <option value="delayed">Retrasado</option>
            </select>
          </div>
          
          <select
            value={serviceFilter}
            onChange={(e) => setServiceFilter(e.target.value)}
            className="px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Todos los servicios</option>
            <option value="express">Express</option>
            <option value="standard">Estándar</option>
            <option value="economy">Económico</option>
          </select>
        </div>
      </div>

      {/* Lista de paquetes */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Paquete
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Remitente / Destinatario
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Servicio
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Courier
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPackages.map((pkg) => {
                const statusInfo = getStatusInfo(pkg.status);
                const serviceInfo = getServiceInfo(pkg.service);
                const StatusIcon = statusInfo.icon;
                
                return (
                  <tr key={pkg.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {pkg.trackingNumber}
                        </div>
                        <div className="text-sm text-gray-500">
                          {pkg.weight}kg • {pkg.destination}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          De: {pkg.sender}
                        </div>
                        <div className="text-sm text-gray-500">
                          Para: {pkg.recipient}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.color}`}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {statusInfo.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${serviceInfo.color}`}>
                        {serviceInfo.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{pkg.courier}</div>
                      <div className="text-sm text-gray-500">{pkg.estimatedDelivery}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => navigate('package-detail', { id: pkg.id })}
                          className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          Ver
                        </button>
                        <button
                          onClick={() => navigate('package-tracking', { id: pkg.id })}
                          className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                        >
                          <MapPin className="w-4 h-4 mr-1" />
                          Rastrear
                        </button>
                        <button
                          onClick={() => navigate('package-edit', { id: pkg.id })}
                          className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-colors"
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Editar
                        </button>
                        
                        <div className="relative group">
                          <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors">
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                          
                          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                            <div className="py-1">
                              <button
                                onClick={() => handleMoreActions(pkg.id, 'duplicate')}
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                              >
                                Duplicar paquete
                              </button>
                              <button
                                onClick={() => handleMoreActions(pkg.id, 'print')}
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                              >
                                Imprimir etiqueta
                              </button>
                              <button
                                onClick={() => handleMoreActions(pkg.id, 'assign')}
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                              >
                                Asignar courier
                              </button>
                              <button
                                onClick={() => handleMoreActions(pkg.id, 'priority')}
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                              >
                                Marcar prioritario
                              </button>
                              <button
                                onClick={() => handleMoreActions(pkg.id, 'notes')}
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                              >
                                Agregar notas
                              </button>
                              <button
                                onClick={() => handleMoreActions(pkg.id, 'delete')}
                                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                              >
                                Eliminar
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        {filteredPackages.length === 0 && (
          <div className="text-center py-12">
            <Package className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No se encontraron paquetes</h3>
            <p className="mt-1 text-sm text-gray-500">
              Intenta ajustar los filtros de búsqueda.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PackagesPage;