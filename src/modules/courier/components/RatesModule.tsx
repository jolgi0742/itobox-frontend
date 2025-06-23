import React, { useState } from 'react';
import { 
  Calculator, 
  Scale, 
  Truck, 
  Package, 
  MapPin, 
  Plus, 
  Edit, 
  Trash2, 
  Search,
  Filter
} from 'lucide-react';

interface Rate {
  id: string;
  service: string;
  zone: string;
  weightMin: number;
  weightMax: number;
  baseRate: number;
  perKgRate: number;
  deliveryTime: string;
  isActive: boolean;
}

interface RateCalculation {
  weight: number;
  length: number;
  width: number;
  height: number;
  origin: string;
  destination: string;
  service: string;
  declaredValue: number;
}

const RatesModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'rates' | 'calculator' | 'services'>('rates');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedZone, setSelectedZone] = useState<string>('all');
  const [calculation, setCalculation] = useState<RateCalculation>({
    weight: 0,
    length: 0,
    width: 0,
    height: 0,
    origin: '',
    destination: '',
    service: 'standard',
    declaredValue: 0
  });

  const [rates] = useState<Rate[]>([
    {
      id: '1',
      service: 'Express',
      zone: 'Local',
      weightMin: 0,
      weightMax: 5,
      baseRate: 15.00,
      perKgRate: 3.50,
      deliveryTime: '1-2 días',
      isActive: true
    },
    {
      id: '2',
      service: 'Standard',
      zone: 'Local',
      weightMin: 0,
      weightMax: 10,
      baseRate: 10.00,
      perKgRate: 2.50,
      deliveryTime: '3-5 días',
      isActive: true
    },
    {
      id: '3',
      service: 'Economy',
      zone: 'National',
      weightMin: 0,
      weightMax: 20,
      baseRate: 25.00,
      perKgRate: 5.00,
      deliveryTime: '7-10 días',
      isActive: true
    },
    {
      id: '4',
      service: 'Express',
      zone: 'International',
      weightMin: 0,
      weightMax: 15,
      baseRate: 45.00,
      perKgRate: 8.50,
      deliveryTime: '5-7 días',
      isActive: true
    }
  ]);

  const filteredRates = rates.filter((rate: Rate) => {
    const matchesSearch = rate.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         rate.zone.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesZone = selectedZone === 'all' || rate.zone.toLowerCase() === selectedZone.toLowerCase();
    return matchesSearch && matchesZone;
  });

  const calculateRate = (): number => {
    const { weight, length, width, height, service } = calculation;
    
    if (!weight || weight <= 0) return 0;
    
    // Cálculo de peso volumétrico
    const volumetricWeight = (length * width * height) / 5000;
    const chargeableWeight = Math.max(weight, volumetricWeight);
    
    // Encontrar tarifa aplicable
    const applicableRate = rates.find((rate: Rate) => 
      rate.service.toLowerCase() === service.toLowerCase() &&
      chargeableWeight >= rate.weightMin &&
      chargeableWeight <= rate.weightMax
    );
    
    if (!applicableRate) return 0;
    
    // Cálculo final
    const totalRate = applicableRate.baseRate + (chargeableWeight * applicableRate.perKgRate);
    return parseFloat(totalRate.toFixed(2));
  };

  const handleCalculationChange = (field: keyof RateCalculation, value: string | number): void => {
    setCalculation(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getZoneColor = (zone: string): string => {
    switch (zone.toLowerCase()) {
      case 'local': return 'bg-green-100 text-green-800';
      case 'national': return 'bg-blue-100 text-blue-800';
      case 'international': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getServiceIcon = (service: string): React.ReactNode => {
    switch (service.toLowerCase()) {
      case 'express': return <Truck className="w-4 h-4" />;
      case 'standard': return <Package className="w-4 h-4" />;
      case 'economy': return <Scale className="w-4 h-4" />;
      default: return <Package className="w-4 h-4" />;
    }
  };

  const renderRatesTable = (): React.ReactNode => (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Tarifas Configuradas</h3>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Nueva Tarifa
          </button>
        </div>
        
        <div className="flex gap-4 mb-4">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por servicio o zona..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="relative">
            <Filter className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
            <select
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={selectedZone}
              onChange={(e) => setSelectedZone(e.target.value)}
            >
              <option value="all">Todas las zonas</option>
              <option value="local">Local</option>
              <option value="national">Nacional</option>
              <option value="international">Internacional</option>
            </select>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Servicio
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Zona
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Peso (kg)
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tarifa Base
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Por kg adicional
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tiempo de entrega
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredRates.map((rate) => (
              <tr key={rate.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    {getServiceIcon(rate.service)}
                    <span className="text-sm font-medium text-gray-900">{rate.service}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getZoneColor(rate.zone)}`}>
                    {rate.zone}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {rate.weightMin} - {rate.weightMax} kg
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ${rate.baseRate.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ${rate.perKgRate.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {rate.deliveryTime}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    rate.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {rate.isActive ? 'Activa' : 'Inactiva'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex gap-2">
                    <button className="text-blue-600 hover:text-blue-900">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="text-red-600 hover:text-red-900">
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
  );

  const renderCalculator = (): React.ReactNode => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Calculator className="w-5 h-5" />
          Calculadora de Tarifas
        </h3>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Origen
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ciudad de origen"
                  value={calculation.origin}
                  onChange={(e) => handleCalculationChange('origin', e.target.value)}
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Destino
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ciudad de destino"
                  value={calculation.destination}
                  onChange={(e) => handleCalculationChange('destination', e.target.value)}
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de Servicio
            </label>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={calculation.service}
              onChange={(e) => handleCalculationChange('service', e.target.value)}
            >
              <option value="express">Express</option>
              <option value="standard">Standard</option>
              <option value="economy">Economy</option>
            </select>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Peso (kg)
              </label>
              <input
                type="number"
                min="0"
                step="0.1"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0.0"
                value={calculation.weight || ''}
                onChange={(e) => handleCalculationChange('weight', parseFloat(e.target.value) || 0)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Largo (cm)
              </label>
              <input
                type="number"
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0"
                value={calculation.length || ''}
                onChange={(e) => handleCalculationChange('length', parseFloat(e.target.value) || 0)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ancho (cm)
              </label>
              <input
                type="number"
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0"
                value={calculation.width || ''}
                onChange={(e) => handleCalculationChange('width', parseFloat(e.target.value) || 0)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Alto (cm)
              </label>
              <input
                type="number"
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0"
                value={calculation.height || ''}
                onChange={(e) => handleCalculationChange('height', parseFloat(e.target.value) || 0)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Valor Declarado (USD)
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="0.00"
              value={calculation.declaredValue || ''}
              onChange={(e) => handleCalculationChange('declaredValue', parseFloat(e.target.value) || 0)}
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Resultado del Cálculo
        </h3>
        
        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                ${calculateRate()}
              </div>
              <div className="text-sm text-gray-600">Costo total estimado</div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">Peso real:</span>
              <span className="text-sm font-medium">{calculation.weight} kg</span>
            </div>
            
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">Peso volumétrico:</span>
              <span className="text-sm font-medium">
                {calculation.length && calculation.width && calculation.height
                  ? ((calculation.length * calculation.width * calculation.height) / 5000).toFixed(2)
                  : '0.00'} kg
              </span>
            </div>
            
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">Peso facturable:</span>
              <span className="text-sm font-medium">
                {Math.max(
                  calculation.weight,
                  calculation.length && calculation.width && calculation.height
                    ? (calculation.length * calculation.width * calculation.height) / 5000
                    : 0
                ).toFixed(2)} kg
              </span>
            </div>
            
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-gray-600">Servicio:</span>
              <span className="text-sm font-medium capitalize">{calculation.service}</span>
            </div>
          </div>

          <div className="mt-6">
            <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
              Crear Envío con esta Tarifa
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderServices = (): React.ReactNode => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Servicios Adicionales
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { name: 'Pickup', description: 'Recolección en domicilio', price: 5.00 },
          { name: 'Seguro', description: 'Seguro contra pérdidas', price: 0.50 },
          { name: 'Entrega en día específico', description: 'Programar día de entrega', price: 3.00 },
          { name: 'Firma requerida', description: 'Confirmación de entrega', price: 2.00 },
          { name: 'Empaque especial', description: 'Empaque para frágiles', price: 4.00 },
          { name: 'Notificación SMS', description: 'Actualizaciones por SMS', price: 1.00 }
        ].map((service, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-medium text-gray-900">{service.name}</h4>
              <span className="text-sm font-semibold text-blue-600">+${service.price}</span>
            </div>
            <p className="text-sm text-gray-600 mb-3">{service.description}</p>
            <button className="w-full text-sm bg-gray-100 text-gray-700 py-1 px-3 rounded hover:bg-gray-200 transition-colors">
              Configurar
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'rates', label: 'Tarifas', icon: Scale },
              { id: 'calculator', label: 'Calculadora', icon: Calculator },
              { id: 'services', label: 'Servicios', icon: Package }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as any)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                  activeTab === id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {activeTab === 'rates' && renderRatesTable()}
      {activeTab === 'calculator' && renderCalculator()}
      {activeTab === 'services' && renderServices()}
    </div>
  );
};

export default RatesModule;