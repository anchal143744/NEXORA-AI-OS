import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { repoRoot, loadLocalDevelopmentEnv, localDatabaseAddress, redactLocalSecrets } from './local-development-env.mjs';

export async function startOwnedDevPostgres(env = loadLocalDevelopmentEnv()) {
  const address = localDatabaseAddress(env);
  const markerPath = path.join(repoRoot, '.local', 'dev-database.json');
  if (!fs.existsSync(markerPath)) return false;
  const marker = JSON.parse(fs.readFileSync(markerPath, 'utf8'));
  const cluster = path.resolve(repoRoot, '.local', 'postgres');
  if (marker.kind !== 'nexora-owned-development-database' || marker.host !== address.host || marker.port !== address.port || marker.database !== address.database || path.resolve(marker.clusterDirectory ?? '').toLowerCase() !== cluster.toLowerCase() || !fs.existsSync(path.join(cluster, 'PG_VERSION'))) throw new Error('Refusing to start PostgreSQL: local ownership marker does not match configuration');
  const exe = path.join(marker.postgresBin, process.platform === 'win32' ? 'pg_ctl.exe' : 'pg_ctl');
  if (!fs.existsSync(exe)) throw new Error('Configured local PostgreSQL executable is unavailable');
  const outputPath = path.join(repoRoot, '.local', 'postgres-start.log');
  const fd = fs.openSync(outputPath, 'w');
  let result;
  try { result = spawnSync(exe, ['-D', cluster, '-l', path.join(repoRoot, '.local', 'postgres.log'), '-o', `-p ${address.port} -h 127.0.0.1 -c max_connections=50`, '-w', 'start'], { windowsHide: true, stdio: ['ignore', fd, fd], timeout: 30000 }); }
  finally { fs.closeSync(fd); }
  if (result.status !== 0) {
    // A running owned cluster is acceptable; status uses the same verified data directory.
    const status = spawnSync(exe, ['-D', cluster, 'status'], { windowsHide: true, stdio: 'ignore', timeout: 5000 });
    if (status.status !== 0) throw new Error('Project-owned PostgreSQL could not start; inspect the ignored local process log');
  }
  return true;
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const env = loadLocalDevelopmentEnv();
  try { if (!await startOwnedDevPostgres(env)) throw new Error('No project-owned local PostgreSQL marker is configured'); console.log('Project-owned local PostgreSQL is running; connection details withheld.'); }
  catch (error) { console.error(redactLocalSecrets(error.message, env)); process.exitCode = 1; }
}
