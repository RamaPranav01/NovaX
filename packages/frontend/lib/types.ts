export interface InboundCheck {
  verdict: "SAFE" | "MALICIOUS";
  reasoning: string;
  confidence_score: number;
  attack_type: string;
}

export interface OutboundCheck {
  verdict: "PASS" | "FAIL";
  reasoning: string;
  confidence_score: number;
}

export interface HallucinationCheck {
  verdict: "LOOKS_GOOD" | "POSSIBLE_HALLUCINATION";
  reasoning: string;
  confidence_score: number;
}

export interface RumorVerifier {
  verdict: "SUPPORTED" | "CONTRADICTED" | "NOT_ENOUGH_INFO";
  claim: string;
  reasoning: string;
  sources_consulted: string[];
}

export interface GatewayResponse {
  llm_response: string;
  inbound_check: InboundCheck;
  outbound_check: OutboundCheck;
  hallucination_check: HallucinationCheck;
  rumor_verifier: RumorVerifier | null; 
}

export interface Message {
  id: string;
  text: string;
  sender: "user" | "ai";
  timestamp: Date;
  analysis?: GatewayResponse; 
}