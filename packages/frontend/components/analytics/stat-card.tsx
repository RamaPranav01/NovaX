"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon, Shield, Activity, CheckCircle, DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    label: string;
    isPositive?: boolean;
  };
  className?: string;
  iconClassName?: string;
  isLoading?: boolean;
}

export function StatCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  className,
  iconClassName,
  isLoading = false
}: StatCardProps) {
  if (isLoading) {
    return (
      <Card className={cn("border-primary/20", className)}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
          <div className={cn("p-2 rounded-lg bg-muted/20 animate-pulse", iconClassName)}>
            <Icon className="h-4 w-4 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="h-8 bg-muted/20 rounded animate-pulse"></div>
            {description && (
              <div className="h-4 bg-muted/20 rounded animate-pulse w-3/4"></div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("border-primary/20 hover:border-primary/40 transition-all duration-300", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className={cn("p-2 rounded-lg bg-primary/10", iconClassName)}>
          <Icon className="h-4 w-4 text-primary" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          <div className="text-2xl font-bold text-foreground">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </div>
          
          <div className="flex items-center justify-between">
            {description && (
              <p className="text-xs text-muted-foreground flex-1">
                {description}
              </p>
            )}
            
            {trend && (
              <div className={cn(
                "text-xs font-medium flex items-center space-x-1",
                trend.isPositive !== false ? "text-green-500" : "text-destructive"
              )}>
                <span>
                  {trend.isPositive !== false ? "+" : ""}{trend.value}%
                </span>
                <span className="text-muted-foreground">{trend.label}</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Specialized stat cards for common use cases
export function ThreatStatCard({ 
  value, 
  isLoading = false 
}: { 
  value: number; 
  isLoading?: boolean; 
}) {
  return (
    <StatCard
      title="Threats Blocked"
      value={value}
      description="Security incidents prevented"
      icon={Shield}
      trend={{ value: 12, label: "vs last hour", isPositive: true }}
      className="border-destructive/20 hover:border-destructive/40"
      iconClassName="bg-destructive/10"
      isLoading={isLoading}
    />
  );
}

export function RequestStatCard({ 
  value, 
  isLoading = false 
}: { 
  value: number; 
  isLoading?: boolean; 
}) {
  return (
    <StatCard
      title="Total Requests"
      value={value}
      description="API calls processed"
      icon={Activity}
      trend={{ value: 8, label: "vs last hour", isPositive: true }}
      isLoading={isLoading}
    />
  );
}

export function SuccessRateStatCard({ 
  value, 
  total, 
  isLoading = false 
}: { 
  value: number; 
  total: number; 
  isLoading?: boolean; 
}) {
  const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : "0.0";
  
  return (
    <StatCard
      title="Success Rate"
      value={`${percentage}%`}
      description={`${value.toLocaleString()} successful requests`}
      icon={CheckCircle}
      trend={{ value: 2.1, label: "vs last hour", isPositive: true }}
      className="border-green-500/20 hover:border-green-500/40"
      iconClassName="bg-green-500/10"
      isLoading={isLoading}
    />
  );
}

export function CostSavingsStatCard({ 
  value, 
  isLoading = false 
}: { 
  value: number; 
  isLoading?: boolean; 
}) {
  return (
    <StatCard
      title="Cost Savings"
      value={`$${value.toFixed(2)}`}
      description="Saved this hour"
      icon={DollarSign}
      trend={{ value: 15, label: "vs last hour", isPositive: true }}
      isLoading={isLoading}
    />
  );
}