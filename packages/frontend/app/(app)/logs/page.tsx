"use client";

import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    FileText,
    Search,
    Filter,
    Download,
    Shield,
    AlertTriangle,
    CheckCircle,
    Clock,
    Eye,
    Snowflake,
    ShieldCheck,
    ChevronDown,
    ChevronRight
} from "lucide-react";

// Mock data for logs
const mockLogs = [
    {
        id: "log_001",
        timestamp: "2024-01-15 14:30:25",
        user_message: "What's my credit card number?",
        ai_response: "I cannot provide personal financial information.",
        status: "blocked" as const,
        threat_detected: true,
        policy_violations: ["personal_info"],
        response_time: 145,
        hash: "a1b2c3d4e5f6",
        severity: "high" as const
    },
    {
        id: "log_002",
        timestamp: "2024-01-15 14:28:12",
        user_message: "How do I reset my password?",
        ai_response: "To reset your password, go to the login page and click 'Forgot Password'...",
        status: "success" as const,
        threat_detected: false,
        policy_violations: [],
        response_time: 89,
        hash: "f6e5d4c3b2a1",
        severity: "low" as const
    },
    {
        id: "log_003",
        timestamp: "2024-01-15 14:25:45",
        user_message: "Can you diagnose my symptoms?",
        ai_response: "I cannot provide medical diagnoses. Please consult a healthcare professional.",
        status: "blocked" as const,
        threat_detected: true,
        policy_violations: ["medical_advice"],
        response_time: 156,
        hash: "b2c3d4e5f6a1",
        severity: "medium" as const
    },
    {
        id: "log_004",
        timestamp: "2024-01-15 14:22:18",
        user_message: "What's the weather like today?",
        ai_response: "I don't have access to real-time weather data, but I can help you find weather resources...",
        status: "success" as const,
        threat_detected: false,
        policy_violations: [],
        response_time: 67,
        hash: "c3d4e5f6a1b2",
        severity: "low" as const
    }
];

export default function LogsPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

    const filteredLogs = mockLogs.filter(log => {
        const matchesSearch = log.user_message.toLowerCase().includes(searchTerm.toLowerCase()) ||
            log.ai_response.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === "all" || log.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const toggleRowExpansion = (logId: string) => {
        const newExpanded = new Set(expandedRows);
        if (newExpanded.has(logId)) {
            newExpanded.delete(logId);
        } else {
            newExpanded.add(logId);
        }
        setExpandedRows(newExpanded);
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "blocked":
                return <Badge variant="destructive" className="flex items-center space-x-1">
                    <Shield className="h-3 w-3" />
                    <span>Blocked</span>
                </Badge>;
            case "warning":
                return <Badge variant="secondary" className="flex items-center space-x-1 bg-yellow-500/10 text-yellow-500 border-yellow-500/20">
                    <AlertTriangle className="h-3 w-3" />
                    <span>Warning</span>
                </Badge>;
            case "success":
                return <Badge variant="secondary" className="flex items-center space-x-1 bg-green-500/10 text-green-500 border-green-500/20">
                    <CheckCircle className="h-3 w-3" />
                    <span>Success</span>
                </Badge>;
            default:
                return <Badge variant="outline">Unknown</Badge>;
        }
    };

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case "high": return "text-destructive";
            case "medium": return "text-yellow-500";
            case "low": return "text-green-500";
            default: return "text-muted-foreground";
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                        Investigation Room
                    </h1>
                    <p className="text-muted-foreground mt-2 text-lg">
                        Analyze security events and audit trails in real-time
                    </p>
                </div>
                <div className="flex items-center space-x-3">
                    <Button variant="outline" className="border-primary/30 text-primary hover:bg-primary/10">
                        <Download className="h-4 w-4 mr-2" />
                        Export Logs
                    </Button>
                </div>
            </div>

            {/* Filters */}
            <Card className="border-primary/20">
                <CardHeader className="pb-4">
                    <CardTitle className="flex items-center space-x-2">
                        <Filter className="h-5 w-5 text-primary" />
                        <span>Filters & Search</span>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search logs by message content..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Filter by status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="success">Success</SelectItem>
                                <SelectItem value="blocked">Blocked</SelectItem>
                                <SelectItem value="warning">Warning</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Logs Table */}
            <Card className="border-primary/20">
                <CardHeader className="pb-4">
                    <CardTitle className="flex items-center space-x-2">
                        <FileText className="h-5 w-5 text-primary" />
                        <span>Security Event Logs</span>
                    </CardTitle>
                    <CardDescription>
                        {filteredLogs.length} events found
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[50px]"></TableHead>
                                <TableHead>Timestamp</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Message Preview</TableHead>
                                <TableHead>Response Time</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredLogs.map((log) => (
                                <React.Fragment key={log.id}>
                                    <TableRow
                                        className="cursor-pointer hover:bg-muted/50"
                                        onClick={() => toggleRowExpansion(log.id)}
                                    >
                                        <TableCell>
                                            <Button variant="ghost" size="sm" className="p-0 h-6 w-6">
                                                {expandedRows.has(log.id) ?
                                                    <ChevronDown className="h-4 w-4" /> :
                                                    <ChevronRight className="h-4 w-4" />
                                                }
                                            </Button>
                                        </TableCell>
                                        <TableCell className="font-mono text-sm">
                                            {log.timestamp}
                                        </TableCell>
                                        <TableCell>
                                            {getStatusBadge(log.status)}
                                        </TableCell>
                                        <TableCell className="max-w-[300px] truncate">
                                            {log.user_message}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center space-x-1">
                                                <Clock className="h-3 w-3 text-muted-foreground" />
                                                <span className="text-sm">{log.response_time}ms</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center space-x-2">
                                                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                                {log.threat_detected && (
                                                    <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                                                        <Snowflake className="h-4 w-4" />
                                                    </Button>
                                                )}
                                                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                                                    <ShieldCheck className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>

                                    {/* Expanded Row Details */}
                                    {expandedRows.has(log.id) && (
                                        <TableRow>
                                            <TableCell colSpan={6} className="bg-muted/20 p-6">
                                                <div className="space-y-4">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                        {/* User Message */}
                                                        <div>
                                                            <h4 className="font-semibold mb-2 flex items-center space-x-2">
                                                                <span>User Message</span>
                                                            </h4>
                                                            <div className="bg-card p-3 rounded-lg border">
                                                                <p className="text-sm">{log.user_message}</p>
                                                            </div>
                                                        </div>

                                                        {/* AI Response */}
                                                        <div>
                                                            <h4 className="font-semibold mb-2">AI Response</h4>
                                                            <div className="bg-card p-3 rounded-lg border">
                                                                <p className="text-sm">{log.ai_response}</p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Threat Analysis */}
                                                    {log.threat_detected && (
                                                        <div>
                                                            <h4 className="font-semibold mb-2 text-destructive">Threat Analysis</h4>
                                                            <div className="bg-destructive/10 p-3 rounded-lg border border-destructive/20">
                                                                <div className="flex flex-wrap gap-2">
                                                                    {log.policy_violations.map((violation) => (
                                                                        <Badge key={violation} variant="destructive">
                                                                            {violation.replace('_', ' ')}
                                                                        </Badge>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Technical Details */}
                                                    <div>
                                                        <h4 className="font-semibold mb-2">Technical Details</h4>
                                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                                            <div>
                                                                <span className="text-muted-foreground">Log ID:</span>
                                                                <p className="font-mono">{log.id}</p>
                                                            </div>
                                                            <div>
                                                                <span className="text-muted-foreground">Hash:</span>
                                                                <p className="font-mono">{log.hash}</p>
                                                            </div>
                                                            <div>
                                                                <span className="text-muted-foreground">Response Time:</span>
                                                                <p>{log.response_time}ms</p>
                                                            </div>
                                                            <div>
                                                                <span className="text-muted-foreground">Severity:</span>
                                                                <p className={getSeverityColor(log.severity)}>{log.severity}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </React.Fragment>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}