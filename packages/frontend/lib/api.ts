// API base URL - update this to match your backend URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Types for API responses
export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

export interface ChatRequest {
  prompt: string;
  policy?: string;
}

export interface ChatResponse {
  llm_response: string;
  inbound_check: {
    verdict: "SAFE" | "MALICIOUS";
    reasoning: string;
    confidence_score: number;
    attack_type: string;
  };
  outbound_check: {
    verdict: "PASS" | "FAIL";
    reasoning: string;
    confidence_score: number;
  };
  rumor_verifier?: {
    status: string;
    claim: string;
    reasoning: string;
    supporting_sources: string[];
  };
}

export interface AnalyticsData {
  total_requests: number;
  blocked_threats: number;
  successful_requests: number;
  average_response_time: number;
  cost_savings: number;
  uptime: number;
  threats_over_time: Array<{
    timestamp: string;
    count: number;
  }>;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  user_message: string;
  ai_response: string;
  status: 'success' | 'blocked' | 'warning';
  threat_detected: boolean;
  policy_violations: string[];
  response_time: number;
  hash: string;
}

// Generic API call function
async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  // Add auth token if available
  const token = localStorage.getItem('nova_token');
  if (token) {
    config.headers = {
      ...config.headers,
      'Authorization': `Bearer ${token}`,
    };
  }

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new Error(`API call failed: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API call error:', error);
    throw error;
  }
}

// Authentication API calls
export const authAPI = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    // FastAPI's standard security uses form data, not JSON, for login.
    const formData = new URLSearchParams();
    formData.append('username', email); // The backend expects 'username' for the email field
    formData.append('password', password);

    // Make the API call without the generic JSON header
    const response = await fetch(`${API_BASE_URL}/api/v1/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Login failed');
    }
    
    const data: AuthResponse = await response.json();
    
    // Store token on successful login
    if (data.access_token) {
      localStorage.setItem('nova_token', data.access_token);
    }
    
    return data;
  },

  signup: async (name: string, email: string, password: string): Promise<AuthResponse> => {
    // Signup uses JSON, so the generic apiCall is fine here.
    // Dev 1's schema expects `full_name`.
    return await apiCall<AuthResponse>('/api/v1/signup', {
      method: 'POST',
      body: JSON.stringify({ full_name: name, email, password }),
    });
  },

  logout: () => {
    localStorage.removeItem('nova_token');
    // Also remove any stored user info
    localStorage.removeItem('nova_user');
    // Redirect to login page to ensure clean state
    window.location.href = '/login';
  },

  isAuthenticated: () => {
    // Check if the token exists in local storage
    if (typeof window !== 'undefined') {
      return !!localStorage.getItem('nova_token');
    }
    return false;
  },
};

// Chat API calls
export const chatAPI = {
  sendMessage: async (request: ChatRequest): Promise<ChatResponse> => {
    return await apiCall<ChatResponse>('/api/v1/nova-chat', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  },

  // For the demo page - simulate Nova processing
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  simulateNovaChat: async (message: string, _policy: string): Promise<ChatResponse> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simple threat detection logic
    const lowerMessage = message.toLowerCase();
    let inboundVerdict: "SAFE" | "MALICIOUS" = "SAFE";
    let outboundVerdict: "PASS" | "FAIL" = "PASS";
    let inboundReasoning = "No threats detected";
    let outboundReasoning = "Response complies with policy";
    let llmResponse = "I understand your request. Here's what I can tell you about that topic...";
    
    // Check for medical advice
    if (lowerMessage.includes('medical') || lowerMessage.includes('diagnose') || lowerMessage.includes('treatment')) {
      inboundVerdict = "MALICIOUS";
      inboundReasoning = "Medical advice request detected";
      outboundVerdict = "FAIL";
      outboundReasoning = "Medical advice policy violation";
      llmResponse = "I cannot provide medical advice. Please consult with a healthcare professional.";
    }
    
    // Check for personal information
    if (lowerMessage.includes('password') || lowerMessage.includes('credit card') || lowerMessage.includes('ssn')) {
      inboundVerdict = "MALICIOUS";
      inboundReasoning = "Personal information request detected";
      outboundVerdict = "FAIL";
      outboundReasoning = "PII protection policy violation";
      llmResponse = "I cannot provide assistance with personal financial information or sensitive data.";
    }
    
    // Check for harmful content
    if (lowerMessage.includes('hack') || lowerMessage.includes('exploit') || lowerMessage.includes('bypass')) {
      inboundVerdict = "MALICIOUS";
      inboundReasoning = "Potentially harmful content detected";
      outboundVerdict = "FAIL";
      outboundReasoning = "Harmful content policy violation";
      llmResponse = "I cannot provide assistance with potentially harmful activities.";
    }
    
    return {
      llm_response: llmResponse,
      inbound_check: {
        verdict: inboundVerdict,
        reasoning: inboundReasoning,
        confidence_score: inboundVerdict === "MALICIOUS" ? 0.95 : 0.1,
        attack_type: inboundVerdict === "MALICIOUS" ? "policy_violation" : "none"
      },
      outbound_check: {
        verdict: outboundVerdict,
        reasoning: outboundReasoning,
        confidence_score: outboundVerdict === "FAIL" ? 0.95 : 0.1
      },
      rumor_verifier: lowerMessage.includes('vaccine') || lowerMessage.includes('health') ? {
        status: "SUPPORTED",
        claim: "Health information verified",
        reasoning: "Information matches verified medical sources",
        supporting_sources: ["WHO", "CDC", "NIH"]
      } : undefined
    };
  },
};

// Analytics API calls - Using mock data until backend endpoints are implemented
export const analyticsAPI = {
  getDashboardData: async (): Promise<AnalyticsData> => {
    // Mock data for now - replace with actual API call when backend is ready
    return {
      total_requests: 1247,
      blocked_threats: 23,
      successful_requests: 1224,
      average_response_time: 245,
      cost_savings: 156.78,
      uptime: 99.8,
      threats_over_time: [
        { timestamp: "2024-01-15T00:00:00Z", count: 2 },
        { timestamp: "2024-01-15T01:00:00Z", count: 1 },
        { timestamp: "2024-01-15T02:00:00Z", count: 0 },
        { timestamp: "2024-01-15T03:00:00Z", count: 3 },
        { timestamp: "2024-01-15T04:00:00Z", count: 1 },
        { timestamp: "2024-01-15T05:00:00Z", count: 0 },
        { timestamp: "2024-01-15T06:00:00Z", count: 2 },
        { timestamp: "2024-01-15T07:00:00Z", count: 4 },
        { timestamp: "2024-01-15T08:00:00Z", count: 6 },
        { timestamp: "2024-01-15T09:00:00Z", count: 8 },
        { timestamp: "2024-01-15T10:00:00Z", count: 5 },
        { timestamp: "2024-01-15T11:00:00Z", count: 7 },
        { timestamp: "2024-01-15T12:00:00Z", count: 9 },
        { timestamp: "2024-01-15T13:00:00Z", count: 11 },
        { timestamp: "2024-01-15T14:00:00Z", count: 8 },
        { timestamp: "2024-01-15T15:00:00Z", count: 6 },
        { timestamp: "2024-01-15T16:00:00Z", count: 4 },
        { timestamp: "2024-01-15T17:00:00Z", count: 3 },
        { timestamp: "2024-01-15T18:00:00Z", count: 2 },
        { timestamp: "2024-01-15T19:00:00Z", count: 1 },
        { timestamp: "2024-01-15T20:00:00Z", count: 2 },
        { timestamp: "2024-01-15T21:00:00Z", count: 1 },
        { timestamp: "2024-01-15T22:00:00Z", count: 0 },
        { timestamp: "2024-01-15T23:00:00Z", count: 1 },
      ]
    };
  },

  getThreatsOverTime: async (timeframe: string = '24h'): Promise<AnalyticsData['threats_over_time']> => {
    // Mock data for now - replace with actual API call when backend is ready
    const mockData = [
      { timestamp: "2024-01-15T00:00:00Z", count: 2 },
      { timestamp: "2024-01-15T01:00:00Z", count: 1 },
      { timestamp: "2024-01-15T02:00:00Z", count: 0 },
      { timestamp: "2024-01-15T03:00:00Z", count: 3 },
      { timestamp: "2024-01-15T04:00:00Z", count: 1 },
      { timestamp: "2024-01-15T05:00:00Z", count: 0 },
      { timestamp: "2024-01-15T06:00:00Z", count: 2 },
      { timestamp: "2024-01-15T07:00:00Z", count: 4 },
      { timestamp: "2024-01-15T08:00:00Z", count: 6 },
      { timestamp: "2024-01-15T09:00:00Z", count: 8 },
      { timestamp: "2024-01-15T10:00:00Z", count: 5 },
      { timestamp: "2024-01-15T11:00:00Z", count: 7 },
      { timestamp: "2024-01-15T12:00:00Z", count: 9 },
      { timestamp: "2024-01-15T13:00:00Z", count: 11 },
      { timestamp: "2024-01-15T14:00:00Z", count: 8 },
      { timestamp: "2024-01-15T15:00:00Z", count: 6 },
      { timestamp: "2024-01-15T16:00:00Z", count: 4 },
      { timestamp: "2024-01-15T17:00:00Z", count: 3 },
      { timestamp: "2024-01-15T18:00:00Z", count: 2 },
      { timestamp: "2024-01-15T19:00:00Z", count: 1 },
      { timestamp: "2024-01-15T20:00:00Z", count: 2 },
      { timestamp: "2024-01-15T21:00:00Z", count: 1 },
      { timestamp: "2024-01-15T22:00:00Z", count: 0 },
      { timestamp: "2024-01-15T23:00:00Z", count: 1 },
    ];
    return mockData;
  },
};

// Logs API calls - Using mock data until backend endpoints are implemented
export const logsAPI = {
  getLogs: async (page: number = 1, limit: number = 50, filters?: Record<string, string>): Promise<{
    logs: LogEntry[];
    total: number;
    page: number;
    total_pages: number;
  }> => {
    // Mock data for now - replace with actual API call when backend is ready
    const mockLogs: LogEntry[] = [
      {
        id: "log_001",
        timestamp: "2024-01-15 14:30:25",
        user_message: "What's my credit card number?",
        ai_response: "I cannot provide personal financial information.",
        status: "blocked",
        threat_detected: true,
        policy_violations: ["personal_info"],
        response_time: 145,
        hash: "a1b2c3d4e5f6"
      },
      {
        id: "log_002",
        timestamp: "2024-01-15 14:28:12",
        user_message: "How do I reset my password?",
        ai_response: "To reset your password, go to the login page and click 'Forgot Password'...",
        status: "success",
        threat_detected: false,
        policy_violations: [],
        response_time: 89,
        hash: "f6e5d4c3b2a1"
      },
      {
        id: "log_003",
        timestamp: "2024-01-15 14:25:45",
        user_message: "Can you diagnose my symptoms?",
        ai_response: "I cannot provide medical diagnoses. Please consult a healthcare professional.",
        status: "blocked",
        threat_detected: true,
        policy_violations: ["medical_advice"],
        response_time: 156,
        hash: "b2c3d4e5f6a1"
      }
    ];
    
    return {
      logs: mockLogs,
      total: mockLogs.length,
      page: page,
      total_pages: 1
    };
  },

  freezeThreat: async (logId: string): Promise<void> => {
    // Mock implementation - replace with actual API call when backend is ready
    console.log(`Freezing threat for log ID: ${logId}`);
    return Promise.resolve();
  },

  verifyLogIntegrity: async (logId: string): Promise<{
    is_valid: boolean;
    hash_verified: boolean;
  }> => {
    // Mock implementation - replace with actual API call when backend is ready
    return {
      is_valid: true,
      hash_verified: true
    };
  },
};

// Policy types
export interface Policy {
  id: string;
  name: string;
  description: string;
  rules: string[];
  enabled: boolean;
  created_at: string;
  updated_at: string;
}

// Policies API calls - Using mock data until backend endpoints are implemented
export const policiesAPI = {
  getPolicies: async (): Promise<Policy[]> => {
    // Mock data for now - replace with actual API call when backend is ready
    return [
      {
        id: "policy_001",
        name: "Medical Advice Prevention",
        description: "Prevents AI from providing medical diagnoses or treatment recommendations",
        rules: [
          "Block requests for medical diagnoses",
          "Block treatment recommendations", 
          "Block medication advice",
          "Allow general health information"
        ],
        enabled: true,
        created_at: "2024-01-10",
        updated_at: "2024-01-15"
      },
      {
        id: "policy_002",
        name: "Personal Information Protection",
        description: "Protects against PII leaks and unauthorized data access",
        rules: [
          "Block requests for passwords",
          "Block credit card information",
          "Block SSN requests",
          "Block personal addresses"
        ],
        enabled: true,
        created_at: "2024-01-10",
        updated_at: "2024-01-12"
      }
    ];
  },

  createPolicy: async (policy: Omit<Policy, 'id' | 'created_at' | 'updated_at'>): Promise<Policy> => {
    // Mock implementation - replace with actual API call when backend is ready
    const newPolicy: Policy = {
      ...policy,
      id: `policy_${Date.now()}`,
      created_at: new Date().toISOString().split('T')[0],
      updated_at: new Date().toISOString().split('T')[0]
    };
    return newPolicy;
  },

  updatePolicy: async (id: string, policy: Partial<Omit<Policy, 'id' | 'created_at' | 'updated_at'>>): Promise<Policy> => {
    // Mock implementation - replace with actual API call when backend is ready
    const updatedPolicy: Policy = {
      id,
      name: policy.name || "Updated Policy",
      description: policy.description || "Updated description",
      rules: policy.rules || [],
      enabled: policy.enabled !== undefined ? policy.enabled : true,
      created_at: "2024-01-10",
      updated_at: new Date().toISOString().split('T')[0]
    };
    return updatedPolicy;
  },

  deletePolicy: async (id: string): Promise<void> => {
    // Mock implementation - replace with actual API call when backend is ready
    console.log(`Deleting policy with ID: ${id}`);
    return Promise.resolve();
  },
};

// Error handling utility
export class APIError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string
  ) {
    super(message);
    this.name = 'APIError';
  }
}

// Request interceptor for error handling
export const withErrorHandling = async <T>(
  apiCall: () => Promise<T>
): Promise<T> => {
  try {
    return await apiCall();
  } catch (error: unknown) {
    if (error instanceof APIError) {
      throw error;
    }
    
    // Handle network errors
    if (error instanceof Error && error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new APIError('Network error - please check your connection', 0, 'NETWORK_ERROR');
    }
    
    // Handle other errors
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    throw new APIError(errorMessage, 500, 'UNKNOWN_ERROR');
  }
}; 