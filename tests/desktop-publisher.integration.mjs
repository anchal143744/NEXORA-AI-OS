import assert from 'node:assert/strict';
import test from 'node:test';
import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';

const root=fileURLToPath(new URL('../',import.meta.url));
function powershell(args){
  const env={...process.env};delete env.NEXORA_SIGNING_CERT_THUMBPRINT;delete env.NEXORA_SIGNING_TIMESTAMP_URL;
  const result=spawnSync('powershell.exe',['-NoProfile','-NonInteractive',...args],{cwd:root,env,windowsHide:true,encoding:'utf8',timeout:45000});
  assert.ifError(result.error);return result;
}
function preservedFiles(){
  const files=['.local/desktop/NEXORA.exe','.local/desktop/launcher.conf','.local/dev-database.json','.local/desktop-runtime.json','apps/api/dist/main.js','apps/web/.next/BUILD_ID'].map(name=>path.join(root,name));
  // Resolve Windows' actual (possibly OneDrive redirected) desktop read-only.
  const desktop=powershell(['-Command',"[Environment]::GetFolderPath('Desktop')"]);
  assert.equal(desktop.status,0,desktop.stderr);
  files.push(path.join(desktop.stdout.trim(),'NEXORA.lnk'));
  return files.map(file=>[file,fs.existsSync(file)?createHash('sha256').update(fs.readFileSync(file)).digest('hex'):null]);
}

test('release install without a publisher certificate fails before changing existing launcher, shortcut or database configuration',()=>{
  const before=preservedFiles();
  const result=powershell(['-File','scripts/desktop/install-desktop.ps1']);
  assert.notEqual(result.status,0);
  assert.match(result.stderr,/No code-signing certificate selected/);
  assert.deepEqual(preservedFiles(),before);
});

test('publisher verification recognizes the existing trusted timestamped Node executable without executing it',()=>{
  const checked=powershell(['-File','scripts/desktop/check-desktop-trust.ps1','-Path',process.execPath]);
  assert.equal(checked.status,0,checked.stdout+checked.stderr);
  const report=JSON.parse(checked.stdout.replace(/^\uFEFF/,''));
  assert.equal(report.publisherVerified,true);assert.equal(report.status,'Valid');assert.equal(report.timestamped,true);assert.equal(report.executed,false);
  assert.match(report.sha256,/^[A-F0-9]{64}$/);
  assert.equal(report.sha256,createHash('sha256').update(fs.readFileSync(process.execPath)).digest('hex').toUpperCase());
});

test('unsigned development builds cannot be installed',()=>{
  const before=preservedFiles();
  const result=powershell(['-File','scripts/desktop/install-desktop.ps1','-DevelopmentBuild']);
  assert.notEqual(result.status,0);
  assert.match(result.stderr,/Development builds require -NoInstall/);
  assert.deepEqual(preservedFiles(),before);
});

test('desktop prepare checks signing readiness before rebuilding the running application',()=>{
  const before=preservedFiles();
  const result=powershell(['-Command','& npm.cmd run desktop:prepare; exit $LASTEXITCODE']);
  assert.notEqual(result.status,0);
  assert.match(result.stdout,/"readyToSign":\s*false/);
  assert.match(result.stdout,/No code-signing certificate selected/);
  assert.doesNotMatch(result.stdout,/> nest build|> next build/);
  assert.deepEqual(preservedFiles(),before);
});

test('native MSI release checks publisher readiness before stopping services or replacing compiled files',()=>{
  const before=preservedFiles();
  const result=powershell(['-Command','& npm.cmd run desktop:release; exit $LASTEXITCODE']);
  assert.notEqual(result.status,0);
  assert.match(result.stdout,/"readyToSign":\s*false/);
  assert.match(result.stdout,/No code-signing certificate selected/);
  assert.doesNotMatch(result.stdout,/> nest build|> next build|stopped gracefully/);
  assert.deepEqual(preservedFiles(),before);
});

test('isolated native development compilation preserves the installed app and fails publisher verification without executing the binary',()=>{
  const before=preservedFiles();
  const result=powershell(['-File','scripts/desktop/install-desktop.ps1','-NoInstall','-DevelopmentBuild']);
  assert.equal(result.status,0,result.stderr);
  const match=result.stdout.match(/unsigned build at (.+?NEXORA\.exe)\. Not installed/);
  assert.ok(match,result.stdout);
  const executable=path.resolve(match[1]);
  assert.ok(executable.startsWith(path.join(root,'.local','desktop-builds')+path.sep));
  assert.ok(fs.statSync(executable).size>0);
  const checked=powershell(['-File','scripts/desktop/check-desktop-trust.ps1','-Path',executable]);
  assert.notEqual(checked.status,0);
  const report=JSON.parse(checked.stdout.replace(/^\uFEFF/,''));
  assert.equal(report.publisherVerified,false);assert.equal(report.executed,false);assert.equal(report.protectionChanged,false);
  assert.match(report.reason,/NotSigned/);
  assert.deepEqual(preservedFiles(),before);
});
