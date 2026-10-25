import fs from 'node:fs';import path from 'node:path';import {createHash} from 'node:crypto';import {PrismaClient} from '@prisma/client';
import {repoRoot,loadLocalDevelopmentEnv,localDatabaseAddress,redactLocalSecrets} from './local-development-env.mjs';
const baseline=process.env.NEXORA_DATA_BASELINE??'release-data-before-2026-10-22.json';
if(!/^release-data-[a-zA-Z0-9.-]+\.json$/.test(baseline))throw new Error('Invalid preservation baseline name');
const env=loadLocalDevelopmentEnv(),target=path.resolve(repoRoot,'.local',baseline);
const prisma=new PrismaClient({datasources:{db:{url:env.DATABASE_URL}}});
const identifier=value=>'"'+value.replaceAll('"','""')+'"';
try{
  const {schema}=localDatabaseAddress(env);
  const names=await prisma.$queryRaw`SELECT table_name FROM information_schema.tables WHERE table_schema=${schema} AND table_type='BASE TABLE' ORDER BY table_name`;
  const tables=[];
  // The preserved schema has hundreds of tables. Bounded read-only batches
  // avoid exhausting PostgreSQL relation locks without changing server settings.
  // Run capture/compare with the owned application services stopped.
  for(let offset=0;offset<names.length;offset+=10){
    const batch=await prisma.$transaction(async tx=>{
      await tx.$executeRawUnsafe('SET TRANSACTION READ ONLY');const rows=[];
      for(const {table_name:name}of names.slice(offset,offset+10)){
      const [row]=await tx.$queryRawUnsafe(`SELECT count(*)::text AS count, encode(sha256(convert_to(COALESCE(string_agg(h,'' ORDER BY h),''),'UTF8')),'hex') AS digest FROM (SELECT encode(sha256(convert_to(to_jsonb(t)::text,'UTF8')),'hex') AS h FROM ${identifier(schema)}.${identifier(name)} t) rows`);
      rows.push({table:name,count:row.count,digest:row.digest});
      }
      return rows;
    },{isolationLevel:'RepeatableRead',timeout:30000});
    tables.push(...batch);
  }
  const fingerprint={tables,digest:createHash('sha256').update(JSON.stringify(tables)).digest('hex')};
  if(process.argv.includes('--capture')){if(fs.existsSync(target))throw new Error('A preservation baseline already exists; it was not overwritten.');fs.writeFileSync(target,JSON.stringify(fingerprint,null,2));console.log(`Captured read-only hashes for ${tables.length} database tables; row contents and connection values withheld.`);}
  else{const before=JSON.parse(fs.readFileSync(target,'utf8'));if(before.digest!==fingerprint.digest){const changed=tables.filter(row=>JSON.stringify(row)!==JSON.stringify(before.tables.find(old=>old.table===row.table))).map(row=>row.table);throw new Error('Data preservation mismatch in tables: '+changed.join(', '));}console.log(`Exact read-only data hashes unchanged across all ${tables.length} database tables.`);}
}catch(error){console.error(redactLocalSecrets(error.message,env));process.exitCode=1;}finally{await prisma.$disconnect();}
