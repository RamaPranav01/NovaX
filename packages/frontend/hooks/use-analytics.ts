"use client";

import { useQuery } from '@tanstack/react-query';
import { analyticsAPI, type AnalyticsData } from '@/lib/api';

// Hook for dashboard analytics data
export function useAnalytics() {
  return useQuery({
    queryKey: ['analytics', 'dashboard'],
    queryFn: analyticsAPI.getDashboardData,
    refetchInterval: 30000, // Refetch every 30 seconds for real-time feel
    staleTime: 15000, // Consider data stale after 15 seconds
  });
}

// Hook for threats over time data
export function useThreatsOverTime(timeframe: string = '24h') {
  return useQuery({
    queryKey: ['analytics', 'threats-over-time', timeframe],
    queryFn: () => analyticsAPI.getThreatsOverTime(timeframe),
    refetchInterval: 60000, // Refetch every minute
    staleTime: 30000, // Consider data stale after 30 seconds
  });
}

// Mock data generator for development (until backend is ready)
export function useMockAnalytics(): { data: AnalyticsData; isLoading: boolean; error: null } {
  const mockData: AnalyticsData = {
    total_requests: 1247,
    blocked_threats: 23,
    successful_requests: 1224,
    average_response_time: 245,
    cost_savings: 156.78,
    uptime: 99.8,
    threats_over_time: [
      { timestamp: "2024-01-15T00:00:00Z", count: 2 },
      { timestamp: "2024-01-15T01:00:00Z", count: 1 },
      { timestamp: "2024-01-15T02:00:00Z", count: 0 },
      { timestamp: "2024-01-15T03:00:00Z", count: 3 },
      { timestamp: "2024-01-15T04:00:00Z", count: 1 },
      { timestamp: "2024-01-15T05:00:00Z", count: 0 },
      { timestamp: "2024-01-15T06:00:00Z", count: 2 },
      { timestamp: "2024-01-15T07:00:00Z", count: 4 },
      { timestamp: "2024-01-15T08:00:00Z", count: 6 },
      { timestamp: "2024-01-15T09:00:00Z", count: 8 },
      { timestamp: "2024-01-15T10:00:00Z", count: 5 },
      { timestamp: "2024-01-15T11:00:00Z", count: 7 },
      { timestamp: "2024-01-15T12:00:00Z", count: 9 },
      { timestamp: "2024-01-15T13:00:00Z", count: 11 },
      { timestamp: "2024-01-15T14:00:00Z", count: 8 },
      { timestamp: "2024-01-15T15:00:00Z", count: 6 },
      { timestamp: "2024-01-15T16:00:00Z", count: 4 },
      { timestamp: "2024-01-15T17:00:00Z", count: 3 },
      { timestamp: "2024-01-15T18:00:00Z", count: 2 },
      { timestamp: "2024-01-15T19:00:00Z", count: 1 },
      { timestamp: "2024-01-15T20:00:00Z", count: 2 },
      { timestamp: "2024-01-15T21:00:00Z", count: 1 },
      { timestamp: "2024-01-15T22:00:00Z", count: 0 },
      { timestamp: "2024-01-15T23:00:00Z", count: 1 },
    ]
  };

  return {
    data: mockData,
    isLoading: false,
    error: null
  };
}