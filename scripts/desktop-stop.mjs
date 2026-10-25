import fs from 'node:fs';import path from 'node:path';import {spawnSync} from 'node:child_process';
import {repoRoot as root} from './local-development-env.mjs';import {requestDesktopShutdown} from './desktop-control.mjs';
const pause=ms=>new Promise(resolve=>setTimeout(resolve,ms));
const alive=pid=>{try{process.kill(pid,0);return true;}catch{return false;}};
try{
  const statePath=path.join(root,'.local/desktop-runtime.json');
  if(!fs.existsSync(statePath)){console.log('NEXORA is not running.');process.exit(0);}
  const state=JSON.parse(fs.readFileSync(statePath,'utf8'));
  if(state.root!==path.resolve(root)||!Number.isSafeInteger(state.pid)||state.pid<1)throw new Error('Refusing invalid NEXORA runtime ownership metadata');
  if(!alive(state.pid)){console.log('NEXORA is already stopped.');process.exit(0);}
  const script=path.join(path.resolve(root),'scripts/dev-start.mjs').replaceAll("'","''");
  const query=`$p=Get-CimInstance Win32_Process -Filter 'ProcessId = ${state.pid}';if($p.CommandLine -and $p.CommandLine.Contains('${script}') -and $p.CommandLine.Contains('--desktop')){Write-Output 'owned'}`;
  const owner=spawnSync('powershell.exe',['-NoProfile','-NonInteractive','-Command',query],{encoding:'utf8',windowsHide:true,timeout:10000});
  if(owner.status!==0||owner.stdout.trim()!=='owned')throw new Error('Refusing to stop an unverified process');
  if(!/^\\\\\.\\pipe\\nexora-[a-f0-9-]{36}$/.test(state.controlPipe??'')||!/^[a-f0-9]{64}$/.test(state.controlToken??''))throw new Error('This older runtime has no graceful control channel. No forced termination was performed.');
  await requestDesktopShutdown(state.controlPipe,state.controlToken);
  const deadline=Date.now()+35000;while(alive(state.pid)&&Date.now()<deadline)await pause(250);
  if(alive(state.pid))throw new Error('NEXORA has not finished stopping. No unrelated process was terminated.');
  const receipt=JSON.parse(fs.readFileSync(path.join(root,'.local/desktop-shutdown.json'),'utf8'));
  if(receipt.pid!==state.pid||!receipt.graceful||receipt.exitCode!==0)throw new Error('NEXORA stopped with an error or forced fallback; inspect its shutdown receipt.');
  console.log('NEXORA API and web services stopped gracefully. PostgreSQL and saved data were preserved.');
}catch(error){console.error(error.message);process.exitCode=1;}
