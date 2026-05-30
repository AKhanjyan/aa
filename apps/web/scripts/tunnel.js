const { spawn } = require('child_process');
const { resolveDevPort } = require('./resolve-dev-port');

console.log('🚇 Միացնում եմ Cloudflare Tunnel...\n');

const devPort = resolveDevPort();
const tunnel = spawn('npx', ['--yes', 'cloudflared', 'tunnel', '--url', `http://localhost:${devPort}`], {
  stdio: ['inherit', 'pipe', 'pipe'],
  shell: true
});

let urlFound = false;

tunnel.stdout.on('data', (data) => {
  const output = data.toString();
  process.stdout.write(output);
  
  // Գտնում ենք URL-ը output-ում
  const urlMatch = output.match(/https:\/\/[a-z0-9-]+\.trycloudflare\.com/);
  if (urlMatch && !urlFound) {
    urlFound = true;
    const url = urlMatch[0];
    console.log('\n' + '='.repeat(80));
    console.log('✅ TUNNEL URL:');
    console.log(url);
    console.log('='.repeat(80) + '\n');
  }
});

tunnel.stderr.on('data', (data) => {
  process.stderr.write(data);
});

tunnel.on('close', (code) => {
  if (code !== 0) {
    console.error(`\n❌ Tunnel-ը փակվեց կոդով: ${code}`);
  }
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n\n🛑 Փակում եմ tunnel-ը...');
  tunnel.kill();
  process.exit(0);
});

process.on('SIGTERM', () => {
  tunnel.kill();
  process.exit(0);
});






