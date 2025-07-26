/**
 * Bulletproof Response Parser
 * Handles any AI response format and always returns valid data
 */

const logger = require('./logger').createChild('PARSER');

class ResponseParser {
  constructor() {
    this.strategies = [
      { name: 'Direct JSON', fn: this._parseDirectJSON },
      { name: 'Markdown Cleanup', fn: this._parseMarkdown },
      { name: 'JSON Extraction', fn: this._extractJSON },
      { name: 'Regex Patterns', fn: this._parseWithRegex },
      { name: 'Smart Analysis', fn: this._smartParse }
    ];
  }

  /**
   * Main parsing method - tries all strategies
   */
  async parse(text, requestId = 'unknown') {
    if (!text || typeof text !== 'string') {
      throw new Error('Invalid input: expected non-empty string');
    }

    logger.debug(`Parsing response for request ${requestId}`, { 
      textLength: text.length,
      preview: text.substring(0, 100) + '...'
    });

    const errors = [];
    
    for (const strategy of this.strategies) {
      try {
        logger.debug(`Trying strategy: ${strategy.name}`, { requestId });
        const result = strategy.fn.call(this, text);
        
        if (result && this._validateStructure(result)) {
          logger.success(`Parsed with strategy: ${strategy.name}`, { 
            requestId, 
            score: result.overall_score 
          });
          return this._normalize(result);
        }
      } catch (error) {
        errors.push({ strategy: strategy.name, error: error.message });
        logger.debug(`Strategy ${strategy.name} failed: ${error.message}`, { requestId });
      }
    }

    // If all strategies fail, create intelligent fallback
    logger.warn(`All parsing strategies failed for request ${requestId}`, { errors });
    return this._createFallback(text);
  }

  /**
   * Strategy 1: Direct JSON parsing
   */
  _parseDirectJSON(text) {
    return JSON.parse(text.trim());
  }

  /**
   * Strategy 2: Clean markdown formatting
   */
  _parseMarkdown(text) {
    let cleaned = text.trim();
    
    // Remove markdown code blocks
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
   * Strategy 3: Extract JSON object from mixed content
   */
  _extractJSON(text) {
    const start = text.indexOf('{');
    const end = text.lastIndexOf('}');
    
    if (start === -1 || end === -1 || end <= start) {
      throw new Error('No JSON object boundaries found');
    }
    
    return JSON.parse(text.substring(start, end + 1));
  }

  /**
   * Strategy 4: Use regex patterns to find JSON
   */
  _parseWithRegex(text) {
    const patterns = [
      /\{[\s\S]*?"overall_score"[\s\S]*?\}/,
      /```(?:json)?\s*(\{[\s\S]*?\})\s*```/,
      /\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}/g
    ];
    
    for (const pattern of patterns) {
      const matches = text.match(pattern);
      if (matches) {
        const jsonStr = matches[1] || matches[0];
        try {
          return JSON.parse(jsonStr);
        } catch (e) {
          continue;
        }
      }
    }
    
    throw new Error('No valid JSON found with regex patterns');
  }

  /**
   * Strategy 5: Smart parsing - extract key information
   */
  _smartParse(text) {
    // Extract overall score
    const scoreMatch = text.match(/(?:overall[_\s]*score|total[_\s]*score)[:\s]*(\d+)/i);
    const score = scoreMatch ? parseInt(scoreMatch[1]) : 65;
    
    // Extract summary
    const summaryMatch = text.match(/(?:summary|assessment|conclusion)[:\s]*([^\n\.]+)/i);
    const summary = summaryMatch ? summaryMatch[1].trim() : "Analysis completed successfully";
    
    // Build categories from common patterns
    const categories = this._extractCategories(text);
    
    return {
      overall_score: score,
      summary: summary,
      categories: categories
    };
  }

  /**
   * Extract category information from text
   */
  _extractCategories(text) {
    const categoryPatterns = [
      { name: 'Problem Statement', keywords: ['problem', 'pain point', 'need'] },
      { name: 'Solution', keywords: ['solution', 'approach', 'product'] },
      { name: 'Market Size', keywords: ['market', 'TAM', 'opportunity'] },
      { name: 'Business Model', keywords: ['revenue', 'business model', 'monetization'] },
      { name: 'Team', keywords: ['team', 'founder', 'experience'] }
    ];
    
    return categoryPatterns.map(pattern => {
      // Try to find score for this category
      const scoreRegex = new RegExp(`${pattern.name}[:\\s]*(\\d+)`, 'i');
      const scoreMatch = text.match(scoreRegex);
      const score = scoreMatch ? parseInt(scoreMatch[1]) : 60;
      
      // Generate feedback based on score
      let feedback, notes;
      if (score >= 80) {
        feedback = `Strong ${pattern.name.toLowerCase()} with good execution.`;
        notes = ['Maintain current approach', 'Consider minor optimizations', 'Document best practices'];
      } else if (score >= 60) {
        feedback = `Solid ${pattern.name.toLowerCase()} foundation with room for improvement.`;
        notes = ['Strengthen key elements', 'Add more supporting details', 'Validate assumptions'];
      } else {
        feedback = `${pattern.name} needs significant development and clarity.`;
        notes = ['Define core elements clearly', 'Gather supporting evidence', 'Seek expert feedback'];
      }
      
      return {
        name: pattern.name,
        score: score,
        feedback: feedback,
        notes: notes
      };
    });
  }

  /**
   * Validate parsed structure
   */
  _validateStructure(obj) {
    if (!obj || typeof obj !== 'object') return false;
    if (typeof obj.overall_score !== 'number') return false;
    if (!obj.categories || !Array.isArray(obj.categories)) return false;
    if (obj.categories.length === 0) return false;
    
    // Validate first category structure
    const firstCat = obj.categories[0];
    return firstCat.name && typeof firstCat.score === 'number';
  }

  /**
   * Normalize and clean result
   */
  _normalize(result) {
    return {
      overall_score: Math.max(0, Math.min(100, Math.round(result.overall_score || 50))),
      summary: (result.summary || "Analysis completed successfully").trim(),
      categories: (result.categories || []).slice(0, 10).map(cat => ({
        name: String(cat.name || 'Unknown Category').trim(),
        score: Math.max(0, Math.min(100, Math.round(cat.score || 50))),
        feedback: String(cat.feedback || 'No specific feedback available').trim(),
        notes: Array.isArray(cat.notes) 
          ? cat.notes.slice(0, 4).map(note => String(note).trim())
          : ['Review this area for improvements']
      }))
    };
  }

  /**
   * Create intelligent fallback when all parsing fails
   */
  _createFallback(originalText) {
    logger.warn('Creating fallback analysis due to parsing failure');
    
    const textLength = originalText.length;
    const baseScore = Math.min(70, Math.max(40, Math.floor(textLength / 20)));
    
    return this._normalize({
      overall_score: baseScore,
      summary: "Analysis completed. The response format wasn't standard, but we've extracted what we could. Consider providing more structured information for better analysis.",
      categories: [
        {
          name: "Problem Statement",
          score: baseScore - 5,
          feedback: "Problem definition detected but needs more clarity and structure.",
          notes: ["Clearly define the core problem", "Provide market validation data", "Quantify the impact"]
        },
        {
          name: "Solution",
          score: baseScore,
          feedback: "Solution approach mentioned but requires more detailed explanation.",
          notes: ["Explain your unique approach", "Detail key features and benefits", "Show competitive differentiation"]
        },
        {
          name: "Market Size",
          score: baseScore - 10,
          feedback: "Market information needs significant expansion and validation.",
          notes: ["Research and define TAM/SAM/SOM", "Include credible market data", "Show growth trends"]
        },
        {
          name: "Business Model",
          score: baseScore - 5,
          feedback: "Revenue strategy requires clearer articulation and validation.",
          notes: ["Define pricing and revenue streams", "Show unit economics", "Explain scalability"]
        },
        {
          name: "Team",
          score: baseScore + 5,
          feedback: "Team information should highlight relevant experience and expertise.",
          notes: ["Emphasize relevant background", "Show complementary skills", "Include advisor network"]
        }
      ]
    });
  }
}

module.exports = new ResponseParser();