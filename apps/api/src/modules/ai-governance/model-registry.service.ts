import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { EventBusService } from '../events/event-bus.service';
import { TenantContextService } from '../tenants/tenant-context.service';
import { CreateAIModelDto, CreateAIModelRegistryDto, CreateAIModelVersionDto } from './dto/ai-governance.dto';

@Injectable()
export class ModelRegistryService {
  constructor(private readonly prisma: PrismaService, private readonly context: TenantContextService, private readonly events: EventBusService) {}

  registries(status?: string, registryType?: string) {
    return this.prisma.aIModelRegistry.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, status: status ?? undefined, registryType: registryType ?? undefined, deletedAt: null }, include: { models: true }, orderBy: { updatedAt: 'desc' }, take: 100 });
  }

  async createRegistry(dto: CreateAIModelRegistryDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    const record = await this.prisma.aIModelRegistry.create({ data: { tenantId, workspaceId, registryKey: dto.registryKey ?? `ai-model-registry-${randomUUID()}`, name: dto.name, registryType: dto.registryType ?? 'enterprise', status: dto.status ?? 'active', ownerUserId: dto.ownerUserId, governancePolicy: dto.governancePolicy ?? {}, accessPolicy: dto.accessPolicy ?? {}, metadata: dto.metadata ?? {} } });
    await this.events.publish({ tenantId, workspaceId, type: 'ai.model.registry.created', source: 'ai-governance', subject: { type: 'ai_model_registry', id: record.id }, payload: { registryKey: record.registryKey, registryType: record.registryType, status: record.status }, actorUserId: this.context.context()?.userId });
    return record;
  }

  models(provider?: string, modelType?: string, status?: string, riskTier?: string) {
    return this.prisma.aIModel.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, provider: provider ?? undefined, modelType: modelType ?? undefined, status: status ?? undefined, riskTier: riskTier ?? undefined, deletedAt: null }, include: { versions: true, deployments: true }, orderBy: { updatedAt: 'desc' }, take: 100 });
  }

  async createModel(dto: CreateAIModelDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    if (dto.registryId) await this.ensureRegistry(dto.registryId, tenantId, workspaceId);
    const record = await this.prisma.aIModel.create({ data: { tenantId, workspaceId, registryId: dto.registryId, modelKey: dto.modelKey ?? `ai-model-${randomUUID()}`, name: dto.name, provider: dto.provider ?? 'openai', modelType: dto.modelType ?? 'llm', domain: dto.domain ?? 'general', status: dto.status ?? 'registered', riskTier: dto.riskTier ?? 'medium', ownerUserId: dto.ownerUserId, purpose: dto.purpose, limitations: dto.limitations ?? [], policies: dto.policies ?? [], tags: dto.tags ?? [], metadata: dto.metadata ?? {} } });
    await this.events.publish({ tenantId, workspaceId, type: 'ai.model.created', source: 'ai-governance', subject: { type: 'ai_model', id: record.id }, payload: { modelKey: record.modelKey, provider: record.provider, modelType: record.modelType, riskTier: record.riskTier }, actorUserId: this.context.context()?.userId });
    return record;
  }

  versions(aiModelId?: string, status?: string, releaseStage?: string) {
    return this.prisma.aIModelVersion.findMany({ where: { tenantId: this.context.currentTenantId(), workspaceId: this.context.currentWorkspaceId() ?? undefined, aiModelId: aiModelId ?? undefined, status: status ?? undefined, releaseStage: releaseStage ?? undefined, deletedAt: null }, include: { aiModel: true, deployments: true }, orderBy: { updatedAt: 'desc' }, take: 100 });
  }

  async createVersion(dto: CreateAIModelVersionDto) {
    const tenantId = this.context.currentTenantId();
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    await this.ensureModel(dto.aiModelId, tenantId, workspaceId);
    const record = await this.prisma.aIModelVersion.create({ data: { tenantId, workspaceId, aiModelId: dto.aiModelId, versionKey: dto.versionKey ?? `ai-model-version-${randomUUID()}`, version: dto.version, status: dto.status ?? 'draft', releaseStage: dto.releaseStage ?? 'development', artifactUri: dto.artifactUri, promptTemplate: dto.promptTemplate ?? {}, parameters: dto.parameters ?? {}, evaluationSummary: dto.evaluationSummary ?? {}, approvedAt: dto.approvedAt ? new Date(dto.approvedAt) : undefined, deprecatedAt: dto.deprecatedAt ? new Date(dto.deprecatedAt) : undefined, metadata: dto.metadata ?? {} } });
    await this.events.publish({ tenantId, workspaceId, type: 'ai.model.version.created', source: 'ai-governance', subject: { type: 'ai_model_version', id: record.id }, payload: { aiModelId: record.aiModelId, version: record.version, status: record.status, releaseStage: record.releaseStage }, actorUserId: this.context.context()?.userId });
    return record;
  }

  async dashboard() {
    const [registries, models, versions] = await Promise.all([this.registries(), this.models(), this.versions()]);
    return { registries, models, versions, summary: { registryCount: registries.length, modelCount: models.length, versionCount: versions.length, highRiskModelCount: models.filter((model: { riskTier: string }) => ['high', 'critical'].includes(model.riskTier)).length } };
  }

  private async ensureRegistry(id: string, tenantId: string, workspaceId?: string | null) {
    const record = await this.prisma.aIModelRegistry.findFirst({ where: { id, tenantId, workspaceId: workspaceId ?? undefined, deletedAt: null } });
    if (!record) throw new NotFoundException('AI model registry not found');
  }

  private async ensureModel(id: string, tenantId: string, workspaceId?: string | null) {
    const record = await this.prisma.aIModel.findFirst({ where: { id, tenantId, workspaceId: workspaceId ?? undefined, deletedAt: null } });
    if (!record) throw new NotFoundException('AI model not found');
  }
}