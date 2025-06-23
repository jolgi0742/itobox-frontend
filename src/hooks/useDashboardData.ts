// src/hooks/useDashboardData.ts
import { useState, useEffect } from 'react';

interface DashboardStats {
  totalPackages: number;
  packagesInTransit: number;
  deliveredToday: number;
  pendingPickups: number;
  totalRevenue: number;
  activeClients: number;
}

export const useDashboardData = () => {
  const [data, setData] = useState<DashboardStats>({
    totalPackages: 0,
    packagesInTransit: 0,
    deliveredToday: 0,
    pendingPickups: 0,
    totalRevenue: 0,
    activeClients: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simular llamada a API
        await new Promise(resolve => setTimeout(resolve, 500));
        setData({
          totalPackages: 1250,
          packagesInTransit: 145,
          deliveredToday: 23,
          pendingPickups: 8,
          totalRevenue: 45670,
          activeClients: 89
        });
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, isLoading };
};