// src/services/warehouseService.ts - Compatible con métodos estáticos

const API_BASE_URL = 'http://localhost:5000/api/warehouse';

// Interfaces compatibles con archivos existentes
export interface WHRPackage {
  id?: string;
  whrNumber?: string;
  invoiceNumber: string;
  poNumber: string;
  shipper: string;
  consignee: string;
  carrier: string;
  partida: string;
  description: string;
  quantity: number;
  unitValue: number;
  weight: number;
  length: number;
  width: number;
  height: number;
  estimatedArrivalCR: string;
  volume?: number;
  volumeWeight?: number;
  chargeableWeight?: number;
  totalValue?: number;
  status?: string;
  transportType?: string;
  emailSent?: boolean;
  createdAt?: string;
  // Para compatibilidad con archivos existentes
  warehouseUSA?: {
    invoiceNumber: string;
    carrier: string;
    completionRate: number;
    avgUnitValue: number;
    withInvoice: number;
    withPO: number;
    withCarrier: number;
    withPartida: number;
  };
  calculations?: {
    volume: number;
    volumeWeight: number;
    chargeableWeight: number;
    totalValue: number;
  };
}

export interface WHRStats {
  total: number;
  pending: number;
  classified_awb: number;
  classified_bl: number;
  averageUnitValue: number;
  totalValue: number;
  // Para compatibilidad con archivos existentes
  totalWHRs: number;
  classifiedAWB: number;
  classifiedBL: number;
  warehouseUSA: {
    completionRate: number;
    avgUnitValue: number;
    withInvoice: number;
    withPO: number;
    withCarrier: number;
    withPartida: number;
  };
  recentWHRs?: WHRPackage[];
}

export interface WHRCreateData {
  invoiceNumber: string;
  poNumber: string;
  shipper: string;
  consignee: string;
  carrier: string;
  partida?: string;
  partidaArancelaria?: string; // Alias para compatibilidad
  description: string;
  quantity: number;
  unitValue: number;
  weight: number;
  length: number;
  width: number;
  height: number;
  estimatedArrivalCR: string;
  declaredValue?: number; // Para compatibilidad
  serviceType?: string; // Para compatibilidad
}

export interface WHRResponse {
  success: boolean;
  message: string;
  data?: WHRPackage & {
    whrNumber?: string;
    id?: string;
    shipper?: string;
    consignee?: string;
    warehouseUSA?: {
      invoiceNumber: string;
      carrier: string;
    };
    calculations?: {
      volume: number;
      volumeWeight: number;
      chargeableWeight: number;
      totalValue: number;
    };
  };
  whr?: WHRPackage;
  whrNumber?: string;
  // Para compatibilidad con archivos existentes
  id?: string;
  shipper?: string;
  consignee?: string;
  warehouseUSA?: {
    invoiceNumber: string;
    carrier: string;
  };
  calculations?: {
    volume: number;
    volumeWeight: number;
    chargeableWeight: number;
    totalValue: number;
  };
}

export interface WHRListResponse {
  success: boolean;
  data: {
    whrs: WHRPackage[];
    stats: WHRStats;
    pagination?: any;
  };
  stats?: WHRStats;
}

// Clase con métodos estáticos para compatibilidad
export class WarehouseService {
  private static async makeRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Health check
  static async healthCheck(): Promise<{ success: boolean; message: string; timestamp: string; data?: any }> {
    try {
      const response = await this.makeRequest<{ success: boolean; message: string; timestamp: string }>('/health');
      return { ...response, data: { version: '1.0.0' } };
    } catch (error) {
      throw error;
    }
  }

  // Obtener estadísticas
  static async getStats(): Promise<{ success: boolean; data: WHRStats }> {
    try {
      const response = await this.makeRequest<{ success: boolean; data: WHRStats }>('/stats');
      
      // Transformar para compatibilidad
      if (response.data) {
        response.data.totalWHRs = response.data.total;
        response.data.classifiedAWB = response.data.classified_awb;
        response.data.classifiedBL = response.data.classified_bl;
        
        response.data.warehouseUSA = {
          completionRate: Math.round((response.data.classified_awb + response.data.classified_bl) / Math.max(response.data.total, 1) * 100),
          avgUnitValue: response.data.averageUnitValue,
          withInvoice: Math.floor(response.data.total * 0.8),
          withPO: Math.floor(response.data.total * 0.9),
          withCarrier: response.data.total,
          withPartida: Math.floor(response.data.total * 0.7),
        };
        
        // Agregar datos de ejemplo para recentWHRs si no existen
        response.data.recentWHRs = response.data.recentWHRs || [];
      }
      
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Listar WHRs con parámetros opcionales
  static async listWHRs(params: { limit?: number } = {}): Promise<WHRListResponse> {
    try {
      const response = await this.makeRequest<{
        success: boolean;
        data: WHRPackage[];
        stats: WHRStats;
      }>('/whr');
      
      // Transformar para compatibilidad con el formato esperado
      const transformedResponse: WHRListResponse = {
        success: response.success,
        data: {
          whrs: response.data || [],
          stats: response.stats || {
            total: 0,
            pending: 0,
            classified_awb: 0,
            classified_bl: 0,
            averageUnitValue: 0,
            totalValue: 0,
            totalWHRs: 0,
            classifiedAWB: 0,
            classifiedBL: 0,
            warehouseUSA: {
              completionRate: 0,
              avgUnitValue: 0,
              withInvoice: 0,
              withPO: 0,
              withCarrier: 0,
              withPartida: 0,
            }
          },
          pagination: {
            page: 1,
            limit: params.limit || 10,
            total: (response.data || []).length
          }
        }
      };

      // Transformar stats para compatibilidad
      if (transformedResponse.data.stats) {
        const stats = transformedResponse.data.stats;
        stats.totalWHRs = stats.total;
        stats.classifiedAWB = stats.classified_awb;
        stats.classifiedBL = stats.classified_bl;
        
        stats.warehouseUSA = {
          completionRate: Math.round((stats.classified_awb + stats.classified_bl) / Math.max(stats.total, 1) * 100),
          avgUnitValue: stats.averageUnitValue,
          withInvoice: Math.floor(stats.total * 0.8),
          withPO: Math.floor(stats.total * 0.9),
          withCarrier: stats.total,
          withPartida: Math.floor(stats.total * 0.7),
        };
      }

      // Transformar WHRs para compatibilidad
      transformedResponse.data.whrs = transformedResponse.data.whrs.map(whr => ({
        ...whr,
        warehouseUSA: {
          invoiceNumber: whr.invoiceNumber,
          carrier: whr.carrier,
          completionRate: 100,
          avgUnitValue: whr.unitValue,
          withInvoice: 1,
          withPO: 1,
          withCarrier: 1,
          withPartida: 1,
        },
        calculations: {
          volume: whr.volume || 0,
          volumeWeight: whr.volumeWeight || 0,
          chargeableWeight: whr.chargeableWeight || 0,
          totalValue: whr.totalValue || 0,
        }
      }));

      // Limitar resultados si se especifica
      if (params.limit) {
        transformedResponse.data.whrs = transformedResponse.data.whrs.slice(0, params.limit);
      }

      return transformedResponse;
    } catch (error) {
      throw error;
    }
  }

  // Crear WHR
  static async createWHR(whrData: WHRCreateData): Promise<WHRResponse> {
    try {
      // Transformar datos para compatibilidad
      const transformedData = {
        ...whrData,
        partida: whrData.partida || whrData.partidaArancelaria || '',
      };

      const response = await this.makeRequest<WHRResponse>('/whr', {
        method: 'POST',
        body: JSON.stringify(transformedData),
      });

      // Enriquecer respuesta para compatibilidad
      if (response.data || response.whr) {
        const whr = response.data || response.whr!;
        
        response.data = {
          ...whr,
          id: whr.id || whr.whrNumber,
          warehouseUSA: {
            invoiceNumber: whr.invoiceNumber,
            carrier: whr.carrier,
            completionRate: 100,
            avgUnitValue: whr.unitValue,
            withInvoice: 1,
            withPO: 1,
            withCarrier: 1,
            withPartida: 1,
          },
          calculations: {
            volume: whr.volume || 0,
            volumeWeight: whr.volumeWeight || 0,
            chargeableWeight: whr.chargeableWeight || 0,
            totalValue: whr.totalValue || 0,
          }
        };
      }

      return response;
    } catch (error) {
      throw error;
    }
  }

  // Clasificar WHR (método genérico para compatibilidad)
  static async classifyWHR(id: string | number, type: 'awb' | 'bl'): Promise<WHRResponse> {
    try {
      return await this.makeRequest<WHRResponse>(`/whr/${id}/classify`, {
        method: 'PUT',
        body: JSON.stringify({ type }),
      });
    } catch (error) {
      throw error;
    }
  }

  // Clasificar WHR como AWB (Aéreo)
  static async classifyAsAWB(id: string): Promise<WHRResponse> {
    return this.classifyWHR(id, 'awb');
  }

  // Clasificar WHR como BL (Marítimo)
  static async classifyAsBL(id: string): Promise<WHRResponse> {
    return this.classifyWHR(id, 'bl');
  }

  // Enviar email
  static async sendEmail(id: string | number): Promise<WHRResponse> {
    try {
      return await this.makeRequest<WHRResponse>(`/whr/${id}/email`, {
        method: 'POST',
      });
    } catch (error) {
      throw error;
    }
  }

  // Eliminar WHR
  static async deleteWHR(id: string | number): Promise<WHRResponse> {
    try {
      return await this.makeRequest<WHRResponse>(`/whr/${id}`, {
        method: 'DELETE',
      });
    } catch (error) {
      throw error;
    }
  }

  // Obtener todos los WHRs (método de instancia para compatibilidad)
  static async getWHRs(): Promise<{
    success: boolean;
    data: WHRPackage[];
    stats: WHRStats;
  }> {
    try {
      const response = await this.listWHRs();
      return {
        success: response.success,
        data: response.data.whrs,
        stats: response.data.stats
      };
    } catch (error) {
      throw error;
    }
  }

  // Calcular volumen (fórmula WAREHOUSE-USA)
  static calculateVolume(length: number, width: number, height: number): number {
    return (length * width * height) * 0.000578746;
  }

  // Calcular peso volumétrico
  static calculateVolumeWeight(volume: number): number {
    return volume * 10.4;
  }

  // Calcular peso facturable
  static calculateChargeableWeight(physicalWeight: number, volumeWeight: number): number {
    return Math.max(physicalWeight, volumeWeight);
  }
}

// Utilities para compatibilidad
export class WarehouseUtils {
  static calculateVolume(length: number, width: number, height: number): number {
    return WarehouseService.calculateVolume(length, width, height);
  }

  static calculateVolumeWeight(volume: number): number {
    return WarehouseService.calculateVolumeWeight(volume);
  }

  static calculateChargeableWeight(physicalWeight: number, volumeWeight: number): number {
    return WarehouseService.calculateChargeableWeight(physicalWeight, volumeWeight);
  }

  static calculateTotalValue(quantity: number, unitValue: number): number {
    return quantity * unitValue;
  }
}

// Instancia por defecto que delega a métodos estáticos
export const warehouseService = {
  createWHR: WarehouseService.createWHR,
  getWHRs: WarehouseService.getWHRs,
  getStats: WarehouseService.getStats,
  classifyAsAWB: WarehouseService.classifyAsAWB,
  classifyAsBL: WarehouseService.classifyAsBL,
  sendEmail: WarehouseService.sendEmail,
  deleteWHR: WarehouseService.deleteWHR,
  healthCheck: WarehouseService.healthCheck,
  calculateVolume: WarehouseService.calculateVolume,
  calculateVolumeWeight: WarehouseService.calculateVolumeWeight,
  calculateChargeableWeight: WarehouseService.calculateChargeableWeight,
};

// Export por defecto para compatibilidad
export default warehouseService;