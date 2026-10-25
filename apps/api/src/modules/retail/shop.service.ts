import {detailsPatch,catalogueWords} from './business-context';
import { ShopBusinessSetupDto } from './shop.dto';
import { ShopCustomerQueryDto } from './shop.dto';
import { ShopPreferencesDto } from './shop.dto';
import { readRetailPreferences, validateRetailPreferences } from './shop-preferences';
import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { RetailAccessService, RetailScope } from './retail-access.service';
import { InventoryLedgerService } from './inventory-ledger.service';
import { audit, currency, key, lock, matchRequest, requestHash } from './retail-transaction';
import { decimal, money, quantity, round } from './money';
import { ShopCustomerDto, ShopCustomerUpdateDto, ShopExpenseDto, ShopFollowUpDto, ShopProductDto, ShopProductUpdateDto, ShopQueryDto, ShopSettingsDto } from './shop.dto';

const json = (value: Prisma.JsonValue) => value && typeof value === 'object' && !Array.isArray(value) ? value as Prisma.JsonObject : {};
const trimmed = (value: string) => { if (!value.trim()) throw new BadRequestException('A nonblank value is required'); return value.trim(); };
const whereScope = (scope: RetailScope) => ({ tenantId: scope.tenantId, workspaceId: scope.workspaceId, deletedAt: null });
const paging = (query: ShopQueryDto) => ({ skip: (query.page - 1) * query.limit, take: query.limit });

@Injectable()
export class ShopService {
  constructor(private readonly prisma: PrismaService, private readonly access: RetailAccessService, private readonly inventory: InventoryLedgerService) {}

  async settings() {
    const scope = await this.access.scope();
    const workspace = await this.prisma.database.workspace.findUniqueOrThrow({ where: { id: scope.workspaceId }, include: { organization: true } });
    const code = json(workspace.metadata).currency;
    const configured = typeof code === 'string' ? await this.prisma.database.currency.findFirst({ where: { code, enabled: true, deletedAt: null } }) : null;
    const checks = await Promise.all(['crm', 'sales', 'inventory', 'finance', 'settings'].map(async resource => { try { await this.access.require(resource, resource === 'settings' ? 'manage' : 'read'); return [resource, true] as const; } catch (error) { if (error instanceof ForbiddenException) return [resource, false] as const; throw error; } }));
    const membership = await this.prisma.database.membership.findFirst({ where: { tenantId: scope.tenantId, organizationId: scope.organizationId, userId: scope.userId, deletedAt: null } });
    const actionRules = { crmCreate:['crm','create'], crmUpdate:['crm','update'], inventoryCreate:['inventory','create'], inventoryUpdate:['inventory','update'], salesCreate:['sales','create'], salesUpdate:['sales','update'], financeCreate:['finance','create'], financeUpdate:['finance','update'], financeApprove:['finance','approve'] };
    const actionChecks = await Promise.all(Object.entries(actionRules).map(async ([name,[resource,action]]) => { try { await this.access.require(resource,action); return [name,true] as const; } catch(error) { if(error instanceof ForbiddenException)return [name,false] as const;throw error; } }));
    const capabilities = { ...Object.fromEntries(checks), ...Object.fromEntries(actionChecks), owner: membership?.title === 'Organization Owner' };
    return { websiteLeadConnection:{configured:typeof json(json(workspace.metadata).websiteLeadConnection??null).expiresAt==='string'&&Date.parse(String(json(json(workspace.metadata).websiteLeadConnection??null).expiresAt))>Date.now()},aiDraftsConfigured:process.env.NEXORA_AI_DRAFTS_ENABLED==='true'&&Boolean(process.env.OPENAI_API_KEY&&process.env.OPENAI_MODEL), invoiceSignatureRegistered:typeof json(workspace.metadata).invoiceSignatureId==='string',setupComplete: Boolean(configured && json(workspace.metadata).setupCompletedAt), profile: json(workspace.metadata).businessProfile ?? null, capabilities, name: workspace.name, organizationName: workspace.organization.name, tenantId: scope.tenantId, workspaceId: scope.workspaceId, organizationId: scope.organizationId, currency: configured?.code ?? null, precision: configured?.precision ?? null, preferences: readRetailPreferences(json(workspace.metadata).retailPreferences) };
  }

  async savePreferences(dto: ShopPreferencesDto) {
    validateRetailPreferences(dto);
    return this.prisma.transaction(async tx => {
      const scope = await this.access.require('settings', 'manage', tx);
      await lock(tx, `shop-configuration:${scope.workspaceId}`);
      const workspace = await tx.workspace.findUniqueOrThrow({ where: { id: scope.workspaceId } });
      const metadata = json(workspace.metadata);
      const current = readRetailPreferences(metadata.retailPreferences);
      if (current.version !== dto.expectedVersion) throw new ConflictException('Workspace preferences changed. Refresh before saving your changes.');
      const preferences = { version: current.version + 1, modules: [...dto.modules], widgets: [...dto.widgets] };
      await tx.workspace.update({ where: { id: workspace.id }, data: { metadata: { ...metadata, retailPreferences: preferences } } });
      await audit(tx, scope, 'retail.preferences', workspace.id, preferences);
      return preferences;
    });
  }

  async overview() {
    return this.prisma.transaction(async tx => {
      const scope = await this.access.scope(tx);
      const permissions = await Promise.all(['crm','inventory','finance','sales'].map(async resource => { try { await this.access.require(resource,'read',tx); return [resource,true] as const; } catch(error) { if(error instanceof ForbiddenException)return [resource,false] as const;throw error; } }));
      const granted = Object.fromEntries(permissions);
      if (!Object.values(granted).some(Boolean)) throw new ForbiddenException('No dashboard resources are permitted');
      const activityTypes = [...(granted.crm ? ['retail.customer','retail.follow_up'] : []), ...(granted.inventory ? ['retail.product','inventory.movement'] : []), ...(granted.sales ? ['retail.sale','retail.return'] : []), ...(granted.finance ? ['finance.payment','finance.refund','retail.expense'] : [])];
      const code = await this.shopCurrency(tx, scope), config = await currency(tx, code);
      const base = whereScope(scope);
      const [customers, leads, dueFollowUps, stock, debt, overdue, recentLeads, activity] = await Promise.all([
        granted.crm ? tx.crmCustomerRecord.count({ where: base }) : Promise.resolve(undefined),
        granted.crm ? tx.crmCustomerRecord.count({ where: { ...base, lifecycleStage: 'lead' } }) : Promise.resolve(undefined),
        granted.crm ? tx.task.count({ where: { ...base, status: { notIn: ['DONE', 'CANCELED'] }, dueAt: { lte: new Date() }, metadata: { path: ['source'], equals: 'retail_follow_up' } } }) : Promise.resolve(undefined),
        granted.inventory ? tx.stockBalance.findMany({ where: { ...base, costingCurrency: code, item: { ...base, status: 'active' }, warehouse: { ...base, status: 'active' } }, select: { quantityAvailable: true, inventoryValue: true, id: true, itemId: true, warehouse: { select: { name: true } }, item: { select: { reorderPoint: true, name: true, sku: true } } } }) : Promise.resolve(undefined),
        granted.finance ? tx.invoice.aggregate({ where: { ...base, currency: code, status: { in: ['SENT', 'ISSUED', 'PARTIALLY_PAID', 'OVERDUE'] } }, _sum: { amountDue: true } }) : Promise.resolve(undefined),
        granted.finance ? tx.invoice.aggregate({ where: { ...base, currency: code, dueAt: { lt: new Date() }, amountDue: { gt: 0 }, status: { in: ['SENT', 'ISSUED', 'PARTIALLY_PAID', 'OVERDUE'] } }, _count: true, _sum: { amountDue: true } }) : Promise.resolve(undefined),
        granted.crm ? tx.crmCustomerRecord.findMany({ where: { ...base, lifecycleStage: 'lead' }, orderBy: [{ createdAt: 'desc' }, { id: 'desc' }], take: 5, select: { id: true, name: true, company: true, lifecycleStage: true, createdAt: true } }) : Promise.resolve(undefined),
        tx.auditLog.findMany({ where: { tenantId: scope.tenantId, resourceType: { in: activityTypes }, AND: [{ metadata: { path: ['workspaceId'], equals: scope.workspaceId } }, { metadata: { path: ['organizationId'], equals: scope.organizationId } }] }, select: { id: true, resourceType: true, resourceId: true, createdAt: true, actorUser: { select: { displayName: true } } }, orderBy: [{ createdAt: 'desc' }, { id: 'desc' }], take: 8 }),
      ]);
      return { generatedAt: new Date().toISOString(), overdueInvoices: overdue?._count, overdueAmount: overdue ? (overdue._sum.amountDue ?? decimal(0)).toFixed(config.precision) : undefined, outOfStock: stock?.filter(row => row.quantityAvailable.isZero()).length, lowStockItems: stock?.filter(row => row.quantityAvailable.lte(row.item!.reorderPoint)).sort((a, b) => a.quantityAvailable.comparedTo(b.quantityAvailable)).slice(0, 5).map(row => ({ id: row.id, name: row.item!.name, sku: row.item!.sku, warehouse: row.warehouse!.name, quantity: row.quantityAvailable.toString(), reorderPoint: row.item!.reorderPoint.toString() })), recentLeads, activity: activity.map(row => ({ id: row.id, type: row.resourceType, recordId: row.resourceId, at: row.createdAt.toISOString(), actor: row.actorUser?.displayName ?? 'Workspace member' })), customers, leads, dueFollowUps, products: stock ? new Set(stock.map(row => row.itemId)).size : undefined, lowStock: stock?.filter(row => row.quantityAvailable.lte(row.item!.reorderPoint)).length, inventoryValue: stock ? round(stock.reduce((sum, row) => sum.plus(row.inventoryValue), decimal(0)), config.precision).toFixed(config.precision) : undefined, outstanding: debt ? (debt._sum.amountDue ?? decimal(0)).toFixed(config.precision) : undefined, currency: code };
    });
  }

  async completeSetup(dto: ShopBusinessSetupDto) { return this.configure(dto, true); }

  async configure(dto: ShopSettingsDto | ShopBusinessSetupDto, completeSetup = false) {
    if (dto.timeZone) { try { new Intl.DateTimeFormat('en', { timeZone: dto.timeZone }).format(); } catch { throw new BadRequestException('Choose a valid IANA timezone'); } }
    if (dto.category !== undefined && !dto.category.trim()) throw new BadRequestException('Business category is required');
    // ISO currency reference data, never sample financial records.
    const standards: Record<string, { name: string; symbol: string; precision: number }> = {
      INR: { name: 'Indian rupee', symbol: '₹', precision: 2 }, USD: { name: 'US dollar', symbol: '$', precision: 2 }, EUR: { name: 'Euro', symbol: '€', precision: 2 }, GBP: { name: 'Pound sterling', symbol: '£', precision: 2 }, CAD: { name: 'Canadian dollar', symbol: 'CA$', precision: 2 }, AUD: { name: 'Australian dollar', symbol: 'A$', precision: 2 }, JPY: { name: 'Japanese yen', symbol: '¥', precision: 0 }, KWD: { name: 'Kuwaiti dinar', symbol: 'KD', precision: 3 },
    };
    if (!standards[dto.currency]) throw new BadRequestException('Unsupported shop currency');
    return this.prisma.transaction(async tx => {
      const scope = await this.access.require('settings', 'manage', tx);
      await lock(tx, `shop-configuration:${scope.workspaceId}`);
      const workspace = await tx.workspace.findUniqueOrThrow({ where: { id: scope.workspaceId } });
      const metadata = json(workspace.metadata);
      if (metadata.currency !== dto.currency) {
        const counts = await Promise.all([tx.stockBalance.count({ where: whereScope(scope) }), tx.retailSale.count({ where: { tenantId: scope.tenantId, workspaceId: scope.workspaceId } }), tx.financeExpense.count({ where: whereScope(scope) }), tx.invoice.count({ where: whereScope(scope) })]);
        if (counts.some(Boolean)) throw new ConflictException('Currency cannot change after products or financial records exist');
      }
      await tx.currency.upsert({ where: { code: dto.currency }, update: {}, create: { code: dto.currency, ...standards[dto.currency] } });
      await currency(tx, dto.currency);
      const profile = json(metadata.businessProfile ?? null);
      const detailChanges=detailsPatch(dto);
      if(Object.keys(detailChanges).length){const owner=await tx.membership.findFirst({where:{tenantId:scope.tenantId,organizationId:scope.organizationId,userId:scope.userId,deletedAt:null}});if(owner?.title!=='Organization Owner')throw new ForbiddenException('Only the owner can change business details');}
      if (dto.businessName !== undefined) {
        const membership = await tx.membership.findFirst({ where: { tenantId: scope.tenantId, userId: scope.userId, organizationId: scope.organizationId, deletedAt: null } });
        if (membership?.title !== 'Organization Owner') throw new ForbiddenException('Only the owner can change the business profile');
        await lock(tx, 'organization-profile:' + scope.organizationId);
        const duplicate = await tx.organization.findFirst({ where: { tenantId: scope.tenantId, name: trimmed(dto.businessName), id: { not: scope.organizationId } } });
        if (duplicate) throw new ConflictException('This business name is already in use');
        await tx.organization.update({ where: { id: scope.organizationId }, data: { name: trimmed(dto.businessName), ...(dto.countryCode ? { countryCode: dto.countryCode } : {}), ...(dto.category ? { industry: dto.category.trim() } : {}) } });
        if (workspace.businessId) await tx.business.updateMany({ where: { id: workspace.businessId, tenantId: scope.tenantId, organizationId: scope.organizationId }, data: { name: trimmed(dto.businessName), ...(dto.countryCode ? { countryCode: dto.countryCode } : {}), ...(dto.category ? { industry: dto.category.trim() } : {}) } });
      }
      let preferences = readRetailPreferences(metadata.retailPreferences);
      if (completeSetup) {
        const setup = dto as ShopBusinessSetupDto;
        validateRetailPreferences(setup);
        if (preferences.version !== setup.expectedVersion) throw new ConflictException('Workspace changed. Refresh before saving setup.');
        if (!setup.businessName?.trim() || !setup.category?.trim() || !setup.countryCode || !setup.timeZone) throw new BadRequestException('Complete your business details');
        preferences = { version: preferences.version + 1, modules: setup.modules, widgets: setup.widgets };
      }
      await tx.workspace.update({ where: { id: scope.workspaceId }, data: { name: trimmed(dto.name), metadata: { ...metadata, currency: dto.currency, retail: true, ...(dto.businessName !== undefined || Object.keys(detailChanges).length ? { businessProfile: { ...profile, ...detailChanges, businessName: dto.businessName !== undefined ? trimmed(dto.businessName) : String(profile.businessName ?? workspace.name), category: dto.category ?? profile.category ?? '', countryCode: dto.countryCode ?? profile.countryCode ?? '', timeZone: dto.timeZone ?? profile.timeZone ?? 'UTC' } } : {}), ...(completeSetup ? { setupCompletedAt: new Date().toISOString(), retailPreferences: preferences } : {}) } } });
      await audit(tx, scope, 'retail.settings', scope.workspaceId, { name: dto.name.trim(), currency: dto.currency });
      return { saved: true };
    });
  }

  async customers(query: ShopCustomerQueryDto) {
    const scope = await this.access.require('crm', 'read');
    const where: Prisma.CrmCustomerRecordWhereInput = { ...whereScope(scope), ...(query.lifecycleStage ? { lifecycleStage: query.lifecycleStage } : {}), ...(query.search ? { OR: ['name', 'email', 'phone', 'company'].map(field => ({ [field]: { contains: query.search, mode: 'insensitive' } })) } : {}) };
    const [items, total] = await this.prisma.database.$transaction([this.prisma.database.crmCustomerRecord.findMany({ where, orderBy: [{ createdAt: 'desc' }, { id: 'desc' }], ...paging(query) }), this.prisma.database.crmCustomerRecord.count({ where })]);
    return { items, total, page: query.page, limit: query.limit };
  }

  private async customer(tx: Prisma.TransactionClient, scope: RetailScope, id: string) {
    const row = await tx.crmCustomerRecord.findFirst({ where: { ...whereScope(scope), id } });
    if (!row) throw new NotFoundException('Customer not found');
    return row;
  }

  async createCustomer(dto: ShopCustomerDto) {
    key(dto.customerKey);
    return this.prisma.transaction(async tx => {
      const scope = await this.access.require('crm', 'create', tx);
      await lock(tx, `shop-customer:${scope.workspaceId}:${dto.customerKey}`);
      const { customerKey, ...input } = dto;
      const hash = requestHash(input);
      const old = await tx.crmCustomerRecord.findFirst({ where: { tenantId: scope.tenantId, workspaceId: scope.workspaceId, metadata: { path: ['retailKey'], equals: customerKey } } });
      if (old) { matchRequest(String(json(old.metadata).requestHash), hash); if (old.deletedAt) throw new ConflictException('Customer was archived'); return old; }
      const row = await tx.crmCustomerRecord.create({ data: { ...whereScope(scope), ...input, name: trimmed(input.name), ownerUserId: scope.userId, metadata: { retailKey: customerKey, requestHash: hash } } });
      await audit(tx, scope, 'retail.customer', row.id, { name: row.name, lifecycleStage: row.lifecycleStage });
      return row;
    });
  }

  async updateCustomer(id: string, dto: ShopCustomerUpdateDto) {
    return this.prisma.transaction(async tx => {
      const scope = await this.access.require('crm', 'update', tx);
      await lock(tx, `shop-customer-id:${id}`);
      await this.customer(tx, scope, id);
      const row = await tx.crmCustomerRecord.update({ where: { id }, data: { ...dto, name: trimmed(dto.name) } });
      await audit(tx, scope, 'retail.customer', id, { name: row.name, lifecycleStage: row.lifecycleStage });
      return row;
    });
  }

  async followUps(query: ShopQueryDto) {
    const scope = await this.access.require('crm', 'read');
    const where: Prisma.TaskWhereInput = { ...whereScope(scope), metadata: { path: ['source'], equals: 'retail_follow_up' }, ...(query.search ? { title: { contains: query.search, mode: 'insensitive' } } : {}) };
    const [rows, total] = await this.prisma.database.$transaction([this.prisma.database.task.findMany({ where, orderBy: [{ status: 'asc' }, { dueAt: 'asc' }, { id: 'asc' }], ...paging(query) }), this.prisma.database.task.count({ where })]);
    const ids = rows.map(row => String(json(row.metadata).customerId));
    const customers = await this.prisma.database.crmCustomerRecord.findMany({ where: { ...whereScope(scope), id: { in: ids } } });
    return { items: rows.map(row => ({ ...row, customerId: json(row.metadata).customerId, customerName: customers.find(customer => customer.id === json(row.metadata).customerId)?.name ?? 'Customer unavailable' })), total, page: query.page, limit: query.limit };
  }

  async createFollowUp(dto: ShopFollowUpDto) {
    key(dto.followUpKey);
    return this.prisma.transaction(async tx => {
      const scope = await this.access.require('crm', 'create', tx);
      await this.customer(tx, scope, dto.customerId);
      await lock(tx, `shop-follow-up:${scope.workspaceId}:${dto.followUpKey}`);
      const hash = requestHash(dto);
      const old = await tx.task.findFirst({ where: { ...whereScope(scope), metadata: { path: ['retailKey'], equals: dto.followUpKey } } });
      if (old) { matchRequest(String(json(old.metadata).requestHash), hash); return old; }
      const row = await tx.task.create({ data: { ...whereScope(scope), title: trimmed(dto.title), dueAt: new Date(dto.dueAt), priority: dto.priority, createdByUserId: scope.userId, assigneeUserId: scope.userId, metadata: { source: 'retail_follow_up', ...(dto.messageDraft!==undefined?{messageDraft:dto.messageDraft}:{}), customerId: dto.customerId, retailKey: dto.followUpKey, requestHash: hash } } });
      await audit(tx, scope, 'retail.follow_up', row.id, { customerId: dto.customerId, dueAt: dto.dueAt });
      return row;
    });
  }

  async updateFollowUp(id: string, status: 'TODO' | 'DONE' | 'CANCELED') {
    return this.prisma.transaction(async tx => {
      const scope = await this.access.require('crm', 'update', tx);
      await lock(tx, `shop-follow-up-id:${id}`);
      const row = await tx.task.findFirst({ where: { ...whereScope(scope), id, metadata: { path: ['source'], equals: 'retail_follow_up' } } });
      if (!row) throw new NotFoundException('Follow-up not found');
      const result = await tx.task.update({ where: { id }, data: { status } });
      await audit(tx, scope, 'retail.follow_up', id, { status });
      return result;
    });
  }

  async products(query: ShopQueryDto) {
    const scope = await this.access.require('inventory', 'read');
    const where: Prisma.StockBalanceWhereInput = { ...whereScope(scope), item: { ...whereScope(scope), status: 'active', ...(query.search ? { AND: catalogueWords(query.search).map(word=>({OR:[{name:{contains:word,mode:'insensitive' as const}},{sku:{contains:word,mode:'insensitive' as const}}]})) } : {}) }, warehouse: { ...whereScope(scope), status: 'active' } };
    const [items, total] = await this.prisma.database.$transaction([this.prisma.database.stockBalance.findMany({ where, include: { item: true, warehouse: true }, orderBy: [{ createdAt: 'desc' }, { id: 'desc' }], ...paging(query) }), this.prisma.database.stockBalance.count({ where })]);
    return { items: items.map(row => ({ id: row.id, name: row.item!.name, sku: row.item!.sku, unitPrice: json(row.item!.metadata).unitPrice ?? null, currency: row.costingCurrency, quantity: row.quantityAvailable.toString(), inventoryValue: row.inventoryValue.toString(), reorderPoint: row.item!.reorderPoint.toString(), warehouse: row.warehouse!.name })), total, page: query.page, limit: query.limit };
  }

  async createProduct(dto: ShopProductDto) {
    key(dto.productKey);
    return this.prisma.transaction(async tx => {
      const scope = await this.access.require('inventory', 'create', tx);
      await lock(tx, `shop-configuration:${scope.workspaceId}`);
      const code = await this.shopCurrency(tx, scope);
      const config = await currency(tx, code);
      const price = money(dto.unitPrice, config.precision), cost = money(dto.unitCost, config.precision);
      const opening = decimal(dto.openingQuantity), reorder = decimal(dto.reorderPoint);
      if (opening.lt(0) || reorder.lt(0) || opening.decimalPlaces() > 4 || reorder.decimalPlaces() > 4 || opening.gte('100000000000000') || reorder.gte('100000000000000')) throw new BadRequestException('Invalid stock quantity');
      if (!opening.isZero()) await this.access.require('inventory', 'update', tx);
      const hash = requestHash(dto);
      const itemKey = `shop:${scope.workspaceId}:${dto.productKey}`;
      const old = await tx.supplyChainItem.findUnique({ where: { tenantId_itemKey: { tenantId: scope.tenantId, itemKey } } });
      if (old) { matchRequest(String(json(old.metadata).requestHash), hash); return { id: String(json(old.metadata).stockId) }; }
      if (await tx.supplyChainItem.findFirst({ where: { tenantId: scope.tenantId, sku: dto.sku.trim() } })) throw new ConflictException('This SKU already exists in your organization');
      const warehouseKey = `shop:${scope.workspaceId}`;
      let warehouse = await tx.warehouse.findUnique({ where: { tenantId_warehouseKey: { tenantId: scope.tenantId, warehouseKey } } });
      if (!warehouse) warehouse = await tx.warehouse.create({ data: { tenantId: scope.tenantId, workspaceId: scope.workspaceId, warehouseKey, name: 'Shop stockroom' } });
      if (warehouse.workspaceId !== scope.workspaceId || warehouse.deletedAt || warehouse.status !== 'active') throw new ConflictException('Shop stockroom is unavailable');
      const item = await tx.supplyChainItem.create({ data: { tenantId: scope.tenantId, workspaceId: scope.workspaceId, itemKey, sku: trimmed(dto.sku), name: trimmed(dto.name), reorderPoint: reorder } });
      const stock = await tx.stockBalance.create({ data: { tenantId: scope.tenantId, workspaceId: scope.workspaceId, itemId: item.id, warehouseId: warehouse.id, stockKey: itemKey, costingCurrency: code } });
      await tx.supplyChainItem.update({ where: { id: item.id }, data: { metadata: { unitPrice: price.toFixed(config.precision), requestHash: hash, stockId: stock.id } } });
      if (!opening.isZero()) await this.inventory.mutate(tx, scope, { stockId: stock.id, quantity: quantity(opening), value: round(opening.times(cost), 4), movementKey: `opening:${stock.id}`, movementType: 'OPENING', reason: 'Opening stock recorded at product creation', currency: code, requestHash: hash });
      await audit(tx, scope, 'retail.product', item.id, { sku: item.sku, openingQuantity: opening.toString() });
      return { id: stock.id };
    });
  }

  async movements(stockId: string, query: ShopQueryDto) {
    const scope = await this.access.require('inventory', 'read');
    await this.inventory.ownedStock(this.prisma.database, scope, stockId);
    const where = { ...whereScope(scope), stockId };
    const [items, total] = await this.prisma.database.$transaction([this.prisma.database.inventoryMovementHistory.findMany({ where, orderBy: [{ occurredAt: 'desc' }, { id: 'desc' }], ...paging(query) }), this.prisma.database.inventoryMovementHistory.count({ where })]);
    return { items, total, page: query.page, limit: query.limit };
  }

  async updateProduct(stockId: string, dto: ShopProductUpdateDto) {
    return this.prisma.transaction(async tx => {
      const scope = await this.access.require('inventory', 'update', tx);
      await lock(tx, `stock:${stockId}`);
      const stock = await this.inventory.ownedStock(tx, scope, stockId);
      const config = await currency(tx, stock.costingCurrency ?? '');
      const item = await tx.supplyChainItem.findUniqueOrThrow({ where: { id: stock.itemId! } });
      const reorder = decimal(dto.reorderPoint);
      if (reorder.lt(0) || reorder.decimalPlaces() > 4 || reorder.gte('100000000000000')) throw new BadRequestException('Invalid low stock threshold');
      await tx.supplyChainItem.update({ where: { id: item.id }, data: { name: trimmed(dto.name), reorderPoint: reorder, metadata: { ...json(item.metadata), unitPrice: money(dto.unitPrice, config.precision).toFixed(config.precision) } } });
      await audit(tx, scope, 'retail.product', item.id, { name: dto.name.trim(), unitPrice: dto.unitPrice, reorderPoint: dto.reorderPoint });
      return { saved: true };
    });
  }

  async expenses(query: ShopQueryDto) {
    const scope = await this.access.require('finance', 'read');
    const where: Prisma.FinanceExpenseWhereInput = { ...whereScope(scope), ...(query.search ? { OR: [{ category: { contains: query.search, mode: 'insensitive' } }, { vendor: { contains: query.search, mode: 'insensitive' } }] } : {}) };
    const [items, total] = await this.prisma.database.$transaction([this.prisma.database.financeExpense.findMany({ where, orderBy: [{ incurredAt: 'desc' }, { id: 'desc' }], ...paging(query) }), this.prisma.database.financeExpense.count({ where })]);
    return { items, total, page: query.page, limit: query.limit };
  }

  async createExpense(dto: ShopExpenseDto) {
    key(dto.expenseKey);
    return this.prisma.transaction(async tx => {
      const scope = await this.access.require('finance', 'create', tx);
      await this.access.require('finance', 'approve', tx);
      await lock(tx, `shop-configuration:${scope.workspaceId}`);
      const code = await this.shopCurrency(tx, scope), config = await currency(tx, code);
      await lock(tx, `shop-expense:${scope.workspaceId}:${dto.expenseKey}`);
      const hash = requestHash(dto);
      const old = await tx.financeExpense.findFirst({ where: { tenantId: scope.tenantId, workspaceId: scope.workspaceId, metadata: { path: ['retailKey'], equals: dto.expenseKey } } });
      if (old) { matchRequest(String(json(old.metadata).requestHash), hash); return old; }
      const row = await tx.financeExpense.create({ data: { ...whereScope(scope), category: trimmed(dto.category), vendor: trimmed(dto.vendor), description: dto.description, amount: money(dto.amount, config.precision, true), currency: code, status: 'approved', incurredAt: new Date(dto.incurredAt), metadata: { retailKey: dto.expenseKey, requestHash: hash } } });
      await audit(tx, scope, 'retail.expense', row.id, { amount: row.amount.toString(), currency: code });
      return row;
    });
  }

  private async shopCurrency(tx: Prisma.TransactionClient, scope: RetailScope) {
    const workspace = await tx.workspace.findUniqueOrThrow({ where: { id: scope.workspaceId } });
    const code = json(workspace.metadata).currency;
    if (typeof code !== 'string') throw new BadRequestException('Choose your shop currency in settings first');
    return code;
  }
}
