"use client";

import { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Shield, AlertTriangle, CheckCircle, Send, Settings, Eye } from "lucide-react";
import Link from "next/link";
import { TrustWarningCard } from "@/components/demo/trust-warning-card";
import { MultiModalUpload } from "@/components/demo/multi-modal-upload";

interface Message {
  id: string;
  text: string;
  sender: "user" | "ai";
  timestamp: Date;
  status?: "blocked" | "warning" | "success";
  reason?: string;
  trustVerdict?: "SUPPORTED" | "CONTRADICTED" | "UNVERIFIED";
  trustConfidence?: number;
  trustSources?: string[];
  inboundCheck?: {
    verdict: "SAFE" | "MALICIOUS";
    reasoning: string;
    confidence_score: number;
    attack_type: string;
  };
  outboundCheck?: {
    verdict: "PASS" | "FAIL";
    reasoning: string;
    confidence_score: number;
  };
}

export default function DemoPage() {
  const [policy, setPolicy] = useState("Do not provide medical advice. Do not share personal information. Be helpful and professional.");
  const [protectedMessages, setProtectedMessages] = useState<Message[]>([]);
  const [unprotectedMessages, setUnprotectedMessages] = useState<Message[]>([]);
  const [protectedInput, setProtectedInput] = useState("");
  const [unprotectedInput, setUnprotectedInput] = useState("");
  const [isProtectedLoading, setIsProtectedLoading] = useState(false);
  const [isUnprotectedLoading, setIsUnprotectedLoading] = useState(false);
  const [headerOpacity, setHeaderOpacity] = useState(0);

  // Refs for potential future auto-scrolling feature
  // const protectedChatEndRef = useRef<HTMLDivElement>(null);
  // const unprotectedChatEndRef = useRef<HTMLDivElement>(null);

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

  const addMessage = (messages: Message[], setMessages: (messages: Message[]) => void, text: string, sender: "user" | "ai", status?: "blocked" | "warning" | "success", reason?: string, trustData?: { verdict: "SUPPORTED" | "CONTRADICTED" | "UNVERIFIED"; confidence: number; sources: string[] }, inboundCheck?: any, outboundCheck?: any) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      sender,
      timestamp: new Date(),
      status,
      reason,
      trustVerdict: trustData?.verdict,
      trustConfidence: trustData?.confidence,
      trustSources: trustData?.sources,
      inboundCheck,
      outboundCheck,
    };
    setMessages([...messages, newMessage]);
  };

  const handleProtectedSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!protectedInput.trim()) return;

    const userMessage = protectedInput.toLowerCase();
    addMessage(protectedMessages, setProtectedMessages, protectedInput, "user");
    setProtectedInput("");
    setIsProtectedLoading(true);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));

    try {
      // Mock Nova Gateway Response Logic
      let status: "success" | "warning" | "blocked" = "success";
      let aiResponse = "";
      let reason = "";
      let trustData: { verdict: "SUPPORTED" | "CONTRADICTED" | "UNVERIFIED"; confidence: number; sources: string[] } | undefined;
      let inboundCheck: any = {
        verdict: "SAFE" as const,
        reasoning: "No threats detected",
        confidence_score: 0.1,
        attack_type: "none"
      };
      let outboundCheck: any = {
        verdict: "PASS" as const,
        reasoning: "Response complies with policy",
        confidence_score: 0.1
      };

      // Check for blocked content
      if (userMessage.includes("credit card") || userMessage.includes("password") || userMessage.includes("ssn") || userMessage.includes("social security")) {
        status = "blocked";
        aiResponse = "I cannot provide assistance with personal financial information or sensitive data.";
        reason = "PII (Personally Identifiable Information) request detected";
        inboundCheck = {
          verdict: "MALICIOUS" as const,
          reasoning: "Personal information request detected",
          confidence_score: 0.95,
          attack_type: "pii_request"
        };
        outboundCheck = {
          verdict: "FAIL" as const,
          reasoning: "PII protection policy violation",
          confidence_score: 0.95
        };
      } else if (userMessage.includes("medical advice") || userMessage.includes("chest pain") || userMessage.includes("diagnosis") || userMessage.includes("medication")) {
        status = "blocked";
        aiResponse = "I cannot provide medical advice. Please consult with a healthcare professional.";
        reason = "Medical advice policy violation";
        inboundCheck = {
          verdict: "MALICIOUS" as const,
          reasoning: "Medical advice request detected",
          confidence_score: 0.95,
          attack_type: "medical_advice"
        };
        outboundCheck = {
          verdict: "FAIL" as const,
          reasoning: "Medical advice policy violation",
          confidence_score: 0.95
        };
      } else if (userMessage.includes("fake news") || userMessage.includes("generate lies") || userMessage.includes("misinformation")) {
        status = "blocked";
        aiResponse = "I cannot generate misleading or false information.";
        reason = "Misinformation generation blocked by content policy";
        inboundCheck = {
          verdict: "MALICIOUS" as const,
          reasoning: "Misinformation generation request detected",
          confidence_score: 0.95,
          attack_type: "misinformation"
        };
        outboundCheck = {
          verdict: "FAIL" as const,
          reasoning: "Content policy violation",
          confidence_score: 0.95
        };
      } else if (userMessage.includes("vaccine") || userMessage.includes("climate change") || userMessage.includes("covid") || userMessage.includes("health")) {
        // Medical/health topics with trust verification
        status = "success";
        aiResponse = "Vaccines are medical products designed to help prevent infectious diseases by training your immune system to recognize and fight specific pathogens. They have been extensively tested for safety and efficacy.";
        trustData = {
          verdict: "SUPPORTED",
          confidence: 94,
          sources: ["WHO", "CDC", "Scientific Journal", "Reuters"]
        };
      } else if (userMessage.includes("news") || userMessage.includes("recent") || userMessage.includes("current events")) {
        // News topics with trust verification
        status = "success";
        aiResponse = "I can provide information about recent developments. However, I recommend verifying current news from multiple reliable sources.";
        trustData = {
          verdict: "UNVERIFIED",
          confidence: 65,
          sources: ["BBC", "Reuters"]
        };
      } else {
        // General safe responses
        const responses = [
          "I'd be happy to help you with that question.",
          "That's an interesting topic. Let me provide some information.",
          "I can assist you with that. Here's what I know.",
          "Thank you for your question. I'll do my best to help."
        ];
        aiResponse = responses[Math.floor(Math.random() * responses.length)];
        
        // Sometimes add trust verification for general topics
        if (Math.random() > 0.7) {
          trustData = {
            verdict: ["SUPPORTED", "UNVERIFIED"][Math.floor(Math.random() * 2)] as "SUPPORTED" | "UNVERIFIED",
            confidence: Math.floor(Math.random() * 30) + 70,
            sources: ["Wikipedia", "Encyclopedia Britannica", "Academic Sources"].slice(0, Math.floor(Math.random() * 2) + 1)
          };
        }
      }

      addMessage(protectedMessages, setProtectedMessages, aiResponse, "ai", status, reason, trustData, inboundCheck, outboundCheck);

    } catch (error) {
      console.error("Protected chat error:", error);
      addMessage(protectedMessages, setProtectedMessages, "Error: Demo simulation failed.", "ai", "blocked", "Simulation error");
    } finally {
      setIsProtectedLoading(false);
    }
  };


  const handleUnprotectedSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!unprotectedInput.trim()) return;

    const userMessage = unprotectedInput.toLowerCase();
    addMessage(unprotectedMessages, setUnprotectedMessages, unprotectedInput, "user");
    setUnprotectedInput("");
    setIsUnprotectedLoading(true);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 800));

    try {
      // Mock Unprotected AI Response Logic (shows vulnerabilities)
      let aiResponse = "";

      if (userMessage.includes("credit card") || userMessage.includes("password") || userMessage.includes("ssn")) {
        aiResponse = "I can help you find your credit card number. You can check your wallet, banking app, or contact your bank directly. You might also find it in your email receipts or saved payment methods.";
      } else if (userMessage.includes("medical advice") || userMessage.includes("chest pain") || userMessage.includes("diagnosis")) {
        aiResponse = "Based on your symptoms, it could be several things. Chest pain might indicate heart problems, muscle strain, or anxiety. You should consider taking some pain medication and see if it improves.";
      } else if (userMessage.includes("fake news") || userMessage.includes("generate lies") || userMessage.includes("misinformation")) {
        aiResponse = "Here's a fake news article: 'Local Election Results Manipulated by Foreign Hackers - Exclusive Investigation Reveals Widespread Voter Fraud.' This type of content can be easily generated without verification.";
      } else if (userMessage.includes("vaccine")) {
        aiResponse = "Vaccines are controversial medical interventions. Some people believe they cause autism and other health problems. Many parents choose not to vaccinate their children due to these concerns.";
      } else if (userMessage.includes("climate change")) {
        aiResponse = "Climate change is a debated topic. While some scientists claim it's caused by human activity, others argue it's natural climate variation. The data can be interpreted in different ways.";
      } else if (userMessage.includes("covid")) {
        aiResponse = "COVID-19 has various theories about its origins and treatments. Some suggest alternative treatments like ivermectin or hydroxychloroquine, though mainstream medicine doesn't always agree.";
      } else {
        // General unprotected responses
        const responses = [
          "I can provide information on that topic without any restrictions or fact-checking.",
          "Here's what I know about that, though I haven't verified the sources.",
          "I'll share information on this topic without filtering for accuracy or safety.",
          "Let me give you an unrestricted response to your question."
        ];
        aiResponse = responses[Math.floor(Math.random() * responses.length)];
      }

      addMessage(unprotectedMessages, setUnprotectedMessages, aiResponse, "ai");

    } catch (error) {
      console.error("Unprotected chat error:", error);
      addMessage(unprotectedMessages, setUnprotectedMessages, "Error: Demo simulation failed.", "ai");
    } finally {
      setIsUnprotectedLoading(false);
    }
  };



  const getStatusIcon = (status?: string) => {
    switch (status) {
      case "blocked":
        return <AlertTriangle className="h-4 w-4 text-destructive" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "blocked":
        return "border-destructive/20 bg-destructive/10";
      case "warning":
        return "border-yellow-500/20 bg-yellow-500/10";
      case "success":
        return "border-green-500/20 bg-green-500/10";
      default:
        return "border-border bg-card";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-sm sticky top-0 z-50 transition-all duration-300 ease-in-out rounded-b-3xl"
        style={{
          backgroundColor: `oklch(0.08 0.01 264.695 / ${headerOpacity * 0.4})`,
          borderColor: `oklch(0.25 0.02 264.695 / ${headerOpacity * 0.3})`
        }}>
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
              <div className="p-2 rounded-lg bg-primary/10 security-glow">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Nova
              </span>
            </Link>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" className="border-primary/30 text-primary hover:bg-primary/10">
                <Settings className="h-4 w-4 mr-2" />
                Configure Policy
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Policy Configuration */}
        <Card className="mb-8 gradient-card border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="h-5 w-5 text-primary" />
              <span>Security Policy Configuration</span>
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Configure the security policies that Nova will enforce in real-time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Label htmlFor="policy" className="text-foreground">Custom Policy Rules</Label>
              <Textarea
                id="policy"
                value={policy}
                onChange={(e) => setPolicy(e.target.value)}
                placeholder="Enter your custom security policies..."
                className="min-h-[100px] bg-background border-border/50 focus:border-primary/50"
              />
            </div>
          </CardContent>
        </Card>

        {/* Chat Comparison Layout - Even Split */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Protected Side */}
          <Card className="h-[600px] flex flex-col border-green-500/20 bg-gradient-to-br from-green-500/5 to-green-500/10 hover:shadow-lg transition-all duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-green-500" />
                <span>Protected with Nova</span>
                <div className="ml-auto flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-green-600">ACTIVE</span>
                </div>
              </CardTitle>
              <CardDescription>
                Real-time threat detection and policy enforcement
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col p-0">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {protectedMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div className={`max-w-[80%] rounded-lg p-3 border ${getStatusColor(message.status)}`}>
                      <div className="flex items-start space-x-2">
                        {message.sender === "ai" && getStatusIcon(message.status)}
                        <div className="flex-1">
                          <p className="text-sm">{message.text}</p>
                          {message.reason && (
                            <p className="text-xs text-muted-foreground mt-1">
                              Reason: {message.reason}
                            </p>
                          )}
                          {message.inboundCheck && message.inboundCheck.verdict === "MALICIOUS" && (
                            <div className="mt-2 p-2 bg-red-500/10 border border-red-500/20 rounded text-xs">
                              <div className="flex items-center space-x-1 mb-1">
                                <AlertTriangle className="h-3 w-3 text-red-500" />
                                <span className="font-medium text-red-600">Inbound Threat Detected</span>
                              </div>
                              <p className="text-red-600">{message.inboundCheck.reasoning}</p>
                              <p className="text-muted-foreground">Attack Type: {message.inboundCheck.attack_type}</p>
                            </div>
                          )}
                          {message.outboundCheck && message.outboundCheck.verdict === "FAIL" && (
                            <div className="mt-2 p-2 bg-yellow-500/10 border border-yellow-500/20 rounded text-xs">
                              <div className="flex items-center space-x-1 mb-1">
                                <AlertTriangle className="h-3 w-3 text-yellow-500" />
                                <span className="font-medium text-yellow-600">Policy Violation</span>
                              </div>
                              <p className="text-yellow-600">{message.outboundCheck.reasoning}</p>
                            </div>
                          )}
                          {message.trustVerdict && (
                            <div className="mt-2">
                              <TrustWarningCard
                                verdict={message.trustVerdict}
                                confidence={message.trustConfidence}
                                sources={message.trustSources}
                                className="text-xs"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {isProtectedLoading && (
                  <div className="flex justify-start">
                    <div className="bg-muted/50 rounded-lg p-3 border">
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                        <span className="text-sm text-muted-foreground">Nova is analyzing...</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Input */}
              <form onSubmit={handleProtectedSubmit} className="p-4 border-t">
                <div className="flex space-x-2">
                  <Input
                    value={protectedInput}
                    onChange={(e) => setProtectedInput(e.target.value)}
                    placeholder="Type your message..."
                    disabled={isProtectedLoading}
                    className="flex-1"
                  />
                  <Button type="submit" disabled={isProtectedLoading || !protectedInput.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Unprotected Side */}
          <Card className="h-[600px] flex flex-col border-red-500/20 bg-gradient-to-br from-red-500/5 to-red-500/10 hover:shadow-lg transition-all duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                <span>Unprotected AI</span>
                <div className="ml-auto flex items-center space-x-1">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-yellow-600">VULNERABLE</span>
                </div>
              </CardTitle>
              <CardDescription>
                No security layer - vulnerable to threats
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col p-0">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {unprotectedMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div className="max-w-[80%] rounded-lg p-3 border bg-card">
                      <p className="text-sm">{message.text}</p>
                    </div>
                  </div>
                ))}
                {isUnprotectedLoading && (
                  <div className="flex justify-start">
                    <div className="bg-muted/50 rounded-lg p-3 border">
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-muted-foreground"></div>
                        <span className="text-sm text-muted-foreground">AI is responding...</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Input */}
              <form onSubmit={handleUnprotectedSubmit} className="p-4 border-t">
                <div className="flex space-x-2">
                  <Input
                    value={unprotectedInput}
                    onChange={(e) => setUnprotectedInput(e.target.value)}
                    placeholder="Type your message..."
                    disabled={isUnprotectedLoading}
                    className="flex-1"
                  />
                  <Button type="submit" disabled={isUnprotectedLoading || !unprotectedInput.trim()} variant="outline">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* V3 Features - Even Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Trust Verification */}
          <Card className="border-primary/20 hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-primary" />
                <span>Trust Verification Examples</span>
              </CardTitle>
              <CardDescription>
                See how Nova verifies information against reliable sources
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <TrustWarningCard
                verdict="SUPPORTED"
                confidence={92}
                sources={["Reuters", "BBC", "Associated Press"]}
                reasoning="Information matches verified reports from multiple reliable news sources"
              />
              <TrustWarningCard
                verdict="CONTRADICTED"
                confidence={87}
                sources={["Scientific Journal", "WHO"]}
                reasoning="Claims contradict established scientific consensus and official health guidelines"
              />
              <TrustWarningCard
                verdict="UNVERIFIED"
                confidence={45}
                sources={[]}
                reasoning="Unable to find reliable sources to verify this information"
              />
            </CardContent>
          </Card>

          {/* Deepfake Detection */}
          <MultiModalUpload className="border-primary/20 hover:shadow-lg transition-all duration-300" />
        </div>

        {/* Interactive Test Cases */}
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Eye className="h-5 w-5 text-primary" />
              <span>Try These Test Cases</span>
            </CardTitle>
            <CardDescription>
              Test Nova&apos;s comprehensive protection including trust verification and deepfake detection
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Medical Advice */}
              <div className="p-4 border border-red-500/30 rounded-lg bg-gradient-to-br from-red-500/10 to-red-500/5 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center space-x-2 mb-3">
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                  <h4 className="font-medium">Medical Advice</h4>
                </div>
                <p className="text-sm text-muted-foreground mb-3 italic">&ldquo;I have chest pain, what should I do?&rdquo;</p>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Shield className="h-3 w-3 text-green-500" />
                    <span className="text-xs text-green-600">Protected: Blocked</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="h-3 w-3 text-red-500" />
                    <span className="text-xs text-red-600">Unprotected: Provides Advice</span>
                  </div>
                </div>
              </div>

              {/* Trust Verification */}
              <div className="p-4 border border-yellow-500/30 rounded-lg bg-gradient-to-br from-yellow-500/10 to-yellow-500/5 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center space-x-2 mb-3">
                  <Eye className="h-4 w-4 text-yellow-500" />
                  <h4 className="font-medium">Trust Verification</h4>
                </div>
                <p className="text-sm text-muted-foreground mb-3 italic">&ldquo;Tell me about vaccines&rdquo;</p>
                <div className="space-y-1">
                  <p className="text-xs text-green-600">✓ Protected: Sources verified</p>
                  <p className="text-xs text-yellow-600">⚠ Unprotected: No verification</p>
                </div>
              </div>

              {/* Deepfake Detection */}
              <div className="p-4 border border-purple-500/30 rounded-lg bg-gradient-to-br from-purple-500/10 to-purple-500/5 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center space-x-2 mb-3">
                  <Shield className="h-4 w-4 text-purple-500" />
                  <h4 className="font-medium">Deepfake Detection</h4>
                </div>
                <p className="text-sm text-muted-foreground mb-3">Upload suspicious media files</p>
                <p className="text-xs text-purple-600">Analyzes images, audio, and video</p>
              </div>

              {/* PII Protection */}
              <div className="p-4 border border-blue-500/30 rounded-lg bg-gradient-to-br from-blue-500/10 to-blue-500/5 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center space-x-2 mb-3">
                  <CheckCircle className="h-4 w-4 text-blue-500" />
                  <h4 className="font-medium">PII Protection</h4>
                </div>
                <p className="text-sm text-muted-foreground mb-3 italic">&ldquo;What&apos;s my credit card?&rdquo;</p>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Shield className="h-3 w-3 text-green-500" />
                    <span className="text-xs text-green-600">Protected: Blocked</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="h-3 w-3 text-red-500" />
                    <span className="text-xs text-red-600">Unprotected: Provides Info</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
