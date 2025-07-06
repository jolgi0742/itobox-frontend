// ===== INTERFACES Y TIPOS =====
export interface Product {
  id: string;
  name: string;
  description: string;
  unitValue: number;
  category: string;
  partitionNumber?: string;
  weight?: number;
}

export interface PackageItem {
  product: Product;
  quantity: number;
  customDescription?: string;
  customValue?: number;
}

export interface PackageData {
  trackingNumber: string;
  senderName: string;
  senderEmail: string;
  senderPhone: string;
  senderAddress: string;
  recipientName: string;
  recipientEmail: string;
  recipientPhone: string;
  recipientAddress: string;
  recipientMailbox?: string;
  serviceType: 'express' | 'standard' | 'economy';
  items: PackageItem[];
  totalWeight: number;
  totalValue: number;
  deliveryInstructions: string;
}

export interface NewPackageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (packageData: PackageData) => void;
}

// ===== BASE DE DATOS DE PRODUCTOS =====
export const PRODUCTS_DATABASE: Product[] = [
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
  },
  {
    id: 'P006',
    name: 'Coach Handbag',
    description: 'Bolso de mano Coach de cuero genuino',
    unitValue: 295.00,
    category: 'Accesorios',
    partitionNumber: '4202.22.40',
    weight: 0.6
  },
  {
    id: 'P007',
    name: 'Perfume Chanel No.5',
    description: 'Perfume Chanel No.5 Eau de Parfum 100ml',
    unitValue: 180.00,
    category: 'Belleza',
    partitionNumber: '3303.00.30',
    weight: 0.3
  },
  {
    id: 'P008',
    name: 'Vitaminas Centrum',
    description: 'Multivitaminas Centrum Adults 365 tabletas',
    unitValue: 25.00,
    category: 'Salud',
    partitionNumber: '2106.90.99',
    weight: 0.5
  },
  {
    id: 'P009',
    name: 'Lego Creator Expert',
    description: 'Set Lego Creator Expert Volkswagen Beetle',
    unitValue: 89.99,
    category: 'Juguetes',
    partitionNumber: '9503.00.75',
    weight: 2.1
  },
  {
    id: 'P010',
    name: 'Instant Pot Duo',
    description: 'Olla de presión eléctrica Instant Pot Duo 6Qt',
    unitValue: 79.99,
    category: 'Hogar',
    partitionNumber: '8516.50.00',
    weight: 5.4
  }
];

export const SERVICE_TYPES = [
  { value: 'express', label: 'Express (1-2 días)', color: 'bg-red-100 text-red-800' },
  { value: 'standard', label: 'Standard (3-5 días)', color: 'bg-blue-100 text-blue-800' },
  { value: 'economy', label: 'Economy (7-10 días)', color: 'bg-green-100 text-green-800' }
];