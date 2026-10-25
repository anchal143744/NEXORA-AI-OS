import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/database/prisma.service';
import { TenantContextService } from '../../tenants/tenant-context.service';
import { CreateBusinessMemoryDto } from '../dto/knowledge-graph.dto';

@Injectable()
export class BusinessMemoryService {
  constructor(private readonly prisma: PrismaService, private readonly context: TenantContextService) {}
  store(dto: CreateBusinessMemoryDto) { return this.prisma.businessMemory.create({ data: { tenantId: this.context.currentTenantId(), workspaceId: dto.workspaceId ?? this.context.currentWorkspaceId(), entityId: dto.entityId, memoryType: dto.memoryType, title: dto.title, content: dto.content } }); }
  list(memoryType?: string) { return this.prisma.businessMemory.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId(), memoryType, deletedAt: null }, orderBy: { createdAt: 'desc' }, take: 200 }); }
}
