// src/hooks/useWarehouse.ts - Hook Corregido para Módulo Operativo

import { useState, useEffect, useCallback } from 'react';
import { 
  OperativeWarehouseService,
  WHRPackage, 
  WHRStats, 
  WHRCreateData,
  WHRFilters
} from '../services/warehouseService';

interface UseWarehouseState {
  whrs: WHRPackage[];
  stats: WHRStats | null;
  loading: boolean;
  error: string | null;
  searchTerm: string;
}

interface UseWarehouseActions {
  // Data operations
  loadWHRs: () => Promise<void>;
  loadStats: () => Promise<void>;
  refresh: () => Promise<void>;
  
  // WHR operations
  createWHR: (data: WHRCreateData) => Promise<WHRPackage>;
  updateWHR: (id: string, data: Partial<WHRCreateData>) => Promise<WHRPackage>;
  deleteWHR: (id: string) => Promise<boolean>;
  classifyWHR: (id: string, classification: 'awb' | 'bl') => Promise<WHRPackage>;
  sendWHREmail: (id: string) => Promise<boolean>;
  
  // Search and filter
  setSearchTerm: (term: string) => void;
  searchByTracking: (trackingNumber: string) => Promise<WHRPackage | null>;
  
  // Utilities
  clearError: () => void;
  setLoading: (loading: boolean) => void;
}

export interface UseWarehouseReturn extends UseWarehouseState, UseWarehouseActions {
  filteredWHRs: WHRPackage[];
  hasError: boolean;
  isEmpty: boolean;
  isHealthy: boolean;
}

export const useWarehouse = (initialFilters?: WHRFilters): UseWarehouseReturn => {
  // ✅ Estado del hook
  const [state, setState] = useState<UseWarehouseState>({
    whrs: [],
    stats: null,
    loading: false,
    error: null,
    searchTerm: ''
  });

  const [isHealthy, setIsHealthy] = useState<boolean>(true);

  // ✅ Función para actualizar estado de forma segura
  const updateState = useCallback((updates: Partial<UseWarehouseState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  // ✅ Cargar WHRs
  const loadWHRs = useCallback(async (): Promise<void> => {
    try {
      updateState({ loading: true, error: null });
      console.log('🔄 useWarehouse: Cargando WHRs...');
      
      const filters = state.searchTerm ? { search: state.searchTerm } : initialFilters;
      const response = await OperativeWarehouseService.getWHRList(filters);
      
      if (response.success) {
        updateState({ 
          whrs: Array.isArray(response.data.whrList) ? response.data.whrList : [],
          loading: false 
        });
        console.log('✅ useWarehouse: WHRs cargados:', response.data.whrList?.length || 0);
      } else {
        updateState({ 
          error: response.message || 'Error cargando WHRs',
          whrs: [],
          loading: false 
        });
      }
    } catch (err) {
      console.error('❌ useWarehouse: Error cargando WHRs:', err);
      updateState({ 
        error: 'Error de conexión con el servidor',
        whrs: [],
        loading: false 
      });
      setIsHealthy(false);
    }
  }, [state.searchTerm, initialFilters, updateState]);

  // ✅ Cargar estadísticas
  const loadStats = useCallback(async (): Promise<void> => {
    try {
      console.log('📊 useWarehouse: Cargando estadísticas...');
      const response = await OperativeWarehouseService.getWHRStats(30);
      
      if (response.success) {
        updateState({ stats: response.data.stats });
        console.log('✅ useWarehouse: Estadísticas cargadas:', response.data.stats);
      } else {
        console.warn('⚠️ useWarehouse: Error cargando estadísticas:', response.message);
      }
    } catch (err) {
      console.error('❌ useWarehouse: Error cargando estadísticas:', err);
    }
  }, [updateState]);

  // ✅ Refresh completo
  const refresh = useCallback(async (): Promise<void> => {
    await Promise.all([loadWHRs(), loadStats()]);
  }, [loadWHRs, loadStats]);

  // ✅ Crear WHR
  const createWHR = useCallback(async (data: WHRCreateData): Promise<WHRPackage> => {
    try {
      updateState({ loading: true, error: null });
      console.log('📦 useWarehouse: Creando WHR:', data);
      
      const newWHR = await OperativeWarehouseService.createWHR(data);
      
      // Actualizar estado local
      setState(prev => ({
        ...prev,
        whrs: [newWHR, ...prev.whrs],
        loading: false
      }));
      
      // Recargar estadísticas
      await loadStats();
      
      console.log('✅ useWarehouse: WHR creado exitosamente:', newWHR);
      return newWHR;
    } catch (err) {
      console.error('❌ useWarehouse: Error creando WHR:', err);
      updateState({ 
        error: err instanceof Error ? err.message : 'Error creando WHR',
        loading: false 
      });
      throw err;
    }
  }, [updateState, loadStats]);

  // ✅ Actualizar WHR
  const updateWHR = useCallback(async (id: string, data: Partial<WHRCreateData>): Promise<WHRPackage> => {
    try {
      updateState({ loading: true, error: null });
      console.log(`🔄 useWarehouse: Actualizando WHR ${id}:`, data);
      
      const updatedWHR = await OperativeWarehouseService.updateWHR(id, data);
      
      // Actualizar estado local
      setState(prev => ({
        ...prev,
        whrs: prev.whrs.map(whr => 
          whr.id === id ? updatedWHR : whr
        ),
        loading: false
      }));
      
      console.log('✅ useWarehouse: WHR actualizado exitosamente:', updatedWHR);
      return updatedWHR;
    } catch (err) {
      console.error('❌ useWarehouse: Error actualizando WHR:', err);
      updateState({ 
        error: err instanceof Error ? err.message : 'Error actualizando WHR',
        loading: false 
      });
      throw err;
    }
  }, [updateState]);

  // ✅ Eliminar WHR
  const deleteWHR = useCallback(async (id: string): Promise<boolean> => {
    try {
      updateState({ loading: true, error: null });
      console.log(`🗑️ useWarehouse: Eliminando WHR ${id}`);
      
      const success = await OperativeWarehouseService.deleteWHR(id);
      
      if (success) {
        // Actualizar estado local
        setState(prev => ({
          ...prev,
          whrs: prev.whrs.filter(whr => whr.id !== id),
          loading: false
        }));
        
        // Recargar estadísticas
        await loadStats();
        
        console.log('✅ useWarehouse: WHR eliminado exitosamente');
        return true;
      } else {
        updateState({ 
          error: 'Error eliminando WHR',
          loading: false 
        });
        return false;
      }
    } catch (err) {
      console.error('❌ useWarehouse: Error eliminando WHR:', err);
      updateState({ 
        error: err instanceof Error ? err.message : 'Error eliminando WHR',
        loading: false 
      });
      return false;
    }
  }, [updateState, loadStats]);

  // ✅ Clasificar WHR - CORREGIDO
  const classifyWHR = useCallback(async (id: string, classification: 'awb' | 'bl'): Promise<WHRPackage> => {
    try {
      updateState({ loading: true, error: null });
      console.log(`🏷️ useWarehouse: Clasificando WHR ${id} como ${classification}`);
      
      const updatedWHR = await OperativeWarehouseService.classifyWHR(id, classification);
      
      // Actualizar estado local
      setState(prev => ({
        ...prev,
        whrs: prev.whrs.map(whr => 
          whr.id === id ? updatedWHR : whr
        ),
        loading: false
      }));
      
      // Recargar estadísticas
      await loadStats();
      
      console.log('✅ useWarehouse: WHR clasificado exitosamente:', updatedWHR);
      return updatedWHR;
    } catch (err) {
      console.error('❌ useWarehouse: Error clasificando WHR:', err);
      updateState({ 
        error: err instanceof Error ? err.message : 'Error clasificando WHR',
        loading: false 
      });
      throw err;
    }
  }, [updateState, loadStats]);

  // ✅ Enviar email WHR - CORREGIDO PARA USAR LA ESTRUCTURA CORRECTA
  const sendWHREmail = useCallback(async (id: string): Promise<boolean> => {
    try {
      updateState({ loading: true, error: null });
      console.log(`📧 useWarehouse: Enviando email para WHR ${id}`);
      
      const result = await OperativeWarehouseService.sendWHREmail(id);
      
      // ✅ CORREGIDO: Usar result.success y result.data.whr en lugar de result.data.sent
      if (result.success && result.data.whr) {
        // Actualizar estado local
        setState(prev => ({
          ...prev,
          whrs: prev.whrs.map(whr => 
            whr.id === id ? { ...whr, emailSent: true } : whr
          ),
          loading: false
        }));
        
        console.log('✅ useWarehouse: Email enviado exitosamente');
        return true;
      } else {
        updateState({ 
          error: result.message || 'Error enviando email',
          loading: false 
        });
        return false;
      }
    } catch (err) {
      console.error('❌ useWarehouse: Error enviando email:', err);
      updateState({ 
        error: err instanceof Error ? err.message : 'Error enviando email',
        loading: false 
      });
      return false;
    }
  }, [updateState]);

  // ✅ Buscar por tracking
  const searchByTracking = useCallback(async (trackingNumber: string): Promise<WHRPackage | null> => {
    try {
      console.log(`🔍 useWarehouse: Buscando WHR por tracking: ${trackingNumber}`);
      return await OperativeWarehouseService.searchByTracking(trackingNumber);
    } catch (err) {
      console.error('❌ useWarehouse: Error buscando por tracking:', err);
      return null;
    }
  }, []);

  // ✅ Establecer término de búsqueda
  const setSearchTerm = useCallback((term: string) => {
    updateState({ searchTerm: term });
  }, [updateState]);

  // ✅ Limpiar error
  const clearError = useCallback(() => {
    updateState({ error: null });
  }, [updateState]);

  // ✅ Establecer loading
  const setLoading = useCallback((loading: boolean) => {
    updateState({ loading });
  }, [updateState]);

  // ✅ Efecto para cargar datos iniciales
  useEffect(() => {
    const checkHealth = async () => {
      try {
        const healthy = await OperativeWarehouseService.healthCheck();
        setIsHealthy(healthy);
        
        if (healthy) {
          await refresh();
        } else {
          updateState({ error: 'Servicio de backend no disponible' });
        }
      } catch (err) {
        console.error('❌ useWarehouse: Health check failed:', err);
        setIsHealthy(false);
        updateState({ error: 'Error conectando con el servidor' });
      }
    };

    checkHealth();
  }, []); // Solo se ejecuta una vez al montar

  // ✅ Efecto para búsqueda con debounce
  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      if (isHealthy) {
        loadWHRs();
      }
    }, 300); // Debounce de 300ms

    return () => clearTimeout(delayedSearch);
  }, [state.searchTerm, isHealthy, loadWHRs]);

  // ✅ WHRs filtrados localmente
  const filteredWHRs = state.whrs.filter((whr) => {
    if (!state.searchTerm) return true;
    
    const searchLower = state.searchTerm.toLowerCase();
    return (
      whr.whrNumber?.toLowerCase().includes(searchLower) ||
      whr.trackingNumber?.toLowerCase().includes(searchLower) ||
      whr.consignee?.name?.toLowerCase().includes(searchLower) ||
      whr.consignee?.email?.toLowerCase().includes(searchLower) ||
      whr.shipper?.name?.toLowerCase().includes(searchLower) ||
      whr.content?.toLowerCase().includes(searchLower) ||
      whr.carrier?.toLowerCase().includes(searchLower)
    );
  });

  // ✅ Propiedades derivadas
  const hasError = Boolean(state.error);
  const isEmpty = filteredWHRs.length === 0 && !state.loading;

  return {
    // Estado
    whrs: state.whrs,
    stats: state.stats,
    loading: state.loading,
    error: state.error,
    searchTerm: state.searchTerm,
    
    // Acciones
    loadWHRs,
    loadStats,
    refresh,
    createWHR,
    updateWHR,
    deleteWHR,
    classifyWHR,
    sendWHREmail,
    setSearchTerm,
    searchByTracking,
    clearError,
    setLoading,
    
    // Computadas
    filteredWHRs,
    hasError,
    isEmpty,
    isHealthy
  };
};