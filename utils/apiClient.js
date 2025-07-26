/**
 * Intelligent API Client with retry logic and error handling
 */

class APIClient {
  constructor(openai, config = {}) {
    this.openai = openai;
    this.config = {
      maxRetries: 3,
      initialDelay: 1000,
      maxDelay: 10000,
      backoffMultiplier: 2,
      timeout: 30000,
      ...config
    };
  }

  /**
   * Make API call with intelligent retry logic
   */
  async callWithRetry(apiCall, context = {}) {
    let lastError;
    let delay = this.config.initialDelay;

    for (let attempt = 1; attempt <= this.config.maxRetries; attempt++) {
      try {
        console.log(`🔄 Attempt ${attempt}/${this.config.maxRetries} for ${context.operation || 'API call'}`);
        
        const result = await this.withTimeout(apiCall(), this.config.timeout);
        
        console.log(`✅ Success on attempt ${attempt}`);
        return result;
        
      } catch (error) {
        lastError = error;
        console.error(`❌ Attempt ${attempt} failed:`, error.message);
        
        // Don't retry on certain errors
        if (this.shouldNotRetry(error)) {
          throw error;
        }
        
        // Wait before retry (except on last attempt)
        if (attempt < this.config.maxRetries) {
          console.log(`⏳ Waiting ${delay}ms before retry...`);
          await this.sleep(delay);
          delay = Math.min(delay * this.config.backoffMultiplier, this.config.maxDelay);
        }
      }
    }

    throw new Error(`Failed after ${this.config.maxRetries} attempts. Last error: ${lastError.message}`);
  }

  /**
   * Add timeout to promise
   */
  withTimeout(promise, timeout) {
    return Promise.race([
      promise,
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error(`Operation timed out after ${timeout}ms`)), timeout)
      )
    ]);
  }

  /**
   * Check if error should trigger retry
   */
  shouldNotRetry(error) {
    // Don't retry on client errors
    if (error.status >= 400 && error.status < 500) {
      // Except for rate limits
      if (error.status !== 429) {
        return true;
      }
    }
    
    // Don't retry on specific error codes
    const noRetryErrors = ['invalid_api_key', 'insufficient_quota', 'invalid_request'];
    if (error.code && noRetryErrors.includes(error.code)) {
      return true;
    }
    
    return false;
  }

  /**
   * Enhanced error information
   */
  enhanceError(error, context) {
    const enhanced = new Error(error.message);
    enhanced.originalError = error;
    enhanced.context = context;
    enhanced.timestamp = new Date().toISOString();
    
    // Add helpful information based on error type
    if (error.status === 429) {
      enhanced.userMessage = "Rate limit exceeded. Please wait a moment and try again.";
      enhanced.retryAfter = error.headers?.['retry-after'] || 60;
    } else if (error.status === 401) {
      enhanced.userMessage = "Authentication failed. Please check your API key.";
    } else if (error.status === 500) {
      enhanced.userMessage = "Server error. Please try again later.";
    } else if (error.code === 'ECONNREFUSED') {
      enhanced.userMessage = "Connection failed. Please check your internet connection.";
    } else {
      enhanced.userMessage = "An unexpected error occurred. Please try again.";
    }
    
    return enhanced;
  }

  /**
   * Sleep helper
   */
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Analyze pitch with all safety measures
   */
  async analyzePitch(content, systemPrompt) {
    const context = {
      operation: 'pitch_analysis',
      contentLength: content.length,
      startTime: Date.now()
    };

    // Don't use response_format with ORQ.ai proxy - it causes issues
    const completion = await this.callWithRetry(
      () => this.openai.chat.completions.create({
        model: process.env.ORQ_API_KEY ? 'openai/gpt-4o' : 'gpt-4o',
        messages: [
          { 
            role: 'system', 
            content: systemPrompt + '\n\nCRITICAL: Return ONLY the JSON object. Do not wrap in markdown code blocks. Do not include any text before or after the JSON.'
          },
          { role: 'user', content: content }
        ],
        temperature: 0.3,
        max_tokens: 2000
      }),
      context
    );

    return completion;
  }
}

module.exports = APIClient;