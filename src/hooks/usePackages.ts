// src/hooks/usePackages.ts
import { useState, useEffect, useCallback } from 'react';
import { Package, PackageFilters, PaginationInfo } from '../types'; // CORREGIDO: tipos ahora existen

export function usePackages() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<PackageFilters>({});
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    pageSize: 10,
    totalItems: 0,
    totalPages: 0
  });

  // Mock data con fechas como strings
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
      createdAt: '2024-12-01T10:00:00Z', // CORREGIDO: string en lugar de Date
      updatedAt: '2024-12-05T14:30:00Z', // CORREGIDO: string en lugar de Date
      estimatedDelivery: '2024-12-10T18:00:00Z' // CORREGIDO: string en lugar de Date
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
      createdAt: '2024-11-25T09:15:00Z', // CORREGIDO: string en lugar de Date
      updatedAt: '2024-12-02T16:45:00Z', // CORREGIDO: string en lugar de Date
      estimatedDelivery: '2024-12-01T12:00:00Z', // CORREGIDO: string en lugar de Date
      actualDelivery: '2024-12-02T11:30:00Z' // CORREGIDO: string en lugar de Date
    }
  ];

  // Cargar paquetes (simulado)
  const loadPackages = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Simular llamada API
      await new Promise(resolve => setTimeout(resolve, 1000));

      let filteredPackages = [...mockPackages];

      // Aplicar filtros
      if (filters.search) {
        filteredPackages = filteredPackages.filter(pkg => 
          pkg.trackingNumber.toLowerCase().includes(filters.search!.toLowerCase()) ||
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

      setPackages(filteredPackages);
      setPagination((prev: PaginationInfo) => ({
        ...prev,
        totalItems: filteredPackages.length,
        totalPages: Math.ceil(filteredPackages.length / prev.pageSize)
      }));

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error cargando paquetes');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Crear nuevo paquete
  const createPackage = useCallback(async (packageData: Partial<Package>) => {
    setLoading(true);
    setError(null);

    try {
      // Simular llamada API
      await new Promise(resolve => setTimeout(resolve, 500));

      const newPackage: Package = {
        id: Date.now().toString(),
        trackingNumber: 'ITB' + Date.now().toString().slice(-6),
        senderId: 'sender-new',
        recipientId: 'recipient-new',
        sender: {
          name: 'Nuevo Remitente',
          email: 'nuevo@email.com',
          phone: '+506 0000-0000',
          address: 'Dirección nueva',
          city: 'San José',
          country: 'Costa Rica'
        },
        recipient: {
          name: 'Nuevo Destinatario',
          email: 'destinatario@email.com',
          phone: '+506 1111-1111',
          address: 'Dirección destino',
          city: 'Cartago',
          country: 'Costa Rica'
        },
        status: 'pending',
        service: 'standard',
        weight: 1.0,
        dimensions: { length: 20, width: 15, height: 5 },
        declaredValue: 100.00,
        createdAt: new Date().toISOString(), // CORREGIDO: convertir a string
        updatedAt: new Date().toISOString(), // CORREGIDO: convertir a string
        estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // CORREGIDO: +7 días como string
        ...packageData
      };

      setPackages(prev => [newPackage, ...prev]);
      return newPackage;

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error creando paquete');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Actualizar paquete
  const updatePackage = useCallback(async (id: string, updates: Partial<Package>) => {
    setLoading(true);
    setError(null);
    
    try {
      setPackages(prev => 
        prev.map(pkg => pkg.id === id ? { 
          ...pkg, 
          ...updates, 
          updatedAt: new Date().toISOString() // CORREGIDO: string en lugar de Date
        } : pkg)
      );
      
      return packages.find(pkg => pkg.id === id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error actualizando paquete');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [packages]);

  // Eliminar paquete
  const deletePackage = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setPackages(prev => prev.filter(pkg => pkg.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error eliminando paquete');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Actualizar filtros
  const updateFilters = useCallback((newFilters: PackageFilters) => {
    setFilters(newFilters);
    setPagination((prev: PaginationInfo) => ({ ...prev, page: 1 }));
  }, []);

  const changePage = useCallback((page: number) => {
    setPagination((prev: PaginationInfo) => ({ ...prev, page }));
  }, []);

  return {
    packages,
    loading,
    error,
    filters,
    pagination,
    loadPackages,
    createPackage,
    updatePackage,
    deletePackage,
    updateFilters,
    changePage
  };
}