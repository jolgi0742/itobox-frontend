import React, { useState, useEffect } from 'react';
import { 
  Package, 
  Search, 
  Plus, 
  Mail, 
  Scale, // ✅ Corregido: Weight → Scale
  QrCode, // ✅ Corregido: Barcode → QrCode
  MapPin, 
  User, 
  Building, 
  Calendar,
  Truck,
  Plane,
  Ship,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  Edit3,
  Trash2,
  Filter,
  Download,
  Upload,
  RefreshCw,
  Settings,
  Info,
  Calculator // ✅ Agregado para el modal de vista
} from 'lucide-react';

interface WHRPackage {
  id: string;
  whrNumber: string;
  trackingNumber: string;
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
  packageDetails: {
    description: string;
    weight: number;
    dimensions: {
      length: number;
      width: number;
      height: number;
    };
    declaredValue: number;
    packageType: string;
  };
  calculations: {
    volume: number;
    volumeWeight: number;
    chargeableWeight: number;
  };
  status: 'pending' | 'classified' | 'email_sent' | 'completed';
  classification: 'pending' | 'awb' | 'bl';
  transportType: 'air' | 'sea' | 'pending';
  emailSent: boolean;
  createdAt: string;
  updatedAt: string;
}

const WarehouseModule: React.FC = () => {
  const [packages, setPackages] = useState<WHRPackage[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<WHRPackage | null>(null);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    classified: 0,
    completed: 0
  });

  // Estados del formulario
  const [formData, setFormData] = useState({
    trackingNumber: '',
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
    },
    packageDetails: {
      description: '',
      weight: 0,
      dimensions: {
        length: 0,
        width: 0,
        height: 0
      },
      declaredValue: 0,
      packageType: 'box'
    }
  });

  // Cargar datos
  useEffect(() => {
    loadPackages();
    loadStats();
  }, []);

  const loadPackages = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/warehouse/whr`);
      if (response.ok) {
        const data = await response.json();
        setPackages(data.data || []);
      }
    } catch (error) {
      console.error('Error loading packages:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/warehouse/stats`);
      if (response.ok) {
        const data = await response.json();
        setStats(data.data || { total: 0, pending: 0, classified: 0, completed: 0 });
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  // Cálculos automáticos
  const calculateMetrics = (length: number, width: number, height: number, weight: number) => {
    const volume = (length * width * height) * 0.000578746; // Convert to cubic feet
    const volumeWeight = volume * 10.4; // Volume weight formula
    const chargeableWeight = Math.max(weight, volumeWeight);
    
    return {
      volume: Number(volume.toFixed(4)),
      volumeWeight: Number(volumeWeight.toFixed(2)),
      chargeableWeight: Number(chargeableWeight.toFixed(2))
    };
  };

  // Crear WHR
  const handleCreateWHR = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const calculations = calculateMetrics(
        formData.packageDetails.dimensions.length,
        formData.packageDetails.dimensions.width,
        formData.packageDetails.dimensions.height,
        formData.packageDetails.weight
      );

      const whrData = {
        ...formData,
        calculations
      };

      const response = await fetch(`${process.env.REACT_APP_API_URL}/warehouse/whr`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(whrData)
      });

      if (response.ok) {
        const result = await response.json();
        console.log('✅ WHR created successfully:', result);
        setShowCreateModal(false);
        resetForm();
        loadPackages();
        loadStats();
        alert(`WHR created successfully! Number: ${result.data.whrNumber}`);
      } else {
        throw new Error('Failed to create WHR');
      }
    } catch (error) {
      console.error('❌ Error creating WHR:', error);
      alert('Error creating WHR. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Clasificar AWB/BL
  const handleClassify = async (packageId: string, classification: 'awb' | 'bl') => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/warehouse/whr/${packageId}/classify`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ classification })
      });

      if (response.ok) {
        loadPackages();
        loadStats();
        alert(`Package classified as ${classification.toUpperCase()} successfully!`);
      }
    } catch (error) {
      console.error('Error classifying package:', error);
      alert('Error classifying package. Please try again.');
    }
  };

  // Enviar email
  const handleSendEmail = async (packageId: string) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/warehouse/whr/${packageId}/email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        loadPackages();
        loadStats();
        alert('Email notification sent successfully!');
      }
    } catch (error) {
      console.error('Error sending email:', error);
      alert('Error sending email. Please try again.');
    }
  };

  // Eliminar WHR
  const handleDelete = async (packageId: string) => {
    if (window.confirm('Are you sure you want to delete this WHR?')) {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/warehouse/whr/${packageId}`, {
          method: 'DELETE'
        });

        if (response.ok) {
          loadPackages();
          loadStats();
          alert('WHR deleted successfully!');
        }
      } catch (error) {
        console.error('Error deleting WHR:', error);
        alert('Error deleting WHR. Please try again.');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      trackingNumber: '',
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
      },
      packageDetails: {
        description: '',
        weight: 0,
        dimensions: {
          length: 0,
          width: 0,
          height: 0
        },
        declaredValue: 0,
        packageType: 'box'
      }
    });
  };

  // Filtrar paquetes
  const filteredPackages = packages.filter(pkg => {
    const matchesSearch = 
      pkg.whrNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pkg.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pkg.consignee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pkg.consignee.company.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = selectedStatus === 'all' || pkg.status === selectedStatus;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'classified': return <CheckCircle className="h-4 w-4 text-blue-500" />;
      case 'email_sent': return <Mail className="h-4 w-4 text-green-500" />;
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-500" />;
      default: return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getClassificationIcon = (classification: string, transportType: string) => {
    if (classification === 'awb' || transportType === 'air') {
      return <Plane className="h-4 w-4 text-blue-500" />;
    } else if (classification === 'bl' || transportType === 'sea') {
      return <Ship className="h-4 w-4 text-blue-600" />;
    }
    return <Package className="h-4 w-4 text-gray-500" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <div className="bg-white/70 backdrop-blur-md border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Warehouse Operations</h1>
              <p className="text-sm text-gray-600">WHR Management System</p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 flex items-center gap-2 shadow-lg"
            >
              <Plus className="h-4 w-4" />
              Create WHR
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total WHRs</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <Package className="h-8 w-8 text-blue-500" />
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Classified</p>
                <p className="text-2xl font-bold text-blue-600">{stats.classified}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-blue-500" />
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-gray-200 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search by WHR number, tracking, or consignee..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="classified">Classified</option>
              <option value="email_sent">Email Sent</option>
              <option value="completed">Completed</option>
            </select>
            <button
              onClick={loadPackages}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </button>
          </div>
        </div>

        {/* WHR List */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50/80">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    WHR Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Consignee
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Package Info
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Classification
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center">
                        <RefreshCw className="h-5 w-5 animate-spin text-blue-500" />
                        <span className="ml-2 text-gray-600">Loading...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredPackages.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                      No WHRs found
                    </td>
                  </tr>
                ) : (
                  filteredPackages.map((pkg) => (
                    <tr key={pkg.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{pkg.whrNumber}</div>
                        <div className="text-sm text-gray-500">{pkg.trackingNumber}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{pkg.consignee.name}</div>
                        <div className="text-sm text-gray-500">{pkg.consignee.company}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-900">
                          <Scale className="h-4 w-4 mr-1 text-gray-400" />
                          {pkg.packageDetails.weight} lbs
                        </div>
                        <div className="text-sm text-gray-500">
                          ${pkg.packageDetails.declaredValue}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getStatusIcon(pkg.status)}
                          <span className="ml-2 text-sm capitalize text-gray-900">
                            {pkg.status.replace('_', ' ')}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          {getClassificationIcon(pkg.classification, pkg.transportType)}
                          <span className="text-sm capitalize text-gray-900">
                            {pkg.classification === 'pending' ? 'Not classified' : pkg.classification.toUpperCase()}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setSelectedPackage(pkg);
                              setShowViewModal(true);
                            }}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          
                          {pkg.classification === 'pending' && (
                            <>
                              <button
                                onClick={() => handleClassify(pkg.id, 'awb')}
                                className="text-blue-600 hover:text-blue-900 flex items-center gap-1"
                                title="Classify as AWB (Air)"
                              >
                                <Plane className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleClassify(pkg.id, 'bl')}
                                className="text-blue-800 hover:text-blue-900 flex items-center gap-1"
                                title="Classify as BL (Sea)"
                              >
                                <Ship className="h-4 w-4" />
                              </button>
                            </>
                          )}
                          
                          {!pkg.emailSent && (
                            <button
                              onClick={() => handleSendEmail(pkg.id)}
                              className="text-green-600 hover:text-green-900"
                              title="Send Email Notification"
                            >
                              <Mail className="h-4 w-4" />
                            </button>
                          )}
                          
                          <button
                            onClick={() => handleDelete(pkg.id)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete WHR"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Create WHR Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Create New WHR</h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleCreateWHR} className="space-y-6">
                {/* Tracking Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tracking Number
                  </label>
                  <input
                    type="text"
                    value={formData.trackingNumber}
                    onChange={(e) => setFormData({...formData, trackingNumber: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                {/* Shipper Information */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Shipper Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Shipper Name"
                      value={formData.shipper.name}
                      onChange={(e) => setFormData({
                        ...formData,
                        shipper: {...formData.shipper, name: e.target.value}
                      })}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Company"
                      value={formData.shipper.company}
                      onChange={(e) => setFormData({
                        ...formData,
                        shipper: {...formData.shipper, company: e.target.value}
                      })}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      placeholder="Phone"
                      value={formData.shipper.phone}
                      onChange={(e) => setFormData({
                        ...formData,
                        shipper: {...formData.shipper, phone: e.target.value}
                      })}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="email"
                      placeholder="Email"
                      value={formData.shipper.email}
                      onChange={(e) => setFormData({
                        ...formData,
                        shipper: {...formData.shipper, email: e.target.value}
                      })}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    <textarea
                      placeholder="Address"
                      value={formData.shipper.address}
                      onChange={(e) => setFormData({
                        ...formData,
                        shipper: {...formData.shipper, address: e.target.value}
                      })}
                      className="md:col-span-2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      rows={2}
                      required
                    />
                  </div>
                </div>

                {/* Consignee Information */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                    <Building className="h-5 w-5" />
                    Consignee Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Consignee Name"
                      value={formData.consignee.name}
                      onChange={(e) => setFormData({
                        ...formData,
                        consignee: {...formData.consignee, name: e.target.value}
                      })}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Company"
                      value={formData.consignee.company}
                      onChange={(e) => setFormData({
                        ...formData,
                        consignee: {...formData.consignee, company: e.target.value}
                      })}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      placeholder="Phone"
                      value={formData.consignee.phone}
                      onChange={(e) => setFormData({
                        ...formData,
                        consignee: {...formData.consignee, phone: e.target.value}
                      })}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="email"
                      placeholder="Email"
                      value={formData.consignee.email}
                      onChange={(e) => setFormData({
                        ...formData,
                        consignee: {...formData.consignee, email: e.target.value}
                      })}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    <textarea
                      placeholder="Address"
                      value={formData.consignee.address}
                      onChange={(e) => setFormData({
                        ...formData,
                        consignee: {...formData.consignee, address: e.target.value}
                      })}
                      className="md:col-span-2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      rows={2}
                      required
                    />
                  </div>
                </div>

                {/* Package Details */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Package Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="md:col-span-2">
                      <input
                        type="text"
                        placeholder="Package Description"
                        value={formData.packageDetails.description}
                        onChange={(e) => setFormData({
                          ...formData,
                          packageDetails: {...formData.packageDetails, description: e.target.value}
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Scale className="h-4 w-4 text-gray-400" />
                      <input
                        type="number"
                        placeholder="Weight (lbs)"
                        value={formData.packageDetails.weight || ''}
                        onChange={(e) => setFormData({
                          ...formData,
                          packageDetails: {...formData.packageDetails, weight: parseFloat(e.target.value) || 0}
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        step="0.1"
                        required
                      />
                    </div>
                    <input
                      type="number"
                      placeholder="Declared Value ($)"
                      value={formData.packageDetails.declaredValue || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        packageDetails: {...formData.packageDetails, declaredValue: parseFloat(e.target.value) || 0}
                      })}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      step="0.01"
                    />
                  </div>
                  
                  {/* Dimensions */}
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Dimensions (inches)
                    </label>
                    <div className="grid grid-cols-3 gap-4">
                      <input
                        type="number"
                        placeholder="Length"
                        value={formData.packageDetails.dimensions.length || ''}
                        onChange={(e) => setFormData({
                          ...formData,
                          packageDetails: {
                            ...formData.packageDetails,
                            dimensions: {
                              ...formData.packageDetails.dimensions,
                              length: parseFloat(e.target.value) || 0
                            }
                          }
                        })}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        step="0.1"
                        required
                      />
                      <input
                        type="number"
                        placeholder="Width"
                        value={formData.packageDetails.dimensions.width || ''}
                        onChange={(e) => setFormData({
                          ...formData,
                          packageDetails: {
                            ...formData.packageDetails,
                            dimensions: {
                              ...formData.packageDetails.dimensions,
                              width: parseFloat(e.target.value) || 0
                            }
                          }
                        })}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        step="0.1"
                        required
                      />
                      <input
                        type="number"
                        placeholder="Height"
                        value={formData.packageDetails.dimensions.height || ''}
                        onChange={(e) => setFormData({
                          ...formData,
                          packageDetails: {
                            ...formData.packageDetails,
                            dimensions: {
                              ...formData.packageDetails.dimensions,
                              height: parseFloat(e.target.value) || 0
                            }
                          }
                        })}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        step="0.1"
                        required
                      />
                    </div>
                  </div>

                  {/* Calculations Preview */}
                  {formData.packageDetails.dimensions.length > 0 && 
                   formData.packageDetails.dimensions.width > 0 && 
                   formData.packageDetails.dimensions.height > 0 && 
                   formData.packageDetails.weight > 0 && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                      <h4 className="text-sm font-medium text-blue-900 mb-2">Calculations Preview</h4>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-blue-700">Volume: </span>
                          <span className="font-medium">
                            {calculateMetrics(
                              formData.packageDetails.dimensions.length,
                              formData.packageDetails.dimensions.width,
                              formData.packageDetails.dimensions.height,
                              formData.packageDetails.weight
                            ).volume} ft³
                          </span>
                        </div>
                        <div>
                          <span className="text-blue-700">Volume Weight: </span>
                          <span className="font-medium">
                            {calculateMetrics(
                              formData.packageDetails.dimensions.length,
                              formData.packageDetails.dimensions.width,
                              formData.packageDetails.dimensions.height,
                              formData.packageDetails.weight
                            ).volumeWeight} lbs
                          </span>
                        </div>
                        <div>
                          <span className="text-blue-700">Chargeable Weight: </span>
                          <span className="font-medium">
                            {calculateMetrics(
                              formData.packageDetails.dimensions.length,
                              formData.packageDetails.dimensions.width,
                              formData.packageDetails.dimensions.height,
                              formData.packageDetails.weight
                            ).chargeableWeight} lbs
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Form Actions */}
                <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 disabled:opacity-50 flex items-center gap-2"
                  >
                    {loading ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4" />
                        Create WHR
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* View WHR Modal */}
      {showViewModal && selectedPackage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">WHR Details</h2>
                <button
                  onClick={() => setShowViewModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-6">
                {/* WHR Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">WHR Number</label>
                    <p className="text-lg font-semibold text-gray-900">{selectedPackage.whrNumber}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Tracking Number</label>
                    <p className="text-lg font-semibold text-gray-900">{selectedPackage.trackingNumber}</p>
                  </div>
                </div>

                {/* Status and Classification */}
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Status</label>
                    <div className="flex items-center gap-2 mt-1">
                      {getStatusIcon(selectedPackage.status)}
                      <span className="capitalize font-medium">
                        {selectedPackage.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Classification</label>
                    <div className="flex items-center gap-2 mt-1">
                      {getClassificationIcon(selectedPackage.classification, selectedPackage.transportType)}
                      <span className="capitalize font-medium">
                        {selectedPackage.classification === 'pending' ? 'Not classified' : selectedPackage.classification.toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Email Sent</label>
                    <div className="flex items-center gap-2 mt-1">
                      {selectedPackage.emailSent ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-500" />
                      )}
                      <span className="font-medium">
                        {selectedPackage.emailSent ? 'Yes' : 'No'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Shipper & Consignee */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Shipper
                    </h3>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium">Name:</span> {selectedPackage.shipper.name}</p>
                      <p><span className="font-medium">Company:</span> {selectedPackage.shipper.company}</p>
                      <p><span className="font-medium">Phone:</span> {selectedPackage.shipper.phone}</p>
                      <p><span className="font-medium">Email:</span> {selectedPackage.shipper.email}</p>
                      <p><span className="font-medium">Address:</span> {selectedPackage.shipper.address}</p>
                    </div>
                  </div>
                  
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center gap-2">
                      <Building className="h-5 w-5" />
                      Consignee
                    </h3>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium">Name:</span> {selectedPackage.consignee.name}</p>
                      <p><span className="font-medium">Company:</span> {selectedPackage.consignee.company}</p>
                      <p><span className="font-medium">Phone:</span> {selectedPackage.consignee.phone}</p>
                      <p><span className="font-medium">Email:</span> {selectedPackage.consignee.email}</p>
                      <p><span className="font-medium">Address:</span> {selectedPackage.consignee.address}</p>
                    </div>
                  </div>
                </div>

                {/* Package Details & Calculations */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center gap-2">
                      <Package className="h-5 w-5" />
                      Package Details
                    </h3>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium">Description:</span> {selectedPackage.packageDetails.description}</p>
                      <p className="flex items-center gap-1">
                        <Scale className="h-4 w-4 text-gray-400" />
                        <span className="font-medium">Weight:</span> {selectedPackage.packageDetails.weight} lbs
                      </p>
                      <p><span className="font-medium">Dimensions:</span> {selectedPackage.packageDetails.dimensions.length}" × {selectedPackage.packageDetails.dimensions.width}" × {selectedPackage.packageDetails.dimensions.height}"</p>
                      <p><span className="font-medium">Declared Value:</span> ${selectedPackage.packageDetails.declaredValue}</p>
                      <p><span className="font-medium">Package Type:</span> {selectedPackage.packageDetails.packageType}</p>
                    </div>
                  </div>
                  
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center gap-2">
                      <Calculator className="h-5 w-5" />
                      Calculations
                    </h3>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium">Volume:</span> {selectedPackage.calculations.volume} ft³</p>
                      <p><span className="font-medium">Volume Weight:</span> {selectedPackage.calculations.volumeWeight} lbs</p>
                      <p><span className="font-medium">Chargeable Weight:</span> {selectedPackage.calculations.chargeableWeight} lbs</p>
                    </div>
                  </div>
                </div>

                {/* Timestamps */}
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                  <div>
                    <span className="font-medium">Created:</span> {new Date(selectedPackage.createdAt).toLocaleString()}
                  </div>
                  <div>
                    <span className="font-medium">Updated:</span> {new Date(selectedPackage.updatedAt).toLocaleString()}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-200">
                  {selectedPackage.classification === 'pending' && (
                    <>
                      <button
                        onClick={() => {
                          handleClassify(selectedPackage.id, 'awb');
                          setShowViewModal(false);
                        }}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
                      >
                        <Plane className="h-4 w-4" />
                        Classify as AWB
                      </button>
                      <button
                        onClick={() => {
                          handleClassify(selectedPackage.id, 'bl');
                          setShowViewModal(false);
                        }}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                      >
                        <Ship className="h-4 w-4" />
                        Classify as BL
                      </button>
                    </>
                  )}
                  
                  {!selectedPackage.emailSent && (
                    <button
                      onClick={() => {
                        handleSendEmail(selectedPackage.id);
                        setShowViewModal(false);
                      }}
                      className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
                    >
                      <Mail className="h-4 w-4" />
                      Send Email
                    </button>
                  )}
                  
                  <button
                    onClick={() => setShowViewModal(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WarehouseModule;