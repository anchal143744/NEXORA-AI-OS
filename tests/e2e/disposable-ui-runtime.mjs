import assert from 'node:assert/strict';import fs from 'node:fs';import path from 'node:path';import net from 'node:net';
import {fileURLToPath} from 'node:url';import {spawn} from 'node:child_process';import {once} from 'node:events';import {randomBytes,randomUUID} from 'node:crypto';import {createRequire} from 'node:module';
import {captureUiSourceConfiguration} from './ui-source-configuration.mjs';
const require=createRequire(import.meta.url),root=fileURLToPath(new URL('../../',import.meta.url));
async function freePort(){return new Promise((resolve,reject)=>{const server=net.createServer();server.on('error',reject);server.listen(0,'127.0.0.1',()=>{const port=server.address().port;server.close(()=>resolve(port));});});}
export async function startDisposableUiRuntime(){
  const value=process.env.NEXORA_RETAIL_TEST_DATABASE_URL;
  if(!value||!process.env.NEXORA_TEST_CLUSTER_PATH)throw new Error('Run the designated disposable database runner. No existing application/database is a fallback.');
  const url=new URL(value);
  if(url.hostname!=='127.0.0.1'||!/^\/nexora_retail_test_[a-z0-9]+$/.test(url.pathname))throw new Error('Refusing a non-disposable database.');
  const cluster=path.resolve(process.env.NEXORA_TEST_CLUSTER_PATH),runtimeRoot=path.join(root,'tests/.runtime');
  if(!cluster.toLowerCase().startsWith(runtimeRoot.toLowerCase()+path.sep)||!path.basename(cluster).startsWith('cluster-'))throw new Error('Test cluster must be created inside tests/.runtime.');
  const port=await freePort(),base=`http://127.0.0.1:${port}`,testDirectory='.next-e2e-'+randomUUID().replaceAll('-','');
  Object.assign(process.env,{DATABASE_URL:value,NODE_ENV:'test',NEXORA_IGNORE_ENV_FILE:'true',REDIS_DISABLED:'true',JWT_SECRET:randomBytes(48).toString('hex'),CORS_ORIGINS:base,APP_ORIGIN:base});
  process.env.EMAIL_DELIVERY_ENABLED='false';
  for(const key of Object.keys(process.env))if(/^(OPENAI_|ANTHROPIC_|TWILIO_|WHATSAPP_|RESEND_|SENDGRID_|SMTP_)/.test(key))delete process.env[key];
  require('reflect-metadata');
  const {NestFactory}=require('@nestjs/core'),{ValidationPipe,VersioningType}=require('@nestjs/common');
  const {AppModule}=require('../../apps/api/dist/app.module.js');
  const {PrismaService}=require('../../apps/api/dist/infrastructure/database/prisma.service.js');
  const {GlobalExceptionFilter}=require('../../apps/api/dist/common/filters/global-exception.filter.js');
  const {ApiResponseInterceptor}=require('../../apps/api/dist/common/interceptors/api-response.interceptor.js');
  const source=captureUiSourceConfiguration(root,testDirectory);
  let app,web,logFile,closing,webExit;
  let fail;const failure=new Promise(resolve=>{fail=resolve;});
  const alive=()=>web&&Number.isSafeInteger(web.pid)&&web.exitCode===null&&web.signalCode===null;
  function close(){
    if(closing)return closing;
    closing=(async()=>{
      const errors=[];let forced=false;
      try{
        if(alive()){
          // Register before requesting shutdown: a fast exit cannot be missed.
          const exited=once(web,'exit');let timer;
          try{
            if(web.connected)web.send({type:'nexora:shutdown'},error=>{if(error&&web.connected)web.disconnect();});
            else web.kill();
            await Promise.race([exited,new Promise((_,reject)=>{timer=setTimeout(()=>reject(new Error('Isolated UI server did not stop gracefully.')),20000);})]);
          }finally{clearTimeout(timer);}
        }
      }catch(error){errors.push(error);}
      if(alive()){
        forced=true;const exited=once(web,'exit');web.kill();let timer;
        try{await Promise.race([exited,new Promise((_,reject)=>{timer=setTimeout(()=>reject(new Error('Isolated child remains running; source lease retained.')),5000);})]);}catch(error){errors.push(error);}finally{clearTimeout(timer);}
      }
      if(logFile!==undefined){fs.closeSync(logFile);logFile=undefined;}
      try{await app?.close();}catch(error){errors.push(error);}
      if(!alive()){try{source.restore();}catch(error){errors.push(error);}}
      if(errors.length)throw new AggregateError(errors,'Disposable UI cleanup failed; retain evidence and inspect the source lease.');
      return {webExit:{...webExit,forced},apiClosed:true,sourceRestored:true};
    })();
    return closing;
  }
  try{
    app=await NestFactory.create(AppModule,{logger:false,abortOnError:false});
    app.use(require('cookie-parser')());app.setGlobalPrefix('api');app.enableVersioning({type:VersioningType.URI,defaultVersion:'1'});
    app.useGlobalPipes(new ValidationPipe({whitelist:true,forbidNonWhitelisted:true,transform:true}));app.useGlobalFilters(new GlobalExceptionFilter());app.useGlobalInterceptors(new ApiResponseInterceptor());
    await app.listen(0,'127.0.0.1');const db=app.get(PrismaService).database;
    const [location]=await db.$queryRaw`SELECT current_setting('data_directory') AS directory`;
    assert.equal(path.resolve(location.directory).toLowerCase(),cluster.toLowerCase());
    const api=await app.getUrl();
    fs.mkdirSync(runtimeRoot,{recursive:true});
    logFile=fs.openSync(path.join(runtimeRoot,'ui-next-'+testDirectory.slice(10)+'.log'),'w');
    const nextRequire=createRequire(path.join(root,'apps/web/package.json'));
    web=spawn(process.execPath,['--require',path.join(root,'scripts/desktop-child-control.cjs'),nextRequire.resolve('next/dist/bin/next'),'dev','--port',String(port),'--hostname','127.0.0.1'],{cwd:path.join(root,'apps/web'),env:{...process.env,NODE_ENV:'development',PORT:String(port),NEXORA_API_INTERNAL_URL:api,NEXT_PRIVATE_API_URL:api,NEXT_PUBLIC_API_URL:'/api',NEXORA_E2E_WEB_DIST_DIR:testDirectory},stdio:['ignore',logFile,logFile,'ipc'],windowsHide:true});
    web.on('exit',(code,signal)=>{webExit={code,signal};if(!closing)fail(new Error('Disposable UI frontend exited unexpectedly.'));});
    web.on('error',()=>{if(!closing)fail(new Error('Disposable UI frontend process failed.'));});
    await once(web,'spawn');source.recordChild(web.pid);let ready=false;const deadline=Date.now()+120000;
    while(Date.now()<deadline){if(!alive())throw new Error('Isolated frontend exited; inspect its unique tests/.runtime/ui-next log.');try{const response=await fetch(base+'/api/v1/health/live',{signal:AbortSignal.timeout(2000)});await response.body?.cancel();if(response.status===200){ready=true;break;}}catch{}await new Promise(resolve=>setTimeout(resolve,500));}
    if(!ready)throw new Error('Isolated frontend did not reach the disposable API.');
    return {app,db,base,api,cluster,close,failure,testDirectory,postmasterIdentity:fs.readFileSync(path.join(cluster,'postmaster.pid'),'utf8')};
  }catch(error){try{await close();}catch(cleanupError){throw new AggregateError([error,cleanupError],'Disposable UI startup and cleanup failed.');}throw error;}
}
