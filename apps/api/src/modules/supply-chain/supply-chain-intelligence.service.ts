
import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { EventBusService } from '../events/event-bus.service';
import { TenantContextService } from '../tenants/tenant-context.service';
import { FulfillmentDistributionService } from './fulfillment-distribution.service';
import { InventoryCoreService } from './inventory-core.service';
import { SupplyChainPlanningService } from './supply-chain-planning.service';
import { WarehouseManagementService } from './warehouse-management.service';
import { CreateSupplyChainCopilotQueryDto, CreateSupplyChainInsightDto, CreateSupplyChainRiskDto } from './dto/supply-chain.dto';

@Injectable()
export class SupplyChainIntelligenceService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly context: TenantContextService,
    private readonly events: EventBusService,
    private readonly inventory: InventoryCoreService,
    private readonly warehouses: WarehouseManagementService,
    private readonly planning: SupplyChainPlanningService,
    private readonly fulfillment: FulfillmentDistributionService,
  ) {}

  risks(severity?: string, status?: string, riskType?: string) {
    return this.prisma.supplyChainRisk.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, severity: severity ?? undefined, status: status ?? undefined, riskType: riskType ?? undefined, deletedAt: null }, orderBy: { detectedAt: 'desc' }, take: 100 });
  }

  async createRisk(dto: CreateSupplyChainRiskDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    const record = await this.prisma.supplyChainRisk.create({ data: { tenantId, workspaceId, riskKey: dto.riskKey ?? 'supply-chain-risk-' + randomUUID(), riskType: dto.riskType, severity: dto.severity ?? 'medium', status: dto.status ?? 'open', subjectType: dto.subjectType, subjectId: dto.subjectId, probability: dto.probability, impactScore: dto.impactScore, detectedAt: dto.detectedAt ? new Date(dto.detectedAt) : undefined, signals: dto.signals ?? [], mitigationActions: dto.mitigationActions ?? [], metadata: dto.metadata ?? {} } });
    await this.events.publish({ tenantId, workspaceId, type: 'supply.chain.risk.detected', source: 'supply-chain', subject: { type: 'supply_chain_risk', id: record.id }, payload: { riskKey: record.riskKey, riskType: record.riskType, severity: record.severity }, actorUserId: this.context.context()?.userId });
    return record;
  }

  insights(severity?: string, status?: string, insightType?: string) {
    return this.prisma.supplyChainInsight.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, severity: severity ?? undefined, status: status ?? undefined, insightType: insightType ?? undefined, deletedAt: null }, orderBy: { generatedAt: 'desc' }, take: 100 });
  }

  async createInsight(dto: CreateSupplyChainInsightDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    const record = await this.prisma.supplyChainInsight.create({ data: { tenantId, workspaceId, insightKey: dto.insightKey ?? 'supply-chain-insight-' + randomUUID(), insightType: dto.insightType, title: dto.title, severity: dto.severity ?? 'info', status: dto.status ?? 'open', confidence: dto.confidence, generatedAt: dto.generatedAt ? new Date(dto.generatedAt) : undefined, findings: dto.findings ?? [], recommendations: dto.recommendations ?? [], context: dto.context ?? {}, metadata: dto.metadata ?? {} } });
    await this.events.publish({ tenantId, workspaceId, type: 'supply.chain.insight.created', source: 'supply-chain', subject: { type: 'supply_chain_insight', id: record.id }, payload: { insightKey: record.insightKey, insightType: record.insightType, severity: record.severity }, actorUserId: this.context.context()?.userId });
    return record;
  }

  copilotQueries(status?: string, userId?: string) {
    return this.prisma.supplyChainCopilotQuery.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, status: status ?? undefined, userId: userId ?? undefined, deletedAt: null }, orderBy: { createdAt: 'desc' }, take: 100 });
  }

  async createCopilotQuery(dto: CreateSupplyChainCopilotQueryDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    const response = dto.response ?? 'Supply chain copilot captured the query and assembled inventory, forecast, shipment and risk context for governed analysis.';
    const record = await this.prisma.supplyChainCopilotQuery.create({ data: { tenantId, workspaceId, queryKey: dto.queryKey ?? 'supply-copilot-' + randomUUID(), userId: dto.userId ?? this.context.context()?.userId, query: dto.query, response, status: dto.status ?? 'completed', context: dto.context ?? {}, recommendations: dto.recommendations ?? [] } });
    await this.events.publish({ tenantId, workspaceId, type: 'supply.chain.copilot.queried', source: 'supply-chain', subject: { type: 'supply_chain_copilot_query', id: record.id }, payload: { queryKey: record.queryKey, status: record.status }, actorUserId: this.context.context()?.userId });
    return record;
  }

  async intelligenceDashboard() {
    const [risks, insights] = await Promise.all([this.risks(), this.insights()]);
    return { risks, insights, summary: { riskCount: risks.length, criticalRiskCount: risks.filter((risk: { severity: string }) => risk.severity === 'critical').length, insightCount: insights.length, openInsightCount: insights.filter((insight: { status: string }) => insight.status === 'open').length } };
  }

  async analyticsDashboard() {
    const [inventory, warehouse, forecasting, replenishment, fulfillment, shipments, distribution, intelligence] = await Promise.all([
      this.inventory.dashboard(),
      this.warehouses.dashboard(),
      this.planning.forecastingDashboard(),
      this.planning.replenishmentDashboard(),
      this.fulfillment.fulfillmentDashboard(),
      this.fulfillment.shipmentDashboard(),
      this.fulfillment.distributionDashboard(),
      this.intelligenceDashboard(),
    ]);
    return { inventory, warehouse, forecasting, replenishment, fulfillment, shipments, distribution, intelligence, summary: { itemCount: inventory.summary.itemCount, warehouseCount: warehouse.summary.warehouseCount, forecastScenarioCount: forecasting.summary.scenarioCount, replenishmentPlanCount: replenishment.summary.planCount, fulfillmentOrderCount: fulfillment.summary.fulfillmentOrderCount, shipmentCount: shipments.summary.shipmentCount, riskCount: intelligence.summary.riskCount } };
  }
}
