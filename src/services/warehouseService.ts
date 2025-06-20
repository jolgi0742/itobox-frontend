// src/services/warehouseService.ts - Servicio Operativo WHR COMPLETO

// ✅ INTERFACES PARA MÓDULO OPERATIVO
export interface WHRPackage {
  id: string;
  whrNumber: string;
  trackingNumber: string;
  arrivalDate: string;
  classification: 'pending' | 'awb' | 'bl';
  emailSent: boolean;
  status: string;
  carrier: string;
  receivedBy: string;
  
  // Información del Consignee
  consignee: {
    name: string;
    company?: string;
    address: string;
    phone?: string;
    email?: string;
  };
  
  // Información del Shipper
  shipper: {
    name: string;
    company?: string;
    address?: string;
    phone?: string;
  };
  
  // Detalles del paquete
  content: string;
  pieces: number;
  weight: number;
  length: number;
  width: number;
  height: number;
  volume: number;
  volumeWeight: number;
  declaredValue: number;
  
  // Información comercial
  invoiceNumber?: string;
  poNumber?: string;
  departureDate?: string;
  transport: 'air' | 'sea';
  estimatedArrivalCR?: string;
  notes?: string;
}

export interface WHRCreateData {
  trackingNumber: string;
  receivedBy: string;
  carrier: string;
  
  // Shipper info
  shipperName: string;
  shipperCompany?: string;
  shipperAddress?: string;
  shipperPhone?: string;
  
  // Consignee info
  consigneeName: string;
  consigneeCompany?: string;
  consigneeAddress?: string;
  consigneePhone?: string;
  consigneeEmail?: string;
  
  // Package info
  content: string;
  pieces: number;
  weight: number;
  length: number;
  width: number;
  height: number;
  declaredValue: number;
  
  // Commercial info
  invoiceNumber?: string;
  poNumber?: string;
  departureDate?: string;
  transport: 'air' | 'sea';
  estimatedArrivalCR?: string;
  notes?: string;
}

export interface WHRStats {
  total: number;
  pending: number;
  awb: number;
  bl: number;
  emails_pending: number;
  in_miami: number;
  by_air: number;
  by_sea: number;
  total_pieces: number;
  avg_weight: number;
  avg_volume: number;
  total_value: number;
  next_whr_number: string;
  last_whr_created?: string;
}

export interface WHRFilters {
  search?: string;
  classification?: 'pending' | 'awb' | 'bl';
  emailSent?: boolean;
}

export interface WHRResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// ✅ CLASE DE SERVICIO OPERATIVO WHR
export class OperativeWarehouseService {
  private static readonly BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
  
  // ✅ CREAR WHR
  static async createWHR(whrData: WHRCreateData): Promise<WHRPackage> {
    try {
      console.log('🔄 Servicio Operativo: Enviando datos a backend:', whrData);
      
      const response = await fetch(`${this.BASE_URL}/api/warehouse/whr`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(whrData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        console.log('✅ Servicio Operativo: WHR creado exitosamente:', result.data.whr);
        return result.data.whr;
      } else {
        throw new Error(result.message || 'Error creando WHR');
      }
    } catch (error) {
      console.error('❌ Error en createWHR:', error);
      throw error;
    }
  }
  
  // ✅ OBTENER LISTA DE WHRs
  static async getWHRList(filters?: WHRFilters): Promise<WHRResponse<{ whrList: WHRPackage[] }>> {
    try {
      const params = new URLSearchParams();
      if (filters?.search) params.append('search', filters.search);
      if (filters?.classification) params.append('classification', filters.classification);
      if (filters?.emailSent !== undefined) params.append('emailSent', filters.emailSent.toString());
      
      const url = `${this.BASE_URL}/api/warehouse/whr${params.toString() ? `?${params.toString()}` : ''}`;
      console.log('🔄 Servicio Operativo: Obteniendo WHRs desde:', url);
      
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        console.log('✅ Servicio Operativo: WHRs obtenidos:', result.data.whrList?.length || 0);
        return result;
      } else {
        return {
          success: false,
          message: result.message || 'Error obteniendo WHRs',
          data: { whrList: [] }
        };
      }
    } catch (error) {
      console.error('❌ Error en getWHRList:', error);
      return {
        success: false,
        message: 'Error de conexión con el servidor',
        data: { whrList: [] }
      };
    }
  }
  
  // ✅ OBTENER ESTADÍSTICAS
  static async getWHRStats(days: number = 30): Promise<WHRResponse<{ stats: WHRStats }>> {
    try {
      const response = await fetch(`${this.BASE_URL}/api/warehouse/stats?days=${days}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        console.log('✅ Servicio Operativo: Estadísticas obtenidas:', result.data.stats);
        return result;
      } else {
        throw new Error(result.message || 'Error obteniendo estadísticas');
      }
    } catch (error) {
      console.error('❌ Error en getWHRStats:', error);
      throw error;
    }
  }
  
  // ✅ CLASIFICAR WHR (AWB/BL)
  static async classifyWHR(whrId: string, classification: 'awb' | 'bl'): Promise<WHRPackage> {
    try {
      console.log(`🔄 Servicio Operativo: Clasificando WHR ${whrId} como ${classification}`);
      
      const response = await fetch(`${this.BASE_URL}/api/warehouse/whr/${whrId}/classify`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ classification })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        console.log('✅ Servicio Operativo: WHR clasificado exitosamente:', result.data.whr);
        return result.data.whr;
      } else {
        throw new Error(result.message || 'Error clasificando WHR');
      }
    } catch (error) {
      console.error('❌ Error en classifyWHR:', error);
      throw error;
    }
  }
  
  // ✅ ENVIAR EMAIL WHR
  static async sendWHREmail(whrId: string): Promise<WHRResponse<{ whr: WHRPackage }>> {
    try {
      console.log(`🔄 Servicio Operativo: Enviando email para WHR ${whrId}`);
      
      const response = await fetch(`${this.BASE_URL}/api/warehouse/whr/${whrId}/email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        console.log('✅ Servicio Operativo: Email enviado exitosamente:', result.data.whr);
        return result;
      } else {
        throw new Error(result.message || 'Error enviando email');
      }
    } catch (error) {
      console.error('❌ Error en sendWHREmail:', error);
      throw error;
    }
  }
  
  // ✅ ELIMINAR WHR
  static async deleteWHR(whrId: string): Promise<boolean> {
    try {
      console.log(`🔄 Servicio Operativo: Eliminando WHR ${whrId}`);
      
      const response = await fetch(`${this.BASE_URL}/api/warehouse/whr/${whrId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        console.log('✅ Servicio Operativo: WHR eliminado exitosamente');
        return true;
      } else {
        throw new Error(result.message || 'Error eliminando WHR');
      }
    } catch (error) {
      console.error('❌ Error en deleteWHR:', error);
      throw error;
    }
  }
  
  // ✅ CÁLCULOS ESPECÍFICOS DEL MÓDULO OPERATIVO
  static calculateCAMCAMetrics(length: number, width: number, height: number) {
    // Fórmula específica para Módulo Operativo WHR
    const volume = (length * width * height) * 0.000578746; // ft³
    const volumeWeight = volume * 10.4; // vlb (peso volumétrico)
    
    return {
      volume: parseFloat(volume.toFixed(4)),
      volumeWeight: parseFloat(volumeWeight.toFixed(2))
    };
  }
  
  // ✅ GENERAR NÚMERO WHR
  static generateWHRNumber(): string {
    const now = new Date();
    const year = now.getFullYear().toString().slice(-2);
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    
    // Generar secuencia de 4 dígitos (aquí podrías usar un contador real)
    const sequence = Math.floor(Math.random() * 9999).toString().padStart(4, '0');
    
    return `WHR${year}${month}${day}${sequence}`;
  }
  
  // ✅ VALIDAR DATOS WHR
  static validateWHRData(data: WHRCreateData): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    // Validaciones requeridas
    if (!data.trackingNumber?.trim()) {
      errors.push('Tracking Number es requerido');
    }
    
    if (!data.consigneeName?.trim()) {
      errors.push('Nombre del Consignee es requerido');
    }
    
    if (!data.content?.trim()) {
      errors.push('Descripción del contenido es requerida');
    }
    
    if (!data.weight || data.weight <= 0) {
      errors.push('Peso debe ser mayor a 0');
    }
    
    if (!data.pieces || data.pieces <= 0) {
      errors.push('Número de piezas debe ser mayor a 0');
    }
    
    // Validación de email si se proporciona
    if (data.consigneeEmail && !this.isValidEmail(data.consigneeEmail)) {
      errors.push('Email del Consignee no es válido');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
  
  // ✅ VALIDAR EMAIL
  private static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  
  // ✅ FORMATEAR DATOS PARA DISPLAY
  static formatWHRForDisplay(whr: WHRPackage): any {
    return {
      ...whr,
      formattedWeight: `${whr.weight} lb`,
      formattedVolume: `${whr.volume.toFixed(2)} ft³`,
      formattedVolumeWeight: `${whr.volumeWeight.toFixed(2)} vlb`,
      formattedValue: `$${whr.declaredValue.toFixed(2)}`,
      formattedArrivalDate: new Date(whr.arrivalDate).toLocaleDateString('es-ES'),
      classificationText: this.getClassificationText(whr.classification),
      statusColor: this.getStatusColor(whr.classification)
    };
  }
  
  // ✅ OBTENER TEXTO DE CLASIFICACIÓN
  private static getClassificationText(classification: string): string {
    switch (classification) {
      case 'pending': return 'Pendiente de Clasificación';
      case 'awb': return 'AWB (Aéreo)';
      case 'bl': return 'BL (Marítimo)';
      default: return 'Desconocido';
    }
  }
  
  // ✅ OBTENER COLOR DE ESTADO
  private static getStatusColor(classification: string): string {
    switch (classification) {
      case 'pending': return '#f59e0b';
      case 'awb': return '#3b82f6';
      case 'bl': return '#0ea5e9';
      default: return '#6b7280';
    }
  }
  
  // ✅ HEALTH CHECK DEL SERVICIO
  static async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${this.BASE_URL}/api/warehouse/health`);
      return response.ok;
    } catch (error) {
      console.error('❌ Health check failed:', error);
      return false;
    }
  }
  
  // ✅ OBTENER CONFIGURACIÓN DEL MÓDULO OPERATIVO
  static getOperativeConfig() {
    return {
      company: {
        name: 'PREMIER GLOBAL USA CORP',
        address: '8548 NW 72ND ST., MIAMI, FL 33166',
        phone: '+1 (305) 555-0123',
        email: 'operations@premierglobal.com'
      },
      whrConfig: {
        volumeFormula: '(L × W × H) × 0.000578746 = ft³',
        volumeWeightFormula: 'Volume ft³ × 10.4 = vlb',
        defaultTransport: 'air',
        estimatedDeliveryDays: {
          air: '2-3 días',
          sea: '12-15 días'
        }
      },
      notifications: {
        emailEnabled: true,
        smsEnabled: false,
        autoNotifyOnArrival: true,
        autoNotifyOnClassification: true
      }
    };
  }
  
  // ✅ EXPORTAR DATOS PARA REPORTES
  static async exportWHRData(format: 'csv' | 'excel' | 'pdf' = 'csv', filters?: WHRFilters): Promise<Blob> {
    try {
      const params = new URLSearchParams();
      if (filters?.search) params.append('search', filters.search);
      if (filters?.classification) params.append('classification', filters.classification);
      params.append('format', format);
      
      const response = await fetch(`${this.BASE_URL}/api/warehouse/export?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.blob();
    } catch (error) {
      console.error('❌ Error en exportWHRData:', error);
      throw error;
    }
  }
  
  // ✅ BUSCAR WHR POR TRACKING
  static async searchByTracking(trackingNumber: string): Promise<WHRPackage | null> {
    try {
      const response = await fetch(`${this.BASE_URL}/api/warehouse/search/${trackingNumber}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      return result.success ? result.data.whr : null;
    } catch (error) {
      console.error('❌ Error en searchByTracking:', error);
      return null;
    }
  }
  
  // ✅ ACTUALIZAR WHR
  static async updateWHR(whrId: string, updateData: Partial<WHRCreateData>): Promise<WHRPackage> {
    try {
      console.log(`🔄 Servicio Operativo: Actualizando WHR ${whrId}`);
      
      const response = await fetch(`${this.BASE_URL}/api/warehouse/whr/${whrId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        console.log('✅ Servicio Operativo: WHR actualizado exitosamente:', result.data.whr);
        return result.data.whr;
      } else {
        throw new Error(result.message || 'Error actualizando WHR');
      }
    } catch (error) {
      console.error('❌ Error en updateWHR:', error);
      throw error;
    }
  }
  
  // ✅ OBTENER WHR POR ID
  static async getWHRById(whrId: string): Promise<WHRPackage | null> {
    try {
      const response = await fetch(`${this.BASE_URL}/api/warehouse/whr/${whrId}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      return result.success ? result.data.whr : null;
    } catch (error) {
      console.error('❌ Error en getWHRById:', error);
      return null;
    }
  }
  
  // ✅ CREAR MÚLTIPLES WHRs
  static async createBulkWHRs(whrDataList: WHRCreateData[]): Promise<WHRPackage[]> {
    try {
      console.log(`🔄 Servicio Operativo: Creando ${whrDataList.length} WHRs en lote`);
      
      const response = await fetch(`${this.BASE_URL}/api/warehouse/whr/bulk`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ whrList: whrDataList })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        console.log('✅ Servicio Operativo: WHRs creados en lote exitosamente:', result.data.whrList);
        return result.data.whrList;
      } else {
        throw new Error(result.message || 'Error creando WHRs en lote');
      }
    } catch (error) {
      console.error('❌ Error en createBulkWHRs:', error);
      throw error;
    }
  }
  
  // ✅ OBTENER REPORTES DETALLADOS
  static async getDetailedReport(period: 'week' | 'month' | 'quarter' | 'year' = 'month'): Promise<any> {
    try {
      const response = await fetch(`${this.BASE_URL}/api/warehouse/reports/detailed?period=${period}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      return result.success ? result.data : null;
    } catch (error) {
      console.error('❌ Error en getDetailedReport:', error);
      throw error;
    }
  }
  
  // ✅ OBTENER HISTORIAL DE ACTIVIDADES
  static async getActivityHistory(whrId?: string, limit: number = 50): Promise<any[]> {
    try {
      const params = new URLSearchParams();
      if (whrId) params.append('whrId', whrId);
      params.append('limit', limit.toString());
      
      const response = await fetch(`${this.BASE_URL}/api/warehouse/activity?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      return result.success ? result.data.activities : [];
    } catch (error) {
      console.error('❌ Error en getActivityHistory:', error);
      return [];
    }
  }
  
  // ✅ CONFIGURAR NOTIFICACIONES AUTOMÁTICAS
  static async configureNotifications(config: {
    emailOnArrival: boolean;
    emailOnClassification: boolean;
    emailOnDelivery: boolean;
    smsEnabled: boolean;
    webhookUrl?: string;
  }): Promise<boolean> {
    try {
      const response = await fetch(`${this.BASE_URL}/api/warehouse/notifications/config`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result.success;
    } catch (error) {
      console.error('❌ Error en configureNotifications:', error);
      return false;
    }
  }
  
  // ✅ CALCULAR TARIFAS ESTIMADAS
  static calculateEstimatedRates(weight: number, volume: number, destination: string, transport: 'air' | 'sea'): any {
    const baseRates = {
      air: {
        'Costa Rica': 4.50,
        'Venezuela': 5.20,
        'Colombia': 4.80,
        'Panama': 3.90,
        'Other': 6.00
      },
      sea: {
        'Costa Rica': 2.10,
        'Venezuela': 2.80,
        'Colombia': 2.50,
        'Panama': 1.90,
        'Other': 3.20
      }
    };
    
    const rate = baseRates[transport][destination as keyof typeof baseRates.air] || baseRates[transport]['Other'];
    const chargeableWeight = Math.max(weight, volume * 10.4);
    const subtotal = chargeableWeight * rate;
    const insurance = subtotal * 0.01; // 1%
    const handling = 50; // Tarifa fija de manejo
    const total = subtotal + insurance + handling;
    
    return {
      chargeableWeight,
      rate,
      subtotal: parseFloat(subtotal.toFixed(2)),
      insurance: parseFloat(insurance.toFixed(2)),
      handling,
      total: parseFloat(total.toFixed(2)),
      estimatedDelivery: transport === 'air' ? '2-3 días' : '12-15 días'
    };
  }
  
  // ✅ HELPERS PARA FECHAS
  static formatDate(date: string | Date): string {
    const d = new Date(date);
    return d.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  }
  
  static formatDateTime(date: string | Date): string {
    const d = new Date(date);
    return d.toLocaleString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
  
  // ✅ HELPERS PARA NÚMEROS
  static formatCurrency(amount: number, currency: string = 'USD'): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  }
  
  static formatWeight(weight: number): string {
    return `${weight.toFixed(2)} lb`;
  }
  
  static formatVolume(volume: number): string {
    return `${volume.toFixed(4)} ft³`;
  }
}