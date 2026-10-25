import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/database/prisma.service';
import { TenantContextService } from '../../tenants/tenant-context.service';
import { CreateRelationshipDto, RELATIONSHIP_TYPES } from '../dto/knowledge-graph.dto';

@Injectable()
export class RelationshipService {
  constructor(private readonly prisma: PrismaService, private readonly context: TenantContextService) {}
  relationshipTypes() { return RELATIONSHIP_TYPES; }

  async createRelationship(dto: CreateRelationshipDto) {
    const tenantId = this.context.currentTenantId();
    const relationship = await this.prisma.ontologyRelationship.create({ data: { tenantId, sourceEntityId: dto.sourceEntityId, targetEntityId: dto.targetEntityId, relationshipType: dto.relationshipType, label: dto.label, metadata: dto.metadata ?? {}, confidence: dto.confidence ?? 1 } });
    await this.prisma.knowledgeEdge.create({ data: { tenantId, sourceEntityId: dto.sourceEntityId, targetEntityId: dto.targetEntityId, edgeType: dto.relationshipType, weight: dto.confidence ?? 1, properties: dto.metadata ?? {}, relationshipId: relationship.id } });
    return relationship;
  }

  templates() { return this.prisma.relationshipTemplate.findMany({ where: { deletedAt: null }, orderBy: { createdAt: 'desc' } }); }
}
