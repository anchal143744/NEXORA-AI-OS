import {test,expect} from '@playwright/test';
import {randomUUID} from 'node:crypto';
import {startDisposableUiRuntime} from './disposable-ui-runtime.mjs';
let runtime,db,base;
test.beforeAll(async()=>{test.setTimeout(180000);runtime=await startDisposableUiRuntime();({db,base}=runtime);});
test.afterAll(async()=>{if(runtime)await runtime.close();});

async function createAccount(page){
  const email=randomUUID()+'@example.invalid',password='Synthetic-'+randomUUID()+'!';
  await page.goto(base+'/signup');await page.getByLabel('Your name',{exact:true}).fill('Synthetic UI Owner');await page.getByLabel('Email address',{exact:true}).fill(email);await page.getByLabel('Password',{exact:true}).fill(password);await page.getByLabel('Confirm password',{exact:true}).fill(password);
  const signup=page.waitForResponse(response=>response.url().endsWith('/api/v1/auth/signup')&&response.request().method()==='POST');
  await page.getByRole('button',{name:'Create account',exact:true}).click();const response=await signup;expect(response.status()).toBe(201);const payload=await response.json();
  await expect(page).toHaveURL(/business-setup/);
  await page.getByLabel('Business name',{exact:true}).fill('Synthetic UI Shop');await page.getByLabel('Workspace name',{exact:true}).fill('UI Workspace');await page.getByLabel('Shop category',{exact:true}).fill('Retail');await page.getByLabel('Country code',{exact:true}).fill('IN');await page.getByLabel('Business currency').selectOption('INR');await page.getByLabel('What do you sell?',{exact:true}).fill('Synthetic test products');
  await page.getByRole('button',{name:'Save & open dashboard',exact:true}).click();await expect(page).toHaveURL(/dashboard/);
  return payload.data.session;
}
async function navigate(page,label){await page.getByRole('navigation',{name:'Main navigation'}).getByRole('button',{name:label,exact:true}).click();}
async function save(page){await page.getByRole('dialog').getByRole('button',{name:'Save changes',exact:true}).click();await expect(page.getByRole('dialog')).not.toBeVisible();}

test('signup, setup, customer and inventory UI writes survive reload and reconcile persisted records',async({page})=>{
  expect((await page.request.get(base+'/api/v1/retail/shop/settings')).status()).toBe(401);
  const session=await createAccount(page);
  await navigate(page,'Contacts');await page.getByRole('button',{name:'Add customer',exact:true}).click();
  const dialog=page.getByRole('dialog');await dialog.locator('input[name="name"]').fill('Synthetic UI Customer');await save(page);
  await page.reload();await navigate(page,'Contacts');await expect(page.getByRole('row').filter({hasText:'Synthetic UI Customer'})).toBeVisible();
  const customer=await db.crmCustomerRecord.findFirst({where:{tenantId:session.tenantId,name:'Synthetic UI Customer'}});expect(customer).toBeTruthy();
  await navigate(page,'Products');await page.getByRole('button',{name:'Add product',exact:true}).click();
  await dialog.getByLabel('Product name',{exact:true}).fill('Synthetic UI Product');await dialog.getByLabel('SKU',{exact:true}).fill('UI-'+randomUUID());await dialog.getByLabel('Selling price (INR)',{exact:true}).fill('30.00');await dialog.getByLabel('Opening unit cost (INR)',{exact:true}).fill('10.00');await dialog.getByLabel('Opening stock',{exact:true}).fill('10');await save(page);
  const product=await db.stockBalance.findFirst({where:{tenantId:session.tenantId,item:{name:'Synthetic UI Product'}}});expect(product).toBeTruthy();expect(product.quantityAvailable.toString()).toBe('10');
  await page.getByRole('button',{name:'Update stock',exact:true}).click();await dialog.getByLabel('Quantity change',{exact:true}).fill('5');await dialog.getByLabel('Unit cost (INR)',{exact:true}).fill('10.00');await dialog.getByLabel('Reason',{exact:true}).fill('Synthetic receipt');await save(page);
  await page.getByRole('button',{name:'Update stock',exact:true}).click();await dialog.getByLabel('Movement type').selectOption('ADJUSTMENT');await dialog.getByLabel('Quantity change',{exact:true}).fill('-2');await dialog.getByLabel('Reason',{exact:true}).fill('Synthetic count correction');await save(page);
  await page.reload();await navigate(page,'Products');await expect(page.getByRole('row').filter({hasText:'Synthetic UI Product'})).toBeVisible();
  await page.getByRole('button',{name:'Stock history for Synthetic UI Product',exact:true}).click();for(const kind of ['OPENING','RECEIPT','ADJUSTMENT'])await expect(dialog).toContainText(kind);
  const updated=await db.stockBalance.findUnique({where:{id:product.id}});expect(updated.quantityAvailable.toString()).toBe('13');expect(updated.inventoryValue.toFixed(2)).toBe('130.00');
});

test('sale, exact partial payment and expense UI update the real invoice and report',async({page})=>{
  const session=await createAccount(page),headers={authorization:`Bearer ${session.accessToken}`,'x-tenant-id':session.tenantId,'x-workspace-id':session.workspaceId,'x-organization-id':session.organizationId};
  // Catalogue fixture only; the sale, completion, payment and expense use UI.
  const fixture=await page.request.post(base+'/api/v1/retail/shop/products',{headers,data:{productKey:randomUUID(),name:'Synthetic sale item',sku:randomUUID(),unitPrice:'30.00',unitCost:'10.00',openingQuantity:'10',reorderPoint:'0'}});expect(fixture.status()).toBe(201);const product=(await fixture.json()).data;
  await navigate(page,'Orders');await page.getByRole('button',{name:'Create sale',exact:true}).click();const dialog=page.getByRole('dialog');await dialog.getByLabel('Product 1',{exact:true}).selectOption(product.id);await dialog.getByLabel('Quantity 1',{exact:true}).fill('3');await dialog.getByRole('button',{name:'Save draft sale',exact:true}).click();await expect(dialog).not.toBeVisible();
  await page.getByRole('button',{name:'Complete',exact:true}).click();await expect(page.getByRole('button',{name:'Record payment',exact:true})).toBeVisible();
  await page.getByRole('button',{name:'Record payment',exact:true}).click();
  await dialog.getByLabel('Amount received (INR)',{exact:true}).fill('100.00');
  const invalid=page.waitForResponse(response=>response.url().includes('/payments')&&response.request().method()==='POST');
  await dialog.getByRole('button',{name:'Save changes',exact:true}).click();expect((await invalid).status()).toBe(400);await expect(dialog.getByRole('alert')).toBeVisible();
  await dialog.getByLabel('Amount received (INR)',{exact:true}).fill('50.00');await save(page);
  await navigate(page,'Income & Expenses');await page.getByRole('button',{name:'Record expense',exact:true}).click();await dialog.getByLabel('Payee / supplier',{exact:true}).fill('Synthetic delivery');await dialog.getByLabel('Category',{exact:true}).fill('Delivery');await dialog.getByLabel('Amount (INR)',{exact:true}).fill('10.10');await save(page);
  await navigate(page,'Orders');await page.getByRole('row').filter({hasText:'Walk-in customer'}).locator('summary').click();await page.getByRole('button',{name:'Payment history',exact:true}).click();
  await dialog.getByLabel('Original payment').selectOption({index:1});await dialog.getByLabel('Correction type').selectOption('REFUND');await dialog.getByLabel('Amount (INR)',{exact:true}).fill('10.00');await dialog.getByLabel('Reason',{exact:true}).fill('Synthetic overcollection correction');await dialog.getByRole('button',{name:'Record correction',exact:true}).click();await expect(dialog).not.toBeVisible();
  await page.reload();const invoices=await db.invoice.findMany({where:{tenantId:session.tenantId}});expect(invoices).toHaveLength(1);expect(invoices[0].amountPaid.toFixed(2)).toBe('40.00');expect(invoices[0].amountDue.toFixed(2)).toBe('50.00');expect(invoices[0].status).toBe('PARTIALLY_PAID');
  const report=await page.request.get(base+'/api/v1/retail/reports/profit-loss?currency=INR&from=2000-01-01T00:00:00Z&to=2100-01-01T00:00:00Z',{headers});expect(report.status()).toBe(200);const data=(await report.json()).data;expect(data.recognizedRevenue).toBe('90.00');expect(data.grossProfit).toBe('60.00');expect(data.netProfit).toBe('49.90');expect(data.netCustomerCash).toBe('40.00');
  await navigate(page,'Overview');await expect(page.locator('main')).toContainText('90');
});
