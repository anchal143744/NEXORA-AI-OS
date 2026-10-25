import {createLocalBackup} from './desktop-backup.mjs';
import {startOwnedDevPostgres} from './start-owned-dev-postgres.mjs';
import fs from 'node:fs';
import path from 'node:path';
import {randomBytes,randomUUID} from 'node:crypto';
import {once} from 'node:events';
import {desktopAddresses,desktopRuntimeEnvironment} from './desktop-config.mjs';
import {spawn,spawnSync} from 'node:child_process';
import {repoRoot as rootLocation,loadLocalDevelopmentEnv,localDatabaseAddress,checkLocalDatabase,redactLocalSecrets} from './local-development-env.mjs';
const repoRoot=path.resolve(rootLocation);
const env=desktopRuntimeEnvironment(loadLocalDevelopmentEnv());
const directory=path.join(repoRoot,'.local');fs.mkdirSync(directory,{recursive:true});
const statePath=path.join(directory,'desktop-runtime.json');
const lockPath=path.join(directory,'desktop-launch.lock');
const logPath=path.join(directory,'desktop-server.log');
const runtimeScript=path.join(repoRoot,'scripts/dev-start.mjs');
const pause=ms=>new Promise(resolve=>setTimeout(resolve,ms));
const alive=pid=>{if(!Number.isSafeInteger(pid)||pid<1)return false;try{process.kill(pid,0);return true;}catch{return false;}};
function read(file){try{return JSON.parse(fs.readFileSync(file,'utf8'));}catch{return null;}}
function owned(state){
  if(state?.root!==repoRoot||!alive(state.pid))return false;
  if(process.platform!=='win32')return false;
  const literal=runtimeScript.replaceAll("'","''");
  const script=`$p=Get-CimInstance Win32_Process -Filter 'ProcessId = ${state.pid}';if($p.CommandLine -and $p.CommandLine.Contains('${literal}') -and $p.CommandLine.Contains('--desktop')){Write-Output 'owned'}`;
  const result=spawnSync('powershell.exe',['-NoProfile','-NonInteractive','-Command',script],{encoding:'utf8',windowsHide:true,timeout:10000});
  return result.status===0&&result.stdout.trim()==='owned';
}
async function healthy(url){try{const result=await fetch(url,{signal:AbortSignal.timeout(1500)});await result.body?.cancel();return result.status===200;}catch{return false;}}
async function ready(state,front,api){
  const deadline=Date.now()+120000;
  while(Date.now()<deadline){
    if(!alive(state.pid))throw new Error('NEXORA services stopped during startup. See .local/desktop-server.log.');
    const apiReady=await healthy(api+'/api/v1/health/live');
    const frontReady=apiReady && await healthy(front+'/api/v1/health/live');
    if(apiReady && frontReady&&fs.existsSync(logPath)&&fs.readFileSync(logPath,'utf8').includes('ok Application Ready'))return;
    await pause(1000);
  }
  throw new Error('NEXORA startup timed out. See .local/desktop-server.log. No data was reset.');
}
async function main(){
  if(process.platform!=='win32')throw new Error('This desktop launcher requires Windows.');
  localDatabaseAddress(env); // Reject missing/remote/production configuration before spawning.
  const {front,api}=desktopAddresses(env);
  try { await checkLocalDatabase(env); } catch(error) { if(!await startOwnedDevPostgres(env))throw error; await checkLocalDatabase(env); }
  try { const backup=await createLocalBackup(env); console.log('BACKUP:'+ (backup.reused ? 'Existing daily encrypted backup' : 'Daily encrypted backup created')); } catch(error) { console.log('WARNING:Local backup was not completed: '+redactLocalSecrets(error.message,env)); }
  const existing=read(statePath);
  if(owned(existing)){await ready(existing,front,api);console.log('REUSED:'+existing.pid);console.log('READY:'+front+'/login');return;}
  let lock;
  try{lock=fs.openSync(lockPath,'wx');fs.writeFileSync(lockPath,JSON.stringify({pid:process.pid}));}
  catch(error){
    if(error.code!=='EEXIST')throw error;
    const previous=read(lockPath);
    if(previous&&alive(previous.pid)){
      for(let i=0;i<120;i++){const state=read(statePath);if(owned(state)){await ready(state,front,api);console.log('REUSED:'+state.pid);console.log('READY:'+front+'/login');return;}await pause(1000);}
      throw new Error('Another NEXORA launch is still in progress.');
    }
    fs.unlinkSync(lockPath);return main();
  }
  try{
    for(const file of ['apps/api/dist/main.js','apps/web/.next/BUILD_ID'])if(!fs.existsSync(path.join(repoRoot,file)))throw new Error('NEXORA desktop build is missing. Run npm run desktop:prepare once.');
    const controlPipe='\\\\.\\pipe\\nexora-'+randomUUID(),controlToken=randomBytes(32).toString('hex');
    const fd=fs.openSync(logPath,'w');let child;
    try{child=spawn(process.execPath,[runtimeScript,'--desktop'],{cwd:repoRoot,env:{...env,NEXORA_DESKTOP_CONTROL_PIPE:controlPipe,NEXORA_DESKTOP_CONTROL_TOKEN:controlToken},detached:true,windowsHide:true,stdio:['ignore',fd,fd]});await once(child,'spawn');}finally{fs.closeSync(fd);}
    const state={root:repoRoot,pid:child.pid,startedAt:new Date().toISOString(),front,controlPipe,controlToken};
    fs.writeFileSync(statePath,JSON.stringify(state,null,2));child.unref();
    console.log('STARTING:Starting your local NEXORA services…');
    await ready(state,front,api);
    console.log('STARTED:'+state.pid);console.log('READY:'+front+'/login');
  }finally{fs.closeSync(lock);if(read(lockPath)?.pid===process.pid)fs.unlinkSync(lockPath);}
}
main().catch(error=>{console.error(redactLocalSecrets(error.message,env));process.exitCode=1;});
