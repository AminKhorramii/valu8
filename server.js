const express = require('express');
const multer = require('multer');
const cors = require('cors');

// Import our bulletproof modules
const config = require('./lib/config');
const logger = require('./lib/logger').createChild('SERVER');
const aiClient = require('./lib/aiClient');
const responseParser = require('./lib/responseParser');

const app = express();

// Middleware with centralized configuration
app.use(cors(config.cors));
app.use(express.json({ limit: config.server.maxRequestSize }));
app.use(express.urlencoded({ extended: true, limit: config.server.maxRequestSize }));

// Request logging middleware
app.use((req, res, next) => {
  const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  req.requestId = requestId;
  const startTime = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    logger.request(requestId, req.method, req.path, duration);
  });
  
  next();
});

// Enhanced health check endpoint
app.get('/health', async (req, res) => {
  try {
    const aiHealth = await aiClient.healthCheck();
    
    res.json({ 
      status: aiHealth.status === 'healthy' ? 'OK' : 'WARNING',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      services: {
        ai: aiHealth,
        server: {
          status: 'healthy',
          port: config.server.port,
          env: config.server.env
        }
      }
    });
  } catch (error) {
    logger.error('Health check failed', { error: error.message });
    res.status(503).json({
      status: 'ERROR',
      timestamp: new Date().toISOString(),
      error: error.message
    });
  }
});

// Enhanced API status endpoint
app.get('/api/status', (req, res) => {
  res.json({
    status: 'API Ready',
    services: {
      openai: config.api.orq ? 'via ORQ.ai proxy (v2/proxy)' : config.api.openai ? 'direct connection' : 'missing API key',
      orq: config.api.orq ? 'proxy + tracking enabled' : 'not configured',
      routing: config.api.orq ? 'All calls through ORQ.ai proxy' : 'Direct OpenAI calls',
      models: config.api.orq ? 'openai/gpt-4o, openai/whisper-1' : 'gpt-4o, whisper-1'
    },
    configuration: {
      maxRetries: config.reliability.maxRetries,
      timeout: config.openai.timeout,
      maxRequestSize: config.server.maxRequestSize
    },
    timestamp: new Date().toISOString()
  });
});

// Configure multer for file uploads with centralized config
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: config.upload.maxFileSize,
  },
  fileFilter: (req, file, cb) => {
    if (config.upload.allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`File type ${file.mimetype} not allowed. Supported types: ${config.upload.allowedTypes.join(', ')}`));
    }
  }
});

// AI services are now initialized via the aiClient module
// This provides automatic retry, health checking, and intelligent error handling
logger.success('AI services initialized via centralized client');

// Enhanced transcription endpoint with bulletproof error handling
app.post('/api/transcribe', upload.single('file'), async (req, res) => {
  const { requestId } = req;
  
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No audio file provided' });
    }

    logger.info(`Processing transcription for file: ${req.file.originalname || 'audio'}`, {
      requestId,
      fileSize: req.file.size,
      mimeType: req.file.mimetype
    });

    const result = await aiClient.generateTranscription(
      req.file.buffer,
      req.file.originalname || 'audio.wav',
      requestId
    );

    logger.success(`Transcription completed`, {
      requestId,
      textLength: result.text.length,
      duration: result.duration
    });

    res.json({ 
      text: result.text,
      metadata: {
        requestId,
        duration: result.duration
      }
    });
    
  } catch (error) {
    logger.error('Transcription failed', { 
      requestId, 
      error: error.message,
      status: error.status 
    });
    
    // Return appropriate error response
    if (error.code === 'insufficient_quota') {
      return res.status(429).json({ 
        error: 'OpenAI API quota exceeded. Please check your billing settings.',
        requestId 
      });
    } else if (error.code === 'invalid_api_key') {
      return res.status(401).json({ 
        error: 'Invalid OpenAI API key. Please check your configuration.',
        requestId
      });
    } else {
      return res.status(500).json({ 
        error: 'Failed to transcribe audio. Please try again.',
        requestId
      });
    }
  }
});

// Response parsing now handled by bulletproof centralized module

// Enhanced analysis endpoint with bulletproof architecture
app.post('/api/analyze', async (req, res) => {
  const { requestId } = req;
  
  try {
    const { content } = req.body;

    // Input validation
    if (!content || content.trim().length === 0) {
      return res.status(400).json({ error: 'No content provided', requestId });
    }

    if (content.length < config.validation.minContentLength) {
      return res.status(400).json({ 
        error: `Content too short. Please provide at least ${config.validation.minContentLength} characters describing your pitch.`,
        requestId
      });
    }

    if (content.length > config.validation.maxContentLength) {
      return res.status(400).json({ 
        error: `Content too long. Please limit to ${config.validation.maxContentLength} characters.`,
        requestId
      });
    }

    logger.info('Starting pitch analysis', {
      requestId,
      contentLength: content.length
    });
    
    // Use the bulletproof AI client with automatic retry and error handling
    const aiResult = await aiClient.generateAnalysis(content, requestId);
    
    // Use bulletproof response parser with multiple strategies
    const analysis = await responseParser.parse(aiResult.text, requestId);
    
    logger.success('Analysis completed successfully', {
      requestId,
      score: analysis.overall_score,
      duration: aiResult.duration,
      tokens: aiResult.usage?.total_tokens || 0
    });
    
    res.json({
      success: true,
      analysis: analysis,
      metadata: {
        requestId,
        duration: aiResult.duration,
        tokens: aiResult.usage?.total_tokens || 0
      }
    });
      
  } catch (error) {
    logger.error('Analysis failed', { 
      requestId, 
      error: error.message,
      status: error.status 
    });
    
    // Return appropriate error response
    if (error.code === 'insufficient_quota') {
      return res.status(429).json({ 
        error: 'OpenAI API quota exceeded. Please check your billing settings.',
        requestId
      });
    } else if (error.code === 'invalid_api_key') {
      return res.status(401).json({ 
        error: 'Invalid OpenAI API key. Please check your configuration.',
        requestId
      });
    } else if (error.code === 'rate_limit_exceeded') {
      return res.status(429).json({ 
        error: 'Rate limit exceeded. Please wait a moment and try again.',
        requestId
      });
    } else {
      return res.status(500).json({ 
        error: 'Failed to analyze pitch deck. Please try again.',
        requestId
      });
    }
  }
});

// Enhanced global error handlers
app.use((err, req, res, next) => {
  const requestId = req.requestId || 'unknown';
  
  // Handle multer errors specifically
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      logger.warn('File too large', { requestId, limit: config.upload.maxFileSize });
      return res.status(413).json({ 
        error: `File too large. Maximum size is ${Math.round(config.upload.maxFileSize / 1024 / 1024)}MB`,
        requestId
      });
    }
  }
  
  logger.error('Unhandled error', { requestId, error: err.message, stack: err.stack });
  res.status(500).json({ 
    error: 'Internal server error. Please try again.',
    requestId
  });
});

// Enhanced 404 handler
app.use((req, res) => {
  const requestId = req.requestId || 'unknown';
  logger.warn('Endpoint not found', { requestId, path: req.originalUrl, method: req.method });
  
  res.status(404).json({ 
    error: `Endpoint ${req.method} ${req.originalUrl} not found`,
    requestId,
    availableEndpoints: [
      'GET /health',
      'GET /api/status', 
      'POST /api/transcribe',
      'POST /api/analyze'
    ]
  });
});

// Graceful shutdown with proper cleanup
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  process.exit(0);
});

// Centralized server startup
const server = app.listen(config.server.port, () => {
  logger.success(`Server running on port ${config.server.port}`);
  logger.info(`Environment: ${config.server.env}`);
  logger.info(`Health check: http://localhost:${config.server.port}/health`);
  logger.info(`API status: http://localhost:${config.server.port}/api/status`);
  logger.success('🎯 Ready for requests!');
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    logger.error(`Port ${config.server.port} is already in use!`);
    logger.info('💡 To fix this:');
    logger.info(`   1. Kill the process: lsof -ti:${config.server.port} | xargs kill -9`);
    logger.info('   2. Or change PORT in .env file to a different port');
  } else {
    logger.error('Server failed to start', { error: err.message });
  }
  process.exit(1);
});

// Set server timeout to match configuration
server.timeout = config.server.timeout;

// Mock followup question endpoint
app.post('/api/followup', async (req, res) => {
  const { requestId } = req;
  
  try {
    const { initialInput } = req.body;
    
    if (!initialInput || initialInput.trim().length === 0) {
      return res.status(400).json({ error: 'No input provided', requestId });
    }
    
    logger.info('Generating followup question', {
      requestId,
      inputLength: initialInput.length
    });
    
    // Mock response - in production this would call AI
    const followupQuestion = "What specific problem does your product solve and who is your target customer?";
    
    res.json({
      success: true,
      question: followupQuestion,
      metadata: {
        requestId
      }
    });
    
  } catch (error) {
    logger.error('Followup generation failed', { 
      requestId, 
      error: error.message 
    });
    
    res.status(500).json({ 
      error: 'Failed to generate followup question',
      requestId
    });
  }
});