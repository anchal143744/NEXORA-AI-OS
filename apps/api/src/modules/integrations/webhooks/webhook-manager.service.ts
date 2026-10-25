import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/database/prisma.service';
import { EventBusService } from '../../events/event-bus.service';
import { TenantContextService } from '../../tenants/tenant-context.service';
import { WorkflowRuntimeService } from '../../workflows/workflow-runtime.service';
import { AgentRuntimeService } from '../../agents/agent-runtime.service';
import { CredentialVault } from '../credentials/credential-vault.service';
import { CreateWebhookDto } from '../dto/integration.dto';
import { WebhookValidator } from './webhook-validator.service';
@Injectable()
export class WebhookManager { constructor(private readonly prisma: PrismaService, private readonly context: TenantContextService, private readonly vault: CredentialVault, private readonly validator: WebhookValidator, private readonly events: EventBusService, private readonly workflows: WorkflowRuntimeService, private readonly agents: AgentRuntimeService) {}
  async create(dto: CreateWebhookDto) { const tenantId = this.context.currentTenantId(); const endpoint = await this.prisma.webhookEndpoint.create({ data: { tenantId, name: dto.name, url: dto.url, secretRef: this.vault.encrypt(dto.secret), events: dto.events ?? [], inbound: dto.inbound ?? true, outbound: dto.outbound ?? true } }); return endpoint; }
  list() { return this.prisma.webhookEndpoint.findMany({ where: { tenantId: this.context.currentTenantId(), deletedAt: null }, orderBy: { createdAt: 'desc' } }); }
  async inbound(id: string, input: { payload: Record<string, unknown>; signature?: string; timestamp?: string; nonce?: string }) { const tenantId = this.context.currentTenantId(); const endpoint = await this.prisma.webhookEndpoint.findFirst({ where: { tenantId, id, deletedAt: null } }); if (!endpoint) throw new NotFoundException('Webhook endpoint not found'); const secret = this.vault.decrypt<string>(endpoint.secretRef); if (input.signature && input.timestamp && input.nonce) await this.validator.validate({ tenantId, secret, payload: input.payload, signature: input.signature, timestamp: input.timestamp, nonce: input.nonce }); const delivery = await this.prisma.webhookDelivery.create({ data: { tenantId, endpointId: endpoint.id, direction: 'INBOUND', status: 'SUCCEEDED', payload: input.payload } }); await this.events.publish({ tenantId, type: 'webhook.triggered', source: 'webhook-engine', subject: { type: 'webhookDelivery', id: delivery.id }, payload: input.payload }); const workflowId = String(input.payload.workflowId ?? ''); if (workflowId) await this.workflows.triggerWebhook(workflowId, input.payload); const agentObjective = String(input.payload.agentObjective ?? ''); if (agentObjective) await this.agents.run(undefined, agentObjective, input.payload); return delivery; }
}
