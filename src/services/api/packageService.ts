// src/services/api/packageService.ts
import { apiClient } from './apiClient';
import { Package, PackageFilters, PaginatedResponse } from '../../types';

export const packageService = {
  async getPackages(filters: PackageFilters & { page?: number; pageSize?: number } = {}) {
    try {
      // Mock data con fechas como strings ISO y todos los campos requeridos
      const mockPackages: Package[] = [
        {
          id: '1',
          trackingNumber: 'ITB240615001',
          senderId: 'sender-1',
          recipientId: 'recipient-1',
          sender: {
            name: 'Juan Pérez',
            email: 'juan@email.com',
            phone: '+506 8888-8888',
            address: 'Calle 1, Casa 123',
            city: 'San José',
            country: 'Costa Rica'
          },
          recipient: {
            name: 'María González',
            email: 'maria@email.com',
            phone: '+506 7777-7777',
            address: 'Avenida 2, Casa 456',
            city: 'Cartago',
            country: 'Costa Rica'
          },
          status: 'in_transit',
          service: 'express',
          weight: 2.5,
          dimensions: { length: 30, width: 20, height: 10 },
          declaredValue: 150.00,
          // CORREGIDO: Campos adicionales y fechas como strings
          clientId: 'client-1',
          origin: 'Miami, FL',
          destination: 'San José, CR',
          value: 150.00,
          description: 'Electrónicos',
          courier: 'DHL',
          createdAt: '2024-12-01T10:00:00Z',
          updatedAt: '2024-12-05T14:30:00Z',
          estimatedDelivery: '2024-12-10T18:00:00Z'
        },
        {
          id: '2',
          trackingNumber: 'ITB240615002',
          senderId: 'sender-2',
          recipientId: 'recipient-2',
          sender: {
            name: 'Carlos Mora',
            email: 'carlos@email.com',
            phone: '+506 6666-6666',
            address: 'Residencial Los Ángeles',
            city: 'Alajuela',
            country: 'Costa Rica'
          },
          recipient: {
            name: 'Ana Vargas',
            email: 'ana@email.com',
            phone: '+506 5555-5555',
            address: 'Centro Comercial Plaza',
            city: 'Heredia',
            country: 'Costa Rica'
          },
          status: 'delivered',
          service: 'standard',
          weight: 1.2,
          dimensions: { length: 25, width: 15, height: 8 },
          declaredValue: 89.99,
          // CORREGIDO: Campos adicionales y fechas como strings
          clientId: 'client-2',
          origin: 'New York, NY',
          destination: 'Heredia, CR',
          value: 89.99,
          description: 'Ropa',
          courier: 'FedEx',
          createdAt: '2024-11-25T09:15:00Z',
          updatedAt: '2024-12-02T16:45:00Z',
          estimatedDelivery: '2024-12-01T12:00:00Z',
          actualDelivery: '2024-12-02T11:30:00Z'
        }
      ];

      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 500));

      let filteredPackages = [...mockPackages];

      // Aplicar filtros
      if (filters.search) {
        filteredPackages = filteredPackages.filter(pkg => 
          pkg.trackingNumber.toLowerCase().includes(filters.search!.toLowerCase()) ||
          (pkg.description && pkg.description.toLowerCase().includes(filters.search!.toLowerCase())) ||
          pkg.sender.name.toLowerCase().includes(filters.search!.toLowerCase()) ||
          pkg.recipient.name.toLowerCase().includes(filters.search!.toLowerCase())
        );
      }

      if (filters.status && filters.status !== 'all') {
        filteredPackages = filteredPackages.filter(pkg => pkg.status === filters.status);
      }

      if (filters.service && filters.service !== 'all') {
        filteredPackages = filteredPackages.filter(pkg => pkg.service === filters.service);
      }

      // Simular paginación
      const page = filters.page || 1;
      const pageSize = filters.pageSize || 10;
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const paginatedPackages = filteredPackages.slice(startIndex, endIndex);

      const response: PaginatedResponse<Package> = {
        success: true,
        data: paginatedPackages,
        pagination: {
          page,
          limit: pageSize,
          total: filteredPackages.length,
          pages: Math.ceil(filteredPackages.length / pageSize)
        }
      };

      return response;
    } catch (error) {
      throw new Error('Error fetching packages');
    }
  },

  async getPackageById(id: string) {
    try {
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 300));

      const mockPackage: Package = {
        id,
        trackingNumber: 'ITB240615001',
        senderId: 'sender-1',
        recipientId: 'recipient-1',
        sender: {
          name: 'Juan Pérez',
          email: 'juan@email.com',
          phone: '+506 8888-8888',
          address: 'Calle 1, Casa 123',
          city: 'San José',
          country: 'Costa Rica'
        },
        recipient: {
          name: 'María González',
          email: 'maria@email.com',
          phone: '+506 7777-7777',
          address: 'Avenida 2, Casa 456',
          city: 'Cartago',
          country: 'Costa Rica'
        },
        status: 'in_transit',
        service: 'express',
        weight: 2.5,
        dimensions: { length: 30, width: 20, height: 10 },
        declaredValue: 150.00,
        // CORREGIDO: Campos adicionales y fechas como strings
        clientId: 'client-1',
        origin: 'Miami, FL',
        destination: 'San José, CR',
        value: 150.00,
        description: 'Electrónicos',
        courier: 'DHL',
        createdAt: '2024-12-01T10:00:00Z',
        updatedAt: '2024-12-05T14:30:00Z',
        estimatedDelivery: '2024-12-10T18:00:00Z'
      };

      return mockPackage;
    } catch (error) {
      throw new Error('Error fetching package');
    }
  },

  async createPackage(packageData: Partial<Package>) {
    try {
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 800));

      const newPackage: Package = {
        id: Math.random().toString(36).substr(2, 9),
        trackingNumber: 'ITB' + Math.random().toString(36).substr(2, 9).toUpperCase(),
        senderId: packageData.senderId || 'sender-new',
        recipientId: packageData.recipientId || 'recipient-new',
        sender: packageData.sender || {
          name: 'Nuevo Remitente',
          email: 'remitente@email.com',
          phone: '+506 0000-0000',
          address: 'Dirección nueva',
          city: 'San José',
          country: 'Costa Rica'
        },
        recipient: packageData.recipient || {
          name: 'Nuevo Destinatario',
          email: 'destinatario@email.com',
          phone: '+506 1111-1111',
          address: 'Dirección destino',
          city: 'Cartago',
          country: 'Costa Rica'
        },
        status: 'pending',
        service: packageData.service || 'standard',
        weight: packageData.weight || 1.0,
        dimensions: packageData.dimensions || { length: 20, width: 15, height: 5 },
        declaredValue: packageData.declaredValue || 100.00,
        // CORREGIDO: Usar campos opcionales correctamente
        clientId: packageData.clientId || 'client-1',
        origin: packageData.origin || 'Miami, FL',
        destination: packageData.destination || 'San José, CR',
        value: packageData.value || packageData.declaredValue || 100.00,
        description: packageData.description || 'Paquete genérico',
        courier: packageData.courier || 'DHL',
        createdAt: new Date().toISOString(), // CORREGIDO: string
        updatedAt: new Date().toISOString(), // CORREGIDO: string
        estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // CORREGIDO: +7 días como string
        deliveryInstructions: packageData.deliveryInstructions,
        specialHandling: packageData.specialHandling,
        pickupDate: packageData.pickupDate,
        actualDelivery: packageData.actualDelivery
      };

      return newPackage;
    } catch (error) {
      throw new Error('Error creating package');
    }
  },

  async updatePackage(id: string, updates: Partial<Package>) {
    try {
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 500));

      // Simular búsqueda del paquete existente
      const existingPackage = await this.getPackageById(id);
      
      const updatedPackage: Package = {
        ...existingPackage,
        ...updates,
        updatedAt: new Date().toISOString() // CORREGIDO: string
      };

      return updatedPackage;
    } catch (error) {
      throw new Error('Error updating package');
    }
  },

  async deletePackage(id: string) {
    try {
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 400));
      
      return { success: true, message: 'Package deleted successfully' };
    } catch (error) {
      throw new Error('Error deleting package');
    }
  },

  async trackPackage(trackingNumber: string) {
    try {
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 600));

      const trackingInfo = {
        trackingNumber,
        status: 'in_transit',
        location: 'Miami Distribution Center',
        estimatedDelivery: '2024-12-10T18:00:00Z',
        events: [
          {
            date: '2024-12-01T10:00:00Z',
            status: 'created',
            location: 'Origin',
            description: 'Package created'
          },
          {
            date: '2024-12-02T14:00:00Z',
            status: 'picked_up',
            location: 'Miami, FL',
            description: 'Package picked up'
          },
          {
            date: '2024-12-05T09:30:00Z',
            status: 'in_transit',
            location: 'Miami Distribution Center',
            description: 'Package in transit'
          }
        ]
      };

      return trackingInfo;
    } catch (error) {
      throw new Error('Error tracking package');
    }
  }
};

export default packageService;