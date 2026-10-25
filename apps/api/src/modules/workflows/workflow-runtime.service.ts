import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { QUEUES } from '../../infrastructure/queues/queue.constants';
import { DomainEvent } from '../events/contracts/domain-event.contract';
import { EventSubscriberRegistry } from '../events/subscribers/event-subscriber.registry';
import { TenantContextService } from '../tenants/tenant-context.service';
import { WorkflowExecutionJob } from './contracts/workflow-definition.contract';
import { WorkflowRepository } from './repositories/workflow.repository';
@Injectable()
export class WorkflowRuntimeService implements OnModuleInit {
  constructor(private readonly repo: WorkflowRepository, private readonly context: TenantContextService, private readonly subscribers: EventSubscriberRegistry, @InjectQueue(QUEUES.WORKFLOW_EXECUTION) private readonly executionQueue: Queue<WorkflowExecutionJob>) {}
  onModuleInit() { this.subscribers.subscribe('*', (event) => this.handleEvent(event)); }
  async handleEvent(event: DomainEvent) { const workflows = await this.repo.findActiveByTrigger(event.tenantId, event.workspaceId, event.type); for (const workflow of workflows) await this.enqueue(workflow, event.payload as Record<string, unknown>, event.actorUserId, event.id); }
  async triggerManual(workflowId: string, input: Record<string, unknown> = {}) { const workflow = await this.repo.findById(this.context.currentTenantId(), workflowId); return this.enqueue(workflow, { trigger: 'manual.trigger', ...input }, this.context.context()?.userId); }
  async triggerApi(workflowId: string, input: Record<string, unknown> = {}) { const workflow = await this.repo.findById(this.context.currentTenantId(), workflowId); return this.enqueue(workflow, { trigger: 'api.trigger', ...input }, this.context.context()?.userId); }
  async triggerWebhook(workflowId: string, input: Record<string, unknown> = {}) { const workflow = await this.repo.findById(this.context.currentTenantId(), workflowId); return this.enqueue(workflow, { trigger: 'webhook.trigger', ...input }, this.context.context()?.userId); }
  private async enqueue(workflow: any, input: Record<string, unknown>, actorUserId?: string, correlationId?: string) { const execution = await this.repo.createExecution({ tenantId: workflow.tenantId, workspaceId: workflow.workspaceId ?? undefined, workflowId: workflow.id, input }); await this.executionQueue.add('execute-workflow', { tenantId: workflow.tenantId, workspaceId: workflow.workspaceId ?? undefined, workflowId: workflow.id, executionId: execution.id, input, actorUserId, correlationId }, { jobId: execution.id }); return execution; }
}

