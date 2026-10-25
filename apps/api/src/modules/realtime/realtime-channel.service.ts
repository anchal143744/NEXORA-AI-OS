import { Injectable } from '@nestjs/common';
import { DomainEvent } from '../events/contracts/domain-event.contract';
import { REALTIME_CHANNELS, RealtimeChannel } from './channels/realtime-channel';
import { RealtimeGateway } from './gateways/realtime.gateway';

@Injectable()
export class RealtimeChannelService {
  constructor(private readonly gateway: RealtimeGateway) {}

  tenantRoom(tenantId: string, channel: RealtimeChannel) { return `tenant:${tenantId}:${channel}`; }
  workspaceRoom(tenantId: string, workspaceId: string, channel: RealtimeChannel) { return `tenant:${tenantId}:workspace:${workspaceId}:${channel}`; }

  publishTenant(tenantId: string, channel: RealtimeChannel, event: string, payload: unknown) { this.gateway.publish(this.tenantRoom(tenantId, channel), event, payload); }
  publishWorkspace(tenantId: string, workspaceId: string, channel: RealtimeChannel, event: string, payload: unknown) { this.gateway.publish(this.workspaceRoom(tenantId, workspaceId, channel), event, payload); }

  publishEvent(event: DomainEvent) {
    this.publishTenant(event.tenantId, REALTIME_CHANNELS.ACTIVITY_FEED, event.type, event);
    if (event.workspaceId) this.publishWorkspace(event.tenantId, event.workspaceId, REALTIME_CHANNELS.WORKSPACE, event.type, event);
  }
}
