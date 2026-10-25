import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { PrismaService } from '../../../infrastructure/database/prisma.service';
import { QUEUES } from '../../../infrastructure/queues/queue.constants';
import { TenantContextService } from '../../tenants/tenant-context.service';
import { SyncAuditService } from './sync-audit.service';
@Injectable()
export class SyncEngine { constructor(private readonly prisma: PrismaService, private readonly context: TenantContextService, private readonly audit: SyncAuditService, @InjectQueue(QUEUES.SYNC) private readonly queue: Queue) {} async start(input: { integrationId: string; mode?: string; payload?: Record<string, unknown> }) { const tenantId = this.context.currentTenantId(); const workspaceId = this.context.currentWorkspaceId(); const run = await this.prisma.syncRun.create({ data: { tenantId, workspaceId, integrationId: input.integrationId, mode: input.mode ?? 'one_way', status: 'QUEUED', payload: input.payload ?? {} } }); await this.audit.started({ tenantId, workspaceId, syncRunId: run.id }); await this.queue.add('sync-run', { syncRunId: run.id, tenantId, workspaceId, ...input }); return run; } async complete(id: string, output: Record<string, unknown>) { const run = await this.prisma.syncRun.update({ where: { id }, data: { status: 'SUCCEEDED', output, finishedAt: new Date() } }); await this.audit.completed({ tenantId: run.tenantId, workspaceId: run.workspaceId ?? undefined, syncRunId: run.id }); return run; } }
