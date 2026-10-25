import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { RetailAccessService, RetailScope } from './retail-access.service';
import { audit, currency, key, lock, matchRequest, reason, requestHash } from './retail-transaction';
import { decimal, money, quantity, round } from './money';

export type StockCommand = { stockId: string; quantity: string; movementKey: string; movementType: 'RECEIPT' | 'ADJUSTMENT'; reason: string; currency: string; unitCost?: string };
export type StockMutation = { stockId: string; quantity: Prisma.Decimal; movementKey: string; movementType: string; reason: string; currency: string; value?: Prisma.Decimal; referenceId?: string; requestHash: string };

@Injectable()
export class InventoryLedgerService {
  constructor(private readonly prisma: PrismaService, private readonly access: RetailAccessService) {}

  async post(input: StockCommand) {
    const qty = quantity(input.quantity, input.movementType === 'ADJUSTMENT');
    if (!['RECEIPT', 'ADJUSTMENT'].includes(input.movementType)) throw new BadRequestException('Sales and returns must use the sale lifecycle');
    const movementKey = key(input.movementKey);
    const why = reason(input.reason);
    return this.prisma.transaction(async tx => {
      const scope = await this.access.require('inventory', 'update', tx);
      const config = await currency(tx, input.currency);
      const value = input.unitCost === undefined ? undefined : round(qty.abs().times(money(input.unitCost, config.precision)), 4);
      if (input.movementType === 'RECEIPT' && value === undefined) throw new BadRequestException('Receipt unit cost is required');
      if (qty.lt(0) && value !== undefined) throw new BadRequestException('Negative adjustments use the recorded average cost');
      const hash = requestHash([scope.workspaceId, input.stockId, qty.toString(), input.movementType, why, input.currency, input.unitCost === undefined ? null : money(input.unitCost, config.precision).toString()]);
      return this.mutate(tx, scope, { stockId: input.stockId, quantity: qty, movementKey, movementType: input.movementType, reason: why, currency: input.currency, value, requestHash: hash });
    });
  }

  async ownedStock(tx: Prisma.TransactionClient, scope: RetailScope, id: string) {
    const stock = await tx.stockBalance.findFirst({ where: { id, tenantId: scope.tenantId, workspaceId: scope.workspaceId, deletedAt: null } });
    if (!stock || !stock.itemId || !stock.warehouseId) throw new NotFoundException('Stock balance not found');
    const item = await tx.supplyChainItem.findFirst({ where: { id: stock.itemId, tenantId: scope.tenantId, workspaceId: scope.workspaceId, deletedAt: null, status: 'active' } });
    const warehouse = await tx.warehouse.findFirst({ where: { id: stock.warehouseId, tenantId: scope.tenantId, workspaceId: scope.workspaceId, deletedAt: null, status: 'active' } });
    if (!item || !warehouse) throw new NotFoundException('Stock ownership is invalid');
    if (item.trackBatch || item.trackSerial || stock.batchId || stock.binId || stock.zoneId) throw new BadRequestException('Retail stock posting currently requires an unbatched, unserialized warehouse balance');
    if (!decimal(stock.quantityOnHand).eq(decimal(stock.quantityAvailable).plus(stock.quantityReserved).plus(stock.quantityDamaged)) || decimal(stock.quantityReserved).lt(0) || decimal(stock.quantityDamaged).lt(0) || decimal(stock.inventoryValue).lt(0)) throw new ConflictException('Stock balance requires reconciliation before posting');
    return stock;
  }

  async mutate(tx: Prisma.TransactionClient, scope: RetailScope, input: StockMutation) {
    await lock(tx, `inventory:${scope.tenantId}:${input.movementKey}`);
    const existing = await tx.inventoryMovementHistory.findUnique({ where: { tenantId_movementKey: { tenantId: scope.tenantId, movementKey: input.movementKey } } });
    if (existing) {
      if (existing.workspaceId !== scope.workspaceId) throw new NotFoundException('Movement not found');
      matchRequest((existing.metadata as Record<string, string>).requestHash, input.requestHash);
      return existing;
    }
    await lock(tx, `stock:${input.stockId}`);
    const stock = await this.ownedStock(tx, scope, input.stockId);
    const qty = quantity(input.quantity, true);
    if (stock.costingCurrency && stock.costingCurrency !== input.currency) throw new BadRequestException('Stock costing currency cannot be mixed');
    if (!stock.costingCurrency && !stock.quantityOnHand.isZero()) throw new ConflictException('Existing stock needs a verified opening valuation');
    const oldValue = decimal(stock.inventoryValue);
    const oldQty = decimal(stock.quantityOnHand);
    if (qty.isNegative() && decimal(stock.quantityAvailable).lt(qty.abs())) throw new ConflictException('Insufficient available stock');
    let movementValue: Prisma.Decimal;
    if (qty.isNegative()) movementValue = oldQty.eq(qty.abs()) ? oldValue.negated() : round(oldValue.times(qty).dividedBy(oldQty), 4);
    else if (input.value !== undefined) movementValue = decimal(input.value);
    else if (oldQty.gt(0)) movementValue = round(oldValue.times(qty).dividedBy(oldQty), 4);
    else throw new BadRequestException('A unit cost is required for an increase from zero stock');
    const nextValue = oldValue.plus(movementValue);
    if (nextValue.lt(0) || nextValue.gte('100000000000000')) throw new BadRequestException('Inventory valuation is outside supported range');
    const changed = await tx.stockBalance.updateMany({ where: { id: stock.id, tenantId: scope.tenantId, workspaceId: scope.workspaceId, deletedAt: null, ...(qty.lt(0) ? { quantityAvailable: { gte: qty.abs() } } : {}) }, data: { quantityOnHand: { increment: qty }, quantityAvailable: { increment: qty }, inventoryValue: nextValue, costingCurrency: input.currency } });
    if (changed.count !== 1) throw new ConflictException('Stock changed during posting');
    const movement = await tx.inventoryMovementHistory.create({ data: { stockId: stock.id, tenantId: scope.tenantId, workspaceId: scope.workspaceId, itemId: stock.itemId, warehouseId: stock.warehouseId, movementKey: input.movementKey, movementType: input.movementType, quantity: qty, status: 'posted', referenceType: input.referenceId ? 'retail_sale' : undefined, referenceId: input.referenceId, metadata: { stockId: stock.id, organizationId: scope.organizationId, actorUserId: scope.userId, reason: input.reason, currency: input.currency, requestHash: input.requestHash, value: movementValue.toFixed(4), balanceAfter: oldQty.plus(qty).toFixed(4), inventoryValueAfter: nextValue.toFixed(4) } } });
    await audit(tx, scope, 'inventory.movement', movement.id, { stockId: stock.id, quantity: qty.toString(), value: movementValue.toString(), reason: input.reason });
    await tx.event.create({ data: { tenantId: scope.tenantId, workspaceId: scope.workspaceId, eventType: 'inventory.movement.recorded', source: 'retail', subjectType: 'inventory_movement_history', subjectId: movement.id, payload: { movementId: movement.id }, status: 'PENDING' } });
    return movement;
  }
}
