import { readFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import {summarizeAudit} from './security-audit-result.mjs';

const packageJson = JSON.parse((await readFile('package.json', 'utf8')).replace(/^\uFEFF/, ''));
const apiPackageJson = JSON.parse((await readFile('apps/api/package.json', 'utf8')).replace(/^\uFEFF/, ''));
const requiredApiDeps = ['helmet', 'cookie-parser', '@nestjs/throttler', '@nestjs/jwt', 'argon2', 'zod'];
const missingDeps = requiredApiDeps.filter((dep) => !apiPackageJson.dependencies?.[dep]);
// npm.cmd is not directly executable through spawnSync on Windows. npm sets
// npm_execpath to its actual JavaScript CLI when this script runs via npm.
const npmCli=process.env.npm_execpath;
const command=npmCli?process.execPath:process.platform==='win32'?'cmd.exe':'npm';
const args=npmCli?[npmCli,'audit','--omit=dev','--audit-level=high','--json']:process.platform==='win32'?['/d','/s','/c','npm audit --omit=dev --audit-level=high --json']:['audit','--omit=dev','--audit-level=high','--json'];
const audit = spawnSync(command,args,{encoding:'utf8',windowsHide:true,timeout:120000});
const auditSummary=summarizeAudit(audit);
const result = { status: missingDeps.length === 0 ? auditSummary.status : 'review_required', package: packageJson.name, missingSecurityDependencies: missingDeps, audit: auditSummary };
console.log(JSON.stringify(result, null, 2));
if(missingDeps.length||auditSummary.status!=='passed')process.exit(1);
