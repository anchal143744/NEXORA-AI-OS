import fs from 'node:fs';import path from 'node:path';import {fileURLToPath} from 'node:url';
import {loadLocalDevelopmentEnv,repoRoot} from '../local-development-env.mjs';
export function configuredSecrets(env){
  const values=new Set();
  for(const [key,value]of Object.entries(env))if(/SECRET|PASSWORD|TOKEN|API_KEY|DATABASE_URL|DIRECT_URL|SHADOW_DATABASE_URL|REDIS_URL|SMTP_PASS/.test(key)&&typeof value==='string'&&value.length>=12)values.add(value);
  for(const key of ['DATABASE_URL','DIRECT_URL','REDIS_URL'])try{const value=decodeURIComponent(new URL(env[key]).password);if(value.length>=12)values.add(value);}catch{}
  return [...values];
}
export function hasConfiguredSecret(bytes,secrets){return secrets.some(secret=>bytes.includes(Buffer.from(secret,'utf8'))||bytes.includes(Buffer.from(secret,'utf16le'))||bytes.includes(Buffer.from(JSON.stringify(secret).slice(1,-1),'utf8')));}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  const secrets=configuredSecrets(loadLocalDevelopmentEnv());let checked=0;
  if(secrets.length===0)throw new Error('No sufficiently long configured secrets were available to verify. No clean result is claimed.');
  function walk(folder){for(const entry of fs.readdirSync(folder,{withFileTypes:true})){const file=path.join(folder,entry.name);if(entry.isSymbolicLink())continue;if(entry.isDirectory()){if(entry.name!=='cache')walk(file);}else if(entry.isFile()){if(hasConfiguredSecret(fs.readFileSync(file),secrets))throw new Error('Configured secret literal found in a release artifact. Value withheld; do not distribute this build.');checked++;}}}
  for(const folder of ['apps/api/dist','apps/web/.next/server','apps/web/.next/static'])walk(path.join(repoRoot,folder));
  if(process.argv[2]){const payload=path.resolve(process.argv[2]);if(!payload.startsWith(path.join(repoRoot,'.local','windows-releases')+path.sep))throw new Error('Only isolated Windows release payloads may be scanned.');walk(payload);}
  console.log(JSON.stringify({passed:true,filesChecked:checked,configuredSecretValuesChecked:secrets.length,valuesPrinted:false,scope:'literal UTF-8/UTF-16/JSON checks; not a complete secret or malware certification'}));
}
