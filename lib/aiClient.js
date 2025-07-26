/**
 * Robust AI Client with automatic retry and error handling
 */

const OpenAI = require('openai');
const { Orq } = require('@orq-ai/node');
const config = require('./config');
const logger = require('./logger').createChild('AI-CLIENT');

class AIClient {
  constructor() {
    this.openai = null;
    this.orq = null;
    this.initialize();
  }

  initialize() {
    // Initialize OpenAI (via ORQ proxy if available, otherwise direct)
    if (config.api.orq) {
      try {
        this.openai = new OpenAI({
          apiKey: config.api.orq,
          baseURL: 'https://api.orq.ai/v2/proxy',
        });
        logger.success('OpenAI initialized via ORQ.ai proxy');
      } catch (error) {
        logger.error('Failed to initialize ORQ proxy, falling back to direct OpenAI', { error: error.message });
        this._initializeDirect();
      }
    } else {
      this._initializeDirect();
    }

    // Initialize ORQ for tracking (optional)
    if (config.api.orq) {
      try {
        this.orq = new Orq({
          apiKey: config.api.orq,
          environment: 'production'
        });
        logger.success('ORQ tracking initialized');
      } catch (error) {
        logger.warn('ORQ tracking initialization failed', { error: error.message });
      }
    }
  }

  _initializeDirect() {
    if (config.api.openai) {
      this.openai = new OpenAI({
        apiKey: config.api.openai,
      });
      logger.success('OpenAI initialized with direct API');
    } else {
      logger.error('No OpenAI API key available');
      throw new Error('OpenAI API key is required');
    }
  }

  /**
   * Generate analysis with retry logic
   */
  async generateAnalysis(content, requestId) {
    if (!this.openai) {
      throw new Error('OpenAI client not initialized');
    }

    const systemPrompt = this._buildSystemPrompt();
    const model = config.api.orq ? 'openai/gpt-4o' : config.openai.model;

    logger.info(`Starting analysis for request ${requestId}`, {
      model,
      contentLength: content.length,
      viaORQ: !!config.api.orq
    });

    let lastError;
    for (let attempt = 1; attempt <= config.reliability.maxRetries; attempt++) {
      try {
        logger.debug(`Attempt ${attempt}/${config.reliability.maxRetries}`, { requestId });

        const startTime = Date.now();
        const completion = await this._makeAPICall(model, systemPrompt, content);
        const duration = Date.now() - startTime;

        logger.success(`Analysis completed on attempt ${attempt}`, {
          requestId,
          duration,
          tokens: completion.usage?.total_tokens || 0
        });

        return {
          text: completion.choices[0].message.content,
          usage: completion.usage,
          duration
        };

      } catch (error) {
        lastError = error;
        logger.warn(`Attempt ${attempt} failed`, { 
          requestId, 
          error: error.message,
          status: error.status 
        });

        // Don't retry certain errors
        if (this._shouldNotRetry(error)) {
          logger.error('Non-retryable error encountered', { requestId, error: error.message });
          throw error;
        }

        // Wait before retry (except last attempt)
        if (attempt < config.reliability.maxRetries) {
          const delay = config.reliability.retryDelay * Math.pow(config.reliability.backoffMultiplier, attempt - 1);
          logger.info(`Waiting ${delay}ms before retry`, { requestId });
          await this._sleep(delay);
        }
      }
    }

    logger.error(`All retry attempts failed for request ${requestId}`, { 
      error: lastError.message,
      attempts: config.reliability.maxRetries 
    });
    throw lastError;
  }

  /**
   * Generate transcription with retry logic
   */
  async generateTranscription(audioBuffer, filename, requestId) {
    if (!this.openai) {
      throw new Error('OpenAI client not initialized');
    }

    const model = config.api.orq ? 'openai/whisper-1' : 'whisper-1';
    
    logger.info(`Starting transcription for request ${requestId}`, {
      model,
      fileSize: audioBuffer.length,
      filename,
      viaORQ: !!config.api.orq
    });

    let lastError;
    for (let attempt = 1; attempt <= config.reliability.maxRetries; attempt++) {
      try {
        logger.debug(`Transcription attempt ${attempt}/${config.reliability.maxRetries}`, { requestId });

        const startTime = Date.now();
        
        // Create file-like object for OpenAI API
        const file = new File([audioBuffer], filename, { type: 'audio/wav' });
        
        const transcription = await this.openai.audio.transcriptions.create({
          file: file,
          model: model,
        });
        
        const duration = Date.now() - startTime;

        logger.success(`Transcription completed on attempt ${attempt}`, {
          requestId,
          duration,
          textLength: transcription.text.length
        });

        return {
          text: transcription.text,
          duration
        };

      } catch (error) {
        lastError = error;
        logger.warn(`Transcription attempt ${attempt} failed`, { 
          requestId, 
          error: error.message 
        });

        if (this._shouldNotRetry(error) || attempt === config.reliability.maxRetries) {
          break;
        }

        const delay = config.reliability.retryDelay * Math.pow(config.reliability.backoffMultiplier, attempt - 1);
        await this._sleep(delay);
      }
    }

    logger.error(`Transcription failed after all attempts`, { 
      requestId,
      error: lastError.message 
    });
    throw lastError;
  }

  /**
   * Make the actual API call with timeout
   */
  async _makeAPICall(model, systemPrompt, content) {
    const apiCall = this.openai.chat.completions.create({
      model: model,
      messages: [
        { 
          role: 'system', 
          content: systemPrompt
        },
        { 
          role: 'user', 
          content: content 
        }
      ],
      temperature: config.openai.temperature,
      max_tokens: config.openai.maxTokens
    });

    // Add timeout
    return Promise.race([
      apiCall,
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('API call timeout')), config.openai.timeout)
      )
    ]);
  }

  /**
   * Build system prompt
   */
  _buildSystemPrompt() {
    return `You are an expert venture capital analyst and startup mentor with over 15 years of experience evaluating early-stage companies.

CRITICAL INSTRUCTIONS:
1. Respond ONLY with valid JSON - no markdown, no code blocks, no additional text
2. Do not wrap your response in \`\`\`json or \`\`\` markers
3. Return a pure JSON object that starts with { and ends with }

Analyze the pitch across these categories:
- Problem Statement (0-100): Problem clarity, market validation evidence
- Solution (0-100): Innovation, feasibility, unique value proposition  
- Market Size (0-100): TAM/SAM/SOM definition with credible data
- Business Model (0-100): Revenue model clarity, unit economics, scalability
- Team (0-100): Relevant experience, complementary skills, domain expertise

For each category provide:
- Numerical score (0-100)
- 2-3 sentences of constructive feedback
- 2-4 specific actionable notes

Use this exact JSON structure:
{
  "overall_score": number,
  "summary": "brief overall assessment in 1-2 sentences",
  "categories": [
    {
      "name": "Problem Statement",
      "score": number,
      "feedback": "constructive feedback",
      "notes": ["actionable note 1", "actionable note 2", "actionable note 3"]
    },
    {
      "name": "Solution", 
      "score": number,
      "feedback": "constructive feedback",
      "notes": ["actionable note 1", "actionable note 2", "actionable note 3"]
    },
    {
      "name": "Market Size",
      "score": number, 
      "feedback": "constructive feedback",
      "notes": ["actionable note 1", "actionable note 2", "actionable note 3"]
    },
    {
      "name": "Business Model",
      "score": number,
      "feedback": "constructive feedback", 
      "notes": ["actionable note 1", "actionable note 2", "actionable note 3"]
    },
    {
      "name": "Team",
      "score": number,
      "feedback": "constructive feedback",
      "notes": ["actionable note 1", "actionable note 2", "actionable note 3"]
    }
  ]
}`;
  }

  /**
   * Check if error should not trigger retry
   */
  _shouldNotRetry(error) {
    // Don't retry on client errors (except rate limits)
    if (error.status >= 400 && error.status < 500 && error.status !== 429) {
      return true;
    }
    
    // Don't retry on specific error codes
    const noRetryErrors = ['invalid_api_key', 'insufficient_quota'];
    return error.code && noRetryErrors.includes(error.code);
  }

  /**
   * Sleep helper
   */
  _sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Health check
   */
  async healthCheck() {
    try {
      if (!this.openai) {
        return { status: 'error', message: 'OpenAI client not initialized' };
      }

      // Make a simple API call to verify connectivity
      const testCall = await this.openai.chat.completions.create({
        model: config.api.orq ? 'openai/gpt-4o-mini' : 'gpt-4o-mini',
        messages: [{ role: 'user', content: 'test' }],
        max_tokens: 5
      });

      return { 
        status: 'healthy', 
        viaORQ: !!config.api.orq,
        model: config.api.orq ? 'openai/gpt-4o' : config.openai.model
      };
    } catch (error) {
      return { 
        status: 'error', 
        message: error.message,
        code: error.status || error.code
      };
    }
  }
}

module.exports = new AIClient();