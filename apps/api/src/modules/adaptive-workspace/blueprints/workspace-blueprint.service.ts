import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { TenantContextService } from '../../tenants/tenant-context.service';
import { BusinessClassification, BusinessClassificationService } from '../classification/business-classification.service';
import { GenerateWorkspaceDto } from '../dto/adaptive-workspace.dto';
import { DashboardGeneratorService } from '../generators/dashboard-generator.service';
import { ModuleActivationService } from '../generators/module-activation.service';
import { NavigationGeneratorService } from '../generators/navigation-generator.service';
import { AdaptiveWorkspaceRepository } from '../repositories/adaptive-workspace.repository';
import { IndustryRegistryService, IndustryTemplateDefinition } from '../registry/industry-registry.service';
import { WorkspaceRecommendationEngine } from '../recommendations/recommendation-engine.service';

@Injectable()
export class WorkspaceBlueprintService {
  constructor(
    private readonly context: TenantContextService,
    private readonly classifier: BusinessClassificationService,
    private readonly industry: IndustryRegistryService,
    private readonly modules: ModuleActivationService,
    private readonly navigation: NavigationGeneratorService,
    private readonly dashboards: DashboardGeneratorService,
    private readonly recommendations: WorkspaceRecommendationEngine,
    private readonly repo: AdaptiveWorkspaceRepository,
  ) {}

  async generate(dto: GenerateWorkspaceDto, workspaceId = this.context.currentWorkspaceId()) {
    if (!workspaceId) throw new BadRequestException('Workspace context is required before workspace generation');

    const tenantId = this.context.currentTenantId();
    const classification = this.classifier.classify(dto.profile);
    const industryTemplate = this.industry.get(classification.industry);
    await this.repo.upsertIndustryTemplate({ industry: industryTemplate.industry, template: industryTemplateToJson(industryTemplate) });

    const moduleStructure = this.modules.generate(classification, industryTemplate);
    const navigationStructure = this.navigation.generate(moduleStructure);
    const dashboardStructure = this.dashboards.generate({ classification, template: industryTemplate, role: dto.profile.role, modules: moduleStructure });
    const kpiStructure = industryTemplate.recommendedKpis.map((key, index) => ({ key, title: title(key), order: (index + 1) * 10, source: 'industry_template' }));
    const workflowStructure = industryTemplate.recommendedWorkflows.map((key, index) => ({ key, title: title(key), trigger: inferTrigger(key), status: 'recommended', order: (index + 1) * 10 }));
    const aiAgentStructure = industryTemplate.recommendedAgents.map((key, index) => ({ key, title: `${title(key)} Agent`, capabilities: ['read_workspace_context', 'generate_recommendations', 'trigger_workflows'], order: (index + 1) * 10 }));
    const automationStructure = workflowStructure.map((workflow) => ({ key: workflow.key, type: 'workflow_template', enabledByDefault: classification.recommendedDepth !== 'starter' }));
    const recommendationStructure = this.recommendations.generate({ classification, template: industryTemplate, enabledModules: moduleStructure.map((module) => module.moduleKey) });
    const blueprint = workspaceBlueprintToJson({
      workspaceId,
      dto,
      classification,
      modules: moduleStructure,
      navigation: navigationStructure,
      dashboards: dashboardStructure,
      kpis: kpiStructure,
      workflows: workflowStructure,
      aiAgents: aiAgentStructure,
      automations: automationStructure,
      recommendations: recommendationStructure,
    });
    const record = await this.repo.createBlueprint({
      tenantId,
      workspaceId,
      businessId: dto.businessId,
      industry: classification.industry,
      businessType: classification.businessType,
      profile: profileToJson(dto),
      blueprint,
    });

    return {
      ...record,
      blueprintId: record.id,
      organizationId: dto.organizationId,
      workspaceId,
      workspace: {
        id: workspaceId,
        organizationId: dto.organizationId,
        name: dto.workspaceName,
        slug: dto.workspaceSlug,
      },
      generatedAt: record.createdAt,
    };
  }

  getLatest(workspaceId?: string, blueprintId?: string) {
    return this.repo.latestBlueprint(this.context.currentTenantId(), workspaceId, blueprintId);
  }

  async getDashboardBlueprint(workspaceId?: string, blueprintId?: string) {
    const blueprint = await this.getLatest(workspaceId, blueprintId);
    return blueprintDocument(blueprint.blueprint).dashboards;
  }

  async getNavigationBlueprint(workspaceId?: string, blueprintId?: string) {
    const blueprint = await this.getLatest(workspaceId, blueprintId);
    return blueprintDocument(blueprint.blueprint).navigation;
  }

  async getRecommendations(workspaceId?: string, blueprintId?: string) {
    const blueprint = await this.getLatest(workspaceId, blueprintId);
    return blueprintDocument(blueprint.blueprint).recommendations;
  }
}

function workspaceBlueprintToJson(input: {
  workspaceId: string;
  dto: GenerateWorkspaceDto;
  classification: BusinessClassification;
  modules: ReturnType<ModuleActivationService['generate']>;
  navigation: ReturnType<NavigationGeneratorService['generate']>;
  dashboards: ReturnType<DashboardGeneratorService['generate']>;
  kpis: Array<{ key: string; title: string; order: number; source: string }>;
  workflows: Array<{ key: string; title: string; trigger: string; status: string; order: number }>;
  aiAgents: Array<{ key: string; title: string; capabilities: string[]; order: number }>;
  automations: Array<{ key: string; type: string; enabledByDefault: boolean }>;
  recommendations: ReturnType<WorkspaceRecommendationEngine['generate']>;
}): Prisma.InputJsonObject {
  return {
    workspace: {
      id: input.workspaceId,
      name: input.dto.workspaceName,
      slug: input.dto.workspaceSlug,
      organizationId: input.dto.organizationId,
      businessId: input.dto.businessId ?? null,
      classification: classificationToJson(input.classification),
    },
    modules: input.modules,
    navigation: input.navigation,
    dashboards: input.dashboards,
    kpis: input.kpis,
    workflows: input.workflows,
    aiAgents: input.aiAgents,
    automations: input.automations,
    recommendations: input.recommendations,
  };
}

function profileToJson(dto: GenerateWorkspaceDto): Prisma.InputJsonObject {
  return {
    industry: dto.profile.industry,
    businessType: dto.profile.businessType,
    teamSize: dto.profile.teamSize,
    revenueRange: dto.profile.revenueRange,
    growthStage: dto.profile.growthStage,
    country: dto.profile.country,
    goals: dto.profile.goals,
    role: dto.profile.role ?? null,
    metadata: dto.profile.metadata ?? {},
  };
}

function classificationToJson(classification: BusinessClassification): Prisma.InputJsonObject {
  return {
    industry: classification.industry,
    businessType: classification.businessType,
    country: classification.country,
    revenueRange: classification.revenueRange,
    teamSize: classification.teamSize,
    growthStage: classification.growthStage,
    goals: classification.goals,
    operatingComplexity: classification.operatingComplexity,
    recommendedDepth: classification.recommendedDepth,
  };
}

function industryTemplateToJson(template: IndustryTemplateDefinition): Prisma.InputJsonObject {
  return {
    industry: template.industry,
    recommendedModules: template.recommendedModules,
    recommendedKpis: template.recommendedKpis,
    recommendedWorkflows: template.recommendedWorkflows,
    recommendedAgents: template.recommendedAgents,
    recommendedDashboards: template.recommendedDashboards,
  };
}

function blueprintDocument(value: Prisma.JsonValue) {
  if (!isJsonObject(value)) return { dashboards: [], navigation: [], recommendations: [] };
  return {
    dashboards: value.dashboards ?? [],
    navigation: value.navigation ?? [],
    recommendations: value.recommendations ?? [],
  };
}

function isJsonObject(value: Prisma.JsonValue): value is Prisma.JsonObject {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function title(value: string) {
  return value.split('_').map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(' ');
}

function inferTrigger(value: string) {
  if (value.includes('invoice') || value.includes('billing')) return 'invoice.created';
  if (value.includes('lead') || value.includes('proposal')) return 'lead.created';
  if (value.includes('stock')) return 'inventory.low_stock';
  return 'manual.trigger';
}
