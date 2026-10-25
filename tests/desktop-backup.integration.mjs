import assert from 'node:assert/strict';import {test} from 'node:test';import fs from 'node:fs';import path from 'node:path';import {createRequire} from 'node:module';import {spawnSync} from 'node:child_process';import {randomUUID} from 'node:crypto';
const url=process.env.NEXORA_RETAIL_TEST_DATABASE_URL,cluster=process.env.NEXORA_TEST_CLUSTER_PATH;
if(!url||!cluster)throw new Error('Use the disposable retail test runner');
const parsed=new URL(url);
if(parsed.hostname!=='127.0.0.1'||!/^\/nexora_retail_test_[a-z0-9]+$/.test(parsed.pathname))throw new Error('Refusing a non-disposable source database');
const require=createRequire(import.meta.url);const {PrismaClient}=require('@prisma/client');
const pgBin=process.env.NEXORA_TEST_POSTGRES_BIN??'C:/Program Files/PostgreSQL/16/bin';
const restoreName='nexora_restore_'+randomUUID().replaceAll('-','');
const restoreUrl=new URL(url);restoreUrl.pathname='/'+restoreName;
function command(executable,args,timeout=180000){const result=spawnSync(executable,args,{windowsHide:true,encoding:'utf8',timeout});if(result.status!==0)throw new Error(path.basename(executable)+' failed in disposable backup verification');}
test('Windows-user encrypted backup restores exact business records and reconciled profit in a new disposable database',{timeout:240000},async()=>{
  const source=new PrismaClient({datasources:{db:{url}}});const restored=new PrismaClient({datasources:{db:{url:restoreUrl.toString()}}});
  const folder=fs.mkdtempSync(path.join(path.resolve(cluster),'backup-check-'));
  const dump=path.join(folder,'source.dump'),encrypted=path.join(folder,'source.nexora'),decoded=path.join(folder,'decoded.dump');
  try{
    const [location]=await source.$queryRaw`SELECT current_setting('data_directory') AS directory`;
    assert.equal(path.resolve(location.directory).toLowerCase(),path.resolve(cluster).toLowerCase());assert.ok(await source.user.count()>0,'retail fixtures must exist before backup verification');
    const args=['-h','127.0.0.1','-p',parsed.port,'-U','nexora_test'];
    command(path.join(pgBin,'pg_dump.exe'),[...args,'-d',parsed.pathname.slice(1),'--format=custom','--no-owner','--no-acl','--file',dump]);
    const protect=path.resolve('scripts/desktop/protect-backup.ps1');
    command('powershell.exe',['-NoProfile','-NonInteractive','-File',protect,'-SourcePath',dump,'-TargetPath',encrypted]);
    assert.notDeepEqual(fs.readFileSync(encrypted),fs.readFileSync(dump));
    command('powershell.exe',['-NoProfile','-NonInteractive','-File',protect,'-SourcePath',encrypted,'-TargetPath',decoded,'-Decrypt']);
    assert.deepEqual(fs.readFileSync(decoded),fs.readFileSync(dump));
    command(path.join(pgBin,'createdb.exe'),[...args,restoreName]);
    command(path.join(pgBin,'pg_restore.exe'),[...args,'-d',restoreName,'--no-owner','--no-acl','--exit-on-error',decoded]);
    const [targetLocation]=await restored.$queryRaw`SELECT current_setting('data_directory') AS directory`;
    assert.equal(path.resolve(targetLocation.directory).toLowerCase(),path.resolve(cluster).toLowerCase());
    for(const model of ['user','credential','membership','workspaceMember','workspace','crmCustomerRecord','retailSale','retailSaleLine','retailReturn','invoice','invoicePayment','stockBalance','inventoryMovementHistory','financeExpense','document','fileAsset']){
      // Prisma FileAsset sizes are BigInt. Preserve their exact values in the
      // comparison instead of rounding through Number or omitting the field.
      const normalize=rows=>JSON.parse(JSON.stringify(rows,(_key,value)=>typeof value==='bigint'?{bigint:value.toString()}:value));
      assert.deepEqual(normalize(await restored[model].findMany({orderBy:{id:'asc'}})),normalize(await source[model].findMany({orderBy:{id:'asc'}})),model);
    }
    // Select the known customer-sale fixture, not the separate rent-report fixture
    // that intentionally has different revenue and cost-of-goods values.
    const expense=await restored.financeExpense.findFirstOrThrow({where:{amount:'10.10',category:'Delivery',vendor:'Synthetic vendor'}});
    const workspace=await restored.workspace.findUniqueOrThrow({where:{id:expense.workspaceId}});
    const member=await restored.membership.findFirstOrThrow({where:{tenantId:workspace.tenantId,organizationId:workspace.organizationId,title:'Organization Owner',deletedAt:null}});
    const scope={tenantId:workspace.tenantId,organizationId:workspace.organizationId,workspaceId:workspace.id,userId:member.userId};
    require('reflect-metadata');const {RetailAccessService}=require('../apps/api/dist/modules/retail/retail-access.service.js');const {RetailReportService}=require('../apps/api/dist/modules/retail/retail-report.service.js');
    const adapter={database:restored,transaction:fn=>restored.$transaction(fn,{isolationLevel:'Serializable'})};
    const report=await new RetailReportService(adapter,new RetailAccessService(adapter,{context:()=>scope})).summary('INR','2000-01-01','2100-01-01');
    assert.equal(report.recognizedRevenue,'60.00');assert.equal(report.costOfGoodsSold,'20.00');assert.equal(report.netProfit,'29.90');
  }finally{await source.$disconnect();await restored.$disconnect();}
});
