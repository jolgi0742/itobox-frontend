// src/services/api/clientService.ts
import { apiClient } from './apiClient';
import { Client, PaginatedResponse } from '../../types';

interface ClientFilters {
  search?: string;
  status?: 'active' | 'inactive' | 'pending' | 'all';
  type?: 'individual' | 'business' | 'all';
  page?: number;
  pageSize?: number;
}

export const clientService = {
  async getClients(filters: ClientFilters = {}) {
    try {
      // Mock data con todos los campos de la interface Client
      const mockClients: Client[] = [
        {
          id: '1',
          userId: 'user-1',
          type: 'business',
          name: 'Juan Pérez González',
          email: 'juan@empresa.com',
          phone: '+506 8888-8888',
          company: 'Empresa ABC S.A.',
          taxId: '3-101-123456',
          // CAMPOS AGREGADOS para compatibilidad
          customerCode: 'CLI-001',
          contactPerson: 'Juan Pérez',
          companyName: 'Empresa ABC S.A.',
          address: {
            street: 'Avenida Central 123',
            city: 'San José',
            state: 'San José',
            zipCode: '10101',
            country: 'Costa Rica'
          },
          status: 'active',
          creditLimit: 5000.00,
          currentBalance: 1250.75,
          totalPackages: 45,
          totalSpent: 2350.75,
          rating: 4.8,
          joinDate: '2024-01-15',
          lastOrder: '2024-06-14',
          notes: 'Cliente premium con historial excelente',
          createdAt: '2024-01-15T08:00:00Z',
          updatedAt: '2024-06-14T16:30:00Z'
        },
        {
          id: '2',
          userId: 'user-2',
          type: 'business',
          name: 'María González Castro',
          email: 'maria@tienda.com',
          phone: '+506 7777-7777',
          company: 'Tech Solutions CR',
          taxId: '3-101-789012',
          // CAMPOS AGREGADOS para compatibilidad
          customerCode: 'CLI-002',
          contactPerson: 'María González',
          companyName: 'Tech Solutions CR',
          address: {
            street: 'Calle 5, Avenida 8',
            city: 'Cartago',
            state: 'Cartago',
            zipCode: '30101',
            country: 'Costa Rica'
          },
          status: 'active',
          creditLimit: 3000.00,
          currentBalance: 890.50,
          totalPackages: 32,
          totalSpent: 1890.50,
          rating: 4.9,
          joinDate: '2024-02-20',
          lastOrder: '2024-06-15',
          notes: 'Cliente frecuente, siempre puntual en pagos',
          createdAt: '2024-02-20T10:15:00Z',
          updatedAt: '2024-06-15T14:45:00Z'
        }
      ];

      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 500));

      let filteredClients = [...mockClients];

      // Aplicar filtros
      if (filters.search) {
        const search = filters.search.toLowerCase();
        filteredClients = filteredClients.filter(client => 
          (client.contactPerson && client.contactPerson.toLowerCase().includes(search)) ||
          client.email.toLowerCase().includes(search) ||
          (client.customerCode && client.customerCode.toLowerCase().includes(search)) ||
          (client.companyName && client.companyName.toLowerCase().includes(search)) ||
          client.name.toLowerCase().includes(search)
        );
      }
      
      if (filters.status && filters.status !== 'all') {
        filteredClients = filteredClients.filter(client => client.status === filters.status);
      }

      if (filters.type && filters.type !== 'all') {
        filteredClients = filteredClients.filter(client => client.type === filters.type);
      }

      // Simular paginación
      const page = filters.page || 1;
      const pageSize = filters.pageSize || 10;
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const paginatedClients = filteredClients.slice(startIndex, endIndex);

      const response: PaginatedResponse<Client> = {
        success: true,
        data: paginatedClients,
        pagination: {
          page,
          limit: pageSize,
          total: filteredClients.length,
          pages: Math.ceil(filteredClients.length / pageSize)
        }
      };

      return response;
    } catch (error) {
      throw new Error('Error fetching clients');
    }
  },

  async getClientById(id: string) {
    try {
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 300));

      const mockClient: Client = {
        id,
        userId: 'user-1',
        type: 'business',
        name: 'Juan Pérez González',
        email: 'juan@empresa.com',
        phone: '+506 8888-8888',
        company: 'Empresa ABC S.A.',
        taxId: '3-101-123456',
        // CAMPOS AGREGADOS para compatibilidad
        customerCode: 'CLI-001',
        contactPerson: 'Juan Pérez',
        companyName: 'Empresa ABC S.A.',
        address: {
          street: 'Avenida Central 123',
          city: 'San José',
          state: 'San José',
          zipCode: '10101',
          country: 'Costa Rica'
        },
        status: 'active',
        creditLimit: 5000.00,
        currentBalance: 1250.75,
        totalPackages: 45,
        totalSpent: 2350.75,
        rating: 4.8,
        joinDate: '2024-01-15',
        lastOrder: '2024-06-14',
        notes: 'Cliente premium con historial excelente',
        createdAt: '2024-01-15T08:00:00Z',
        updatedAt: '2024-06-14T16:30:00Z'
      };

      return mockClient;
    } catch (error) {
      throw new Error('Error fetching client');
    }
  },

  async createClient(clientData: Partial<Client>) {
    try {
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 800));

      const newClient: Client = {
        id: Math.random().toString(36).substr(2, 9),
        userId: Math.random().toString(36).substr(2, 9),
        type: clientData.type || 'individual',
        name: clientData.name || '',
        email: clientData.email || '',
        phone: clientData.phone || '',
        company: clientData.company,
        taxId: clientData.taxId,
        // CAMPOS CORREGIDOS: usar propiedades opcionales correctamente
        customerCode: clientData.customerCode || 'CLI-' + Math.random().toString(36).substr(2, 6).toUpperCase(),
        contactPerson: clientData.contactPerson || clientData.name || '',
        companyName: clientData.companyName || clientData.company,
        address: clientData.address || {
          street: '',
          city: '',
          state: '',
          country: 'Costa Rica',
          zipCode: ''
        },
        billingAddress: clientData.billingAddress,
        status: 'active',
        creditLimit: 0.00,
        currentBalance: 0.00,
        totalPackages: 0,
        totalSpent: 0.00,
        rating: 5.0,
        joinDate: new Date().toISOString().split('T')[0],
        notes: clientData.notes,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      return newClient;
    } catch (error) {
      throw new Error('Error creating client');
    }
  },

  async updateClient(id: string, updates: Partial<Client>) {
    try {
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 500));

      // Simular búsqueda del cliente existente
      const existingClient = await this.getClientById(id);
      
      const updatedClient: Client = {
        ...existingClient,
        ...updates,
        updatedAt: new Date().toISOString() // CORREGIDO: string en lugar de Date
      };

      return updatedClient;
    } catch (error) {
      throw new Error('Error updating client');
    }
  },

  async deleteClient(id: string) {
    try {
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 400));
      
      return { success: true, message: 'Client deleted successfully' };
    } catch (error) {
      throw new Error('Error deleting client');
    }
  },

  async getClientStats(id?: string) {
    try {
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 300));

      const stats = {
        totalClients: 150,
        activeClients: 142,
        inactiveClients: 5,
        pendingClients: 3,
        totalRevenue: 125750.80,
        averageOrderValue: 485.25,
        topClients: [
          { id: '1', name: 'Juan Pérez González', totalSpent: 2350.75 },
          { id: '2', name: 'María González Castro', totalSpent: 1890.50 }
        ]
      };

      return stats;
    } catch (error) {
      throw new Error('Error fetching client stats');
    }
  },

  async getClientPackages(clientId: string, filters: { page?: number; pageSize?: number } = {}) {
    try {
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 400));

      // Aquí normalmente llamarías al packageService
      // Por ahora retornamos un mock
      const packages = [
        {
          id: '1',
          trackingNumber: 'ITB240615001',
          status: 'in_transit',
          createdAt: '2024-06-15T10:00:00Z',
          estimatedDelivery: '2024-06-17T18:00:00Z'
        }
      ];

      return {
        success: true,
        data: packages,
        pagination: {
          page: filters.page || 1,
          limit: filters.pageSize || 10,
          total: packages.length,
          pages: 1
        }
      };
    } catch (error) {
      throw new Error('Error fetching client packages');
    }
  }
};

export default clientService;