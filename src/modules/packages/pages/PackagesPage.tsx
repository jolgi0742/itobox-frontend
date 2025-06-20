import React, { useState, useContext } from 'react';
import { Package, Search, Filter, Plus, Eye, Edit, Truck, MapPin, Clock, CheckCircle } from 'lucide-react';
import { useNavigation } from '../../../contexts/NavigationContext';

const PackagesPage: React.FC = () => {
  const { navigate  } = useNavigation();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const packages = [
    {
      id: 1,
      trackingNumber: 'ITB241215A001',
      sender: 'Tecnología Avanzada S.A.',
      recipient: 'Maria Rodriguez',
      origin: 'Miami, FL',
      destination: 'Orlando, FL',
      status: 'in_transit',
      weight: 2.5,
      estimatedDelivery: '2024-06-17',
      serviceType: 'standard',
      value: 450.00
    },
    {
      id: 2,
      trackingNumber: 'ITB241215B002',
      sender: 'Juan Carlos Pérez',
      recipient: 'Ana Martinez',
      origin: 'Tampa, FL',
      destination: 'Jacksonville, FL',
      status: 'delivered',
      weight: 1.2,
      estimatedDelivery: '2024-06-16',
      serviceType: 'express',
      value: 125.50
    },
    {
      id: 3,
      trackingNumber: 'ITB241215C003',
      sender: 'Importaciones del Caribe',
      recipient: 'Roberto Silva',
      origin: 'Key West, FL',
      destination: 'Tallahassee, FL',
      status: 'pending',
      weight: 5.8,
      estimatedDelivery: '2024-06-18',
      serviceType: 'economy',
      value: 890.25
    },
    {
      id: 4,
      trackingNumber: 'ITB241215D004',
      sender: 'Elena Fernández',
      recipient: 'Carlos Mendoza',
      origin: 'Fort Lauderdale, FL',
      destination: 'Pensacola, FL',
      status: 'out_for_delivery',
      weight: 0.8,
      estimatedDelivery: '2024-06-16',
      serviceType: 'express',
      value: 75.00
    },
    {
      id: 5,
      trackingNumber: 'ITB241215E005',
      sender: 'Distribuidora MegaCorp',
      recipient: 'Luis Herrera',
      origin: 'Miami, FL',
      destination: 'Gainesville, FL',
      status: 'in_transit',
      weight: 12.3,
      estimatedDelivery: '2024-06-19',
      serviceType: 'standard',
      value: 1250.75
    }
  ];

  const filteredPackages = packages.filter(pkg => {
    const matchesSearch = pkg.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pkg.sender.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pkg.recipient.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pkg.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pkg.destination.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || pkg.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  const getStatusInfo = (status: string) => {
    const statusMap = {
      pending: { label: 'Pendiente', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      in_transit: { label: 'En Tránsito', color: 'bg-blue-100 text-blue-800', icon: Truck },
      out_for_delivery: { label: 'En Entrega', color: 'bg-purple-100 text-purple-800', icon: MapPin },
      delivered: { label: 'Entregado', color: 'bg-green-100 text-green-800', icon: CheckCircle }
    };
    
    return statusMap[status as keyof typeof statusMap] || statusMap.pending;
  };

  const getServiceTypeInfo = (serviceType: string) => {
    const serviceMap = {
      economy: { label: 'Económico', color: 'text-gray-600' },
      standard: { label: 'Estándar', color: 'text-blue-600' },
      express: { label: 'Express', color: 'text-purple-600' }
    };
    
    return serviceMap[serviceType as keyof typeof serviceMap] || serviceMap.standard;
  };

  const handleViewPackage = (packageId: number) => {
    console.log('Ver paquete:', packageId);
    navigate('package-details');
  };

  const handleEditPackage = (packageId: number) => {
    console.log('Editar paquete:', packageId);
    navigate('edit-package');
  };

  const handleTrackPackage = (trackingNumber: string) => {
    console.log('Rastrear paquete:', trackingNumber);
    navigate('tracking');
  };

  return (
    <div className="p-6 lg:p-8 -mt-20">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
        <div className="flex items-center space-x-3 mb-4 lg:mb-0">
          <Package className="w-8 h-8 text-gray-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestión de Paquetes</h1>
            <p className="text-gray-600">Administra todos los envíos y su estado de entrega</p>
          </div>
        </div>
        
        <button 
          onClick={() => navigate('new-package')}
          className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          <Plus className="w-5 h-5" />
          <span>Nuevo Paquete</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Paquetes</p>
              <p className="text-2xl font-bold text-gray-900">{packages.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">En Tránsito</p>
              <p className="text-2xl font-bold text-gray-900">
                {packages.filter(p => p.status === 'in_transit').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <Truck className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Entregados</p>
              <p className="text-2xl font-bold text-gray-900">
                {packages.filter(p => p.status === 'delivered').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Valor Total</p>
              <p className="text-2xl font-bold text-gray-900">
                ${packages.reduce((sum, p) => sum + p.value, 0).toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
              <Package className="w-6 h-6 text-orange-600" />
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
                placeholder="Buscar por tracking, remitente, destinatario..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-80"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select 
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Todos los estados</option>
                <option value="pending">Pendientes</option>
                <option value="in_transit">En Tránsito</option>
                <option value="out_for_delivery">En Entrega</option>
                <option value="delivered">Entregados</option>
              </select>
            </div>
          </div>

          <div className="text-sm text-gray-600">
            Mostrando {filteredPackages.length} de {packages.length} paquetes
          </div>
        </div>
      </div>

      {/* Packages Table */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tracking</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Remitente/Destinatario</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ruta</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Detalles</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPackages.map((pkg) => {
                const statusInfo = getStatusInfo(pkg.status);
                const serviceInfo = getServiceTypeInfo(pkg.serviceType);
                const StatusIcon = statusInfo.icon;

                return (
                  <tr key={pkg.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <p className="font-mono text-sm font-medium text-blue-600">{pkg.trackingNumber}</p>
                        <p className={`text-xs font-medium ${serviceInfo.color}`}>
                          {serviceInfo.label}
                        </p>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-500">De:</span>
                          <span className="text-sm font-medium text-gray-900">{pkg.sender}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-500">Para:</span>
                          <span className="text-sm text-gray-600">{pkg.recipient}</span>
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-4 h-4 text-green-500" />
                          <span className="text-sm text-gray-900">{pkg.origin}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-4 h-4 text-red-500" />
                          <span className="text-sm text-gray-900">{pkg.destination}</span>
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="text-sm text-gray-900">{pkg.weight} lbs</div>
                        <div className="text-sm text-green-600 font-medium">${pkg.value.toFixed(2)}</div>
                        <div className="text-xs text-gray-500">{pkg.estimatedDelivery}</div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                        <StatusIcon className="w-3 h-3" />
                        <span>{statusInfo.label}</span>
                      </span>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => handleViewPackage(pkg.id)}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                          title="Ver detalles"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleEditPackage(pkg.id)}
                          className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                          title="Editar paquete"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleTrackPackage(pkg.trackingNumber)}
                          className="p-2 text-purple-600 hover:bg-purple-100 rounded-lg transition-colors"
                          title="Rastrear paquete"
                        >
                          <Truck className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredPackages.length > 0 && (
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Mostrando {filteredPackages.length} de {packages.length} paquetes
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

export default PackagesPage;