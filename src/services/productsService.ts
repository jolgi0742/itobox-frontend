// src/services/productsService.ts
// Base de datos de productos con descripción, valor unitario y partida arancelaria

export interface Product {
  id: string;
  code: string;
  name: string;
  description: string;
  category: string;
  unitValue: number;
  currency: string;
  weight: number;
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  hsCode: string; // Código de partida arancelaria
  isFragile: boolean;
  requiresLicense: boolean;
  tags: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductCategory {
  id: string;
  name: string;
  description: string;
  hsCodePrefix: string;
}

class ProductsService {
  private static instance: ProductsService;
  
  // Base de datos mock de productos
  private products: Product[] = [
    {
      id: 'PROD-001',
      code: 'ELEC-PHONE-001',
      name: 'iPhone 15 Pro',
      description: 'Smartphone Apple iPhone 15 Pro 128GB',
      category: 'electronics',
      unitValue: 999.00,
      currency: 'USD',
      weight: 0.2,
      dimensions: { length: 14.7, width: 7.1, height: 0.8 },
      hsCode: '8517.12.00',
      isFragile: true,
      requiresLicense: false,
      tags: ['smartphone', 'apple', 'electronics', 'premium'],
      isActive: true,
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-06-20T14:30:00Z'
    },
    {
      id: 'PROD-002',
      code: 'ELEC-LAPTOP-001',
      name: 'MacBook Air M3',
      description: 'Laptop Apple MacBook Air 13" M3 256GB',
      category: 'electronics',
      unitValue: 1299.00,
      currency: 'USD',
      weight: 1.24,
      dimensions: { length: 30.4, width: 21.5, height: 1.1 },
      hsCode: '8471.30.01',
      isFragile: true,
      requiresLicense: false,
      tags: ['laptop', 'apple', 'computer', 'portable'],
      isActive: true,
      createdAt: '2024-01-20T09:15:00Z',
      updatedAt: '2024-06-20T14:30:00Z'
    },
    {
      id: 'PROD-003',
      code: 'CLOTH-SHIRT-001',
      name: 'Camisa Polo Ralph Lauren',
      description: 'Camisa Polo de algodón 100% talla M',
      category: 'clothing',
      unitValue: 89.00,
      currency: 'USD',
      weight: 0.3,
      dimensions: { length: 25, width: 20, height: 3 },
      hsCode: '6105.10.00',
      isFragile: false,
      requiresLicense: false,
      tags: ['clothing', 'polo', 'cotton', 'casual'],
      isActive: true,
      createdAt: '2024-02-01T11:30:00Z',
      updatedAt: '2024-06-20T14:30:00Z'
    },
    {
      id: 'PROD-004',
      code: 'HOME-COFFEE-001',
      name: 'Cafetera Nespresso Vertuo',
      description: 'Cafetera automática Nespresso Vertuo Plus',
      category: 'home_appliances',
      unitValue: 199.00,
      currency: 'USD',
      weight: 4.2,
      dimensions: { length: 32, width: 15, height: 40 },
      hsCode: '8516.71.00',
      isFragile: true,
      requiresLicense: false,
      tags: ['coffee', 'appliance', 'kitchen', 'nespresso'],
      isActive: true,
      createdAt: '2024-02-10T16:45:00Z',
      updatedAt: '2024-06-20T14:30:00Z'
    },
    {
      id: 'PROD-005',
      code: 'SPORT-SHOES-001',
      name: 'Nike Air Max 270',
      description: 'Tenis Nike Air Max 270 para hombre talla 9.5 US',
      category: 'sports',
      unitValue: 150.00,
      currency: 'USD',
      weight: 0.8,
      dimensions: { length: 31, width: 12, height: 12 },
      hsCode: '6404.11.00',
      isFragile: false,
      requiresLicense: false,
      tags: ['shoes', 'nike', 'sports', 'running'],
      isActive: true,
      createdAt: '2024-02-15T08:20:00Z',
      updatedAt: '2024-06-20T14:30:00Z'
    },
    {
      id: 'PROD-006',
      code: 'BOOK-TECH-001',
      name: 'Libro "Clean Code"',
      description: 'Libro "Clean Code" por Robert C. Martin - Tapa dura',
      category: 'books',
      unitValue: 42.00,
      currency: 'USD',
      weight: 0.6,
      dimensions: { length: 23, width: 15, height: 3 },
      hsCode: '4901.99.00',
      isFragile: false,
      requiresLicense: false,
      tags: ['book', 'programming', 'education', 'tech'],
      isActive: true,
      createdAt: '2024-03-01T12:00:00Z',
      updatedAt: '2024-06-20T14:30:00Z'
    },
    {
      id: 'PROD-007',
      code: 'BEAUTY-PERFUME-001',
      name: 'Perfume Chanel No. 5',
      description: 'Perfume Chanel No. 5 Eau de Parfum 100ml',
      category: 'beauty',
      unitValue: 195.00,
      currency: 'USD',
      weight: 0.4,
      dimensions: { length: 8, width: 8, height: 12 },
      hsCode: '3303.00.30',
      isFragile: true,
      requiresLicense: false,
      tags: ['perfume', 'chanel', 'luxury', 'fragrance'],
      isActive: true,
      createdAt: '2024-03-10T14:15:00Z',
      updatedAt: '2024-06-20T14:30:00Z'
    },
    {
      id: 'PROD-008',
      code: 'TOY-LEGO-001',
      name: 'LEGO Star Wars Millennium Falcon',
      description: 'Set LEGO Star Wars Millennium Falcon 75257',
      category: 'toys',
      unitValue: 159.99,
      currency: 'USD',
      weight: 1.8,
      dimensions: { length: 48, width: 38, height: 14 },
      hsCode: '9503.00.00',
      isFragile: false,
      requiresLicense: false,
      tags: ['lego', 'starwars', 'toy', 'collectible'],
      isActive: true,
      createdAt: '2024-03-15T10:30:00Z',
      updatedAt: '2024-06-20T14:30:00Z'
    },
    {
      id: 'PROD-009',
      code: 'AUTO-TIRE-001',
      name: 'Llanta Michelin Pilot Sport',
      description: 'Llanta Michelin Pilot Sport 4S 245/40R18',
      category: 'automotive',
      unitValue: 285.00,
      currency: 'USD',
      weight: 12.5,
      dimensions: { length: 63, width: 63, height: 25 },
      hsCode: '4011.10.10',
      isFragile: false,
      requiresLicense: false,
      tags: ['tire', 'michelin', 'automotive', 'performance'],
      isActive: true,
      createdAt: '2024-04-01T09:45:00Z',
      updatedAt: '2024-06-20T14:30:00Z'
    },
    {
      id: 'PROD-010',
      code: 'HEALTH-SUPPLEMENT-001',
      name: 'Vitamina D3 5000 IU',
      description: 'Suplemento Vitamina D3 5000 IU - 120 cápsulas',
      category: 'health',
      unitValue: 24.99,
      currency: 'USD',
      weight: 0.15,
      dimensions: { length: 6, width: 6, height: 10 },
      hsCode: '2936.28.00',
      isFragile: false,
      requiresLicense: true, // Requiere licencia sanitaria
      tags: ['supplement', 'vitamin', 'health', 'wellness'],
      isActive: true,
      createdAt: '2024-04-10T13:20:00Z',
      updatedAt: '2024-06-20T14:30:00Z'
    }
  ];

  // Categorías de productos
  private categories: ProductCategory[] = [
    {
      id: 'electronics',
      name: 'Electrónicos',
      description: 'Dispositivos electrónicos, smartphones, laptops, etc.',
      hsCodePrefix: '85'
    },
    {
      id: 'clothing',
      name: 'Ropa y Textiles',
      description: 'Prendas de vestir, textiles y accesorios',
      hsCodePrefix: '61'
    },
    {
      id: 'home_appliances',
      name: 'Electrodomésticos',
      description: 'Aparatos para el hogar y cocina',
      hsCodePrefix: '85'
    },
    {
      id: 'sports',
      name: 'Deportes',
      description: 'Artículos deportivos, calzado deportivo, etc.',
      hsCodePrefix: '64'
    },
    {
      id: 'books',
      name: 'Libros',
      description: 'Libros, publicaciones y material educativo',
      hsCodePrefix: '49'
    },
    {
      id: 'beauty',
      name: 'Belleza y Cosméticos',
      description: 'Productos de belleza, perfumes, cosméticos',
      hsCodePrefix: '33'
    },
    {
      id: 'toys',
      name: 'Juguetes',
      description: 'Juguetes, juegos y artículos de entretenimiento',
      hsCodePrefix: '95'
    },
    {
      id: 'automotive',
      name: 'Automotriz',
      description: 'Repuestos y accesorios para vehículos',
      hsCodePrefix: '40'
    },
    {
      id: 'health',
      name: 'Salud y Medicina',
      description: 'Suplementos, medicamentos y productos de salud',
      hsCodePrefix: '29'
    }
  ];

  public static getInstance(): ProductsService {
    if (!ProductsService.instance) {
      ProductsService.instance = new ProductsService();
    }
    return ProductsService.instance;
  }

  // Obtener todos los productos
  public getAllProducts(): Product[] {
    return this.products.filter(p => p.isActive);
  }

  // Buscar productos
  public searchProducts(query: string): Product[] {
    const lowercaseQuery = query.toLowerCase();
    return this.products.filter(product => 
      product.isActive && (
        product.name.toLowerCase().includes(lowercaseQuery) ||
        product.description.toLowerCase().includes(lowercaseQuery) ||
        product.code.toLowerCase().includes(lowercaseQuery) ||
        product.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
      )
    );
  }

  // Obtener productos por categoría
  public getProductsByCategory(categoryId: string): Product[] {
    return this.products.filter(p => p.isActive && p.category === categoryId);
  }

  // Obtener producto por ID
  public getProductById(id: string): Product | null {
    return this.products.find(p => p.id === id) || null;
  }

  // Obtener producto por código
  public getProductByCode(code: string): Product | null {
    return this.products.find(p => p.code === code && p.isActive) || null;
  }

  // Obtener todas las categorías
  public getCategories(): ProductCategory[] {
    return this.categories;
  }

  // Obtener categoría por ID
  public getCategoryById(id: string): ProductCategory | null {
    return this.categories.find(c => c.id === id) || null;
  }

  // Crear nuevo producto
  public createProduct(productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Product {
    const newProduct: Product = {
      ...productData,
      id: `PROD-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.products.push(newProduct);
    return newProduct;
  }

  // Actualizar producto
  public updateProduct(id: string, updates: Partial<Product>): Product | null {
    const index = this.products.findIndex(p => p.id === id);
    if (index === -1) return null;

    this.products[index] = {
      ...this.products[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    return this.products[index];
  }

  // Eliminar producto (soft delete)
  public deleteProduct(id: string): boolean {
    const index = this.products.findIndex(p => p.id === id);
    if (index === -1) return false;

    this.products[index].isActive = false;
    this.products[index].updatedAt = new Date().toISOString();
    return true;
  }

  // Obtener productos más populares
  public getPopularProducts(limit: number = 5): Product[] {
    // En una implementación real, esto vendría de analytics
    return this.products
      .filter(p => p.isActive)
      .sort((a, b) => a.name.localeCompare(b.name))
      .slice(0, limit);
  }

  // Obtener productos recientes
  public getRecentProducts(limit: number = 5): Product[] {
    return this.products
      .filter(p => p.isActive)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  }

  // Validar código HS
  public validateHSCode(hsCode: string): boolean {
    // Validación básica de código HS (6-10 dígitos)
    const hsPattern = /^\d{4}\.\d{2}\.\d{2}(\.\d{2})?$/;
    return hsPattern.test(hsCode);
  }

  // Obtener sugerencias de productos
  public getProductSuggestions(partial: string, limit: number = 10): Product[] {
    if (partial.length < 2) return [];
    
    const lowercasePartial = partial.toLowerCase();
    return this.products
      .filter(p => 
        p.isActive && (
          p.name.toLowerCase().startsWith(lowercasePartial) ||
          p.code.toLowerCase().startsWith(lowercasePartial)
        )
      )
      .slice(0, limit);
  }

  // Calcular valor total
  public calculateTotalValue(products: { productId: string; quantity: number }[]): number {
    return products.reduce((total, item) => {
      const product = this.getProductById(item.productId);
      return total + (product ? product.unitValue * item.quantity : 0);
    }, 0);
  }

  // Calcular peso total
  public calculateTotalWeight(products: { productId: string; quantity: number }[]): number {
    return products.reduce((total, item) => {
      const product = this.getProductById(item.productId);
      return total + (product ? product.weight * item.quantity : 0);
    }, 0);
  }

  // Exportar productos para manifest
  public exportForManifest(productIds: string[]): Array<{
    code: string;
    description: string;
    hsCode: string;
    unitValue: number;
    weight: number;
    isFragile: boolean;
    requiresLicense: boolean;
  }> {
    return productIds
      .map(id => this.getProductById(id))
      .filter((p): p is Product => p !== null)
      .map(product => ({
        code: product.code,
        description: product.description,
        hsCode: product.hsCode,
        unitValue: product.unitValue,
        weight: product.weight,
        isFragile: product.isFragile,
        requiresLicense: product.requiresLicense
      }));
  }
}

// Instancia singleton
export const productsService = ProductsService.getInstance();

// Funciones de utilidad
export const formatCurrency = (amount: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency
  }).format(amount);
};

export const formatWeight = (weight: number): string => {
  return `${weight.toFixed(2)} kg`;
};

export const formatDimensions = (dimensions: { length: number; width: number; height: number }): string => {
  return `${dimensions.length} x ${dimensions.width} x ${dimensions.height} cm`;
};

export default productsService;