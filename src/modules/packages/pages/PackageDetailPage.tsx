// src/modules/packages/pages/PackageDetailPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigation } from '../../../contexts/NavigationContext';
import { ArrowLeft, Package, User, Truck, DollarSign } from 'lucide-react';

interface PackageDetail {
  id: string;
  trackingNumber: string;
  status: string;
  sender: string;
  recipient: string;
  weight: number;
  value: number;
}

const PackageDetailPage: React.FC = () => {
  const { navigate, getParam } = useNavigation();
  const packageId = getParam('id') || 'PKG001';
  
  const [packageData, setPackageData] = useState<PackageDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulación de carga de datos
    setTimeout(() => {
      const mockData: PackageDetail = {
        id: packageId,
        trackingNumber: `ITB${Math.random().toString().substr(2, 8)}`,
        status: 'En tránsito',
        sender: 'Juan Pérez',
        recipient: 'María González',
        weight: 2.5,
        value: 150.00
      };
      
      setPackageData(mockData);
      setLoading(false);
    }, 1000);
  }, [packageId]);

  if (loading) {
    return (
      <div className="p-6 lg:p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="h-40 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (!packageData) {
    return (
      <div className="p-6 lg:p-8">
        <div className="text-center py-12">
          <Package className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Paquete no encontrado</h3>
          <p className="mt-1 text-sm text-gray-500">El paquete solicitado no existe.</p>
          <div className="mt-6">
            <button
              onClick={() => navigate('packages')}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver a Paquetes
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => navigate('packages')}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Detalle del Paquete
            </h1>
            <p className="text-sm text-gray-500">
              {packageData.trackingNumber}
            </p>
          </div>
        </div>
        
        <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
          {packageData.status}
        </div>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Package Info */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <Package className="mr-2 h-5 w-5" />
            Información del Paquete
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-500">Tracking Number</label>
              <p className="mt-1 text-sm text-gray-900">{packageData.trackingNumber}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">Estado</label>
              <p className="mt-1 text-sm text-gray-900">{packageData.status}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">Peso</label>
              <p className="mt-1 text-sm text-gray-900">{packageData.weight} kg</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">Valor Declarado</label>
              <p className="mt-1 text-sm text-gray-900">${packageData.value}</p>
            </div>
          </div>
        </div>

        {/* People Info */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <User className="mr-2 h-5 w-5" />
            Remitente y Destinatario
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-500">Remitente</label>
              <p className="mt-1 text-sm text-gray-900">{packageData.sender}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">Destinatario</label>
              <p className="mt-1 text-sm text-gray-900">{packageData.recipient}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-6 flex space-x-3">
        <button
          onClick={() => navigate('package-edit', { id: packageId! })}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
        >
          Editar Paquete
        </button>
        <button
          onClick={() => navigate('tracking', { id: packageId! })}
          className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
        >
          <Truck className="mr-2 h-4 w-4" />
          Ver Tracking
        </button>
      </div>
    </div>
  );
};

export default PackageDetailPage;