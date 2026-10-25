import { Injectable } from '@nestjs/common';
import { EventBusService } from '../../events/event-bus.service';
@Injectable()
export class SyncAuditService { constructor(private readonly events: EventBusService) {} started(input: { tenantId: string; workspaceId?: string; syncRunId: string }) { return this.events.publish({ tenantId: input.tenantId, workspaceId: input.workspaceId, type: 'sync.started', source: 'sync-engine', subject: { type: 'syncRun', id: input.syncRunId }, payload: {} }); } completed(input: { tenantId: string; workspaceId?: string; syncRunId: string }) { return this.events.publish({ tenantId: input.tenantId, workspaceId: input.workspaceId, type: 'sync.completed', source: 'sync-engine', subject: { type: 'syncRun', id: input.syncRunId }, payload: {} }); } }
