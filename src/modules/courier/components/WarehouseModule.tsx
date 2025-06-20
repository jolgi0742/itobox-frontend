import React, { useState, useEffect } from 'react';
import { 
  Package, Scale, QrCode, MapPin, User, Building, Search, Plus, Edit, Trash2, Eye,
  FileText, Mail, CheckCircle, Clock, AlertCircle, Download, Filter, BarChart3,
  Truck, Send, X, Calendar, Hash
} from 'lucide-react';

interface WHRPackage {
  id: string;
  whrNumber: string;
  trackingNumber: string;
  shipper: string;
  consignee: string;
  pieces: number;
  weight: number;
  volume: number;
  description: string;
  classification: 'aero' | 'maritime' | 'pending';
  status: 'received' | 'processed' | 'dispatched' | 'delivered';
  receivedDate: string;
  estimatedDelivery: string;
  location: string;
  notes: string;
  urgency: 'normal' | 'urgent' | 'critical';
  fragile: boolean;
  hazardous: boolean;
  requiresRepackaging: boolean;
  value: number;
  emailSent: boolean;
}

const WarehouseModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'create' | 'list' | 'locations' | 'reports'>('create');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedClassification, setSelectedClassification] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);

  const [formData, setFormData] = useState({
    trackingNumber: '',
    shipper: '',
    consignee: '',
    pieces: 1,
    weight: 0,
    length: 0,
    width: 0,
    height: 0,
    description: '',
    location: '',
    notes: '',
    value: 0,
    urgency: 'normal' as 'normal' | 'urgent' | 'critical',
    requiresRepackaging: false,
    fragile: false,
    hazardous: false
  });

  const [packages, setPackages] = useState<WHRPackage[]>([
    {
      id: '1',
      whrNumber: 'WHR241216001',
      trackingNumber: 'ITB001234567',
      shipper: 'ACME Corporation',
      consignee: 'María González Rodríguez',
      pieces: 2,
      weight: 5.5,
      volume: 0.0125,
      description: 'Electronics - Laptop Dell XPS 13 and accessories',
      classification: 'aero',
      status: 'received',
      receivedDate: '2024-12-16',
      estimatedDelivery: '2024-12-18',
      location: 'A-01-03',
      notes: 'Handle with extreme care - fragile items',
      urgency: 'urgent',
      fragile: true,
      hazardous: false,
      requiresRepackaging: false,
      value: 25000,
      emailSent: true
    },
    {
      id: '2',
      whrNumber: 'WHR241216002',
      trackingNumber: 'ITB001234568',
      shipper: 'Tech Solutions Ltd',
      consignee: 'Carlos Mora Jiménez',
      pieces: 1,
      weight: 2.3,
      volume: 0.008,
      description: 'Legal documents and product samples',
      classification: 'pending',
      status: 'processed',
      receivedDate: '2024-12-16',
      estimatedDelivery: '2024-12-17',
      location: 'B-02-01',
      notes: 'Urgent delivery required for court hearing',
      urgency: 'critical',
      fragile: false,
      hazardous: false,
      requiresRepackaging: true,
      value: 5000,
      emailSent: false
    }
  ]);

  const stats = {
    totalPackages: packages.length,
    pendingClassification: packages.filter(p => p.classification === 'pending').length,
    aeroPackages: packages.filter(p => p.classification === 'aero').length,
    maritimePackages: packages.filter(p => p.classification === 'maritime').length,
    totalWeight: packages.reduce((sum, p) => sum + p.weight, 0),
    totalVolume: packages.reduce((sum, p) => sum + p.volume, 0),
    urgentPackages: packages.filter(p => p.urgency === 'urgent' || p.urgency === 'critical').length,
    deliveredToday: packages.filter(p => p.status === 'delivered').length
  };

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
    return (length * width * height) / 1000000;
  };

  const calculateVolumetricWeight = () => {
    const volume = calculateVolume();
    return volume * 167;
  };

  const generateWHRNumber = () => {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const sequence = (packages.length + 1).toString().padStart(3, '0');
    return `WHR${year}${month}${day}${sequence}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const whrNumber = generateWHRNumber();
      const volume = calculateVolume();
      
      const newPackage: WHRPackage = {
        id: Date.now().toString(),
        whrNumber,
        trackingNumber: formData.trackingNumber,
        shipper: formData.shipper,
        consignee: formData.consignee,
        pieces: formData.pieces,
        weight: formData.weight,
        volume,
        description: formData.description,
        classification: 'pending',
        status: 'received',
        receivedDate: new Date().toISOString().split('T')[0],
        estimatedDelivery: new Date(Date.now() + 86400000).toISOString().split('T')[0],
        location: formData.location,
        notes: formData.notes,
        urgency: formData.urgency,
        fragile: formData.fragile,
        hazardous: formData.hazardous,
        requiresRepackaging: formData.requiresRepackaging,
        value: formData.value,
        emailSent: false
      };

      setPackages(prev => [newPackage, ...prev]);
      
      setFormData({
        trackingNumber: '', shipper: '', consignee: '', pieces: 1, weight: 0,
        length: 0, width: 0, height: 0, description: '', location: '', notes: '',
        value: 0, urgency: 'normal', requiresRepackaging: false, fragile: false, hazardous: false
      });

      alert(`¡WHR creado exitosamente!\nNúmero: ${whrNumber}`);
      setActiveTab('list');

    } catch (error) {
      console.error('Error:', error);
      alert('Error al crear WHR. Inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const updateClassification = (id: string, classification: 'aero' | 'maritime') => {
    setPackages(prev => prev.map(pkg => 
      pkg.id === id ? { ...pkg, classification } : pkg
    ));
    const pkg = packages.find(p => p.id === id);
    if (pkg) {
      alert(`Paquete ${pkg.whrNumber} clasificado como ${classification === 'aero' ? 'Aéreo' : 'Marítimo'}`);
    }
  };

  const updateStatus = (id: string, status: WHRPackage['status']) => {
    setPackages(prev => prev.map(pkg => 
      pkg.id === id ? { ...pkg, status } : pkg
    ));
  };

  const sendEmail = async (pkg: WHRPackage) => {
    try {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1500));
      setPackages(prev => prev.map(p => 
        p.id === pkg.id ? { ...p, emailSent: true } : p
      ));
      alert(`✅ Email enviado exitosamente a ${pkg.consignee}\nWHR: ${pkg.whrNumber}`);
    } catch (error) {
      alert('❌ Error al enviar email. Inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const deletePackage = (id: string) => {
    const pkg = packages.find(p => p.id === id);
    if (pkg && window.confirm(`¿Estás seguro de eliminar el WHR ${pkg.whrNumber}?`)) {
      setPackages(prev => prev.filter(p => p.id !== id));
      alert(`WHR ${pkg.whrNumber} eliminado exitosamente`);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'received': return 'bg-blue-100 text-blue-800';
      case 'processed': return 'bg-yellow-100 text-yellow-800';
      case 'dispatched': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'received': return 'Recibido';
      case 'processed': return 'Procesado';
      case 'dispatched': return 'Despachado';
      case 'delivered': return 'Entregado';
      default: return status;
    }
  };

  const getClassificationColor = (classification: string) => {
    switch (classification) {
      case 'aero': return 'bg-sky-100 text-sky-800';
      case 'maritime': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getClassificationText = (classification: string) => {
    switch (classification) {
      case 'aero': return 'Aéreo';
      case 'maritime': return 'Marítimo';
      case 'pending': return 'Pendiente';
      default: return classification;
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'urgent': return 'bg-yellow-100 text-yellow-800';
      case 'normal': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getUrgencyText = (urgency: string) => {
    switch (urgency) {
      case 'critical': return 'Crítico';
      case 'urgent': return 'Urgente';
      case 'normal': return 'Normal';
      default: return urgency;
    }
  };

  const filteredPackages = packages.filter(pkg => {
    const matchesSearch = 
      pkg.whrNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pkg.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pkg.shipper.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pkg.consignee.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = selectedStatus === 'all' || pkg.status === selectedStatus;
    const matchesClassification = selectedClassification === 'all' || pkg.classification === selectedClassification;
    
    return matchesSearch && matchesStatus && matchesClassification;
  });

  const renderCreateForm = () => (
    <div className="space-y-8">
      {/* Información del Paquete */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
          <Package className="w-5 h-5" />
          Información del Paquete
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Número de Tracking *
            </label>
            <div className="relative">
              <QrCode className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                name="trackingNumber"
                value={formData.trackingNumber}
                onChange={handleInputChange}
                required
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-mono"
                placeholder="ITB001234567"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ubicación en Almacén *
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                required
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none bg-white"
              >
                <option value="">Seleccionar ubicación</option>
                <option value="A-01-01">A-01-01 (Pequeños)</option>
                <option value="A-01-02">A-01-02 (Pequeños)</option>
                <option value="A-01-03">A-01-03 (Pequeños)</option>
                <option value="B-02-01">B-02-01 (Medianos)</option>
                <option value="B-02-02">B-02-02 (Medianos)</option>
                <option value="B-02-03">B-02-03 (Medianos)</option>
                <option value="C-03-01">C-03-01 (Grandes)</option>
                <option value="C-03-02">C-03-02 (Grandes)</option>
                <option value="C-03-03">C-03-03 (Grandes)</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Número de Piezas *
            </label>
            <input
              type="number"
              name="pieces"
              value={formData.pieces}
              onChange={handleInputChange}
              min="1"
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
              <Scale className="w-4 h-4" />
              Peso Total (kg) *
            </label>
            <input
              type="number"
              name="weight"
              value={formData.weight}
              onChange={handleInputChange}
              step="0.1"
              min="0"
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="0.0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Valor Declarado (₡) *
            </label>
            <input
              type="number"
              name="value"
              value={formData.value}
              onChange={handleInputChange}
              min="0"
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Urgencia
            </label>
            <select
              name="urgency"
              value={formData.urgency}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none bg-white"
            >
              <option value="normal">Normal (3 días)</option>
              <option value="urgent">Urgente (1 día)</option>
              <option value="critical">Crítico (mismo día)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Dimensiones */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
          <Package className="w-5 h-5" />
          Dimensiones del Paquete
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Largo (cm)</label>
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Ancho (cm)</label>
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Alto (cm)</label>
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
        </div>
        
        {(formData.length > 0 && formData.width > 0 && formData.height > 0) && (
          <div className="mt-6 p-4 bg-white/50 rounded-xl">
            <h4 className="font-medium text-gray-700 mb-2">Cálculos Automáticos:</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Volumen:</span>
                <p className="font-medium">{calculateVolume().toFixed(6)} m³</p>
              </div>
              <div>
                <span className="text-gray-600">Peso Volumétrico:</span>
                <p className="font-medium">{calculateVolumetricWeight().toFixed(2)} kg</p>
              </div>
              <div>
                <span className="text-gray-600">Peso a Cobrar:</span>
                <p className="font-medium text-blue-600">{Math.max(formData.weight, calculateVolumetricWeight()).toFixed(2)} kg</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Shipper y Consignee */}
      <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-2xl p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
          <User className="w-5 h-5" />
          Shipper y Consignee
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Shipper (Remitente) *</label>
            <div className="relative">
              <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                name="shipper"
                value={formData.shipper}
                onChange={handleInputChange}
                required
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                placeholder="Nombre de la empresa remitente"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Consignee (Destinatario) *</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                name="consignee"
                value={formData.consignee}
                onChange={handleInputChange}
                required
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                placeholder="Nombre completo del destinatario"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Descripción */}
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Descripción y Características
        </h3>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Descripción del Contenido *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all resize-none"
              placeholder="Descripción detallada del contenido del paquete"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Notas Especiales</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              rows={2}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all resize-none"
              placeholder="Instrucciones especiales de manejo, observaciones, etc."
            />
          </div>
        </div>

        <div className="mt-6 space-y-3">
          <h4 className="font-medium text-gray-700">Características Especiales:</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <label className="flex items-center space-x-3 cursor-pointer p-3 border rounded-xl hover:bg-yellow-50 transition-colors">
              <input
                type="checkbox"
                name="requiresRepackaging"
                checked={formData.requiresRepackaging}
                onChange={handleInputChange}
                className="w-4 h-4 text-yellow-600 rounded"
              />
              <div>
                <span className="text-sm font-medium text-gray-700">Requiere Reempaque</span>
                <p className="text-xs text-gray-500">Necesita nuevo embalaje</p>
              </div>
            </label>
            <label className="flex items-center space-x-3 cursor-pointer p-3 border rounded-xl hover:bg-yellow-50 transition-colors">
              <input
                type="checkbox"
                name="fragile"
                checked={formData.fragile}
                onChange={handleInputChange}
                className="w-4 h-4 text-yellow-600 rounded"
              />
              <div>
                <span className="text-sm font-medium text-gray-700">Frágil</span>
                <p className="text-xs text-gray-500">Manejar con cuidado</p>
              </div>
            </label>
            <label className="flex items-center space-x-3 cursor-pointer p-3 border rounded-xl hover:bg-yellow-50 transition-colors">
              <input
                type="checkbox"
                name="hazardous"
                checked={formData.hazardous}
                onChange={handleInputChange}
                className="w-4 h-4 text-yellow-600 rounded"
              />
              <div>
                <span className="text-sm font-medium text-gray-700">Peligroso</span>
                <p className="text-xs text-gray-500">Material peligroso</p>
              </div>
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
              Creando WHR...
            </>
          ) : (
            <>
              <Plus className="w-5 h-5" />
              Crear Warehouse Receipt
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
            placeholder="Buscar por WHR, tracking, shipper o consignee..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="px-4 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors flex items-center gap-2"
        >
          <Filter className="w-5 h-5" />
          Filtros
        </button>
        <button
          onClick={() => setActiveTab('create')}
          className="px-6 py-3 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-xl hover:from-green-600 hover:to-teal-700 transition-all flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Nuevo WHR
        </button>
      </div>

      {/* Panel de filtros */}
      {showFilters && (
        <div className="bg-gray-50 rounded-2xl p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Todos los estados</option>
                <option value="received">Recibido</option>
                <option value="processed">Procesado</option>
                <option value="dispatched">Despachado</option>
                <option value="delivered">Entregado</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Clasificación</label>
              <select
                value={selectedClassification}
                onChange={(e) => setSelectedClassification(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Todas las clasificaciones</option>
                <option value="aero">Aéreo</option>
                <option value="maritime">Marítimo</option>
                <option value="pending">Pendiente</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={() => {
                  setSelectedStatus('all');
                  setSelectedClassification('all');
                  setSearchTerm('');
                }}
                className="w-full px-4 py-2 text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
              >
                <X className="w-4 h-4" />
                Limpiar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lista de paquetes */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">WHR</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Tracking</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Shipper</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Consignee</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Peso</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Urgencia</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Clasificación</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Estado</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredPackages.map((pkg) => (
                <tr key={pkg.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Hash className="w-4 h-4 text-gray-400" />
                      <span className="font-mono text-sm font-medium text-blue-600">
                        {pkg.whrNumber}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <QrCode className="w-4 h-4 text-gray-400" />
                      <span className="font-mono text-sm">{pkg.trackingNumber}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 max-w-32 truncate" title={pkg.shipper}>
                    {pkg.shipper}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 max-w-32 truncate" title={pkg.consignee}>
                    {pkg.consignee}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 flex items-center gap-1">
                    <Scale className="w-4 h-4 text-gray-400" />
                    {pkg.weight} kg
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getUrgencyColor(pkg.urgency)}`}>
                      {getUrgencyText(pkg.urgency)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getClassificationColor(pkg.classification)}`}>
                        {getClassificationText(pkg.classification)}
                      </span>
                      {pkg.classification === 'pending' && (
                        <div className="flex gap-1">
                          <button
                            onClick={() => updateClassification(pkg.id, 'aero')}
                            className="px-2 py-1 text-xs bg-sky-500 text-white rounded hover:bg-sky-600 transition-colors"
                            title="Clasificar como Aéreo"
                          >
                            Aéreo
                          </button>
                          <button
                            onClick={() => updateClassification(pkg.id, 'maritime')}
                            className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                            title="Clasificar como Marítimo"
                          >
                            Marítimo
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={pkg.status}
                      onChange={(e) => updateStatus(pkg.id, e.target.value as WHRPackage['status'])}
                      className={`text-xs font-medium rounded-full px-2 py-1 border-0 ${getStatusColor(pkg.status)}`}
                    >
                      <option value="received">Recibido</option>
                      <option value="processed">Procesado</option>
                      <option value="dispatched">Despachado</option>
                      <option value="delivered">Entregado</option>
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => alert(`Ver detalles de ${pkg.whrNumber}`)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Ver detalles"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => sendEmail(pkg)}
                        disabled={pkg.emailSent || isLoading}
                        className={`p-2 rounded-lg transition-colors ${
                          pkg.emailSent 
                            ? 'text-green-600 bg-green-50' 
                            : 'text-gray-600 hover:bg-gray-50'
                        }`}
                        title={pkg.emailSent ? 'Email enviado' : 'Enviar notificación'}
                      >
                        {pkg.emailSent ? <CheckCircle className="w-4 h-4" /> : <Mail className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => alert(`Descargar WHR ${pkg.whrNumber}`)}
                        className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                        title="Descargar WHR"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deletePackage(pkg.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex gap-1 mt-1">
                      {pkg.fragile && (
                        <span className="text-xs bg-yellow-100 text-yellow-800 px-1 rounded" title="Frágil">F</span>
                      )}
                      {pkg.hazardous && (
                        <span className="text-xs bg-red-100 text-red-800 px-1 rounded" title="Peligroso">P</span>
                      )}
                      {pkg.requiresRepackaging && (
                        <span className="text-xs bg-orange-100 text-orange-800 px-1 rounded" title="Requiere reempaque">R</span>
                      )}
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
              {searchTerm || selectedStatus !== 'all' || selectedClassification !== 'all' 
                ? 'No se encontraron resultados' 
                : 'No hay paquetes en almacén'}
            </h3>
            <p className="text-gray-500 mb-6">
              {searchTerm || selectedStatus !== 'all' || selectedClassification !== 'all'
                ? 'Intenta ajustar los filtros de búsqueda' 
                : 'Crea tu primer Warehouse Receipt para comenzar'
              }
            </p>
            {!searchTerm && selectedStatus === 'all' && selectedClassification === 'all' && (
              <button
                onClick={() => setActiveTab('create')}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all flex items-center gap-2 mx-auto"
              >
                <Plus className="w-5 h-5" />
                Crear Primer WHR
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
              <p className="text-3xl font-bold">{stats.totalPackages}</p>
            </div>
            <Package className="w-8 h-8 text-blue-200" />
          </div>
        </div>
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">Pendientes</p>
              <p className="text-3xl font-bold">{stats.pendingClassification}</p>
            </div>
            <AlertCircle className="w-8 h-8 text-orange-200" />
          </div>
        </div>
        <div className="bg-gradient-to-r from-sky-500 to-sky-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sky-100 text-sm">Aéreos</p>
              <p className="text-3xl font-bold">{stats.aeroPackages}</p>
            </div>
            <Package className="w-8 h-8 text-sky-200" />
          </div>
        </div>
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Marítimos</p>
              <p className="text-3xl font-bold">{stats.maritimePackages}</p>
            </div>
            <Truck className="w-8 h-8 text-blue-200" />
          </div>
        </div>
      </div>
    </div>
  );

  const renderLocations = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="text-center mb-8">
          <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Gestión de Ubicaciones</h3>
          <p className="text-gray-600">
            Administra las ubicaciones del almacén y consulta la disponibilidad
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Zona A */}
          <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-green-800">Zona A</h4>
              <Package className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-sm text-green-600 mb-4">Paquetes Pequeños</p>
            <div className="space-y-2">
              {['A-01-01', 'A-01-02', 'A-01-03'].map((location) => {
                const isOccupied = packages.some(p => p.location === location);
                return (
                  <div key={location} className="flex justify-between items-center text-sm">
                    <span className="font-mono">{location}</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      isOccupied ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
                    }`}>
                      {isOccupied ? 'Ocupado' : 'Disponible'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* Zona B */}
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-blue-800">Zona B</h4>
              <Package className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-sm text-blue-600 mb-4">Paquetes Medianos</p>
            <div className="space-y-2">
              {['B-02-01', 'B-02-02', 'B-02-03'].map((location) => {
                const isOccupied = packages.some(p => p.location === location);
                return (
                  <div key={location} className="flex justify-between items-center text-sm">
                    <span className="font-mono">{location}</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      isOccupied ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
                    }`}>
                      {isOccupied ? 'Ocupado' : 'Disponible'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* Zona C */}
          <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-purple-800">Zona C</h4>
              <Package className="w-5 h-5 text-purple-600" />
            </div>
            <p className="text-sm text-purple-600 mb-4">Paquetes Grandes</p>
            <div className="space-y-2">
              {['C-03-01', 'C-03-02', 'C-03-03'].map((location) => {
                const isOccupied = packages.some(p => p.location === location);
                return (
                  <div key={location} className="flex justify-between items-center text-sm">
                    <span className="font-mono">{location}</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      isOccupied ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
                    }`}>
                      {isOccupied ? 'Ocupado' : 'Disponible'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderReports = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="text-center mb-8">
          <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Reportes y Analytics</h3>
          <p className="text-gray-600">Análisis del rendimiento del almacén</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Volumen Total</p>
                <p className="text-2xl font-bold">{stats.totalVolume.toFixed(3)} m³</p>
              </div>
              <Package className="w-8 h-8 text-blue-200" />
            </div>
          </div>
          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Peso Total</p>
                <p className="text-2xl font-bold">{stats.totalWeight.toFixed(1)} kg</p>
              </div>
              <Scale className="w-8 h-8 text-green-200" />
            </div>
          </div>
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Valor Total</p>
                <p className="text-2xl font-bold">₡{packages.reduce((sum, p) => sum + p.value, 0).toLocaleString()}</p>
              </div>
              <FileText className="w-8 h-8 text-purple-200" />
            </div>
          </div>
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm">Eficiencia</p>
                <p className="text-2xl font-bold">{Math.round((stats.aeroPackages + stats.maritimePackages) / stats.totalPackages * 100)}%</p>
              </div>
              <BarChart3 className="w-8 h-8 text-orange-200" />
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => alert('Generando reporte diario...')}
            className="flex-1 px-4 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
          >
            <Download className="w-5 h-5" />
            Reporte Diario
          </button>
          <button
            onClick={() => alert('Generando reporte semanal...')}
            className="flex-1 px-4 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
          >
            <Download className="w-5 h-5" />
            Reporte Semanal
          </button>
          <button
            onClick={() => alert('Exportando a Excel...')}
            className="flex-1 px-4 py-3 bg-purple-500 text-white rounded-xl hover:bg-purple-600 transition-colors flex items-center justify-center gap-2"
          >
            <FileText className="w-5 h-5" />
            Exportar Excel
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Módulo de Almacén</h1>
          <p className="text-gray-600">Gestiona warehouse receipts, ubicaciones y operaciones</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100">
            <div className="flex items-center gap-2">
              <Package className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-xs text-gray-500">Total WHRs</p>
                <p className="text-lg font-bold text-gray-800">{stats.totalPackages}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-orange-500" />
              <div>
                <p className="text-xs text-gray-500">Pendientes</p>
                <p className="text-lg font-bold text-gray-800">{stats.pendingClassification}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100">
            <div className="flex items-center gap-2">
              <Scale className="w-5 h-5 text-green-500" />
              <div>
                <p className="text-xs text-gray-500">Peso Total</p>
                <p className="text-lg font-bold text-gray-800">{stats.totalWeight.toFixed(1)}kg</p>
              </div>
            </div>
          </div>
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
              Crear WHR
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
              <Package className="w-5 h-5" />
              Lista WHR
              {packages.length > 0 && (
                <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {packages.length}
                </span>
              )}
            </div>
          </button>
          <button
            onClick={() => setActiveTab('locations')}
            className={`flex-1 py-3 px-6 rounded-xl font-medium transition-all ${
              activeTab === 'locations'
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <MapPin className="w-5 h-5" />
              Ubicaciones
            </div>
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={`flex-1 py-3 px-6 rounded-xl font-medium transition-all ${
              activeTab === 'reports'
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Reportes
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
        {activeTab === 'locations' && renderLocations()}
        {activeTab === 'reports' && renderReports()}
      </div>
    </div>
  );
};

export default WarehouseModule;