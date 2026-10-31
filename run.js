// QuestFlow AI Unified Runner
// Spawns Backend REST Engine and Vite Development Server concurrently

import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log(`
================================================================================
  🎮 QUESTFLOW AI – Play Your Tasks. Finish Your Life.
  🏆 Google for Developers × PromptWars 2026 Hackathon
================================================================================
`);

const nodeBin = process.execPath;

// Start Server
const serverProcess = spawn(nodeBin, ['server/src/server.js'], {
  cwd: __dirname,
  env: { ...process.env, PORT: '3001' },
  stdio: 'inherit'
});

// Start Client
const isBuildMode = process.argv.includes('--production');

let clientProcess = null;
if (!isBuildMode) {
  const npxBin = path.join(path.dirname(nodeBin), 'npx');
  clientProcess = spawn(npxBin, ['vite', '--host', '0.0.0.0', '--port', '5173'], {
    cwd: path.join(__dirname, 'client'),
    env: { ...process.env, PATH: `${path.dirname(nodeBin)}:${process.env.PATH}` },
    stdio: 'inherit'
  });
}

function handleExit() {
  if (serverProcess) serverProcess.kill();
  if (clientProcess) clientProcess.kill();
  process.exit();
}

process.on('SIGINT', handleExit);
process.on('SIGTERM', handleExit);
