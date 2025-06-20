import React, { useContext, useState } from 'react';
import { Package, User, MapPin, Clock, CheckCircle, Truck, Edit, Trash2, ArrowLeft, Phone, Mail, Calendar, Weight, Ruler, DollarSign } from 'lucide-react';
import { useNavigation } from '../../../contexts/NavigationContext';

export interface PackageDetailsPageProps {
  packageId: string;
}

interface PackageData {
  id: string;
  trackingNumber: string;
  status: 'pending' | 'picked_up' | 'in_transit' | 'out_for_delivery' | 'delivered';
  sender: {
    name: string;
    phone: string;
    email: string;
    address: string;
  };
  recipient: {
    name: string;
    phone: string;
    email: string;
    address: string;
  };
  packageInfo: {
    weight: number;
    dimensions: {
      length: number;
      width: number;
      height: number;
    };
    declaredValue: number;
    serviceType: 'economy' | 'standard' | 'express';
    specialInstructions?: string;
  };
  timeline: Array<{
    id: number;
    status: string;
    location: string;
    description: string;
    timestamp: string;
    courier?: string;
  }>;
  courier?: {
    name: string;
    phone: string;
    vehicleInfo: string;
  };
  estimatedDelivery: string;
  actualDelivery?: string;
  cost: number;
}

const PackageDetailsPage: React.FC<PackageDetailsPageProps> = ({ packageId }) => {
  const { navigate  } = useNavigation();
  
  // Datos simulados basados en el packageId
  const packageData: PackageData = {
    id: packageId,
    trackingNumber: `ITB241215${packageId.padStart(3, '0')}`,
    status: 'in_transit',
    sender: {
      name: 'Tecnología Avanzada S.A.',
      phone: '+1 (555) 123-4567',
      email: 'contacto@tecnoavanzada.com',
      address: '123 Business Ave, Miami, FL 33101'
    },
    recipient: {
      name: 'María García',
      phone: '+1 (555) 987-6543',
      email: 'maria.garcia@email.com',
      address: '456 Residential St, Orlando, FL 32801'
    },
    packageInfo: {
      weight: 2.5,
      dimensions: {
        length: 12,
        width: 8,
        height: 6
      },
      declaredValue: 450.00,
      serviceType: 'express',
      specialInstructions: 'Manejar con cuidado - contiene equipos electrónicos'
    },
    timeline: [
      {
        id: 1,
        status: 'created',
        location: 'Miami, FL',
        description: 'Paquete creado y etiquetado',
        timestamp: '2024-06-15T09:00:00Z'
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
        timestamp: '2024-06-15T18:00:00Z'
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
    courier: {
      name: 'Ana López',
      phone: '+1 (555) 345-6789',
      vehicleInfo: 'Van Ford Transit - Placa: ITB-456'
    },
    estimatedDelivery: '2024-06-16T16:00:00Z',
    cost: 85.50
  };

  const getStatusInfo = (status: string) => {
    const statusMap = {
      pending: { label: 'Pendiente', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      picked_up: { label: 'Recogido', color: 'bg-blue-100 text-blue-800', icon: CheckCircle },
      in_transit: { label: 'En Tránsito', color: 'bg-purple-100 text-purple-800', icon: Truck },
      out_for_delivery: { label: 'En Entrega', color: 'bg-orange-100 text-orange-800', icon: MapPin },
      delivered: { label: 'Entregado', color: 'bg-green-100 text-green-800', icon: CheckCircle }
    };
    
    return statusMap[status as keyof typeof statusMap] || statusMap.pending;
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

  const statusInfo = getStatusInfo(packageData.status);
  const StatusIcon = statusInfo.icon;

  const handleEditPackage = () => {
    console.log('Editar paquete:', packageId);
    navigate('edit-package');
  };

  const handleDeletePackage = () => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este paquete?')) {
      console.log('Eliminar paquete:', packageId);
      navigate('packages');
    }
  };

  const handleTrackPackage = () => {
    navigate('package-tracking');
  };

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
          <Package className="w-8 h-8 text-gray-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Detalles del Paquete</h1>
            <p className="text-gray-600 font-mono text-lg">{packageData.trackingNumber}</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <span className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium ${statusInfo.color}`}>
            <StatusIcon className="w-4 h-4" />
            <span>{statusInfo.label}</span>
          </span>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={handleTrackPackage}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Truck className="w-4 h-4" />
              <span>Rastrear</span>
            </button>
            <button 
              onClick={handleEditPackage}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Edit className="w-4 h-4" />
              <span>Editar</span>
            </button>
            <button 
              onClick={handleDeletePackage}
              className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              <span>Eliminar</span>
            </button>
          </div>
        </div>
      </div>

      {/* Package Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Sender & Recipient Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Sender */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
              <div className="flex items-center space-x-3 mb-4">
                <User className="w-6 h-6 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">Remitente</h3>
              </div>
              
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Nombre</p>
                  <p className="font-medium text-gray-900">{packageData.sender.name}</p>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{packageData.sender.phone}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{packageData.sender.email}</span>
                </div>
                <div className="flex items-start space-x-3">
                  <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                  <span className="text-sm text-gray-600">{packageData.sender.address}</span>
                </div>
              </div>
            </div>

            {/* Recipient */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
              <div className="flex items-center space-x-3 mb-4">
                <MapPin className="w-6 h-6 text-orange-600" />
                <h3 className="text-lg font-semibold text-gray-900">Destinatario</h3>
              </div>
              
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Nombre</p>
                  <p className="font-medium text-gray-900">{packageData.recipient.name}</p>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{packageData.recipient.phone}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{packageData.recipient.email}</span>
                </div>
                <div className="flex items-start space-x-3">
                  <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                  <span className="text-sm text-gray-600">{packageData.recipient.address}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Package Information */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
            <div className="flex items-center space-x-3 mb-6">
              <Package className="w-6 h-6 text-green-600" />
              <h3 className="text-lg font-semibold text-gray-900">Información del Paquete</h3>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <Weight className="w-6 h-6 text-gray-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Peso</p>
                <p className="text-lg font-semibold text-gray-900">{packageData.packageInfo.weight} lbs</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <Ruler className="w-6 h-6 text-gray-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Dimensiones</p>
                <p className="text-lg font-semibold text-gray-900">
                  {packageData.packageInfo.dimensions.length}" x {packageData.packageInfo.dimensions.width}" x {packageData.packageInfo.dimensions.height}"
                </p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <DollarSign className="w-6 h-6 text-gray-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Valor Declarado</p>
                <p className="text-lg font-semibold text-gray-900">${packageData.packageInfo.declaredValue.toFixed(2)}</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <Truck className="w-6 h-6 text-gray-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Servicio</p>
                <p className="text-lg font-semibold text-gray-900 capitalize">{packageData.packageInfo.serviceType}</p>
              </div>
            </div>

            {packageData.packageInfo.specialInstructions && (
              <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <h4 className="font-medium text-yellow-900 mb-2">Instrucciones Especiales</h4>
                <p className="text-sm text-yellow-800">{packageData.packageInfo.specialInstructions}</p>
              </div>
            )}
          </div>

          {/* Timeline */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Historial de Seguimiento</h3>
            
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
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Delivery Info */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Información de Entrega</h3>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Entrega Estimada</p>
                  <p className="font-medium text-gray-900">
                    {formatDateTime(packageData.estimatedDelivery).date}
                  </p>
                  <p className="text-sm text-gray-600">
                    Antes de las {formatDateTime(packageData.estimatedDelivery).time}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <DollarSign className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Costo Total</p>
                  <p className="font-medium text-green-600 text-lg">${packageData.cost.toFixed(2)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Courier Info */}
          {packageData.courier && (
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Courier Asignado</h3>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium">
                    {packageData.courier.name.split(' ').map(n => n.charAt(0)).join('')}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{packageData.courier.name}</p>
                    <p className="text-sm text-gray-600">{packageData.courier.phone}</p>
                  </div>
                </div>
                
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Vehículo</p>
                  <p className="font-medium text-gray-900">{packageData.courier.vehicleInfo}</p>
                </div>

                <button className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                  <Phone className="w-4 h-4" />
                  <span>Contactar Courier</span>
                </button>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Acciones Rápidas</h3>
            
            <div className="space-y-3">
              <button 
                onClick={() => navigate('package-tracking')}
                className="w-full flex items-center space-x-2 px-4 py-3 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200"
              >
                <Truck className="w-4 h-4" />
                <span>Seguimiento Detallado</span>
              </button>
              
              <button className="w-full flex items-center space-x-2 px-4 py-3 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200">
                <Mail className="w-4 h-4" />
                <span>Enviar Actualización</span>
              </button>
              
              <button className="w-full flex items-center space-x-2 px-4 py-3 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200">
                <Package className="w-4 h-4" />
                <span>Duplicar Paquete</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PackageDetailsPage;