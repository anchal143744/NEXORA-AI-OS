import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import path from 'node:path';import {spawn} from 'node:child_process';import {once} from 'node:events';import {fileURLToPath} from 'node:url';
import {requestDesktopShutdown} from '../../scripts/desktop-control.mjs';
const root=fileURLToPath(new URL('../../',import.meta.url)),runtime=path.join(root,'tests/.runtime');
async function start(t){
  assert.ok(process.env.NEXORA_RETAIL_TEST_DATABASE_URL,'Use the designated disposable runner.');
  const files=['apps/web/tsconfig.json','apps/web/next-env.d.ts'],before=files.map(file=>fs.readFileSync(path.join(root,file)));
  const child=spawn(process.execPath,['tests/e2e/approved-ui-session.mjs'],{cwd:root,env:process.env,windowsHide:true,stdio:['ignore','ignore','ignore','ipc']});
  const exited=once(child,'exit');let timer;
  t.after(async()=>{if(child.connected)child.send({type:'nexora:shutdown'});if(child.exitCode===null&&child.signalCode===null)await exited;});
  let ready;
  try{ready=await Promise.race([new Promise((resolve,reject)=>{child.on('message',message=>{if(message.type==='nexora:ready')resolve(message);});child.once('error',reject);child.once('exit',code=>reject(new Error('UI fixture exited before readiness: '+code)));}),new Promise((_,reject)=>{timer=setTimeout(()=>reject(new Error('UI fixture startup timed out.')),130000);})]);}finally{clearTimeout(timer);}
  const lease=JSON.parse(fs.readFileSync(path.join(runtime,'ui-source.lock'))),snapshot=JSON.parse(fs.readFileSync(path.join(runtime,'ui-source-'+ready.testDirectory+'.json')));
  assert.equal(lease.pid,child.pid);assert.ok(Number.isSafeInteger(lease.childPid));assert.notEqual(lease.childPid,child.pid);assert.equal(snapshot.childPid,lease.childPid);
  for(const [url,status]of [[ready.base+'/login',200],[ready.base+'/api/v1/health/live',200],[ready.base+'/api/v1/retail/shop/settings',401]]){
    const response=await fetch(url,{signal:AbortSignal.timeout(60000)});await response.body?.cancel();assert.equal(response.status,status);
  }
  return {child,exited,ready,async verify(reason){
    assert.equal((await exited)[0],0);
    const receipt=JSON.parse(fs.readFileSync(path.join(runtime,'ui-session-'+ready.testDirectory+'.json')));
    assert.equal(receipt.passed,true);assert.equal(receipt.reason,reason);assert.equal(receipt.webExit.forced,false);assert.equal(receipt.webExit.code,0);assert.equal(receipt.apiClosed,true);assert.equal(receipt.sourceRestored,true);
    for(let i=0;i<files.length;i++)assert.deepEqual(fs.readFileSync(path.join(root,files[i])),before[i],files[i]);
    for(const url of [ready.base+'/login',ready.api+'/api/v1/health/live'])await assert.rejects(fetch(url,{signal:AbortSignal.timeout(2000)}));
    assert.equal(fs.existsSync(path.join(runtime,'ui-source.lock')),false);
    assert.equal(fs.existsSync(path.join(runtime,'approved-ui-session.json')),false);
    return receipt;
  }};
}
test('actual isolated frontend/API closes gracefully through authenticated control and restores source bytes',{timeout:180000},async t=>{
  const session=await start(t),descriptor=JSON.parse(fs.readFileSync(path.join(runtime,'approved-ui-session.json')));
  await assert.rejects(requestDesktopShutdown(descriptor.pipe,'0'.repeat(64)),/rejected/);
  await requestDesktopShutdown(descriptor.pipe,descriptor.token);await session.verify('authenticated-request');
  assert.ok(fs.existsSync(path.join(process.env.NEXORA_TEST_CLUSTER_PATH,'postmaster.pid')),'Normal UI close leaves database ownership with runner.');
});
test('lost parent IPC closes actual frontend/API, restores source bytes and gracefully stops only its disposable database',{timeout:180000},async t=>{
  const session=await start(t);session.child.disconnect();const receipt=await session.verify('parent-disconnected');
  assert.equal(receipt.database.stopped,true);assert.equal(receipt.database.alreadyStopped,false);assert.equal(fs.existsSync(path.join(process.env.NEXORA_TEST_CLUSTER_PATH,'postmaster.pid')),false);
});
