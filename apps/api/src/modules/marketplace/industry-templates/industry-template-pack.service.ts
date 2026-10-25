import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/database/prisma.service';
import { EventBusService } from '../../events/event-bus.service';
import { TenantContextService } from '../../tenants/tenant-context.service';
import { CreateIndustryTemplatePackDto, InstallIndustryTemplateDto } from '../dto/marketplace.dto';

interface IndustryPackSeed {
  industry: string;
  name: string;
  description: string;
  modules: string[];
  kpis: string[];
  aiAgents: string[];
  workflows: Array<Record<string, unknown>>;
  dashboards: Array<Record<string, unknown>>;
  navigation: Array<Record<string, unknown>>;
  compliance: string[];
}

@Injectable()
export class IndustryTemplatePackService {
  constructor(private readonly prisma: PrismaService, private readonly context: TenantContextService, private readonly events: EventBusService) {}

  templates(industry?: string, status?: string) {
    return this.prisma.industryTemplatePack.findMany({ where: { tenantId: this.context.currentTenantId(), industry: industry ?? undefined, status: status ?? undefined, deletedAt: null }, orderBy: [{ industry: 'asc' }, { name: 'asc' }], take: 100 });
  }

  async createTemplate(dto: CreateIndustryTemplatePackDto) {
    const tenantId = this.context.currentTenantId();
    const templateKey = dto.templateKey ?? this.slugify(`${dto.industry}-${dto.name}`);
    return this.prisma.industryTemplatePack.create({ data: { tenantId, templateKey, industry: dto.industry, name: dto.name, description: dto.description, version: dto.version ?? '1.0.0', status: dto.status ?? 'draft', modules: dto.modules ?? [], workflows: dto.workflows ?? [], dashboards: dto.dashboards ?? [], kpis: dto.kpis ?? [], aiAgents: dto.aiAgents ?? [], navigation: dto.navigation ?? [], compliance: dto.compliance ?? [], metadata: dto.metadata ?? {}, publishedAt: dto.status === 'published' ? new Date() : undefined } });
  }

  async bootstrapDefaults() {
    const tenantId = this.context.currentTenantId();
    const results = [];
    for (const seed of this.defaultPacks()) {
      const templateKey = `${seed.industry}-operating-system`;
      const existing = await this.prisma.industryTemplatePack.findFirst({ where: { tenantId, templateKey, version: '1.0.0', deletedAt: null } });
      if (existing) {
        results.push(await this.prisma.industryTemplatePack.update({ where: { id: existing.id }, data: { name: seed.name, description: seed.description, status: 'published', modules: seed.modules, workflows: seed.workflows, dashboards: seed.dashboards, kpis: seed.kpis, aiAgents: seed.aiAgents, navigation: seed.navigation, compliance: seed.compliance, publishedAt: existing.publishedAt ?? new Date() } }));
      } else {
        results.push(await this.prisma.industryTemplatePack.create({ data: { tenantId, templateKey, industry: seed.industry, name: seed.name, description: seed.description, version: '1.0.0', status: 'published', modules: seed.modules, workflows: seed.workflows, dashboards: seed.dashboards, kpis: seed.kpis, aiAgents: seed.aiAgents, navigation: seed.navigation, compliance: seed.compliance, metadata: { source: 'phase-21-bootstrap' }, publishedAt: new Date() } }));
      }
    }
    return { count: results.length, templates: results };
  }

  async installTemplate(id: string, dto: InstallIndustryTemplateDto) {
    const tenantId = this.context.currentTenantId();
    const template = await this.prisma.industryTemplatePack.findFirst({ where: { tenantId, id, deletedAt: null } });
    if (!template) throw new NotFoundException('Industry template pack not found');
    const workspaceId = dto.workspaceId ?? this.context.currentWorkspaceId();
    const modules = Array.isArray(template.modules) ? template.modules.map(String) : [];
    const appliedModules = [];
    if (dto.businessId) {
      for (const moduleKey of modules) {
        const existing = await this.prisma.moduleActivation.findFirst({ where: { tenantId, businessId: dto.businessId, moduleKey, deletedAt: null } });
        const activation = existing
          ? await this.prisma.moduleActivation.update({ where: { id: existing.id }, data: { enabled: true, workspaceId, metadata: { templatePackId: id, templateKey: template.templateKey, ...(dto.configuration ?? {}) }, disabledAt: null } })
          : await this.prisma.moduleActivation.create({ data: { tenantId, businessId: dto.businessId, workspaceId, moduleKey, enabled: true, metadata: { templatePackId: id, templateKey: template.templateKey, ...(dto.configuration ?? {}) } } });
        appliedModules.push(activation);
      }
    }
    const updated = await this.prisma.industryTemplatePack.update({ where: { id }, data: { installCount: template.installCount + 1 } });
    await this.events.publish({ tenantId, workspaceId, type: 'industry_template.installed', source: 'industry-template-packs', subject: { type: 'industry_template_pack', id }, payload: { industry: template.industry, templateKey: template.templateKey, businessId: dto.businessId, appliedModules: appliedModules.map((module: any) => module.moduleKey) }, actorUserId: this.context.context()?.userId });
    return { template: updated, appliedModules, workspaceBlueprint: { industry: template.industry, modules, dashboards: template.dashboards, kpis: template.kpis, workflows: template.workflows, aiAgents: template.aiAgents, navigation: template.navigation, compliance: template.compliance } };
  }

  private defaultPacks(): IndustryPackSeed[] {
    return [
      { industry: 'healthcare', name: 'Healthcare Operating System', description: 'Patient operations, workforce, finance, compliance and secure document workflows.', modules: ['crm', 'hr', 'finance', 'documents', 'analytics'], kpis: ['patient-intake-cycle-time', 'claim-aging', 'staff-utilization', 'compliance-exceptions'], aiAgents: ['operations-agent', 'finance-agent', 'hr-agent', 'executive-agent'], workflows: [{ key: 'patient-intake-follow-up', trigger: 'customer.created' }, { key: 'compliance-document-review', trigger: 'document.created' }], dashboards: [{ key: 'care-operations', role: 'manager' }, { key: 'finance-risk', role: 'admin' }], navigation: [{ label: 'Patients', module: 'crm' }, { label: 'Compliance Docs', module: 'documents' }], compliance: ['HIPAA', 'SOC2', 'GDPR'] },
      { industry: 'education', name: 'Education Operating System', description: 'Enrollment, staff, projects, finance and student-service workflows.', modules: ['crm', 'projects', 'hr', 'finance', 'documents', 'analytics'], kpis: ['enrollment-growth', 'student-retention', 'program-margin', 'staff-attendance'], aiAgents: ['customer-success-agent', 'operations-agent', 'analytics-agent'], workflows: [{ key: 'admission-lead-nurture', trigger: 'lead.created' }, { key: 'program-reporting', trigger: 'workflow.scheduled' }], dashboards: [{ key: 'enrollment-command', role: 'manager' }], navigation: [{ label: 'Admissions', module: 'crm' }, { label: 'Programs', module: 'projects' }], compliance: ['GDPR', 'FERPA-ready-controls'] },
      { industry: 'manufacturing', name: 'Manufacturing Operating System', description: 'Inventory, production tasks, suppliers, finance and operations automation.', modules: ['inventory', 'projects', 'tasks', 'finance', 'analytics', 'documents'], kpis: ['inventory-turnover', 'production-throughput', 'supplier-cycle-time', 'cash-flow'], aiAgents: ['operations-agent', 'finance-agent', 'analytics-agent'], workflows: [{ key: 'inventory-reorder-alert', trigger: 'ai.insight.generated' }, { key: 'production-task-escalation', trigger: 'task.created' }], dashboards: [{ key: 'plant-operations', role: 'manager' }, { key: 'supply-finance', role: 'admin' }], navigation: [{ label: 'Inventory', module: 'inventory' }, { label: 'Production Tasks', module: 'tasks' }], compliance: ['ISO27001', 'SOC2'] },
      { industry: 'retail', name: 'Retail Operating System', description: 'Inventory, customers, revenue, stores, promotions and workforce operations.', modules: ['inventory', 'crm', 'finance', 'hr', 'analytics'], kpis: ['same-store-sales', 'stockout-risk', 'gross-margin', 'customer-repeat-rate'], aiAgents: ['sales-agent', 'operations-agent', 'finance-agent'], workflows: [{ key: 'low-stock-promotion-review', trigger: 'ai.insight.generated' }, { key: 'customer-winback', trigger: 'customer.created' }], dashboards: [{ key: 'retail-performance', role: 'manager' }], navigation: [{ label: 'Customers', module: 'crm' }, { label: 'Stock', module: 'inventory' }], compliance: ['PCI-ready-controls', 'CCPA', 'GDPR'] },
      { industry: 'professional-services', name: 'Professional Services Operating System', description: 'Pipeline, projects, utilization, invoices, delivery and client success workflows.', modules: ['crm', 'projects', 'tasks', 'finance', 'hr', 'analytics'], kpis: ['pipeline-value', 'billable-utilization', 'project-margin', 'invoice-aging'], aiAgents: ['crm-agent', 'operations-agent', 'finance-agent', 'executive-agent'], workflows: [{ key: 'proposal-to-project', trigger: 'lead.converted' }, { key: 'invoice-follow-up', trigger: 'invoice.created' }], dashboards: [{ key: 'delivery-command', role: 'manager' }, { key: 'executive-services', role: 'executive' }], navigation: [{ label: 'Pipeline', module: 'crm' }, { label: 'Delivery', module: 'projects' }], compliance: ['SOC2', 'ISO27001', 'GDPR'] },
    ];
  }

  private slugify(value: string) {
    return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  }
}