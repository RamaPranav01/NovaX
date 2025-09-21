"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { DollarSign } from "lucide-react";

interface CostData {
    name: string;
    value: number;
    color: string;
}

interface CostSavingsChartProps {
    data?: CostData[];
    isLoading?: boolean;
    totalSavings?: number;
}

// Mock data with attractive gradient colors
const mockData: CostData[] = [
    { name: "Prevented Data Breaches", value: 45000, color: "#10b981" },
    { name: "Reduced Manual Review", value: 28000, color: "#3b82f6" },
    { name: "Compliance Automation", value: 15000, color: "#8b5cf6" },
    { name: "Infrastructure Savings", value: 12000, color: "#f59e0b" },
];

const RADIAN = Math.PI / 180;

const renderCustomizedLabel = (props: Record<string, unknown>) => {
    const cx = props.cx as number;
    const cy = props.cy as number;
    const midAngle = props.midAngle as number;
    const innerRadius = props.innerRadius as number;
    const outerRadius = props.outerRadius as number;
    const percent = props.percent as number;

    if (!cx || !cy || midAngle === undefined || !innerRadius || !outerRadius || !percent) {
        return null;
    }

    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    if (percent < 0.05) return null; // Don&apos;t show labels for slices smaller than 5%

    return (
        <text
            x={x}
            y={y}
            fill="white"
            textAnchor={x > cx ? 'start' : 'end'}
            dominantBaseline="central"
            fontSize={12}
            fontWeight="bold"
        >
            {`${(percent * 100).toFixed(0)}%`}
        </text>
    );
};

export function CostSavingsChart({
    data = mockData,
    isLoading = false,
    totalSavings = 100000
}: CostSavingsChartProps) {
    if (isLoading) {
        return (
            <Card className="border-primary/20">
                <CardHeader className="pb-4">
                    <CardTitle className="flex items-center space-x-2">
                        <DollarSign className="h-5 w-5 text-primary" />
                        <span>Cost Savings Breakdown</span>
                    </CardTitle>
                    <CardDescription>
                        Financial impact of Nova&apos;s security measures
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="h-64 flex items-center justify-center bg-muted/20 rounded-lg animate-pulse">
                        <div className="text-center">
                            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                            <p className="text-sm text-muted-foreground">Loading savings data...</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="border-primary/20">
            <CardHeader className="pb-4">
                <CardTitle className="flex items-center space-x-2">
                    <DollarSign className="h-5 w-5 text-primary" />
                    <span>Cost Savings Breakdown</span>
                </CardTitle>
                <CardDescription>
                    Total savings: ${totalSavings.toLocaleString()} this month
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <defs>
                                <linearGradient id="greenGradient" x1="0" y1="0" x2="1" y2="1">
                                    <stop offset="0%" stopColor="#10b981" />
                                    <stop offset="100%" stopColor="#059669" />
                                </linearGradient>
                                <linearGradient id="blueGradient" x1="0" y1="0" x2="1" y2="1">
                                    <stop offset="0%" stopColor="#3b82f6" />
                                    <stop offset="100%" stopColor="#2563eb" />
                                </linearGradient>
                                <linearGradient id="purpleGradient" x1="0" y1="0" x2="1" y2="1">
                                    <stop offset="0%" stopColor="#8b5cf6" />
                                    <stop offset="100%" stopColor="#7c3aed" />
                                </linearGradient>
                                <linearGradient id="orangeGradient" x1="0" y1="0" x2="1" y2="1">
                                    <stop offset="0%" stopColor="#f59e0b" />
                                    <stop offset="100%" stopColor="#d97706" />
                                </linearGradient>
                            </defs>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={renderCustomizedLabel}
                                outerRadius={85}
                                innerRadius={25}
                                fill="#8884d8"
                                dataKey="value"
                                stroke="#ffffff"
                                strokeWidth={2}
                            >
                                {data.map((entry, index) => {
                                    const gradients = ['url(#greenGradient)', 'url(#blueGradient)', 'url(#purpleGradient)', 'url(#orangeGradient)'];
                                    return (
                                        <Cell 
                                            key={`cell-${index}`} 
                                            fill={gradients[index]} 
                                            style={{
                                                filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))',
                                                cursor: 'pointer'
                                            }}
                                        />
                                    );
                                })}
                            </Pie>
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'hsl(var(--card))',
                                    border: '1px solid hsl(var(--border))',
                                    borderRadius: '12px',
                                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                                    color: 'hsl(var(--foreground))'
                                }}
                                formatter={(value: number) => [`$${value.toLocaleString()}`, 'Savings']}
                            />
                            <Legend
                                verticalAlign="bottom"
                                height={36}
                                wrapperStyle={{
                                    paddingTop: '20px',
                                    fontSize: '12px',
                                    color: 'hsl(var(--muted-foreground))'
                                }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Summary Stats */}
                <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                    <div className="text-center p-2 bg-muted/20 rounded-lg">
                        <p className="text-muted-foreground">Highest Impact</p>
                        <p className="font-semibold text-foreground">Data Breach Prevention</p>
                        <p className="text-xs text-muted-foreground">${data[0]?.value.toLocaleString()}</p>
                    </div>
                    <div className="text-center p-2 bg-muted/20 rounded-lg">
                        <p className="text-muted-foreground">Monthly Growth</p>
                        <p className="font-semibold text-green-500">+23%</p>
                        <p className="text-xs text-muted-foreground">vs last month</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}