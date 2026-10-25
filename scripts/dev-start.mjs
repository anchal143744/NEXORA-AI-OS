import { createRequire } from 'node:module';
import { spawn } from 'node:child_process';
import crypto from 'node:crypto';
import fs from 'node:fs';
import net from 'node:net';
import path from 'node:path';
import { repoRoot as localRepoRoot, loadLocalDevelopmentEnv, localDatabaseAddress, checkLocalDatabase, redactLocalSecrets } from './local-development-env.mjs';
import { startOwnedDevPostgres } from './start-owned-dev-postgres.mjs';
import {createDesktopControl} from './desktop-control.mjs';
import {desktopRuntimeEnvironment} from './desktop-config.mjs';

const repoRoot = localRepoRoot;
const desktopMode = process.argv.includes('--desktop');
const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const npxCommand = process.platform === 'win32' ? 'npx.cmd' : 'npx';
const isWindows = process.platform === 'win32';
const envPath = path.join(repoRoot, '.env');

function parseEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return {};
  const source = fs.readFileSync(filePath, 'utf8').replace(/^\uFEFF/, '');
  const values = {};

  for (const line of source.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    const separator = trimmed.indexOf('=');
    if (separator === -1) continue;

    const key = trimmed.slice(0, separator).trim();
    let value = trimmed.slice(separator + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    values[key] = value;
  }

  return values;
}

const fileEnv = parseEnvFile(envPath);
const configuredEnv = {
  ...fileEnv,
  ...process.env,
  NODE_ENV: process.env.NODE_ENV ?? fileEnv.NODE_ENV ?? 'development',
  PORT: process.env.PORT ?? fileEnv.PORT ?? '4000',
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL ?? fileEnv.NEXT_PUBLIC_API_URL ?? '/api',
  NEXORA_API_INTERNAL_URL: process.env.NEXORA_API_INTERNAL_URL ?? fileEnv.NEXORA_API_INTERNAL_URL ?? 'http://localhost:4000',
  ...loadLocalDevelopmentEnv(repoRoot),
};
const env=desktopMode?desktopRuntimeEnvironment(configuredEnv):configuredEnv;

const children = new Map();
let shuttingDown = false;
let desktopControl;

function log(message = '') {
  process.stdout.write(`${redactLocalSecrets(message, env)}\n`);
}

function logStep(status, message) {
  log(`${status} ${message}`);
}

function prefixOutput(name, stream, writer) {
  let buffer = '';

  stream.on('data', (chunk) => {
    buffer += chunk.toString();
    const lines = buffer.split(/\r?\n/);
    buffer = lines.pop() ?? '';

    for (const line of lines) {
      if (line.length > 0) writer.write(`[${name}] ${redactLocalSecrets(line, env)}\n`);
    }
  });

  stream.on('end', () => {
    if (buffer.length > 0) writer.write(`[${name}] ${redactLocalSecrets(buffer, env)}\n`);
  });
}

function quoteWindowsArg(value) {
  const text = String(value);
  if (/^[A-Za-z0-9_./:=@-]+$/.test(text)) return text;
  return `"${text.replace(/"/g, '\\"')}"`;
}

function commandForPlatform(command, args) {
  // Native executables take argument arrays directly; wrapping a quoted Node
  // path in cmd.exe corrupts paths containing spaces.
  if (!isWindows || command.toLowerCase().endsWith('.exe')) return { command, args };
  return {
    command: 'cmd.exe',
    args: ['/d', '/s', '/c', [command, ...args].map(quoteWindowsArg).join(' ')],
  };
}

function run(name, command, args, options = {}) {
  if(desktopMode&&name==='web')args=['--require',path.join(repoRoot,'scripts/desktop-child-control.cjs'),...args];
  const resolved = commandForPlatform(command, args);
  const childEnv={...(options.env??env)};delete childEnv.NEXORA_DESKTOP_CONTROL_PIPE;delete childEnv.NEXORA_DESKTOP_CONTROL_TOKEN;
  const child = spawn(resolved.command, resolved.args, {
    cwd: repoRoot,
    env,
    stdio: desktopMode?['ignore','pipe','pipe','ipc']:['inherit', 'pipe', 'pipe'],
    shell: false,
    windowsHide: true,
    ...options,
    env:childEnv,
  });

  children.set(child.pid, child);
  prefixOutput(name, child.stdout, process.stdout);
  prefixOutput(name, child.stderr, process.stderr);

  child.on('error', (error) => {
    console.error(`[${name}] failed to start: ${redactLocalSecrets(error.message, env)}`);
    if (!shuttingDown) shutdown(1);
  });

  child.on('exit', (code, signal) => {
    children.delete(child.pid);
    if (shuttingDown) return;

    if (code !== 0 && code !== null) {
      console.error(`[${name}] exited with code ${code}`);
      shutdown(code);
      return;
    }

    if (signal) {
      console.error(`[${name}] exited from signal ${signal}`);
      shutdown(1);
    }
    else if(code===0){console.error(`[${name}] stopped unexpectedly`);shutdown(1);}
  });

  return child;
}

function runOnce(name, command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const resolved = commandForPlatform(command, args);
    const child = spawn(resolved.command, resolved.args, {
      cwd: repoRoot,
      env,
      stdio: ['ignore', 'pipe', 'pipe'],
      shell: false,
      windowsHide: true,
      ...options,
    });

    let output = '';
    let errorOutput = '';
    child.stdout.on('data', (chunk) => { output += chunk.toString(); });
    child.stderr.on('data', (chunk) => { errorOutput += chunk.toString(); });
    child.on('error', reject);
    child.on('exit', (code) => {
      if (code === 0) {
        resolve({ output, errorOutput });
        return;
      }
      reject(new Error(`${name} failed with exit code ${code}\n${errorOutput || output}`));
    });
  });
}

function runWithTimeout(name, command, args, timeoutMs) {
  let child;
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      if (child?.pid) killProcessTree(child.pid);
      reject(new Error(`${name} did not finish within ${Math.round(timeoutMs / 1000)} seconds.`));
    }, timeoutMs);

    const resolved = commandForPlatform(command, args);
    child = spawn(resolved.command, resolved.args, {
      cwd: repoRoot,
      env,
      stdio: ['ignore', 'pipe', 'pipe'],
      shell: false,
      windowsHide: true,
    });

    let output = '';
    let errorOutput = '';
    child.stdout.on('data', (chunk) => { output += chunk.toString(); });
    child.stderr.on('data', (chunk) => { errorOutput += chunk.toString(); });
    child.on('error', (error) => {
      clearTimeout(timer);
      reject(error);
    });
    child.on('exit', (code) => {
      clearTimeout(timer);
      if (code === 0) {
        resolve({ output, errorOutput });
        return;
      }
      reject(new Error(`${name} failed with exit code ${code}\n${errorOutput || output}`));
    });
  });
}

function databaseAddress(databaseUrl) {
  const parsed = new URL(databaseUrl);
  return {
    host: parsed.hostname,
    port: Number(parsed.port || '5432'),
    database: parsed.pathname.replace(/^\//, '') || 'postgres',
  };
}

function redisAddress(redisUrl) {
  if (!redisUrl) return null;
  const parsed = new URL(redisUrl);
  return { host: parsed.hostname, port: Number(parsed.port || '6379') };
}

function tcpConnect(host, port, timeoutMs = 2500) {
  return new Promise((resolve) => {
    const socket = net.createConnection({ host, port });
    const timeout = setTimeout(() => {
      socket.destroy();
      resolve(false);
    }, timeoutMs);

    socket.once('connect', () => {
      clearTimeout(timeout);
      socket.end();
      resolve(true);
    });

    socket.once('error', () => {
      clearTimeout(timeout);
      socket.destroy();
      resolve(false);
    });
  });
}

async function waitForTcp(host, port, timeoutMs, label) {
  const startedAt = Date.now();
  while (Date.now() - startedAt < timeoutMs) {
    if (await tcpConnect(host, port, 1500)) return true;
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
  logStep('x', `${label} unavailable after ${Math.round(timeoutMs / 1000)} seconds.`);
  return false;
}

async function waitForUrl(url, timeoutMs, label) {
  const startedAt = Date.now();
  while (Date.now() - startedAt < timeoutMs) {
    try {
      const response = await fetch(url, { cache: 'no-store', signal: AbortSignal.timeout(Math.min(3000, timeoutMs - (Date.now() - startedAt))) });
      if (response.ok) return true;
    } catch {
      // Dev servers commonly need a few seconds after binding.
    }
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
  logStep('x', `${label} did not respond within ${Math.round(timeoutMs / 1000)} seconds.`);
  return false;
}

async function dockerEngineOnline() {
  try {
    await runOnce('docker engine check', 'docker', ['info']);
    return true;
  } catch {
    return false;
  }
}

async function waitForDockerEngine(timeoutMs) {
  const startedAt = Date.now();
  while (Date.now() - startedAt < timeoutMs) {
    if (await dockerEngineOnline()) return true;
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }
  return false;
}

function dockerDesktopExecutableCandidates() {
  if (!isWindows) return [];
  return [
    process.env.LOCALAPPDATA && path.join(process.env.LOCALAPPDATA, 'Programs', 'DockerDesktop', 'Docker Desktop.exe'),
    process.env.LOCALAPPDATA && path.join(process.env.LOCALAPPDATA, 'Programs', 'DockerDesktop', 'frontend', 'Docker Desktop.exe'),
    process.env.LOCALAPPDATA && path.join(process.env.LOCALAPPDATA, 'Programs', 'DockerDesktop', 'resources', 'Docker desktop.exe'),
    process.env.ProgramFiles && path.join(process.env.ProgramFiles, 'Docker', 'Docker', 'Docker Desktop.exe'),
  ].filter(Boolean);
}

async function startDockerDesktopApplication() {
  for (const candidate of dockerDesktopExecutableCandidates()) {
    if (!fs.existsSync(candidate)) continue;
    try {
      const child = spawn(candidate, [], {
        detached: true,
        stdio: 'ignore',
        windowsHide: true,
      });
      child.unref();
      logStep('-', 'Docker Desktop application start requested.');
      return true;
    } catch {
      // Try the next known install location.
    }
  }
  return false;
}

async function dockerComposeUp(serviceNames) {
  const composeFile = path.join(repoRoot, 'docker-compose.yml');
  if (!fs.existsSync(composeFile)) return false;

  try {
    await runOnce('docker check', 'docker', ['--version']);
  } catch {
    return false;
  }

  if (!(await dockerEngineOnline())) {
    if (isWindows) {
      logStep('-', 'Docker engine is offline. Starting Docker Desktop...');
      try {
        await runWithTimeout('Docker Desktop start', 'docker', ['desktop', 'start'], 60000);
      } catch (error) {
        logStep('!', `Docker Desktop start command did not complete cleanly: ${error.message.split('\n')[0]}`);
        await startDockerDesktopApplication();
      }
    }

    if (!(await waitForDockerEngine(90000))) {
      logStep('!', 'Docker engine is not available.');
      return false;
    }
  }

  try {
    await runOnce('docker compose up', 'docker', ['compose', 'up', '-d', ...serviceNames]);
    return true;
  } catch (error) {
    logStep('!', `Docker Compose could not start ${serviceNames.join(', ')}: ${error.message.split('\n')[0]}`);
    return false;
  }
}

function killProcessTree(pid) {
  if (!pid) return;
  if (isWindows) {
    spawn('taskkill', ['/pid', String(pid), '/T', '/F'], { stdio: 'ignore', windowsHide: true });
    return;
  }
  try {
    process.kill(-pid, 'SIGTERM');
  } catch {
    try {
      process.kill(pid, 'SIGTERM');
    } catch {
      // The process already exited.
    }
  }
}

async function shutdown(exitCode = 0) {
  if(shuttingDown)return;
  shuttingDown = true;
  desktopControl?.close();
  const outcomes=await Promise.all([...children.values()].map(child=>new Promise(resolve=>{
    let forced=false;
    const timeout=setTimeout(()=>{forced=true;killProcessTree(child.pid);resolve({pid:child.pid,forced:true});},20000);
    child.once('exit',code=>{clearTimeout(timeout);resolve({pid:child.pid,forced,code});});
    if(desktopMode&&child.connected)child.send({type:'nexora:shutdown'},error=>{if(error){forced=true;killProcessTree(child.pid);}});
    else{forced=true;killProcessTree(child.pid);}
  })));
  if(desktopMode)fs.writeFileSync(path.join(repoRoot,'.local/desktop-shutdown.json'),JSON.stringify({pid:process.pid,at:new Date().toISOString(),graceful:outcomes.every(outcome=>!outcome.forced&&outcome.code===0),exitCode,outcomes},null,2));
  process.exit(exitCode);
}



async function removePathWithRetry(targetPath, attempts = 5) {
  const resolved = path.resolve(targetPath);
  const permittedRoot = path.resolve(repoRoot, 'apps', 'web') + path.sep;
  if (!resolved.startsWith(permittedRoot) || !['.next', 'tsconfig.tsbuildinfo'].includes(path.basename(resolved))) throw new Error('Unexpected development artifact path');
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      fs.rmSync(targetPath, { recursive: true, force: true, maxRetries: 2, retryDelay: 150 });
      return;
    } catch (error) {
      if (attempt === attempts) throw error;
      await new Promise((resolve) => setTimeout(resolve, attempt * 250));
    }
  }
}

async function cleanWebDevelopmentArtifacts() {
  const webRoot = path.join(repoRoot, 'apps', 'web');
  const targets = [path.join(webRoot, '.next'), path.join(webRoot, 'tsconfig.tsbuildinfo')];
  await Promise.all(targets.map((target) => removePathWithRetry(target)));
  logStep('ok', 'Web development build artifacts are clean.');
}
function sha256File(targetPath) {
  return crypto.createHash('sha256').update(fs.readFileSync(targetPath)).digest('hex');
}

function prismaGenerateStatePath() {
  return path.join(repoRoot, '.local', 'prisma-generate-state.json');
}

function readPrismaGenerateState() {
  try {
    return JSON.parse(fs.readFileSync(prismaGenerateStatePath(), 'utf8'));
  } catch {
    return null;
  }
}

function writePrismaGenerateState(schemaHash) {
  const target = prismaGenerateStatePath();
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, JSON.stringify({ schemaHash, generatedAt: new Date().toISOString() }, null, 2), 'utf8');
}

function prismaClientLooksGenerated() {
  return fs.existsSync(path.join(repoRoot, 'node_modules', '.prisma', 'client', 'index.js'))
    && fs.existsSync(path.join(repoRoot, 'node_modules', '@prisma', 'client', 'default.js'));
}

function isPrismaWindowsFileLock(error) {
  const message = String(error?.stack ?? error?.message ?? error);
  return /\b(EPERM|EBUSY)\b/i.test(message)
    || /operation not permitted/i.test(message)
    || /query_engine.*\.dll\.node/i.test(message)
    || /node_modules[\\/](\.prisma|@prisma)/i.test(message);
}

async function runPrismaGenerateSafely() {
  const schemaPath = path.join(repoRoot, 'prisma', 'schema.prisma');
  const schemaHash = sha256File(schemaPath);
  const state = readPrismaGenerateState();

  if (prismaClientLooksGenerated() && state?.schemaHash === schemaHash) {
    logStep('ok', 'Prisma client already matches the current schema.');
    return;
  }

  try {
    await runWithTimeout('Prisma generate', npxCommand, ['prisma', 'generate', '--schema', 'prisma/schema.prisma'], 60000);
    writePrismaGenerateState(schemaHash);
    logStep('ok', 'Prisma client generated.');
  } catch (error) {
    if (isPrismaWindowsFileLock(error)) {
      logStep('x', 'Prisma generate was blocked by a Windows file lock.');
      if (repoRoot.toLowerCase().includes('onedrive')) {
        log('   This project is inside OneDrive; syncing or another running Node process may hold the Prisma engine file open.');
      }
      log('   Close running Node/Nest/Next processes, pause OneDrive sync for this folder, then rerun npm.cmd run dev.');
      log('   Long-term fix: move the repo outside OneDrive, for example C:\\Dev\\NEXORA_AI.');
    }

    throw error;
  }
}

async function prepareDatabase() {
  if (!env.DATABASE_URL) {
    logStep('x', 'DATABASE_URL is missing. Add it to .env before starting NEXORA.');
    process.exit(1);
  }

  const database = localDatabaseAddress(env);
  logStep('ok', 'DATABASE_URL loaded as local PostgreSQL (value withheld).');

  let databaseOnline = await tcpConnect(database.host, database.port);
  if (!databaseOnline) {
    logStep('!', 'PostgreSQL is not reachable yet.');
    if (await startOwnedDevPostgres(env)) logStep('ok', 'Started the verified project-owned local PostgreSQL instance.');
    if (env.NEXORA_AUTO_START_DOCKER === 'true') await dockerComposeUp(['postgres']);
    databaseOnline = await waitForTcp(database.host, database.port, 30000, 'PostgreSQL');
  }

  if (!databaseOnline) {
    log('');
    logStep('x', 'PostgreSQL is required for local development and could not be reached.');
    log('   Start PostgreSQL manually or run: docker compose up -d postgres');
    log('   Then rerun: npm.cmd run dev');
    process.exit(1);
  }

  logStep('-', 'Verifying Prisma client...');
  await runPrismaGenerateSafely();
  await checkLocalDatabase(env);
  logStep('ok', 'Authenticated read-only PostgreSQL check and NEXORA schema check passed.');

  logStep('ok', 'Database verified. Startup does not apply migrations or reset data.');
}

async function prepareOptionalRedis() {
  if (env.REDIS_DISABLED === 'true') { logStep('!', '[Redis Disabled] Configured development mode.'); return; }
  const redis = redisAddress(env.REDIS_URL);
  if (!redis) {
    env.REDIS_DISABLED = 'true';
    logStep('!', '[Redis Disabled] REDIS_URL is not configured. Running Development Mode.');
    return;
  }

  if (await tcpConnect(redis.host, redis.port, 1000)) {
    logStep('ok', `Redis reachable at ${redis.host}:${redis.port}.`);
    return;
  }

  await dockerComposeUp(['redis']);
  if (await waitForTcp(redis.host, redis.port, 5000, 'Redis')) {
    logStep('ok', `Redis reachable at ${redis.host}:${redis.port}.`);
    return;
  }

  env.REDIS_DISABLED = 'true';
  logStep('!', '[Redis Disabled] Running Development Mode. Queues and Redis cache stay optional locally.');
}

async function main() {
  localDatabaseAddress(env);
  if(desktopMode){desktopControl=createDesktopControl(env.NEXORA_DESKTOP_CONTROL_PIPE,env.NEXORA_DESKTOP_CONTROL_TOKEN,()=>shutdown(0));await new Promise((resolve,reject)=>{desktopControl.once('error',reject);desktopControl.listen(env.NEXORA_DESKTOP_CONTROL_PIPE,resolve);});}
  if (!env.JWT_SECRET || env.JWT_SECRET.length < 32) throw new Error('JWT_SECRET must be configured locally with at least 32 characters; its value is withheld.');
  const apiPort = Number(env.PORT);
  const webPort = Number(env.NEXORA_WEB_PORT ?? 3000);
  if (![apiPort, webPort].every(port => Number.isInteger(port) && port > 0 && port <= 65535) || apiPort === webPort) throw new Error('Configure distinct valid PORT and NEXORA_WEB_PORT values for local development.');
  for (const port of [apiPort, webPort]) {
    if (await tcpConnect('127.0.0.1', port, 500) || await tcpConnect('::1', port, 500)) throw new Error(`Development port ${port} is already in use. Choose another local port before starting NEXORA.`);
  }
  log('');
  log('NEXORA AI OS local development');
  log(desktopMode ? 'Local Desktop Mode (compiled services)' : 'Development Mode');
  log('');

  await prepareDatabase();
  await prepareOptionalRedis();
  if (desktopMode) {
    for (const artifact of ['apps/api/dist/main.js','apps/web/.next/BUILD_ID']) {
      if (!fs.existsSync(path.join(repoRoot,artifact))) throw new Error('Desktop build is missing. Run npm run desktop:prepare once.');
    }
  } else await cleanWebDevelopmentArtifacts();

  log('');
  logStep('-', 'Starting backend and frontend...');
  if (desktopMode) {
    run('api', process.execPath, [path.join(repoRoot, 'apps/api/dist/main.js')], { env: { ...env, NEXORA_LOCAL_DESKTOP: 'true' } });
    const webRequire = createRequire(path.join(repoRoot, 'apps/web/package.json'));
    run('web', process.execPath, [webRequire.resolve('next/dist/bin/next'), 'start', path.join(repoRoot, 'apps/web'), '--port', String(webPort), '--hostname', '127.0.0.1'], { env: { ...env, NODE_ENV: 'production', PORT: String(webPort) } });
  } else {
    run('api', npmCommand, ['run', 'api:dev']);
    run('web', npmCommand, ['--workspace', '@nexora/web', 'run', 'dev', '--', '--port', String(webPort)], { env: { ...env, PORT: String(webPort) } });
  }

  const apiHealthUrl = env.NEXORA_API_INTERNAL_URL.replace(/\/$/, '') + '/api/v1/health/live';
  const frontendUrl = `http://localhost:${webPort}`;
  const apiReady = await waitForUrl(apiHealthUrl, 90000, 'Internal Backend API');
  const webReady = await waitForUrl(frontendUrl, 90000, 'Frontend');
  const publicApiHealthUrl = frontendUrl + '/api/v1/health/live';
  const publicApiReady = webReady ? await waitForUrl(publicApiHealthUrl, 30000, 'Public API Gateway') : false;

  log('');
  if (apiReady && webReady && publicApiReady) {
    logStep('ok', 'Application Ready');
    log(`   Open NEXORA: ${frontendUrl}`);
    log(`   API Gateway: ${frontendUrl}/api`);
    if(!desktopMode)log(`   Swagger: ${frontendUrl}/api/docs`);
    log(`   Health: ${frontendUrl}/api/v1/health/live`);
  } else {
    logStep('x', 'Application did not become fully ready. Check the prefixed api/web logs above.');
    shutdown(1);
  }
}

process.on('SIGINT', () => shutdown(0));
process.on('SIGTERM', () => shutdown(0));
process.on('uncaughtException', (error) => {
  console.error(`[dev] uncaught exception: ${redactLocalSecrets(error.stack ?? error.message, env)}`);
  shutdown(1);
});
process.on('unhandledRejection', (reason) => {
  console.error('[dev] unhandled rejection:', redactLocalSecrets(reason?.stack ?? reason?.message ?? reason, env));
  shutdown(1);
});

main().catch((error) => {
  console.error(`[dev] startup failed: ${redactLocalSecrets(error.stack ?? error.message, env)}`);
  shutdown(1);
});
