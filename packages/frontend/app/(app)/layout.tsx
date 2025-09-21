"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import "../globals.css";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, 
  BarChart3, 
  FileText, 
  Settings, 
  Menu, 
  X,
  LogOut,
  User,
  ChevronLeft,
  ChevronRight,
  Bell,
  Search,
  Activity
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: BarChart3, badge: null },
  { name: "Investigation Room", href: "/logs", icon: FileText, badge: "3" },
  { name: "Policies", href: "/policies", icon: Shield, badge: null },
  { name: "Settings", href: "/settings", icon: Settings, badge: null },
];

// Mock notifications data
const mockNotifications = [
  {
    id: 1,
    title: "High-Risk Threat Blocked",
    message: "Prompt injection attempt detected and blocked from user session #4521",
    time: "2 minutes ago",
    type: "threat",
    read: false
  },
  {
    id: 2,
    title: "Policy Update Required",
    message: "Medical advice policy needs review due to new compliance requirements",
    time: "1 hour ago",
    type: "policy",
    read: false
  },
  {
    id: 3,
    title: "Suspicious Activity Detected",
    message: "Multiple failed authentication attempts from IP 192.168.1.100",
    time: "2 hours ago",
    type: "threat",
    read: false
  },
  {
    id: 4,
    title: "System Performance Alert",
    message: "API response time increased to 89ms - still within acceptable range",
    time: "3 hours ago",
    type: "system",
    read: true
  },
  {
    id: 5,
    title: "Trust Verification Success",
    message: "Successfully verified 1,247 responses against reliable sources today",
    time: "6 hours ago",
    type: "success",
    read: true
  },
  {
    id: 6,
    title: "Database Backup Completed",
    message: "Scheduled backup of audit logs completed successfully (2.3TB)",
    time: "8 hours ago",
    type: "success",
    read: true
  },
  {
    id: 7,
    title: "New Security Policy Activated",
    message: "Anti-phishing policy has been enabled for all user sessions",
    time: "12 hours ago",
    type: "policy",
    read: true
  },
  {
    id: 8,
    title: "Malware Detection Alert",
    message: "Potential malware signature detected in uploaded file analysis",
    time: "18 hours ago",
    type: "threat",
    read: true
  },
  {
    id: 9,
    title: "System Maintenance Scheduled",
    message: "Planned maintenance window scheduled for tomorrow 2:00 AM - 4:00 AM UTC",
    time: "1 day ago",
    type: "system",
    read: true
  },
  {
    id: 10,
    title: "New User Registration",
    message: "New team member added to Nova security dashboard",
    time: "1 day ago",
    type: "info",
    read: true
  },
  {
    id: 11,
    title: "API Rate Limit Exceeded",
    message: "Trust verification API hit rate limit - temporary slowdown expected",
    time: "2 days ago",
    type: "system",
    read: true
  },
  {
    id: 12,
    title: "Compliance Report Generated",
    message: "Monthly security compliance report is ready for review",
    time: "2 days ago",
    type: "info",
    read: true
  },
  {
    id: 13,
    title: "Critical Vulnerability Patched",
    message: "Security patch applied to fix CVE-2024-1234 in authentication module",
    time: "3 days ago",
    type: "success",
    read: true
  },
  {
    id: 14,
    title: "Threat Intelligence Update",
    message: "New threat signatures added to detection engine from security feeds",
    time: "3 days ago",
    type: "info",
    read: true
  },
  {
    id: 15,
    title: "Storage Capacity Warning",
    message: "Audit log storage is at 85% capacity - consider archiving old logs",
    time: "4 days ago",
    type: "system",
    read: true
  }
];

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [headerOpacity, setHeaderOpacity] = useState(0);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState(mockNotifications);
  const notificationRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const maxScroll = 100; // Full opacity at 100px scroll
      
      // Calculate opacity based on scroll position
      const opacity = Math.min(currentScrollY / maxScroll, 1);
      setHeaderOpacity(opacity);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle click outside notifications
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
    };

    if (notificationsOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [notificationsOpen]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const toggleNotifications = () => {
    setNotificationsOpen(!notificationsOpen);
  };

  const markAsRead = (id: number) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'threat':
        return <Shield className="h-4 w-4 text-red-500" />;
      case 'policy':
        return <Settings className="h-4 w-4 text-yellow-500" />;
      case 'system':
        return <Activity className="h-4 w-4 text-blue-500" />;
      case 'success':
        return <Shield className="h-4 w-4 text-green-500" />;
      default:
        return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="flex h-screen bg-background" suppressHydrationWarning>
      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 bg-card border-r border-border transform transition-all duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        ${sidebarCollapsed ? 'w-16' : 'w-64'}
      `} suppressHydrationWarning>
        <div className="flex h-full flex-col" suppressHydrationWarning>
          {/* Header */}
          <div className="flex h-16 items-center justify-between px-4 border-b border-border" suppressHydrationWarning>
            <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
              <div className="p-1 rounded-lg bg-primary/10">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              {!sidebarCollapsed && (
                <span className="text-lg font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  Nova
                </span>
              )}
            </Link>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                className="hidden lg:flex text-muted-foreground hover:text-foreground"
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              >
                {sidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden text-muted-foreground hover:text-foreground"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Navigation */}
          <ScrollArea className="flex-1 px-2 py-6">
            <nav className="space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`
                      flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 group relative
                      ${sidebarCollapsed ? 'justify-center' : 'space-x-3'}
                      ${isActive 
                        ? 'bg-primary text-primary-foreground shadow-lg' 
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                      }
                    `}
                    onClick={() => setSidebarOpen(false)}
                    title={sidebarCollapsed ? item.name : undefined}
                  >
                    <item.icon className="h-4 w-4 flex-shrink-0" />
                    {!sidebarCollapsed && (
                      <>
                        <span className="flex-1">{item.name}</span>
                        {item.badge && (
                          <span className="bg-destructive text-white text-xs px-1.5 py-0.5 rounded-full">
                            {item.badge}
                          </span>
                        )}
                      </>
                    )}
                    {sidebarCollapsed && item.badge && (
                      <div className="absolute -top-1 -right-1 bg-destructive text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                        {item.badge}
                      </div>
                    )}
                  </Link>
                );
              })}
            </nav>
          </ScrollArea>

          {/* User section */}
          <div className="border-t border-border p-3">
            {sidebarCollapsed ? (
              <div className="flex flex-col items-center space-y-2">
                <div className="h-8 w-8 rounded-full bg-gradient-to-r from-primary to-primary/70 flex items-center justify-center">
                  <User className="h-4 w-4 text-primary-foreground" />
                </div>
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground p-1">
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 rounded-full bg-gradient-to-r from-primary to-primary/70 flex items-center justify-center">
                  <User className="h-4 w-4 text-primary-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    Admin User
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    admin@nova.ai
                  </p>
                </div>
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0" suppressHydrationWarning>
        {/* Top bar */}
        <div className="h-16 border-b border-border flex items-center justify-between px-6 transition-all duration-300 ease-in-out backdrop-blur-sm"
          style={{
            backgroundColor: `oklch(0.12 0.015 264.695 / ${headerOpacity * 0.8})`,
            borderColor: `oklch(0.25 0.02 264.695 / ${headerOpacity * 0.5})`
          }}
          suppressHydrationWarning>
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden text-muted-foreground hover:text-foreground"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-4 w-4" />
            </Button>
            
            {/* Search */}
            <div className="hidden md:flex items-center space-x-2 bg-muted/50 rounded-lg px-3 py-2 min-w-[300px]">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Search logs, policies, threats..." 
                className="bg-transparent border-none outline-none text-sm flex-1 text-foreground placeholder:text-muted-foreground"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* System Status */}
            <div className="hidden lg:flex items-center space-x-2 text-sm">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-muted-foreground">System Healthy</span>
              </div>
            </div>
            
            {/* Notifications */}
            <div className="relative" ref={notificationRef}>
              <Button 
                variant="ghost" 
                size="sm" 
                className="relative text-muted-foreground hover:text-foreground"
                onClick={toggleNotifications}
              >
                <Bell className="h-4 w-4" />
                {unreadCount > 0 && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-destructive rounded-full flex items-center justify-center">
                    <span className="text-xs text-white">{unreadCount}</span>
                  </div>
                )}
              </Button>

              {/* Enhanced Notifications Dropdown */}
              {notificationsOpen && (
                <div className="absolute right-0 top-full mt-3 w-96 bg-card/95 backdrop-blur-xl border border-border/50 rounded-xl shadow-2xl shadow-black/10 z-50 overflow-hidden animate-in slide-in-from-top-2 duration-200">
                  {/* Header with enhanced styling */}
                  <div className="px-4 pt-4 pb-3 border-b border-border/30 bg-gradient-to-r from-card to-card/80">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Bell className="h-4 w-4 text-primary" />
                        <span className="font-semibold text-foreground">Notifications</span>
                      </div>
                      {unreadCount > 0 && (
                        <Badge variant="destructive" className="text-xs px-2 py-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-lg">
                          {unreadCount} new
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Scrollable notifications list */}
                  <div className="max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
                    <div className="p-2">
                      {notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`
                            relative p-3 mb-2 rounded-xl cursor-pointer transition-all duration-200 group
                            ${!notification.read 
                              ? 'bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/10' 
                              : 'bg-muted/30 hover:bg-muted/50 border border-transparent hover:border-border/50'
                            }
                            hover:scale-[1.02] hover:-translate-y-0.5
                          `}
                          onClick={() => markAsRead(notification.id)}
                        >
                          {/* Notification content */}
                          <div className="flex items-start space-x-3">
                            {/* Icon with enhanced styling */}
                            <div className={`
                              flex-shrink-0 mt-0.5 p-2 rounded-lg transition-all duration-200
                              ${notification.type === 'threat' ? 'bg-red-500/20 group-hover:bg-red-500/30' : ''}
                              ${notification.type === 'policy' ? 'bg-yellow-500/20 group-hover:bg-yellow-500/30' : ''}
                              ${notification.type === 'system' ? 'bg-blue-500/20 group-hover:bg-blue-500/30' : ''}
                              ${notification.type === 'success' ? 'bg-green-500/20 group-hover:bg-green-500/30' : ''}
                              ${notification.type === 'info' ? 'bg-gray-500/20 group-hover:bg-gray-500/30' : ''}
                            `}>
                              {getNotificationIcon(notification.type)}
                            </div>
                            
                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between">
                                <h4 className={`text-sm font-semibold leading-tight ${
                                  !notification.read ? 'text-foreground' : 'text-muted-foreground'
                                }`}>
                                  {notification.title}
                                </h4>
                                {!notification.read && (
                                  <div className="w-2.5 h-2.5 bg-gradient-to-r from-primary to-primary/80 rounded-full flex-shrink-0 ml-2 animate-pulse shadow-lg shadow-primary/30"></div>
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed line-clamp-2">
                                {notification.message}
                              </p>
                              <div className="flex items-center justify-between mt-2">
                                <p className="text-xs text-muted-foreground/80 font-medium">
                                  {notification.time}
                                </p>
                                {!notification.read && (
                                  <span className="text-xs text-primary font-medium">New</span>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Subtle gradient overlay for unread */}
                          {!notification.read && (
                            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent rounded-xl pointer-events-none"></div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Activity Indicator */}
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
              <Activity className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-auto bg-background" suppressHydrationWarning>
          <div className="p-6" suppressHydrationWarning>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
} 