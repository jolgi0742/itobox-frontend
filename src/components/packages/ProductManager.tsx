import React, { useState } from 'react';
import { Plus, Search, X, Trash2, Calculator } from 'lucide-react';

// Interfaces (importarías desde los archivos anteriores)
interface Product {
  id: string;
  name: string;
  description: string;
  unitValue: number;
  category: string;
  partitionNumber?: string;
  weight?: number;
}

interface PackageItem {
  product: Product;
  quantity: number;
  customDescription?: string;
  customValue?: number;
}

const PRODUCTS_DATABASE: Product[] = [
  {
    id: 'P001',
    name: 'iPhone 15 Pro',
    description: 'Smartphone Apple iPhone 15 Pro 128GB',
    unitValue: 999.00,
    category: 'Electrónicos',
    partitionNumber: '8517.12.00',
    weight: 0.187
  },
  {
    id: 'P002',
    name: 'MacBook Air M2',
    description: 'Laptop Apple MacBook Air 13" M2 256GB',
    unitValue: 1199.00,
    category: 'Computadoras',
    partitionNumber: '8471.30.01',
    weight: 1.24
  },
  {
    id: 'P003',
    name: 'Nike Air Force 1',
    description: 'Zapatos deportivos Nike Air Force 1 Blanco',
    unitValue: 120.00,
    category: 'Calzado',
    partitionNumber: '6403.91.60',
    weight: 0.8
  },
  {
    id: 'P004',
    name: 'Samsung Galaxy S24',
    description: 'Smartphone Samsung Galaxy S24 256GB',
    unitValue: 849.00,
    category: 'Electrónicos',
    partitionNumber: '8517.12.00',
    weight: 0.168
  },
  {
    id: 'P005',
    name: 'Sony WH-1000XM5',
    description: 'Audífonos inalámbricos Sony con cancelación de ruido',
    unitValue: 349.00,
    category: 'Audio',
    partitionNumber: '8518.30.20',
    weight: 0.254
  }
];

const SERVICE_TYPES = [
  { value: 'express', label: 'Express (1-2 días)', color: 'bg-red-100 text-red-800' },
  { value: 'standard', label: 'Standard (3-5 días)', color: 'bg-blue-100 text-blue-800' },
  { value: 'economy', label: 'Economy (7-10 días)', color: 'bg-green-100 text-green-800' }
];

interface ProductManagerProps {
  items: PackageItem[];
  onItemsChange: (items: PackageItem[]) => void;
  serviceType: string;
  onServiceTypeChange: (type: string) => void;
}

export const ProductManager: React.FC<ProductManagerProps> = ({ 
  items, 
  onItemsChange, 
  serviceType, 
  onServiceTypeChange 
}) => {
  const [showProductModal, setShowProductModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const filteredProducts = PRODUCTS_DATABASE.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [...new Set(PRODUCTS_DATABASE.map(p => p.category))];

  const addProduct = (product: Product, quantity: number = 1) => {
    const newItem: PackageItem = {
      product,
      quantity
    };
    onItemsChange([...items, newItem]);
    setShowProductModal(false);
  };

  const removeItem = (index: number) => {
    const updatedItems = items.filter((_, i) => i !== index);
    onItemsChange(updatedItems);
  };

  const updateItemQuantity = (index: number, quantity: number) => {
    const updatedItems = [...items];
    updatedItems[index].quantity = quantity;
    onItemsChange(updatedItems);
  };

  const totalWeight = items.reduce((sum, item) => 
    sum + (item.product.weight || 0) * item.quantity, 0);
  const totalValue = items.reduce((sum, item) => 
    sum + (item.customValue || item.product.unitValue) * item.quantity, 0);

  return (
    <div className="space-y-6">
      {/* Tipo de Servicio */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Tipo de Servicio
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {SERVICE_TYPES.map((service) => (
            <button
              key={service.value}
              type="button"
              onClick={() => onServiceTypeChange(service.value)}
              className={`p-3 border-2 rounded-lg text-center transition-all ${
                serviceType === service.value
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className={`inline-block px-2 py-1 rounded text-xs font-medium mb-1 ${service.color}`}>
                {service.value.toUpperCase()}
              </div>
              <div className="text-sm font-medium">{service.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Lista de Productos */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Productos del Paquete
          </label>
          <button
            type="button"
            onClick={() => setShowProductModal(true)}
            className="flex items-center space-x-2 px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Agregar Producto</span>
          </button>
        </div>

        {items.length === 0 ? (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Plus className="w-6 h-6 text-gray-400" />
            </div>
            <p className="text-gray-500 mb-2">No hay productos agregados</p>
            <button
              type="button"
              onClick={() => setShowProductModal(true)}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Agregar primer producto
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((item, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="font-medium text-gray-900">{item.product.name}</h4>
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                        {item.product.partitionNumber}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{item.product.description}</p>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-sm">
                      <div>
                        <span className="text-gray-500">Cantidad:</span>
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => updateItemQuantity(index, parseInt(e.target.value) || 1)}
                          className="ml-2 w-16 px-2 py-1 border border-gray-300 rounded text-center"
                        />
                      </div>
                      <div>
                        <span className="text-gray-500">Valor Unit:</span>
                        <span className="ml-2 font-medium">${(item.customValue || item.product.unitValue).toFixed(2)}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Peso:</span>
                        <span className="ml-2">{((item.product.weight || 0) * item.quantity).toFixed(2)} kg</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Subtotal:</span>
                        <span className="ml-2 font-bold text-green-600">
                          ${((item.customValue || item.product.unitValue) * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Resumen */}
      {items.length > 0 && (
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-3">
            <Calculator className="w-5 h-5 text-gray-600" />
            <h3 className="font-medium text-gray-900">Resumen del Paquete</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="text-center p-3 bg-white rounded border">
              <div className="text-2xl font-bold text-blue-600">{items.length}</div>
              <div className="text-gray-600">Productos</div>
            </div>
            <div className="text-center p-3 bg-white rounded border">
              <div className="text-2xl font-bold text-green-600">{totalWeight.toFixed(2)} kg</div>
              <div className="text-gray-600">Peso Total</div>
            </div>
            <div className="text-center p-3 bg-white rounded border">
              <div className="text-2xl font-bold text-purple-600">${totalValue.toFixed(2)}</div>
              <div className="text-gray-600">Valor Total</div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Selección de Productos */}
      {showProductModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-60">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[80vh] overflow-hidden">
            <div className="bg-gradient-to-r from-green-600 to-blue-600 px-6 py-4 text-white">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold">Seleccionar Producto</h3>
                <button onClick={() => setShowProductModal(false)} className="text-white hover:text-gray-200">
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6">
              {/* Búsqueda y Filtros */}
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Buscar productos..."
                  />
                </div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Todas las categorías</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              {/* Lista de Productos */}
              <div className="overflow-y-auto max-h-96">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredProducts.map((product) => (
                    <div key={product.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-gray-900 text-sm">{product.name}</h4>
                        <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">{product.category}</span>
                      </div>
                      <p className="text-xs text-gray-600 mb-3 line-clamp-2">{product.description}</p>
                      <div className="space-y-1 text-xs text-gray-500 mb-3">
                        <div>💰 <span className="font-medium text-green-600">${product.unitValue.toFixed(2)}</span></div>
                        <div>⚖️ {product.weight ? `${product.weight} kg` : 'Peso no especificado'}</div>
                        <div>📋 {product.partitionNumber}</div>
                      </div>
                      <button
                        onClick={() => addProduct(product)}
                        className="w-full px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                      >
                        Agregar al Paquete
                      </button>
                    </div>
                  ))}
                </div>

                {filteredProducts.length === 0 && (
                  <div className="text-center py-8">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Search className="w-6 h-6 text-gray-400" />
                    </div>
                    <p className="text-gray-500">No se encontraron productos</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManager;