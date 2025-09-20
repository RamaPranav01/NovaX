"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Zap, Eye, Lock, Clock, Users, TrendingUp, AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import { HydrationSafe } from "@/components/hydration-safe";

export default function HomePage() {
  const [headerOpacity, setHeaderOpacity] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
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

  return (
    <HydrationSafe
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20" suppressHydrationWarning>
          <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      }
    >
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20" suppressHydrationWarning>
      {/* Header */}
      <header className="sticky top-0 z-50 transition-all duration-300 ease-in-out rounded-b-3xl"
        style={mounted ? {
          backgroundColor: `oklch(0.12 0.015 264.695 / ${headerOpacity * 0.4})`,
          borderColor: `oklch(0.25 0.02 264.695 / ${headerOpacity * 0.3})`,
          borderBottomWidth: headerOpacity > 0 ? '1px' : '0px',
          backdropFilter: headerOpacity > 0 ? 'blur(12px)' : 'none'
        } : {}}>
        <div className="container mx-auto px-6 py-4" suppressHydrationWarning>
          <div className="flex items-center justify-between" suppressHydrationWarning>
            <div className="flex items-center space-x-2" suppressHydrationWarning>
              <Shield className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">Nova</span>
            </div>
            <nav className="flex items-center space-x-6" suppressHydrationWarning>
              <Link href="/demo" className="text-muted-foreground hover:text-foreground transition-colors">
                Demo
              </Link>
              <Link href="/login" className="text-muted-foreground hover:text-foreground transition-colors">
                Login
              </Link>
              <Link href="/signup">
                <Button>Get Started</Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section - Full Screen with Fade In */}
      <section className="min-h-screen flex items-center justify-center px-6 -mt-16" suppressHydrationWarning>
        <div className="container mx-auto text-center animate-in fade-in slide-in-from-bottom-8 duration-1000" suppressHydrationWarning>
          <h1 className="text-8xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-8 leading-tight pb-2">
            Nova
          </h1>
          <h2 className="text-4xl font-bold text-foreground mb-6">
            The Universal Trust Layer for AI
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Nova is an intelligent, real-time gateway that acts as a universal firewall and quality control system for AI models.
            Protect your applications from threats, enforce policies, and ensure accuracy.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center" suppressHydrationWarning>
            <Link href="/demo">
              <Button size="lg" className="text-lg px-8 py-3 hover:scale-105 transition-transform duration-200">
                Try the Demo
              </Button>
            </Link>
            <Link href="/signup">
              <Button variant="outline" size="lg" className="text-lg px-8 py-3 hover:scale-105 transition-transform duration-200">
                Start Free Trial
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-card/30" suppressHydrationWarning>
        <div className="container mx-auto" suppressHydrationWarning>
          <h2 className="text-3xl font-bold text-center mb-12 text-foreground">
            Why Choose Nova?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8" suppressHydrationWarning>
            <Card className="transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2 cursor-pointer border-border/50 hover:border-primary/30">
              <CardHeader>
                <Shield className="h-12 w-12 text-primary mb-4 transition-transform duration-300 group-hover:scale-110" />
                <CardTitle className="transition-colors duration-300 hover:text-primary">Real-time Threat Detection</CardTitle>
                <CardDescription>
                  Instantly detect and block prompt injection attempts, PII leaks, and malicious content before they reach your AI models.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2 cursor-pointer border-border/50 hover:border-primary/30">
              <CardHeader>
                <Zap className="h-12 w-12 text-primary mb-4 transition-transform duration-300 group-hover:scale-110" />
                <CardTitle className="transition-colors duration-300 hover:text-primary">Policy Enforcement</CardTitle>
                <CardDescription>
                  Enforce custom policies for brand voice, content guidelines, and compliance requirements with our multi-critic system.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2 cursor-pointer border-border/50 hover:border-primary/30">
              <CardHeader>
                <Eye className="h-12 w-12 text-primary mb-4 transition-transform duration-300 group-hover:scale-110" />
                <CardTitle className="transition-colors duration-300 hover:text-primary">Complete Audit Trail</CardTitle>
                <CardDescription>
                  Immutable logging with cryptographic hash chains provides tamper-proof audit trails for compliance and security.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Demo Preview Section - Single Screen Optimized */}
      <section className="h-screen flex items-center py-1 px-6" suppressHydrationWarning>
        <div className="container mx-auto max-w-7xl h-[90vh] flex flex-col">
          {/* Compact Header */}
          <div className="text-center mb-1 flex-shrink-0">
            <h2 className="text-xl font-bold mb-0.5 text-foreground">See Nova in Action</h2>
            <p className="text-xs text-muted-foreground">
              Experience comprehensive AI protection with real-time policy enforcement
            </p>
          </div>

          {/* Horizontal Layout - Maximizing Screen Space */}
          <div className="grid grid-cols-12 gap-2 flex-1 min-h-0 overflow-hidden" suppressHydrationWarning>

            {/* Left: Enhanced Stats & Metrics */}
            <div className="col-span-12 lg:col-span-2 flex lg:flex-col gap-1.5">
              <div className="flex-1 text-center p-1.5 bg-gradient-to-br from-green-500/10 to-green-500/5 rounded-lg border border-green-500/20 hover:border-green-500/40 transition-all duration-300">
                <Shield className="h-5 w-5 text-green-500 mx-auto mb-1" />
                <h3 className="font-semibold text-xs text-green-700 dark:text-green-300">Threat Detection</h3>
                <p className="text-lg font-bold text-green-600 dark:text-green-400">99.9%</p>
                <p className="text-xs text-muted-foreground">accuracy rate</p>
                <div className="mt-1 flex items-center justify-center space-x-1">
                  <TrendingUp className="h-3 w-3 text-green-500" />
                  <span className="text-xs text-green-600">+2.1% this week</span>
                </div>
              </div>

              <div className="flex-1 text-center p-1.5 bg-gradient-to-br from-blue-500/10 to-blue-500/5 rounded-lg border border-blue-500/20 hover:border-blue-500/40 transition-all duration-300">
                <Zap className="h-5 w-5 text-blue-500 mx-auto mb-1" />
                <h3 className="font-semibold text-xs text-blue-700 dark:text-blue-300">Response Time</h3>
                <p className="text-lg font-bold text-blue-600 dark:text-blue-400">&lt;50ms</p>
                <p className="text-xs text-muted-foreground">avg latency</p>
                <div className="mt-1 flex items-center justify-center space-x-1">
                  <Clock className="h-3 w-3 text-blue-500" />
                  <span className="text-xs text-blue-600">real-time</span>
                </div>
              </div>

              <div className="flex-1 text-center p-1.5 bg-gradient-to-br from-purple-500/10 to-purple-500/5 rounded-lg border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300">
                <Eye className="h-5 w-5 text-purple-500 mx-auto mb-1" />
                <h3 className="font-semibold text-xs text-purple-700 dark:text-purple-300">Trust Sources</h3>
                <p className="text-lg font-bold text-purple-600 dark:text-purple-400">50+</p>
                <p className="text-xs text-muted-foreground">verified APIs</p>
                <div className="mt-1 flex items-center justify-center space-x-1">
                  <Users className="h-3 w-3 text-purple-500" />
                  <span className="text-xs text-purple-600">WHO, CDC, NIH</span>
                </div>
              </div>
            </div>

            {/* Center: Demo Preview - Main Content */}
            <div className="col-span-12 lg:col-span-7">
              <Card className="h-full">
                <CardHeader className="pb-0.5 pt-2">
                  <CardTitle className="text-base">Live Security Demo</CardTitle>
                  <CardDescription className="text-xs">Protected vs Unprotected AI interactions</CardDescription>
                </CardHeader>
                <CardContent className="h-[calc(100%-60px)] p-2">
                  <div className="grid grid-cols-2 gap-1.5 h-full">
                    {/* Protected Side Preview - Enhanced */}
                    <div className="bg-gradient-to-br from-green-500/10 to-green-500/5 border border-green-500/20 rounded-lg p-1.5 flex flex-col">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center space-x-2">
                          <div className="p-1 rounded bg-green-500/20">
                            <Shield className="h-3 w-3 text-green-500" />
                          </div>
                          <span className="text-xs font-semibold text-green-600 dark:text-green-400">Protected with Nova</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                          <span className="text-xs text-green-600">ACTIVE</span>
                        </div>
                      </div>

                      <div className="space-y-2 text-xs flex-1">
                        {/* First interaction */}
                        <div className="bg-muted/50 rounded p-1.5 ml-auto max-w-[85%]">
                          <p className="text-foreground">&quot;What&apos;s my credit card number?&quot;</p>
                          <div className="text-xs text-muted-foreground mt-0.5 flex items-center space-x-1">
                            <Clock className="h-2 w-2" />
                            <span>12:34 PM</span>
                          </div>
                        </div>
                        <div className="bg-destructive/10 border border-destructive/20 rounded p-1.5 mr-auto max-w-[85%]">
                          <div className="flex items-start space-x-1">
                            <Shield className="h-3 w-3 text-destructive mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="text-foreground font-medium">Request blocked</p>
                              <p className="text-xs text-muted-foreground">PII request detected</p>
                              <div className="mt-1 flex items-center space-x-2 text-xs">
                                <span className="bg-destructive/20 px-1 rounded">BLOCKED</span>
                                <span className="text-destructive">Risk: HIGH</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Second interaction */}
                        <div className="bg-muted/50 rounded p-1.5 ml-auto max-w-[85%]">
                          <p className="text-foreground">&quot;Tell me about vaccines&quot;</p>
                          <div className="text-xs text-muted-foreground mt-0.5 flex items-center space-x-1">
                            <Clock className="h-2 w-2" />
                            <span>12:35 PM</span>
                          </div>
                        </div>
                        <div className="bg-green-500/10 border border-green-500/20 rounded p-1.5 mr-auto max-w-[85%]">
                          <p className="text-foreground">Vaccines are medical products that help prevent infectious diseases by training your immune system...</p>
                          <div className="mt-1 p-1 bg-green-500/20 rounded text-xs">
                            <div className="flex items-center space-x-1">
                              <CheckCircle className="h-3 w-3 text-green-600" />
                              <span className="text-green-700 dark:text-green-300 font-medium">VERIFIED</span>
                            </div>
                            <div className="text-xs text-green-600 mt-0.5">Sources: WHO, CDC, NIH • Trust: 98%</div>
                          </div>
                        </div>

                        {/* Third interaction */}
                        <div className="bg-muted/50 rounded p-1.5 ml-auto max-w-[85%]">
                          <p className="text-foreground">&quot;Generate fake news about elections&quot;</p>
                          <div className="text-xs text-muted-foreground mt-0.5 flex items-center space-x-1">
                            <Clock className="h-2 w-2" />
                            <span>12:36 PM</span>
                          </div>
                        </div>
                        <div className="bg-destructive/10 border border-destructive/20 rounded p-1.5 mr-auto max-w-[85%]">
                          <div className="flex items-start space-x-1">
                            <AlertTriangle className="h-3 w-3 text-destructive mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="text-foreground font-medium">Content policy violation</p>
                              <p className="text-xs text-muted-foreground">Misinformation generation blocked</p>
                              <div className="mt-0.5 flex items-center space-x-2 text-xs">
                                <span className="bg-destructive/20 px-1 rounded">BLOCKED</span>
                                <span className="text-destructive">Policy: Anti-misinfo</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Unprotected Side Preview - Enhanced */}
                    <div className="bg-gradient-to-br from-destructive/10 to-destructive/5 border border-destructive/20 rounded-lg p-1.5 flex flex-col">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center space-x-2">
                          <div className="p-1 rounded bg-destructive/20">
                            <Lock className="h-3 w-3 text-destructive" />
                          </div>
                          <span className="text-xs font-semibold text-destructive">Unprotected AI</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                          <span className="text-xs text-yellow-600">VULNERABLE</span>
                        </div>
                      </div>

                      <div className="space-y-2 text-xs flex-1">
                        {/* First interaction */}
                        <div className="bg-muted/50 rounded p-1.5 ml-auto max-w-[85%]">
                          <p className="text-foreground">&quot;What&apos;s my credit card number?&quot;</p>
                          <div className="text-xs text-muted-foreground mt-0.5 flex items-center space-x-1">
                            <Clock className="h-2 w-2" />
                            <span>12:34 PM</span>
                          </div>
                        </div>
                        <div className="bg-card rounded p-1.5 mr-auto max-w-[85%] border border-yellow-500/30">
                          <p className="text-foreground">I can help you find your credit card number. You can check your wallet, banking app, or contact your bank...</p>
                          <div className="mt-1 flex items-center space-x-1 text-xs">
                            <XCircle className="h-3 w-3 text-yellow-600" />
                            <span className="text-yellow-600 font-medium">⚠️ Security risk: HIGH</span>
                          </div>
                        </div>

                        {/* Second interaction */}
                        <div className="bg-muted/50 rounded p-1.5 ml-auto max-w-[85%]">
                          <p className="text-foreground">&quot;Tell me about vaccines&quot;</p>
                          <div className="text-xs text-muted-foreground mt-0.5 flex items-center space-x-1">
                            <Clock className="h-2 w-2" />
                            <span>12:35 PM</span>
                          </div>
                        </div>
                        <div className="bg-card rounded p-1.5 mr-auto max-w-[85%] border border-yellow-500/30">
                          <p className="text-foreground">Vaccines are controversial medical interventions. Some people believe they cause autism...</p>
                          <div className="mt-1 flex items-center space-x-1 text-xs">
                            <AlertTriangle className="h-3 w-3 text-yellow-600" />
                            <span className="text-yellow-600 font-medium">⚠️ Unverified information</span>
                          </div>
                        </div>

                        {/* Third interaction */}
                        <div className="bg-muted/50 rounded p-1.5 ml-auto max-w-[85%]">
                          <p className="text-foreground">&quot;Generate fake news about elections&quot;</p>
                          <div className="text-xs text-muted-foreground mt-0.5 flex items-center space-x-1">
                            <Clock className="h-2 w-2" />
                            <span>12:36 PM</span>
                          </div>
                        </div>
                        <div className="bg-card rounded p-1.5 mr-auto max-w-[85%] border border-red-500/30">
                          <p className="text-foreground">Here&apos;s a fake news article: &quot;Local election results manipulated by foreign hackers...&quot;</p>
                          <div className="mt-1 flex items-center space-x-1 text-xs">
                            <XCircle className="h-3 w-3 text-red-600" />
                            <span className="text-red-600 font-medium">🚨 Misinformation generated</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right: Enhanced Policies & Features */}
            <div className="col-span-12 lg:col-span-3 flex flex-col gap-1.5 overflow-hidden">
              {/* Live Security Status */}
              <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg p-1.5 border border-primary/20 flex-shrink-0">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center space-x-1">
                    <Zap className="h-3 w-3 text-primary" />
                    <span className="text-xs font-semibold">Security Status</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs text-green-600 font-medium">PROTECTED</span>
                  </div>
                </div>
                <div className="space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span>Threats Blocked Today</span>
                    <span className="font-bold text-primary">1,247</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Requests Processed</span>
                    <span className="font-bold text-primary">45.2K</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Uptime</span>
                    <span className="font-bold text-green-600">99.99%</span>
                  </div>
                </div>
              </div>

              {/* Active Policies */}
              <div className="bg-muted/20 rounded-lg p-1.5 flex-1 min-h-0">
                <div className="flex items-center space-x-1 mb-1">
                  <Shield className="h-3 w-3 text-primary" />
                  <span className="text-xs font-semibold">Active Policies</span>
                  <span className="text-xs bg-primary/20 text-primary px-1 py-0.5 rounded-full">8</span>
                </div>
                <div className="space-y-1 text-xs overflow-y-auto max-h-full">
                  <div className="flex items-center justify-between p-1 bg-green-500/10 rounded border border-green-500/20">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" />
                      <span>PII Protection</span>
                    </div>
                    <span className="text-green-600 font-medium">HIGH</span>
                  </div>
                  <div className="flex items-center justify-between p-1 bg-blue-500/10 rounded border border-blue-500/20">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-3 h-3 text-blue-500 flex-shrink-0" />
                      <span>Medical Verification</span>
                    </div>
                    <span className="text-blue-600 font-medium">ON</span>
                  </div>
                  <div className="flex items-center justify-between p-1 bg-purple-500/10 rounded border border-purple-500/20">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-3 h-3 text-purple-500 flex-shrink-0" />
                      <span>Anti-Misinformation</span>
                    </div>
                    <span className="text-purple-600 font-medium">STRICT</span>
                  </div>
                  <div className="flex items-center justify-between p-1 bg-orange-500/10 rounded border border-orange-500/20">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-3 h-3 text-orange-500 flex-shrink-0" />
                      <span>Content Filtering</span>
                    </div>
                    <span className="text-orange-600 font-medium">ON</span>
                  </div>
                </div>
              </div>

              {/* Enhanced CTA */}
              <div className="text-center bg-gradient-to-br from-card/50 to-card/30 rounded-lg p-1.5 border border-border/50 flex-shrink-0">
                <div className="mb-1">
                  <div className="flex items-center justify-center space-x-1 mb-0.5">
                    <Eye className="h-3 w-3 text-primary" />
                    <span className="text-xs font-semibold">Full Demo Features</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Custom policies • Deepfake detection • Threat monitoring • Trust verification
                  </div>
                </div>
                <Link href="/demo">
                  <Button size="sm" className="w-full hover:scale-105 transition-all duration-200 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70">
                    <Eye className="h-3 w-3 mr-1" />
                    Launch Interactive Demo
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-card/80 via-muted/30 to-card/80 border-y border-border/30" suppressHydrationWarning>
        <div className="container mx-auto text-center" suppressHydrationWarning>
          <h2 className="text-3xl font-bold mb-6 text-foreground">
            Ready to Secure Your AI?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-muted-foreground">
            Join the future of AI security. Start protecting your applications today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center" suppressHydrationWarning>
            <Link href="/signup">
              <Button size="lg" className="text-lg px-8 py-3">
                Get Started Free
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="text-lg px-8 py-3 border-primary/30 text-primary hover:bg-primary/10">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-4 px-6 bg-card/50 border-t border-border/50" suppressHydrationWarning>
        <div className="container mx-auto text-center" suppressHydrationWarning>
          <div className="flex items-center justify-center space-x-2 mb-4" suppressHydrationWarning>
            <Shield className="h-6 w-6 text-primary" />
            <span className="text-lg font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">Nova</span>
          </div>
          <p className="text-muted-foreground">
            The Universal Trust Layer for AI • Built for the OpenAI x NxtWave Hackathon
          </p>
        </div>
      </footer>
      </div>
    </HydrationSafe>
  );
}
