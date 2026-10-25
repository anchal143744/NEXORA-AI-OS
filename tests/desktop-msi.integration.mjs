import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import path from 'node:path';import {spawnSync} from 'node:child_process';import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../',import.meta.url));
function ps(args,timeout=300000){const result=spawnSync('powershell.exe',['-NoProfile','-NonInteractive',...args],{cwd:root,encoding:'utf8',windowsHide:true,timeout});assert.ifError(result.error);return result;}
test('embedded host compiles and MSI cabinet, shortcuts and preservation boundaries validate without installation or unsigned execution',{timeout:300000},()=>{
  const result=ps(['-File','scripts/desktop/build-windows-release.ps1','-DevelopmentBuild']);assert.equal(result.status,0,result.stdout+result.stderr);
  const match=result.stdout.match(/NEXORA_DESKTOP_PACKAGE:(.+\.msi)/);assert.ok(match,result.stdout);
  const packagePath=match[1].trim(),folder=path.dirname(packagePath),payload=path.join(folder,'payload');
  const report=JSON.parse(fs.readFileSync(path.join(folder,'artifacts.json'),'utf8').replace(/^\uFEFF/,''));
  assert.equal(report.signed,false);assert.equal(report.installed,false);assert.equal(report.engineBundled,false);
  const inspected=ps(['-File','tests/helpers/desktop-msi-inspect.ps1','-Package',packagePath,'-Payload',payload]);assert.equal(inspected.status,0,inspected.stdout+inspected.stderr);
  const verified=JSON.parse(inspected.stdout.replace(/^\uFEFF/,''));assert.equal(verified.passed,true);assert.equal(verified.cabinetHashesVerified,true);assert.equal(verified.installed,false);assert.equal(verified.executed,false);assert.equal(verified.signatureStatus,'NotSigned');
  console.log('Package inspected, never installed or opened: '+packagePath);
});
