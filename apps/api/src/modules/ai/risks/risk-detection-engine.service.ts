import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/database/prisma.service';
import { TenantContextService } from '../../tenants/tenant-context.service';
import { AiContextBuilderService } from '../context/ai-context-builder.service';
import { GenerateRisksDto, RISK_TYPES } from '../dto/ai-copilot-v2.dto';

@Injectable()
export class RiskDetectionEngineService {
  constructor(private readonly prisma: PrismaService, private readonly tenantContext: TenantContextService, private readonly contextBuilder: AiContextBuilderService) {}

  async detect(dto: GenerateRisksDto = {}) {
    const tenantId = this.tenantContext.currentTenantId();
    const built = await this.contextBuilder.build(dto);
    const workspaceId = this.tenantContext.currentWorkspaceId();
    const payload: any = built.payload;
    const requested = dto.riskTypes?.length ? dto.riskTypes : [...RISK_TYPES];
    const rows = [];
    for (const riskType of requested) {
      const assessment = this.assess(riskType, payload);
      rows.push(await this.prisma.aiRiskAssessment.create({ data: { tenantId, workspaceId, businessId: dto.businessId, departmentId: dto.departmentId, riskType, title: assessment.title, description: assessment.description, severity: assessment.severity, probability: assessment.probability, impact: assessment.impact, score: assessment.score, signals: assessment.signals, mitigation: assessment.mitigation } }));
    }
    return { contextId: built.contextId, risks: rows };
  }

  list() {
    return this.prisma.aiRiskAssessment.findMany({ where: { tenantId: this.tenantContext.currentTenantId(), deletedAt: null }, orderBy: [{ score: 'desc' }, { createdAt: 'desc' }], take: 100 });
  }

  private assess(riskType: string, payload: any) {
    const financial = payload.financialState ?? {};
    const counts = { leads: payload.crm?.leads?.length ?? 0, customers: payload.crm?.customers?.length ?? 0, employees: payload.hr?.employees?.length ?? 0, inventory: payload.inventory?.length ?? 0, workflows: payload.workflows?.length ?? 0 };
    const baseScore: Record<string, number> = {
      revenue: financial.revenue <= 0 ? 80 : 35,
      cash_flow: financial.cashFlowSignal < 0 ? 82 : 40,
      employee_attrition: counts.employees < 3 ? 55 : 30,
      lead_drop: counts.leads === 0 ? 70 : 35,
      inventory_shortage: counts.inventory === 0 ? 45 : 30,
      workflow_failure: counts.workflows === 0 ? 60 : 25,
      customer_churn: counts.customers === 0 ? 65 : 35,
      compliance: payload.country?.countryCode ? 35 : 55,
    };
    const score = baseScore[riskType] ?? 40;
    const severity = score >= 80 ? 'CRITICAL' : score >= 65 ? 'HIGH' : score >= 45 ? 'MEDIUM' : 'LOW';
    return { title: `${this.label(riskType)} Risk`, description: `Detected ${this.label(riskType).toLowerCase()} risk from current operating context.`, severity, probability: score, impact: Math.min(100, score + 10), score, signals: [{ financial }, { counts }], mitigation: { recommendedAction: `Review ${riskType} drivers and assign accountable owner.` } };
  }

  private label(value: string) { return value.split('_').map((part) => part[0]?.toUpperCase() + part.slice(1)).join(' '); }
}
