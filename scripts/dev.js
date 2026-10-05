import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { startServer } from '../server/index.js';

const root = fileURLToPath(new URL('../', import.meta.url));
const server = startServer();
const vite = spawn(process.execPath, ['node_modules/vite/bin/vite.js'], {
  cwd: root, stdio: 'inherit', env: process.env,
});
let stopping = false;
function stop(code = 0) {
  if (stopping) return;
  stopping = true;
  vite.kill();
  server.close(() => process.exit(code));
}
vite.on('error', error => { console.error(error.message); stop(1); });
vite.on('exit', code => stop(code || 0));
server.on('error', () => stop(1));
process.on('SIGINT', () => stop());
process.on('SIGTERM', () => stop());
