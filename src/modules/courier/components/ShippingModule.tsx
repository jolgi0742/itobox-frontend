import React, { useState } from 'react';
import { 
  Package, 
  User, 
  MapPin, 
  Scale, 
  Ruler, 
  DollarSign, 
  Truck, 
  Clock, 
  QrCode,
  FileText,
  Send,
  Plus,
  Search,
  Edit,
  Trash2,
  Eye
} from 'lucide-react';

interface ShippingFormData {
  // Información del Remitente
  senderName: string;
  senderEmail: string;
  senderPhone: string;
  senderAddress: string;
  senderCity: string;
  
  // Información del Destinatario
  recipientName: string;
  recipientEmail: string;
  recipientPhone: string;
  recipientAddress: string;
  recipientCity: string;
  
  // Información del Paquete
  packageType: string;
  weight: number;
  length: number;
  width: number;
  height: number;
  declaredValue: number;
  contents: string;
  
  // Servicio
  serviceType: 'express' | 'standard' | 'economy';
  deliveryDate: string;
  deliveryTime: string;
  specialInstructions: string;
  
  // Opciones
  insurance: boolean;
  signatureRequired: boolean;
  cashOnDelivery: boolean;
  codAmount: number;
}

interface Package {
  id: string;
  trackingNumber: string;
  senderName: string;
  recipientName: string;
  recipientCity: string;
  weight: number;
  serviceType: string;
  status: 'pending' | 'picked_up' | 'in_transit' | 'delivered';
  createdAt: string;
  estimatedDelivery: string;
  cost: number;
}

const ShippingModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'create' | 'list' | 'tracking'>('create');
  const [formData, setFormData] = useState<ShippingFormData>({
    senderName: '',
    senderEmail: '',
    senderPhone: '',
    senderAddress: '',
    senderCity: '',
    recipientName: '',
    recipientEmail: '',
    recipientPhone: '',
    recipientAddress: '',
    recipientCity: '',
    packageType: 'package',
    weight: 0,
    length: 0,
    width: 0,
    height: 0,
    declaredValue: 0,
    contents: '',
    serviceType: 'standard',
    deliveryDate: '',
    deliveryTime: '',
    specialInstructions: '',
    insurance: false,
    signatureRequired: false,
    cashOnDelivery: false,
    codAmount: 0
  });

  const [packages, setPackages] = useState<Package[]>([
    {
      id: '1',
      trackingNumber: 'ITB001234567',
      senderName: 'Juan Pérez',
      recipientName: 'María González',
      recipientCity: 'San José',
      weight: 2.5,
      serviceType: 'Express',
      status: 'in_transit',
      createdAt: '2024-06-15',
      estimatedDelivery: '2024-06-16',
      cost: 15500
    },
    {
      id: '2',
      trackingNumber: 'ITB001234568',
      senderName: 'Carlos Mora',
      recipientName: 'Ana Jiménez',
      recipientCity: 'Cartago',
      weight: 1.2,
      serviceType: 'Standard',
      status: 'pending',
      createdAt: '2024-06-15',
      estimatedDelivery: '2024-06-17',
      cost: 8500
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' 
        ? (e.target as HTMLInputElement).checked 
        : type === 'number' 
          ? parseFloat(value) || 0 
          : value
    }));
  };

  const calculateVolume = () => {
    const { length, width, height } = formData;
    return length * width * height;
  };

  const calculateVolumetricWeight = () => {
    const volume = calculateVolume();
    return volume / 5000; // Factor estándar para peso volumétrico
  };

  const calculateShippingCost = () => {
    const actualWeight = formData.weight;
    const volumetricWeight = calculateVolumetricWeight();
    const chargeableWeight = Math.max(actualWeight, volumetricWeight);
    
    const baseRates = {
      express: 12000,
      standard: 8000,
      economy: 5000
    };
    
    let cost = baseRates[formData.serviceType];
    cost += chargeableWeight * 1500; // ₡1500 por kg
    
    if (formData.insurance) cost += formData.declaredValue * 0.01;
    if (formData.signatureRequired) cost += 2000;
    if (formData.cashOnDelivery) cost += 3000;
    
    return Math.round(cost);
  };

  const generateTrackingNumber = () => {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    
    return `ITB${year}${month}${day}${random}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const trackingNumber = generateTrackingNumber();
      const cost = calculateShippingCost();
      
      const newPackage: Package = {
        id: Date.now().toString(),
        trackingNumber,
        senderName: formData.senderName,
        recipientName: formData.recipientName,
        recipientCity: formData.recipientCity,
        weight: formData.weight,
        serviceType: formData.serviceType.charAt(0).toUpperCase() + formData.serviceType.slice(1),
        status: 'pending',
        createdAt: new Date().toISOString().split('T')[0],
        estimatedDelivery: formData.deliveryDate,
        cost
      };

      setPackages(prev => [newPackage, ...prev]);
      
      // Limpiar formulario
      setFormData({
        senderName: '', senderEmail: '', senderPhone: '', senderAddress: '', senderCity: '',
        recipientName: '', recipientEmail: '', recipientPhone: '', recipientAddress: '', recipientCity: '',
        packageType: 'package', weight: 0, length: 0, width: 0, height: 0, declaredValue: 0, contents: '',
        serviceType: 'standard', deliveryDate: '', deliveryTime: '', specialInstructions: '',
        insurance: false, signatureRequired: false, cashOnDelivery: false, codAmount: 0
      });

      alert(`¡Guía creada exitosamente!\nNúmero de tracking: ${trackingNumber}\nCosto: ₡${cost.toLocaleString()}`);
      setActiveTab('list');

    } catch (error) {
      console.error('Error:', error);
      alert('Error al crear la guía');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'picked_up': return 'bg-blue-100 text-blue-800';
      case 'in_transit': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Pendiente';
      case 'picked_up': return 'Recolectado';
      case 'in_transit': return 'En Tránsito';
      case 'delivered': return 'Entregado';
      default: return status;
    }
  };

  const filteredPackages = packages.filter(pkg =>
    pkg.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pkg.senderName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pkg.recipientName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderCreateForm = () => (
    <div className="space-y-8">
      {/* Información del Remitente */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
          <User className="w-5 h-5" />
          Información del Remitente
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre Completo *
            </label>
            <input
              type="text"
              name="senderName"
              value={formData.senderName}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Nombre del remitente"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Teléfono *
            </label>
            <input
              type="tel"
              name="senderPhone"
              value={formData.senderPhone}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="+506 1234-5678"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              name="senderEmail"
              value={formData.senderEmail}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="correo@ejemplo.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ciudad *
            </label>
            <input
              type="text"
              name="senderCity"
              value={formData.senderCity}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Ciudad del remitente"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Dirección Completa *
            </label>
            <textarea
              name="senderAddress"
              value={formData.senderAddress}
              onChange={handleInputChange}
              required
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
              placeholder="Dirección completa del remitente"
            />
          </div>
        </div>
      </div>

      {/* Información del Destinatario */}
      <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-2xl p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          Información del Destinatario
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre Completo *
            </label>
            <input
              type="text"
              name="recipientName"
              value={formData.recipientName}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              placeholder="Nombre del destinatario"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Teléfono *
            </label>
            <input
              type="tel"
              name="recipientPhone"
              value={formData.recipientPhone}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              placeholder="+506 9876-5432"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              name="recipientEmail"
              value={formData.recipientEmail}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              placeholder="destinatario@ejemplo.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ciudad *
            </label>
            <input
              type="text"
              name="recipientCity"
              value={formData.recipientCity}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              placeholder="Ciudad del destinatario"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Dirección Completa *
            </label>
            <textarea
              name="recipientAddress"
              value={formData.recipientAddress}
              onChange={handleInputChange}
              required
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all resize-none"
              placeholder="Dirección completa del destinatario"
            />
          </div>
        </div>
      </div>

      {/* Información del Paquete */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
          <Package className="w-5 h-5" />
          Información del Paquete
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Paquete
            </label>
            <select
              name="packageType"
              value={formData.packageType}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all appearance-none bg-white"
            >
              <option value="package">Paquete</option>
              <option value="document">Documento</option>
              <option value="fragile">Frágil</option>
              <option value="liquid">Líquido</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
              <Scale className="w-4 h-4" />
              Peso (kg) *
            </label>
            <input
              type="number"
              name="weight"
              value={formData.weight}
              onChange={handleInputChange}
              step="0.1"
              min="0"
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              placeholder="0.0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
              <Ruler className="w-4 h-4" />
              Largo (cm)
            </label>
            <input
              type="number"
              name="length"
              value={formData.length}
              onChange={handleInputChange}
              min="0"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              placeholder="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ancho (cm)
            </label>
            <input
              type="number"
              name="width"
              value={formData.width}
              onChange={handleInputChange}
              min="0"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              placeholder="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Alto (cm)
            </label>
            <input
              type="number"
              name="height"
              value={formData.height}
              onChange={handleInputChange}
              min="0"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              placeholder="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
              <DollarSign className="w-4 h-4" />
              Valor Declarado (₡)
            </label>
            <input
              type="number"
              name="declaredValue"
              value={formData.declaredValue}
              onChange={handleInputChange}
              min="0"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              placeholder="0"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contenido del Paquete *
            </label>
            <input
              type="text"
              name="contents"
              value={formData.contents}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              placeholder="Descripción del contenido"
            />
          </div>
        </div>

        {/* Cálculos */}
        {(formData.length > 0 && formData.width > 0 && formData.height > 0) && (
          <div className="mt-6 p-4 bg-white/50 rounded-xl">
            <h4 className="font-medium text-gray-700 mb-2">Cálculos Automáticos:</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Volumen:</span>
                <p className="font-medium">{calculateVolume().toLocaleString()} cm³</p>
              </div>
              <div>
                <span className="text-gray-600">Peso Volumétrico:</span>
                <p className="font-medium">{calculateVolumetricWeight().toFixed(2)} kg</p>
              </div>
              <div>
                <span className="text-gray-600">Peso a Cobrar:</span>
                <p className="font-medium">{Math.max(formData.weight, calculateVolumetricWeight()).toFixed(2)} kg</p>
              </div>
              <div>
                <span className="text-gray-600">Costo Estimado:</span>
                <p className="font-medium text-green-600">₡{calculateShippingCost().toLocaleString()}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Servicio y Opciones */}
      <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-2xl p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
          <Truck className="w-5 h-5" />
          Servicio y Opciones
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Servicio
            </label>
            <select
              name="serviceType"
              value={formData.serviceType}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all appearance-none bg-white"
            >
              <option value="economy">Económico (3-5 días)</option>
              <option value="standard">Estándar (1-2 días)</option>
              <option value="express">Express (24 horas)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
              <Clock className="w-4 h-4" />
              Fecha de Entrega
            </label>
            <input
              type="date"
              name="deliveryDate"
              value={formData.deliveryDate}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Instrucciones Especiales
            </label>
            <textarea
              name="specialInstructions"
              value={formData.specialInstructions}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all resize-none"
              placeholder="Instrucciones especiales para la entrega"
            />
          </div>
        </div>

        {/* Opciones adicionales */}
        <div className="mt-6 space-y-3">
          <h4 className="font-medium text-gray-700">Opciones Adicionales:</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                name="insurance"
                checked={formData.insurance}
                onChange={handleInputChange}
                className="w-4 h-4 text-orange-600 rounded"
              />
              <span className="text-sm text-gray-700">Seguro (1% del valor declarado)</span>
            </label>
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                name="signatureRequired"
                checked={formData.signatureRequired}
                onChange={handleInputChange}
                className="w-4 h-4 text-orange-600 rounded"
              />
              <span className="text-sm text-gray-700">Firma requerida (+₡2,000)</span>
            </label>
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                name="cashOnDelivery"
                checked={formData.cashOnDelivery}
                onChange={handleInputChange}
                className="w-4 h-4 text-orange-600 rounded"
              />
              <span className="text-sm text-gray-700">Contra entrega (+₡3,000)</span>
            </label>
          </div>
        </div>
      </div>

      {/* Botón de envío */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isLoading}
          className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Creando Guía...
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              Crear Guía de Envío
            </>
          )}
        </button>
      </div>
    </div>
  );

  const renderPackagesList = () => (
    <div className="space-y-6">
      {/* Barra de búsqueda */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por número de tracking, remitente o destinatario..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>
        <button
          onClick={() => setActiveTab('create')}
          className="px-6 py-3 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-xl hover:from-green-600 hover:to-teal-700 transition-all flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Nueva Guía
        </button>
      </div>

      {/* Lista de paquetes */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Tracking</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Remitente</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Destinatario</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Destino</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Peso</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Servicio</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Estado</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Costo</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredPackages.map((pkg) => (
                <tr key={pkg.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <QrCode className="w-4 h-4 text-gray-400" />
                      <span className="font-mono text-sm font-medium text-blue-600">
                        {pkg.trackingNumber}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">{pkg.senderName}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{pkg.recipientName}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{pkg.recipientCity}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{pkg.weight} kg</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{pkg.serviceType}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(pkg.status)}`}>
                      {getStatusText(pkg.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-green-600">
                    ₡{pkg.cost.toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => alert(`Ver detalles de ${pkg.trackingNumber}`)}
                        className="p-1 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Ver detalles"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => alert(`Editar ${pkg.trackingNumber}`)}
                        className="p-1 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                        title="Editar"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(`¿Eliminar ${pkg.trackingNumber}?`)) {
                            setPackages(prev => prev.filter(p => p.id !== pkg.id));
                          }
                        }}
                        className="p-1 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredPackages.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-700 mb-2">
              {searchTerm ? 'No se encontraron resultados' : 'No hay paquetes registrados'}
            </h3>
            <p className="text-gray-500 mb-6">
              {searchTerm 
                ? 'Intenta con otros términos de búsqueda' 
                : 'Crea tu primera guía de envío para comenzar'
              }
            </p>
            {!searchTerm && (
              <button
                onClick={() => setActiveTab('create')}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all flex items-center gap-2 mx-auto"
              >
                <Plus className="w-5 h-5" />
                Crear Primera Guía
              </button>
            )}
          </div>
        )}
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Total Paquetes</p>
              <p className="text-3xl font-bold">{packages.length}</p>
            </div>
            <Package className="w-8 h-8 text-blue-200" />
          </div>
        </div>
        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100 text-sm">Pendientes</p>
              <p className="text-3xl font-bold">
                {packages.filter(p => p.status === 'pending').length}
              </p>
            </div>
            <Clock className="w-8 h-8 text-yellow-200" />
          </div>
        </div>
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">En Tránsito</p>
              <p className="text-3xl font-bold">
                {packages.filter(p => p.status === 'in_transit').length}
              </p>
            </div>
            <Truck className="w-8 h-8 text-purple-200" />
          </div>
        </div>
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Entregados</p>
              <p className="text-3xl font-bold">
                {packages.filter(p => p.status === 'delivered').length}
              </p>
            </div>
            <Package className="w-8 h-8 text-green-200" />
          </div>
        </div>
      </div>
    </div>
  );

  const renderTracking = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="text-center">
          <QrCode className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Seguimiento de Paquetes</h3>
          <p className="text-gray-600 mb-8">
            Ingresa el número de tracking para seguir tu paquete en tiempo real
          </p>
          
          <div className="max-w-md mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Número de tracking (ej: ITB001234567)"
                className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-center font-mono"
              />
            </div>
            <button className="w-full mt-4 px-6 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all font-medium">
              Buscar Paquete
            </button>
          </div>
        </div>
      </div>

      {/* Ejemplo de tracking */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h4 className="text-lg font-semibold text-gray-800 mb-4">Paquetes Recientes</h4>
        <div className="space-y-3">
          {packages.slice(0, 3).map((pkg) => (
            <div key={pkg.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3">
                <QrCode className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="font-mono text-sm font-medium text-blue-600">{pkg.trackingNumber}</p>
                  <p className="text-sm text-gray-600">{pkg.recipientName} - {pkg.recipientCity}</p>
                </div>
              </div>
              <div className="text-right">
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(pkg.status)}`}>
                  {getStatusText(pkg.status)}
                </span>
                <p className="text-sm text-gray-500 mt-1">{pkg.createdAt}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Módulo de Envíos</h1>
          <p className="text-gray-600">Gestiona guías, paquetes y seguimiento</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-lg border border-white/20 p-2">
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab('create')}
            className={`flex-1 py-3 px-6 rounded-xl font-medium transition-all ${
              activeTab === 'create'
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Plus className="w-5 h-5" />
              Crear Guía
            </div>
          </button>
          <button
            onClick={() => setActiveTab('list')}
            className={`flex-1 py-3 px-6 rounded-xl font-medium transition-all ${
              activeTab === 'list'
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <FileText className="w-5 h-5" />
              Lista de Paquetes
              {packages.length > 0 && (
                <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {packages.length}
                </span>
              )}
            </div>
          </button>
          <button
            onClick={() => setActiveTab('tracking')}
            className={`flex-1 py-3 px-6 rounded-xl font-medium transition-all ${
              activeTab === 'tracking'
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Search className="w-5 h-5" />
              Tracking
            </div>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-lg border border-white/20 p-8">
        <form onSubmit={handleSubmit}>
          {activeTab === 'create' && renderCreateForm()}
        </form>
        {activeTab === 'list' && renderPackagesList()}
        {activeTab === 'tracking' && renderTracking()}
      </div>
    </div>
  );
};

export default ShippingModule;