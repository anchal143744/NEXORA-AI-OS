import assert from 'node:assert/strict';import test from 'node:test';import fs from 'node:fs';import path from 'node:path';import {spawnSync} from 'node:child_process';import {fileURLToPath} from 'node:url';
test('backup encryption/decryption works under the current Windows policy without execution-policy overrides',()=>{
  const root=fileURLToPath(new URL('../',import.meta.url)),runtime=path.join(root,'tests/.runtime');fs.mkdirSync(runtime,{recursive:true});const folder=fs.mkdtempSync(path.join(runtime,'dpapi-policy-'));
  const source=path.join(folder,'synthetic.txt'),encrypted=path.join(folder,'protected.bin'),restored=path.join(folder,'restored.txt');fs.writeFileSync(source,'Synthetic backup policy verification');
  for(const args of [['-SourcePath',source,'-TargetPath',encrypted],['-SourcePath',encrypted,'-TargetPath',restored,'-Decrypt']]){const result=spawnSync('powershell.exe',['-NoProfile','-NonInteractive','-File','scripts/desktop/protect-backup.ps1',...args],{cwd:root,windowsHide:true,encoding:'utf8',timeout:30000});assert.ifError(result.error);assert.equal(result.status,0,result.stderr);}
  assert.notDeepEqual(fs.readFileSync(encrypted),fs.readFileSync(source));assert.deepEqual(fs.readFileSync(restored),fs.readFileSync(source));
});
