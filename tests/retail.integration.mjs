import assert from 'node:assert/strict';
import { before, after, test } from 'node:test';
import { createRequire } from 'node:module';
import { randomUUID } from 'node:crypto';
import path from 'node:path';
const require = createRequire(import.meta.url);
const url = process.env.NEXORA_RETAIL_TEST_DATABASE_URL;
if (!url) throw new Error('NEXORA_RETAIL_TEST_DATABASE_URL is required; use npm run retail:test. No fallback to DATABASE_URL is allowed.');
const parsed = new URL(url);
if (parsed.hostname !== '127.0.0.1' || !/^\/nexora_retail_(test_[a-z0-9]+|disposable)$/.test(parsed.pathname)) throw new Error('Refusing a non-disposable test database');
process.env.DATABASE_URL = url;
require('reflect-metadata');
const { PrismaService } = require('../apps/api/dist/infrastructure/database/prisma.service.js');
const { RequestContextStore } = require('../apps/api/dist/common/context/request-context.store.js');
const { TenantContextService } = require('../apps/api/dist/modules/tenants/tenant-context.service.js');
const { RetailAccessService } = require('../apps/api/dist/modules/retail/retail-access.service.js');
const { InventoryLedgerService } = require('../apps/api/dist/modules/retail/inventory-ledger.service.js');
const { InventoryCoreService } = require('../apps/api/dist/modules/supply-chain/inventory-core.service.js');
const { PaymentsService } = require('../apps/api/dist/modules/retail/payments.service.js');
const { RetailSalesService } = require('../apps/api/dist/modules/retail/retail-sales.service.js');
const { RetailReportService } = require('../apps/api/dist/modules/retail/retail-report.service.js');
const { FinanceService } = require('../apps/api/dist/modules/finance/finance.service.js');
const { RbacService } = require('../apps/api/dist/modules/rbac/rbac.service.js');
const { AuthService } = require('../apps/api/dist/modules/auth/auth.service.js');
const { TokenService } = require('../apps/api/dist/modules/auth/tokens/token.service.js');
const { JwtAuthGuard } = require('../apps/api/dist/modules/auth/guards/jwt-auth.guard.js');
const { SessionsService } = require('../apps/api/dist/modules/sessions/sessions.service.js');
const { JwtService } = require('@nestjs/jwt');
const { Module, ValidationPipe, VersioningType } = require('@nestjs/common');
const { NestFactory } = require('@nestjs/core');
const cookieParser = require('cookie-parser');
const { RetailController } = require('../apps/api/dist/modules/retail/retail.controller.js');
const { FinanceController } = require('../apps/api/dist/modules/finance/finance.controller.js');
const { ShopController } = require('../apps/api/dist/modules/retail/shop.controller.js');
const { ShopService } = require('../apps/api/dist/modules/retail/shop.service.js');
const { AuthController } = require('../apps/api/dist/modules/auth/auth.controller.js');
const { UsersService } = require('../apps/api/dist/modules/users/users.service.js');
const { PasswordService } = require('../apps/api/dist/modules/security/services/password.service.js');
const { LoginAuditService } = require('../apps/api/dist/modules/security/services/login-audit.service.js');
const store = new RequestContextStore();
const prisma = new PrismaService(store);
const db = prisma.database;
const context = new TenantContextService(store, prisma);
const access = new RetailAccessService(prisma, context);
const inventory = new InventoryLedgerService(prisma, access);
const core = new InventoryCoreService(prisma, context, null, access, inventory);
const payments = new PaymentsService(prisma, access);
const sales = new RetailSalesService(prisma, access, inventory, payments);
const reports = new RetailReportService(prisma, access);
const finance = new FinanceService(prisma, context, null, payments, access, reports);
const rbac = new RbacService(prisma, context, access);
const tokens = new TokenService(new JwtService({ secret: randomUUID() }));
const sessions = new SessionsService(prisma);
const {ShopDocumentsService}=require('../apps/api/dist/modules/retail/shop-documents.service.js');const {ShopAssistantService}=require('../apps/api/dist/modules/retail/shop-assistant.service.js');const {ShopLeadsService}=require('../apps/api/dist/modules/retail/shop-leads.service.js');const {LeadIntakeController}=require('../apps/api/dist/modules/retail/lead-intake.controller.js');
const documents=new ShopDocumentsService(prisma,access),assistant=new ShopAssistantService(prisma,access),leads=new ShopLeadsService(prisma,access,store);
const shop = new ShopService(prisma, access, inventory);
// Outbound mail is deliberately disabled in this isolated test harness.
const shopAuth = new AuthService(prisma, new UsersService(prisma, context), sessions, new PasswordService(), tokens, new LoginAuditService(prisma), null, { sendVerificationEmail: async () => ({ disabled: true }) });
let owner, otherTenant, otherOrganization, viewer, app, origin;
const scoped = (scope, fn) => store.run({ requestId: randomUUID(), correlationId: randomUUID(), traceId: randomUUID(), roles: ['Organization Owner'], permissions: ['create','read','update','approve','manage'], ...scope }, fn);
async function organization(tenantId) {
  const tenant = tenantId ? { id: tenantId } : await db.tenant.create({ data: { name: 'Synthetic retail test', slug: randomUUID(), status: 'ACTIVE' } });
  const org = await db.organization.create({ data: { tenantId: tenant.id, name: randomUUID() } });
  const workspace = await db.workspace.create({ data: { tenantId: tenant.id, organizationId: org.id, name: 'Synthetic shop', slug: randomUUID(), metadata: { currency: 'INR' } } });
  const user = await db.user.create({ data: { tenantId: tenant.id, email: `${randomUUID()}@example.invalid`, displayName: 'Test owner', status: 'ACTIVE' } });
  await db.membership.create({ data: { tenantId: tenant.id, organizationId: org.id, userId: user.id, title: 'Organization Owner' } });
  await db.workspaceMember.create({ data: { tenantId: tenant.id, workspaceId: workspace.id, userId: user.id, status: 'ACTIVE' } });
  return { tenantId: tenant.id, organizationId: org.id, workspaceId: workspace.id, userId: user.id };
}
async function stock(qty = '0', cost = '10.00', scope = owner) {
  const item = await db.supplyChainItem.create({ data: { tenantId: scope.tenantId, workspaceId: scope.workspaceId, sku: randomUUID(), name: 'Test item', itemKey: randomUUID() } });
  const warehouse = await db.warehouse.create({ data: { tenantId: scope.tenantId, workspaceId: scope.workspaceId, warehouseKey: randomUUID(), name: 'Test warehouse' } });
  return scoped(scope, () => core.createStock({ itemId: item.id, warehouseId: warehouse.id, stockKey: randomUUID(), quantityOnHand: Number(qty), quantityAvailable: Number(qty), costingCurrency: 'INR', unitCost: cost, reason: 'Synthetic opening stock' }));
}
async function saleFor(balance, qty = '1', price = '20.00') {
  return scoped(owner, () => sales.create({ saleKey: randomUUID(), currency: 'INR', lines: [{ stockId: balance.id, quantity: qty, unitPrice: price }] }));
}
const balance = id => db.stockBalance.findUniqueOrThrow({ where: { id } });
const invoice = id => db.invoice.findUniqueOrThrow({ where: { id } });
const errorStatus = status => error => error.getStatus?.() === status;
before(async () => {
  await db.$connect();
  const [location] = await db.$queryRaw`SELECT current_setting('data_directory') AS directory`;
  if (process.env.NEXORA_TEST_CLUSTER_PATH && path.resolve(location.directory).toLowerCase() !== path.resolve(process.env.NEXORA_TEST_CLUSTER_PATH).toLowerCase()) throw new Error('Test database is not in the expected disposable cluster');
  for (const [code, precision] of [['INR', 2], ['USD', 2], ['JPY', 0], ['KWD', 3]]) await db.currency.upsert({ where: { code }, update: {}, create: { code, name: code, symbol: code, precision } });
  owner = await organization(); otherTenant = await organization(); otherOrganization = await organization(owner.tenantId);
  const user = await db.user.create({ data: { tenantId: owner.tenantId, email: `${randomUUID()}@example.invalid`, displayName: 'Viewer', status: 'ACTIVE' } });
  await db.membership.create({ data: { tenantId: owner.tenantId, organizationId: owner.organizationId, userId: user.id, title: 'Viewer' } });
  await db.workspaceMember.create({ data: { tenantId: owner.tenantId, workspaceId: owner.workspaceId, userId: user.id, status: 'ACTIVE' } });
  viewer = { ...owner, userId: user.id };
  const guard = new JwtAuthGuard(tokens, store, sessions, prisma);
  class TestApiModule {}
  Module({ controllers: [RetailController, FinanceController, ShopController, AuthController,LeadIntakeController], providers: [
    { provide:ShopDocumentsService,useValue:documents },{provide:ShopAssistantService,useValue:assistant},{provide:ShopLeadsService,useValue:leads},{ provide: ShopService, useValue: shop }, { provide: AuthService, useValue: shopAuth },
    { provide: InventoryLedgerService, useValue: inventory }, { provide: RetailSalesService, useValue: sales }, { provide: RetailReportService, useValue: reports }, { provide: FinanceService, useValue: finance }, { provide: PaymentsService, useValue: payments }, { provide: JwtAuthGuard, useValue: guard },
    { provide: TokenService, useValue: tokens }, { provide: RequestContextStore, useValue: store }, { provide: SessionsService, useValue: sessions }, { provide: PrismaService, useValue: prisma },
  ] })(TestApiModule);
  app = await NestFactory.create(TestApiModule, { logger: false, abortOnError: false });
  app.use(cookieParser());
  app.use((_req, _res, next) => store.run({ requestId: randomUUID(), correlationId: randomUUID(), traceId: randomUUID(), roles: [], permissions: [] }, next));
  app.setGlobalPrefix('api'); app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));
  await app.listen(0, '127.0.0.1'); origin = await app.getUrl();
});
after(async () => { if (app) await app.close(); await db.$disconnect(); });

test('stock receipt is persisted with valuation, audit and retry protection', async () => {
  const s = await stock();
  const command = { stockId: s.id, quantity: '5', movementKey: randomUUID(), movementType: 'RECEIPT', reason: 'Goods received', currency: 'INR', unitCost: '12.00' };
  const [first, retry] = await scoped(owner, () => Promise.all([inventory.post(command), inventory.post(command)]));
  assert.equal(first.id, retry.id); assert.equal((await balance(s.id)).quantityAvailable.toString(), '5'); assert.equal((await balance(s.id)).inventoryValue.toString(), '60');
  assert.equal(await db.auditLog.count({ where: { resourceId: first.id } }), 1);
  assert.equal(await db.event.count({ where: { subjectId: first.id, status: 'PENDING' } }), 1);
  await assert.rejects(scoped(owner, () => inventory.post({ ...command, quantity: '6' })), errorStatus(409));
});
test('opening stock creates a ledger entry and validates retry identity', async () => {
  const s = await stock('3');
  assert.equal((await balance(s.id)).inventoryValue.toString(), '30');
  assert.equal(await db.inventoryMovementHistory.count({ where: { movementKey: `opening:${s.id}` } }), 1);
  await assert.rejects(scoped(owner, () => core.createStock({ stockKey: s.stockKey, itemId: s.itemId, warehouseId: s.warehouseId, quantityOnHand: 4, quantityAvailable: 4 })), errorStatus(409));
});
test('stock adjustments require reasons and cannot create negative balances', async () => {
  const s = await stock('5');
  const command = { stockId: s.id, quantity: '-2', movementKey: randomUUID(), movementType: 'ADJUSTMENT', reason: 'Count correction', currency: 'INR' };
  await scoped(owner, () => inventory.post(command));
  assert.equal((await balance(s.id)).quantityAvailable.toString(), '3'); assert.equal((await balance(s.id)).inventoryValue.toString(), '30');
  await assert.rejects(scoped(owner, () => inventory.post({ ...command, movementKey: randomUUID(), reason: '' })), errorStatus(400));
  await assert.rejects(scoped(owner, () => inventory.post({ ...command, movementKey: randomUUID(), quantity: '-4' })), errorStatus(409));
});
test('completed sale reduces stock exactly once, including concurrent retries', async () => {
  const s = await stock('8'); const sale = await saleFor(s, '3');
  assert.equal((await balance(s.id)).quantityAvailable.toString(), '8');
  await scoped(owner, () => Promise.all([sales.complete(sale.id), sales.complete(sale.id)]));
  assert.equal((await balance(s.id)).quantityAvailable.toString(), '5');
  assert.equal((await invoice(sale.invoiceId)).status, 'ISSUED');
  assert.equal(await db.inventoryMovementHistory.count({ where: { referenceId: sale.id, movementType: 'SALE' } }), 1);
});
test('concurrent sales cannot oversell the same stock', async () => {
  const s = await stock('5'); const a = await saleFor(s, '4'), b = await saleFor(s, '4');
  const results = await scoped(owner, () => Promise.allSettled([sales.complete(a.id), sales.complete(b.id)]));
  assert.equal(results.filter(r => r.status === 'fulfilled').length, 1);
  assert.equal(results.filter(r => r.status === 'rejected' && r.reason.getStatus?.() === 409).length, 1);
  assert.equal((await balance(s.id)).quantityAvailable.toString(), '1');
});
test('failure on a later sale line rolls back earlier stock and ledger writes', async () => {
  const balances = [await stock('5'), await stock('5')].sort((a,b) => a.id.localeCompare(b.id));
  const sale = await scoped(owner, () => sales.create({ saleKey: randomUUID(), currency: 'INR', lines: [{ stockId: balances[0].id, quantity: '1', unitPrice: '20' }, { stockId: balances[1].id, quantity: '6', unitPrice: '20' }] }));
  await assert.rejects(scoped(owner, () => sales.complete(sale.id)), errorStatus(409));
  assert.equal((await balance(balances[0].id)).quantityAvailable.toString(), '5');
  assert.equal(await db.inventoryMovementHistory.count({ where: { referenceId: sale.id } }), 0);
  assert.equal((await invoice(sale.invoiceId)).status, 'DRAFT');
  assert.equal((await db.retailSale.findUniqueOrThrow({ where: { id: sale.id } })).status, 'DRAFT');
});
test('partial payment, duplicate retry and overpayment reconcile correctly', async () => {
  const s = await stock('3'); const sale = await saleFor(s, '2', '50'); await scoped(owner, () => sales.complete(sale.id));
  const input = { idempotencyKey: randomUUID(), amount: '30.00', currency: 'INR', paymentMethod: 'cash' };
  const result = await scoped(owner, () => payments.record(sale.invoiceId, input));
  assert.equal(result.invoice.status, 'PARTIALLY_PAID'); assert.equal(result.invoice.amountDue.toString(), '70');
  const retry = await scoped(owner, () => payments.record(sale.invoiceId, input)); assert.equal(retry.payment.id, result.payment.id);
  await assert.rejects(scoped(owner, () => payments.record(sale.invoiceId, { ...input, amount: '31' })), errorStatus(409));
  await assert.rejects(scoped(owner, () => payments.record(sale.invoiceId, { ...input, idempotencyKey: randomUUID(), amount: '71' })), errorStatus(400));
  assert.equal(await db.invoicePayment.count({ where: { invoiceId: sale.invoiceId } }), 1);
});
test('concurrent payment retries persist only one payment', async () => {
  const s = await stock('1'); const sale = await saleFor(s, '1', '100'); await scoped(owner, () => sales.complete(sale.id));
  const input = { idempotencyKey: randomUUID(), amount: '100', currency: 'INR', paymentMethod: 'cash' };
  const rows = await scoped(owner, () => Promise.all([payments.record(sale.invoiceId, input), payments.record(sale.invoiceId, input)]));
  assert.equal(rows[0].payment.id, rows[1].payment.id); assert.equal(rows[0].invoice.amountDue.toString(), '0');
});
test('concurrent distinct payments cannot exceed invoice outstanding amount', async () => {
  const s = await stock('1'); const sale = await saleFor(s, '1', '100'); await scoped(owner, () => sales.complete(sale.id));
  const results = await scoped(owner, () => Promise.allSettled([payments.record(sale.invoiceId, { idempotencyKey: randomUUID(), amount: '70', currency: 'INR', paymentMethod: 'cash' }), payments.record(sale.invoiceId, { idempotencyKey: randomUUID(), amount: '70', currency: 'INR', paymentMethod: 'cash' })]));
  assert.equal(results.filter(r => r.status === 'fulfilled').length, 1); assert.equal((await invoice(sale.invoiceId)).amountDue.toString(), '30');
});
test('partial refund and reversal are immutable ledger corrections', async () => {
  const s = await stock('1'); const sale = await saleFor(s, '1', '100'); await scoped(owner, () => sales.complete(sale.id));
  const p = await scoped(owner, () => payments.record(sale.invoiceId, { idempotencyKey: randomUUID(), amount: '100', currency: 'INR', paymentMethod: 'cash' }));
  const input = { idempotencyKey: randomUUID(), paymentId: p.payment.id, amount: '25', reason: 'Cash refund' };
  await scoped(owner, () => payments.refund(sale.invoiceId, input)); await scoped(owner, () => payments.refund(sale.invoiceId, input));
  assert.equal((await invoice(sale.invoiceId)).amountDue.toString(), '25');
  await assert.rejects(scoped(owner, () => payments.refund(sale.invoiceId, { ...input, idempotencyKey: randomUUID(), amount: '76' })), errorStatus(400));
  await scoped(owner, () => payments.refund(sale.invoiceId, { ...input, idempotencyKey: randomUUID(), amount: '75', entryType: 'REVERSAL' }));
  assert.equal((await invoice(sale.invoiceId)).amountPaid.toString(), '0'); assert.equal((await invoice(sale.invoiceId)).status, 'ISSUED');
  assert.equal(await db.invoicePayment.count({ where: { invoiceId: sale.invoiceId } }), 3);
});
test('paid sale returns restore stock, credit invoice and refund only excess cash', async () => {
  const s = await stock('5', '10'); const sale = await saleFor(s, '3', '20'); await scoped(owner, () => sales.complete(sale.id));
  await scoped(owner, () => payments.settle(sale.invoiceId, randomUUID()));
  const input = { returnKey: randomUUID(), reason: 'Customer return', lines: [{ lineId: sale.lines[0].id, quantity: '1' }] };
  const returned = await scoped(owner, () => sales.returnItems(sale.id, input));
  assert.equal(returned.amount.toString(), '20'); assert.equal(returned.costOfGoods.toString(), '10');
  await scoped(owner, () => sales.returnItems(sale.id, input));
  assert.equal((await balance(s.id)).quantityAvailable.toString(), '3'); assert.equal((await invoice(sale.invoiceId)).total.toString(), '40'); assert.equal((await invoice(sale.invoiceId)).amountPaid.toString(), '40');
  await assert.rejects(scoped(owner, () => sales.returnItems(sale.id, { ...input, returnKey: randomUUID(), lines: [{ lineId: sale.lines[0].id, quantity: '3' }] })), errorStatus(400));
});
test('repeated fractional returns never over-credit rounded revenue or COGS', async () => {
  const scope = await organization(); const s = await stock('1', '0.01', scope);
  const sale = await scoped(scope, () => sales.create({ saleKey: randomUUID(), currency: 'INR', lines: [{ stockId: s.id, quantity: '0.5', unitPrice: '0.06' }] }));
  await scoped(scope, () => sales.complete(sale.id));
  await scoped(scope, () => payments.settle(sale.invoiceId, randomUUID()));
  for (let i = 0; i < 5; i++) await scoped(scope, () => sales.returnItems(sale.id, { returnKey: randomUUID(), reason: 'Fractional goods return', lines: [{ lineId: sale.lines[0].id, quantity: '0.1' }] }));
  const line = await db.retailSaleLine.findUniqueOrThrow({ where: { id: sale.lines[0].id } });
  assert.equal(line.returnedAmount.toString(), '0.03'); assert.equal(line.returnedCost.toString(), '0.005');
  assert.equal((await balance(s.id)).quantityOnHand.toString(), '1'); assert.equal((await balance(s.id)).inventoryValue.toString(), '0.01');
  assert.equal((await invoice(sale.invoiceId)).amountPaid.toString(), '0');
  const result = await scoped(scope, () => reports.summary('INR', '2000-01-01', '2100-01-01')); assert.equal(result.netProfit, '0.00');
});
test('draft cancellation has no stock effect; completed cancellation restores and refunds once', async () => {
  const s = await stock('5'); const draft = await saleFor(s, '2'); await scoped(owner, () => sales.cancel(draft.id, 'Order cancelled'));
  assert.equal((await balance(s.id)).quantityAvailable.toString(), '5');
  await assert.rejects(scoped(owner, () => sales.complete(draft.id)), errorStatus(400));
  const sale = await saleFor(s, '2'); await scoped(owner, () => sales.complete(sale.id)); await scoped(owner, () => payments.settle(sale.invoiceId, randomUUID()));
  await scoped(owner, () => sales.cancel(sale.id, 'Order cancelled')); await scoped(owner, () => sales.cancel(sale.id, 'Order cancelled'));
  assert.equal((await balance(s.id)).quantityAvailable.toString(), '5'); assert.equal((await invoice(sale.invoiceId)).status, 'CANCELLED'); assert.equal((await invoice(sale.invoiceId)).amountPaid.toString(), '0');
  assert.equal(await db.invoicePayment.count({ where: { invoiceId: sale.invoiceId, entryType: 'REFUND' } }), 1);
});
test('cross-tenant and cross-organization stock, sale and payment operations are denied', async () => {
  const s = await stock('2'); const sale = await saleFor(s); await scoped(owner, () => sales.complete(sale.id));
  for (const scope of [otherTenant, otherOrganization]) {
    await assert.rejects(scoped(scope, () => inventory.post({ stockId: s.id, quantity: '1', movementKey: randomUUID(), movementType: 'RECEIPT', currency: 'INR', unitCost: '1', reason: 'Attempted cross-scope receipt' })), errorStatus(404));
    await assert.rejects(scoped(scope, () => sales.complete(sale.id)), errorStatus(404));
    await assert.rejects(scoped(scope, () => payments.record(sale.invoiceId, { idempotencyKey: randomUUID(), amount: '1', currency: 'INR', paymentMethod: 'cash' })), errorStatus(404));
  }
  await assert.rejects(scoped(owner, () => core.createStock({ workspaceId: otherOrganization.workspaceId })), errorStatus(403));
});
test('forged owner token claims cannot bypass database role permissions', async () => {
  const s = await stock('2');
  await assert.rejects(scoped(viewer, () => inventory.post({ stockId: s.id, quantity: '-1', movementKey: randomUUID(), movementType: 'ADJUSTMENT', currency: 'INR', reason: 'Attempted viewer write' })), errorStatus(403));
  await assert.rejects(scoped(viewer, () => rbac.createRole({ name: 'Escalation', slug: randomUUID() })), errorStatus(403));
  const auth = new AuthService(prisma, null, null, null, tokens, null, null, null);
  await assert.rejects(auth.signup({ tenantId: owner.tenantId }), errorStatus(401));
  const issued = await auth.issueAccessTokenPair({ ...viewer, sessionId: randomUUID(), roles: ['Organization Owner'], permissions: ['manage'] });
  const claims = await tokens.verifyAccessToken(issued.accessToken); assert.deepEqual(claims.permissions, []); assert.deepEqual(claims.roles, ['Member']);
});
test('weighted average COGS and decimal report results match known transactions', async () => {
  const scope = await organization(); const s = await stock('10', '10', scope);
  await scoped(scope, () => inventory.post({ stockId: s.id, quantity: '10', movementKey: randomUUID(), movementType: 'RECEIPT', currency: 'INR', unitCost: '20', reason: 'Second receipt' }));
  const sale = await scoped(scope, () => sales.create({ saleKey: randomUUID(), currency: 'INR', lines: [{ stockId: s.id, quantity: '4', unitPrice: '30' }] }));
  await scoped(scope, () => sales.complete(sale.id));
  await scoped(scope, () => payments.record(sale.invoiceId, { idempotencyKey: randomUUID(), amount: '50', currency: 'INR', paymentMethod: 'cash' }));
  await scoped(scope, () => sales.returnItems(sale.id, { returnKey: randomUUID(), reason: 'One item returned', lines: [{ lineId: sale.lines[0].id, quantity: '1' }] }));
  await db.financeExpense.createMany({ data: [{ tenantId: scope.tenantId, workspaceId: scope.workspaceId, category: 'Rent', amount: '10.10', currency: 'INR', status: 'approved', incurredAt: new Date() }, { tenantId: scope.tenantId, workspaceId: scope.workspaceId, category: 'Unapproved', amount: '999', currency: 'INR', status: 'pending', incurredAt: new Date() }, { tenantId: scope.tenantId, workspaceId: scope.workspaceId, category: 'Other currency', amount: '999', currency: 'USD', status: 'approved', incurredAt: new Date() }] });
  const result = await scoped(scope, () => reports.summary('INR', '2000-01-01', '2100-01-01'));
  for (const [field, expected] of Object.entries({ sales: '120.00', returns: '30.00', recognizedRevenue: '90.00', costOfGoodsSold: '45.00', operatingExpenses: '10.10', grossProfit: '45.00', netProfit: '34.90', cashReceived: '50.00', cashRefunded: '0.00', netCustomerCash: '50.00' })) assert.equal(result[field], expected, field);
  assert.equal((await balance(s.id)).inventoryValue.toString(), '255');
  const empty = await scoped(scope, () => reports.summary('INR', '2000-01-01', '2001-01-01')); assert.equal(empty.netProfit, '0.00');
});
test('currency precision rejects invalid money and prevents currency mixing', async () => {
  const s = await stock('1'); const sale = await saleFor(s); await scoped(owner, () => sales.complete(sale.id));
  await assert.rejects(scoped(owner, () => payments.record(sale.invoiceId, { idempotencyKey: randomUUID(), amount: '0.001', currency: 'INR', paymentMethod: 'cash' })), errorStatus(400));
  await assert.rejects(scoped(owner, () => payments.record(sale.invoiceId, { idempotencyKey: randomUUID(), amount: '1', currency: 'USD', paymentMethod: 'cash' })), errorStatus(400));
  await assert.rejects(scoped(owner, () => inventory.post({ stockId: s.id, quantity: '1', movementKey: randomUUID(), movementType: 'RECEIPT', currency: 'USD', unitCost: '1', reason: 'Wrong currency' })), errorStatus(400));
  const scope = await organization(); const created = await scoped(scope, () => finance.createExpense({ category: 'KWD precision', amount: 1.234, currency: 'KWD', incurredAt: new Date().toISOString() })); assert.equal(created.amount.toString(), '1.234');
});
test('manual mark-paid persists a payment and retry is safe', async () => {
  const s = await stock('1'); const sale = await saleFor(s); await scoped(owner, () => sales.complete(sale.id));
  const idempotencyKey = randomUUID(); await scoped(owner, () => finance.markInvoicePaid(sale.invoiceId, idempotencyKey)); await scoped(owner, () => finance.markInvoicePaid(sale.invoiceId, idempotencyKey));
  assert.equal(await db.invoicePayment.count({ where: { invoiceId: sale.invoiceId } }), 1); assert.equal((await invoice(sale.invoiceId)).amountDue.toString(), '0');
  await assert.rejects(scoped(owner, () => finance.updateInvoice(sale.invoiceId, { status: 'paid' })), errorStatus(400));
});
test('database failure after payment insertion rolls back payment, balance and audit', async () => {
  const scope = await organization(); const s = await stock('1', '10', scope);
  const sale = await scoped(scope, () => sales.create({ saleKey: randomUUID(), currency: 'INR', lines: [{ stockId: s.id, quantity: '1', unitPrice: '100' }] }));
  await scoped(scope, () => sales.complete(sale.id));
  const actor = scope.userId; assert.match(actor, /^[a-f0-9-]{36}$/);
  await db.$executeRawUnsafe(`CREATE FUNCTION retail_test_fail_payment_audit() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN IF NEW."resourceType" = 'finance.payment' AND NEW."actorUserId" = '${actor}'::uuid THEN RAISE EXCEPTION 'synthetic test audit failure'; END IF; RETURN NEW; END $$`);
  await db.$executeRawUnsafe('CREATE TRIGGER retail_test_payment_audit_failure BEFORE INSERT ON "AuditLog" FOR EACH ROW EXECUTE FUNCTION retail_test_fail_payment_audit()');
  try {
    await assert.rejects(scoped(scope, () => payments.record(sale.invoiceId, { idempotencyKey: randomUUID(), amount: '100', currency: 'INR', paymentMethod: 'cash' })));
    assert.equal(await db.invoicePayment.count({ where: { invoiceId: sale.invoiceId } }), 0);
    const row = await invoice(sale.invoiceId); assert.equal(row.amountPaid.toString(), '0'); assert.equal(row.amountDue.toString(), '100'); assert.equal(row.status, 'ISSUED');
  } finally {
    await db.$executeRawUnsafe('DROP TRIGGER retail_test_payment_audit_failure ON "AuditLog"');
    await db.$executeRawUnsafe('DROP FUNCTION retail_test_fail_payment_audit()');
  }
});
test('database failure after stock change rolls back balance, valuation and movement', async () => {
  const scope = await organization(); const s = await stock('0', '10', scope);
  const actor = scope.userId; assert.match(actor, /^[a-f0-9-]{36}$/);
  await db.$executeRawUnsafe(`CREATE FUNCTION retail_test_fail_stock_audit() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN IF NEW."resourceType" = 'inventory.movement' AND NEW."actorUserId" = '${actor}'::uuid THEN RAISE EXCEPTION 'synthetic test audit failure'; END IF; RETURN NEW; END $$`);
  await db.$executeRawUnsafe('CREATE TRIGGER retail_test_stock_audit_failure BEFORE INSERT ON "AuditLog" FOR EACH ROW EXECUTE FUNCTION retail_test_fail_stock_audit()');
  const movementKey = randomUUID();
  try {
    await assert.rejects(scoped(scope, () => inventory.post({ stockId: s.id, quantity: '1', movementKey, movementType: 'RECEIPT', currency: 'INR', unitCost: '10', reason: 'Synthetic rollback' })));
    const row = await balance(s.id); assert.equal(row.quantityAvailable.toString(), '0'); assert.equal(row.inventoryValue.toString(), '0');
    assert.equal(await db.inventoryMovementHistory.count({ where: { movementKey } }), 0);
  } finally {
    await db.$executeRawUnsafe('DROP TRIGGER retail_test_stock_audit_failure ON "AuditLog"');
    await db.$executeRawUnsafe('DROP FUNCTION retail_test_fail_stock_audit()');
  }
});
test('legacy unreconciled cash is blocked rather than collected twice', async () => {
  const s = await stock('1'); const sale = await saleFor(s); await scoped(owner, () => sales.complete(sale.id));
  await db.invoicePayment.create({ data: { tenantId: owner.tenantId, invoiceId: sale.invoiceId, provider: 'manual', paymentMethod: 'cash', amount: '20', currency: 'INR', status: 'paid', reconciliationStatus: 'unreconciled' } });
  await assert.rejects(scoped(owner, () => payments.settle(sale.invoiceId, randomUUID())), errorStatus(409));
  assert.equal(await db.invoicePayment.count({ where: { invoiceId: sale.invoiceId } }), 1);
});
test('role assignments allow only the assigned resource and revoked membership is denied', async () => {
  const scope = await organization(); const s = await stock('2', '10', scope);
  const orgMember = await db.membership.findFirstOrThrow({ where: { userId: scope.userId, organizationId: scope.organizationId } });
  await db.membership.update({ where: { id: orgMember.id }, data: { title: 'Stock operator' } });
  const role = await db.role.create({ data: { tenantId: scope.tenantId, name: 'Stock operator', slug: randomUUID() } });
  const permission = await db.permission.create({ data: { tenantId: scope.tenantId, resource: 'inventory', action: 'update', scope: 'workspace', effect: 'ALLOW' } });
  await db.rolePermission.create({ data: { tenantId: scope.tenantId, roleId: role.id, permissionId: permission.id } });
  await db.roleAssignment.create({ data: { tenantId: scope.tenantId, roleId: role.id, membershipId: orgMember.id } });
  await scoped(scope, () => inventory.post({ stockId: s.id, quantity: '-1', movementKey: randomUUID(), movementType: 'ADJUSTMENT', currency: 'INR', reason: 'Authorized stock count' }));
  await assert.rejects(scoped(scope, () => sales.create({ saleKey: randomUUID(), currency: 'INR', lines: [{ stockId: s.id, quantity: '1', unitPrice: '20' }] })), errorStatus(403));
  await db.workspaceMember.updateMany({ where: { workspaceId: scope.workspaceId, userId: scope.userId }, data: { deletedAt: new Date() } });
  await assert.rejects(scoped(scope, () => inventory.post({ stockId: s.id, quantity: '-1', movementKey: randomUUID(), movementType: 'ADJUSTMENT', currency: 'INR', reason: 'Revoked stock count' })), errorStatus(403));
});
test('inventory read relations never expose another tenant or organization', async () => {
  const own = await stock('1'), foreign = await stock('1', '10', otherTenant);
  // Synthetic historical bad relationship, inserted directly as test data.
  await db.stockBalance.create({ data: { tenantId: otherTenant.tenantId, workspaceId: otherTenant.workspaceId, itemId: own.itemId, warehouseId: foreign.warehouseId, stockKey: randomUUID() } });
  const items = await scoped(owner, () => core.items());
  const item = items.find(i => i.id === own.itemId);
  assert.ok(item); assert.ok(item.stockBalances.every(b => b.tenantId === owner.tenantId && b.workspaceId === owner.workspaceId));
  await db.stockBalance.create({ data: { tenantId: owner.tenantId, workspaceId: owner.workspaceId, itemId: foreign.itemId, warehouseId: own.warehouseId, stockKey: randomUUID() } });
  const rows = await scoped(owner, () => core.stock());
  assert.ok(rows.filter(r => r.item !== null).every(r => r.item.tenantId === owner.tenantId && r.item.workspaceId === owner.workspaceId));
});
test('historical cross-tenant role assignments cannot grant retail permissions', async () => {
  const scope = await organization(); const s = await stock('1', '10', scope);
  const membership = await db.membership.findFirstOrThrow({ where: { organizationId: scope.organizationId, userId: scope.userId } });
  await db.membership.update({ where: { id: membership.id }, data: { title: 'Member' } });
  const foreignRole = await db.role.create({ data: { tenantId: otherTenant.tenantId, name: 'Foreign role', slug: randomUUID() } });
  const permission = await db.permission.create({ data: { tenantId: scope.tenantId, resource: 'inventory', action: 'update', scope: 'tenant' } });
  await db.rolePermission.create({ data: { tenantId: scope.tenantId, roleId: foreignRole.id, permissionId: permission.id } });
  await db.roleAssignment.create({ data: { tenantId: scope.tenantId, roleId: foreignRole.id, membershipId: membership.id } });
  await assert.rejects(scoped(scope, () => inventory.post({ stockId: s.id, quantity: '-1', movementKey: randomUUID(), movementType: 'ADJUSTMENT', currency: 'INR', reason: 'Foreign role attempt' })), errorStatus(403));
});
test('real JWT guard, server DTO validation and revocation protect HTTP endpoints', async () => {
  const s = await stock('2');
  const sid = randomUUID(); const pair = await tokens.issueTokenPair({ sub: owner.userId, ...owner, sessionId: sid, roles: ['Organization Owner'], permissions: ['manage'] });
  await sessions.createSession({ tenantId: owner.tenantId, userId: owner.userId, sessionId: sid, refreshToken: pair.refreshToken, device: {} });
  const send = (body, bearer = pair.accessToken) => fetch(origin + '/api/v1/retail/stock-movements', { method: 'POST', headers: { 'content-type': 'application/json', ...(bearer ? { authorization: `Bearer ${bearer}` } : {}) }, body: JSON.stringify(body) });
  const body = { stockId: s.id, quantity: '-1', movementKey: randomUUID(), movementType: 'ADJUSTMENT', reason: 'HTTP count correction', currency: 'INR' };
  assert.equal((await send(body, '')).status, 401); assert.equal((await send({ ...body, quantity: 'abc' })).status, 400); assert.equal((await send({ ...body, tenantId: otherTenant.tenantId })).status, 400);
  const response = await send(body); assert.equal(response.status, 201, await response.text()); assert.equal((await balance(s.id)).quantityAvailable.toString(), '1');
  await sessions.revokeSession(owner.tenantId, sid); assert.equal((await send({ ...body, movementKey: randomUUID() })).status, 401);
});

async function bearerFor(scope) {
  const sid = randomUUID();
  const pair = await tokens.issueTokenPair({ sub: scope.userId, ...scope, sessionId: sid, roles: ['Organization Owner'], permissions: ['manage'] });
  await sessions.createSession({ tenantId: scope.tenantId, userId: scope.userId, sessionId: sid, refreshToken: pair.refreshToken, device: {} });
  return pair.accessToken;
}
async function httpRequest(endpoint, { method = 'GET', body, bearer, headers = {} } = {}) {
  const response = await fetch(origin + '/api/v1' + endpoint, { method, headers: { 'content-type': 'application/json', ...(bearer ? { authorization: `Bearer ${bearer}` } : {}), ...headers }, ...(body ? { body: JSON.stringify(body) } : {}) });
  return { response, body: await response.json() };
}
const productInput = (overrides = {}) => ({ productKey: randomUUID(), name: 'Synthetic catalog item', sku: randomUUID(), unitPrice: '30.00', unitCost: '10.00', openingQuantity: '10', reorderPoint: '2', ...overrides });
const customerInput = (overrides = {}) => ({ customerKey: randomUUID(), name: 'Synthetic customer', email: `${randomUUID()}@example.invalid`, lifecycleStage: 'customer', ...overrides });
const query = (overrides = {}) => ({ search: '', page: 1, limit: 25, ...overrides });

test('shop starts with real zero balances and no example contacts or products', async () => {
  const scope = await organization();
  const settings = await scoped(scope, () => shop.settings());
  assert.equal(settings.workspaceId, scope.workspaceId);
  const result = await scoped(scope, () => shop.overview());
  assert.equal(result.customers, 0); assert.equal(result.products, 0); assert.equal(result.dueFollowUps, 0);
  assert.equal(result.inventoryValue, '0.00'); assert.equal(result.outstanding, '0.00');
});

test('customers persist, edit, search and paginate without crossing organizations', async () => {
  const scope = await organization(); const foreign = await organization(scope.tenantId);
  const input = customerInput({ name: 'Findable synthetic contact', lifecycleStage: 'lead' });
  const [first, duplicate] = await scoped(scope, () => Promise.all([shop.createCustomer(input), shop.createCustomer(input)]));
  assert.equal(first.id, duplicate.id);
  assert.equal(await db.crmCustomerRecord.count({ where: { tenantId: scope.tenantId, workspaceId: scope.workspaceId } }), 1);
  await assert.rejects(scoped(scope, () => shop.createCustomer({ ...input, name: 'Changed payload' })), errorStatus(409));
  const result = await scoped(scope, () => shop.customers(query({ search: 'findable', limit: 1 })));
  assert.equal(result.total, 1); assert.equal(result.items[0].id, first.id);
  const bearer = await bearerFor(scope);
  const leads = await httpRequest('/retail/shop/customers?lifecycleStage=lead', { bearer });
  assert.equal(leads.response.status, 200); assert.equal(leads.body.total, 1); assert.equal(leads.body.items[0].id, first.id);
  assert.equal((await httpRequest('/retail/shop/customers?lifecycleStage=customer', { bearer })).body.total, 0);
  assert.equal((await httpRequest('/retail/shop/customers?lifecycleStage=invalid', { bearer })).response.status, 400);
  const updated = await scoped(scope, () => shop.updateCustomer(first.id, { name: 'Updated contact', lifecycleStage: 'customer' }));
  assert.equal(updated.lifecycleStage, 'customer');
  assert.equal((await httpRequest('/retail/shop/customers?lifecycleStage=lead', { bearer })).body.total, 0);
  assert.equal((await httpRequest('/retail/shop/customers?lifecycleStage=customer', { bearer })).body.total, 1);
  assert.equal((await scoped(foreign, () => shop.customers(query()))).total, 0);
  await assert.rejects(scoped(foreign, () => shop.updateCustomer(first.id, { name: 'Forged', lifecycleStage: 'customer' })), errorStatus(404));
  const next = await scoped(scope, () => shop.customers(query({ page: 2, limit: 1 })));
  assert.equal(next.total, 1); assert.equal(next.items.length, 0);
});

test('follow-ups persist due dates, survive retries, complete and reject foreign customer links', async () => {
  const scope = await organization(); const foreign = await organization();
  const customer = await scoped(scope, () => shop.createCustomer(customerInput()));
  const command = { followUpKey: randomUUID(), customerId: customer.id, title: 'Synthetic reminder', priority: 'HIGH', dueAt: '2020-01-01T12:00:00Z' };
  const first = await scoped(scope, () => shop.createFollowUp(command));
  const again = await scoped(scope, () => shop.createFollowUp(command)); assert.equal(first.id, again.id);
  const listed = await scoped(scope, () => shop.followUps(query())); assert.equal(listed.items[0].customerName, customer.name);
  assert.equal((await scoped(scope, () => shop.overview())).dueFollowUps, 1);
  await scoped(scope, () => shop.updateFollowUp(first.id, 'DONE'));
  assert.equal((await scoped(scope, () => shop.overview())).dueFollowUps, 0);
  await assert.rejects(scoped(foreign, () => shop.createFollowUp({ ...command, followUpKey: randomUUID() })), errorStatus(404));
  await assert.rejects(scoped(foreign, () => shop.updateFollowUp(first.id, 'DONE')), errorStatus(404));
  assert.equal((await scoped(foreign, () => shop.followUps(query()))).items.length, 0);
});

test('shop product creation posts exact opening value once and enforces currency stability', async () => {
  const scope = await organization(); const input = productInput();
  const [first, retry] = await scoped(scope, () => Promise.all([shop.createProduct(input), shop.createProduct(input)]));
  assert.equal(first.id, retry.id);
  const stock = await balance(first.id); assert.equal(stock.quantityAvailable.toString(), '10'); assert.equal(stock.inventoryValue.toString(), '100');
  assert.equal(await db.inventoryMovementHistory.count({ where: { stockId: first.id } }), 1);
  const products = await scoped(scope, () => shop.products(query({ search: input.sku })));
  assert.equal(products.total, 1); assert.equal(products.items[0].unitPrice, '30.00');
  await scoped(scope, () => shop.updateProduct(first.id, { name: 'Updated product', unitPrice: '35.50', reorderPoint: '4' }));
  const updated = await scoped(scope, () => shop.products(query({ search: input.sku })));
  assert.equal(updated.items[0].name, 'Updated product'); assert.equal(updated.items[0].unitPrice, '35.50'); assert.equal(updated.items[0].reorderPoint, '4');
  assert.equal((await balance(first.id)).inventoryValue.toString(), '100');
  await assert.rejects(scoped(scope, () => shop.createProduct(productInput({ sku: input.sku }))), errorStatus(409));
  await assert.rejects(scoped(scope, () => shop.createProduct({ ...input, unitPrice: '31.00' })), errorStatus(409));
  await assert.rejects(scoped(scope, () => shop.configure({ name: 'Synthetic shop', currency: 'USD' })), errorStatus(409));
  const foreign = await organization(scope.tenantId);
  assert.equal((await scoped(foreign, () => shop.products(query()))).total, 0);
  await assert.rejects(scoped(foreign, () => shop.movements(first.id, query())), errorStatus(404));
  await assert.rejects(scoped(foreign, () => shop.updateProduct(first.id, { name: 'Forged', unitPrice: '1', reorderPoint: '0' })), errorStatus(404));
});

test('product, opening stock and catalog records roll back if final audit persistence fails', async () => {
  const scope = await organization(); const input = productInput();
  await db.$executeRawUnsafe(`CREATE FUNCTION shop_test_product_failure() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN IF NEW."resourceType" = 'retail.product' AND NEW."actorUserId" = '${scope.userId}'::uuid THEN RAISE EXCEPTION 'synthetic product audit failure'; END IF; RETURN NEW; END $$`);
  await db.$executeRawUnsafe('CREATE TRIGGER shop_test_product_failure BEFORE INSERT ON "AuditLog" FOR EACH ROW EXECUTE FUNCTION shop_test_product_failure()');
  try {
    await assert.rejects(scoped(scope, () => shop.createProduct(input)));
    assert.equal(await db.supplyChainItem.count({ where: { tenantId: scope.tenantId } }), 0);
    assert.equal(await db.stockBalance.count({ where: { tenantId: scope.tenantId } }), 0);
    assert.equal(await db.warehouse.count({ where: { tenantId: scope.tenantId } }), 0);
    assert.equal(await db.inventoryMovementHistory.count({ where: { tenantId: scope.tenantId } }), 0);
  } finally { await db.$executeRawUnsafe('DROP TRIGGER shop_test_product_failure ON "AuditLog"'); await db.$executeRawUnsafe('DROP FUNCTION shop_test_product_failure()'); }
});

test('customer-linked sale, partial payment, return, expense and P&L reconcile to known exact values', async () => {
  const scope = await organization();
  const customer = await scoped(scope, () => shop.createCustomer(customerInput()));
  const item = await scoped(scope, () => shop.createProduct(productInput()));
  const sale = await scoped(scope, () => sales.create({ saleKey: randomUUID(), currency: 'INR', customerId: customer.id, lines: [{ stockId: item.id, quantity: '3', unitPrice: '30.00' }] }));
  assert.equal((await invoice(sale.invoiceId)).customerId, customer.id);
  await scoped(scope, () => sales.complete(sale.id));
  await scoped(scope, () => payments.record(sale.invoiceId, { idempotencyKey: randomUUID(), amount: '50.00', currency: 'INR', paymentMethod: 'cash' }));
  const expense = { expenseKey: randomUUID(), category: 'Delivery', vendor: 'Synthetic vendor', amount: '10.10', incurredAt: new Date().toISOString() };
  const [first, retry] = await scoped(scope, () => Promise.all([shop.createExpense(expense), shop.createExpense(expense)])); assert.equal(first.id, retry.id);
  await scoped(scope, () => sales.returnItems(sale.id, { returnKey: randomUUID(), reason: 'Synthetic return', lines: [{ lineId: sale.lines[0].id, quantity: '1' }] }));
  const report = await scoped(scope, () => reports.summary('INR', '2000-01-01T00:00:00Z', '2100-01-01T00:00:00Z'));
  assert.equal(report.sales, '90.00'); assert.equal(report.returns, '30.00'); assert.equal(report.recognizedRevenue, '60.00');
  assert.equal(report.costOfGoodsSold, '20.00'); assert.equal(report.grossProfit, '40.00'); assert.equal(report.operatingExpenses, '10.10'); assert.equal(report.netProfit, '29.90');
  assert.equal(report.cashReceived, '50.00'); assert.equal(report.cashRefunded, '0.00'); assert.equal(report.netCustomerCash, '50.00');
  assert.equal(report.dailyRevenue.length, 1); assert.equal(report.dailyRevenue[0].amount, '60.00');
  assert.equal(report.dailyMetrics.length, 1); assert.deepEqual(report.dailyMetrics[0], { date: report.dailyRevenue[0].date, recognizedRevenue: '60.00', costOfGoodsSold: '20.00', operatingExpenses: '10.10', grossProfit: '40.00', netProfit: '29.90' });
  const overview = await scoped(scope, () => shop.overview()); assert.equal(overview.outstanding, '10.00'); assert.equal(overview.inventoryValue, '80.00');
  const listed = await scoped(scope, () => sales.list()); assert.equal(listed[0].invoice.metadata.customerName, customer.name);
  await scoped(scope, () => shop.updateProduct(item.id, { name: 'Price changed after sale', unitPrice: '99.00', reorderPoint: '0' }));
  const recorded = await db.retailSaleLine.findUniqueOrThrow({ where: { id: sale.lines[0].id } }); assert.equal(recorded.unitPrice.toString(), '30');
  const foreign = await organization(scope.tenantId);
  await assert.rejects(scoped(foreign, () => sales.create({ saleKey: randomUUID(), currency: 'INR', customerId: customer.id, lines: [{ stockId: item.id, quantity: '1', unitPrice: '30' }] })), errorStatus(404));
});

test('zero and three decimal currencies are respected by shop products and expenses', async () => {
  const jpy = await organization(); await scoped(jpy, () => shop.configure({ name: 'Synthetic JPY shop', currency: 'JPY' }));
  await assert.rejects(scoped(jpy, () => shop.createProduct(productInput({ unitPrice: '1.01' }))), errorStatus(400));
  const kwd = await organization(); await scoped(kwd, () => shop.configure({ name: 'Synthetic KWD shop', currency: 'KWD' }));
  await scoped(kwd, () => shop.createProduct(productInput({ unitPrice: '1.234', unitCost: '0.111', openingQuantity: '3' })));
  const expense = await scoped(kwd, () => shop.createExpense({ expenseKey: randomUUID(), category: 'Synthetic', vendor: 'Synthetic', amount: '0.123', incurredAt: new Date().toISOString() }));
  assert.equal(expense.amount.toString(), '0.123');
  assert.equal((await scoped(kwd, () => shop.overview())).inventoryValue, '0.333');
});

test('shop HTTP endpoints enforce JWT, DTO validation, ownership and current membership', async () => {
  const scope = await organization(); const foreign = await organization(scope.tenantId);
  const bearer = await bearerFor(scope); const otherBearer = await bearerFor(foreign);
  assert.equal((await httpRequest('/retail/shop/customers')).response.status, 401);
  assert.equal((await httpRequest('/retail/shop/customers', { method: 'POST', bearer, body: { ...customerInput(), tenantId: foreign.tenantId } })).response.status, 400);
  const created = await httpRequest('/retail/shop/customers', { method: 'POST', bearer, body: customerInput() }); assert.equal(created.response.status, 201);
  assert.equal((await httpRequest('/retail/shop/follow-ups', { method: 'POST', bearer: otherBearer, body: { followUpKey: randomUUID(), customerId: created.body.id, title: 'Forged', dueAt: new Date().toISOString(), priority: 'HIGH' } })).response.status, 404);
  assert.equal((await httpRequest('/retail/shop/customers?limit=101', { bearer })).response.status, 400);
  assert.equal((await httpRequest('/retail/shop/customers?limit=-1', { bearer })).response.status, 400);
  assert.equal((await httpRequest('/retail/shop/customers?tenantId=' + foreign.tenantId, { bearer })).response.status, 400);
  const forged = await httpRequest('/retail/shop/settings', { bearer, headers: { 'x-tenant-id': foreign.tenantId, 'x-workspace-id': foreign.workspaceId } });
  assert.ok([200,403].includes(forged.response.status)); if(forged.response.status === 200) assert.equal(forged.body.workspaceId, scope.workspaceId);
  await db.membership.updateMany({ where: { tenantId: scope.tenantId, userId: scope.userId }, data: { deletedAt: new Date() } });
  assert.equal((await httpRequest('/retail/shop/customers', { bearer })).response.status, 403);
});

test('password signup, scoped login, logout and two separate businesses work through HTTP', async () => {
  const email = `${randomUUID()}@example.invalid`; const password = `Synthetic-${randomUUID()}!`;
  const signup = await httpRequest('/auth/signup', { method: 'POST', body: { name: 'Synthetic owner', companyName: 'Synthetic first shop', email, password } });
  assert.equal(signup.response.status, 201);
  const auth = signup.body; assert.ok(auth.user.tenantId); assert.ok(auth.user.organizationId); assert.ok(auth.user.workspaceId);
  const settings = await httpRequest('/retail/shop/settings', { bearer: auth.session.accessToken }); assert.equal(settings.response.status, 200); assert.equal(settings.body.currency, null);
  assert.equal((await httpRequest('/retail/shop/settings', { method: 'PATCH', bearer: auth.session.accessToken, body: { name: 'Synthetic configured shop', currency: 'INR' } })).response.status, 200);
  const login = await httpRequest('/auth/login', { method: 'POST', body: { email, password } }); assert.equal(login.response.status, 201);
  const second = await httpRequest('/auth/signup', { method: 'POST', body: { name: 'Synthetic second owner', companyName: 'Synthetic second shop', email, password } }); assert.equal(second.response.status, 201);
  assert.notEqual(second.body.user.tenantId, auth.user.tenantId);
  const ambiguous = await httpRequest('/auth/login', { method: 'POST', body: { email, password } }); assert.equal(ambiguous.response.status, 401);
  const explicit = await httpRequest('/auth/login', { method: 'POST', body: { tenantId: auth.user.tenantId, email: email.toUpperCase(), password } }); assert.equal(explicit.response.status, 201); assert.equal(explicit.body.user.tenantId, auth.user.tenantId);
  const otherSettings = await httpRequest('/retail/shop/settings', { bearer: second.body.session.accessToken }); assert.equal(otherSettings.body.currency, null);
  assert.equal((await httpRequest('/auth/login', { method: 'POST', body: { tenantId: auth.user.tenantId, email, password: 'Synthetic wrong password' } })).response.status, 401);
  assert.equal((await httpRequest('/auth/logout', { method: 'POST', bearer: explicit.body.session.accessToken })).response.status, 201);
  assert.equal((await httpRequest('/retail/shop/settings', { bearer: explicit.body.session.accessToken })).response.status, 401);
});

test('sales pagination reaches records beyond the first 100 and scopes search to the current shop', async () => {
  const scope = await organization(); const foreign = await organization();
  const customer = await scoped(scope, () => shop.createCustomer(customerInput({ name: `Archive Buyer ${randomUUID()}` })));
  const product = await scoped(scope, () => shop.createProduct(productInput()));
  const archivedKey = `archive-${randomUUID()}`;
  const create = saleKey => scoped(scope, () => sales.create({ saleKey, currency: 'INR', ...(saleKey === archivedKey ? { customerId: customer.id } : {}), lines: [{ stockId: product.id, quantity: '1', unitPrice: '30.00' }] }));
  const archived = await create(archivedKey);
  for (let index = 0; index < 101; index++) await create(randomUUID());
  const bearer = await bearerFor(scope);
  const first = await httpRequest('/retail/shop/sales?limit=100&page=1', { bearer });
  const second = await httpRequest('/retail/shop/sales?limit=100&page=2', { bearer });
  assert.equal(first.response.status, 200); assert.equal(second.response.status, 200);
  assert.equal(first.body.total, 102); assert.equal(first.body.items.length, 100); assert.equal(second.body.items.length, 2);
  assert.equal(new Set([...first.body.items, ...second.body.items].map(item => item.id)).size, 102);
  assert.ok(second.body.items.some(item => item.id === archived.id));
  const byReference = await httpRequest('/retail/shop/sales?search=' + archivedKey, { bearer });
  assert.equal(byReference.body.total, 1); assert.equal(byReference.body.items[0].id, archived.id);
  const byCustomer = await httpRequest('/retail/shop/sales?search=' + encodeURIComponent(customer.name.toUpperCase()), { bearer });
  assert.equal(byCustomer.body.total, 1); assert.equal(byCustomer.body.items[0].id, archived.id);
  assert.equal((await httpRequest('/retail/shop/sales?search=draft', { bearer })).body.total, 102);
  assert.equal((await httpRequest('/retail/shop/sales', { bearer: await bearerFor(foreign) })).body.total, 0);
  assert.equal((await httpRequest('/retail/shop/sales?limit=101', { bearer })).response.status, 400);
  assert.equal((await httpRequest('/retail/shop/sales?page=1000001', { bearer })).response.status, 400);
});

test('workspace preferences persist independently, preserve business settings and reject unauthorized or stale writes', async () => {
  const scope = await organization(); const foreign = await organization(scope.tenantId);
  const bearer = await bearerFor(scope);
  const initial = await httpRequest('/retail/shop/settings', { bearer });
  assert.equal(initial.body.preferences.version, 0); assert.ok(initial.body.preferences.modules.includes('inventory'));
  const input = { expectedVersion: 0, modules: ['crm', 'finance'], widgets: ['revenue', 'customers'] };
  const saved = await httpRequest('/retail/shop/preferences', { method: 'PATCH', bearer, body: input });
  assert.equal(saved.response.status, 200); assert.equal(saved.body.version, 1);
  const loaded = await httpRequest('/retail/shop/settings', { bearer });
  assert.deepEqual(loaded.body.preferences, { version: 1, modules: input.modules, widgets: input.widgets });
  assert.equal(loaded.body.currency, initial.body.currency);
  await scoped(scope, () => shop.configure({ name: 'Renamed configured shop', currency: initial.body.currency }));
  assert.deepEqual((await scoped(scope, () => shop.settings())).preferences, loaded.body.preferences);
  const other = await httpRequest('/retail/shop/settings', { bearer: await bearerFor(foreign) });
  assert.equal(other.body.preferences.version, 0); assert.ok(other.body.preferences.modules.includes('sales'));
  assert.equal((await httpRequest('/retail/shop/preferences', { method: 'PATCH', bearer, body: input })).response.status, 409);
  assert.equal((await httpRequest('/retail/shop/preferences', { method: 'PATCH', bearer, body: { ...input, expectedVersion: 1, modules: ['crm', 'crm'] } })).response.status, 400);
  assert.equal((await httpRequest('/retail/shop/preferences', { method: 'PATCH', bearer, body: { ...input, expectedVersion: 1, widgets: ['run-any-action'] } })).response.status, 400);
  assert.equal((await httpRequest('/retail/shop/preferences', { method: 'PATCH', bearer, body: { ...input, expectedVersion: 1, tenantId: foreign.tenantId } })).response.status, 400);
  const denied = await organization();
  await db.membership.updateMany({ where: { tenantId: denied.tenantId, userId: denied.userId }, data: { title: 'Viewer' } });
  assert.equal((await httpRequest('/retail/shop/preferences', { method: 'PATCH', bearer: await bearerFor(denied), body: input })).response.status, 403);
  assert.equal(await db.auditLog.count({ where: { resourceType: 'retail.preferences', resourceId: scope.workspaceId } }), 1);
});

test('concurrent preference saves cannot overwrite each other and audit failures roll back metadata', async () => {
  const scope = await organization(); const bearer = await bearerFor(scope);
  const responses = await Promise.all([['crm'], ['finance']].map(modules => httpRequest('/retail/shop/preferences', { method: 'PATCH', bearer, body: { expectedVersion: 0, modules, widgets: [] } })));
  assert.deepEqual(responses.map(result => result.response.status).sort(), [200, 409]);
  const saved = responses.find(result => result.response.status === 200).body;
  assert.deepEqual((await scoped(scope, () => shop.settings())).preferences, saved);
  await db.$executeRawUnsafe(`CREATE FUNCTION shop_preferences_failure() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN IF NEW."resourceType" = 'retail.preferences' AND NEW."actorUserId" = '${scope.userId}'::uuid THEN RAISE EXCEPTION 'synthetic preferences audit failure'; END IF; RETURN NEW; END $$`);
  await db.$executeRawUnsafe('CREATE TRIGGER shop_preferences_failure BEFORE INSERT ON "AuditLog" FOR EACH ROW EXECUTE FUNCTION shop_preferences_failure()');
  try {
    const failed = await httpRequest('/retail/shop/preferences', { method: 'PATCH', bearer, body: { expectedVersion: 1, modules: [], widgets: [] } });
    assert.equal(failed.response.status, 500);
    assert.deepEqual((await scoped(scope, () => shop.settings())).preferences, saved);
    assert.equal(await db.auditLog.count({ where: { resourceType: 'retail.preferences', resourceId: scope.workspaceId } }), 1);
  } finally { await db.$executeRawUnsafe('DROP TRIGGER shop_preferences_failure ON "AuditLog"'); await db.$executeRawUnsafe('DROP FUNCTION shop_preferences_failure()'); }
});

test('signup account provisioning rolls back every record when membership insertion fails', async () => {
  const companyName = `Synthetic rollback ${randomUUID()}`;
  const email = `${randomUUID()}@example.invalid`;
  await db.$executeRawUnsafe(`CREATE FUNCTION shop_signup_rollback_failure() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN IF EXISTS(SELECT 1 FROM "User" WHERE id = NEW."userId" AND email = '${email}') THEN RAISE EXCEPTION 'synthetic signup membership failure'; END IF; RETURN NEW; END $$`);
  await db.$executeRawUnsafe('CREATE TRIGGER shop_signup_rollback_failure BEFORE INSERT ON "WorkspaceMember" FOR EACH ROW EXECUTE FUNCTION shop_signup_rollback_failure()');
  try {
    await assert.rejects(shopAuth.signup({ name: 'Synthetic', email, companyName, password: `Synthetic-${randomUUID()}!` }));
    assert.equal(await db.tenant.count({ where: { name: companyName } }), 0);
    assert.equal(await db.organization.count({ where: { name: companyName } }), 0);
    assert.equal(await db.workspace.count({ where: { name: companyName } }), 0);
    assert.equal(await db.user.count({ where: { email } }), 0);
    assert.equal(await db.credential.count({ where: { user: { email } } }), 0);
  } finally { await db.$executeRawUnsafe('DROP TRIGGER shop_signup_rollback_failure ON "WorkspaceMember"'); await db.$executeRawUnsafe('DROP FUNCTION shop_signup_rollback_failure()'); }
});

test('cookie sessions hide refresh credentials, rotate once, reject foreign origins and revoke on logout', async () => {
  const created = await httpRequest('/auth/signup', { method: 'POST', body: { name: 'Cookie QA', companyName: `Cookie QA ${randomUUID()}`, email: `${randomUUID()}@example.invalid`, password: `Synthetic-${randomUUID()}!`, sessionTransport: 'cookie' } });
  assert.equal(created.response.status, 201);
  assert.equal(created.body.session.refreshToken, undefined);
  const cookie = created.response.headers.get('set-cookie');
  assert.match(cookie, /HttpOnly/i); assert.match(cookie, /SameSite=Lax/i); assert.match(cookie, /Path=\/api\/v1\/auth/i);
  const cookieHeader = cookie.split(';')[0];
  const foreign = await httpRequest('/auth/refresh', { method: 'POST', headers: { cookie: cookieHeader, origin: 'https://foreign.example.invalid' }, body: { sessionTransport: 'cookie' } });
  assert.equal(foreign.response.status, 401);
  const responses = await Promise.all([1, 2].map(() => httpRequest('/auth/refresh', { method: 'POST', headers: { cookie: cookieHeader, origin }, body: { sessionTransport: 'cookie' } })));
  assert.deepEqual(responses.map(r => r.response.status).sort(), [201, 401]);
  const refreshed = responses.find(r => r.response.status === 201);
  assert.equal(refreshed.body.session.id, created.body.session.id);
  assert.equal(refreshed.body.session.refreshToken, undefined);
  const nextCookie = refreshed.response.headers.get('set-cookie').split(';')[0];
  assert.notEqual(nextCookie, cookieHeader);
  assert.equal((await httpRequest('/auth/refresh', { method: 'POST', headers: { cookie: cookieHeader }, body: { sessionTransport: 'cookie' } })).response.status, 401);
  const logout = await httpRequest('/auth/logout', { method: 'POST', bearer: refreshed.body.session.accessToken });
  assert.equal(logout.response.status, 201); assert.match(logout.response.headers.get('set-cookie'), /Expires=/i);
  assert.equal((await httpRequest('/auth/refresh', { method: 'POST', headers: { cookie: nextCookie }, body: { sessionTransport: 'cookie' } })).response.status, 401);
});

test('dashboard summary isolates recent leads, stock priorities, overdue invoices and sanitized activity', async () => {
  const scope = await organization(), foreign = await organization(scope.tenantId);
  const lead = await scoped(scope, () => shop.createCustomer({ ...customerInput(), name: 'Dashboard lead', lifecycleStage: 'lead' }));
  await scoped(foreign, () => shop.createCustomer({ ...customerInput(), name: 'Foreign lead', lifecycleStage: 'lead' }));
  const item = await scoped(scope, () => shop.createProduct({ ...productInput(), openingQuantity: '1', reorderPoint: '2' }));
  const sale = await scoped(scope, () => sales.create({ saleKey: randomUUID(), currency: 'INR', customerId: lead.id, lines: [{ stockId: item.id, quantity: '1', unitPrice: '30.00' }] }));
  await scoped(scope, () => sales.complete(sale.id));
  await db.invoice.update({ where: { id: sale.invoiceId }, data: { dueAt: new Date('2001-01-01T00:00:00Z') } });
  const result = await scoped(scope, () => shop.overview());
  assert.equal(result.products, 1); assert.equal(result.lowStock, 1); assert.equal(result.outOfStock, 1);
  assert.equal(result.overdueInvoices, 1); assert.equal(result.overdueAmount, '30.00');
  assert.deepEqual(result.recentLeads.map(row => row.id), [lead.id]);
  assert.equal(result.lowStockItems[0].id, item.id); assert.equal(result.lowStockItems[0].quantity, '0');
  assert.ok(result.activity.length > 0); assert.ok(result.activity.every(row => row.actor === 'Test owner'));
  assert.ok(result.activity.every(row => Object.keys(row).sort().join(',') === 'actor,at,id,recordId,type'));
  const other = await scoped(foreign, () => shop.overview());
  assert.equal(other.overdueInvoices, 0); assert.equal(other.products, 0);
  const eventIds = new Set(other.activity.map(row => row.id)); assert.ok(result.activity.every(row => !eventIds.has(row.id)));
  assert.ok(!JSON.stringify(result).includes('Foreign lead'));
});

test('dashboard settings expose persisted capabilities without granting viewer financial access', async () => {
  const settings = await scoped(viewer, () => shop.settings());
  for (const name of ['crm','sales','inventory','finance','settings','owner','crmCreate','crmUpdate','inventoryCreate','inventoryUpdate','salesCreate','salesUpdate','financeCreate','financeUpdate','financeApprove']) assert.equal(settings.capabilities[name],false,name);
  await assert.rejects(scoped(viewer, () => shop.overview()), errorStatus(403));
  await assert.rejects(scoped(viewer, () => reports.summary('INR', '2026-01-01', '2027-01-01')), errorStatus(403));
  const authorized = await scoped(owner, () => shop.settings()); assert.ok(Object.values(authorized.capabilities).every(Boolean));
  await assert.rejects(scoped({ ...viewer, workspaceId: otherOrganization.workspaceId }, () => shop.settings()), errorStatus(403));
});

test('daily profit metrics preserve expense-only dates and cross-period sale returns', async () => {
  const scope = await organization();
  const item = await scoped(scope, () => shop.createProduct(productInput()));
  const sale = await scoped(scope, () => sales.create({ saleKey: randomUUID(), currency: 'INR', lines: [{ stockId: item.id, quantity: '2', unitPrice: '30.00' }] }));
  await scoped(scope, () => sales.complete(sale.id));
  await db.retailSale.update({ where: { id: sale.id }, data: { completedAt: new Date('2026-08-31T23:59:59Z') } });
  const returned = await scoped(scope, () => sales.returnItems(sale.id, { returnKey: randomUUID(), reason: 'Isolated chart test', lines: [{ lineId: sale.lines[0].id, quantity: '1' }] }));
  await db.retailReturn.update({ where: { id: returned.id }, data: { createdAt: new Date('2026-09-01T00:00:00Z') } });
  await scoped(scope, () => shop.createExpense({ expenseKey: randomUUID(), category: 'Delivery', vendor: 'Isolated chart test', amount: '6.20', incurredAt: '2026-09-02T12:00:00Z' }));
  const report = await scoped(scope, () => reports.summary('INR', '2026-09-01', '2026-10-01'));
  assert.equal(report.recognizedRevenue, '-30.00'); assert.equal(report.costOfGoodsSold, '-10.00'); assert.equal(report.netProfit, '-26.20');
  assert.deepEqual(report.dailyMetrics, [{ date: '2026-09-01', recognizedRevenue: '-30.00', costOfGoodsSold: '-10.00', operatingExpenses: '0.00', grossProfit: '-20.00', netProfit: '-20.00' }, { date: '2026-09-02', recognizedRevenue: '0.00', costOfGoodsSold: '0.00', operatingExpenses: '6.20', grossProfit: '0.00', netProfit: '-6.20' }]);
});

test('signup retry key provisions one private account and rejects changed credentials', async () => {
  const input = { requestKey: randomUUID(), name: 'Signup retry QA', email: `${randomUUID()}@example.invalid`, password: `Synthetic-${randomUUID()}!`, sessionTransport: 'cookie' };
  const responses = await Promise.all([1,2].map(() => httpRequest('/auth/signup', { method:'POST', body:input })));
  assert.deepEqual(responses.map(row => row.response.status), [201,201]);
  assert.equal(responses[0].body.user.id, responses[1].body.user.id);
  assert.equal(responses[0].body.session.workspaceId, responses[1].body.session.workspaceId);
  assert.equal(await db.user.count({where:{email:input.email}}),1);
  assert.equal(await db.workspaceMember.count({where:{userId:responses[0].body.user.id}}),1);
  const changed = await httpRequest('/auth/signup', { method:'POST', body:{...input,password:`Different-${randomUUID()}!`} });
  assert.equal(changed.response.status,409);
});

test('business setup persists profile and chosen modules atomically with validation and tenant isolation', async () => {
  const scope=await organization(), foreign=await organization(scope.tenantId), bearer=await bearerFor(scope);
  assert.equal((await httpRequest('/retail/shop/settings',{bearer})).body.setupComplete,false);
  const input={name:'User chosen workspace',businessName:`Chosen business ${randomUUID()}`,category:'User chosen category',countryCode:'IN',timeZone:'Asia/Kolkata',currency:'INR',expectedVersion:0,modules:['crm','inventory','finance'],widgets:['stock','financials']};
  assert.equal((await httpRequest('/retail/shop/setup',{method:'POST',bearer,body:{...input,timeZone:'Not/AZone'}})).response.status,400);
  assert.equal((await httpRequest('/retail/shop/setup',{method:'POST',bearer,body:{...input,tenantId:foreign.tenantId}})).response.status,400);
  assert.equal((await httpRequest('/retail/shop/setup',{method:'POST',bearer,body:input})).response.status,201);
  const saved=(await httpRequest('/retail/shop/settings',{bearer})).body;
  assert.equal(saved.setupComplete,true); assert.equal(saved.organizationName,input.businessName); assert.equal(saved.name,input.name);
  assert.deepEqual(saved.profile,{businessName:input.businessName,category:input.category,countryCode:'IN',timeZone:'Asia/Kolkata'});
  assert.deepEqual(saved.preferences.modules,input.modules); assert.deepEqual(saved.preferences.widgets,input.widgets);
  assert.equal((await scoped(foreign,()=>shop.settings())).setupComplete,false);
  assert.equal((await httpRequest('/retail/shop/setup',{method:'POST',bearer,body:{...input,businessName:'Stale write'}})).response.status,409);
  assert.equal((await scoped(scope,()=>shop.settings())).organizationName,input.businessName);
});

test('context creation and switching verify membership, revoke the previous session and retain scope on refresh', async () => {
  const scope=await organization(), other=await organization(scope.tenantId); let bearer=await bearerFor(scope);
  const input={requestKey:randomUUID(),kind:'business',name:`Second business ${randomUUID()}`};
  const created=await httpRequest('/auth/contexts',{method:'POST',bearer,body:input}); assert.equal(created.response.status,201);
  const retried=await httpRequest('/auth/contexts',{method:'POST',bearer,body:input}); assert.equal(retried.body.workspaceId,created.body.workspaceId);
  assert.equal((await httpRequest('/auth/contexts',{method:'POST',bearer,body:{...input,name:'Different request'}})).response.status,409);
  const list=await httpRequest('/auth/contexts',{bearer}); assert.equal(list.body.length,2); assert.ok(!list.body.some(row=>row.workspaceId===other.workspaceId));
  assert.equal((await httpRequest('/auth/contexts',{method:'POST',bearer:await bearerFor(viewer),body:{requestKey:randomUUID(),kind:'workspace',name:'Denied'}})).response.status,403);
  assert.equal((await httpRequest('/auth/switch-context',{method:'POST',bearer,body:{workspaceId:other.workspaceId,sessionTransport:'cookie'}})).response.status,403);
  assert.equal((await httpRequest('/retail/shop/settings',{bearer})).response.status,200);
  const switched=await httpRequest('/auth/switch-context',{method:'POST',bearer,body:{workspaceId:created.body.workspaceId,sessionTransport:'cookie'}});
  assert.equal(switched.response.status,201); assert.equal(switched.body.session.refreshToken,undefined);
  assert.equal(switched.body.session.organizationId,created.body.organizationId);
  assert.equal((await httpRequest('/retail/shop/settings',{bearer})).response.status,401);
  bearer=switched.body.session.accessToken;
  const empty=(await httpRequest('/retail/shop/settings',{bearer})).body; assert.equal(empty.currency,null); assert.equal(empty.setupComplete,false);
  const refreshed=await httpRequest('/auth/refresh',{method:'POST',headers:{cookie:switched.response.headers.get('set-cookie').split(';')[0]},body:{sessionTransport:'cookie'}});
  assert.equal(refreshed.response.status,201); assert.equal(refreshed.body.session.workspaceId,created.body.workspaceId);
  assert.equal((await httpRequest('/retail/shop/customers',{bearer:refreshed.body.session.accessToken})).body.total,0);
  assert.equal((await httpRequest('/retail/shop/customers',{bearer:refreshed.body.session.accessToken,headers:{'x-workspace-id':scope.workspaceId}})).response.status,403);
});

test('context switch audit failure rolls back new session and old session revocation', async () => {
  const scope=await organization(), bearer=await bearerFor(scope);
  const created=await httpRequest('/auth/contexts',{method:'POST',bearer,body:{requestKey:randomUUID(),kind:'workspace',name:'Rollback workspace'}});
  assert.equal(created.response.status,201);
  await db.$executeRawUnsafe(`CREATE FUNCTION context_switch_failure() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN IF NEW."resourceType" = 'auth.context' AND NEW."action" = 'UPDATE' AND NEW."actorUserId" = '${scope.userId}'::uuid THEN RAISE EXCEPTION 'synthetic context failure'; END IF; RETURN NEW; END $$`);
  await db.$executeRawUnsafe('CREATE TRIGGER context_switch_failure BEFORE INSERT ON "AuditLog" FOR EACH ROW EXECUTE FUNCTION context_switch_failure()');
  try {
    assert.equal((await httpRequest('/auth/switch-context',{method:'POST',bearer,body:{workspaceId:created.body.workspaceId}})).response.status,500);
    assert.equal((await httpRequest('/retail/shop/settings',{bearer})).response.status,200);
    assert.equal(await db.session.count({where:{tenantId:scope.tenantId,userId:scope.userId,status:'ACTIVE'}}),1);
  } finally {await db.$executeRawUnsafe('DROP TRIGGER context_switch_failure ON "AuditLog"');await db.$executeRawUnsafe('DROP FUNCTION context_switch_failure()');}
});

test('password changes bind the authenticated user and revoke every session atomically', async () => {
  const email=`${randomUUID()}@example.invalid`, password=`Synthetic-${randomUUID()}!`, newPassword=`Changed-${randomUUID()}!`;
  const signup=await httpRequest('/auth/signup',{method:'POST',body:{email,password,name:'Security QA',sessionTransport:'cookie'}}); assert.equal(signup.response.status,201);
  const {user,session}=signup.body;
  const second=await httpRequest('/auth/login',{method:'POST',body:{email,password}}); assert.equal(second.response.status,201);
  const input={tenantId:user.tenantId,userId:user.id,currentPassword:password,newPassword};
  assert.equal((await httpRequest('/auth/password/change',{method:'POST',bearer:session.accessToken,body:{...input,userId:owner.userId,tenantId:owner.tenantId}})).response.status,403);
  assert.equal((await httpRequest('/auth/password/change',{method:'POST',bearer:session.accessToken,body:{...input,currentPassword:'Wrong password'}})).response.status,401);
  assert.equal((await httpRequest('/retail/shop/settings',{bearer:session.accessToken})).response.status,200);
  const changed=await httpRequest('/auth/password/change',{method:'POST',bearer:session.accessToken,body:input}); assert.equal(changed.response.status,201);
  assert.match(changed.response.headers.get('set-cookie'),/Expires=/i);
  assert.equal((await httpRequest('/retail/shop/settings',{bearer:session.accessToken})).response.status,401);
  assert.equal((await httpRequest('/retail/shop/settings',{bearer:second.body.session.accessToken})).response.status,401);
  assert.equal((await httpRequest('/auth/login',{method:'POST',body:{email,password}})).response.status,401);
  assert.equal((await httpRequest('/auth/login',{method:'POST',body:{email,password:newPassword}})).response.status,201);
});

test('suspended accounts cannot login, refresh or use an existing access token', async () => {
  const email=`${randomUUID()}@example.invalid`, password=`Synthetic-${randomUUID()}!`;
  const signup=await httpRequest('/auth/signup',{method:'POST',body:{email,password,name:'Suspended QA',sessionTransport:'cookie'}});
  await db.user.update({where:{id:signup.body.user.id},data:{status:'SUSPENDED'}});
  assert.equal((await httpRequest('/auth/login',{method:'POST',body:{email,password}})).response.status,401);
  assert.equal((await httpRequest('/retail/shop/settings',{bearer:signup.body.session.accessToken})).response.status,401);
  assert.equal((await httpRequest('/auth/refresh',{method:'POST',headers:{cookie:signup.response.headers.get('set-cookie').split(';')[0]},body:{sessionTransport:'cookie'}})).response.status,401);
});

test('unconnected email providers do not falsely report delivery', async () => {
  const {EmailService}=require('../apps/api/dist/modules/email/email.service.js');
  const providers=[['resend','ResendEmailProvider'],['sendgrid','SendGridEmailProvider'],['smtp','SmtpEmailProvider']].map(([file,name])=>new (require(`../apps/api/dist/modules/email/providers/${file}.provider.js`)[name])());
  for(const provider of providers) assert.equal((await provider.send({to:'test@example.invalid',subject:'QA',html:'QA'})).accepted,false);
  const email=new EmailService(...providers);
  await assert.rejects(email.sendVerificationEmail('test@example.invalid','synthetic'),errorStatus(503));
  await assert.rejects(email.sendPasswordResetEmail('test@example.invalid','synthetic'),errorStatus(503));
});

test('password reset tokens are single-use and revoke sessions after a verified delivery attempt', async () => {
  const email=`${randomUUID()}@example.invalid`, password=`Synthetic-${randomUUID()}!`;
  const created=await httpRequest('/auth/signup',{method:'POST',body:{email,password,name:'Recovery QA'}});
  let delivered;
  const recovery=new AuthService(prisma,new UsersService(prisma,context),sessions,new PasswordService(),tokens,new LoginAuditService(prisma),null,{sendPasswordResetEmail:async(_to,token)=>{delivered=token;return {accepted:true};}});
  await recovery.requestPasswordReset({tenantId:created.body.user.tenantId,email});assert.ok(delivered);
  const newPassword=`Reset-${randomUUID()}!`;
  const input={tenantId:created.body.user.tenantId,token:delivered,newPassword};
  const results=await Promise.allSettled([recovery.confirmPasswordReset(input),recovery.confirmPasswordReset(input)]);
  assert.equal(results.filter(result=>result.status==='fulfilled').length,1);
  assert.equal(results.filter(result=>result.status==='rejected').length,1);
  assert.equal((await httpRequest('/retail/shop/settings',{bearer:created.body.session.accessToken})).response.status,401);
  assert.equal((await httpRequest('/auth/login',{method:'POST',body:{email,password:newPassword}})).response.status,201);
  await assert.rejects(recovery.confirmPasswordReset(input),errorStatus(400));
});

test('email verification persists verified state and rejects a mismatched tenant', async () => {
  const scope=await organization();const user=await db.user.findUniqueOrThrow({where:{id:scope.userId}});
  const token=await tokens.signEmailVerificationToken({tenantId:scope.tenantId,email:user.email});
  await assert.rejects(shopAuth.verifyEmail({tenantId:otherTenant.tenantId,token}),errorStatus(400));
  await shopAuth.verifyEmail({tenantId:scope.tenantId,token});
  assert.equal((await shopAuth.me(scope)).emailVerified,true);
});

test('concurrent context switches create one active replacement session', async () => {
  const scope=await organization(), bearer=await bearerFor(scope);
  const target=await httpRequest('/auth/contexts',{method:'POST',bearer,body:{requestKey:randomUUID(),kind:'workspace',name:'Concurrency target'}});
  const responses=await Promise.all([1,2].map(()=>httpRequest('/auth/switch-context',{method:'POST',bearer,body:{workspaceId:target.body.workspaceId}})));
  assert.deepEqual(responses.map(row=>row.response.status).sort(),[201,401]);
  assert.equal(await db.session.count({where:{tenantId:scope.tenantId,userId:scope.userId,status:'ACTIVE'}}),1);
});

test('revoked current organization access does not prevent switching to another authorized context or logout', async () => {
  const scope=await organization(),bearer=await bearerFor(scope);
  const target=await httpRequest('/auth/contexts',{method:'POST',bearer,body:{requestKey:randomUUID(),kind:'business',name:`Recovery context ${randomUUID()}`}});
  await db.membership.updateMany({where:{tenantId:scope.tenantId,userId:scope.userId,organizationId:scope.organizationId},data:{deletedAt:new Date()}});
  assert.equal((await httpRequest('/retail/shop/settings',{bearer})).response.status,403);
  const list=await httpRequest('/auth/contexts',{bearer});assert.equal(list.response.status,200);assert.deepEqual(list.body.map(row=>row.workspaceId),[target.body.workspaceId]);
  const switched=await httpRequest('/auth/switch-context',{method:'POST',bearer,body:{workspaceId:target.body.workspaceId}});assert.equal(switched.response.status,201);
  assert.equal((await httpRequest('/auth/logout',{method:'POST',bearer:switched.body.session.accessToken})).response.status,201);
});

test('cookie signup rejects cross-site origins before provisioning any account', async () => {
  const email=`${randomUUID()}@example.invalid`;
  const response=await httpRequest('/auth/signup',{method:'POST',headers:{origin:'https://foreign.example.invalid'},body:{email,name:'Origin QA',password:`Synthetic-${randomUUID()}!`,sessionTransport:'cookie'}});
  assert.equal(response.response.status,401);assert.equal(await db.user.count({where:{email}}),0);
});

test('failed business setup audit rolls back profile, currency and preferences together', async () => {
  const scope=await organization(),bearer=await bearerFor(scope); const before=await scoped(scope,()=>shop.settings());
  await db.$executeRawUnsafe(`CREATE FUNCTION business_setup_failure() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN IF NEW."resourceType" = 'retail.settings' AND NEW."actorUserId" = '${scope.userId}'::uuid THEN RAISE EXCEPTION 'synthetic setup failure'; END IF; RETURN NEW; END $$`);
  await db.$executeRawUnsafe('CREATE TRIGGER business_setup_failure BEFORE INSERT ON "AuditLog" FOR EACH ROW EXECUTE FUNCTION business_setup_failure()');
  try {
    const result=await httpRequest('/retail/shop/setup',{method:'POST',bearer,body:{name:'Rollback workspace',businessName:`Rollback business ${randomUUID()}`,category:'Rollback category',countryCode:'US',timeZone:'America/New_York',currency:'USD',expectedVersion:0,modules:['crm'],widgets:[]}});
    assert.equal(result.response.status,500);const after=await scoped(scope,()=>shop.settings());
    assert.equal(after.name,before.name);assert.equal(after.organizationName,before.organizationName);assert.equal(after.currency,before.currency);assert.equal(after.setupComplete,false);assert.deepEqual(after.preferences,before.preferences);assert.equal(after.profile,null);
  } finally {await db.$executeRawUnsafe('DROP TRIGGER business_setup_failure ON "AuditLog"');await db.$executeRawUnsafe('DROP FUNCTION business_setup_failure()');}
});

test('failed password-change audit preserves the original credential and all sessions', async () => {
  const email=`${randomUUID()}@example.invalid`,password=`Synthetic-${randomUUID()}!`;
  const created=await httpRequest('/auth/signup',{method:'POST',body:{email,password,name:'Password rollback QA'}});
  const user=created.body.user;
  await db.$executeRawUnsafe(`CREATE FUNCTION password_change_failure() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN IF NEW."resourceType" = 'auth.password' AND NEW."actorUserId" = '${user.id}'::uuid THEN RAISE EXCEPTION 'synthetic password failure'; END IF; RETURN NEW; END $$`);
  await db.$executeRawUnsafe('CREATE TRIGGER password_change_failure BEFORE INSERT ON "AuditLog" FOR EACH ROW EXECUTE FUNCTION password_change_failure()');
  try {
    const response=await httpRequest('/auth/password/change',{method:'POST',bearer:created.body.session.accessToken,body:{tenantId:user.tenantId,userId:user.id,currentPassword:password,newPassword:`Changed-${randomUUID()}!`}});
    assert.equal(response.response.status,500);assert.equal((await httpRequest('/retail/shop/settings',{bearer:created.body.session.accessToken})).response.status,200);
    assert.equal((await httpRequest('/auth/login',{method:'POST',body:{email,password}})).response.status,201);
  } finally {await db.$executeRawUnsafe('DROP TRIGGER password_change_failure ON "AuditLog"');await db.$executeRawUnsafe('DROP FUNCTION password_change_failure()');}
});

test('stock-only dashboard returns permitted stock fields without CRM or financial records', async () => {
  const scope=await organization(); const product=await scoped(scope,()=>shop.createProduct(productInput()));
  await scoped(scope,()=>shop.createCustomer({...customerInput(),name:'Private CRM record'}));
  const member=await db.membership.findFirstOrThrow({where:{userId:scope.userId,organizationId:scope.organizationId}});
  await db.membership.update({where:{id:member.id},data:{title:'Stock reader'}});
  const role=await db.role.create({data:{tenantId:scope.tenantId,name:'Stock read scope',slug:randomUUID()}});
  const permission=await db.permission.create({data:{tenantId:scope.tenantId,resource:'inventory',action:'read',scope:'workspace',effect:'ALLOW'}});
  await db.rolePermission.create({data:{tenantId:scope.tenantId,roleId:role.id,permissionId:permission.id}});
  await db.roleAssignment.create({data:{tenantId:scope.tenantId,roleId:role.id,membershipId:member.id}});
  const bearer=await bearerFor(scope); const result=await httpRequest('/retail/shop/overview',{bearer});
  assert.equal(result.response.status,200);assert.equal(result.body.products,1);assert.equal(result.body.inventoryValue,'100.00');
  for(const key of ['customers','leads','dueFollowUps','recentLeads','outstanding','overdueInvoices','overdueAmount'])assert.equal(result.body[key],undefined,key);
  assert.ok(result.body.activity.every(row=>['retail.product','inventory.movement'].includes(row.type)));
  assert.ok(!JSON.stringify(result.body).includes('Private CRM record'));
  assert.equal((await httpRequest('/retail/shop/customers',{bearer})).response.status,403);
  const settings=await httpRequest('/retail/shop/settings',{bearer});assert.equal(settings.response.status,200);
  assert.equal(settings.body.capabilities.inventory,true);assert.equal(settings.body.capabilities.inventoryCreate,false);assert.equal(settings.body.capabilities.inventoryUpdate,false);
  await assert.rejects(scoped(scope,()=>shop.updateProduct(product.id,{name:'Denied mutation'})),errorStatus(403));
  await assert.rejects(scoped(scope,()=>reports.summary('INR','2026-01-01','2027-01-01')),errorStatus(403));
  assert.ok(product.id);
});

test('real disposable SMTP acceptance persists recovery state and reset revokes database sessions',async t=>{
  const email=`${randomUUID()}@example.invalid`,password=`Synthetic-${randomUUID()}!`;
  const created=await httpRequest('/auth/signup',{method:'POST',body:{email,password,name:'SMTP recovery QA'}});
  const {smtpReceiver}=await import('./helpers/smtp-receiver.mjs');const receiver=await smtpReceiver();
  const keys=['EMAIL_PROVIDER','EMAIL_DELIVERY_ENABLED','EMAIL_FROM','SMTP_HOST','SMTP_PORT','SMTP_USER','SMTP_PASS','SMTP_ALLOW_INSECURE_LOCAL'];const previous=Object.fromEntries(keys.map(key=>[key,process.env[key]]));
  Object.assign(process.env,{EMAIL_PROVIDER:'smtp',EMAIL_DELIVERY_ENABLED:'true',EMAIL_FROM:'sender@example.invalid',SMTP_HOST:'127.0.0.1',SMTP_PORT:String(receiver.port),SMTP_ALLOW_INSECURE_LOCAL:'true'});delete process.env.SMTP_USER;delete process.env.SMTP_PASS;
  // The lightweight HTTP fixture normally supplies a signup-only mail stub.
  // This scenario must connect the actual providers, not claim stub delivery.
  const previousMailer=shopAuth.emailService;
  const {EmailService}=require('../apps/api/dist/modules/email/email.service.js');
  const providers=[['resend','ResendEmailProvider'],['sendgrid','SendGridEmailProvider'],['smtp','SmtpEmailProvider']].map(([file,name])=>new(require(`../apps/api/dist/modules/email/providers/${file}.provider.js`)[name])());
  shopAuth.emailService=new EmailService(...providers);t.after(()=>{shopAuth.emailService=previousMailer;});
  t.after(async()=>{for(const [key,value] of Object.entries(previous)){if(value===undefined)delete process.env[key];else process.env[key]=value;}await receiver.close();});
  const tenantId=created.body.user.tenantId;
  assert.equal((await httpRequest('/auth/forgot-password',{method:'POST',body:{tenantId,email}})).response.status,201);
  assert.equal(receiver.messages.length,1);
  const token=receiver.messages[0].replace(/=\r\n/g,'').match(/eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/)?.[0];assert.ok(token,'SMTP receiver must contain the actual signed token');
  const user=await db.user.findUniqueOrThrow({where:{id:created.body.user.id}});assert.ok(user.metadata.passwordResetTokenHash);assert.notEqual(user.metadata.passwordResetTokenHash,token);
  const nextPassword=`Changed-${randomUUID()}!`,body={tenantId,token,newPassword:nextPassword};
  assert.equal((await httpRequest('/auth/reset-password',{method:'POST',body})).response.status,201);
  assert.equal((await httpRequest('/retail/shop/settings',{bearer:created.body.session.accessToken})).response.status,401);
  assert.equal((await httpRequest('/auth/reset-password',{method:'POST',body})).response.status,400);
  assert.equal((await httpRequest('/auth/login',{method:'POST',body:{email,password:nextPassword}})).response.status,201);
  assert.equal((await httpRequest('/auth/forgot-password',{method:'POST',body:{tenantId,email:`${randomUUID()}@example.invalid`}})).response.status,201);assert.equal(receiver.messages.length,1,'Unknown account must not send arbitrary mail');
});

const signaturePng='iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aL1sAAAAASUVORK5CYII=';
const plainPdf=Buffer.from('%PDF-1.4\n1 0 obj\n<< /Type /Catalog >>\nendobj\n%%EOF').toString('base64');
test('expanded business details persist separately, remain owner-controlled and do not create stock',async()=>{
  const scope=await organization();await scoped(scope,()=>shop.completeSetup({name:'Context workspace',businessName:`Context ${randomUUID()}`,category:'Retail',countryCode:'IN',timeZone:'Asia/Kolkata',currency:'INR',modules:['crm','sales','inventory','finance'],widgets:[],expectedVersion:0,sells:'User supplied cleanser facewash',buys:'Supplier stock',address:'User supplied address',businessPhone:'123',businessEmail:'owner@example.invalid',invoiceStyle:'compact',invoiceTerms:'User supplied payment terms'}));
  const settings=await scoped(scope,()=>shop.settings());assert.equal(settings.profile.sells,'User supplied cleanser facewash');assert.equal(settings.profile.buys,'Supplier stock');assert.equal(settings.profile.invoiceStyle,'compact');assert.equal(await db.stockBalance.count({where:{workspaceId:scope.workspaceId}}),0);
  const member=await db.membership.findFirstOrThrow({where:{userId:scope.userId,organizationId:scope.organizationId}});await db.membership.update({where:{id:member.id},data:{title:'Manager'}});const role=await db.role.create({data:{tenantId:scope.tenantId,name:'Settings manager',slug:randomUUID()}});const permission=await db.permission.create({data:{tenantId:scope.tenantId,resource:'settings',action:'manage',scope:'workspace',effect:'ALLOW'}});await db.rolePermission.create({data:{tenantId:scope.tenantId,roleId:role.id,permissionId:permission.id}});await db.roleAssignment.create({data:{tenantId:scope.tenantId,roleId:role.id,membershipId:member.id}});
  await assert.rejects(scoped(scope,()=>shop.configure({name:'Context workspace',currency:'INR',sells:'Denied profile edit'})),errorStatus(403));assert.equal((await db.workspace.findUniqueOrThrow({where:{id:scope.workspaceId}})).metadata.businessProfile.sells,'User supplied cleanser facewash');
});
test('product search matches words and case and still separates tenant catalogues',async()=>{const scope=await organization();const product=await scoped(scope,()=>shop.createProduct({...productInput(),name:'Cleanser Facewash'}));const result=await scoped(scope,()=>shop.products({search:' cleanser face wash ',page:1,limit:100}));assert.equal(result.total,1);assert.equal(result.items[0].id,product.id);assert.equal((await scoped(otherOrganization,()=>shop.products({search:'Cleanser Facewash',page:1,limit:100}))).items.some(row=>row.id===product.id),false);});
test('issued invoices preserve seller, catalogue and registered signature snapshots after edits',async()=>{
  const scope=await organization();await scoped(scope,()=>shop.configure({name:'Invoice workspace',businessName:`Invoice ${randomUUID()}`,currency:'INR',sells:'Own goods',invoiceTerms:'Original terms',invoiceStyle:'compact'}));const firstSettings=await scoped(scope,()=>shop.settings());const product=await scoped(scope,()=>shop.createProduct({...productInput(),name:'Original product'}));await scoped(scope,()=>documents.signature({uploadKey:randomUUID(),label:'Original signatory',data:signaturePng}));
  const sale=await scoped(scope,()=>sales.create({saleKey:randomUUID(),currency:'INR',lines:[{stockId:product.id,quantity:'1',unitPrice:'30.00'}]}));await scoped(scope,()=>sales.complete(sale.id));
  await scoped(scope,()=>shop.configure({name:'Changed workspace',businessName:`Changed ${randomUUID()}`,currency:'INR',invoiceTerms:'Changed terms'}));await scoped(scope,()=>shop.updateProduct(product.id,{name:'Changed product',unitPrice:'999',reorderPoint:'0'}));await scoped(scope,()=>documents.signature({uploadKey:randomUUID(),label:'Changed signatory',data:signaturePng}));
  const invoice=await scoped(scope,()=>documents.invoice(sale.id));assert.equal(invoice.seller.businessName,firstSettings.organizationName);assert.equal(invoice.seller.invoiceTerms,'Original terms');assert.equal(invoice.items[0].name,'Original product');assert.equal(invoice.items[0].unitPrice,'30');assert.equal(invoice.signature.label,'Original signatory');assert.equal(invoice.historicalSnapshot,true);await assert.rejects(scoped(otherOrganization,()=>documents.invoice(sale.id)),errorStatus(404));
});
test('private existing invoice upload deduplicates, requires review and links to only one draft',async()=>{
  const scope=await organization(),bearer=await bearerFor(scope),input={uploadKey:randomUUID(),fileName:'existing.html',mimeType:'application/pdf',data:plainPdf};const upload=await httpRequest('/retail/shop/documents',{method:'POST',bearer,body:input});assert.equal(upload.response.status,201);const id=upload.body.id;const repeated=await scoped(scope,()=>documents.upload(input));assert.equal(repeated.id,id);assert.equal((await scoped(scope,()=>documents.sources()))[0].fileName,'existing.pdf');assert.equal(await db.fileAsset.count({where:{documentId:id}}),1);
  await assert.rejects(scoped(otherOrganization,()=>documents.source(id)),errorStatus(404));await assert.rejects(scoped(viewer,()=>documents.upload({...input,uploadKey:randomUUID()})),errorStatus(403));const product=await scoped(scope,()=>shop.createProduct(productInput()));const saleInput={saleKey:randomUUID(),sourceDocumentId:id,currency:'INR',lines:[{stockId:product.id,quantity:'1',unitPrice:'30'}]};const sale=await scoped(scope,()=>sales.create(saleInput));assert.equal(sale.status,'DRAFT');assert.equal((await db.stockBalance.findUniqueOrThrow({where:{id:product.id}})).quantityAvailable.toString(),'10');assert.equal((await scoped(scope,()=>reports.summary('INR','2000-01-01','2100-01-01'))).recognizedRevenue,'0.00');assert.equal((await scoped(scope,()=>sales.create(saleInput))).id,sale.id);await assert.rejects(scoped(scope,()=>sales.create({...saleInput,saleKey:randomUUID()})),errorStatus(400));
  assert.equal((await scoped(scope,()=>documents.sources()))[0].linkedSaleId,sale.id);await assert.rejects(scoped(scope,()=>documents.upload({...input,fileName:'changed.pdf'})),errorStatus(409));
});
test('invoice-source audit failure rolls back document and private file together',async()=>{
  const scope=await organization();await db.$executeRawUnsafe(`CREATE FUNCTION invoice_source_failure() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN IF NEW."resourceType"='retail.invoice_source' AND NEW."actorUserId"='${scope.userId}'::uuid THEN RAISE EXCEPTION 'synthetic upload audit failure'; END IF; RETURN NEW; END $$`);await db.$executeRawUnsafe('CREATE TRIGGER invoice_source_failure BEFORE INSERT ON "AuditLog" FOR EACH ROW EXECUTE FUNCTION invoice_source_failure()');try{await assert.rejects(scoped(scope,()=>documents.upload({uploadKey:randomUUID(),fileName:'rollback.pdf',mimeType:'application/pdf',data:plainPdf})));assert.equal(await db.fileAsset.count({where:{workspaceId:scope.workspaceId}}),0);assert.equal((await scoped(scope,()=>documents.sources())).length,0);}finally{await db.$executeRawUnsafe('DROP TRIGGER invoice_source_failure ON "AuditLog"');await db.$executeRawUnsafe('DROP FUNCTION invoice_source_failure()');}
});
test('reviewed lead imports commit once, deduplicate contacts and isolate organizations',async()=>{
  const scope=await organization(),dto={importKey:randomUUID(),source:'contacts',rows:[{name:'Reviewed contact',phone:'123456',email:'reviewed@example.invalid'}]};const [first,retry]=await scoped(scope,()=>Promise.all([leads.import(dto),leads.import(dto)]));assert.deepEqual(first.ids,retry.ids);assert.equal(await db.crmCustomerRecord.count({where:{workspaceId:scope.workspaceId}}),1);assert.deepEqual((await scoped(scope,()=>leads.import({...dto,importKey:randomUUID()}))).ids,first.ids);await assert.rejects(scoped(scope,()=>leads.import({...dto,rows:[{name:'Changed contact'}]})),errorStatus(409));await assert.rejects(scoped(viewer,()=>leads.import({...dto,importKey:randomUUID()})),errorStatus(403));assert.equal((await scoped(otherOrganization,()=>shop.customers({search:'reviewed@example.invalid',page:1,limit:25}))).total,0);
});
test('website lead key is scope-bound, replay-safe, revocable and never grants invoice access',async()=>{
  const scope=await organization(),connection=await scoped(scope,()=>leads.connection()),body={eventKey:randomUUID(),name:'Website enquiry',phone:'555111'};const headers={'x-nexora-lead-key':connection.token};const endpoint=`/retail/lead-intake/${scope.workspaceId}`;
  const result=await httpRequest(endpoint,{method:'POST',headers,body});assert.equal(result.response.status,201);assert.equal(result.body.accepted,true);assert.equal(result.body.ids,undefined);assert.equal((await httpRequest(endpoint,{method:'POST',headers,body})).body.reused,true);assert.equal(await db.crmCustomerRecord.count({where:{workspaceId:scope.workspaceId}}),1);const customer=await db.crmCustomerRecord.findFirstOrThrow({where:{workspaceId:scope.workspaceId}});assert.equal(customer.metadata.captureMethod,'website_webhook');assert.equal((await httpRequest(`/retail/lead-intake/${otherOrganization.workspaceId}`,{method:'POST',headers,body})).response.status,401);assert.equal((await httpRequest('/retail/shop/documents',{headers})).response.status,401);
  const stored=(await db.workspace.findUniqueOrThrow({where:{id:scope.workspaceId}})).metadata.websiteLeadConnection;assert.notEqual(stored.hash,connection.token);await scoped(scope,()=>leads.connection());assert.equal((await httpRequest(endpoint,{method:'POST',headers,body:{...body,eventKey:randomUUID()}})).response.status,401);
});
test('follow-up message drafts persist without sending and unavailable AI fails closed',async()=>{
  const scope=await organization(),customer=await scoped(scope,()=>shop.createCustomer(customerInput()));const task=await scoped(scope,()=>shop.createFollowUp({followUpKey:randomUUID(),customerId:customer.id,title:'Review enquiry',dueAt:'2026-11-01T12:00:00Z',priority:'MEDIUM',messageDraft:'User reviewed message'}));assert.equal(task.metadata.messageDraft,'User reviewed message');const previous=process.env.NEXORA_AI_DRAFTS_ENABLED;delete process.env.NEXORA_AI_DRAFTS_ENABLED;try{await assert.rejects(scoped(scope,()=>assistant.draft(customer.id,'Review enquiry','Punjabi')),errorStatus(503));await assert.rejects(scoped(otherOrganization,()=>assistant.draft(customer.id,'Foreign enquiry','Punjabi')),errorStatus(404));}finally{if(previous===undefined)delete process.env.NEXORA_AI_DRAFTS_ENABLED;else process.env.NEXORA_AI_DRAFTS_ENABLED=previous;}
});
