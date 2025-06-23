// src/hooks/useDashboard.ts
import { useState, useEffect } from 'react';

interface DashboardStats {
  totalPackages: number;
  packagesInTransit: number;
  deliveredToday: number;
  pendingPickups: number;
  totalRevenue: number;
  activeClients: number;
}

export const useDashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalPackages: 0,
    packagesInTransit: 0,
    deliveredToday: 0,
    pendingPickups: 0,
    totalRevenue: 0,
    activeClients: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      try {
        // Datos mock
        await new Promise(resolve => setTimeout(resolve, 1000));
        setStats({
          totalPackages: 1250,
          packagesInTransit: 145,
          deliveredToday: 23,
          pendingPickups: 8,
          totalRevenue: 45670,
          activeClients: 89
        });
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  return { stats, isLoading };
};