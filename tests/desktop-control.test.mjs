import test from 'node:test';import assert from 'node:assert/strict';import {randomBytes,randomUUID} from 'node:crypto';import {once} from 'node:events';import {spawn} from 'node:child_process';import {fileURLToPath} from 'node:url';
import {createDesktopControl,requestDesktopShutdown} from '../scripts/desktop-control.mjs';
test('desktop control refuses malformed endpoints and tokens before listening',()=>{
  assert.throws(()=>createDesktopControl('http://localhost:3001','x',()=>{}),/Invalid/);
  assert.throws(()=>createDesktopControl('\\\\.\\pipe\\nexora-'+randomUUID(),'x',()=>{}),/Invalid/);
});
test('desktop named pipe denies wrong tokens and accepts the exact authenticated shutdown request',async()=>{
  const pipe='\\\\.\\pipe\\nexora-'+randomUUID(),token=randomBytes(32).toString('hex');let calls=0;let finished;const done=new Promise(resolve=>{finished=resolve;});
  const server=createDesktopControl(pipe,token,()=>{calls++;finished();});
  await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(pipe,resolve);});
  try{await assert.rejects(requestDesktopShutdown(pipe,'0'.repeat(64)),/rejected/);assert.equal(calls,0);await requestDesktopShutdown(pipe,token);await done;assert.equal(calls,1);}finally{await new Promise(resolve=>server.close(resolve));}
});
test('desktop Next preload invokes registered graceful cleanup and ignores unrelated IPC messages',async()=>{
  const preload=fileURLToPath(new URL('../scripts/desktop-child-control.cjs',import.meta.url));
  const child=spawn(process.execPath,['--require',preload,'-e',"process.on('SIGTERM',()=>{process.send({closed:true},()=>process.exit(0));});process.send({ready:true});"],{windowsHide:true,stdio:['ignore','ignore','ignore','ipc']});
  await once(child,'message');child.send({type:'unrelated'});assert.equal(child.exitCode,null);
  const message=once(child,'message'),exited=once(child,'exit');child.send({type:'nexora:shutdown'});assert.deepEqual((await message)[0],{closed:true});assert.equal((await exited)[0],0);
});

test('desktop child shuts down once when its supervisor disconnects',async()=>{
  const preload=fileURLToPath(new URL('../scripts/desktop-child-control.cjs',import.meta.url));
  const child=spawn(process.execPath,['--require',preload,'-e',"let calls=0;process.on('SIGTERM',()=>{calls++;setTimeout(()=>process.exit(calls===1?0:2),25);});process.send({ready:true});"],{windowsHide:true,stdio:['ignore','ignore','ignore','ipc']});
  await once(child,'message');const exited=once(child,'exit');
  child.send({type:'nexora:shutdown'},()=>child.disconnect());
  assert.equal((await exited)[0],0);
});

test('desktop child also cleans up after an unexpected parent-channel loss',async()=>{
  const preload=fileURLToPath(new URL('../scripts/desktop-child-control.cjs',import.meta.url));
  const child=spawn(process.execPath,['--require',preload,'-e',"process.on('SIGTERM',()=>process.exit(0));process.send({ready:true});"],{windowsHide:true,stdio:['ignore','ignore','ignore','ipc']});
  await once(child,'message');const exited=once(child,'exit');child.disconnect();
  assert.equal((await exited)[0],0);
});
