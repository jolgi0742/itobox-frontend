// src/services/warehouseService.ts
// ITOBOX Courier - WAREHOUSE-USA Edition - Production Ready

export interface WHRPackage {
  id: string;
  whrNumber: string;
  invoiceNumber: string;
  poNumber: string;
  carrier: string;
  partida: string;
  shipperName: string;
  shipperAddress: string;
  consigneeName: string;
  consigneeAddress: string;
  pieces: number;
  weight: number;
  length: number;
  width: number;
  height: number;
  unitValue: number;
  totalValue: number;
  volume: number;
  volumeWeight: number;
  description: string;
  status: 'pending' | 'classified' | 'email_sent';
  classification: 'aereo' | 'maritimo' | null;
  estimatedArrivalCR: string;
  emailSent: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface WHRCreateData {
  invoiceNumber: string;
  poNumber: string;
  carrier: string;
  partida: string;
  shipperName: string;
  shipperAddress: string;
  consigneeName: string;
  consigneeAddress: string;
  pieces: number;
  weight: number;
  length: number;
  width: number;
  height: number;
  unitValue: number;
  description: string;
}

export interface WHRStats {
  totalWHRs: number;
  totalWeight: number;
  totalValue: number;
  totalPieces: number;
  byClassification: {
    aereo: number;
    maritimo: number;
    pending: number;
  };
  emailSentRate: number;
  classificationRate: number;
}

// Configuración de API - PRODUCCIÓN
const getApiUrl = (): string => {
  // Detectar entorno
  const isProduction = window.location.hostname !== 'localhost';
  
  if (isProduction) {
    // URL de producción - Backend en Render
    return 'https://itobox-backend.onrender.com/api';
  } else {
    // URL de desarrollo - Backend local
    return 'http://localhost:5000/api';
  }
};

const API_BASE_URL = getApiUrl();

console.log(`🌐 WAREHOUSE-USA API URL: ${API_BASE_URL}`);

export class OperativeWarehouseService {
  private static instance: OperativeWarehouseService;
  private baseUrl: string;

  private constructor() {
    this.baseUrl = `${API_BASE_URL}/warehouse`;
    console.log(`🏭 OperativeWarehouseService initialized: ${this.baseUrl}`);
  }

  public static getInstance(): OperativeWarehouseService {
    if (!OperativeWarehouseService.instance) {
      OperativeWarehouseService.instance = new OperativeWarehouseService();
    }
    return OperativeWarehouseService.instance;
  }

  // Crear nuevo WHR
  async createWHR(data: WHRCreateData): Promise<WHRPackage> {
    try {
      console.log('📦 Creating WHR with data:', data);
      
      const response = await fetch(`${this.baseUrl}/whr`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        throw new Error(`HTTP ${response.status}: ${errorData.message || 'Failed to create WHR'}`);
      }

      const result = await response.json();
      console.log('✅ WHR created successfully:', result.data);
      return result.data;
    } catch (error) {
      console.error('❌ Error creating WHR:', error);
      throw error;
    }
  }

  // Obtener todos los WHRs
  async getWHRs(limit: number = 50, search?: string): Promise<WHRPackage[]> {
    try {
      const params = new URLSearchParams();
      params.append('limit', limit.toString());
      if (search) {
        params.append('search', search);
      }

      const response = await fetch(`${this.baseUrl}/whr?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Failed to fetch WHRs`);
      }

      const result = await response.json();
      console.log(`📋 Retrieved ${result.data?.length || 0} WHRs`);
      return result.data || [];
    } catch (error) {
      console.error('❌ Error fetching WHRs:', error);
      return [];
    }
  }

  // Obtener estadísticas
  async getStats(): Promise<WHRStats> {
    try {
      const response = await fetch(`${this.baseUrl}/stats`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Failed to fetch stats`);
      }

      const result = await response.json();
      console.log('📊 Stats retrieved:', result.data);
      return result.data;
    } catch (error) {
      console.error('❌ Error fetching stats:', error);
      // Retornar stats por defecto en caso de error
      return {
        totalWHRs: 0,
        totalWeight: 0,
        totalValue: 0,
        totalPieces: 0,
        byClassification: {
          aereo: 0,
          maritimo: 0,
          pending: 0
        },
        emailSentRate: 0,
        classificationRate: 0
      };
    }
  }

  // Clasificar WHR (Aéreo/Marítimo)
  async classifyWHR(id: string, classification: 'aereo' | 'maritimo'): Promise<WHRPackage> {
    try {
      console.log(`🏷️ Classifying WHR ${id} as ${classification}`);
      
      const response = await fetch(`${this.baseUrl}/whr/${id}/classify`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ classification }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        throw new Error(`HTTP ${response.status}: ${errorData.message || 'Failed to classify WHR'}`);
      }

      const result = await response.json();
      console.log('✅ WHR classified successfully:', result.data);
      return result.data;
    } catch (error) {
      console.error('❌ Error classifying WHR:', error);
      throw error;
    }
  }

  // Enviar notificación por email
  async sendEmailNotification(id: string): Promise<WHRPackage> {
    try {
      console.log(`📧 Sending email notification for WHR ${id}`);
      
      const response = await fetch(`${this.baseUrl}/whr/${id}/email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        throw new Error(`HTTP ${response.status}: ${errorData.message || 'Failed to send email'}`);
      }

      const result = await response.json();
      console.log('✅ Email sent successfully:', result.data);
      return result.data;
    } catch (error) {
      console.error('❌ Error sending email:', error);
      throw error;
    }
  }

  // Eliminar WHR
  async deleteWHR(id: string): Promise<boolean> {
    try {
      console.log(`🗑️ Deleting WHR ${id}`);
      
      const response = await fetch(`${this.baseUrl}/whr/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        throw new Error(`HTTP ${response.status}: ${errorData.message || 'Failed to delete WHR'}`);
      }

      console.log('✅ WHR deleted successfully');
      return true;
    } catch (error) {
      console.error('❌ Error deleting WHR:', error);
      throw error;
    }
  }

  // Test de conexión
  async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/health`);
      const result = await response.json();
      
      if (response.ok && result.success) {
        console.log('✅ Warehouse service connection OK:', result.data);
        return true;
      } else {
        console.warn('⚠️ Warehouse service connection failed:', result);
        return false;
      }
    } catch (error) {
      console.error('❌ Warehouse service connection error:', error);
      return false;
    }
  }
}

// Funciones de utilidad para cálculos WAREHOUSE-USA
export const calculateVolume = (length: number, width: number, height: number): number => {
  return (length * width * height) * 0.000578746; // Conversión a pies cúbicos
};

export const calculateVolumeWeight = (volume: number): number => {
  return volume * 10.4; // Factor de conversión estándar
};

export const generateWHRNumber = (): string => {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  
  return `WHR${year}${month}${day}${random}`;
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

export const formatWeight = (weight: number): string => {
  return `${weight.toFixed(2)} kg`;
};

export const formatVolume = (volume: number): string => {
  return `${volume.toFixed(4)} ft³`;
};

// Instancia singleton
export const warehouseService = OperativeWarehouseService.getInstance();

// Export por defecto
export default warehouseService;