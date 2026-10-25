import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/database/prisma.service';
import { TenantContextService } from '../../tenants/tenant-context.service';
import { CreateOntologyEntityDto, ONTOLOGY_ENTITY_TYPES } from '../dto/knowledge-graph.dto';

@Injectable()
export class OntologyService {
  constructor(private readonly prisma: PrismaService, private readonly context: TenantContextService) {}

  entityTypes() { return ONTOLOGY_ENTITY_TYPES; }

  async createEntity(dto: CreateOntologyEntityDto) {
    const tenantId = this.context.currentTenantId();
    const entity = await this.prisma.ontologyEntity.upsert({
      where: { tenantId_entityType_entityKey: { tenantId, entityType: dto.entityType, entityKey: dto.entityKey } },
      update: { name: dto.name, sourceId: dto.sourceId, attributes: dto.attributes ?? {}, tags: dto.tags ?? [] },
      create: { tenantId, entityType: dto.entityType, entityKey: dto.entityKey, name: dto.name, sourceId: dto.sourceId, attributes: dto.attributes ?? {}, tags: dto.tags ?? [] },
    });
    await this.prisma.knowledgeNode.upsert({ where: { tenantId_entityId: { tenantId, entityId: entity.id } }, update: { nodeType: dto.entityType, label: dto.name, properties: dto.attributes ?? {} }, create: { tenantId, entityId: entity.id, nodeType: dto.entityType, label: dto.name, properties: dto.attributes ?? {} } });
    return entity;
  }

  listEntities(entityType?: string) { return this.prisma.ontologyEntity.findMany({ where: { tenantId: this.context.currentTenantId(), entityType, deletedAt: null }, orderBy: { createdAt: 'desc' }, take: 200 }); }
}
