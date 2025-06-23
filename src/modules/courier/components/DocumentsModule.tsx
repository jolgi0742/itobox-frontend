// src/modules/courier/components/DocumentsModule.tsx
import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Printer, 
  Eye, 
  Plus, 
  Search, 
  Filter,
  QrCode, // ✅ Cambiado de Barcode
  FileCheck, 
  Receipt, 
  Package, 
  Truck, 
  Calendar,
  DollarSign,
  Scale // ✅ Cambiado de Weight
} from 'lucide-react';

interface Document {
  id: string;
  type: string;
  packageId: string;
  trackingNumber: string;
  clientName: string;
  createdDate: string;
  status: string;
  downloadUrl: string;
}

interface DocumentData {
  package: {
    trackingNumber: string;
    description: string;
    weight: string;
    dimensions: string;
    declaredValue: string;
  };
  shipper: {
    name: string;
    address: string;
    phone: string;
  };
  consignee: {
    name: string;
    address: string;
    phone: string;
  };
  shipment: {
    date: string;
    service: string;
    instructions: string;
  };
}

const DocumentsModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'documents' | 'templates' | 'generate'>('documents');
  const [searchTerm, setSearchTerm] = useState('');
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [selectedDocumentType, setSelectedDocumentType] = useState('declaration');
  
  const [documentData, setDocumentData] = useState<DocumentData>({
    package: {
      trackingNumber: '',
      description: '',
      weight: '',
      dimensions: '',
      declaredValue: ''
    },
    shipper: {
      name: '',
      address: '',
      phone: ''
    },
    consignee: {
      name: '',
      address: '',
      phone: ''
    },
    shipment: {
      date: new Date().toISOString().split('T')[0],
      service: 'air',
      instructions: ''
    }
  });

  // Mock data para documentos generados
  const [documents] = useState<Document[]>([
    {
      id: '1',
      type: 'Declaración de Valor',
      packageId: 'pkg1',
      trackingNumber: 'UPS123456789',
      clientName: 'Juan Pérez',
      createdDate: '2024-12-15',
      status: 'generated',
      downloadUrl: '#'
    },
    {
      id: '2',
      type: 'Nota de Entrega',
      packageId: 'pkg2',
      trackingNumber: 'FDX987654321',
      clientName: 'María González',
      createdDate: '2024-12-14',
      status: 'generated',
      downloadUrl: '#'
    },
    {
      id: '3',
      type: 'Etiqueta de Envío',
      packageId: 'pkg3',
      trackingNumber: 'DHL456789123',
      clientName: 'Carlos López',
      createdDate: '2024-12-13',
      status: 'generated',
      downloadUrl: '#'
    }
  ]);

  const documentTypes = [
    { value: 'declaration', label: 'Declaración de Valor', icon: FileCheck },
    { value: 'delivery', label: 'Nota de Entrega', icon: Receipt },
    { value: 'label', label: 'Etiqueta de Envío', icon: QrCode },
    { value: 'invoice', label: 'Factura', icon: DollarSign },
    { value: 'manifest', label: 'Manifiesto', icon: FileText }
  ];

  const getDocumentTypeName = (type: string): string => {
    switch(type) {
      case 'declaration': return 'Declaración de Valor';
      case 'delivery': return 'Nota de Entrega';
      case 'label': return 'Etiqueta de Envío';
      case 'invoice': return 'Factura';
      case 'manifest': return 'Manifiesto';
      default: return type;
    }
  };

  const getDocumentIcon = (type: string): React.ReactNode => {
    switch(type) {
      case 'Declaración de Valor': return <FileCheck size={16} color="#3b82f6" />;
      case 'Nota de Entrega': return <Receipt size={16} color="#10b981" />;
      case 'Etiqueta de Envío': return <QrCode size={16} color="#8b5cf6" />;
      case 'Factura': return <DollarSign size={16} color="#f59e0b" />;
      case 'Manifiesto': return <FileText size={16} color="#ef4444" />;
      default: return <FileText size={16} color="#6b7280" />;
    }
  };

  const generateDocument = () => {
    console.log('Generando documento:', selectedDocumentType, documentData);
    setShowGenerateModal(false);
    // Aquí iría la lógica para generar el documento
  };

  const filteredDocuments = documents.filter(doc =>
    doc.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderDocumentPreview = (): React.ReactNode => {
    if (selectedDocumentType === 'declaration') {
      return (
        <div className="bg-white border border-gray-300 p-6 rounded-lg">
          <div className="text-center mb-6">
            <h3 className="text-lg font-bold">DECLARACIÓN DE VALOR DE ENVÍO</h3>
            <p className="text-sm text-gray-600">SHIPPING DECLARATION OF VALUE</p>
          </div>
          
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <h4 className="font-semibold mb-2">REMITENTE / SHIPPER</h4>
              <div className="text-sm">
                <p>{documentData.shipper.name || '[Nombre del Remitente]'}</p>
                <p>{documentData.shipper.address || '[Dirección del Remitente]'}</p>
                <p>{documentData.shipper.phone || '[Teléfono del Remitente]'}</p>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-2">DESTINATARIO / CONSIGNEE</h4>
              <div className="text-sm">
                <p>{documentData.consignee.name || '[Nombre del Destinatario]'}</p>
                <p>{documentData.consignee.address || '[Dirección del Destinatario]'}</p>
                <p>{documentData.consignee.phone || '[Teléfono del Destinatario]'}</p>
              </div>
            </div>
          </div>

          <div className="border-t border-b border-gray-300 py-4 mb-6">
            <h4 className="font-semibold mb-2">INFORMACIÓN DEL PAQUETE / PACKAGE INFORMATION</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p><strong>Tracking:</strong> {documentData.package.trackingNumber || '[Número de Tracking]'}</p>
                <p><strong>Descripción:</strong> {documentData.package.description || '[Descripción del Contenido]'}</p>
              </div>
              <div>
                <p><strong>Peso:</strong> {documentData.package.weight || '[Peso]'} Lb</p>
                <p><strong>Dimensiones:</strong> {documentData.package.dimensions || '[Dimensiones]'}</p>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h4 className="font-semibold mb-2">DECLARACIÓN DE VALOR / VALUE DECLARATION</h4>
            <table className="w-full border border-gray-300 text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border border-gray-300 p-2 text-left">Descripción</th>
                  <th className="border border-gray-300 p-2 text-left">Cantidad</th>
                  <th className="border border-gray-300 p-2 text-left">Valor Unitario</th>
                  <th className="border border-gray-300 p-2 text-left">Valor Total</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 p-2">{documentData.package.description || '[Descripción]'}</td>
                  <td className="border border-gray-300 p-2">1</td>
                  <td className="border border-gray-300 p-2">${documentData.package.declaredValue || '0.00'}</td>
                  <td className="border border-gray-300 p-2">${documentData.package.declaredValue || '0.00'}</td>
                </tr>
                <tr>
                  <td colSpan={2} className="border border-gray-300 p-2 text-right font-bold">Total Value</td>
                  <td colSpan={2} className="border border-gray-300 p-2 font-bold">${documentData.package.declaredValue || '0.00'}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="flex justify-between items-end">
            <div>
              <p className="text-xs text-gray-600">Fecha: {documentData.shipment.date}</p>
              <p className="text-xs text-gray-600">Servicio: {documentData.shipment.service === 'air' ? 'Aéreo' : 'Marítimo'}</p>
            </div>
            <div className="text-right">
              <QrCode size={80} className="mx-auto mb-2" />
              <p className="text-xs">{documentData.package.trackingNumber || 'TRACKING-NUMBER'}</p>
            </div>
          </div>
        </div>
      );
    }

    if (selectedDocumentType === 'delivery') {
      return (
        <div className="bg-white border border-gray-300 p-6 rounded-lg">
          <div className="text-center mb-6">
            <h3 className="text-lg font-bold">NOTA DE ENTREGA</h3>
            <p className="text-sm text-gray-600">DELIVERY NOTE</p>
          </div>
          
          <div className="mb-4">
            <div className="flex justify-between">
              <div>
                <p><strong>No. Tracking:</strong> {documentData.package.trackingNumber || '[TRACKING]'}</p>
                <p><strong>Fecha:</strong> {documentData.shipment.date}</p>
              </div>
              <div className="text-right">
                <QrCode size={60} />
              </div>
            </div>
          </div>

          <div className="border border-gray-300 p-4 mb-4">
            <h4 className="font-semibold mb-2">INFORMACIÓN DEL DESTINATARIO</h4>
            <p>{documentData.consignee.name || '[Nombre del Destinatario]'}</p>
            <p>{documentData.consignee.address || '[Dirección de Entrega]'}</p>
            <p>{documentData.consignee.phone || '[Teléfono de Contacto]'}</p>
          </div>

          <div className="border border-gray-300 p-4 mb-4">
            <h4 className="font-semibold mb-2">DETALLES DEL PAQUETE</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p><strong>Descripción:</strong> {documentData.package.description || '[Contenido]'}</p>
                <p><strong>Peso:</strong> {documentData.package.weight || '0'} Lb</p>
              </div>
              <div>
                <p><strong>Dimensiones:</strong> {documentData.package.dimensions || '[Dimensiones]'}</p>
                <p><strong>Valor:</strong> ${documentData.package.declaredValue || '0.00'}</p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-300 pt-4 mt-6">
            <div className="grid grid-cols-2 gap-8">
              <div>
                <p className="text-sm font-semibold">FIRMA DEL DESTINATARIO</p>
                <div className="border-b border-gray-300 mt-8 mb-2"></div>
                <p className="text-xs text-gray-600">Nombre y Firma</p>
              </div>
              <div>
                <p className="text-sm font-semibold">ENTREGADO POR</p>
                <div className="border-b border-gray-300 mt-8 mb-2"></div>
                <p className="text-xs text-gray-600">Courier - Fecha y Hora</p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (selectedDocumentType === 'label') {
      return (
        <div className="bg-white border-2 border-gray-800 p-4 rounded-lg" style={{width: '4in', height: '6in', fontSize: '12px'}}>
          <div className="text-center mb-4">
            <h3 className="text-lg font-bold">ITOBOX COURIER</h3>
            <p className="text-xs">International Shipping Label</p>
          </div>
          
          <div className="border border-gray-400 p-2 mb-3">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs font-semibold">TRACKING NUMBER</p>
                <p className="text-lg font-bold">{documentData.package.trackingNumber || 'XXXXXXXXXXXXXXX'}</p>
              </div>
              <QrCode size={50} />
            </div>
          </div>

          <div className="mb-3">
            <p className="text-xs font-semibold">FROM:</p>
            <div className="border border-gray-300 p-2 text-xs">
              <p>{documentData.shipper.name || '[Remitente]'}</p>
              <p>{documentData.shipper.address || '[Dirección del Remitente]'}</p>
              <p>{documentData.shipper.phone || '[Teléfono]'}</p>
            </div>
          </div>

          <div className="mb-3">
            <p className="text-xs font-semibold">TO:</p>
            <div className="border border-gray-300 p-2 text-xs">
              <p className="font-semibold">{documentData.consignee.name || '[DESTINATARIO]'}</p>
              <p>{documentData.consignee.address || '[DIRECCIÓN DE ENTREGA]'}</p>
              <p>{documentData.consignee.phone || '[TELÉFONO]'}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <p><strong>Peso:</strong> {documentData.package.weight || '0'} Lb</p>
              <p><strong>Servicio:</strong> {documentData.shipment.service === 'air' ? 'AÉREO' : 'MARÍTIMO'}</p>
            </div>
            <div>
              <p><strong>Fecha:</strong> {documentData.shipment.date}</p>
              <p><strong>Valor:</strong> ${documentData.package.declaredValue || '0'}</p>
            </div>
          </div>

          <div className="border-t border-gray-400 pt-2 mt-3 text-center">
            <p className="text-xs">{documentData.package.description || '[Descripción del Contenido]'}</p>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-gray-100 border-2 border-dashed border-gray-300 p-8 rounded-lg text-center">
        <FileText size={48} className="mx-auto text-gray-400 mb-4" />
        <p className="text-gray-500">Selecciona un tipo de documento para ver la vista previa</p>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <FileText className="h-6 w-6 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Gestión de Documentos</h2>
              <p className="text-sm text-gray-500">Generación de documentos y etiquetas</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setShowGenerateModal(true)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors flex items-center"
            >
              <Plus className="h-4 w-4 mr-2" />
              Generar Documento
            </button>
          </div>
        </div>

        {/* Pestañas */}
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('documents')}
            className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'documents'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <FileText className="h-4 w-4 inline mr-2" />
            Documentos
          </button>
          <button
            onClick={() => setActiveTab('templates')}
            className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'templates'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <FileCheck className="h-4 w-4 inline mr-2" />
            Plantillas
          </button>
          <button
            onClick={() => setActiveTab('generate')}
            className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'generate'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Plus className="h-4 w-4 inline mr-2" />
            Generar
          </button>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
          <FileText size={32} color="#6366f1" style={{ marginBottom: '12px', margin: '0 auto' }} />
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#1f2937', marginTop: '12px' }}>
            {documents.length}
          </div>
          <div style={{ color: '#64748b' }}>Documentos</div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
          <FileCheck size={32} color="#10b981" style={{ marginBottom: '12px', margin: '0 auto' }} />
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#1f2937', marginTop: '12px' }}>
            {documents.filter(d => d.type === 'Declaración de Valor').length}
          </div>
          <div style={{ color: '#64748b' }}>Declaraciones</div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
          <Receipt size={32} color="#f59e0b" style={{ marginBottom: '12px', margin: '0 auto' }} />
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#1f2937', marginTop: '12px' }}>
            {documents.filter(d => d.type === 'Nota de Entrega').length}
          </div>
          <div style={{ color: '#64748b' }}>Notas de Entrega</div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
          <QrCode size={32} color="#8b5cf6" style={{ marginBottom: '12px', margin: '0 auto' }} />
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#1f2937', marginTop: '12px' }}>
            {documents.filter(d => d.type === 'Etiqueta de Envío').length}
          </div>
          <div style={{ color: '#64748b' }}>Etiquetas</div>
        </div>
      </div>

      {/* Contenido según pestaña activa */}
      {activeTab === 'documents' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6">
            {/* Barra de búsqueda */}
            <div className="flex flex-col sm:flex-row gap-4 items-center mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Buscar documentos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex space-x-2">
                <button className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 flex items-center">
                  <Filter className="h-4 w-4 mr-2" />
                  Filtros
                </button>
              </div>
            </div>

            {/* Lista de documentos */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tipo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tracking Number
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cliente
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha Creación
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
                  {filteredDocuments.map((doc) => (
                    <tr key={doc.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getDocumentIcon(doc.type)}
                          <span className="ml-2 text-sm font-medium text-gray-900">{doc.type}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {doc.trackingNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {doc.clientName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {doc.createdDate}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                          Generado
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button className="text-blue-600 hover:text-blue-900">
                            <Eye className="h-4 w-4" />
                          </button>
                          <button className="text-green-600 hover:text-green-900">
                            <Download className="h-4 w-4" />
                          </button>
                          <button className="text-gray-600 hover:text-gray-900">
                            <Printer className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'templates' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Plantillas de Documentos</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {documentTypes.map((docType) => (
                <div key={docType.value} className="border border-gray-200 rounded-lg p-4 hover:border-indigo-300 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <docType.icon className="h-8 w-8 text-indigo-600" />
                    <button className="text-indigo-600 hover:text-indigo-800">
                      <Eye className="h-4 w-4" />
                    </button>
                  </div>
                  <h4 className="font-medium text-gray-900 mb-2">{docType.label}</h4>
                  <p className="text-sm text-gray-500 mb-4">
                    Plantilla estándar para {docType.label.toLowerCase()}
                  </p>
                  <div className="flex space-x-2">
                    <button className="flex-1 bg-indigo-600 text-white px-3 py-1 rounded text-sm hover:bg-indigo-700">
                      Usar Plantilla
                    </button>
                    <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">
                      Editar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'generate' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Generar Documento</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Documento
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={selectedDocumentType}
                  onChange={(e) => setSelectedDocumentType(e.target.value)}
                >
                  {documentTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tracking Number
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={documentData.package.trackingNumber}
                    onChange={(e) => setDocumentData({
                      ...documentData,
                      package: { ...documentData.package, trackingNumber: e.target.value }
                    })}
                    placeholder="Número de tracking"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Peso (Lb)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={documentData.package.weight}
                    onChange={(e) => setDocumentData({
                      ...documentData,
                      package: { ...documentData.package, weight: e.target.value }
                    })}
                    placeholder="0.0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción del Contenido
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={documentData.package.description}
                  onChange={(e) => setDocumentData({
                    ...documentData,
                    package: { ...documentData.package, description: e.target.value }
                  })}
                  placeholder="Descripción del paquete"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dimensiones
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={documentData.package.dimensions}
                    onChange={(e) => setDocumentData({
                      ...documentData,
                      package: { ...documentData.package, dimensions: e.target.value }
                    })}
                    placeholder="12x8x6 in"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Valor Declarado ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={documentData.package.declaredValue}
                    onChange={(e) => setDocumentData({
                      ...documentData,
                      package: { ...documentData.package, declaredValue: e.target.value }
                    })}
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-3">Información del Remitente</h4>
                <div className="space-y-3">
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={documentData.shipper.name}
                    onChange={(e) => setDocumentData({
                      ...documentData,
                      shipper: { ...documentData.shipper, name: e.target.value }
                    })}
                    placeholder="Nombre del remitente"
                  />
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={documentData.shipper.address}
                    onChange={(e) => setDocumentData({
                      ...documentData,
                      shipper: { ...documentData.shipper, address: e.target.value }
                    })}
                    placeholder="Dirección del remitente"
                  />
                  <input
                    type="tel"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={documentData.shipper.phone}
                    onChange={(e) => setDocumentData({
                      ...documentData,
                      shipper: { ...documentData.shipper, phone: e.target.value }
                    })}
                    placeholder="Teléfono del remitente"
                  />
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-3">Información del Destinatario</h4>
                <div className="space-y-3">
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={documentData.consignee.name}
                    onChange={(e) => setDocumentData({
                      ...documentData,
                      consignee: { ...documentData.consignee, name: e.target.value }
                    })}
                    placeholder="Nombre del destinatario"
                  />
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={documentData.consignee.address}
                    onChange={(e) => setDocumentData({
                      ...documentData,
                      consignee: { ...documentData.consignee, address: e.target.value }
                    })}
                    placeholder="Dirección del destinatario"
                  />
                  <input
                    type="tel"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={documentData.consignee.phone}
                    onChange={(e) => setDocumentData({
                      ...documentData,
                      consignee: { ...documentData.consignee, phone: e.target.value }
                    })}
                    placeholder="Teléfono del destinatario"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha de Envío
                  </label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={documentData.shipment.date}
                    onChange={(e) => setDocumentData({
                      ...documentData,
                      shipment: { ...documentData.shipment, date: e.target.value }
                    })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de Servicio
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={documentData.shipment.service}
                    onChange={(e) => setDocumentData({
                      ...documentData,
                      shipment: { ...documentData.shipment, service: e.target.value }
                    })}
                  >
                    <option value="air">Aéreo</option>
                    <option value="sea">Marítimo</option>
                  </select>
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  onClick={generateDocument}
                  className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700"
                >
                  Generar Documento
                </button>
                <button className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
                  Vista Previa
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Vista Previa</h3>
            <div className="max-h-96 overflow-y-auto">
              {renderDocumentPreview()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentsModule;