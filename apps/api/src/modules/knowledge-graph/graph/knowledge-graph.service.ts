import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/database/prisma.service';
import { TenantContextService } from '../../tenants/tenant-context.service';

@Injectable()
export class KnowledgeGraphService {
  constructor(private readonly prisma: PrismaService, private readonly context: TenantContextService) {}

  async contextGraph(input: { workspaceId?: string; businessId?: string }) {
    const tenantId = this.context.currentTenantId();
    const nodes = await this.prisma.knowledgeNode.findMany({ where: { tenantId, deletedAt: null }, take: 500 });
    const edges = await this.prisma.knowledgeEdge.findMany({ where: { tenantId, deletedAt: null }, take: 1000 });
    const snapshot = await this.prisma.contextSnapshot.create({ data: { tenantId, workspaceId: input.workspaceId, businessId: input.businessId, snapshotType: 'context_graph', payload: { nodeCount: nodes.length, edgeCount: edges.length } } });
    return { snapshotId: snapshot.id, nodes, edges };
  }

  async linkEntity(input: { entityId: string; resourceType: string; resourceId: string; metadata?: Record<string, unknown> }) {
    return this.prisma.entityLink.create({ data: { tenantId: this.context.currentTenantId(), entityId: input.entityId, resourceType: input.resourceType, resourceId: input.resourceId, metadata: input.metadata ?? {} } });
  }
}
