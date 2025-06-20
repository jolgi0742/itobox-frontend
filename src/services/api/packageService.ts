// src/services/api/packageService.ts
import { apiClient } from './apiClient';
import { Package, PackageFilters, PaginatedResponse } from '../../types';

export const packageService = {
  async getPackages(filters: PackageFilters & { page?: number; pageSize?: number } = {}) {
    try {
      // Por ahora retorna datos mock
      const mockPackages: Package[] = [
        {
          id: '1',
          trackingNumber: 'ITB001234567',
          clientId: 'client-1',
          status: 'in_transit',
          origin: 'Miami, FL',
          destination: 'San José, CR',
          weight: 2.5,
          value: 150.00,
          description: 'Electrónicos',
          courier: 'DHL',
          createdAt: new Date('2024-12-01'),
          updatedAt: new Date('2024-12-05'),
          estimatedDelivery: new Date('2024-12-10')
        },
        {
          id: '2',
          trackingNumber: 'ITB001234568',
          clientId: 'client-2',
          status: 'delivered',
          origin: 'Miami, FL',
          destination: 'Cartago, CR',
          weight: 1.2,
          value: 85.00,
          description: 'Ropa',
          courier: 'FedEx',
          createdAt: new Date('2024-11-25'),
          updatedAt: new Date('2024-12-02'),
          estimatedDelivery: new Date('2024-12-01'),
          actualDelivery: new Date('2024-12-02')
        }
      ];

      // Simular filtrado
      let filteredPackages = mockPackages;
      
      if (filters.status) {
        filteredPackages = filteredPackages.filter(pkg => pkg.status === filters.status);
      }
      
      if (filters.search) {
        filteredPackages = filteredPackages.filter(pkg => 
          pkg.trackingNumber.toLowerCase().includes(filters.search!.toLowerCase()) ||
          pkg.description.toLowerCase().includes(filters.search!.toLowerCase())
        );
      }

      // Simular paginación
      const page = filters.page || 1;
      const pageSize = filters.pageSize || 10;
      const totalItems = filteredPackages.length;
      const totalPages = Math.ceil(totalItems / pageSize);
      
      const paginatedData = filteredPackages.slice(
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
      console.error('Error getting packages:', error);
      throw error;
    }
  },

  async getPackageById(id: string): Promise<Package> {
    try {
      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const mockPackage: Package = {
        id,
        trackingNumber: 'ITB001234567',
        clientId: 'client-1',
        status: 'in_transit',
        origin: 'Miami, FL',
        destination: 'San José, CR',
        weight: 2.5,
        value: 150.00,
        description: 'Electrónicos',
        courier: 'DHL',
        createdAt: new Date('2024-12-01'),
        updatedAt: new Date('2024-12-05'),
        estimatedDelivery: new Date('2024-12-10')
      };

      return mockPackage;
    } catch (error) {
      console.error('Error getting package:', error);
      throw error;
    }
  },

  async createPackage(packageData: Partial<Package>): Promise<Package> {
    try {
      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newPackage: Package = {
        id: Math.random().toString(36).substr(2, 9),
        trackingNumber: 'ITB' + Math.random().toString(36).substr(2, 9).toUpperCase(),
        clientId: packageData.clientId || 'client-1',
        status: 'pending',
        origin: packageData.origin || 'Miami, FL',
        destination: packageData.destination || 'San José, CR',
        weight: packageData.weight || 0,
        value: packageData.value || 0,
        description: packageData.description || '',
        courier: packageData.courier || 'DHL',
        createdAt: new Date(),
        updatedAt: new Date(),
        ...packageData
      };

      return newPackage;
    } catch (error) {
      console.error('Error creating package:', error);
      throw error;
    }
  },

  async updatePackage(id: string, updates: Partial<Package>): Promise<Package> {
    try {
      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const existingPackage = await this.getPackageById(id);
      const updatedPackage: Package = {
        ...existingPackage,
        ...updates,
        updatedAt: new Date()
      };

      return updatedPackage;
    } catch (error) {
      console.error('Error updating package:', error);
      throw error;
    }
  },

  async deletePackage(id: string): Promise<void> {
    try {
      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 500));
      console.log('Package deleted:', id);
    } catch (error) {
      console.error('Error deleting package:', error);
      throw error;
    }
  },

  async updatePackageStatus(id: string, status: Package['status']): Promise<Package> {
    try {
      return await this.updatePackage(id, { status });
    } catch (error) {
      console.error('Error updating package status:', error);
      throw error;
    }
  }
};

export default packageService;