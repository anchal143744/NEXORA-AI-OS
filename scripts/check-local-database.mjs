import { checkLocalDatabase, loadLocalDevelopmentEnv, localDatabaseAddress, redactLocalSecrets } from './local-development-env.mjs';
const env = loadLocalDevelopmentEnv();
try {
  localDatabaseAddress(env);
  console.log('DATABASE_URL loaded and validated as local PostgreSQL (value withheld).');
  await checkLocalDatabase(env);
  console.log('Authenticated read-only database query passed; NEXORA schema is present.');
} catch (error) {
  console.error(redactLocalSecrets(error.message, env));
  process.exitCode = 1;
}
