import fs from 'node:fs';import path from 'node:path';import {randomBytes,randomUUID} from 'node:crypto';import {fileURLToPath} from 'node:url';
import {startDisposableUiRuntime} from './disposable-ui-runtime.mjs';
import {createDesktopControl} from '../../scripts/desktop-control.mjs';
import {stopOrphanedUiDatabase} from './disposable-cluster-stop.mjs';
const root=fileURLToPath(new URL('../../',import.meta.url)),file=path.join(root,'tests/.runtime/approved-ui-session.json');
let requested,finish;
const request=reason=>{requested??=reason;if(finish)void finish(requested);};
if(process.channel){process.once('disconnect',()=>request('parent-disconnected'));process.on('message',message=>{if(message?.type==='nexora:shutdown')request('parent-request');});}
process.once('SIGINT',()=>request('SIGINT'));process.once('SIGTERM',()=>request('SIGTERM'));
const runtime=await startDisposableUiRuntime();
const pipe='\\\\.\\pipe\\nexora-'+randomUUID(),token=randomBytes(32).toString('hex');
let control,finishing;
await new Promise((resolve,reject)=>{
  finish=(reason,error)=>{
    if(finishing)return finishing;
    finishing=(async()=>{
      let receipt;
      try{receipt=await runtime.close();}catch(closeError){error??=closeError;}
      // A dead runner cannot execute its finally block. This session previously
      // checked the server's data_directory, and rechecks the exact postmaster
      // identity before stopping only that newly created disposable cluster.
      let database;
      if(reason==='parent-disconnected')try{database=stopOrphanedUiDatabase(runtime);}catch(databaseError){error??=databaseError;}
      if(control?.listening)await new Promise(done=>control.close(done));
      if(fs.existsSync(file)){
        const current=JSON.parse(fs.readFileSync(file,'utf8'));
        if(current.token===token)fs.unlinkSync(file);
      }
      const result={reason,...receipt,...(database?{database}:{}),passed:!error};
      fs.writeFileSync(path.join(root,'tests/.runtime/ui-session-'+runtime.testDirectory+'.json'),JSON.stringify(result,null,2));
      if(process.connected)await new Promise(done=>process.send({type:'nexora:stopped',passed:!error},()=>{if(process.connected)process.disconnect();done();}));
      if(error)throw error;
    })();
    finishing.then(resolve,reject);return finishing;
  };
  runtime.failure.then(error=>{void finish('frontend-error',error);});
  if(requested){void finish(requested);return;}
  control=createDesktopControl(pipe,token,()=>{void finish('authenticated-request');});
  control.once('error',error=>{void finish('control-error',error);});control.listen(pipe,()=>{
    // Private disposable-session metadata only. Never print this file or token.
    fs.writeFileSync(file,JSON.stringify({base:runtime.base,api:runtime.api,cluster:runtime.cluster,databaseUrl:process.env.NEXORA_RETAIL_TEST_DATABASE_URL,pipe,token,testDirectory:runtime.testDirectory}),{mode:0o600});
    console.log('TEST_UI_READY:'+runtime.base);
    if(process.connected)process.send({type:'nexora:ready',base:runtime.base,api:runtime.api,testDirectory:runtime.testDirectory},()=>{});
  });
});
console.log('Disposable UI session stopped; the database runner will stop only its new test cluster.');
