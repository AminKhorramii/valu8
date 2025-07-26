import { addCORSHeaders } from '../utils/cors';
import { PROMPTS } from '../prompts/templates';

const MISTRAL_API_URL = 'https://api.mistral.ai/v1/chat/completions';

export async function handleMistralRequest(request, env, path) {
  try {
    const body = await request.json();
    const { apiKey } = body;

    if (!apiKey) {
      return createErrorResponse('API key required', 400);
    }

    // Route to specific handlers
    if (path.includes('/followup')) {
      return await handleFollowup(body, apiKey);
    } else if (path.includes('/research')) {
      return await handleResearch(body, apiKey);
    } else if (path.includes('/team')) {
      return await handleTeamAnalysis(body, apiKey);
    } else if (path.includes('/validate')) {
      return await handleValidation(apiKey);
    }

    return createErrorResponse('Unknown endpoint', 404);

  } catch (error) {
    console.error('Mistral handler error:', error);
    return createErrorResponse('Invalid request format', 400);
  }
}

async function handleFollowup(body, apiKey) {
  const { initialInput } = body;
  
  if (!initialInput) {
    return createErrorResponse('Initial input required', 400);
  }

  const prompt = PROMPTS.FOLLOWUP_QUESTION
    .replace('{initial_input}', initialInput);

  const response = await callMistral(apiKey, prompt, 'mistral-small-latest');
  
  return createSuccessResponse({
    content: response.content,
    usage: response.usage
  });
}

async function handleResearch(body, apiKey) {
  const { initialInput, followupAnswer, vcMode, roastMode, region } = body;
  
  if (!initialInput || !followupAnswer) {
    return createErrorResponse('Initial input and followup answer required', 400);
  }

  // Generate comprehensive research using multiple prompts
  const researchPromises = [
    generateBusinessOverview(apiKey, initialInput, followupAnswer, roastMode, region),
    generateMarketResearch(apiKey, initialInput, followupAnswer, region),
    generateLaunchStrategy(apiKey, initialInput, followupAnswer, region),
    generateFundingStrategy(apiKey, initialInput, followupAnswer, vcMode)
  ];

  const results = await Promise.allSettled(researchPromises);
  
  // Combine results
  const research = {
    businessOverview: results[0].status === 'fulfilled' ? results[0].value : null,
    marketResearch: results[1].status === 'fulfilled' ? results[1].value : null,
    launchStrategy: results[2].status === 'fulfilled' ? results[2].value : null,
    fundingStrategy: results[3].status === 'fulfilled' ? results[3].value : null,
    metadata: {
      timestamp: new Date().toISOString(),
      vcMode,
      roastMode,
      region
    }
  };

  return createSuccessResponse({
    research,
    usage: results.reduce((acc, result) => {
      if (result.status === 'fulfilled' && result.value.usage) {
        acc.total_tokens += result.value.usage.total_tokens;
      }
      return acc;
    }, { total_tokens: 0 })
  });
}

async function handleTeamAnalysis(body, apiKey) {
  const { linkedinUrls } = body;
  
  if (!linkedinUrls || !Array.isArray(linkedinUrls)) {
    return createErrorResponse('LinkedIn URLs array required', 400);
  }

  const prompt = PROMPTS.TEAM_ANALYSIS
    .replace('{linkedin_urls}', linkedinUrls.join(', '));

  const response = await callMistral(apiKey, prompt, 'mistral-medium-latest');
  
  return createSuccessResponse({
    analysis: response.content,
    usage: response.usage
  });
}

async function handleValidation(apiKey) {
  try {
    // Simple validation call with minimal prompt
    await callMistral(apiKey, 'Test', 'mistral-small-latest');
    return createSuccessResponse({ valid: true });
  } catch (error) {
    return createSuccessResponse({ valid: false, error: error.message });
  }
}

async function callMistral(apiKey, prompt, model = 'mistral-large-latest') {
  const response = await fetch(MISTRAL_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: model,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000
    })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Mistral API error: ${response.status} - ${error}`);
  }

  const data = await response.json();
  
  return {
    content: data.choices[0].message.content,
    usage: data.usage
  };
}

// Helper functions for specific research areas
async function generateBusinessOverview(apiKey, initialInput, followupAnswer, roastMode, region) {
  const prompt = PROMPTS.BUSINESS_OVERVIEW
    .replace('{initial_input}', initialInput)
    .replace('{followup_answer}', followupAnswer)
    .replace('{roast_mode}', roastMode ? 'true' : 'false')
    .replace('{region}', region);

  return await callMistral(apiKey, prompt, 'mistral-large-latest');
}

async function generateMarketResearch(apiKey, initialInput, followupAnswer, region) {
  const prompt = PROMPTS.MARKET_RESEARCH
    .replace('{initial_input}', initialInput)
    .replace('{followup_answer}', followupAnswer)
    .replace('{region}', region);

  return await callMistral(apiKey, prompt, 'mistral-large-latest');
}

async function generateLaunchStrategy(apiKey, initialInput, followupAnswer, region) {
  const prompt = PROMPTS.LAUNCH_STRATEGY
    .replace('{initial_input}', initialInput)
    .replace('{followup_answer}', followupAnswer)
    .replace('{region}', region);

  return await callMistral(apiKey, prompt, 'mistral-large-latest');
}

async function generateFundingStrategy(apiKey, initialInput, followupAnswer, vcMode) {
  const prompt = PROMPTS.FUNDING_STRATEGY
    .replace('{initial_input}', initialInput)
    .replace('{followup_answer}', followupAnswer)
    .replace('{vc_mode}', vcMode ? 'true' : 'false');

  return await callMistral(apiKey, prompt, 'mistral-medium-latest');
}

function createSuccessResponse(data) {
  const response = new Response(JSON.stringify(data), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
  return addCORSHeaders(response);
}

function createErrorResponse(message, status = 500) {
  const response = new Response(JSON.stringify({ error: message }), {
    status: status,
    headers: { 'Content-Type': 'application/json' }
  });
  return addCORSHeaders(response);
}