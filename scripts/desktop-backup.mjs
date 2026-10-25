import crypto from 'node:crypto';import fs from 'node:fs';import path from 'node:path';import os from 'node:os';import {spawnSync} from 'node:child_process';
import {repoRoot as rootLocation,loadLocalDevelopmentEnv,localDatabaseAddress,redactLocalSecrets,checkLocalDatabase} from './local-development-env.mjs';
const root=path.resolve(rootLocation);
export async function createLocalBackup(env=loadLocalDevelopmentEnv()) {
  if(process.platform!=='win32')throw new Error('Windows user encryption is required for desktop backups');
  const address=localDatabaseAddress(env);await checkLocalDatabase(env);
  const marker=JSON.parse(fs.readFileSync(path.join(root,'.local/dev-database.json'),'utf8'));
  const cluster=path.resolve(root,'.local/postgres');
  if(marker.kind!=='nexora-owned-development-database'||marker.host!==address.host||marker.port!==address.port||marker.database!==address.database||path.resolve(marker.clusterDirectory).toLowerCase()!==cluster.toLowerCase())throw new Error('Backup refused: database ownership does not match');
  const {PrismaClient}=await import('@prisma/client');const db=new PrismaClient({datasources:{db:{url:env.DATABASE_URL}},log:[]});
  try {const [location]=await db.$queryRaw`SELECT current_setting('data_directory') AS directory`;if(path.resolve(location.directory).toLowerCase()!==cluster.toLowerCase())throw new Error('Backup refused: unexpected database data directory');} finally {await db.$disconnect();}
  const folder=path.join(root,'.local/backups');fs.mkdirSync(folder,{recursive:true});
  const day=new Date().toISOString().slice(0,10);const manifestPath=path.join(folder,'latest.json');
  try { const latest=JSON.parse(fs.readFileSync(manifestPath,'utf8')); const candidate=path.resolve(latest.file); if(path.dirname(candidate)===folder && latest.createdAt?.slice(0,10)===day && fs.existsSync(candidate) && crypto.createHash('sha256').update(fs.readFileSync(candidate)).digest('hex')===latest.sha256)return {file:candidate,reused:true}; }catch{}
  const file=path.join(folder,day+'-'+crypto.randomUUID()+'.nexora');
  const temporary=fs.mkdtempSync(path.join(os.tmpdir(),'nexora-backup-'));const dump=path.join(temporary,'snapshot.dump');
  const parsed=new URL(env.DATABASE_URL);
  const pgEnv={...env,PGHOST:address.host,PGPORT:String(address.port),PGDATABASE:address.database,PGUSER:decodeURIComponent(parsed.username),PGPASSWORD:decodeURIComponent(parsed.password)};
  try {
    const executable=path.join(marker.postgresBin,'pg_dump.exe');if(!fs.existsSync(executable))throw new Error('PostgreSQL backup executable is unavailable');
    const result=spawnSync(executable,['--format=custom','--no-owner','--no-acl','--file',dump],{env:pgEnv,windowsHide:true,encoding:'utf8',timeout:180000});
    if(result.status!==0)throw new Error('PostgreSQL backup failed; no data was reset');
    const protect=spawnSync('powershell.exe',['-NoProfile','-NonInteractive','-File',path.join(root,'scripts/desktop/protect-backup.ps1'),'-SourcePath',dump,'-TargetPath',file],{windowsHide:true,encoding:'utf8',timeout:30000});
    if(protect.status!==0||!fs.existsSync(file)||fs.statSync(file).size<100)throw new Error('Windows-user backup encryption failed');
    const sha256=crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
    fs.writeFileSync(path.join(folder,'latest.json'),JSON.stringify({file,sha256,createdAt:new Date().toISOString(),encryption:'Windows CurrentUser DPAPI',format:'PostgreSQL custom dump'},null,2));
    return {file,reused:false};
  } finally {
    // Remove only the files in this exact freshly generated private temp directory.
    if(path.dirname(temporary)===path.resolve(os.tmpdir())&&path.basename(temporary).startsWith('nexora-backup-')){if(fs.existsSync(dump))fs.unlinkSync(dump);fs.rmdirSync(temporary);}
  }
}
if(process.argv[1]&&path.resolve(process.argv[1])===path.join(root,'scripts/desktop-backup.mjs')) {
  const env=loadLocalDevelopmentEnv();createLocalBackup(env).then(result=>console.log(JSON.stringify({backup:result.file,reused:result.reused}))).catch(error=>{console.error(redactLocalSecrets(error.message,env));process.exitCode=1;});
}
