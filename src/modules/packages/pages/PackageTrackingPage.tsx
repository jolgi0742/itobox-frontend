import React, { useState, useContext } from 'react';
import { Search, Package, MapPin, Clock, CheckCircle, Truck, AlertCircle, ArrowLeft, Eye, Phone, Mail, User } from 'lucide-react';
import { useNavigation } from '../../../contexts/NavigationContext';

interface TrackingEvent {
  id: number;
  status: string;
  location: string;
  description: string;
  timestamp: string;
  courier?: string;
}

interface PackageDetails {
  trackingNumber: string;
  status: string;
  sender: {
    name: string;
    phone: string;
    address: string;
  };
  recipient: {
    name: string;
    phone: string;
    address: string;
  };
  packageInfo: {
    weight: number;
    dimensions: string;
    serviceType: string;
    declaredValue: number;
  };
  timeline: TrackingEvent[];
  estimatedDelivery: string;
  actualDelivery?: string;
}

const PackageTrackingPage: React.FC = () => {
  const { navigate  } = useNavigation();
  const [trackingNumber, setTrackingNumber] = useState('');
  const [packageData, setPackageData] = useState<PackageDetails | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState('');

  // Datos simulados para demostración
  const mockPackageData: PackageDetails = {
    trackingNumber: 'ITB241216A001',
    status: 'in_transit',
    sender: {
      name: 'Tecnología Avanzada S.A.',
      phone: '+1 (555) 123-4567',
      address: '123 Business Ave, Miami, FL 33101'
    },
    recipient: {
      name: 'María García',
      phone: '+1 (555) 987-6543',
      address: '456 Residential St, Orlando, FL 32801'
    },
    packageInfo: {
      weight: 2.5,
      dimensions: '12x8x6 inches',
      serviceType: 'Express',
      declaredValue: 450.00
    },
    timeline: [
      {
        id: 1,
        status: 'created',
        location: 'Miami, FL',
        description: 'Paquete creado y etiquetado',
        timestamp: '2024-06-15T09:00:00Z',
        courier: 'Sistema'
      },
      {
        id: 2,
        status: 'picked_up',
        location: 'Miami, FL',
        description: 'Paquete recogido del remitente',
        timestamp: '2024-06-15T14:30:00Z',
        courier: 'Carlos Rodríguez'
      },
      {
        id: 3,
        status: 'in_transit',
        location: 'Centro de Distribución Miami',
        description: 'Paquete procesado y en camino',
        timestamp: '2024-06-15T18:00:00Z',
        courier: 'Centro de Distribución'
      },
      {
        id: 4,
        status: 'in_transit',
        location: 'En ruta a Orlando',
        description: 'Paquete en tránsito hacia destino',
        timestamp: '2024-06-16T08:00:00Z',
        courier: 'Ana López'
      }
    ],
    estimatedDelivery: '2024-06-16T16:00:00Z'
  };

  const handleSearch = async () => {
    if (!trackingNumber.trim()) {
      setError('Por favor ingresa un número de tracking');
      return;
    }

    setIsSearching(true);
    setError('');

    // Simular búsqueda
    setTimeout(() => {
      setIsSearching(false);
      if (trackingNumber.toUpperCase().includes('ITB')) {
        setPackageData({
          ...mockPackageData,
          trackingNumber: trackingNumber.toUpperCase()
        });
      } else {
        setError('No se encontró ningún paquete con ese número de tracking');
        setPackageData(null);
      }
    }, 1500);
  };

  const getStatusInfo = (status: string) => {
    const statusMap = {
      created: { label: 'Creado', color: 'bg-gray-100 text-gray-800', icon: Package },
      picked_up: { label: 'Recogido', color: 'bg-blue-100 text-blue-800', icon: CheckCircle },
      in_transit: { label: 'En Tránsito', color: 'bg-yellow-100 text-yellow-800', icon: Truck },
      out_for_delivery: { label: 'En Entrega', color: 'bg-purple-100 text-purple-800', icon: MapPin },
      delivered: { label: 'Entregado', color: 'bg-green-100 text-green-800', icon: CheckCircle },
      exception: { label: 'Excepción', color: 'bg-red-100 text-red-800', icon: AlertCircle }
    };
    
    return statusMap[status as keyof typeof statusMap] || statusMap.created;
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('es-ES', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
      time: date.toLocaleTimeString('es-ES', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    };
  };

  const statusInfo = packageData ? getStatusInfo(packageData.status) : null;
  const StatusIcon = statusInfo?.icon || Package;

  return (
    <div className="p-6 lg:p-8 -mt-20">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => navigate('packages')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </button>
          <Search className="w-8 h-8 text-gray-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Seguimiento de Paquetes</h1>
            <p className="text-gray-600">Rastrea el estado y ubicación de tus envíos</p>
          </div>
        </div>
      </div>

      {/* Search Section */}
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 mb-8">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 text-center">
            Ingresa tu número de tracking
          </h2>
          
          <div className="flex space-x-4">
            <div className="flex-1">
              <input
                type="text"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value.toUpperCase())}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full px-6 py-4 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ej: ITB241216A001"
                disabled={isSearching}
              />
            </div>
            <button
              onClick={handleSearch}
              disabled={isSearching}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {isSearching ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <Search className="w-5 h-5" />
              )}
              <span>{isSearching ? 'Buscando...' : 'Buscar'}</span>
            </button>
          </div>

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <p className="text-red-700">{error}</p>
              </div>
            </div>
          )}

          {/* Demo info */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-700 text-center">
              <strong>Demo:</strong> Prueba con cualquier número que contenga "ITB" (ej: ITB123456)
            </p>
          </div>
        </div>
      </div>

      {/* Package Details */}
      {packageData && (
        <div className="space-y-8">
          {/* Status Overview */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Estado del Envío</h2>
                <p className="text-gray-600 font-mono text-lg">{packageData.trackingNumber}</p>
              </div>
              <div className="text-right">
                <span className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium ${statusInfo?.color}`}>
                  <StatusIcon className="w-4 h-4" />
                  <span>{statusInfo?.label}</span>
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <h3 className="font-medium text-blue-900">Entrega Estimada</h3>
                </div>
                <p className="text-blue-700">
                  {formatDateTime(packageData.estimatedDelivery).date}
                </p>
                <p className="text-sm text-blue-600">
                  Antes de las {formatDateTime(packageData.estimatedDelivery).time}
                </p>
              </div>

              <div className="p-4 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Package className="w-5 h-5 text-green-600" />
                  <h3 className="font-medium text-green-900">Tipo de Servicio</h3>
                </div>
                <p className="text-green-700">{packageData.packageInfo.serviceType}</p>
                <p className="text-sm text-green-600">
                  {packageData.packageInfo.weight} lbs
                </p>
              </div>

              <div className="p-4 bg-purple-50 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <MapPin className="w-5 h-5 text-purple-600" />
                  <h3 className="font-medium text-purple-900">Última Ubicación</h3>
                </div>
                <p className="text-purple-700">
                  {packageData.timeline[packageData.timeline.length - 1]?.location}
                </p>
                <p className="text-sm text-purple-600">
                  {formatDateTime(packageData.timeline[packageData.timeline.length - 1]?.timestamp).time}
                </p>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Historial de Seguimiento</h3>
            
            <div className="space-y-6">
              {packageData.timeline.reverse().map((event, index) => {
                const eventStatusInfo = getStatusInfo(event.status);
                const EventIcon = eventStatusInfo.icon;
                const dateTime = formatDateTime(event.timestamp);
                
                return (
                  <div key={event.id} className="flex items-start space-x-4">
                    <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${eventStatusInfo.color}`}>
                      <EventIcon className="w-5 h-5" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-lg font-medium text-gray-900">
                          {eventStatusInfo.label}
                        </h4>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">{dateTime.date}</p>
                          <p className="text-sm text-gray-600">{dateTime.time}</p>
                        </div>
                      </div>
                      
                      <p className="text-gray-600 mt-1">{event.description}</p>
                      
                      <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-4 h-4" />
                          <span>{event.location}</span>
                        </div>
                        {event.courier && (
                          <div className="flex items-center space-x-1">
                            <User className="w-4 h-4" />
                            <span>{event.courier}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Package & Contact Details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Sender Information */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Información del Remitente</h3>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <User className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-900">{packageData.sender.name}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-600">{packageData.sender.phone}</span>
                </div>
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                  <span className="text-gray-600">{packageData.sender.address}</span>
                </div>
              </div>
            </div>

            {/* Recipient Information */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Información del Destinatario</h3>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <User className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-900">{packageData.recipient.name}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-600">{packageData.recipient.phone}</span>
                </div>
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                  <span className="text-gray-600">{packageData.recipient.address}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Package Details */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Detalles del Paquete</h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <p className="text-sm text-gray-600">Peso</p>
                <p className="text-lg font-medium text-gray-900">{packageData.packageInfo.weight} lbs</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Dimensiones</p>
                <p className="text-lg font-medium text-gray-900">{packageData.packageInfo.dimensions}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Servicio</p>
                <p className="text-lg font-medium text-gray-900">{packageData.packageInfo.serviceType}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Valor Declarado</p>
                <p className="text-lg font-medium text-green-600">${packageData.packageInfo.declaredValue.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PackageTrackingPage;