import { spawnSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const root = process.cwd();
const failures = [];
const warnings = [];

function fail(message) {
  failures.push(message);
}

function warn(message) {
  warnings.push(message);
}

function assertFile(path) {
  if (!existsSync(join(root, path))) fail(`Missing required file: ${path}`);
}

function read(path) {
  return readFileSync(join(root, path), 'utf8').replace(/^\uFEFF/, '');
}

function walk(dir, predicate, result = []) {
  const absoluteDir = join(root, dir);
  if (!existsSync(absoluteDir)) return result;
  for (const entry of readdirSync(absoluteDir)) {
    const full = join(absoluteDir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) {
      if (entry !== 'node_modules' && entry !== 'dist') walk(relative(root, full), predicate, result);
      continue;
    }
    if (predicate(full)) result.push(full);
  }
  return result;
}

function run(command, args) {
  const isWindowsCommand = process.platform === 'win32' && command.endsWith('.cmd');
  const executable = isWindowsCommand ? 'cmd.exe' : command;
  const executableArgs = isWindowsCommand ? ['/d', '/s', '/c', command, ...args] : args;
  const result = spawnSync(executable, executableArgs, { cwd: root, stdio: 'pipe', shell: false, encoding: 'utf8' });
  if (result.status !== 0) {
    const output = String(result.stderr || result.stdout || result.error?.message || '').trim();
    fail(`${command} ${args.join(' ')} failed with exit ${result.status}: ${output}`);
  }
  return result;
}

assertFile('package.json');
assertFile('apps/api/package.json');
assertFile('.env');
assertFile('prisma/schema.prisma');
assertFile('apps/api/src/app.module.ts');
assertFile('apps/api/src/main.ts');
assertFile('apps/api/src/modules/auth/auth-core.module.ts');
assertFile('apps/api/src/modules/auth/auth.module.ts');
assertFile('apps/api/src/modules/security/middleware/tenant-validation.middleware.ts');
assertFile('apps/api/src/infrastructure/queues/queue.module.ts');
assertFile('apps/api/src/modules/realtime/gateways/realtime.gateway.ts');
assertFile('apps/api/src/common/filters/global-exception.filter.ts');
assertFile('apps/api/dist/main.js');

const rootPackage = JSON.parse(read('package.json'));
for (const scriptName of ['api:typecheck', 'api:build', 'api:test', 'api:e2e']) {
  if (!rootPackage.scripts?.[scriptName]) fail(`Missing root npm script: ${scriptName}`);
}

const apiPackage = JSON.parse(read('apps/api/package.json'));
for (const scriptName of ['typecheck', 'build', 'start', 'test', 'e2e']) {
  if (!apiPackage.scripts?.[scriptName]) fail(`Missing API workspace script: ${scriptName}`);
}

const env = Object.fromEntries(
  read('.env')
    .split(/\r?\n/)
    .filter((line) => line.trim() && !line.trim().startsWith('#'))
    .map((line) => {
      const separator = line.indexOf('=');
      return [line.slice(0, separator), line.slice(separator + 1)];
    }),
);

for (const key of ['DATABASE_URL', 'REDIS_URL', 'JWT_SECRET', 'JWT_ACCESS_SECRET', 'JWT_REFRESH_SECRET']) {
  if (!env[key]) fail(`Missing required environment variable in .env: ${key}`);
}
if (env.DATABASE_URL?.includes('@postgres:')) warn('DATABASE_URL uses Docker hostname postgres; local runtime expects localhost unless Docker networking is active.');
if (env.REDIS_URL?.includes('redis:6379')) warn('REDIS_URL uses Docker hostname redis; local runtime expects localhost unless Docker networking is active.');

const authCore = read('apps/api/src/modules/auth/auth-core.module.ts');
if (!authCore.includes('@Global()')) fail('AuthCoreModule must be global for enterprise guard injection.');
if (!authCore.includes('TokenService') || !authCore.includes('JwtAuthGuard')) fail('AuthCoreModule must provide and export TokenService and JwtAuthGuard.');
if (!authCore.includes('CommonModule')) fail('AuthCoreModule must import CommonModule for RequestContextStore.');

const authModule = read('apps/api/src/modules/auth/auth.module.ts');
if (!authModule.includes('AuthCoreModule')) fail('AuthModule must import AuthCoreModule.');
if (/providers:\s*\[[^\]]*(TokenService|JwtAuthGuard)/s.test(authModule)) fail('AuthModule must not duplicate TokenService or JwtAuthGuard providers.');
if (authModule.includes('JwtModule.register')) fail('AuthModule must not register JwtModule directly.');

const sourceFiles = walk('apps/api/src', (file) => file.endsWith('.ts'));
const jwtRegistrations = sourceFiles.filter((file) => read(relative(root, file)).includes('JwtModule.register'));
if (jwtRegistrations.length !== 1 || !jwtRegistrations[0].endsWith('auth-core.module.ts')) {
  fail(`JwtModule.register must appear only in AuthCoreModule. Found: ${jwtRegistrations.map((file) => relative(root, file)).join(', ')}`);
}

const commonModule = read('apps/api/src/common/common.module.ts');
if (!commonModule.includes('RequestContextStore') || !commonModule.includes('exports: [RequestContextStore]')) {
  fail('CommonModule must export RequestContextStore.');
}

const appModule = read('apps/api/src/app.module.ts');
for (const requiredImport of ['ConfigModule', 'DatabaseModule', 'RedisModule', 'QueueModule', 'SecurityModule', 'AuthModule', 'RealtimeModule']) {
  if (!appModule.includes(requiredImport)) fail(`AppModule is missing required infrastructure module: ${requiredImport}`);
}
if (!appModule.includes('RequestContextMiddleware') || !appModule.includes('TenantValidationMiddleware') || !appModule.includes('WorkspaceValidationMiddleware')) {
  fail('AppModule must apply request, tenant, and workspace middleware.');
}

const tenantMiddleware = read('apps/api/src/modules/security/middleware/tenant-validation.middleware.ts');
if (!tenantMiddleware.includes('originalUrl') || !tenantMiddleware.includes('/health') || !tenantMiddleware.includes('/auth') || !tenantMiddleware.includes('/docs')) {
  fail('TenantValidationMiddleware must use the original URL and exempt health, auth, and docs routes.');
}

const queueModule = read('apps/api/src/infrastructure/queues/queue.module.ts');
for (const queueName of ['EMAIL', 'NOTIFICATIONS', 'REPORTS', 'EVENTS', 'AI_JOBS', 'ACTIVITY', 'WORKFLOW_EXECUTION', 'AGENT_EXECUTION', 'DEAD_LETTER']) {
  if (!queueModule.includes(`QUEUES.${queueName}`)) fail(`QueueModule missing queue registration: ${queueName}`);
}

const controllerFiles = sourceFiles.filter((file) => file.endsWith('controller.ts'));
let guardedControllers = 0;
for (const file of controllerFiles) {
  const contents = read(relative(root, file));
  if (contents.includes('@UseGuards(JwtAuthGuard)')) guardedControllers += 1;
}
if (guardedControllers < 25) fail(`Unexpectedly low JwtAuthGuard controller coverage: ${guardedControllers}`);

run('npx.cmd', ['prisma', 'validate', '--schema', 'prisma/schema.prisma']);

console.log(JSON.stringify({
  status: failures.length === 0 ? 'passed' : 'failed',
  checkedAt: new Date().toISOString(),
  controllers: controllerFiles.length,
  guardedControllers,
  warnings,
  failures,
}, null, 2));

if (failures.length) process.exit(1);





