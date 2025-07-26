export class ApiKeyManager {
  private static readonly STORAGE_KEY = 'valu8_mistral_key';
  private static readonly RESEARCH_KEY = 'valu8_research_data';

  // API Key Management
  static storeApiKey(key: string): void {
    try {
      // Simple encoding for demo purposes
      const encoded = btoa(key);
      localStorage.setItem(this.STORAGE_KEY, encoded);
    } catch (error) {
      console.error('Failed to store API key:', error);
      throw new Error('Failed to store API key');
    }
  }

  static getApiKey(): string | null {
    try {
      const encoded = localStorage.getItem(this.STORAGE_KEY);
      if (!encoded) return null;
      return atob(encoded);
    } catch (error) {
      console.error('Failed to retrieve API key:', error);
      return null;
    }
  }

  static hasApiKey(): boolean {
    return !!this.getApiKey();
  }

  static clearApiKey(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }

  static validateApiKeyFormat(key: string): boolean {
    // Mistral API keys typically start with specific patterns
    return key.length > 1;
  }

  // Research Data Management
  static saveResearchData(data: any): void {
    try {
      const serialized = JSON.stringify({
        ...data,
        timestamp: new Date().toISOString(),
        version: '1.0'
      });
      localStorage.setItem(this.RESEARCH_KEY, serialized);
    } catch (error) {
      console.error('Failed to save research data:', error);
    }
  }

  static getResearchData(): any | null {
    try {
      const serialized = localStorage.getItem(this.RESEARCH_KEY);
      if (!serialized) return null;
      return JSON.parse(serialized);
    } catch (error) {
      console.error('Failed to retrieve research data:', error);
      return null;
    }
  }

  static clearResearchData(): void {
    localStorage.removeItem(this.RESEARCH_KEY);
  }

  static exportResearchData(): void {
    const data = this.getResearchData();
    if (!data) {
      alert('No research data to export');
      return;
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json'
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `valu8-research-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  static importResearchData(file: File): Promise<any> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string);
          this.saveResearchData(data);
          resolve(data);
        } catch (error) {
          reject(new Error('Invalid file format'));
        }
      };
      
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  }

  // Usage tracking for cost estimation
  static trackUsage(tokens: number, model: string): void {
    const usageKey = 'valu8_usage';
    const usage = JSON.parse(localStorage.getItem(usageKey) || '[]');
    
    usage.push({
      timestamp: new Date().toISOString(),
      tokens,
      model,
      estimatedCost: this.estimateCost(tokens, model)
    });

    // Keep only last 100 entries
    if (usage.length > 100) {
      usage.splice(0, usage.length - 100);
    }

    localStorage.setItem(usageKey, JSON.stringify(usage));
  }

  static getUsageStats(): { totalTokens: number; estimatedCost: number; callCount: number } {
    const usageKey = 'valu8_usage';
    const usage = JSON.parse(localStorage.getItem(usageKey) || '[]');
    
    return usage.reduce((acc: any, entry: any) => ({
      totalTokens: acc.totalTokens + entry.tokens,
      estimatedCost: acc.estimatedCost + entry.estimatedCost,
      callCount: acc.callCount + 1
    }), { totalTokens: 0, estimatedCost: 0, callCount: 0 });
  }

  private static estimateCost(tokens: number, model: string): number {
    // Mistral pricing estimates (per 1M tokens)
    const pricing: { [key: string]: number } = {
      'mistral-large-latest': 4.0,
      'mistral-medium-latest': 2.7,
      'mistral-small-latest': 1.0
    };
    
    const pricePerMillion = pricing[model] || 2.0;
    return (tokens / 1_000_000) * pricePerMillion;
  }
}