// src/hooks/usePackages.ts
import { useState, useEffect, useCallback } from 'react';
import { Package, PackageFilters, PaginationInfo } from '../types';

export function usePackages() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<PackageFilters>({});
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    pageSize: 10,
    totalItems: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false
  });

  // Datos mock simples
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

  const fetchPackages = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 500));
      
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

      setPackages(filteredPackages);
      setPagination(prev => ({
        ...prev,
        totalItems: filteredPackages.length,
        totalPages: Math.ceil(filteredPackages.length / prev.pageSize)
      }));
    } catch (err: any) {
      console.error('❌ Error obteniendo paquetes:', err);
      setError(err.message || 'Error obteniendo paquetes');
    } finally {
      setIsLoading(false);
    }
  }, [filters, pagination.page, pagination.pageSize]);

  useEffect(() => {
    fetchPackages();
  }, [filters]);

  const createPackage = useCallback(async (packageData: any) => {
    setIsLoading(true);
    setError(null);
    
    try {
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
      
      setPackages(prev => [newPackage, ...prev]);
      return newPackage;
    } catch (err: any) {
      setError(err.message || 'Error creando paquete');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updatePackage = useCallback(async (id: string, updates: Partial<Package>) => {
    setIsLoading(true);
    setError(null);
    
    try {
      setPackages(prev => 
        prev.map(pkg => pkg.id === id ? { ...pkg, ...updates, updatedAt: new Date() } : pkg)
      );
      
      return packages.find(pkg => pkg.id === id);
    } catch (err: any) {
      setError(err.message || 'Error actualizando paquete');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [packages]);

  const deletePackage = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      setPackages(prev => prev.filter(pkg => pkg.id !== id));
    } catch (err: any) {
      const errorMessage = err.message || 'Error eliminando paquete';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateFilters = useCallback((newFilters: PackageFilters) => {
    setFilters(newFilters);
    setPagination(prev => ({ ...prev, page: 1 }));
  }, []);

  const changePage = useCallback((page: number) => {
    setPagination(prev => ({ ...prev, page }));
  }, []);

  return {
    packages,
    isLoading,
    error,
    pagination,
    filters,
    createPackage,
    updatePackage,
    deletePackage,
    updateFilters,
    changePage,
    refreshPackages: fetchPackages
  };
}

export default usePackages;