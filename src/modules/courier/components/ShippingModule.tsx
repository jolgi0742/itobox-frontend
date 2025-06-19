// src/modules/courier/components/ShippingModule.tsx
import React, { useState, useEffect } from 'react';
import { 
  Package, 
  Plus, 
  Trash2, 
  Calculator, 
  Printer, 
  Save, 
  Scale,  // ✅ Cambiado de Weight
  Ruler, 
  MapPin, 
  User, 
  Phone, 
  Mail, 
  Building,
  Plane,
  Ship,
  Truck
} from 'lucide-react';

interface ShippingData {
  trackingNumber: string;
  destination: string;
  serviceType: string;
  priority: string;
  instructions: string;
  shipper: {
    name: string;
    company: string;
    address: string;
    phone: string;
    email: string;
  };
  consignee: {
    name: string;
    company: string;
    address: string;
    phone: string;
    email: string;
  };
}

interface PackageItem {
  id: string;
  description: string;
  weight: string;
  length: string;
  width: string;
  height: string;
  volume: string;
  declaredValue: string;
  quantity: string;
}

interface CalculatedRate {
  weight: number;
  rate: number;
  subtotal: number;
  insurance: number;
  handling: number;
  total: number;
}

const ShippingModule: React.FC = () => {
  const [shippingData, setShippingData] = useState<ShippingData>({
    trackingNumber: '',
    destination: 'Venezuela',
    serviceType: 'air',
    priority: 'normal',
    instructions: '',
    shipper: {
      name: '',
      company: '',
      address: '',
      phone: '',
      email: ''
    },
    consignee: {
      name: '',
      company: '',
      address: '',
      phone: '',
      email: ''
    }
  });

  const [packages, setPackages] = useState<PackageItem[]>([
    {
      id: '1',
      description: '',
      weight: '',
      length: '',
      width: '',
      height: '',
      volume: '0.00',
      declaredValue: '',
      quantity: '1'
    }
  ]);

  const [calculatedRate, setCalculatedRate] = useState<CalculatedRate | null>(null);

  // Tarifas por país y tipo de servicio
  const rates = {
    Venezuela: { air: 4.50, maritime: 2.20 },
    Colombia: { air: 3.80, maritime: 1.90 },
    USA: { air: 5.20, maritime: 2.50 }
  };

  const calculateRate = () => {
    const totalWeight = packages.reduce((sum, pkg) => sum + (parseFloat(pkg.weight) || 0), 0);
    const rate = rates[shippingData.destination as keyof typeof rates]?.[shippingData.serviceType as 'air' | 'maritime'] || 2.0;
    const subtotal = totalWeight * rate;
    const insurance = subtotal * 0.01;
    const handling = 50;
    const total = subtotal + insurance + handling;
    
    setCalculatedRate({
      weight: totalWeight,
      rate: rate,
      subtotal: subtotal,
      insurance: insurance,
      handling: handling,
      total: total
    });
  };

  // Agregar paquete
  const addPackage = () => {
    const newPackage: PackageItem = {
      id: Date.now().toString(),
      description: '',
      weight: '',
      length: '',
      width: '',
      height: '',
      volume: '0.00',
      declaredValue: '',
      quantity: '1'
    };
    setPackages([...packages, newPackage]);
  };

  // Eliminar paquete
  const removePackage = (id: string) => {
    setPackages(packages.filter(pkg => pkg.id !== id));
  };

  // Actualizar paquete - ✅ Corregido con tipos
  const updatePackage = (id: string, field: string, value: string) => {
    setPackages(packages.map(pkg => {
      if (pkg.id === id) {
        const updated = { ...pkg, [field]: value };
        // Calcular volumen automáticamente
        if (['length', 'width', 'height'].includes(field)) {
          const l = parseFloat(updated.length) || 0;
          const w = parseFloat(updated.width) || 0;
          const h = parseFloat(updated.height) || 0;
          updated.volume = (l * w * h / 1728).toFixed(2); // en pies cúbicos
        }
        return updated;
      }
      return pkg;
    }));
  };

  // Generar número de tracking
  const generateTrackingNumber = () => {
    const prefix = 'ITC';
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    setShippingData({
      ...shippingData,
      trackingNumber: `${prefix}${timestamp}${random}`
    });
  };

  useEffect(() => {
    if (packages.length > 0 && packages[0].weight) {
      calculateRate();
    }
  }, [packages, shippingData.destination, shippingData.serviceType]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Package className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Crear Guía de Envío</h2>
              <p className="text-sm text-gray-500">Sistema de envíos internacionales</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={generateTrackingNumber}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Generar Tracking
            </button>
          </div>
        </div>

        {/* Tracking Number */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Número de Tracking
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
              value={shippingData.trackingNumber}
              readOnly
              placeholder="Generar automáticamente"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              País de Destino
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={shippingData.destination}
              onChange={(e) => setShippingData({...shippingData, destination: e.target.value})}
            >
              <option value="Venezuela">Venezuela</option>
              <option value="Colombia">Colombia</option>
              <option value="USA">Estados Unidos</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Servicio
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={shippingData.serviceType}
              onChange={(e) => setShippingData({...shippingData, serviceType: e.target.value})}
            >
              <option value="air">Aéreo</option>
              <option value="maritime">Marítimo</option>
            </select>
          </div>
        </div>
      </div>

      {/* Información del Envío */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Información del Envío</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Prioridad
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={shippingData.priority}
              onChange={(e) => setShippingData({...shippingData, priority: e.target.value})}
            >
              <option value="normal">Normal</option>
              <option value="high">Alta</option>
              <option value="urgent">Urgente</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Instrucciones Especiales
          </label>
          <textarea 
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3} // ✅ Corregido: rows={3} en lugar de rows="3"
            value={shippingData.instructions}
            onChange={(e) => setShippingData({...shippingData, instructions: e.target.value})}
            placeholder="Instrucciones especiales para el envío..."
          />
        </div>
      </div>

      {/* Información del Remitente */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
          <User className="h-5 w-5 mr-2 text-blue-600" />
          Información del Remitente (Shipper)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre Completo
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={shippingData.shipper.name}
              onChange={(e) => setShippingData({
                ...shippingData, 
                shipper: { ...shippingData.shipper, name: e.target.value }
              })}
              placeholder="Nombre del remitente"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Empresa
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={shippingData.shipper.company}
              onChange={(e) => setShippingData({
                ...shippingData, 
                shipper: { ...shippingData.shipper, company: e.target.value }
              })}
              placeholder="Nombre de la empresa"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Dirección Completa
            </label>
            <textarea 
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={2} // ✅ Corregido: rows={2} en lugar de rows="2"
              value={shippingData.shipper.address}
              onChange={(e) => setShippingData({
                ...shippingData, 
                shipper: { ...shippingData.shipper, address: e.target.value }
              })}
              placeholder="Dirección completa del remitente"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Teléfono
            </label>
            <input
              type="tel"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={shippingData.shipper.phone}
              onChange={(e) => setShippingData({
                ...shippingData, 
                shipper: { ...shippingData.shipper, phone: e.target.value }
              })}
              placeholder="Teléfono de contacto"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={shippingData.shipper.email}
              onChange={(e) => setShippingData({
                ...shippingData, 
                shipper: { ...shippingData.shipper, email: e.target.value }
              })}
              placeholder="Email del remitente"
            />
          </div>
        </div>
      </div>

      {/* Información del Destinatario */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
          <MapPin className="h-5 w-5 mr-2 text-green-600" />
          Información del Destinatario (Consignee)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre Completo
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={shippingData.consignee.name}
              onChange={(e) => setShippingData({
                ...shippingData, 
                consignee: { ...shippingData.consignee, name: e.target.value }
              })}
              placeholder="Nombre del destinatario"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Empresa
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={shippingData.consignee.company}
              onChange={(e) => setShippingData({
                ...shippingData, 
                consignee: { ...shippingData.consignee, company: e.target.value }
              })}
              placeholder="Nombre de la empresa"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Dirección Completa
            </label>
            <textarea 
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={2} // ✅ Corregido
              value={shippingData.consignee.address}
              onChange={(e) => setShippingData({
                ...shippingData, 
                consignee: { ...shippingData.consignee, address: e.target.value }
              })}
              placeholder="Dirección completa del destinatario"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Teléfono
            </label>
            <input
              type="tel"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={shippingData.consignee.phone}
              onChange={(e) => setShippingData({
                ...shippingData, 
                consignee: { ...shippingData.consignee, phone: e.target.value }
              })}
              placeholder="Teléfono de contacto"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={shippingData.consignee.email}
              onChange={(e) => setShippingData({
                ...shippingData, 
                consignee: { ...shippingData.consignee, email: e.target.value }
              })}
              placeholder="Email del destinatario"
            />
          </div>
        </div>
      </div>

      {/* Información de Paquetes */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            <Package className="h-5 w-5 mr-2 text-purple-600" />
            Información de Paquetes
          </h3>
          <button
            onClick={addPackage}
            className="flex items-center px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            <Plus className="h-4 w-4 mr-1" />
            Agregar Paquete
          </button>
        </div>

        <div className="space-y-4">
          {packages.map((pkg, index) => (
            <div key={pkg.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-900">Paquete {index + 1}</h4>
                {packages.length > 1 && (
                  <button
                    onClick={() => removePackage(pkg.id)}
                    className="p-1 text-red-600 hover:bg-red-50 rounded"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descripción del Contenido
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={pkg.description}
                    onChange={(e) => updatePackage(pkg.id, 'description', e.target.value)}
                    placeholder="Descripción detallada del contenido"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cantidad
                  </label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={pkg.quantity}
                    onChange={(e) => updatePackage(pkg.id, 'quantity', e.target.value)}
                    min="1"
                    placeholder="1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <Scale className="h-4 w-4 mr-1" />
                    Peso (Lb)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={pkg.weight}
                    onChange={(e) => updatePackage(pkg.id, 'weight', e.target.value)}
                    placeholder="0.0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <Ruler className="h-4 w-4 mr-1" />
                    Largo (in)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={pkg.length}
                    onChange={(e) => updatePackage(pkg.id, 'length', e.target.value)}
                    placeholder="0.0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ancho (in)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={pkg.width}
                    onChange={(e) => updatePackage(pkg.id, 'width', e.target.value)}
                    placeholder="0.0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Alto (in)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={pkg.height}
                    onChange={(e) => updatePackage(pkg.id, 'height', e.target.value)}
                    placeholder="0.0"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Volumen (CF) - Calculado
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                    value={pkg.volume}
                    readOnly
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Valor Declarado ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={pkg.declaredValue}
                    onChange={(e) => updatePackage(pkg.id, 'declaredValue', e.target.value)}
                    placeholder="0.00"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cálculo de Tarifas */}
      {calculatedRate && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <Calculator className="h-5 w-5 mr-2 text-green-600" />
            Cálculo de Tarifas
          </h3>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4 text-center">
              <div className="bg-white rounded-lg p-3 shadow-sm">
                <div className="text-2xl font-bold text-blue-600">{calculatedRate.weight} Lb</div>
                <div className="text-sm text-gray-500">Peso Total</div>
              </div>
              <div className="bg-white rounded-lg p-3 shadow-sm">
                <div className="text-2xl font-bold text-blue-600">${calculatedRate.rate}</div>
                <div className="text-sm text-gray-500">Tarifa/Lb</div>
              </div>
              <div className="bg-white rounded-lg p-3 shadow-sm">
                <div className="text-2xl font-bold text-blue-600">${calculatedRate.subtotal.toFixed(2)}</div>
                <div className="text-sm text-gray-500">Subtotal</div>
              </div>
              <div className="bg-white rounded-lg p-3 shadow-sm">
                <div className="text-2xl font-bold text-blue-600">${calculatedRate.insurance.toFixed(2)}</div>
                <div className="text-sm text-gray-500">Seguro (1%)</div>
              </div>
              <div className="bg-white rounded-lg p-3 shadow-sm">
                <div className="text-2xl font-bold text-blue-600">${calculatedRate.handling}</div>
                <div className="text-sm text-gray-500">Manejo</div>
              </div>
              <div className="bg-green-100 rounded-lg p-3 shadow-sm border-2 border-green-200">
                <div className="text-3xl font-bold text-green-600">
                  ${calculatedRate.total.toFixed(2)}
                </div>
                <div className="text-sm text-green-700 font-medium">Total</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Botones de Acción */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row gap-3 justify-end">
          <button className="flex items-center justify-center px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors">
            <Printer className="h-4 w-4 mr-2" />
            Vista Previa
          </button>
          <button className="flex items-center justify-center px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
            <Save className="h-4 w-4 mr-2" />
            Crear Guía
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShippingModule;