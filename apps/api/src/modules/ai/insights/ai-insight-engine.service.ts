import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/database/prisma.service';
import { TenantContextService } from '../../tenants/tenant-context.service';
import { AiContextBuilderService } from '../context/ai-context-builder.service';
import { GenerateInsightsDto, INSIGHT_TYPES } from '../dto/ai-copilot-v2.dto';

@Injectable()
export class AiInsightEngineService {
  constructor(private readonly prisma: PrismaService, private readonly tenantContext: TenantContextService, private readonly contextBuilder: AiContextBuilderService) {}

  async generate(dto: GenerateInsightsDto = {}) {
    const tenantId = this.tenantContext.currentTenantId();
    const built = await this.contextBuilder.build(dto);
    const payload: any = built.payload;
    const requested = dto.insightTypes?.length ? dto.insightTypes : [...INSIGHT_TYPES];
    const candidates = requested.map((type) => this.composeInsight(type, payload, built.contextId));
    const rows = [];
    for (const insight of candidates) {
      rows.push(await this.prisma.aiInsight.create({ data: { tenantId, title: insight.title, body: insight.body, severity: insight.severity, metadata: insight.metadata } }));
    }
    return { contextId: built.contextId, insights: rows };
  }

  list() {
    return this.prisma.aiInsight.findMany({ where: { tenantId: this.tenantContext.currentTenantId(), deletedAt: null }, orderBy: { createdAt: 'desc' }, take: 100 });
  }

  private composeInsight(type: string, payload: any, contextId: string) {
    const financial = payload.financialState ?? {};
    const leadCount = payload.crm?.leads?.length ?? 0;
    const customerCount = payload.crm?.customers?.length ?? 0;
    const employeeCount = payload.hr?.employees?.length ?? 0;
    const workflowCount = payload.workflows?.length ?? 0;
    const inventoryCount = payload.inventory?.length ?? 0;
    const severity = financial.profit < 0 && ['revenue','finance','executive'].includes(type) ? 'HIGH' : 'INFO';
    const map: Record<string, string> = {
      revenue: `Revenue is ${financial.revenue ?? 0} with outstanding invoice exposure of ${financial.outstandingInvoices ?? 0}.`,
      sales: `Sales context includes ${leadCount} leads and ${customerCount} customers in the active workspace.`,
      customer: `Customer base signal includes ${customerCount} customers and ${leadCount} active leads for conversion analysis.`,
      workflow: `Workflow layer has ${workflowCount} configured workflows available for automation intelligence.`,
      hr: `HR context includes ${employeeCount} employees and ${payload.hr?.departments?.length ?? 0} departments.`,
      finance: `Finance signal shows revenue ${financial.revenue ?? 0}, expenses ${financial.expense ?? 0}, and profit ${financial.profit ?? 0}.`,
      inventory: `Inventory context includes ${inventoryCount} tracked items for shortage and movement intelligence.`,
      executive: `Executive context combines financial, CRM, HR, workflow and KPI signals for operating recommendations.`,
    };
    return { title: `${this.label(type)} Insight`, body: map[type] ?? map.executive, severity, metadata: { type, contextId, financial, counts: { leadCount, customerCount, employeeCount, workflowCount, inventoryCount } } };
  }

  private label(value: string) { return value.split('_').map((part) => part[0]?.toUpperCase() + part.slice(1)).join(' '); }
}