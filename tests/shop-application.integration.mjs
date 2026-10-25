import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createRequire } from 'node:module';
import { randomUUID, randomBytes } from 'node:crypto';
import path from 'node:path';

const url = process.env.NEXORA_RETAIL_TEST_DATABASE_URL;
if (!url) throw new Error('Run npm run retail:test; an isolated database is required.');
const parsed = new URL(url);
if (parsed.hostname !== '127.0.0.1' || !/^\/nexora_retail_test_[a-z0-9]+$/.test(parsed.pathname) || !process.env.NEXORA_TEST_CLUSTER_PATH) throw new Error('Refusing any database outside the disposable test runner.');
Object.assign(process.env, { DATABASE_URL: url, NODE_ENV: 'test', NEXORA_IGNORE_ENV_FILE: 'true', REDIS_DISABLED: 'true', JWT_SECRET: randomBytes(48).toString('hex') });
const require = createRequire(import.meta.url);
require('reflect-metadata');
const { NestFactory } = require('@nestjs/core');
const { ValidationPipe, VersioningType } = require('@nestjs/common');
const { AppModule } = require('../apps/api/dist/app.module.js');
const { PrismaService } = require('../apps/api/dist/infrastructure/database/prisma.service.js');
const { GlobalExceptionFilter } = require('../apps/api/dist/common/filters/global-exception.filter.js');
const { ApiResponseInterceptor } = require('../apps/api/dist/common/interceptors/api-response.interceptor.js');

test('complete application HTTP workflow reconciles persisted shop records and isolates a second tenant', { timeout: 90000 }, async () => {
  const app = await NestFactory.create(AppModule, { logger: false, abortOnError: false });
  try {
    app.use(require('cookie-parser')());
    app.setGlobalPrefix('api'); app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' });
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));
    app.useGlobalFilters(new GlobalExceptionFilter()); app.useGlobalInterceptors(new ApiResponseInterceptor());
    await app.listen(0, '127.0.0.1');
    const db = app.get(PrismaService).database;
    const [location] = await db.$queryRaw`SELECT current_setting('data_directory') AS directory`;
    assert.equal(path.resolve(location.directory).toLowerCase(), path.resolve(process.env.NEXORA_TEST_CLUSTER_PATH).toLowerCase());
    const base = await app.getUrl();
    async function request(endpoint, session, body, method = body === undefined ? 'GET' : 'POST', expected = method === 'POST' ? 201 : 200, extra = {}) {
      const headers = { 'content-type': 'application/json', ...(session ? { authorization: `Bearer ${session.accessToken}`, 'x-tenant-id': session.tenantId, 'x-workspace-id': session.workspaceId, 'x-organization-id': session.organizationId } : {}), ...extra };
      const response = await fetch(base + '/api/v1' + endpoint, { method, headers, body: body === undefined ? undefined : JSON.stringify(body) });
      const payload = await response.json();
      assert.equal(response.status, expected, `${method} ${endpoint}: ${JSON.stringify(payload)}`);
      return payload.success ? payload.data : payload;
    }
    const signup = () => request('/auth/signup', null, { name: 'Synthetic App Owner', companyName: `App QA ${randomUUID()}`, email: `${randomUUID()}@example.invalid`, password: `Synthetic-${randomUUID()}!`, sessionTransport: 'cookie' });
    const first = await signup(); const second = await signup(); let session = first.session; const foreign = second.session;
    assert.equal(session.refreshToken, undefined);
    assert.equal((await request('/retail/shop/settings',session)).setupComplete,false);
    await request('/retail/shop/setup', session, { name: 'Synthetic retail shop', businessName: 'Workflow QA business', category: 'Retail QA', countryCode: 'IN', timeZone: 'Asia/Kolkata', currency: 'INR', expectedVersion: 0, modules: ['crm','sales','inventory','finance','intelligence'], widgets: ['revenue','customers','financials','followups','stock','sales'] });
    assert.equal((await request('/retail/shop/settings',session)).setupComplete,true);
    const customer = await request('/retail/shop/customers', session, { customerKey: randomUUID(), name: 'Synthetic Customer', email: 'qa@example.invalid', lifecycleStage: 'customer' });
    const follow = await request('/retail/shop/follow-ups', session, { followUpKey: randomUUID(), customerId: customer.id, title: 'Confirm delivery', dueAt: new Date().toISOString(), priority: 'HIGH' });
    await request(`/retail/shop/follow-ups/${follow.id}`, session, { status: 'DONE' }, 'PATCH');
    assert.equal((await request('/retail/shop/follow-ups', session)).items[0].status, 'DONE');
    const product = await request('/retail/shop/products', session, { productKey: randomUUID(), name: 'Synthetic product', sku: randomUUID(), unitPrice: '30.00', unitCost: '10.00', openingQuantity: '10', reorderPoint: '2' });
    const sale = await request('/retail/sales', session, { saleKey: randomUUID(), customerId: customer.id, currency: 'INR', lines: [{ stockId: product.id, quantity: '3', unitPrice: '30.00' }] });
    await request(`/retail/sales/${sale.id}/complete`, session, {});
    const paymentBody = { idempotencyKey: randomUUID(), amount: '50.00', currency: 'INR', paymentMethod: 'cash' };
    const payment = await request(`/finance/invoices/${sale.invoiceId}/payments`, session, paymentBody);
    const retry = await request(`/finance/invoices/${sale.invoiceId}/payments`, session, paymentBody); assert.ok(payment.payment.id); assert.equal(retry.payment.id, payment.payment.id);
    await request(`/retail/sales/${sale.id}/returns`, session, { returnKey: randomUUID(), reason: 'Customer returned one unit', lines: [{ lineId: sale.lines[0].id, quantity: '1' }] });
    await request('/retail/shop/expenses', session, { expenseKey: randomUUID(), category: 'Delivery', vendor: 'Synthetic vendor', amount: '10.10', incurredAt: new Date().toISOString() });
    const report = await request('/retail/reports/profit-loss?currency=INR&from=2000-01-01T00:00:00Z&to=2100-01-01T00:00:00Z', session);
    for (const [key, value] of Object.entries({ sales: '90.00', returns: '30.00', recognizedRevenue: '60.00', costOfGoodsSold: '20.00', grossProfit: '40.00', operatingExpenses: '10.10', netProfit: '29.90', netCustomerCash: '50.00' })) assert.equal(report[key], value, key);
    const overview = await request('/retail/shop/overview', session); assert.equal(overview.outstanding, '10.00'); assert.equal(overview.inventoryValue, '80.00');
    assert.equal((await request(`/retail/shop/products/${product.id}/movements`, session)).total, 3);
    assert.equal((await request('/retail/shop/customers', foreign)).total, 0);
    await request(`/retail/shop/products/${product.id}/movements`, foreign, undefined, 'GET', 404);
    await request(`/finance/invoices/${sale.invoiceId}/payments`, foreign, paymentBody, 'POST', 404);
    await request('/retail/shop/customers', session, undefined, 'GET', 403, { 'x-tenant-id': foreign.tenantId });
    const previousSession = session;
    await request('/auth/switch-context',session,{workspaceId:foreign.workspaceId,sessionTransport:'cookie'},'POST',403);
    const nextContext = await request('/auth/contexts',session,{requestKey:randomUUID(),kind:'business',name:'Second workflow business'});
    session = (await request('/auth/switch-context',session,{workspaceId:nextContext.workspaceId,sessionTransport:'cookie'})).session;
    await request('/retail/shop/settings',previousSession,undefined,'GET',401);
    const freshSettings = await request('/retail/shop/settings',session);assert.equal(freshSettings.setupComplete,false);assert.equal(freshSettings.currency,null);
    assert.equal((await request('/retail/shop/products',session)).total,0);
    await request('/auth/logout', session, {});
    await request('/retail/shop/settings', session, undefined, 'GET', 401);
    assert.equal(await db.invoicePayment.count({ where: { invoiceId: sale.invoiceId } }), 1);
  } finally { await app.close(); }
});
