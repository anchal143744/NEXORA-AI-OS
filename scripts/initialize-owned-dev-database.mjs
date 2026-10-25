import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { PrismaClient } from '@prisma/client';
import { repoRoot, loadLocalDevelopmentEnv, localDatabaseAddress, redactLocalSecrets } from './local-development-env.mjs';
const env = loadLocalDevelopmentEnv();
try {
  const address = localDatabaseAddress(env);
  const markerPath = path.join(repoRoot, '.local', 'dev-database.json');
  const marker = JSON.parse(fs.readFileSync(markerPath, 'utf8'));
  if (marker.kind !== 'nexora-owned-development-database' || marker.host !== address.host || marker.port !== address.port || marker.database !== address.database || !/^nexora_local_dev_[a-f0-9]{12}$/.test(address.database)) throw new Error('Refusing initialization: URL does not match the newly provisioned development database');
  const expectedCluster = path.resolve(repoRoot, '.local', 'postgres');
  if (path.resolve(marker.clusterDirectory ?? '') !== expectedCluster || address.schema !== 'public') throw new Error('Refusing initialization: development cluster or schema does not match ownership marker');
  const client = new PrismaClient({ datasources: { db: { url: env.DATABASE_URL } }, log: [] });
  try {
    const [result] = await client.$queryRaw`SELECT current_database() AS name, current_setting('data_directory') AS directory`;
    if (result.name !== marker.database) throw new Error('Connected database does not match ownership marker');
    if (path.resolve(result.directory) !== expectedCluster) throw new Error('Connected PostgreSQL instance does not match the owned development cluster');
    if (!marker.initialized) {
      const [tables] = await client.$queryRaw`SELECT count(*)::int AS count FROM information_schema.tables WHERE table_schema = 'public'`;
      if (tables.count !== 0) throw new Error('Fresh database is not empty. No reset or automatic baselining will be attempted.');
    }
  } finally { await client.$disconnect(); }
  console.log('Verified separately provisioned local development database; applying checked-in migrations explicitly.');
  const result = spawnSync(process.execPath, [path.join(repoRoot, 'node_modules/prisma/build/index.js'), 'migrate', 'deploy', '--schema', path.join(repoRoot, 'prisma/schema.prisma')], { cwd: repoRoot, env, windowsHide: true, encoding: 'utf8', timeout: 180000, maxBuffer: 4 * 1024 * 1024 });
  if (result.status !== 0) throw new Error(redactLocalSecrets(result.stderr || result.stdout || result.error?.message || 'Migration failed', env));
  marker.initialized = true; marker.initializedAt = new Date().toISOString();
  fs.writeFileSync(markerPath, JSON.stringify(marker, null, 2));
  console.log('Development database migrations completed. Database URL and credentials withheld.');
} catch (error) { console.error(redactLocalSecrets(error.message, env)); process.exitCode = 1; }
