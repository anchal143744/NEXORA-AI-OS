import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { EventBusService } from '../events/event-bus.service';
import { TenantContextService } from '../tenants/tenant-context.service';
import { CreateCapacityPlanDto } from './dto/strategic-forecasting.dto';

@Injectable()
export class CapacityPlanningService {
  constructor(private readonly prisma: PrismaService, private readonly context: TenantContextService, private readonly events: EventBusService) {}

  plans(capacityType?: string, status?: string) {
    return this.prisma.capacityPlan.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, capacityType: capacityType ?? undefined, status: status ?? undefined, deletedAt: null }, orderBy: { updatedAt: 'desc' }, take: 100 });
  }

  async create(dto: CreateCapacityPlanDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    const capacityGap = dto.capacityGap ?? (Number(dto.requiredCapacity ?? 0) - Number(dto.currentCapacity ?? 0));
    const utilizationRate = dto.utilizationRate ?? (dto.currentCapacity && dto.requiredCapacity ? Number(dto.requiredCapacity) / Number(dto.currentCapacity) : undefined);
    const record = await this.prisma.capacityPlan.create({ data: { tenantId, workspaceId, strategicPlanId: dto.strategicPlanId, capacityKey: dto.capacityKey ?? `capacity-plan-${randomUUID()}`, name: dto.name, capacityType: dto.capacityType ?? 'workforce', status: dto.status ?? 'draft', departmentId: dto.departmentId, periodStart: dto.periodStart ? new Date(dto.periodStart) : undefined, periodEnd: dto.periodEnd ? new Date(dto.periodEnd) : undefined, demandForecast: dto.demandForecast, currentCapacity: dto.currentCapacity, requiredCapacity: dto.requiredCapacity, capacityGap, utilizationRate, constraints: dto.constraints ?? [], hiringPlan: dto.hiringPlan ?? [], recommendations: dto.recommendations ?? this.defaultRecommendations(capacityGap), metadata: dto.metadata ?? {} } });
    await this.events.publish({ tenantId, workspaceId, type: 'capacity.plan.created', source: 'strategic-forecasting', subject: { type: 'capacity_plan', id: record.id }, payload: { capacityType: record.capacityType, capacityGap: record.capacityGap, utilizationRate: record.utilizationRate }, actorUserId: this.context.context()?.userId });
    return record;
  }

  async gaps() {
    const plans = await this.plans();
    return { plans, gaps: plans.filter((plan: { capacityGap?: number | null }) => Number(plan.capacityGap ?? 0) > 0) };
  }

  async recommendations() {
    const gapData = await this.gaps();
    return { ...gapData, recommendations: gapData.gaps.map((plan: { id: string; capacityType: string; capacityGap?: number | null }) => ({ planId: plan.id, action: `increase_${plan.capacityType}_capacity`, gap: plan.capacityGap })) };
  }

  private defaultRecommendations(gap?: number | null) { return Number(gap ?? 0) > 0 ? [{ action: 'increase_capacity_or_reduce_demand' }] : [{ action: 'monitor_capacity_utilization' }]; }
}