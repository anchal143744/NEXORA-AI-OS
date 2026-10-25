import assert from 'node:assert/strict';import test from 'node:test';import fs from 'node:fs';import path from 'node:path';import {spawnSync} from 'node:child_process';import {fileURLToPath} from 'node:url';import {createHash} from 'node:crypto';
const root=fileURLToPath(new URL('../',import.meta.url));
for(const [name,changes]of [
  ['remote API',{NEXORA_API_INTERNAL_URL:'http://remote.invalid:4001'}],
  ['URL credentials',{NEXORA_API_INTERNAL_URL:'http://private-user:must-not-leak@localhost:4001'}],
  ['missing database URL',{DATABASE_URL:''}],
  ['conflicting ports',{NEXORA_WEB_PORT:'4001',PORT:'4001'}],
])test(`startup rejects ${name} before touching the existing runtime and does not log credentials`,()=>{
  const file=path.join(root,'.local/desktop-runtime.json'),hash=()=>createHash('sha256').update(fs.readFileSync(file)).digest('hex'),before=hash();
  const result=spawnSync(process.execPath,['scripts/desktop-launch.mjs'],{cwd:root,env:{...process.env,...changes},windowsHide:true,encoding:'utf8',timeout:15000});
  assert.ifError(result.error);assert.notEqual(result.status,0);assert.doesNotMatch(result.stdout+result.stderr,/must-not-leak|private-user|STARTED:|READY:/);assert.equal(hash(),before);
});
