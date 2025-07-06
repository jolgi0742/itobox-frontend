// ===== INTERFACES =====
export interface ProductItem {
  id: string;
  partitionNumber: string;
  description: string;
  unitValue: number;
  quantity: number;
  totalValue: number;
  weight: number;
  category: string;
  isEditable?: boolean;
}

export interface WHRData {
  id: string;
  whrNumber: string;
  clientName: string;
  receivedDate: string;
  status: 'pending' | 'classified' | 'processed' | 'shipped';
  products: ProductItem[];
  totalWeight: number;
  totalValue: number;
  location: string;
  notes: string;
  trackingNumbers: string[];
}

// ===== BASE DE DATOS DE PRODUCTOS =====
export const PRODUCT_CATALOG: Omit<ProductItem, 'id' | 'quantity' | 'totalValue' | 'isEditable'>[] = [
  {
    partitionNumber: '8517.12.00',
    description: 'Smartphone iPhone 15 Pro 128GB',
    unitValue: 999.00,
    weight: 0.187,
    category: 'Electrónicos'
  },
  {
    partitionNumber: '8471.30.01',
    description: 'Laptop MacBook Air 13" M2 256GB',
    unitValue: 1199.00,
    weight: 1.24,
    category: 'Computadoras'
  },
  {
    partitionNumber: '6403.91.60',
    description: 'Zapatos deportivos Nike Air Force 1',
    unitValue: 120.00,
    weight: 0.8,
    category: 'Calzado'
  },
  {
    partitionNumber: '8518.30.20',
    description: 'Audífonos inalámbricos Sony WH-1000XM5',
    unitValue: 349.00,
    weight: 0.254,
    category: 'Audio'
  },
  {
    partitionNumber: '4202.22.40',
    description: 'Bolso de mano Coach cuero genuino',
    unitValue: 295.00,
    weight: 0.6,
    category: 'Accesorios'
  },
  {
    partitionNumber: '3303.00.30',
    description: 'Perfume Chanel No.5 Eau de Parfum 100ml',
    unitValue: 180.00,
    weight: 0.3,
    category: 'Belleza'
  },
  {
    partitionNumber: '2106.90.99',
    description: 'Multivitaminas Centrum Adults 365 tabletas',
    unitValue: 25.00,
    weight: 0.5,
    category: 'Salud'
  },
  {
    partitionNumber: '9503.00.75',
    description: 'Set Lego Creator Expert Volkswagen Beetle',
    unitValue: 89.99,
    weight: 2.1,
    category: 'Juguetes'
  },
  {
    partitionNumber: '8516.50.00',
    description: 'Olla de presión eléctrica Instant Pot Duo 6Qt',
    unitValue: 79.99,
    weight: 5.4,
    category: 'Hogar'
  },
  {
    partitionNumber: '6204.62.40',
    description: 'Vestido casual marca Zara talla M',
    unitValue: 45.99,
    weight: 0.3,
    category: 'Ropa'
  }
];

// ===== DATOS SIMULADOS =====
export const SAMPLE_WHRS: WHRData[] = [
  {
    id: 'WHR001',
    whrNumber: 'WHR241216001',
    clientName: 'María González Jiménez',
    receivedDate: '2024-12-16',
    status: 'classified',
    products: [
      {
        id: 'p1',
        partitionNumber: '8517.12.00',
        description: 'Smartphone iPhone 15 Pro 128GB',
        unitValue: 999.00,
        quantity: 1,
        totalValue: 999.00,
        weight: 0.187,
        category: 'Electrónicos'
      },
      {
        id: 'p2',
        partitionNumber: '4202.22.40',
        description: 'Bolso de mano Coach cuero genuino',
        unitValue: 295.00,
        quantity: 1,
        totalValue: 295.00,
        weight: 0.6,
        category: 'Accesorios'
      }
    ],
    totalWeight: 0.787,
    totalValue: 1294.00,
    location: 'A-12-B',
    notes: 'Paquetes frágiles, manejar con cuidado',
    trackingNumbers: ['1Z999AA1234567890', '1Z999AA1234567891']
  },
  {
    id: 'WHR002',
    whrNumber: 'WHR241216002',
    clientName: 'Carlos Rodríguez Morales',
    receivedDate: '2024-12-16',
    status: 'pending',
    products: [
      {
        id: 'p3',
        partitionNumber: '8471.30.01',
        description: 'Laptop MacBook Air 13" M2 256GB',
        unitValue: 1199.00,
        quantity: 1,
        totalValue: 1199.00,
        weight: 1.24,
        category: 'Computadoras'
      }
    ],
    totalWeight: 1.24,
    totalValue: 1199.00,
    location: 'B-05-A',
    notes: '',
    trackingNumbers: ['1Z999AA1234567892']
  }
];

// ===== UTILIDADES =====
export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'pending': return 'bg-yellow-100 text-yellow-800';
    case 'classified': return 'bg-blue-100 text-blue-800';
    case 'processed': return 'bg-purple-100 text-purple-800';
    case 'shipped': return 'bg-green-100 text-green-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export const getStatusLabel = (status: string): string => {
  switch (status) {
    case 'pending': return 'Pendiente';
    case 'classified': return 'Clasificado';
    case 'processed': return 'Procesado';
    case 'shipped': return 'Enviado';
    default: return status;
  }
};