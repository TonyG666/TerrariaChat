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
  context?: string[];
}

export interface SearchResult {
  results: string[];
  query: string;
}

class ApiService {
  private baseUrl: string;
  private sessionId: string | null = null;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  async sendMessage(content: string): Promise<ChatResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content,
          session_id: this.sessionId,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ChatResponse = await response.json();
      
      // Store session ID for subsequent requests
      if (data.session_id) {
        this.sessionId = data.session_id;
      }

      return data;
    } catch (error) {
      console.error('Error sending message:', error);
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