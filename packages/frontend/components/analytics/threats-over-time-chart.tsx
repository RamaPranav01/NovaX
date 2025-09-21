"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";
import { TrendingUp } from "lucide-react";

interface ThreatData {
  timestamp: string;
  count: number;
  hour: string;
}

interface ThreatsOverTimeChartProps {
  data?: ThreatData[];
  isLoading?: boolean;
}

// Mock data for demonstration
const mockData: ThreatData[] = [
  { timestamp: "2024-01-15T00:00:00Z", count: 2, hour: "00:00" },
  { timestamp: "2024-01-15T01:00:00Z", count: 1, hour: "01:00" },
  { timestamp: "2024-01-15T02:00:00Z", count: 0, hour: "02:00" },
  { timestamp: "2024-01-15T03:00:00Z", count: 3, hour: "03:00" },
  { timestamp: "2024-01-15T04:00:00Z", count: 1, hour: "04:00" },
  { timestamp: "2024-01-15T05:00:00Z", count: 0, hour: "05:00" },
  { timestamp: "2024-01-15T06:00:00Z", count: 2, hour: "06:00" },
  { timestamp: "2024-01-15T07:00:00Z", count: 4, hour: "07:00" },
  { timestamp: "2024-01-15T08:00:00Z", count: 6, hour: "08:00" },
  { timestamp: "2024-01-15T09:00:00Z", count: 8, hour: "09:00" },
  { timestamp: "2024-01-15T10:00:00Z", count: 5, hour: "10:00" },
  { timestamp: "2024-01-15T11:00:00Z", count: 7, hour: "11:00" },
  { timestamp: "2024-01-15T12:00:00Z", count: 9, hour: "12:00" },
  { timestamp: "2024-01-15T13:00:00Z", count: 11, hour: "13:00" },
  { timestamp: "2024-01-15T14:00:00Z", count: 8, hour: "14:00" },
  { timestamp: "2024-01-15T15:00:00Z", count: 6, hour: "15:00" },
  { timestamp: "2024-01-15T16:00:00Z", count: 4, hour: "16:00" },
  { timestamp: "2024-01-15T17:00:00Z", count: 3, hour: "17:00" },
  { timestamp: "2024-01-15T18:00:00Z", count: 2, hour: "18:00" },
  { timestamp: "2024-01-15T19:00:00Z", count: 1, hour: "19:00" },
  { timestamp: "2024-01-15T20:00:00Z", count: 2, hour: "20:00" },
  { timestamp: "2024-01-15T21:00:00Z", count: 1, hour: "21:00" },
  { timestamp: "2024-01-15T22:00:00Z", count: 0, hour: "22:00" },
  { timestamp: "2024-01-15T23:00:00Z", count: 1, hour: "23:00" },
];

export function ThreatsOverTimeChart({ data = mockData, isLoading = false }: ThreatsOverTimeChartProps) {
  if (isLoading) {
    return (
      <Card className="border-primary/20">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <span>Threats Over Time</span>
          </CardTitle>
          <CardDescription>
            Threats blocked over the last 24 hours
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center bg-muted/20 rounded-lg animate-pulse">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
              <p className="text-sm text-muted-foreground">Loading chart data...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const totalThreats = data.reduce((sum, item) => sum + item.count, 0);
  const peakHour = data.reduce((max, item) => item.count > max.count ? item : max, data[0]);

  return (
    <Card className="border-primary/20">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center space-x-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          <span>Threats Over Time</span>
        </CardTitle>
        <CardDescription>
          {totalThreats} threats blocked in the last 24 hours • Peak: {peakHour.count} at {peakHour.hour}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <defs>
                <linearGradient id="threatGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#ef4444" />
                  <stop offset="50%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#f97316" />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#cbd5e1"
                strokeOpacity={0.5}
              />
              <XAxis
                dataKey="hour"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#64748b' }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#64748b' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '12px',
                  color: '#1f2937',
                  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
                }}
                labelStyle={{ color: '#6b7280' }}
                cursor={{ stroke: '#ef4444', strokeWidth: 2, strokeOpacity: 0.5 }}
              />
              <Area
                type="monotone"
                dataKey="count"
                stroke="url(#lineGradient)"
                strokeWidth={3}
                fill="url(#threatGradient)"
                fillOpacity={0.6}
                dot={{
                  fill: '#ef4444',
                  strokeWidth: 2,
                  r: 5,
                  stroke: '#ffffff'
                }}
                activeDot={{
                  r: 8,
                  stroke: '#ef4444',
                  strokeWidth: 3,
                  fill: '#ffffff'
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}