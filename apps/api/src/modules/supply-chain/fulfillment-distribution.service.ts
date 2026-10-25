
import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { EventBusService } from '../events/event-bus.service';
import { TenantContextService } from '../tenants/tenant-context.service';
import { classifyDelayRisk } from './supply-chain-calculations';
import { CreateCarrierDto, CreateDistributionCenterDto, CreateFulfillmentOrderDto, CreatePackingTaskDto, CreatePickingTaskDto, CreateRouteOptimizationPlanDto, CreateShipmentDto, CreateShipmentTrackingEventDto } from './dto/supply-chain.dto';

@Injectable()
export class FulfillmentDistributionService {
  constructor(private readonly prisma: PrismaService, private readonly context: TenantContextService, private readonly events: EventBusService) {}

  fulfillmentOrders(status?: string, priority?: string, warehouseId?: string) {
    return this.prisma.fulfillmentOrder.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, status: status ?? undefined, priority: priority ?? undefined, warehouseId: warehouseId ?? undefined, deletedAt: null }, include: { warehouse: true, pickingTasks: true, packingTasks: true, shipments: true }, orderBy: { updatedAt: 'desc' }, take: 100 });
  }

  async createFulfillmentOrder(dto: CreateFulfillmentOrderDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    const record = await this.prisma.fulfillmentOrder.create({ data: { tenantId, workspaceId, warehouseId: dto.warehouseId, fulfillmentKey: dto.fulfillmentKey ?? 'fulfillment-order-' + randomUUID(), orderNumber: dto.orderNumber, customerId: dto.customerId, status: dto.status ?? 'open', priority: dto.priority ?? 'normal', promisedAt: dto.promisedAt ? new Date(dto.promisedAt) : undefined, requestedShipAt: dto.requestedShipAt ? new Date(dto.requestedShipAt) : undefined, lineItems: dto.lineItems ?? [], deliveryAddress: dto.deliveryAddress ?? {}, metadata: dto.metadata ?? {} } });
    await this.events.publish({ tenantId, workspaceId, type: 'fulfillment.order.created', source: 'supply-chain', subject: { type: 'fulfillment_order', id: record.id }, payload: { fulfillmentKey: record.fulfillmentKey, orderNumber: record.orderNumber, status: record.status }, actorUserId: this.context.context()?.userId });
    return record;
  }

  pickingTasks(status?: string, fulfillmentOrderId?: string) {
    return this.prisma.pickingTask.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, status: status ?? undefined, fulfillmentOrderId: fulfillmentOrderId ?? undefined, deletedAt: null }, include: { fulfillmentOrder: true, item: true }, orderBy: { updatedAt: 'desc' }, take: 100 });
  }

  createPickingTask(dto: CreatePickingTaskDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    return this.prisma.pickingTask.create({ data: { tenantId, workspaceId, fulfillmentOrderId: dto.fulfillmentOrderId, itemId: dto.itemId, sourceBinId: dto.sourceBinId, taskKey: dto.taskKey ?? 'picking-task-' + randomUUID(), status: dto.status ?? 'open', priority: dto.priority ?? 'normal', assignedToUserId: dto.assignedToUserId, quantity: dto.quantity ?? 0, pickedAt: dto.pickedAt ? new Date(dto.pickedAt) : undefined, metadata: dto.metadata ?? {} } });
  }

  packingTasks(status?: string, fulfillmentOrderId?: string) {
    return this.prisma.packingTask.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, status: status ?? undefined, fulfillmentOrderId: fulfillmentOrderId ?? undefined, deletedAt: null }, include: { fulfillmentOrder: true }, orderBy: { updatedAt: 'desc' }, take: 100 });
  }

  createPackingTask(dto: CreatePackingTaskDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    return this.prisma.packingTask.create({ data: { tenantId, workspaceId, fulfillmentOrderId: dto.fulfillmentOrderId, taskKey: dto.taskKey ?? 'packing-task-' + randomUUID(), status: dto.status ?? 'open', assignedToUserId: dto.assignedToUserId, packageCount: dto.packageCount ?? 0, weight: dto.weight, packedAt: dto.packedAt ? new Date(dto.packedAt) : undefined, packaging: dto.packaging ?? {}, metadata: dto.metadata ?? {} } });
  }

  shipments(status?: string, carrierId?: string, warehouseId?: string) {
    return this.prisma.shipment.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, status: status ?? undefined, carrierId: carrierId ?? undefined, warehouseId: warehouseId ?? undefined, deletedAt: null }, include: { fulfillmentOrder: true, warehouse: true, carrier: true, trackingEvents: true }, orderBy: { updatedAt: 'desc' }, take: 100 });
  }

  async createShipment(dto: CreateShipmentDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    const record = await this.prisma.shipment.create({ data: { tenantId, workspaceId, fulfillmentOrderId: dto.fulfillmentOrderId, warehouseId: dto.warehouseId, carrierId: dto.carrierId, shipmentKey: dto.shipmentKey ?? 'shipment-' + randomUUID(), shipmentNumber: dto.shipmentNumber, trackingNumber: dto.trackingNumber, status: dto.status ?? 'created', serviceLevel: dto.serviceLevel, shippedAt: dto.shippedAt ? new Date(dto.shippedAt) : undefined, predictedEta: dto.predictedEta ? new Date(dto.predictedEta) : undefined, deliveredAt: dto.deliveredAt ? new Date(dto.deliveredAt) : undefined, delayRiskScore: dto.delayRiskScore, exceptionStatus: dto.exceptionStatus ?? classifyDelayRisk(dto.delayRiskScore), routePlan: dto.routePlan ?? {}, metadata: dto.metadata ?? {} } });
    await this.events.publish({ tenantId, workspaceId, type: 'shipment.created', source: 'supply-chain', subject: { type: 'shipment', id: record.id }, payload: { shipmentKey: record.shipmentKey, status: record.status, trackingNumber: record.trackingNumber }, actorUserId: this.context.context()?.userId });
    return record;
  }

  trackingEvents(shipmentId?: string, eventType?: string) {
    return this.prisma.shipmentTrackingEvent.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, shipmentId: shipmentId ?? undefined, eventType: eventType ?? undefined, deletedAt: null }, include: { shipment: true }, orderBy: { occurredAt: 'desc' }, take: 100 });
  }

  async createTrackingEvent(dto: CreateShipmentTrackingEventDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    const record = await this.prisma.shipmentTrackingEvent.create({ data: { tenantId, workspaceId, shipmentId: dto.shipmentId, eventKey: dto.eventKey ?? 'shipment-tracking-' + randomUUID(), eventType: dto.eventType, status: dto.status ?? 'recorded', location: dto.location, occurredAt: dto.occurredAt ? new Date(dto.occurredAt) : undefined, eta: dto.eta ? new Date(dto.eta) : undefined, exceptionCode: dto.exceptionCode, exceptionMessage: dto.exceptionMessage, payload: dto.payload ?? {} } });
    await this.events.publish({ tenantId, workspaceId, type: 'shipment.tracking.updated', source: 'supply-chain', subject: { type: 'shipment_tracking_event', id: record.id }, payload: { eventKey: record.eventKey, eventType: record.eventType, status: record.status }, actorUserId: this.context.context()?.userId });
    return record;
  }

  carriers(status?: string, carrierType?: string) {
    return this.prisma.carrier.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, status: status ?? undefined, carrierType: carrierType ?? undefined, deletedAt: null }, include: { shipments: true, routePlans: true }, orderBy: { updatedAt: 'desc' }, take: 100 });
  }

  async createCarrier(dto: CreateCarrierDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    const record = await this.prisma.carrier.create({ data: { tenantId, workspaceId, carrierKey: dto.carrierKey ?? 'carrier-' + randomUUID(), name: dto.name, carrierType: dto.carrierType ?? 'parcel', status: dto.status ?? 'active', serviceLevels: dto.serviceLevels ?? [], performanceScore: dto.performanceScore, metadata: dto.metadata ?? {} } });
    await this.events.publish({ tenantId, workspaceId, type: 'carrier.created', source: 'supply-chain', subject: { type: 'carrier', id: record.id }, payload: { carrierKey: record.carrierKey, status: record.status }, actorUserId: this.context.context()?.userId });
    return record;
  }

  distributionCenters(status?: string, region?: string) {
    return this.prisma.distributionCenter.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, status: status ?? undefined, region: region ?? undefined, deletedAt: null }, include: { warehouse: true, originRoutePlans: true, destinationRoutePlans: true }, orderBy: { updatedAt: 'desc' }, take: 100 });
  }

  createDistributionCenter(dto: CreateDistributionCenterDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    return this.prisma.distributionCenter.create({ data: { tenantId, workspaceId, warehouseId: dto.warehouseId, centerKey: dto.centerKey ?? 'distribution-center-' + randomUUID(), name: dto.name, status: dto.status ?? 'active', region: dto.region, capacityScore: dto.capacityScore, networkRole: dto.networkRole ?? 'regional', metadata: dto.metadata ?? {} } });
  }

  routePlans(status?: string, optimizationGoal?: string) {
    return this.prisma.routeOptimizationPlan.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, status: status ?? undefined, optimizationGoal: optimizationGoal ?? undefined, deletedAt: null }, include: { carrier: true, originCenter: true, destinationCenter: true }, orderBy: { updatedAt: 'desc' }, take: 100 });
  }

  async createRoutePlan(dto: CreateRouteOptimizationPlanDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    const record = await this.prisma.routeOptimizationPlan.create({ data: { tenantId, workspaceId, carrierId: dto.carrierId, originCenterId: dto.originCenterId, destinationCenterId: dto.destinationCenterId, routeKey: dto.routeKey ?? 'route-plan-' + randomUUID(), name: dto.name, status: dto.status ?? 'planned', optimizationGoal: dto.optimizationGoal ?? 'cost', estimatedCost: dto.estimatedCost ?? 0, estimatedDurationHours: dto.estimatedDurationHours, carbonScore: dto.carbonScore, routeData: dto.routeData ?? {}, recommendations: dto.recommendations ?? [] } });
    await this.events.publish({ tenantId, workspaceId, type: 'distribution.route.optimized', source: 'supply-chain', subject: { type: 'route_optimization_plan', id: record.id }, payload: { routeKey: record.routeKey, optimizationGoal: record.optimizationGoal, estimatedCost: record.estimatedCost }, actorUserId: this.context.context()?.userId });
    return record;
  }

  async fulfillmentDashboard() {
    const [orders, picking, packing] = await Promise.all([this.fulfillmentOrders(), this.pickingTasks(), this.packingTasks()]);
    return { orders, picking, packing, summary: { fulfillmentOrderCount: orders.length, openOrderCount: orders.filter((order: { status: string }) => order.status === 'open').length, pickingTaskCount: picking.length, packingTaskCount: packing.length } };
  }

  async shipmentDashboard() {
    const [shipments, tracking] = await Promise.all([this.shipments(), this.trackingEvents()]);
    return { shipments, tracking, summary: { shipmentCount: shipments.length, inTransitCount: shipments.filter((shipment: { status: string }) => shipment.status === 'in_transit').length, exceptionCount: shipments.filter((shipment: { exceptionStatus: string | null }) => Boolean(shipment.exceptionStatus) && shipment.exceptionStatus !== 'low').length, trackingEventCount: tracking.length } };
  }

  async distributionDashboard() {
    const [carriers, distributionCenters, routePlans] = await Promise.all([this.carriers(), this.distributionCenters(), this.routePlans()]);
    return { carriers, distributionCenters, routePlans, summary: { carrierCount: carriers.length, distributionCenterCount: distributionCenters.length, routePlanCount: routePlans.length } };
  }
}
