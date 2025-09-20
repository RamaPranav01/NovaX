"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ThreatsOverTimeChart,
  CostSavingsChart,
  RequestStatCard,
  ThreatStatCard,
  SuccessRateStatCard,
  CostSavingsStatCard
} from "@/components/analytics";
import { useMockAnalytics } from "@/hooks/use-analytics";
import { HydrationBoundary } from "@/components/hydration-boundary";
import { ClientWrapper } from "@/components/client-wrapper";
import {
  AlertTriangle,
  Activity,
  Eye,
  DollarSign
} from "lucide-react";

export default function DashboardPage() {
  // Using mock data for now - will switch to real API when backend is ready
  const { data: analytics, isLoading } = useMockAnalytics();

  const recentActivity = [
    { id: 1, type: "threat_blocked", message: "Prompt injection attempt blocked", time: "2 min ago", severity: "high" },
    { id: 2, type: "request_processed", message: "AI response verified successfully", time: "5 min ago", severity: "low" },
    { id: 3, type: "policy_violation", message: "Medical advice policy violation detected", time: "12 min ago", severity: "medium" },
    { id: 4, type: "request_processed", message: "AI response verified successfully", time: "15 min ago", severity: "low" },
  ];

  return (
    <HydrationBoundary>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
              Command Center
            </h1>
            <p className="text-muted-foreground mt-2 text-lg">
              Monitor your AI security and trust metrics in real-time
            </p>
          </div>
        </div>

        {/* Enhanced Stats Grid with New Components */}
        <ClientWrapper>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <RequestStatCard value={analytics.total_requests} isLoading={isLoading} />
            <ThreatStatCard value={analytics.blocked_threats} isLoading={isLoading} />
            <SuccessRateStatCard
              value={analytics.successful_requests}
              total={analytics.total_requests}
              isLoading={isLoading}
            />
            <CostSavingsStatCard value={analytics.cost_savings} isLoading={isLoading} />
          </div>
        </ClientWrapper>

        {/* Enhanced Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Threats Over Time Chart - Enhanced with Gradient Background */}
          <Card className="border-primary/20 bg-gradient-to-br from-red-50/50 via-background to-orange-50/30 dark:from-red-950/20 dark:via-background dark:to-orange-950/20">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center space-x-2">
                <div className="p-2 rounded-lg bg-gradient-to-br from-red-500 to-orange-500 text-white">
                  <AlertTriangle className="h-5 w-5" />
                </div>
                <span className="bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent font-bold">
                  Threats Over Time
                </span>
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                {analytics.threats_over_time.reduce((sum, item) => sum + item.count, 0)} threats blocked in the last 24 hours
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ThreatsOverTimeChart
                data={analytics.threats_over_time.map(item => ({
                  ...item,
                  hour: new Date(item.timestamp).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false
                  })
                }))}
                isLoading={isLoading}
              />
            </CardContent>
          </Card>

          {/* Recent Activity - Enhanced with Gradient */}
          <Card className="border-primary/20 bg-gradient-to-br from-blue-50/50 via-background to-purple-50/30 dark:from-blue-950/20 dark:via-background dark:to-purple-950/20">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center space-x-2">
                <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                  <Activity className="h-5 w-5" />
                </div>
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-bold">
                  Recent Activity
                </span>
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Latest security events and responses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3 p-4 rounded-xl bg-gradient-to-r from-card/80 to-card/40 border border-border/50 hover:border-primary/30 transition-all duration-200 hover:shadow-md">
                    <div className={`
                    w-3 h-3 rounded-full mt-2 flex-shrink-0 shadow-lg
                    ${activity.severity === 'high' ? 'bg-gradient-to-r from-red-500 to-red-600 shadow-red-500/30' :
                        activity.severity === 'medium' ? 'bg-gradient-to-r from-yellow-500 to-orange-500 shadow-yellow-500/30' :
                          'bg-gradient-to-r from-green-500 to-emerald-500 shadow-green-500/30'}
                  `} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">
                        {activity.message}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-6 border-primary/30 text-primary hover:bg-gradient-to-r hover:from-primary/10 hover:to-purple/10 transition-all duration-200">
                <Eye className="h-4 w-4 mr-2" />
                View All Activity
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Cost Savings Chart - Enhanced */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Cost Savings Chart with Gradient Background */}
          <Card className="border-primary/20 bg-gradient-to-br from-green-50/50 via-background to-emerald-50/30 dark:from-green-950/20 dark:via-background dark:to-emerald-950/20">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center space-x-2">
                <div className="p-2 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 text-white">
                  <DollarSign className="h-5 w-5" />
                </div>
                <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent font-bold">
                  Cost Savings Breakdown
                </span>
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Total savings: $100,000 this month • +23% growth
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CostSavingsChart isLoading={isLoading} totalSavings={100000} />
            </CardContent>
          </Card>

          {/* System Health Monitor */}
          <Card className="border-primary/20 bg-gradient-to-br from-blue-50/50 via-background to-cyan-50/30 dark:from-blue-950/20 dark:via-background dark:to-cyan-950/20">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center space-x-2">
                <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 text-white">
                  <Activity className="h-5 w-5" />
                </div>
                <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent font-bold">
                  System Health
                </span>
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Real-time system performance and security status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* API Gateway Status */}
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-green-500/10 to-emerald-500/5 rounded-lg border border-green-500/20">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <div>
                      <p className="font-medium text-sm">API Gateway</p>
                      <p className="text-xs text-muted-foreground">Response time: 45ms</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-green-600">Operational</p>
                    <p className="text-xs text-muted-foreground">99.9% uptime</p>
                  </div>
                </div>

                {/* Threat Detection Engine */}
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-500/10 to-blue-500/5 rounded-lg border border-blue-500/20">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                    <div>
                      <p className="font-medium text-sm">Threat Detection</p>
                      <p className="text-xs text-muted-foreground">Processing: 1,247 req/min</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-blue-600">Active</p>
                    <p className="text-xs text-muted-foreground">8 policies loaded</p>
                  </div>
                </div>

                {/* Trust Verification */}
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-500/10 to-purple-500/5 rounded-lg border border-purple-500/20">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
                    <div>
                      <p className="font-medium text-sm">Trust Verification</p>
                      <p className="text-xs text-muted-foreground">Sources: 50+ APIs</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-purple-600">Online</p>
                    <p className="text-xs text-muted-foreground">Last check: 2s ago</p>
                  </div>
                </div>

                {/* Database Status */}
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-orange-500/10 to-orange-500/5 rounded-lg border border-orange-500/20">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse"></div>
                    <div>
                      <p className="font-medium text-sm">Audit Database</p>
                      <p className="text-xs text-muted-foreground">Storage: 2.3TB used</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-orange-600">Healthy</p>
                    <p className="text-xs text-muted-foreground">Backup: 1h ago</p>
                  </div>
                </div>

                {/* System Resources */}
                <div className="mt-4 p-3 bg-muted/20 rounded-lg">
                  <h4 className="font-medium text-sm mb-2">Resource Usage</h4>
                  <div className="grid grid-cols-3 gap-4 text-xs">
                    <div className="text-center">
                      <p className="text-muted-foreground">CPU</p>
                      <p className="font-semibold">23%</p>
                    </div>
                    <div className="text-center">
                      <p className="text-muted-foreground">Memory</p>
                      <p className="font-semibold">67%</p>
                    </div>
                    <div className="text-center">
                      <p className="text-muted-foreground">Network</p>
                      <p className="font-semibold">12 MB/s</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </HydrationBoundary>
  );
} 