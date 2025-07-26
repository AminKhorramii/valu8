import { ApiKeyManager } from './apiKeyManager';

export interface MistralResponse {
  content: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  model: string;
}

export interface ResearchRequest {
  initialInput: string;
  followupAnswer?: string;
  vcMode: boolean;
  roastMode: boolean;
  region: string;
  teamUrls?: string[];
}

export class MistralClient {
  private static readonly API_BASE = process.env.NODE_ENV === 'production' 
    ? '/api' 
    : 'http://localhost:8787/api';

  static async generateFollowup(initialInput: string): Promise<string> {
    const apiKey = ApiKeyManager.getApiKey();
    if (!apiKey) throw new Error('No API key found');

    try {
      const response = await fetch(`${this.API_BASE}/mistral/followup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          apiKey,
          initialInput
        })
      });

      if (!response.ok) {
        throw new Error(`API call failed: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.usage) {
        ApiKeyManager.trackUsage(data.usage.total_tokens, 'mistral-small-latest');
      }

      return data.content;
    } catch (error) {
      console.error('Followup generation failed:', error);
      throw error;
    }
  }

  static async generateComprehensiveResearch(request: ResearchRequest): Promise<any> {
    const apiKey = ApiKeyManager.getApiKey();
    if (!apiKey) throw new Error('No API key found');

    try {
      const response = await fetch(`${this.API_BASE}/mistral/research`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          apiKey,
          ...request
        })
      });

      if (!response.ok) {
        throw new Error(`API call failed: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.usage) {
        ApiKeyManager.trackUsage(data.usage.total_tokens, 'mistral-large-latest');
      }

      // Save research data locally
      ApiKeyManager.saveResearchData(data.research);

      return data.research;
    } catch (error) {
      console.error('Research generation failed:', error);
      throw error;
    }
  }

  static async analyzeTeam(linkedinUrls: string[]): Promise<any> {
    const apiKey = ApiKeyManager.getApiKey();
    if (!apiKey) throw new Error('No API key found');

    try {
      const response = await fetch(`${this.API_BASE}/mistral/team`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          apiKey,
          linkedinUrls
        })
      });

      if (!response.ok) {
        throw new Error(`API call failed: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.usage) {
        ApiKeyManager.trackUsage(data.usage.total_tokens, 'mistral-medium-latest');
      }

      return data.analysis;
    } catch (error) {
      console.error('Team analysis failed:', error);
      throw error;
    }
  }

  static async validateApiKey(apiKey: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.API_BASE}/mistral/validate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ apiKey })
      });

      return response.ok;
    } catch (error) {
      console.error('API key validation failed:', error);
      return false;
    }
  }

  // Fallback to local mock data if API fails
  static getFallbackData(type: 'followup' | 'research' | 'team'): any {
    switch (type) {
      case 'followup':
        return "What specific problem does your product solve and who is your target customer?";
      
      case 'research':
        // Return the existing mock data from longResearchData.ts
        return ApiKeyManager.getResearchData() || null;
      
      case 'team':
        // Return mock team analysis
        return [
          {
            name: 'Team Member',
            role: 'Founder',
            experience: 'Analysis unavailable - API key needed',
            strengths: ['Add Mistral API key for analysis'],
            concerns: ['API key required'],
            score: 0
          }
        ];
      
      default:
        return null;
    }
  }
}