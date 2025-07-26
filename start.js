const { spawn } = require('child_process');
const net = require('net');

const checkPort = (port) => {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.listen(port, () => {
      server.once('close', () => resolve(true));
      server.close();
    });
    server.on('error', () => resolve(false));
  });
};

const findAvailablePort = async (startPort) => {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await checkPort(port)) {
      return port;
    }
  }
  return startPort;
};

const startApp = async () => {
  console.log('🚀 Starting Pitch Deck Analyzer...');
  
  // Find available port for React
  const reactPort = await findAvailablePort(3000);
  if (reactPort !== 3000) {
    console.log(`⚠️  Port 3000 is busy, using port ${reactPort} for React`);
  }
  
  // Start server first
  console.log('📡 Starting backend server...');
  const serverProcess = spawn('node', ['server.js'], {
    stdio: 'inherit',
    env: { ...process.env }
  });
  
  // Wait a moment for server to start
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Start React with the available port
  console.log(`🎨 Starting React app on port ${reactPort}...`);
  const reactProcess = spawn('npx', ['react-scripts', 'start'], {
    stdio: 'inherit',
    env: { 
      ...process.env, 
      PORT: reactPort.toString(),
      BROWSER: 'none' // Prevent auto-opening browser
    }
  });
  
  console.log(`\n🎉 App started successfully!`);
  console.log(`📱 Frontend: http://localhost:${reactPort}`);
  console.log(`🔌 Backend:  http://localhost:8080`);
  console.log(`\n👆 Open http://localhost:${reactPort} in your browser\n`);
  
  // Handle cleanup
  const cleanup = () => {
    console.log('\n🛑 Shutting down...');
    serverProcess.kill();
    reactProcess.kill();
    process.exit();
  };
  
  process.on('SIGINT', cleanup);
  process.on('SIGTERM', cleanup);
};

startApp().catch(console.error);