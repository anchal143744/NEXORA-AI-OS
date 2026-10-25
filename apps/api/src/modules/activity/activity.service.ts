import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { QUEUES } from '../../infrastructure/queues/queue.constants';
import { RealtimeChannelService } from '../realtime/realtime-channel.service';
import { REALTIME_CHANNELS } from '../realtime/channels/realtime-channel';
import { TenantContextService } from '../tenants/tenant-context.service';
import { ActivityRepository } from './repositories/activity.repository';

@Injectable()
export class ActivityService {
  constructor(private readonly repo: ActivityRepository, private readonly context: TenantContextService, private readonly realtime: RealtimeChannelService, @InjectQueue(QUEUES.ACTIVITY) private readonly activityQueue: Queue) {}
  async record(input: { tenantId: string; userId?: string; activityType: string; message: string; resourceType?: string; resourceId?: string; workspaceId?: string; metadata?: Record<string, unknown> }) {
    const activity = await this.repo.create(input);
    await this.activityQueue.add(input.activityType, { ...input, activityId: activity.id });
    this.realtime.publishTenant(input.tenantId, REALTIME_CHANNELS.ACTIVITY_FEED, 'activity.created', activity);
    if (input.workspaceId) this.realtime.publishWorkspace(input.tenantId, input.workspaceId, REALTIME_CHANNELS.ACTIVITY_FEED, 'activity.created', activity);
    return activity;
  }
  listCurrentUser() { const ctx = this.context.context(); return this.repo.list(this.context.currentTenantId(), ctx?.userId); }
}
