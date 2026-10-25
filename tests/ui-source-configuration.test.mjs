import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import os from 'node:os';import path from 'node:path';
import {restoreUiSourceConfiguration,captureUiSourceConfiguration,recoverUiSourceConfiguration} from './e2e/ui-source-configuration.mjs';
import {assertDisposableCluster} from './e2e/disposable-cluster-stop.mjs';
const directory='.next-e2e-'+'a'.repeat(32);
function fixture(t){
  const root=fs.mkdtempSync(path.join(os.tmpdir(),'nexora-source-test-'));fs.mkdirSync(path.join(root,'apps/web'),{recursive:true});
  t.after(()=>fs.rmSync(root,{recursive:true,force:true}));
  const configFile=path.join(root,'apps/web/tsconfig.json'),declarationsFile=path.join(root,'apps/web/next-env.d.ts');
  const savedConfig=Buffer.from('{"compilerOptions":{"strict":true},"include":["src/**/*.ts"]}\r\n');
  const savedDeclarations=Buffer.from('/// <reference path="./.next/types/routes.d.ts" />\r\n');
  fs.writeFileSync(configFile,savedConfig);fs.writeFileSync(declarationsFile,savedDeclarations);
  const generated=()=>{fs.writeFileSync(configFile,JSON.stringify({compilerOptions:{strict:true},include:['src/**/*.ts',directory+'/types/**/*.ts']},null,2));fs.writeFileSync(declarationsFile,savedDeclarations.toString().replace('.next/',directory+'/'));};
  return {root,configFile,declarationsFile,savedConfig,savedDeclarations,testDirectory:directory,generated};
}
test('UI source restoration removes only its generated changes and restores exact original bytes',t=>{
  const f=fixture(t);f.generated();restoreUiSourceConfiguration(f);assert.deepEqual(fs.readFileSync(f.configFile),f.savedConfig);assert.deepEqual(fs.readFileSync(f.declarationsFile),f.savedDeclarations);
});
test('UI source recovery validates both files before writing either file',t=>{
  const f=fixture(t);f.generated();fs.appendFileSync(f.declarationsFile,'// Independent user edit\n');const before=fs.readFileSync(f.configFile);
  assert.throws(()=>restoreUiSourceConfiguration(f),/independently/);assert.deepEqual(fs.readFileSync(f.configFile),before);assert.match(fs.readFileSync(f.declarationsFile,'utf8'),/Independent user edit/);
});
test('UI source restoration refuses independent TypeScript settings changes',t=>{
  const f=fixture(t);f.generated();const config=JSON.parse(fs.readFileSync(f.configFile));config.compilerOptions.strict=false;fs.writeFileSync(f.configFile,JSON.stringify(config));
  assert.throws(()=>restoreUiSourceConfiguration(f),/independently/);assert.equal(JSON.parse(fs.readFileSync(f.configFile)).compilerOptions.strict,false);
});
test('UI source lease refuses concurrent fixtures and restores idempotently',t=>{
  const f=fixture(t),lease=captureUiSourceConfiguration(f.root,directory);assert.throws(()=>captureUiSourceConfiguration(f.root,'.next-e2e-'+'b'.repeat(32)),/Another UI fixture/);
  assert.throws(()=>recoverUiSourceConfiguration(f.root),/still running/);f.generated();lease.restore();lease.restore();assert.deepEqual(fs.readFileSync(f.configFile),f.savedConfig);assert.ok(fs.existsSync(lease.snapshotFile));assert.ok(!fs.existsSync(path.join(f.root,'tests/.runtime/ui-source.lock')));
});
test('durable snapshot recovers a stopped fixture without touching independent files',t=>{
  const f=fixture(t),lease=captureUiSourceConfiguration(f.root,directory);f.generated();
  // Obtain an actually exited process ID rather than assuming an arbitrary PID is free.
  return import('node:child_process').then(({spawnSync})=>{const result=spawnSync(process.execPath,['-e','process.stdout.write(String(process.pid))'],{encoding:'utf8',windowsHide:true});assert.equal(result.status,0);const pid=Number(result.stdout);
    lease.recordChild(process.pid);
    const snapshot=JSON.parse(fs.readFileSync(lease.snapshotFile));snapshot.pid=pid;fs.writeFileSync(lease.snapshotFile,JSON.stringify(snapshot));fs.writeFileSync(path.join(f.root,'tests/.runtime/ui-source.lock'),JSON.stringify({pid,testDirectory:directory}));
    assert.throws(()=>recoverUiSourceConfiguration(f.root),/frontend snapshot ownership mismatch/);
    fs.writeFileSync(path.join(f.root,'tests/.runtime/ui-source.lock'),JSON.stringify({pid,testDirectory:directory,childPid:process.pid}));
    assert.throws(()=>recoverUiSourceConfiguration(f.root),/frontend is still running/);
    delete snapshot.childPid;fs.writeFileSync(lease.snapshotFile,JSON.stringify(snapshot));fs.writeFileSync(path.join(f.root,'tests/.runtime/ui-source.lock'),JSON.stringify({pid,testDirectory:directory}));
    recoverUiSourceConfiguration(f.root);assert.deepEqual(fs.readFileSync(f.configFile),f.savedConfig);assert.deepEqual(fs.readFileSync(f.declarationsFile),f.savedDeclarations);
  });
});
test('orphan shutdown refuses real workspace, traversal and nested cluster paths',()=>{
  for(const target of ['.local/postgres','tests/.runtime/cluster-safe/nested','tests/.runtime/cluster-safe/../../.local/postgres'])assert.throws(()=>assertDisposableCluster(target),/non-disposable/);
  assert.equal(path.basename(assertDisposableCluster(path.resolve('tests/.runtime/cluster-AbC123'))),'cluster-AbC123');
});
