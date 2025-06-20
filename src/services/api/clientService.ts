// src/services/api/clientService.ts
import { apiClient } from './apiClient';
import { Client, PaginatedResponse } from '../../types';

export const clientService = {
  async getClients(params: {
    page?: number;
    pageSize?: number;
    search?: string;
    status?: string;
  } = {}) {
    try {
      // Datos mock de clientes
      const mockClients: Client[] = [
        {
          id: '1',
          customerCode: 'CLI-001',
          contactPerson: 'Juan Pérez',
          phone: '+506 8888-8888',
          email: 'juan@empresa.com',
          companyName: 'Empresa S.A.',
          address: {
            street: 'Calle Central 123',
            city: 'San José',
            state: 'San José',
            zipCode: '10101',
            country: 'Costa Rica'
          },
          status: 'active',
          creditLimit: 5000,
          currentBalance: 1250,
          totalPackages: 45,
          totalSpent: 12500,
          lastActivity: new Date('2024-12-05'),
          createdAt: new Date('2024-01-15'),
          updatedAt: new Date('2024-12-05')
        },
        {
          id: '2',
          customerCode: 'CLI-002',
          contactPerson: 'María González',
          phone: '+506 7777-7777',
          email: 'maria@tienda.com',
          companyName: 'Tienda Online',
          address: {
            street: 'Avenida Segunda 456',
            city: 'Cartago',
            state: 'Cartago',
            zipCode: '30101',
            country: 'Costa Rica'
          },
          status: 'active',
          creditLimit: 3000,
          currentBalance: 875,
          totalPackages: 32,
          totalSpent: 8900,
          lastActivity: new Date('2024-12-03'),
          createdAt: new Date('2024-02-20'),
          updatedAt: new Date('2024-12-03')
        }
      ];

      // Simular filtrado
      let filteredClients = mockClients;
      
      if (params.search) {
        const search = params.search.toLowerCase();
        filteredClients = filteredClients.filter(client => 
          client.contactPerson.toLowerCase().includes(search) ||
          client.email.toLowerCase().includes(search) ||
          client.customerCode.toLowerCase().includes(search) ||
          (client.companyName && client.companyName.toLowerCase().includes(search))
        );
      }
      
      if (params.status) {
        filteredClients = filteredClients.filter(client => client.status === params.status);
      }

      // Simular paginación
      const page = params.page || 1;
      const pageSize = params.pageSize || 10;
      const totalItems = filteredClients.length;
      const totalPages = Math.ceil(totalItems / pageSize);
      
      const paginatedData = filteredClients.slice(
        (page - 1) * pageSize,
        page * pageSize
      );

      return {
        data: paginatedData,
        pagination: {
          page,
          totalItems,
          totalPages,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1
        }
      };
    } catch (error) {
      console.error('Error getting clients:', error);
      throw error;
    }
  },

  async getClientById(id: string): Promise<Client> {
    try {
      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const mockClient: Client = {
        id,
        customerCode: 'CLI-001',
        contactPerson: 'Juan Pérez',
        phone: '+506 8888-8888',
        email: 'juan@empresa.com',
        companyName: 'Empresa S.A.',
        address: {
          street: 'Calle Central 123',
          city: 'San José',
          state: 'San José',
          zipCode: '10101',
          country: 'Costa Rica'
        },
        status: 'active',
        creditLimit: 5000,
        currentBalance: 1250,
        totalPackages: 45,
        totalSpent: 12500,
        lastActivity: new Date('2024-12-05'),
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-12-05')
      };

      return mockClient;
    } catch (error) {
      console.error('Error getting client:', error);
      throw error;
    }
  },

  async createClient(clientData: Partial<Client>): Promise<Client> {
    try {
      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newClient: Client = {
        id: Math.random().toString(36).substr(2, 9),
        customerCode: clientData.customerCode || 'CLI-' + Math.random().toString(36).substr(2, 6).toUpperCase(),
        contactPerson: clientData.contactPerson || '',
        phone: clientData.phone || '',
        email: clientData.email || '',
        companyName: clientData.companyName,
        address: clientData.address || {
          street: '',
          city: '',
          state: '',
          zipCode: '',
          country: 'Costa Rica'
        },
        status: 'active',
        creditLimit: clientData.creditLimit || 0,
        currentBalance: 0,
        totalPackages: 0,
        totalSpent: 0,
        lastActivity: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      };

      return newClient;
    } catch (error) {
      console.error('Error creating client:', error);
      throw error;
    }
  },

  async updateClient(id: string, updates: Partial<Client>): Promise<Client> {
    try {
      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const existingClient = await this.getClientById(id);
      const updatedClient: Client = {
        ...existingClient,
        ...updates,
        updatedAt: new Date()
      };

      return updatedClient;
    } catch (error) {
      console.error('Error updating client:', error);
      throw error;
    }
  },

  async deleteClient(id: string): Promise<void> {
    try {
      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 500));
      console.log('Client deleted:', id);
    } catch (error) {
      console.error('Error deleting client:', error);
      throw error;
    }
  }
};

export default clientService;