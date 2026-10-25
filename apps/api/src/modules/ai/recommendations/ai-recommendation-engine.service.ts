import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/database/prisma.service';
import { TenantContextService } from '../../tenants/tenant-context.service';
import { AiContextBuilderService } from '../context/ai-context-builder.service';
import { GenerateRecommendationsDto, RECOMMENDATION_TYPES } from '../dto/ai-copilot-v2.dto';

@Injectable()
export class AiRecommendationEngineService {
  constructor(private readonly prisma: PrismaService, private readonly tenantContext: TenantContextService, private readonly contextBuilder: AiContextBuilderService) {}

  async generate(dto: GenerateRecommendationsDto = {}) {
    const tenantId = this.tenantContext.currentTenantId();
    const built = await this.contextBuilder.build(dto);
    const workspaceId = this.tenantContext.currentWorkspaceId();
    const payload: any = built.payload;
    const requested = dto.recommendationTypes?.length ? dto.recommendationTypes : [...RECOMMENDATION_TYPES];
    const recommendations = [];
    for (const type of requested) {
      const recommendation = this.compose(type, payload);
      const row = await this.prisma.aiRecommendation.create({ data: { tenantId, title: recommendation.title, summary: recommendation.summary, priority: recommendation.priority, evidence: recommendation.evidence, recommendedAction: recommendation.recommendedAction } });
      if (type === 'task') await this.prisma.aiTaskSuggestion.create({ data: { tenantId, workspaceId, businessId: dto.businessId, userId: this.tenantContext.context()?.userId, recommendationId: row.id, title: recommendation.title, description: recommendation.summary, priority: recommendation.priority, evidence: recommendation.evidence } });
      if (type === 'workflow' || type === 'automation') await this.prisma.aiWorkflowSuggestion.create({ data: { tenantId, workspaceId, businessId: dto.businessId, recommendationId: row.id, workflowKey: `${type}_${Date.now()}`, title: recommendation.title, description: recommendation.summary, trigger: { type: 'ai_recommendation' }, steps: recommendation.recommendedAction?.steps ?? [], expectedImpact: recommendation.recommendedAction?.impact ?? {} } });
      recommendations.push(row);
    }
    return { contextId: built.contextId, recommendations };
  }

  list() {
    return this.prisma.aiRecommendation.findMany({ where: { tenantId: this.tenantContext.currentTenantId(), deletedAt: null }, orderBy: [{ priority: 'desc' }, { createdAt: 'desc' }], take: 100 });
  }

  listTaskSuggestions() {
    return this.prisma.aiTaskSuggestion.findMany({ where: { tenantId: this.tenantContext.currentTenantId(), deletedAt: null }, orderBy: { createdAt: 'desc' }, take: 100 });
  }

  listWorkflowSuggestions() {
    return this.prisma.aiWorkflowSuggestion.findMany({ where: { tenantId: this.tenantContext.currentTenantId(), deletedAt: null }, orderBy: { createdAt: 'desc' }, take: 100 });
  }

  private compose(type: string, payload: any) {
    const financial = payload.financialState ?? {};
    const priority = financial.profit < 0 && ['budget_change','revenue_action'].includes(type) ? 'HIGH' : 'MEDIUM';
    const summaryMap: Record<string, string> = {
      task: 'Create focused execution tasks from the highest-priority business signal.',
      workflow: 'Create a workflow to automate recurring operating work and reduce manual follow-up.',
      automation: 'Increase automation coverage for repeated CRM, finance, HR or workflow actions.',
      hiring: 'Review role capacity and decide whether hiring or reassignment is needed.',
      budget_change: 'Adjust budget allocation based on revenue, expense and cash flow signals.',
      revenue_action: 'Act on revenue drivers, outstanding invoices and lead conversion signals.',
    };
    return { title: `${this.label(type)} Recommendation`, summary: summaryMap[type] ?? summaryMap.task, priority, evidence: { financial, contextCounts: { leads: payload.crm?.leads?.length ?? 0, customers: payload.crm?.customers?.length ?? 0, employees: payload.hr?.employees?.length ?? 0 } }, recommendedAction: { type, steps: [`Review ${type} signal`, 'Assign owner', 'Set follow-up metric'], impact: { expected: 'improved operating focus' } } };
  }

  private label(value: string) { return value.split('_').map((part) => part[0]?.toUpperCase() + part.slice(1)).join(' '); }
}
