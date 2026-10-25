import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/database/prisma.service';
import { TenantContextService } from '../../tenants/tenant-context.service';

@Injectable()
export class AiCopilotService {
  constructor(private readonly prisma: PrismaService, private readonly context: TenantContextService) {}

  private tenantId() { return this.context.currentTenantId(); }
  private workspaceId() { return this.context.currentWorkspaceId(); }

  async getDefaultCopilot(copilotKey = 'nexora-copilot') {
    const tenantId = this.tenantId();
    const workspaceId = this.workspaceId();
    const existing = await this.prisma.aiCopilot.findFirst({ where: { tenantId, workspaceId, copilotKey, deletedAt: null } });
    if (existing) return existing;
    return this.prisma.aiCopilot.create({ data: { tenantId, workspaceId, name: 'NEXORA AI Copilot', copilotKey, provider: process.env.NEXORA_AI_PROVIDER ?? 'openai', modelKey: process.env.OPENAI_DEFAULT_MODEL ?? 'gpt-4.1-mini', roleScope: 'workspace', capabilities: ['context_builder','memory_retrieval','insight_generation','risk_detection','opportunity_detection','recommendation_generation','workflow_suggestion'], policies: { tenantIsolation: true, promptLogging: true, actionTracking: true } } });
  }

  listConversations() {
    const where: any = { tenantId: this.tenantId(), deletedAt: null };
    const workspaceId = this.workspaceId();
    if (workspaceId) where.workspaceId = workspaceId;
    return this.prisma.aiConversation.findMany({ where, include: { messages: { orderBy: { createdAt: 'desc' }, take: 2 } }, orderBy: { updatedAt: 'desc' }, take: 100 });
  }

  getConversation(id: string) {
    const where: any = { tenantId: this.tenantId(), id, deletedAt: null };
    const workspaceId = this.workspaceId();
    if (workspaceId) where.workspaceId = workspaceId;
    return this.prisma.aiConversation.findFirst({ where, include: { messages: { orderBy: { createdAt: 'asc' } } } });
  }
}
