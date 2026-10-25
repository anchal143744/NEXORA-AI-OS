
import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { EventBusService } from '../events/event-bus.service';
import { TenantContextService } from '../tenants/tenant-context.service';
import { CreateInventoryTransferDto, CreateReceivingRecordDto, CreateWarehouseBinDto, CreateWarehouseDto, CreateWarehouseZoneDto } from './dto/supply-chain.dto';

@Injectable()
export class WarehouseManagementService {
  constructor(private readonly prisma: PrismaService, private readonly context: TenantContextService, private readonly events: EventBusService) {}

  warehouses(status?: string, warehouseType?: string) {
    return this.prisma.warehouse.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, status: status ?? undefined, warehouseType: warehouseType ?? undefined, deletedAt: null }, include: { zones: true, bins: true, stockBalances: true, receivingRecords: true, fulfillmentOrders: true, shipments: true, distributionCenters: true }, orderBy: { updatedAt: 'desc' }, take: 100 });
  }

  async createWarehouse(dto: CreateWarehouseDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    const record = await this.prisma.warehouse.create({ data: { tenantId, workspaceId, warehouseKey: dto.warehouseKey ?? 'warehouse-' + randomUUID(), name: dto.name, warehouseType: dto.warehouseType ?? 'standard', status: dto.status ?? 'active', countryCode: dto.countryCode, region: dto.region, timezone: dto.timezone, address: dto.address ?? {}, capabilities: dto.capabilities ?? {}, metadata: dto.metadata ?? {} } });
    await this.events.publish({ tenantId, workspaceId, type: 'warehouse.created', source: 'supply-chain', subject: { type: 'warehouse', id: record.id }, payload: { warehouseKey: record.warehouseKey, status: record.status, warehouseType: record.warehouseType }, actorUserId: this.context.context()?.userId });
    return record;
  }

  zones(status?: string, warehouseId?: string) {
    return this.prisma.warehouseZone.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, status: status ?? undefined, warehouseId: warehouseId ?? undefined, deletedAt: null }, include: { warehouse: true, bins: true }, orderBy: { updatedAt: 'desc' }, take: 100 });
  }

  async createZone(dto: CreateWarehouseZoneDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    return this.prisma.warehouseZone.create({ data: { tenantId, workspaceId, warehouseId: dto.warehouseId, zoneKey: dto.zoneKey ?? 'warehouse-zone-' + randomUUID(), name: dto.name, zoneType: dto.zoneType ?? 'storage', status: dto.status ?? 'active', temperatureClass: dto.temperatureClass, metadata: dto.metadata ?? {} } });
  }

  bins(status?: string, warehouseId?: string, zoneId?: string) {
    return this.prisma.warehouseBin.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, status: status ?? undefined, warehouseId: warehouseId ?? undefined, zoneId: zoneId ?? undefined, deletedAt: null }, include: { warehouse: true, zone: true, stockBalances: true }, orderBy: { updatedAt: 'desc' }, take: 100 });
  }

  async createBin(dto: CreateWarehouseBinDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    return this.prisma.warehouseBin.create({ data: { tenantId, workspaceId, warehouseId: dto.warehouseId, zoneId: dto.zoneId, binKey: dto.binKey ?? 'warehouse-bin-' + randomUUID(), code: dto.code, binType: dto.binType ?? 'storage', status: dto.status ?? 'active', capacity: dto.capacity, metadata: dto.metadata ?? {} } });
  }

  transfers(status?: string, sourceWarehouseId?: string, destinationWarehouseId?: string) {
    return this.prisma.inventoryTransfer.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, status: status ?? undefined, sourceWarehouseId: sourceWarehouseId ?? undefined, destinationWarehouseId: destinationWarehouseId ?? undefined, deletedAt: null }, include: { sourceWarehouse: true, destinationWarehouse: true }, orderBy: { requestedAt: 'desc' }, take: 100 });
  }

  async createTransfer(dto: CreateInventoryTransferDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    const record = await this.prisma.inventoryTransfer.create({ data: { tenantId, workspaceId, sourceWarehouseId: dto.sourceWarehouseId, destinationWarehouseId: dto.destinationWarehouseId, transferKey: dto.transferKey ?? 'inventory-transfer-' + randomUUID(), transferNumber: dto.transferNumber, status: dto.status ?? 'draft', priority: dto.priority ?? 'normal', requestedByUserId: dto.requestedByUserId, requestedAt: dto.requestedAt ? new Date(dto.requestedAt) : undefined, shippedAt: dto.shippedAt ? new Date(dto.shippedAt) : undefined, receivedAt: dto.receivedAt ? new Date(dto.receivedAt) : undefined, lineItems: dto.lineItems ?? [], metadata: dto.metadata ?? {} } });
    await this.events.publish({ tenantId, workspaceId, type: 'inventory.transfer.created', source: 'supply-chain', subject: { type: 'inventory_transfer', id: record.id }, payload: { transferKey: record.transferKey, transferNumber: record.transferNumber, status: record.status }, actorUserId: this.context.context()?.userId });
    return record;
  }

  receiving(status?: string, warehouseId?: string, itemId?: string) {
    return this.prisma.receivingRecord.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, status: status ?? undefined, warehouseId: warehouseId ?? undefined, itemId: itemId ?? undefined, deletedAt: null }, include: { warehouse: true, item: true }, orderBy: { receivedAt: 'desc' }, take: 100 });
  }

  async createReceiving(dto: CreateReceivingRecordDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    const record = await this.prisma.receivingRecord.create({ data: { tenantId, workspaceId, warehouseId: dto.warehouseId, itemId: dto.itemId, receivingKey: dto.receivingKey ?? 'receiving-' + randomUUID(), receivingNumber: dto.receivingNumber, vendorId: dto.vendorId, status: dto.status ?? 'pending', receivedQuantity: dto.receivedQuantity ?? 0, rejectedQuantity: dto.rejectedQuantity ?? 0, receivedAt: dto.receivedAt ? new Date(dto.receivedAt) : undefined, qualityStatus: dto.qualityStatus ?? 'pending', documents: dto.documents ?? [], metadata: dto.metadata ?? {} } });
    await this.events.publish({ tenantId, workspaceId, type: 'receiving.record.created', source: 'supply-chain', subject: { type: 'receiving_record', id: record.id }, payload: { receivingKey: record.receivingKey, receivedQuantity: record.receivedQuantity, qualityStatus: record.qualityStatus }, actorUserId: this.context.context()?.userId });
    return record;
  }

  async dashboard() {
    const [warehouses, zones, bins, transfers, receiving] = await Promise.all([this.warehouses(), this.zones(), this.bins(), this.transfers(), this.receiving()]);
    return { warehouses, zones, bins, transfers, receiving, summary: { warehouseCount: warehouses.length, zoneCount: zones.length, binCount: bins.length, openTransferCount: transfers.filter((transfer: { status: string }) => transfer.status !== 'received').length, receivingCount: receiving.length } };
  }
}
