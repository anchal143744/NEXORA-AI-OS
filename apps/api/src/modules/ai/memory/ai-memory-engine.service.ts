import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/database/prisma.service';
import { TenantContextService } from '../../tenants/tenant-context.service';
import { AiContextQueryDto, CreateAiMemoryDto } from '../dto/ai-copilot-v2.dto';

@Injectable()
export class AiMemoryEngineService {
  constructor(private readonly prisma: PrismaService, private readonly context: TenantContextService) {}

  private tenantId() { return this.context.currentTenantId(); }
  private workspaceId(input?: string) {
    const currentWorkspaceId = this.context.currentWorkspaceId();
    if (input && input !== currentWorkspaceId) throw new ForbiddenException('Workspace context is not authorized');
    return currentWorkspaceId;
  }
  private userId() { return this.context.context()?.userId; }

  store(dto: CreateAiMemoryDto) {
    return this.prisma.aiMemory.create({ data: { tenantId: this.tenantId(), workspaceId: this.workspaceId(dto.workspaceId), businessId: dto.businessId, departmentId: dto.departmentId, userId: this.userId(), conversationId: dto.conversationId, memoryType: dto.memoryType, scope: dto.scope ?? 'workspace', title: dto.title, content: dto.content, importance: dto.importance ?? 50, source: dto.source ?? 'copilot' } });
  }

  list(query: AiContextQueryDto & { memoryType?: string } = {}) {
    const where: any = { tenantId: this.tenantId(), deletedAt: null };
    const workspaceId = this.workspaceId(query.workspaceId);
    if (workspaceId) where.workspaceId = workspaceId;
    if (query.businessId) where.businessId = query.businessId;
    if (query.departmentId) where.departmentId = query.departmentId;
    if (query.memoryType) where.memoryType = query.memoryType;
    return this.prisma.aiMemory.findMany({ where, orderBy: [{ importance: 'desc' }, { updatedAt: 'desc' }], take: 100 });
  }

  async retrieve(query: AiContextQueryDto = {}) {
    const [aiMemory, businessMemory, agentMemory] = await Promise.all([
      this.list(query),
      this.prisma.businessMemory.findMany({ where: { tenantId: this.tenantId(), workspaceId: this.workspaceId(query.workspaceId), deletedAt: null }, orderBy: { createdAt: 'desc' }, take: 25 }),
      this.prisma.agentMemory.findMany({ where: { tenantId: this.tenantId(), workspaceId: this.workspaceId(query.workspaceId) ?? '', deletedAt: null }, orderBy: { updatedAt: 'desc' }, take: 25 }),
    ]);
    return { aiMemory, businessMemory, agentMemory };
  }
}
