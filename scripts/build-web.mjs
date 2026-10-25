import path from 'node:path';
import { createRequire } from 'node:module';
import { spawn } from 'node:child_process';
import { repoRoot, loadLocalDevelopmentEnv, redactLocalSecrets } from './local-development-env.mjs';

// Next runs in apps/web; resolve the same root environment used by npm run dev.
// Process variables still override local files for deployment builds.
const env = { ...loadLocalDevelopmentEnv(), NODE_ENV: 'production' };
const webRoot = path.join(repoRoot, 'apps', 'web');
const require = createRequire(path.join(webRoot, 'package.json'));
const child = spawn(process.execPath, [require.resolve('next/dist/bin/next'), 'build'], { cwd: webRoot, env, windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'] });
for (const [stream, writer] of [[child.stdout, process.stdout], [child.stderr, process.stderr]]) {
  let buffer = '';
  stream.on('data', chunk => {
    buffer += chunk.toString();
    const lines = buffer.split(/\r?\n/); buffer = lines.pop() ?? '';
    for (const line of lines) writer.write(redactLocalSecrets(line, env) + '\n');
  });
  stream.on('end', () => { if (buffer) writer.write(redactLocalSecrets(buffer, env)); });
}
child.on('error', error => { console.error(redactLocalSecrets(error.message, env)); process.exitCode = 1; });
child.on('exit', code => { process.exitCode = code ?? 1; });
