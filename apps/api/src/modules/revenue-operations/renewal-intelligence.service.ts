
import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { EventBusService } from '../events/event-bus.service';
import { TenantContextService } from '../tenants/tenant-context.service';
import { CreateRenewalForecastDto, CreateRenewalScheduleDto } from './dto/revenue-operations.dto';

@Injectable()
export class RenewalIntelligenceService {
  constructor(private readonly prisma: PrismaService, private readonly context: TenantContextService, private readonly events: EventBusService) {}

  schedules(status?: string, renewalType?: string, revenueAccountId?: string) {
    return this.prisma.renewalSchedule.findMany({
      where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, status: status ?? undefined, renewalType: renewalType ?? undefined, revenueAccountId: revenueAccountId ?? undefined, deletedAt: null },
      include: { revenueAccount: true, revenueContract: true, forecasts: true },
      orderBy: { renewalDate: 'asc' },
      take: 100,
    });
  }

  async createSchedule(dto: CreateRenewalScheduleDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    const record = await this.prisma.renewalSchedule.create({
      data: {
        tenantId,
        workspaceId,
        revenueAccountId: dto.revenueAccountId,
        revenueContractId: dto.revenueContractId,
        scheduleKey: dto.scheduleKey ?? 'renewal-schedule-' + randomUUID(),
        renewalType: dto.renewalType ?? 'standard',
        status: dto.status ?? 'open',
        renewalDate: new Date(dto.renewalDate),
        noticeDate: dto.noticeDate ? new Date(dto.noticeDate) : undefined,
        ownerUserId: dto.ownerUserId,
        renewalAmount: dto.renewalAmount ?? 0,
        probability: dto.probability,
        playbook: dto.playbook ?? {},
        tasks: dto.tasks ?? [],
        metadata: dto.metadata ?? {},
      },
    });
    await this.events.publish({ tenantId, workspaceId, type: 'renewal.schedule.created', source: 'revenue-operations', subject: { type: 'renewal_schedule', id: record.id }, payload: { scheduleKey: record.scheduleKey, status: record.status, renewalDate: record.renewalDate }, actorUserId: this.context.context()?.userId });
    return record;
  }

  forecasts(forecastStatus?: string, riskBand?: string, revenueAccountId?: string) {
    return this.prisma.renewalForecast.findMany({
      where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, forecastStatus: forecastStatus ?? undefined, riskBand: riskBand ?? undefined, revenueAccountId: revenueAccountId ?? undefined, deletedAt: null },
      include: { revenueAccount: true, renewalSchedule: true },
      orderBy: { forecastDate: 'desc' },
      take: 100,
    });
  }

  async createForecast(dto: CreateRenewalForecastDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    const record = await this.prisma.renewalForecast.create({
      data: {
        tenantId,
        workspaceId,
        revenueAccountId: dto.revenueAccountId,
        renewalScheduleId: dto.renewalScheduleId,
        forecastKey: dto.forecastKey ?? 'renewal-forecast-' + randomUUID(),
        forecastPeriod: dto.forecastPeriod,
        forecastDate: dto.forecastDate ? new Date(dto.forecastDate) : undefined,
        expectedRenewalAmount: dto.expectedRenewalAmount ?? 0,
        probability: dto.probability ?? 0,
        forecastStatus: dto.forecastStatus ?? 'active',
        riskBand: dto.riskBand ?? 'medium',
        drivers: dto.drivers ?? [],
        assumptions: dto.assumptions ?? {},
        recommendations: dto.recommendations ?? [],
        metadata: dto.metadata ?? {},
      },
    });
    await this.events.publish({ tenantId, workspaceId, type: 'renewal.forecast.created', source: 'revenue-operations', subject: { type: 'renewal_forecast', id: record.id }, payload: { forecastKey: record.forecastKey, riskBand: record.riskBand, probability: record.probability }, actorUserId: this.context.context()?.userId });
    return record;
  }

  async dashboard() {
    const [schedules, forecasts] = await Promise.all([this.schedules(), this.forecasts()]);
    return {
      schedules,
      forecasts,
      summary: {
        renewalScheduleCount: schedules.length,
        openRenewalCount: schedules.filter((schedule: { status: string }) => schedule.status === 'open').length,
        forecastCount: forecasts.length,
        highRiskForecastCount: forecasts.filter((forecast: { riskBand: string }) => forecast.riskBand === 'high' || forecast.riskBand === 'critical').length,
      },
    };
  }
}
