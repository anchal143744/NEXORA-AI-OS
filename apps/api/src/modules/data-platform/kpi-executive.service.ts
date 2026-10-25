import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { EventBusService } from '../events/event-bus.service';
import { TenantContextService } from '../tenants/tenant-context.service';
import { CreateExecutiveDashboardDto, CreateKpiDto, GenerateKpiResultDto } from './dto/data-platform.dto';

@Injectable()
export class KpiExecutiveService {
  constructor(private readonly prisma: PrismaService, private readonly context: TenantContextService, private readonly events: EventBusService) {}

  kpis(category?: string, status?: string) {
    return this.prisma.kPI.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, category: category ?? undefined, status: status ?? undefined, deletedAt: null }, include: { semanticMetric: true, results: true }, orderBy: { updatedAt: 'desc' }, take: 100 });
  }

  async createKpi(dto: CreateKpiDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    const record = await this.prisma.kPI.create({ data: { tenantId, workspaceId, semanticMetricId: dto.semanticMetricId, kpiKey: dto.kpiKey ?? `kpi-${randomUUID()}`, name: dto.name, category: dto.category ?? 'executive', status: dto.status ?? 'active', targetValue: dto.targetValue, currentValue: dto.currentValue, unit: dto.unit ?? 'count', period: dto.period ?? 'monthly', ownerUserId: dto.ownerUserId, thresholds: dto.thresholds ?? {}, formula: dto.formula, metadata: dto.metadata ?? {} } });
    await this.events.publish({ tenantId, workspaceId, type: 'kpi.created', source: 'data-platform', subject: { type: 'kpi', id: record.id }, payload: { kpiKey: record.kpiKey, category: record.category, status: record.status }, actorUserId: this.context.context()?.userId });
    return record;
  }

  results(kpiId?: string, band?: string) {
    return this.prisma.kPIResult.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, kpiId: kpiId ?? undefined, band: band ?? undefined, deletedAt: null }, include: { kpi: true }, orderBy: { generatedAt: 'desc' }, take: 100 });
  }

  async generateResult(dto: GenerateKpiResultDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    const kpi = await this.prisma.kPI.findFirst({ where: { id: dto.kpiId, tenantId, workspaceId: workspaceId ?? undefined, deletedAt: null } });
    if (!kpi) throw new NotFoundException('KPI not found');
    const targetValue = dto.targetValue ?? kpi.targetValue;
    const variance = dto.variance ?? (targetValue === null || targetValue === undefined ? undefined : dto.actualValue - Number(targetValue));
    const score = dto.score ?? this.score(dto.actualValue, targetValue ?? undefined);
    const band = dto.band ?? this.band(score);
    const record = await this.prisma.kPIResult.create({ data: { tenantId, workspaceId, kpiId: dto.kpiId, resultKey: dto.resultKey ?? `kpi-result-${randomUUID()}`, periodStart: new Date(dto.periodStart), periodEnd: new Date(dto.periodEnd), actualValue: dto.actualValue, targetValue: targetValue ?? undefined, variance, score, band, drivers: dto.drivers ?? [], metadata: dto.metadata ?? {} } });
    await this.events.publish({ tenantId, workspaceId, type: 'kpi.result.generated', source: 'data-platform', subject: { type: 'kpi_result', id: record.id }, payload: { kpiId: record.kpiId, actualValue: record.actualValue, targetValue: record.targetValue, band: record.band }, actorUserId: this.context.context()?.userId });
    return record;
  }

  dashboards(status?: string, audience?: string) {
    return this.prisma.executiveDashboard.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, status: status ?? undefined, audience: audience ?? undefined, deletedAt: null }, include: { dataMart: true }, orderBy: { updatedAt: 'desc' }, take: 100 });
  }

  async createDashboard(dto: CreateExecutiveDashboardDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    const record = await this.prisma.executiveDashboard.create({ data: { tenantId, workspaceId, dataMartId: dto.dataMartId, dashboardKey: dto.dashboardKey ?? `executive-dashboard-${randomUUID()}`, name: dto.name, dashboardType: dto.dashboardType ?? 'executive', status: dto.status ?? 'draft', audience: dto.audience ?? 'executive', layout: dto.layout ?? {}, widgets: dto.widgets ?? [], filters: dto.filters ?? [], refreshCadence: dto.refreshCadence ?? 'daily', ownerUserId: dto.ownerUserId, metadata: dto.metadata ?? {} } });
    await this.events.publish({ tenantId, workspaceId, type: 'executive.dashboard.created', source: 'data-platform', subject: { type: 'executive_dashboard', id: record.id }, payload: { dashboardKey: record.dashboardKey, dashboardType: record.dashboardType, audience: record.audience }, actorUserId: this.context.context()?.userId });
    return record;
  }

  async studio() {
    const [kpis, results, metrics] = await Promise.all([this.kpis(), this.results(), this.prisma.semanticMetric.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, deletedAt: null }, take: 100 })]);
    return { kpis, results, metrics, summary: { kpiCount: kpis.length, resultCount: results.length, semanticMetricCount: metrics.length } };
  }

  async scorecard() {
    const results = await this.results();
    return { results, scorecard: results.map((result: { kpiId: string; actualValue: number; targetValue?: number | null; band: string; score?: number | null }) => ({ kpiId: result.kpiId, actualValue: result.actualValue, targetValue: result.targetValue, band: result.band, score: result.score })) };
  }

  async executiveAnalytics() {
    const [dashboards, kpis, results, marts] = await Promise.all([this.dashboards(), this.kpis(), this.results(), this.prisma.dataMart.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, deletedAt: null }, take: 100 })]);
    return { dashboards, kpis, results, marts, summary: { dashboardCount: dashboards.length, kpiCount: kpis.length, resultCount: results.length, dataMartCount: marts.length } };
  }

  private score(actual: number, target?: number) { return target ? Math.min(100, Math.max(0, (actual / target) * 100)) : undefined; }
  private band(score?: number) { if (score === undefined) return 'unknown'; return score >= 100 ? 'exceeded' : score >= 85 ? 'on_track' : score >= 60 ? 'watch' : 'at_risk'; }
}