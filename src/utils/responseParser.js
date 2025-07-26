/**
 * Intelligent Response Parser
 * Handles various response formats from AI models with multiple fallback strategies
 */

class ResponseParser {
  constructor() {
    this.strategies = [
      this.parseDirectJSON,
      this.parseMarkdownCodeBlock,
      this.extractJSONFromText,
      this.parseWithRegex,
      this.smartTextToJSON,
    ];
  }

  /**
   * Try to parse response using multiple strategies
   */
  async parse(text) {
    if (!text || typeof text !== 'string') {
      throw new Error('Invalid input: expected non-empty string');
    }

    const errors = [];
    
    // Try each parsing strategy
    for (const strategy of this.strategies) {
      try {
        const result = await strategy.call(this, text);
        if (result && this.validateStructure(result)) {
          return result;
        }
      } catch (error) {
        errors.push({ strategy: strategy.name, error: error.message });
      }
    }

    // If all strategies fail, throw detailed error
    throw new Error(`Failed to parse response. Tried ${errors.length} strategies: ${JSON.stringify(errors)}`);
  }

  /**
   * Strategy 1: Direct JSON parsing
   */
  parseDirectJSON(text) {
    const trimmed = text.trim();
    return JSON.parse(trimmed);
  }

  /**
   * Strategy 2: Extract from markdown code blocks
   */
  parseMarkdownCodeBlock(text) {
    // Handle ```json blocks
    let cleaned = text.trim();
    
    // Remove markdown code block markers
    if (cleaned.startsWith('```json')) {
      cleaned = cleaned.substring(7);
    } else if (cleaned.startsWith('```')) {
      cleaned = cleaned.substring(3);
    }
    
    if (cleaned.endsWith('```')) {
      cleaned = cleaned.substring(0, cleaned.length - 3);
    }
    
    return JSON.parse(cleaned.trim());
  }

  /**
   * Strategy 3: Extract JSON object from mixed text
   */
  extractJSONFromText(text) {
    // Find first { and last }
    const start = text.indexOf('{');
    const end = text.lastIndexOf('}');
    
    if (start === -1 || end === -1 || end <= start) {
      throw new Error('No JSON object found in text');
    }
    
    const jsonStr = text.substring(start, end + 1);
    return JSON.parse(jsonStr);
  }

  /**
   * Strategy 4: Advanced regex extraction
   */
  parseWithRegex(text) {
    // Try multiple regex patterns
    const patterns = [
      /\{[\s\S]*"overall_score"[\s\S]*\}/,
      /\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}/,
      /```(?:json)?\s*(\{[\s\S]*?\})\s*```/
    ];
    
    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match) {
        const jsonStr = match[1] || match[0];
        return JSON.parse(jsonStr);
      }
    }
    
    throw new Error('No JSON pattern matched');
  }

  /**
   * Strategy 5: Smart text analysis and conversion
   */
  smartTextToJSON(text) {
    // If the text contains analysis but not in JSON format,
    // try to extract key information and build JSON
    const lines = text.split('\n').filter(line => line.trim());
    
    // Look for score patterns
    const scoreMatch = text.match(/(?:overall[_\s]*score|score)[:\s]*(\d+)/i);
    const summaryMatch = text.match(/(?:summary|assessment)[:\s]*([^\n]+)/i);
    
    if (!scoreMatch) {
      throw new Error('Could not extract score from text');
    }
    
    // Build a minimal valid response
    return {
      overall_score: parseInt(scoreMatch[1]),
      summary: summaryMatch ? summaryMatch[1].trim() : "Analysis completed",
      categories: this.extractCategories(text)
    };
  }

  /**
   * Extract categories from text analysis
   */
  extractCategories(text) {
    const categoryNames = [
      'Problem Statement',
      'Solution',
      'Market Size',
      'Business Model',
      'Team',
      'Traction',
      'Competition',
      'Financial Projections',
      'Funding Ask',
      'Go-to-Market Strategy'
    ];
    
    const categories = [];
    
    for (const name of categoryNames.slice(0, 5)) { // At least 5 categories
      const scoreMatch = text.match(new RegExp(`${name}[:\\s]*(\\d+)`, 'i'));
      const score = scoreMatch ? parseInt(scoreMatch[1]) : 50;
      
      categories.push({
        name,
        score,
        feedback: `Analysis for ${name}`,
        notes: [`Review ${name}`, 'Provide more details', 'Consider improvements']
      });
    }
    
    return categories;
  }

  /**
   * Validate the parsed structure
   */
  validateStructure(obj) {
    if (!obj || typeof obj !== 'object') return false;
    if (typeof obj.overall_score !== 'number') return false;
    if (!obj.categories || !Array.isArray(obj.categories)) return false;
    if (obj.categories.length === 0) return false;
    
    // Validate at least first category
    const firstCategory = obj.categories[0];
    if (!firstCategory.name || typeof firstCategory.score !== 'number') return false;
    
    return true;
  }

  /**
   * Clean and normalize the parsed result
   */
  normalize(result) {
    // Ensure all required fields
    result.overall_score = Math.max(0, Math.min(100, result.overall_score || 50));
    result.summary = result.summary || "Analysis completed successfully";
    
    // Normalize categories
    result.categories = result.categories.map(cat => ({
      name: cat.name || 'Unknown',
      score: Math.max(0, Math.min(100, cat.score || 50)),
      feedback: cat.feedback || 'No specific feedback provided',
      notes: Array.isArray(cat.notes) ? cat.notes : ['Review this section']
    }));
    
    return result;
  }
}

module.exports = new ResponseParser();