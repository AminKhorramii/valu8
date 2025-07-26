import { handleMistralRequest } from './handlers/mistral';
import { handleCORS } from './utils/cors';

export default {
  async fetch(request, env, ctx) {
    // Handle CORS
    if (request.method === 'OPTIONS') {
      return handleCORS();
    }

    const url = new URL(request.url);
    const path = url.pathname;

    try {
      // Route API requests
      if (path.startsWith('/api/mistral/')) {
        return await handleMistralRequest(request, env, path);
      }

      // Health check
      if (path === '/api/health') {
        return new Response(JSON.stringify({ 
          status: 'healthy', 
          timestamp: new Date().toISOString(),
          version: env.API_VERSION || 'v1'
        }), {
          headers: { 
            'Content-Type': 'application/json',
            ...handleCORS().headers
          }
        });
      }

      // 404 for unknown routes
      return new Response(JSON.stringify({ 
        error: 'Not found',
        path: path
      }), {
        status: 404,
        headers: { 
          'Content-Type': 'application/json',
          ...handleCORS().headers
        }
      });

    } catch (error) {
      console.error('Worker error:', error);
      
      return new Response(JSON.stringify({ 
        error: 'Internal server error',
        message: error.message
      }), {
        status: 500,
        headers: { 
          'Content-Type': 'application/json',
          ...handleCORS().headers
        }
      });
    }
  }
};