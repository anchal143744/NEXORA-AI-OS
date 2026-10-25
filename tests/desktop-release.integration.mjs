import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import path from 'node:path';import {spawnSync} from 'node:child_process';import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../',import.meta.url)),runtime=path.join(root,'tests/.runtime');fs.mkdirSync(runtime,{recursive:true});
for(const scenario of ['install','rollback','catalog'])test(`release filesystem ${scenario} preserves synthetic user files without signing or executing a binary`,()=>{
  const folder=fs.mkdtempSync(path.join(runtime,'release-files-'));
  const result=spawnSync('powershell.exe',['-NoProfile','-NonInteractive','-File','tests/helpers/desktop-release-fixture.ps1','-Root',folder,'-Scenario',scenario],{cwd:root,windowsHide:true,encoding:'utf8',timeout:45000});
  assert.ifError(result.error);assert.equal(result.status,0,result.stdout+result.stderr);
  const report=JSON.parse(result.stdout.replace(/^\uFEFF/,''));assert.equal(report.passed,true);assert.equal(report.syntheticFilesOnly,true);assert.equal(report.binaryExecuted,false);assert.equal(report.profilePreserved,true);assert.equal(report.configurationPreserved,true);
});
test('all desktop installer scripts parse under Windows PowerShell, including certificate-dependent branches',()=>{
  const result=spawnSync('powershell.exe',['-NoProfile','-NonInteractive','-File','tests/helpers/desktop-parse.ps1'],{cwd:root,windowsHide:true,encoding:'utf8',timeout:15000});
  assert.ifError(result.error);assert.equal(result.status,0,result.stderr);assert.match(result.stdout,/All desktop PowerShell files parsed successfully/);
});
