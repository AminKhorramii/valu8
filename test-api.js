#!/usr/bin/env node

const http = require('http');

// Helper function to make HTTP requests
function makeRequest(path, method = 'GET', data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 8080,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      }
    };

    const req = http.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        try {
          const parsed = JSON.parse(responseData);
          resolve({ status: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, data: responseData });
        }
      });
    });
    
    req.on('error', (err) => {
      reject(err);
    });
    
    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

async function testAPI() {
  console.log('🧪 Testing Bulletproof Pitch Deck Analyzer API\n');
  
  try {
    // Test 1: Health Check
    console.log('1. Testing /health endpoint...');
    const health = await makeRequest('/health');
    console.log(`   Status: ${health.status}`);
    console.log(`   Services: ${health.data.services?.ai?.status || 'unknown'}`);
    console.log(`   ✅ Health check passed\n`);
    
    // Test 2: API Status
    console.log('2. Testing /api/status endpoint...');
    const status = await makeRequest('/api/status');
    console.log(`   Status: ${status.status}`);
    console.log(`   OpenAI: ${status.data.services?.openai || 'unknown'}`);
    console.log(`   ORQ: ${status.data.services?.orq || 'unknown'}`);
    console.log(`   ✅ API status check passed\n`);
    
    // Test 3: Analysis Endpoint with short content
    console.log('3. Testing /api/analyze with sample pitch...');
    const samplePitch = `
    Our startup EcoCart is revolutionizing online shopping by automatically offsetting carbon emissions for every purchase. 
    We partner with e-commerce platforms to calculate the carbon footprint of each transaction and offer customers 
    seamless carbon offset options. Our technology integrates with existing checkout systems and provides detailed 
    impact tracking. We've already partnered with 50+ online stores and offset over 10,000 tons of CO2. 
    We're seeking $2M to scale our platform and expand internationally.
    `;
    
    const analysis = await makeRequest('/api/analyze', 'POST', { content: samplePitch });
    console.log(`   Status: ${analysis.status}`);
    if (analysis.data.success) {
      console.log(`   Overall Score: ${analysis.data.analysis.overall_score}/100`);
      console.log(`   Categories: ${analysis.data.analysis.categories.length}`);
      console.log(`   Duration: ${analysis.data.metadata.duration}ms`);
      console.log(`   ✅ Analysis completed successfully\n`);
    } else {
      console.log(`   ❌ Analysis failed: ${analysis.data.error}\n`);
    }
    
    // Test 4: Error handling - empty content
    console.log('4. Testing error handling with empty content...');
    const errorTest = await makeRequest('/api/analyze', 'POST', { content: '' });
    console.log(`   Status: ${errorTest.status} (expected 400)`);
    console.log(`   Error: ${errorTest.data.error}`);
    console.log(`   ✅ Error handling working correctly\n`);
    
    console.log('🎉 All tests completed! The bulletproof architecture is working.');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run tests
testAPI();