import { Injectable, NotFoundException } from '@nestjs/common';
import { EventBusService } from '../../events/event-bus.service';
import { AiService } from '../../ai/ai.service';
import { WorkspaceBlueprintService } from '../../adaptive-workspace/blueprints/workspace-blueprint.service';
import { IndustryRegistryService } from '../../adaptive-workspace/registry/industry-registry.service';
import { PrismaService } from '../../../infrastructure/database/prisma.service';
import { TenantContextService } from '../../tenants/tenant-context.service';
import { CompleteOnboardingStepDto, GenerateOnboardingWorkspaceDto, OnboardingAssistantDto, StartOnboardingDto } from '../dto/onboarding.dto';

@Injectable()
export class CustomerOnboardingService {
  constructor(private readonly prisma: PrismaService, private readonly context: TenantContextService, private readonly events: EventBusService, private readonly ai: AiService, private readonly blueprints: WorkspaceBlueprintService, private readonly industry: IndustryRegistryService) {}

  industries() { return this.industry.list(); }
  profiles(status?: string) { return this.prisma.onboardingProfile.findMany({ where: { tenantId: this.context.currentTenantId(), status: status ?? undefined, deletedAt: null }, include: { steps: true, recommendations: true }, orderBy: { createdAt: 'desc' } }); }

  async start(dto: StartOnboardingDto) {
    const tenantId = this.context.currentTenantId();
    const recommendations = this.recommend(dto.industry, dto.goals ?? []);
    const profile = await this.prisma.onboardingProfile.create({ data: { tenantId, organizationId: dto.organizationId, businessId: dto.businessId, status: 'in_progress', businessName: dto.businessName, industry: dto.industry, businessType: dto.businessType, countryCode: dto.countryCode, revenueRange: dto.revenueRange, teamSizeRange: dto.teamSizeRange, growthStage: dto.growthStage, goals: dto.goals ?? [], recommendedModules: recommendations.modules, recommendedWorkflows: recommendations.workflows, recommendedAgents: recommendations.agents, assistantState: { lastPrompt: 'start' }, steps: { create: this.defaultSteps(tenantId) }, recommendations: { create: this.recommendationRows(tenantId, recommendations) } }, include: { steps: true, recommendations: true } });
    await this.events.publish({ tenantId, type: 'onboarding.started', source: 'customer-onboarding', subject: { type: 'onboarding_profile', id: profile.id }, payload: { industry: dto.industry, businessType: dto.businessType }, actorUserId: this.context.context()?.userId });
    return profile;
  }

  async completeStep(profileId: string, dto: CompleteOnboardingStepDto) {
    const tenantId = this.context.currentTenantId();
    await this.getProfile(profileId);
    return this.prisma.onboardingStep.upsert({ where: { tenantId_onboardingProfileId_stepKey: { tenantId, onboardingProfileId: profileId, stepKey: dto.stepKey } }, update: { status: 'completed', input: dto.input ?? {}, output: dto.output ?? {}, completedAt: new Date() }, create: { tenantId, onboardingProfileId: profileId, stepKey: dto.stepKey, status: 'completed', input: dto.input ?? {}, output: dto.output ?? {}, completedAt: new Date() } });
  }

  async recommendations(profileId: string) { await this.getProfile(profileId); return this.prisma.onboardingRecommendation.findMany({ where: { tenantId: this.context.currentTenantId(), onboardingProfileId: profileId, deletedAt: null }, orderBy: [{ priority: 'asc' }, { createdAt: 'asc' }] }); }

  async generateWorkspace(profileId: string, dto: GenerateOnboardingWorkspaceDto) {
    const profile = await this.getProfile(profileId);
    const tenantId = this.context.currentTenantId();
    const blueprint = await this.blueprints.generate({ workspaceName: dto.workspaceName, workspaceSlug: dto.workspaceSlug, organizationId: dto.organizationId ?? profile.organizationId ?? '', businessId: dto.businessId ?? profile.businessId ?? undefined, profile: { industry: this.enumValue(profile.industry, 'saas'), businessType: this.enumValue(profile.businessType, 'startup'), country: profile.countryCode ?? 'US', revenueRange: this.enumValue(profile.revenueRange, 'under_100k'), teamSize: this.enumValue(profile.teamSizeRange, '2_10'), growthStage: this.enumValue(profile.growthStage, 'growth'), goals: profile.goals as string[], role: dto.role ?? 'Admin' } });
    const updated = await this.prisma.onboardingProfile.update({ where: { id: profileId }, data: { workspaceId: (blueprint.blueprint as any)?.workspace?.id, status: 'workspace_generated', metadata: { blueprintId: blueprint.id }, selectedModules: (blueprint.blueprint as any)?.modules ?? [] } });
    await this.events.publish({ tenantId, type: 'workspace.onboarding.generated', source: 'customer-onboarding', subject: { type: 'onboarding_profile', id: profileId }, payload: { blueprintId: blueprint.id, workspaceName: dto.workspaceName }, actorUserId: this.context.context()?.userId });
    return { profile: updated, blueprint };
  }

  async complete(profileId: string) {
    const tenantId = this.context.currentTenantId();
    const profile = await this.getProfile(profileId);
    const completed = await this.prisma.onboardingProfile.update({ where: { id: profile.id }, data: { status: 'completed', completedAt: new Date() } });
    await this.events.publish({ tenantId, type: 'onboarding.completed', source: 'customer-onboarding', subject: { type: 'onboarding_profile', id: profileId }, payload: { industry: profile.industry, businessType: profile.businessType }, actorUserId: this.context.context()?.userId });
    return completed;
  }

  async assistant(profileId: string, dto: OnboardingAssistantDto) {
    const profile = await this.getProfile(profileId);
    const response = await this.ai.complete({ tenantId: this.context.currentTenantId(), model: 'gpt-4.1-mini', temperature: 0.2, messages: [{ role: 'system', content: 'You are the NEXORA AI onboarding assistant. Recommend modules, workspace structure, migration next steps, and setup risks. Keep responses concise and operational.' }, { role: 'user', content: JSON.stringify({ profile, message: dto.message, context: dto.context ?? {} }) }] });
    await this.prisma.onboardingProfile.update({ where: { id: profileId }, data: { assistantState: { lastMessage: dto.message, lastResponse: response.content, model: response.model, at: new Date().toISOString() } } });
    return response;
  }

  private async getProfile(profileId: string) {
    const profile = await this.prisma.onboardingProfile.findFirst({ where: { tenantId: this.context.currentTenantId(), id: profileId, deletedAt: null }, include: { steps: true, recommendations: true } });
    if (!profile) throw new NotFoundException('Onboarding profile not found');
    return profile;
  }

  private recommend(industry: string, goals: string[]) {
    const template = this.industry.get(this.enumValue(industry, 'saas'));
    const modules = template.recommendedModules ?? ['CRM', 'Projects', 'Analytics'];
    return { modules, workflows: template.recommendedWorkflows ?? ['lead_followup'], agents: template.recommendedAgents ?? ['Executive Agent'], kpis: template.recommendedKpis ?? ['revenue'] , goals };
  }

  private enumValue(value: string | null | undefined, fallback: string) { return String(value ?? fallback).trim().toLowerCase().replace(/[^a-z0-9]+/g, '_') || fallback; }

  private defaultSteps(tenantId: string) {
    return ['business_profile', 'industry_selection', 'workspace_generation', 'module_recommendations', 'migration_plan', 'ai_assistant_review'].map((stepKey) => ({ tenantId, stepKey, status: stepKey === 'business_profile' ? 'completed' : 'pending' }));
  }

  private recommendationRows(tenantId: string, recommendations: { modules: string[]; workflows: string[]; agents: string[]; kpis: string[] }) {
    const rows = [
      ...recommendations.modules.map((item, index) => ({ tenantId, recommendationType: 'module', recommendationKey: item, title: `${item} module`, rationale: 'Recommended by industry profile', priority: 10 + index, payload: { module: item } })),
      ...recommendations.workflows.map((item, index) => ({ tenantId, recommendationType: 'workflow', recommendationKey: item, title: `${item} workflow`, rationale: 'Recommended automation for onboarding', priority: 30 + index, payload: { workflow: item } })),
      ...recommendations.agents.map((item, index) => ({ tenantId, recommendationType: 'agent', recommendationKey: item, title: `${item}`, rationale: 'Recommended AI operating agent', priority: 50 + index, payload: { agent: item } })),
    ];
    return rows;
  }
}

