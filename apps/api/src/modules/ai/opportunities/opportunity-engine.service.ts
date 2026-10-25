import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/database/prisma.service';
import { TenantContextService } from '../../tenants/tenant-context.service';
import { AiContextBuilderService } from '../context/ai-context-builder.service';
import { GenerateOpportunitiesDto, OPPORTUNITY_TYPES } from '../dto/ai-copilot-v2.dto';

@Injectable()
export class OpportunityEngineService {
  constructor(private readonly prisma: PrismaService, private readonly tenantContext: TenantContextService, private readonly contextBuilder: AiContextBuilderService) {}

  async detect(dto: GenerateOpportunitiesDto = {}) {
    const tenantId = this.tenantContext.currentTenantId();
    const built = await this.contextBuilder.build(dto);
    const workspaceId = this.tenantContext.currentWorkspaceId();
    const payload: any = built.payload;
    const requested = dto.opportunityTypes?.length ? dto.opportunityTypes : [...OPPORTUNITY_TYPES];
    const rows = [];
    for (const opportunityType of requested) {
      const opportunity = this.compose(opportunityType, payload);
      rows.push(await this.prisma.aiOpportunity.create({ data: { tenantId, workspaceId, businessId: dto.businessId, departmentId: dto.departmentId, opportunityType, title: opportunity.title, description: opportunity.description, valueEstimate: opportunity.valueEstimate, currency: opportunity.currency, confidence: opportunity.confidence, evidence: opportunity.evidence, recommendedActions: opportunity.recommendedActions } }));
    }
    return { contextId: built.contextId, opportunities: rows };
  }

  list() {
    return this.prisma.aiOpportunity.findMany({ where: { tenantId: this.tenantContext.currentTenantId(), deletedAt: null }, orderBy: [{ confidence: 'desc' }, { createdAt: 'desc' }], take: 100 });
  }

  private compose(type: string, payload: any) {
    const financial = payload.financialState ?? {};
    const customers = payload.crm?.customers?.length ?? 0;
    const leads = payload.crm?.leads?.length ?? 0;
    const workflows = payload.workflows?.length ?? 0;
    const baseValue = Math.max(Number(financial.revenue ?? 0) * 0.1, Number(financial.outstandingInvoices ?? 0) * 0.05, 0);
    const actionMap: Record<string, string[]> = {
      growth: ['Prioritize highest conversion segment', 'Create growth experiment backlog'],
      upsell: ['Identify customers with expansion potential', 'Create account review tasks'],
      automation: ['Convert repeated manual work into workflow automations', 'Measure automation coverage'],
      hiring: ['Review department capacity and role gaps', 'Create hiring plan when workload exceeds capacity'],
      cost_saving: ['Analyze expense categories', 'Negotiate vendor terms'],
      market_expansion: ['Evaluate country and compliance readiness', 'Create market entry checklist'],
    };
    return { title: `${this.label(type)} Opportunity`, description: `Detected ${this.label(type).toLowerCase()} opportunity from active business signals.`, valueEstimate: baseValue || undefined, currency: payload.financialState?.currency ?? payload.country?.countryProfile?.currencyCode, confidence: type === 'automation' && workflows > 0 ? 75 : customers > 0 || leads > 0 ? 65 : 50, evidence: { financial, counts: { customers, leads, workflows } }, recommendedActions: actionMap[type] ?? actionMap.growth };
  }

  private label(value: string) { return value.split('_').map((part) => part[0]?.toUpperCase() + part.slice(1)).join(' '); }
}
