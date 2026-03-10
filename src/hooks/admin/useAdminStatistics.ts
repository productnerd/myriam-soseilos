
import { useQuery } from '@tanstack/react-query';
import { fetchAndProcessStatistics, refreshStatistics } from './statistics/statisticsProcessor';
export * from './statistics/types';

export function useAdminStatistics() {
  return useQuery({
    queryKey: ['admin', 'statistics'],
    queryFn: fetchAndProcessStatistics,
    refetchInterval: 60000 * 5, // Refresh every 5 minutes
  });
}

export function useManualStatisticsRefresh() {
  return useQuery({
    queryKey: ['admin', 'statistics', 'refresh'],
    queryFn: refreshStatistics,
    enabled: false, // This query will not run automatically
  });
}
