import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/database/prisma.service';
import { AgentMemoryService } from '../memory/agent-memory.service';
import { FoundationAgentKey } from '../contracts/agent.contract';
@Injectable()
export class AgentContextManagerService {
  constructor(private readonly prisma: PrismaService, private readonly memory: AgentMemoryService) {}
  async build(input: { tenantId: string; workspaceId?: string; agentKey: FoundationAgentKey; objective: string; payload: Record<string, unknown> }) { const [workspace, recentEvents, workflowRuns, memory] = await Promise.all([input.workspaceId ? this.prisma.workspace.findFirst({ where: { tenantId: input.tenantId, id: input.workspaceId } }) : null, this.prisma.event.findMany({ where: { tenantId: input.tenantId, workspaceId: input.workspaceId }, orderBy: { createdAt: 'desc' }, take: 25 }), this.prisma.workflowExecution.findMany({ where: { tenantId: input.tenantId, workspaceId: input.workspaceId }, orderBy: { createdAt: 'desc' }, take: 20 }), this.memory.contextBundle({ tenantId: input.tenantId, workspaceId: input.workspaceId, agentKey: input.agentKey })]); return { workspace, recentEvents, workflowRuns, memory, objective: input.objective, payload: input.payload }; }
}
