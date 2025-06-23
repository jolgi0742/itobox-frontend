import React, { useState } from 'react';
import { 
  MapPin, 
  Search, 
  Package, 
  Truck, 
  Plane, 
  Clock,
  CheckCircle,
  AlertCircle,
  Navigation,
  Calendar,
  User,
  Phone,
  Mail,
  Eye,
  QrCode,
  Share2,
  Download,
  RefreshCw,
  MapIcon
} from 'lucide-react';

// Tracking Page
export const TrackingPage: React.FC = () => {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [trackingResult, setTrackingResult] = useState<any>(null);

  const handleSearch = () => {
    if (trackingNumber.trim()) {
      // Simular búsqueda
      setTrackingResult({
        trackingNumber: trackingNumber,
        status: 'in_transit',
        currentLocation: 'Orlando, FL',
        estimatedDelivery: '2025-06-17',
        events: [
          { date: '2025-06-15 10:30', location: 'Miami, FL', description: 'Paquete creado' },
          { date: '2025-06-15 14:20', location: 'Miami, FL', description: 'Paquete recogido' },
          { date: '2025-06-16 09:15', location: 'Orlando, FL', description: 'En tránsito' }
        ]
      });
    }
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center space-x-3 mb-8">
        <Search className="w-8 h-8 text-blue-600" />
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tracking de Paquetes</h1>
          <p className="text-gray-600">Rastrea el estado de cualquier envío</p>
        </div>
      </div>

      {/* Search Box */}
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 mb-8">
        <div className="max-w-2xl mx-auto">
          <label className="block text-lg font-medium text-gray-900 mb-4 text-center">
            Ingresa el número de tracking
          </label>
          <div className="flex space-x-4">
            <input
              type="text"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
              placeholder="ITB123456789"
            />
            <button
              onClick={handleSearch}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Buscar
            </button>
          </div>
        </div>
      </div>

      {/* Tracking Result */}
      {trackingResult && (
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Tracking: {trackingResult.trackingNumber}</h2>
            <p className="text-lg text-blue-600 mt-2">Estado: En Tránsito</p>
            <p className="text-gray-600">Ubicación actual: {trackingResult.currentLocation}</p>
            <p className="text-gray-600">Entrega estimada: {trackingResult.estimatedDelivery}</p>
          </div>

          <div className="max-w-2xl mx-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Historial de Eventos</h3>
            <div className="space-y-4">
              {trackingResult.events.map((event: any, index: number) => (
                <div key={index} className="flex space-x-4">
                  <div className="flex-shrink-0 w-3 h-3 bg-blue-600 rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium text-gray-900">{event.description}</p>
                    <p className="text-sm text-gray-600">{event.location}</p>
                    <p className="text-sm text-gray-500">{event.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrackingPage;