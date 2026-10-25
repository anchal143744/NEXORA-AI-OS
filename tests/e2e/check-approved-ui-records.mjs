import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';import {PrismaClient} from '@prisma/client';import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../../',import.meta.url));
const state=JSON.parse(fs.readFileSync(path.join(root,'tests/.runtime/approved-ui-session.json'),'utf8'));
const url=new URL(state.databaseUrl),cluster=path.resolve(state.cluster);
if(url.hostname!=='127.0.0.1'||!/^\/nexora_retail_test_[a-z0-9]+$/.test(url.pathname)||!cluster.toLowerCase().startsWith(path.join(root,'tests/.runtime/cluster-').toLowerCase()))throw new Error('Refusing any database outside the disposable UI fixture.');
const stage=process.argv[2];if(!['stock','payment','refund','final'].includes(stage))throw new Error('A named UI checkpoint is required.');
const evidenceDate=process.argv[3]??'2026-10-22';if(!/^\d{4}-\d{2}-\d{2}$/.test(evidenceDate))throw new Error('An ISO evidence date is required.');
const db=new PrismaClient({datasources:{db:{url:state.databaseUrl}}});
try{
 const snapshot=await db.$transaction(async tx=>{
  await tx.$executeRawUnsafe('SET TRANSACTION READ ONLY');
  const [location]=await tx.$queryRaw`SELECT current_setting('data_directory') AS directory`;assert.equal(path.resolve(location.directory).toLowerCase(),cluster.toLowerCase());
  const customer=await tx.crmCustomerRecord.findFirst({where:{name:'Synthetic UI Customer'}});assert.ok(customer);
  const user=await tx.user.findUnique({where:{id:customer.ownerUserId},select:{email:true}});assert.ok(user);
  const stock=await tx.stockBalance.findFirst({where:{tenantId:customer.tenantId,item:{name:'Synthetic UI Product'}}});assert.ok(stock);
  const movements=await tx.inventoryMovementHistory.findMany({where:{stockId:stock.id},select:{movementType:true}});
  for(const value of ['OPENING','RECEIPT','ADJUSTMENT'])assert.ok(movements.some(m=>m.movementType===value));
  assert.equal(stock.quantityAvailable.toString(),stage==='stock'?'13':'10');assert.equal(stock.inventoryValue.toFixed(2),stage==='stock'?'130.00':'100.00');
  const invoice=await tx.invoice.findFirst({where:{tenantId:customer.tenantId}});
  if(stage!=='stock'){assert.ok(invoice);assert.equal(invoice.total.toFixed(2),'90.00');assert.equal(invoice.amountPaid.toFixed(2),stage==='payment'?'50.00':'40.00');assert.equal(invoice.amountDue.toFixed(2),stage==='payment'?'40.00':'50.00');assert.equal(invoice.status,'PARTIALLY_PAID');}
  return {email:user.email,tenantId:customer.tenantId,stock:stock.quantityAvailable.toString(),stockValue:stock.inventoryValue.toFixed(2),movements:movements.length,invoice:invoice?{total:invoice.total.toFixed(2),paid:invoice.amountPaid.toFixed(2),due:invoice.amountDue.toFixed(2)}:null};
 },{isolationLevel:'RepeatableRead',timeout:20000});
 const login=await fetch(state.api+'/api/v1/auth/login',{method:'POST',headers:{'content-type':'application/json',Origin:state.base},body:JSON.stringify({email:snapshot.email,password:'Nexora-Synthetic-Release-20261022!',tenantId:snapshot.tenantId,sessionTransport:'cookie'})});assert.equal(login.status,201);const {data}=await login.json();const session=data.session;
 const reportResponse=await fetch(state.api+'/api/v1/retail/reports/profit-loss?currency=INR&from=2000-01-01T00:00:00Z&to=2100-01-01T00:00:00Z',{headers:{authorization:'Bearer '+session.accessToken,'x-tenant-id':session.tenantId,'x-workspace-id':session.workspaceId,'x-organization-id':session.organizationId}});assert.equal(reportResponse.status,200);const report=(await reportResponse.json()).data;
 if(stage!=='stock'){assert.equal(report.recognizedRevenue,'90.00');assert.equal(report.costOfGoodsSold,'30.00');assert.equal(report.grossProfit,'60.00');assert.equal(report.netCustomerCash,stage==='payment'?'50.00':'40.00');assert.equal(report.netProfit,stage==='final'?'49.90':'60.00');}
 const output={stage,passed:true,disposableDatabaseVerified:true,customerPersisted:true,stockQuantity:snapshot.stock,stockValue:snapshot.stockValue,movements:snapshot.movements,invoice:snapshot.invoice,report:{revenue:report.recognizedRevenue,grossProfit:report.grossProfit,netProfit:report.netProfit,netCustomerCash:report.netCustomerCash},credentialsPrinted:false};
 fs.writeFileSync(path.join(root,`docs/verification/finalize-ui-${stage}-${evidenceDate}.json`),JSON.stringify(output,null,2)+'\n');console.log(JSON.stringify(output));
}finally{await db.$disconnect();}
