
import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { randomUUID } from 'node:crypto';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { EventBusService } from '../events/event-bus.service';
import { TenantContextService } from '../tenants/tenant-context.service';
import { CreateInventoryAuditDto, CreateInventoryBatchDto, CreateInventoryMovementHistoryDto, CreateInventorySerialDto, CreateStockBalanceDto, CreateSupplyChainItemDto } from './dto/supply-chain.dto';
import { InventoryLedgerService } from '../retail/inventory-ledger.service';
import { RetailAccessService, RetailScope } from '../retail/retail-access.service';
import { currency, key, lock, matchRequest, reason, requestHash } from '../retail/retail-transaction';
import { decimal, money, quantity, round } from '../retail/money';

@Injectable()
export class InventoryCoreService {
  constructor(private readonly prisma: PrismaService, private readonly context: TenantContextService, private readonly events: EventBusService, private readonly access: RetailAccessService, private readonly ledger: InventoryLedgerService) {}

  private relatedScope() { return { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId(), deletedAt: null }; }
  private async scope(action: string, workspaceId?: string) {
    const scope = await this.access.require('inventory', action);
    if (workspaceId && workspaceId !== scope.workspaceId) throw new ForbiddenException('Workspace override is not permitted');
    return scope;
  }
  private async references(scope: RetailScope, dto: { itemId?: string; warehouseId?: string; batchId?: string; zoneId?: string; binId?: string; currentWarehouseId?: string; currentBinId?: string }, tx: Prisma.TransactionClient = this.prisma.database) {
    const where = { tenantId: scope.tenantId, workspaceId: scope.workspaceId, deletedAt: null };
    if (dto.itemId && !await tx.supplyChainItem.findFirst({ where: { ...where, id: dto.itemId } })) throw new NotFoundException('Item not found');
    const warehouseId = dto.warehouseId ?? dto.currentWarehouseId;
    if (warehouseId && !await tx.warehouse.findFirst({ where: { ...where, id: warehouseId } })) throw new NotFoundException('Warehouse not found');
    if (dto.batchId && !await tx.inventoryBatch.findFirst({ where: { ...where, id: dto.batchId, ...(dto.itemId ? { itemId: dto.itemId } : {}) } })) throw new NotFoundException('Batch not found');
    if (dto.zoneId && !await tx.warehouseZone.findFirst({ where: { ...where, id: dto.zoneId, ...(warehouseId ? { warehouseId } : {}) } })) throw new NotFoundException('Zone not found');
    const binId = dto.binId ?? dto.currentBinId;
    if (binId && !await tx.warehouseBin.findFirst({ where: { ...where, id: binId, ...(warehouseId ? { warehouseId } : {}), ...(dto.zoneId ? { zoneId: dto.zoneId } : {}) } })) throw new NotFoundException('Bin not found');
  }

  async items(status?: string, category?: string) {
    await this.scope('read');
    return this.prisma.supplyChainItem.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, status: status ?? undefined, category: category ?? undefined, deletedAt: null }, include: { stockBalances: { where: this.relatedScope() }, batches: { where: this.relatedScope() }, serials: { where: this.relatedScope() }, audits: { where: this.relatedScope() }, movements: { where: this.relatedScope() }, replenishmentPlans: { where: this.relatedScope() } }, orderBy: { updatedAt: 'desc' }, take: 100 });
  }

  async createItem(dto: CreateSupplyChainItemDto) {
    await this.scope('create', dto.workspaceId);
    if (!dto.sku.trim() || !dto.name.trim() || decimal(dto.reorderPoint ?? 0).lt(0) || decimal(dto.safetyStock ?? 0).lt(0) || (dto.leadTimeDays ?? 0) < 0) throw new BadRequestException('Valid name, SKU and nonnegative thresholds are required');
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    const record = await this.prisma.supplyChainItem.create({ data: { tenantId, workspaceId, itemKey: dto.itemKey ?? 'supply-item-' + randomUUID(), sku: dto.sku, name: dto.name, itemType: dto.itemType ?? 'inventory', status: dto.status ?? 'active', category: dto.category, unitOfMeasure: dto.unitOfMeasure ?? 'each', trackBatch: dto.trackBatch ?? false, trackSerial: dto.trackSerial ?? false, reorderPoint: dto.reorderPoint ?? 0, safetyStock: dto.safetyStock ?? 0, leadTimeDays: dto.leadTimeDays ?? 0, metadata: dto.metadata ?? {} } });
    await this.events.publish({ tenantId, workspaceId, type: 'supply.item.created', source: 'supply-chain', subject: { type: 'supply_chain_item', id: record.id }, payload: { sku: record.sku, status: record.status, trackBatch: record.trackBatch, trackSerial: record.trackSerial }, actorUserId: this.context.context()?.userId });
    return record;
  }

  async stock(status?: string, itemId?: string, warehouseId?: string) {
    await this.scope('read');
    return this.prisma.stockBalance.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, status: status ?? undefined, itemId: itemId ?? undefined, warehouseId: warehouseId ?? undefined, deletedAt: null }, include: { item: { where: this.relatedScope() }, warehouse: { where: this.relatedScope() }, zone: { where: this.relatedScope() }, bin: { where: this.relatedScope() }, batch: { where: this.relatedScope() } }, orderBy: { updatedAt: 'desc' }, take: 100 });
  }

  async createStock(dto: CreateStockBalanceDto) {
    const scope = await this.scope('create', dto.workspaceId);
    const stockKey = key(dto.stockKey ?? '');
    const qty = decimal(dto.quantityOnHand ?? 0);
    if (qty.lt(0) || qty.decimalPlaces() > 4 || !qty.eq(dto.quantityAvailable ?? qty) || !decimal(dto.quantityReserved ?? 0).eq(0) || !decimal(dto.quantityDamaged ?? 0).eq(0) || dto.batchId || dto.zoneId || dto.binId || !dto.itemId || !dto.warehouseId) throw new BadRequestException('Opening stock requires an item, warehouse and equal nonnegative on-hand/available quantities; reserved, damaged, batch and bin balances are unsupported');
    const hash = requestHash([scope.workspaceId, dto.itemId, dto.warehouseId, qty.toString(), dto.costingCurrency ?? null, dto.unitCost ?? null, dto.reason ?? null]);
    return this.prisma.transaction(async tx => {
      await this.access.require('inventory', 'create', tx);
      await this.references(scope, dto, tx);
      await lock(tx, `stock-key:${scope.tenantId}:${stockKey}`);
      const existing = await tx.stockBalance.findUnique({ where: { tenantId_stockKey: { tenantId: scope.tenantId, stockKey } } });
      if (existing) { matchRequest((existing.metadata as Record<string, string>).openingHash, hash); return existing; }
      const row = await tx.stockBalance.create({ data: { tenantId: scope.tenantId, workspaceId: scope.workspaceId, itemId: dto.itemId, warehouseId: dto.warehouseId, stockKey, metadata: { ...(dto.metadata as Prisma.JsonObject ?? {}), openingHash: hash } } });
      if (qty.gt(0)) {
        if (!dto.costingCurrency || dto.unitCost === undefined) throw new BadRequestException('Opening stock requires currency, unit cost and a reason');
        const config = await currency(tx, dto.costingCurrency);
        await this.ledger.mutate(tx, scope, { stockId: row.id, quantity: quantity(qty), movementKey: `opening:${row.id}`, movementType: 'RECEIPT', currency: dto.costingCurrency, value: round(qty.times(money(dto.unitCost, config.precision)), 4), reason: reason(dto.reason ?? ''), requestHash: hash });
      }
      return tx.stockBalance.findUniqueOrThrow({ where: { id: row.id } });
    });
  }

  async batches(status?: string, itemId?: string) {
    await this.scope('read');
    return this.prisma.inventoryBatch.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, status: status ?? undefined, itemId: itemId ?? undefined, deletedAt: null }, include: { item: { where: this.relatedScope() }, serials: { where: this.relatedScope() }, stockBalances: { where: this.relatedScope() } }, orderBy: { updatedAt: 'desc' }, take: 100 });
  }

  async createBatch(dto: CreateInventoryBatchDto) {
    const scope = await this.scope('create', dto.workspaceId);
    await this.references(scope, dto);
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    const record = await this.prisma.inventoryBatch.create({ data: { tenantId, workspaceId, itemId: dto.itemId, batchKey: dto.batchKey ?? 'inventory-batch-' + randomUUID(), batchNumber: dto.batchNumber, status: dto.status ?? 'active', manufacturedAt: dto.manufacturedAt ? new Date(dto.manufacturedAt) : undefined, expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : undefined, receivedAt: dto.receivedAt ? new Date(dto.receivedAt) : undefined, supplierReference: dto.supplierReference, qualityStatus: dto.qualityStatus ?? 'pending', metadata: dto.metadata ?? {} } });
    await this.events.publish({ tenantId, workspaceId, type: 'inventory.batch.created', source: 'supply-chain', subject: { type: 'inventory_batch', id: record.id }, payload: { batchKey: record.batchKey, batchNumber: record.batchNumber, qualityStatus: record.qualityStatus }, actorUserId: this.context.context()?.userId });
    return record;
  }

  async serials(status?: string, itemId?: string) {
    await this.scope('read');
    return this.prisma.inventorySerial.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, status: status ?? undefined, itemId: itemId ?? undefined, deletedAt: null }, include: { item: { where: this.relatedScope() }, batch: { where: this.relatedScope() } }, orderBy: { updatedAt: 'desc' }, take: 100 });
  }

  async createSerial(dto: CreateInventorySerialDto) {
    const scope = await this.scope('create', dto.workspaceId);
    await this.references(scope, dto);
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    const record = await this.prisma.inventorySerial.create({ data: { tenantId, workspaceId, itemId: dto.itemId, batchId: dto.batchId, serialKey: dto.serialKey ?? 'inventory-serial-' + randomUUID(), serialNumber: dto.serialNumber, status: dto.status ?? 'available', currentWarehouseId: dto.currentWarehouseId, currentBinId: dto.currentBinId, activatedAt: dto.activatedAt ? new Date(dto.activatedAt) : undefined, warrantyExpiresAt: dto.warrantyExpiresAt ? new Date(dto.warrantyExpiresAt) : undefined, metadata: dto.metadata ?? {} } });
    await this.events.publish({ tenantId, workspaceId, type: 'inventory.serial.created', source: 'supply-chain', subject: { type: 'inventory_serial', id: record.id }, payload: { serialKey: record.serialKey, status: record.status }, actorUserId: this.context.context()?.userId });
    return record;
  }

  async audits(status?: string, warehouseId?: string) {
    await this.scope('read');
    return this.prisma.inventoryAudit.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, status: status ?? undefined, warehouseId: warehouseId ?? undefined, deletedAt: null }, include: { item: { where: this.relatedScope() }, warehouse: { where: this.relatedScope() } }, orderBy: { auditedAt: 'desc' }, take: 100 });
  }

  async createAudit(dto: CreateInventoryAuditDto) {
    const scope = await this.scope('create', dto.workspaceId);
    await this.references(scope, dto);
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    const record = await this.prisma.inventoryAudit.create({ data: { tenantId, workspaceId, itemId: dto.itemId, warehouseId: dto.warehouseId, auditKey: dto.auditKey ?? 'inventory-audit-' + randomUUID(), auditType: dto.auditType ?? 'cycle_count', status: dto.status ?? 'open', countedQuantity: dto.countedQuantity ?? 0, expectedQuantity: dto.expectedQuantity ?? 0, varianceQuantity: dto.varianceQuantity ?? 0, auditorUserId: scope.userId, auditedAt: dto.auditedAt ? new Date(dto.auditedAt) : undefined, findings: dto.findings ?? [], metadata: dto.metadata ?? {} } });
    await this.events.publish({ tenantId, workspaceId, type: 'inventory.audit.created', source: 'supply-chain', subject: { type: 'inventory_audit', id: record.id }, payload: { auditKey: record.auditKey, status: record.status, varianceQuantity: record.varianceQuantity }, actorUserId: this.context.context()?.userId });
    return record;
  }

  async movements(status?: string, movementType?: string, itemId?: string) {
    await this.scope('read');
    return this.prisma.inventoryMovementHistory.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, status: status ?? undefined, movementType: movementType ?? undefined, itemId: itemId ?? undefined, deletedAt: null }, include: { item: { where: this.relatedScope() }, warehouse: { where: this.relatedScope() }, sourceBin: { where: this.relatedScope() }, destinationBin: { where: this.relatedScope() } }, orderBy: { occurredAt: 'desc' }, take: 100 });
  }

  async createMovement(dto: CreateInventoryMovementHistoryDto) {
    const scope = await this.scope('update', dto.workspaceId);
    if (dto.status && dto.status !== 'posted' || dto.referenceId || dto.referenceType || dto.sourceBinId || dto.destinationBinId || dto.occurredAt) throw new BadRequestException('Movement status, references and time are server-controlled');
    const stock = dto.stockId ? await this.ledger.ownedStock(this.prisma.database, scope, dto.stockId) : null;
    if (!stock || dto.itemId && dto.itemId !== stock.itemId || dto.warehouseId && dto.warehouseId !== stock.warehouseId) throw new NotFoundException('Matching stock balance is required');
    return this.ledger.post({ stockId: stock.id, quantity: String(dto.quantity ?? 0), movementKey: dto.movementKey ?? '', movementType: dto.movementType.toUpperCase() as 'RECEIPT' | 'ADJUSTMENT', reason: dto.reason ?? '', currency: dto.currency ?? '', unitCost: dto.unitCost });
  }

  async dashboard() {
    const [items, stock, audits, movements] = await Promise.all([this.items(), this.stock(), this.audits(), this.movements()]);
    return { items, stock, audits, movements, summary: { itemCount: items.length, stockBalanceCount: stock.length, auditCount: audits.length, openAuditCount: audits.filter((audit: { status: string }) => audit.status === 'open').length, movementCount: movements.length } };
  }
}
