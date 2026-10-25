import { closeSync, existsSync, mkdirSync, mkdtempSync, openSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import net from 'node:net';

const root = fileURLToPath(new URL('../', import.meta.url));
const modes=['--ui','--ui-session','--ui-only-session','--ui-lifecycle-only'];
if(process.argv.slice(2).some(value=>!modes.includes(value))||modes.filter(value=>process.argv.includes(value)).length>1)throw new Error('Choose at most one supported disposable test mode. No database has been created or modified.');
const runtime = path.join(root, 'tests', '.runtime');
mkdirSync(runtime, { recursive: true });
const pgBin = process.env.NEXORA_TEST_POSTGRES_BIN ?? (process.platform === 'win32' ? 'C:/Program Files/PostgreSQL/16/bin' : '/usr/lib/postgresql/16/bin');
const exe = name => path.join(pgBin, name + (process.platform === 'win32' ? '.exe' : ''));
for (const name of ['initdb', 'pg_ctl', 'psql', 'createdb']) if (!existsSync(exe(name))) throw new Error(`PostgreSQL test prerequisite missing: ${exe(name)}. Set NEXORA_TEST_POSTGRES_BIN. No production database fallback is supported.`);
if (!existsSync(path.join(root, 'apps/api/dist/modules/retail/retail-sales.service.js'))) throw new Error('Run npm run api:build before retail:test');
const cluster = mkdtempSync(path.join(runtime, 'cluster-'));
const database = `nexora_retail_test_${randomUUID().replaceAll('-', '')}`;
const port = await new Promise((resolve, reject) => { const server = net.createServer(); server.on('error', reject); server.listen(0, '127.0.0.1', () => { const chosen = server.address().port; server.close(() => resolve(chosen)); }); });
const url = `postgresql://nexora_test@127.0.0.1:${port}/${database}?schema=public&connection_limit=10`;
const childEnv = { ...process.env, PGCONNECT_TIMEOUT: '5', DATABASE_URL: url, NEXORA_RETAIL_TEST_DATABASE_URL: url, NEXORA_TEST_CLUSTER_PATH: cluster };
let commandNumber = 0;
function run(command, args, { output = false, env = childEnv } = {}) {
  // File handles avoid pg_ctl's server descendant retaining an inherited pipe on Windows.
  const outputPath = path.join(runtime, `${path.basename(cluster)}-command-${++commandNumber}.log`);
  const fd = openSync(outputPath, 'w');
  let result;
  try { result = spawnSync(command, args, { cwd: root, env, windowsHide: true, encoding: 'utf8', stdio: ['ignore', fd, fd], timeout: 240000 }); }
  finally { closeSync(fd); }
  const text = readFileSync(outputPath, 'utf8');
  if (output) process.stdout.write(text);
  if (result.status !== 0) throw new Error(`${path.basename(command)} failed (${result.status ?? result.error?.code}): ${String(text || result.error?.message).slice(-6000)}`);
  return text;
}
let started = false,passed=false;
try {
  run(exe('initdb'), ['-D', cluster, '-U', 'nexora_test', '--auth=trust', '--encoding=UTF8', '--locale=C']);
  started = true;
  // Keep the active server log outside PGDATA: its own fsync/recovery should
  // not contend with a concurrently opened log in a synced workspace.
  run(exe('pg_ctl'), ['-D', cluster, '-l', path.join(runtime, path.basename(cluster)+'-postgres.log'), '-o', `-p ${port} -h 127.0.0.1 -c max_connections=30`, '-w', 'start']);
  const actual = run(exe('psql'), ['-h', '127.0.0.1', '-p', String(port), '-U', 'nexora_test', '-d', 'postgres', '-At', '-c', 'SHOW data_directory']).trim();
  if (path.resolve(actual).toLowerCase() !== path.resolve(cluster).toLowerCase()) throw new Error('Refusing to initialize a database outside the newly created test cluster');
  run(exe('createdb'), ['-h', '127.0.0.1', '-p', String(port), '-U', 'nexora_test', database]);
  console.log('Verified isolated PostgreSQL cluster; applying the complete checked-in migration chain to its new empty database.');
  run(process.execPath, ['node_modules/prisma/build/index.js', 'migrate', 'deploy', '--schema', 'prisma/schema.prisma']);
  if(!process.argv.includes('--ui-only-session')&&!process.argv.includes('--ui-lifecycle-only')){
  console.log('Disposable PostgreSQL migrations completed; running real database and HTTP tests.');
  const results = run(process.execPath, ['--test', '--test-concurrency=1', 'tests/retail-money.test.mjs', 'tests/retail.integration.mjs', 'tests/shop-application.integration.mjs'], { output: true });
  writeFileSync(path.join(runtime, 'retail-final-results.txt'), results);
  console.log('Verifying encrypted backup and restore only inside the disposable cluster.');
  const backupResults = run(process.execPath, ['--test', 'tests/desktop-backup.integration.mjs'], { output: true });
  writeFileSync(path.join(runtime, 'desktop-backup-results.txt'), backupResults);
  }
  if(process.argv.includes('--ui-lifecycle-only')){
    console.log('Running only disposable frontend/API fixture shutdown and interruption tests.');
    run(process.execPath,['--test','--test-concurrency=1','tests/e2e/ui-fixture-lifecycle.integration.mjs'],{output:true});
  }
  if(process.argv.includes('--ui')) {
    console.log('Running UI tests only against this disposable cluster. No existing web server is reused.');
    run(process.execPath,['node_modules/@playwright/test/cli.js','test','--config','tests/e2e/playwright.config.mjs'],{output:true});
  }
  if(process.argv.includes('--ui-session')||process.argv.includes('--ui-only-session')){
    const child=await import('node:child_process').then(({spawn})=>spawn(process.execPath,['tests/e2e/approved-ui-session.mjs'],{cwd:root,env:childEnv,windowsHide:true,stdio:['ignore','inherit','inherit','ipc']}));
    const shutdown=()=>{if(child.connected)child.send({type:'nexora:shutdown'},()=>{});};
    process.once('SIGINT',shutdown);process.once('SIGTERM',shutdown);
    let code;try{code=await new Promise((resolve,reject)=>{child.once('error',reject);child.once('exit',resolve);});}finally{process.off('SIGINT',shutdown);process.off('SIGTERM',shutdown);}
    if(code!==0)throw new Error('Disposable approved-browser UI session failed.');
  }
  passed=true;
} finally {
  if (started) {
    try { if(existsSync(path.join(cluster,'postmaster.pid')))run(exe('pg_ctl'), ['-D', cluster, '-m', 'fast', '-w', 'stop']); }
    catch (error) { passed=false;console.error('Could not stop disposable cluster:', error.message); process.exitCode = 1; }
  }
  // Keep failure evidence. Remove only the exact generated cluster after a confirmed stop.
  const resolved = path.resolve(cluster);
  if (passed && resolved.startsWith(path.resolve(runtime) + path.sep) && path.basename(resolved).startsWith('cluster-') && !existsSync(path.join(resolved, 'postmaster.pid'))) {
    const log = path.join(runtime,path.basename(resolved)+'-postgres.log');
    if (existsSync(log)) writeFileSync(path.join(runtime, 'retail-postgres-final.log'), readFileSync(log));
    rmSync(resolved, { recursive: true, force: true });
  }
}
