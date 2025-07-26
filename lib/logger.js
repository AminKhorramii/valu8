/**
 * Structured Logging System
 */

class Logger {
  constructor(context = 'APP') {
    this.context = context;
    this.colors = {
      info: '\x1b[36m',    // Cyan
      success: '\x1b[32m', // Green
      warn: '\x1b[33m',    // Yellow
      error: '\x1b[31m',   // Red
      debug: '\x1b[90m',   // Gray
      reset: '\x1b[0m'     // Reset
    };
  }

  _formatMessage(level, message, meta = {}) {
    const timestamp = new Date().toISOString();
    const color = this.colors[level] || this.colors.info;
    const resetColor = this.colors.reset;
    
    let logLine = `${color}[${timestamp}] [${this.context}] ${level.toUpperCase()}: ${message}${resetColor}`;
    
    if (Object.keys(meta).length > 0) {
      logLine += `\n   Meta: ${JSON.stringify(meta, null, 2)}`;
    }
    
    return logLine;
  }

  info(message, meta = {}) {
    console.log(this._formatMessage('info', message, meta));
  }

  success(message, meta = {}) {
    console.log(this._formatMessage('success', `✅ ${message}`, meta));
  }

  warn(message, meta = {}) {
    console.warn(this._formatMessage('warn', `⚠️  ${message}`, meta));
  }

  error(message, meta = {}) {
    console.error(this._formatMessage('error', `❌ ${message}`, meta));
  }

  debug(message, meta = {}) {
    if (process.env.NODE_ENV === 'development') {
      console.log(this._formatMessage('debug', `🐛 ${message}`, meta));
    }
  }

  request(requestId, method, path, duration = null) {
    const durationText = duration ? ` (${duration}ms)` : '';
    this.info(`${method} ${path}${durationText}`, { requestId });
  }

  createChild(context) {
    return new Logger(context);
  }
}

// Create default logger instance
const logger = new Logger();

module.exports = logger;