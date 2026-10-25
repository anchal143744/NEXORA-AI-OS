import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import path from 'node:path';import {spawnSync} from 'node:child_process';import {fileURLToPath} from 'node:url';import {createHash} from 'node:crypto';
import {loadLocalDevelopmentEnv} from '../scripts/local-development-env.mjs';import {desktopAddresses} from '../scripts/desktop-config.mjs';
const root=fileURLToPath(new URL('../',import.meta.url)),statePath=path.join(root,'.local/desktop-runtime.json');
const state=()=>JSON.parse(fs.readFileSync(statePath,'utf8'));
function run(script,extra=[]){const result=spawnSync(process.execPath,[script,...extra],{cwd:root,encoding:'utf8',windowsHide:true,timeout:180000,env:process.env});assert.ifError(result.error);assert.equal(result.status,0,result.stdout+result.stderr);return result.stdout;}
const hash=file=>createHash('sha256').update(fs.readFileSync(path.join(root,file))).digest('hex');
test('owned desktop service lifecycle starts, reuses, stops gracefully and preserves existing database/configuration', {timeout:300000},async()=>{
  const env=loadLocalDevelopmentEnv(),{front,api}=desktopAddresses(env);
  const paths=['.env','.local/desktop/NEXORA.exe','.local/desktop/launcher.conf'];const before=paths.map(hash);
  assert.match(run('scripts/desktop-launch.mjs'),/READY:/);const first=state();assert.ok(first.controlPipe);assert.ok(first.controlToken);
  for(const [url,expected]of [[api+'/api/v1/health/live',200],[front+'/login',200],[front+'/signup',200],[front+'/api/v1/retail/shop/settings',401]]){const response=await fetch(url,{signal:AbortSignal.timeout(5000)});await response.body?.cancel();assert.equal(response.status,expected,new URL(url).pathname);}
  assert.match(run('scripts/desktop-launch.mjs'),/REUSED:/);assert.equal(state().pid,first.pid);
  assert.match(run('scripts/desktop-stop.mjs'),/stopped gracefully/);
  const receipt=JSON.parse(fs.readFileSync(path.join(root,'.local/desktop-shutdown.json'),'utf8'));assert.equal(receipt.pid,first.pid);assert.equal(receipt.graceful,true);assert.equal(receipt.outcomes.length,2);assert.ok(receipt.outcomes.every(item=>item.code===0&&!item.forced));
  for(const url of [api+'/api/v1/health/live',front+'/login'])await assert.rejects(fetch(url,{signal:AbortSignal.timeout(1500)}));
  assert.match(run('scripts/check-local-database.mjs'),/Authenticated read-only database query passed/);
  assert.match(run('scripts/desktop-data-fingerprint.mjs'),/hashes unchanged across all/);
  assert.deepEqual(paths.map(hash),before);
  // Leave the verified local application available, without opening a browser.
  assert.match(run('scripts/desktop-launch.mjs'),/READY:/);
});
