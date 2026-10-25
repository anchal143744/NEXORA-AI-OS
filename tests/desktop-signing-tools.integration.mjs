import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import path from 'node:path';import {spawnSync} from 'node:child_process';import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../',import.meta.url)),literal=value=>"'"+value.replaceAll("'","''")+"'";
function ps(code){const result=spawnSync('powershell.exe',['-NoProfile','-NonInteractive','-Command',"$ErrorActionPreference='Stop'; . ./scripts/desktop/publisher-signing.ps1; "+code],{cwd:root,env:process.env,windowsHide:true,encoding:'utf8',timeout:60000});assert.ifError(result.error);return result;}
test('pinned Microsoft SignTool resolves and actually verifies the trusted Node signature without executing Node',{timeout:70000},()=>{
  const result=ps("$tool=Resolve-NexoraSignTool; & $tool verify /pa /all /v "+literal(process.execPath)+" | Out-Null; if($LASTEXITCODE -ne 0){throw 'SignTool rejected trusted Node signature.'}; Write-Output 'VERIFIED_SIGNTOOL_NODE_SIGNATURE'");
  assert.equal(result.status,0,result.stdout+result.stderr);assert.match(result.stdout,/VERIFIED_SIGNTOOL_NODE_SIGNATURE/);
});
test('actual Microsoft SignTool rejects the unsigned legacy NEXORA executable without opening it',{timeout:70000},()=>{
  const executable=path.join(root,'.local/desktop/NEXORA.exe');assert.ok(fs.existsSync(executable));
  const result=ps("$tool=Resolve-NexoraSignTool; $savedPreference=$ErrorActionPreference; try{$ErrorActionPreference='Continue'; & $tool verify /pa /all /v "+literal(executable)+" 2>&1 | Out-Null; $verifyCode=$LASTEXITCODE}finally{$ErrorActionPreference=$savedPreference}; if($verifyCode -eq 0){throw 'Unsigned application unexpectedly accepted.'}; if((Get-AuthenticodeSignature -LiteralPath "+literal(executable)+").Status -ne 'NotSigned'){throw 'Unexpected application signature state.'}; Write-Output 'UNSIGNED_REJECTED_WITHOUT_EXECUTION'");
  assert.equal(result.status,0,result.stdout+result.stderr);assert.match(result.stdout,/UNSIGNED_REJECTED_WITHOUT_EXECUTION/);
});
test('signing tool validation rejects a modified adjacent library before executing any tool',{timeout:70000},()=>{
  const runtime=path.join(root,'tests/.runtime');fs.mkdirSync(runtime,{recursive:true});const directory=fs.mkdtempSync(path.join(runtime,'signing-integrity-'));
  const original=path.join(root,'.local/tools/windows-sdk/10.0.28000.2705/x64'),destination=path.join(directory,'x64');fs.mkdirSync(destination);
  const names=['signtool.exe','mssign32.dll','wintrust.dll','msisip.dll','appxsip.dll','appxpackaging.dll','opcservices.dll'];
  try{
    for(const name of names)fs.copyFileSync(path.join(original,name),path.join(destination,name));
    fs.appendFileSync(path.join(destination,'mssign32.dll'),Buffer.from('tamper-fixture'));
    const result=ps("$bundle=Get-NexoraSigningToolsBundle; $bundle.Folder="+literal(directory)+"; $bundle.Tool="+literal(path.join(destination,'signtool.exe'))+"; try{Assert-NexoraSigningToolsBundle $bundle;throw 'Tampering was accepted.'}catch{if($_.Exception.Message -notmatch 'differs from the pinned archive'){throw};Write-Output 'TAMPER_REJECTED_WITHOUT_EXECUTION'}");
    assert.equal(result.status,0,result.stdout+result.stderr);assert.match(result.stdout,/TAMPER_REJECTED_WITHOUT_EXECUTION/);
  }finally{assert.equal(path.dirname(directory),runtime);fs.rmSync(directory,{recursive:true,force:true});}
});
