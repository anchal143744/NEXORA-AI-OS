import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../../',import.meta.url));
export function assertDisposableCluster(cluster){
  const resolved=path.resolve(cluster),runtime=path.join(root,'tests/.runtime');
  if(path.dirname(resolved).toLowerCase()!==runtime.toLowerCase()||!/^cluster-[a-zA-Z0-9]+$/.test(path.basename(resolved)))throw new Error('Refusing a non-disposable cluster shutdown.');
  return resolved;
}
export function stopOrphanedUiDatabase({cluster,postmasterIdentity}){
  cluster=assertDisposableCluster(cluster);
  const identity=path.join(cluster,'postmaster.pid');
  if(!fs.existsSync(identity))return {stopped:true,alreadyStopped:true};
  if(fs.readFileSync(identity,'utf8')!==postmasterIdentity)throw new Error('Disposable PostgreSQL process identity changed; refusing shutdown.');
  const pgBin=process.env.NEXORA_TEST_POSTGRES_BIN??(process.platform==='win32'?'C:/Program Files/PostgreSQL/16/bin':'/usr/lib/postgresql/16/bin');
  const result=spawnSync(path.join(pgBin,process.platform==='win32'?'pg_ctl.exe':'pg_ctl'),['-D',cluster,'-m','fast','-w','-t','45','stop'],{windowsHide:true,stdio:'ignore',timeout:50000});
  if(result.status!==0||fs.existsSync(identity))throw new Error('Could not stop the orphaned disposable PostgreSQL cluster; retained for diagnosis.');
  return {stopped:true,alreadyStopped:false};
}
