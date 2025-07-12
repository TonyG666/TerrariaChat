// API service for communicating with the FastAPI backend
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export interface ChatMessage {
  content: string;
  session_id?: string;
}

export interface ChatResponse {
  response: string;
  session_id: string;
  timestamp: string;
}

export interface SearchQuery {
  query: string;
}

export interface SearchResult {
  results: string[];
  query: string;
}

class ApiService {
  private baseUrl: string;
  private sessionId: string | null = null;

  constructor(baseUrl: string = API_BASE_URL) {
    // Remove trailing slash to prevent double slashes
    this.baseUrl = baseUrl.replace(/\/$/, '');
    console.log('🚀 API Service initialized with baseUrl:', this.baseUrl);
    console.log('🔧 Environment VITE_API_URL:', import.meta.env.VITE_API_URL);
  }

  async sendMessage(content: string): Promise<ChatResponse> {
    try {
      const url = `${this.baseUrl}/chat`;
      console.log('📤 Sending message to:', url);
      console.log('💬 Message content:', content);
      console.log('🔑 Session ID:', this.sessionId);
      
      const requestBody = {
        content,
        session_id: this.sessionId,
      };
      
      console.log('📦 Request body:', requestBody);
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      console.log('📊 Response status:', response.status);
      console.log('✅ Response ok:', response.ok);
      console.log('🌐 Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ API Error Response:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const data: ChatResponse = await response.json();
      console.log('📥 Received response:', data);
      
      // Store session ID for subsequent requests
      if (data.session_id) {
        this.sessionId = data.session_id;
      }

      return data;
    } catch (error) {
      console.error('💥 Error in sendMessage:', error);
      console.error('🔍 Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        baseUrl: this.baseUrl,
        content: content,
        errorType: error instanceof TypeError ? 'Network Error' : 'Other Error'
      });
      throw error;
    }
  }

  async searchTerrariaInfo(query: string): Promise<SearchResult> {
    try {
      const response = await fetch(`${this.baseUrl}/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error searching Terraria info:', error);
      throw error;
    }
  }

  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/health`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Health check failed:', error);
      throw error;
    }
  }

  getSessionId(): string | null {
    return this.sessionId;
  }

  clearSession(): void {
    this.sessionId = null;
  }
}

export const apiService = new ApiService();