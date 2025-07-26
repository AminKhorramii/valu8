/**
 * Centralized Configuration Management
 */

require('dotenv').config();

const config = {
  // Server settings
  server: {
    port: parseInt(process.env.PORT || '8080'),
    env: process.env.NODE_ENV || 'development',
    timeout: 30000,
    maxRequestSize: '10mb'
  },

  // API keys and external services
  api: {
    openai: process.env.OPENAI_API_KEY,
    orq: process.env.ORQ_API_KEY
  },

  // OpenAI settings
  openai: {
    model: 'gpt-4o',
    temperature: 0.3,
    maxTokens: 2000,
    timeout: 25000
  },

  // CORS settings
  cors: {
    origins: [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:3001'
    ],
    credentials: true,
    optionsSuccessStatus: 200,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
  },

  // File upload settings
  upload: {
    maxFileSize: 25 * 1024 * 1024, // 25MB
    allowedTypes: ['audio/wav', 'audio/mp3', 'audio/m4a', 'audio/ogg']
  },

  // Validation rules
  validation: {
    minContentLength: 20,
    maxContentLength: 10000
  },

  // Retry and error handling
  reliability: {
    maxRetries: 3,
    retryDelay: 1000,
    backoffMultiplier: 2
  }
};

// Validate required configuration
const requiredKeys = ['api.openai'];
const missing = [];

function checkKey(obj, keyPath) {
  const keys = keyPath.split('.');
  let current = obj;
  for (const key of keys) {
    if (!current || !current[key]) {
      return false;
    }
    current = current[key];
  }
  return true;
}

for (const key of requiredKeys) {
  if (!checkKey(config, key)) {
    missing.push(key);
  }
}

if (missing.length > 0) {
  console.error('❌ Missing required configuration:', missing);
  console.error('💡 Please check your .env file and ensure all required keys are set');
  process.exit(1);
}

// Log configuration status
console.log('⚙️  Configuration loaded:');
console.log(`   Environment: ${config.server.env}`);
console.log(`   Port: ${config.server.port}`);
console.log(`   OpenAI: ${config.api.openai ? '✅ Configured' : '❌ Missing'}`);
console.log(`   ORQ.ai: ${config.api.orq ? '✅ Configured' : '⚠️  Optional'}`);

module.exports = config;