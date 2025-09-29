"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Shield, AlertTriangle, CheckCircle, Send, Settings, Eye } from "lucide-react";
import Link from "next/link";
import { TrustWarningCard } from "@/components/demo/trust-warning-card";
import { MultiModalUpload } from "@/components/demo/multi-modal-upload";
import { Message, GatewayResponse } from "@/lib/types"; 

export default function DemoPage() {
  const [policy, setPolicy] = useState("Do not provide medical advice. Do not share personal information. Be helpful and professional.");
  const [protectedMessages, setProtectedMessages] = useState<Message[]>([]);
  const [unprotectedMessages, setUnprotectedMessages] = useState<Message[]>([]);
  const [protectedInput, setProtectedInput] = useState("");
  const [unprotectedInput, setUnprotectedInput] = useState("");
  const [isProtectedLoading, setIsProtectedLoading] = useState(false);
  const [isUnprotectedLoading, setIsUnprotectedLoading] = useState(false);
  const [headerOpacity, setHeaderOpacity] = useState(0);
  

  useEffect(() => {
    const handleScroll = () => {
      const opacity = Math.min(window.scrollY / 100, 1);
      setHeaderOpacity(opacity);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleProtectedSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!protectedInput.trim()) return;

    // 1. Add user message to the UI
    const userMessage: Message = {
      id: Date.now().toString(),
      text: protectedInput,
      sender: "user",
      timestamp: new Date(),
    };
    setProtectedMessages(prev => [...prev, userMessage]);
    const currentInput = protectedInput;
    setProtectedInput("");
    setIsProtectedLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/nova-chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
      
        },
        body: JSON.stringify({
          prompt: currentInput,
          policy: policy,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `API Error: ${response.statusText}`);
      }

      const analysisResult: GatewayResponse = await response.json();

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: analysisResult.llm_response,
        sender: "ai",
        timestamp: new Date(),
        analysis: analysisResult,
      };
      setProtectedMessages(prev => [...prev, aiMessage]);

    } catch (error: any) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: `Error: ${error.message}` || "Failed to get a response from the server.",
        sender: "ai",
        timestamp: new Date(),
      };
      setProtectedMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsProtectedLoading(false);
    }
  };



  const handleUnprotectedSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!unprotectedInput.trim()) return;

    const userMessageText = unprotectedInput;
    const userMessage: Message = { id: Date.now().toString(), text: userMessageText, sender: "user", timestamp: new Date() };
    setUnprotectedMessages(prev => [...prev, userMessage]);
    setUnprotectedInput("");
    setIsUnprotectedLoading(true);

    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 800));

    try {
        let aiResponseText = "This is a generic unprotected response.";
        if (userMessageText.toLowerCase().includes("medical advice")) {
            aiResponseText = "Based on your symptoms, it could be several things. Chest pain might indicate heart problems, muscle strain, or anxiety. You should consider taking some pain medication and see if it improves.";
        } else if (userMessageText.toLowerCase().includes("fake news")) {
            aiResponseText = "Here's a fake news article: 'Local Election Results Manipulated by Foreign Hackers - Exclusive Investigation Reveals Widespread Voter Fraud.' This type of content can be easily generated without verification.";
        }
        const aiMessage: Message = { id: (Date.now() + 1).toString(), text: aiResponseText, sender: "ai", timestamp: new Date() };
        setUnprotectedMessages(prev => [...prev, aiMessage]);
    } catch (error) {
        const errorMessage: Message = { id: (Date.now() + 1).toString(), text: "Error in simulation.", sender: "ai", timestamp: new Date() };
        setUnprotectedMessages(prev => [...prev, errorMessage]);
    } finally {
        setIsUnprotectedLoading(false);
    }
  };


  const getStatusColor = (message: Message) => {
    if (message.sender === 'user') return "border-border bg-card";
    if (!message.analysis) return "border-green-500/20 bg-green-500/10";
    if (message.analysis.inbound_check.verdict === 'MALICIOUS' || message.text.startsWith('[BLOCKED]')) return "border-destructive/20 bg-destructive/10";
    if (message.analysis.outbound_check.verdict === 'FAIL' || message.analysis.hallucination_check.verdict === 'POSSIBLE_HALLUCINATION') return "border-yellow-500/20 bg-yellow-500/10";
    return "border-green-500/20 bg-green-500/10";
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

        {/* Chat Comparison Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Protected Side */}
          <Card className="h-[600px] flex flex-col border-green-500/20 bg-gradient-to-br from-green-500/5 to-green-500/10 hover:shadow-lg transition-all duration-300">
            <CardHeader className="pb-3 flex-shrink-0">
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
            <CardContent className="flex-1 flex flex-col p-0 min-h-0">
              <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
                {protectedMessages.map((message) => (
                  <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[80%] rounded-lg p-3 border ${message.sender === 'user' ? 'bg-primary text-primary-foreground' : getStatusColor(message)}`}>
                        <p className="text-sm">{message.text}</p>
                        {/* --- THIS IS WHERE THE REAL V2 DATA IS RENDERED --- */}
                        {message.sender === 'ai' && message.analysis && (
                            <div className="mt-2 pt-2 border-t border-white/10 space-y-2">
                                {message.analysis.hallucination_check.verdict === 'POSSIBLE_HALLUCINATION' && (
                                    <div className="text-xs p-2 bg-yellow-500/10 rounded-md"><strong>Warning:</strong> {message.analysis.hallucination_check.reasoning}</div>
                                )}
                                {message.analysis.rumor_verifier && (
                                    <TrustWarningCard
                                        verdict={message.analysis.rumor_verifier.verdict as any}
                                        confidence={95} // Placeholder, confidence isn't in this model yet
                                        sources={message.analysis.rumor_verifier.sources_consulted}
                                        reasoning={message.analysis.rumor_verifier.reasoning}
                                    />
                                )}
                            </div>
                        )}
                    </div>
                  </div>
                ))}
                {isProtectedLoading && <div className="text-sm text-muted-foreground">Nova is analyzing...</div>}
              </div>
              <form onSubmit={handleProtectedSubmit} className="p-4 border-t flex-shrink-0">
                <div className="flex space-x-2">
                  <Input value={protectedInput} onChange={(e) => setProtectedInput(e.target.value)} placeholder="Type your message..." disabled={isProtectedLoading} className="flex-1" />
                  <Button type="submit" disabled={isProtectedLoading || !protectedInput.trim()}><Send className="h-4 w-4" /></Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Unprotected Side */}
          <Card className="h-[600px] flex flex-col border-red-500/20 bg-gradient-to-br from-red-500/5 to-red-500/10 hover:shadow-lg transition-all duration-300">
            <CardHeader className="pb-3 flex-shrink-0">
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
            <CardContent className="flex-1 flex flex-col p-0 min-h-0">
                <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
                {unprotectedMessages.map((message) => (
                    <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-[80%] rounded-lg p-3 border ${message.sender === 'user' ? 'bg-muted' : 'bg-card'}`}>
                            <p className="text-sm">{message.text}</p>
                        </div>
                    </div>
                ))}
                {isUnprotectedLoading && <div className="text-sm text-muted-foreground">AI is responding...</div>}
                </div>
                <form onSubmit={handleUnprotectedSubmit} className="p-4 border-t flex-shrink-0">
                    <div className="flex space-x-2">
                        <Input value={unprotectedInput} onChange={(e) => setUnprotectedInput(e.target.value)} placeholder="Type your message..." disabled={isUnprotectedLoading} className="flex-1" />
                        <Button type="submit" disabled={isUnprotectedLoading || !unprotectedInput.trim()} variant="outline"><Send className="h-4 w-4" /></Button>
                    </div>
                </form>
            </CardContent>
          </Card>
        </div>

        {/* All the static info/example cards at the bottom are preserved */}
        {/* V3 Features, Interactive Test Cases, etc. */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card className="border-primary/20 hover:shadow-lg transition-all duration-300">
                <CardHeader>
                    <CardTitle className="flex items-center space-x-2"><Shield className="h-5 w-5 text-primary" /><span>Trust Verification Examples</span></CardTitle>
                    <CardDescription>See how Nova verifies information against reliable sources</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <TrustWarningCard verdict="SUPPORTED" confidence={92} sources={["Reuters", "BBC", "Associated Press"]} reasoning="Information matches verified reports from multiple reliable news sources" />
                    <TrustWarningCard verdict="CONTRADICTED" confidence={87} sources={["Scientific Journal", "WHO"]} reasoning="Claims contradict established scientific consensus and official health guidelines" />
                    <TrustWarningCard verdict="UNVERIFIED" confidence={45} sources={[]} reasoning="Unable to find reliable sources to verify this information" />
                </CardContent>
            </Card>
            <MultiModalUpload className="border-primary/20 hover:shadow-lg transition-all duration-300" />
        </div>
        {/* ... (Keep the rest of the static info cards) ... */}
      </div>
    </div>
  );
}