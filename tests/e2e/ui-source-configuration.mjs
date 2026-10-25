import fs from 'node:fs';
import path from 'node:path';
import {isDeepStrictEqual} from 'node:util';

const validDirectory=value=>/^\.next-e2e-[a-f0-9]{32}$/.test(value);
export function restoreUiSourceConfiguration({configFile,declarationsFile,savedConfig,savedDeclarations,testDirectory}){
  if(!validDirectory(testDirectory))throw new Error('Invalid disposable UI directory.');
  const current=fs.readFileSync(configFile),declarations=fs.readFileSync(declarationsFile);
  const parse=bytes=>JSON.parse(bytes.toString().replace(/^\uFEFF/,''));
  const normalize=value=>({...value,include:[...(value.include??[])].filter(entry=>entry!==testDirectory+'/types/**/*.ts').sort()});
  if(!isDeepStrictEqual(normalize(parse(current)),normalize(parse(savedConfig))))throw new Error('Source TypeScript configuration changed independently; no source files were overwritten.');
  const withoutRoutes=value=>value.toString().replace(/^\/\/\/ <reference path="\.\/\.next(?:-e2e-[a-f0-9]{32})?\/types\/routes\.d\.ts" \/>\r?\n/gm,'');
  if(!declarations.equals(savedDeclarations)&&(!declarations.includes(Buffer.from(testDirectory+'/types/routes.d.ts'))||withoutRoutes(declarations)!==withoutRoutes(savedDeclarations)))throw new Error('Source Next declarations changed independently; no source files were overwritten.');
  // Validate BOTH files before either write. An independently edited declaration
  // must not cause a partially restored tsconfig.
  if(!current.equals(savedConfig))fs.writeFileSync(configFile,savedConfig);
  if(!declarations.equals(savedDeclarations))fs.writeFileSync(declarationsFile,savedDeclarations);
}

export function captureUiSourceConfiguration(root,testDirectory){
  if(!validDirectory(testDirectory))throw new Error('Invalid disposable UI directory.');
  const runtime=path.join(root,'tests/.runtime');fs.mkdirSync(runtime,{recursive:true});
  const lockFile=path.join(runtime,'ui-source.lock'),snapshotFile=path.join(runtime,'ui-source-'+testDirectory+'.json');
  // Refuse concurrent fixtures rather than race Next's shared source writes.
  let lock;
  try{lock=fs.openSync(lockFile,'wx',0o600);}catch(error){if(error.code==='EEXIST')throw new Error('Another UI fixture or interrupted source lease exists. Stop it, or run the guarded source recovery command.');throw error;}
  const configFile=path.join(root,'apps/web/tsconfig.json'),declarationsFile=path.join(root,'apps/web/next-env.d.ts');
  try{
    const savedConfig=fs.readFileSync(configFile),savedDeclarations=fs.readFileSync(declarationsFile);
    const snapshot={pid:process.pid,testDirectory,config:savedConfig.toString('base64'),declarations:savedDeclarations.toString('base64')};
    fs.writeFileSync(snapshotFile,JSON.stringify(snapshot),{flag:'wx',mode:0o600});
    fs.writeFileSync(lock,JSON.stringify({pid:process.pid,testDirectory}));fs.closeSync(lock);lock=undefined;
    let restored=false;
    return {snapshotFile,recordChild(pid){
      if(!Number.isSafeInteger(pid)||pid<1)throw new Error('Invalid UI frontend process identity.');
      const owner=JSON.parse(fs.readFileSync(lockFile,'utf8'));
      if(owner.pid!==process.pid||owner.testDirectory!==testDirectory)throw new Error('UI source lease ownership changed.');
      snapshot.childPid=pid;owner.childPid=pid;
      fs.writeFileSync(snapshotFile,JSON.stringify(snapshot));fs.writeFileSync(lockFile,JSON.stringify(owner));
    },restore(){
      if(restored)return;
      const owner=JSON.parse(fs.readFileSync(lockFile,'utf8'));
      if(owner.pid!==process.pid||owner.testDirectory!==testDirectory)throw new Error('UI source lease ownership changed; no source files were overwritten.');
      restoreUiSourceConfiguration({configFile,declarationsFile,savedConfig,savedDeclarations,testDirectory});
      fs.unlinkSync(lockFile);restored=true;
    }};
  }catch(error){if(lock!==undefined)fs.closeSync(lock);fs.unlinkSync(lockFile);throw error;}
}

export function recoverUiSourceConfiguration(root){
  const runtime=path.join(root,'tests/.runtime'),lockFile=path.join(runtime,'ui-source.lock');
  const owner=JSON.parse(fs.readFileSync(lockFile,'utf8'));
  if(!validDirectory(owner.testDirectory)||!Number.isSafeInteger(owner.pid)||owner.pid<1)throw new Error('Invalid UI source lease; refusing recovery.');
  try{process.kill(owner.pid,0);throw new Error('The UI fixture owner is still running; stop it before source recovery.');}catch(error){if(error.code!=='ESRCH')throw error;}
  const saved=JSON.parse(fs.readFileSync(path.join(runtime,'ui-source-'+owner.testDirectory+'.json'),'utf8'));
  if(saved.pid!==owner.pid||saved.testDirectory!==owner.testDirectory)throw new Error('UI source snapshot ownership mismatch.');
  if(saved.childPid!==owner.childPid)throw new Error('UI frontend snapshot ownership mismatch.');
  if(owner.childPid!==undefined){
    if(!Number.isSafeInteger(owner.childPid)||owner.childPid<1)throw new Error('Invalid UI frontend identity; refusing recovery.');
    try{process.kill(owner.childPid,0);throw new Error('The UI frontend is still running; stop its owner before source recovery.');}catch(error){if(error.code!=='ESRCH')throw error;}
  }
  restoreUiSourceConfiguration({configFile:path.join(root,'apps/web/tsconfig.json'),declarationsFile:path.join(root,'apps/web/next-env.d.ts'),savedConfig:Buffer.from(saved.config,'base64'),savedDeclarations:Buffer.from(saved.declarations,'base64'),testDirectory:owner.testDirectory});
  fs.unlinkSync(lockFile);
}
