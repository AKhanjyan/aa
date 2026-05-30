const { spawn } = require('child_process');
const path = require('path');
const { resolveDevPort } = require('./resolve-dev-port');

const port = resolveDevPort();
const cwd = path.resolve(__dirname, '..');

const child = spawn('npx', ['next', 'dev', '--port', port], {
  stdio: 'inherit',
  shell: true,
  cwd,
});

child.on('exit', (code) => process.exit(code ?? 0));
