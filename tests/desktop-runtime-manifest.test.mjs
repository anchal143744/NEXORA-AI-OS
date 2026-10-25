import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import os from 'node:os';import path from 'node:path';
import {runtimeManifest} from '../scripts/desktop/runtime-manifest.mjs';
test('runtime integrity includes nested dependencies and detects changes while excluding environment, user data and generated Next cache',()=>{
  const root=fs.mkdtempSync(path.join(os.tmpdir(),'nexora-manifest-'));
  const files={'.env':'PRIVATE_CONNECTION_VALUE','.local/postgres/user.data':'PRIVATE_RECORD','scripts/start.mjs':'compiled startup','node_modules/pkg/node_modules/nested/index.js':'nested implementation','apps/api/dist/main.js':'api implementation','apps/web/.next/server/page.js':'page implementation','apps/web/.next/cache/transient':'generated cache'};
  for(const [file,value]of Object.entries(files)){fs.mkdirSync(path.dirname(path.join(root,file)),{recursive:true});fs.writeFileSync(path.join(root,file),value);}
  const before=runtimeManifest(root);
  assert.match(before,/node_modules\/pkg\/node_modules\/nested\/index.js/);
  assert.doesNotMatch(before,/PRIVATE|\.env|postgres|transient/);
  fs.writeFileSync(path.join(root,'apps/web/.next/cache/transient'),'changed cache');assert.equal(runtimeManifest(root),before);
  fs.writeFileSync(path.join(root,'node_modules/pkg/node_modules/nested/index.js'),'modified dependency');assert.notEqual(runtimeManifest(root),before);
});
