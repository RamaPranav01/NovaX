"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  User,
  Shield,
  Bell,
  Key,
  Database,
  Save,
  RefreshCw,
  Download,
  Upload
} from "lucide-react";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  
  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "security", label: "Security", icon: Shield },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "api", label: "API Keys", icon: Key },
    { id: "system", label: "System", icon: Database },
  ];

  const ProfileSettings = () => (
    <div className="space-y-6">
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>Update your account details and preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">First Name</Label>
              <Input id="firstName" defaultValue="Admin" />
            </div>
            <div>
              <Label htmlFor="lastName">Last Name</Label>
              <Input id="lastName" defaultValue="User" />
            </div>
          </div>
          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input id="email" type="email" defaultValue="admin@nova.ai" />
          </div>
          <div>
            <Label htmlFor="organization">Organization</Label>
            <Input id="organization" defaultValue="Nova Security Inc." />
          </div>
          <div>
            <Label htmlFor="timezone">Timezone</Label>
            <Select defaultValue="utc">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="utc">UTC</SelectItem>
                <SelectItem value="est">Eastern Time</SelectItem>
                <SelectItem value="pst">Pacific Time</SelectItem>
                <SelectItem value="cet">Central European Time</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button className="w-full md:w-auto">
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  const SecuritySettings = () => (
    <div className="space-y-6">
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle>Password & Authentication</CardTitle>
          <CardDescription>Manage your login credentials and security settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="currentPassword">Current Password</Label>
            <Input id="currentPassword" type="password" />
          </div>
          <div>
            <Label htmlFor="newPassword">New Password</Label>
            <Input id="newPassword" type="password" />
          </div>
          <div>
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <Input id="confirmPassword" type="password" />
          </div>
          <Button className="w-full md:w-auto">
            <Save className="h-4 w-4 mr-2" />
            Update Password
          </Button>
        </CardContent>
      </Card>

      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle>Two-Factor Authentication</CardTitle>
          <CardDescription>Add an extra layer of security to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Authenticator App</p>
              <p className="text-sm text-muted-foreground">Use an app like Google Authenticator</p>
            </div>
            <Badge variant="secondary">Not Enabled</Badge>
          </div>
          <Button variant="outline" className="mt-4">
            Enable 2FA
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  const NotificationSettings = () => (
    <div className="space-y-6">
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle>Notification Preferences</CardTitle>
          <CardDescription>Choose what notifications you want to receive</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { label: "Security Alerts", description: "High-priority security events and threats", enabled: true },
            { label: "Policy Violations", description: "When policies are violated or triggered", enabled: true },
            { label: "System Updates", description: "System maintenance and updates", enabled: false },
            { label: "Weekly Reports", description: "Weekly summary of security metrics", enabled: true },
            { label: "API Alerts", description: "API rate limits and errors", enabled: false },
          ].map((notification, index) => (
            <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">{notification.label}</p>
                <p className="text-sm text-muted-foreground">{notification.description}</p>
              </div>
              <Badge variant={notification.enabled ? "default" : "secondary"}>
                {notification.enabled ? "Enabled" : "Disabled"}
              </Badge>
            </div>
          ))}
          <Button className="w-full md:w-auto">
            <Save className="h-4 w-4 mr-2" />
            Save Preferences
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  const ApiSettings = () => (
    <div className="space-y-6">
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle>API Keys</CardTitle>
          <CardDescription>Manage your API keys for Nova integration</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            {[
              { name: "Production API Key", key: "nv_prod_**********************", created: "2024-01-10", lastUsed: "2 hours ago" },
              { name: "Development API Key", key: "nv_dev_**********************", created: "2024-01-08", lastUsed: "1 day ago" },
            ].map((apiKey, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">{apiKey.name}</p>
                  <p className="text-sm text-muted-foreground font-mono">{apiKey.key}</p>
                  <p className="text-xs text-muted-foreground">Created: {apiKey.created} • Last used: {apiKey.lastUsed}</p>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="text-destructive">
                    Revoke
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <Button>
            <Key className="h-4 w-4 mr-2" />
            Generate New Key
          </Button>
        </CardContent>
      </Card>

      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle>API Configuration</CardTitle>
          <CardDescription>Configure API limits and behavior</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="rateLimit">Rate Limit (requests per minute)</Label>
            <Input id="rateLimit" type="number" defaultValue="1000" />
          </div>
          <div>
            <Label htmlFor="timeout">Request Timeout (seconds)</Label>
            <Input id="timeout" type="number" defaultValue="30" />
          </div>
          <Button className="w-full md:w-auto">
            <Save className="h-4 w-4 mr-2" />
            Save Configuration
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  const SystemSettings = () => (
    <div className="space-y-6">
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle>System Information</CardTitle>
          <CardDescription>View system status and configuration</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Nova Version</Label>
              <p className="text-sm font-mono">v2.1.0</p>
            </div>
            <div className="space-y-2">
              <Label>Database Status</Label>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm">Connected</span>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Cache Status</Label>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm">Operational</span>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Last Backup</Label>
              <p className="text-sm">2024-01-15 03:00 UTC</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle>Data Management</CardTitle>
          <CardDescription>Export and import system data</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <Button variant="outline" className="flex-1">
              <Download className="h-4 w-4 mr-2" />
              Export Logs
            </Button>
            <Button variant="outline" className="flex-1">
              <Download className="h-4 w-4 mr-2" />
              Export Policies
            </Button>
            <Button variant="outline" className="flex-1">
              <Upload className="h-4 w-4 mr-2" />
              Import Configuration
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-destructive/20">
        <CardHeader>
          <CardTitle className="text-destructive">Danger Zone</CardTitle>
          <CardDescription>Irreversible and destructive actions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button variant="destructive" className="w-full md:w-auto">
            Reset All Settings
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case "profile": return <ProfileSettings />;
      case "security": return <SecuritySettings />;
      case "notifications": return <NotificationSettings />;
      case "api": return <ApiSettings />;
      case "system": return <SystemSettings />;
      default: return <ProfileSettings />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
            Settings
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Configure your Nova security platform
          </p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:w-64">
          <Card className="border-primary/20">
            <CardContent className="p-2">
              <nav className="space-y-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`
                        w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-left
                        ${activeTab === tab.id 
                          ? 'bg-primary text-primary-foreground' 
                          : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                        }
                      `}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
}