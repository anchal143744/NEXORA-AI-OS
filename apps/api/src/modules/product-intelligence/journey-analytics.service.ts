import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { EventBusService } from '../events/event-bus.service';
import { TenantContextService } from '../tenants/tenant-context.service';
import { RecordJourneyStepDto, StartUserJourneyDto } from './dto/product-intelligence.dto';

@Injectable()
export class JourneyAnalyticsService {
  constructor(private readonly prisma: PrismaService, private readonly context: TenantContextService, private readonly events: EventBusService) {}

  journeys(journeyType?: string, status?: string) {
    return this.prisma.userJourney.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, journeyType: journeyType ?? undefined, status: status ?? undefined, deletedAt: null }, include: { steps: { where: { deletedAt: null }, orderBy: { orderIndex: 'asc' }, take: 20 } }, orderBy: { updatedAt: 'desc' }, take: 100 });
  }

  async startJourney(dto: StartUserJourneyDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    const journey = await this.prisma.userJourney.create({ data: { tenantId, workspaceId, journeyKey: dto.journeyKey ?? `journey-${randomUUID()}`, userId: dto.userId ?? this.context.context()?.userId, customerIdentityId: dto.customerIdentityId, sessionId: dto.sessionId, journeyType: dto.journeyType ?? 'product', source: dto.source ?? 'product', entryPoint: dto.entryPoint, metadata: dto.metadata ?? {} } });
    await this.events.publish({ tenantId, workspaceId, type: 'user.journey.started', source: 'journey-analytics', subject: { type: 'user_journey', id: journey.id }, payload: { journeyType: journey.journeyType, userId: journey.userId, entryPoint: journey.entryPoint }, actorUserId: this.context.context()?.userId });
    return journey;
  }

  async getJourney(id: string) {
    const journey = await this.prisma.userJourney.findFirst({ where: { tenantId: this.context.currentTenantId(), id, deletedAt: null }, include: { steps: { where: { deletedAt: null }, orderBy: { orderIndex: 'asc' } } } });
    if (!journey) throw new NotFoundException('User journey not found');
    return journey;
  }

  steps(journeyId?: string) {
    return this.prisma.journeyStep.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, journeyId: journeyId ?? undefined, deletedAt: null }, orderBy: [{ orderIndex: 'asc' }, { enteredAt: 'asc' }], take: 200 });
  }

  async recordStep(dto: RecordJourneyStepDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    const step = await this.prisma.journeyStep.create({ data: { tenantId, workspaceId, journeyId: dto.journeyId, stepKey: dto.stepKey ?? `journey-step-${randomUUID()}`, stepName: dto.stepName, stepType: dto.stepType ?? 'event', orderIndex: dto.orderIndex ?? 0, status: dto.status ?? 'completed', eventName: dto.eventName, featureKey: dto.featureKey, moduleKey: dto.moduleKey, exitedAt: dto.exitedAt ? new Date(dto.exitedAt) : undefined, durationSeconds: dto.durationSeconds, properties: dto.properties ?? {}, metadata: dto.metadata ?? {} } });
    if (dto.journeyId) await this.prisma.userJourney.update({ where: { id: dto.journeyId }, data: { lastStepAt: new Date() } });
    await this.events.publish({ tenantId, workspaceId, type: 'user.journey.step.recorded', source: 'journey-analytics', subject: { type: 'journey_step', id: step.id }, payload: { journeyId: step.journeyId, stepName: step.stepName, featureKey: step.featureKey }, actorUserId: this.context.context()?.userId });
    return step;
  }

  async completeJourney(id: string) {
    await this.getJourney(id);
    return this.prisma.userJourney.update({ where: { id }, data: { status: 'completed', endedAt: new Date() } });
  }
}
