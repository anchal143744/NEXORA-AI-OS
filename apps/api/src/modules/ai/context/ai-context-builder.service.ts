import { createHash } from 'crypto';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/database/prisma.service';
import { TenantContextService } from '../../tenants/tenant-context.service';
import { AiContextQueryDto } from '../dto/ai-copilot-v2.dto';

@Injectable()
export class AiContextBuilderService {
  constructor(private readonly prisma: PrismaService, private readonly context: TenantContextService) {}

  private tenantId() { return this.context.currentTenantId(); }
  private workspaceId(input?: string) {
    const currentWorkspaceId = this.context.currentWorkspaceId();
    if (input && input !== currentWorkspaceId) throw new ForbiddenException('Workspace context is not authorized');
    return currentWorkspaceId;
  }
  private userId() { return this.context.context()?.userId; }

  async build(input: AiContextQueryDto = {}) {
    const tenantId = this.tenantId();
    const workspaceId = this.workspaceId(input.workspaceId);
    const userId = this.userId();
    const businessId = input.businessId;
    const employeeIdRows = workspaceId
      ? await this.prisma.attendanceRecord.findMany({
        where: { tenantId, workspaceId, deletedAt: null },
        distinct: ['employeeId'],
        select: { employeeId: true },
        take: 1000,
      })
      : [];
    const workspaceEmployeeIds = employeeIdRows.map((row: { employeeId: string }) => row.employeeId);

    const [tenant, workspace, business, user, countryProfile, localeProfile, kpis, revenues, expenses, invoices, leads, customers, employees, departments, inventory, projects, tasks, workflows, goals, memories] = await Promise.all([
      this.prisma.tenant.findFirst({ where: { id: tenantId, deletedAt: null } }),
      workspaceId ? this.prisma.workspace.findFirst({ where: { tenantId, id: workspaceId, deletedAt: null } }) : null,
      businessId ? this.prisma.business.findFirst({ where: { tenantId, id: businessId, deletedAt: null } }) : null,
      userId ? this.prisma.user.findFirst({ where: { tenantId, id: userId, deletedAt: null } }) : null,
      input.countryCode ? this.prisma.countryProfile.findUnique({ where: { countryCode: input.countryCode.toUpperCase() } }) : null,
      input.countryCode ? this.prisma.localeProfile.findFirst({ where: { countryCode: input.countryCode.toUpperCase(), deletedAt: null } }) : null,
      this.prisma.kpiMetric.findMany({ where: { tenantId, deletedAt: null }, include: { values: { orderBy: { observedAt: 'desc' }, take: 5 } }, take: 50 }),
      workspaceId ? this.prisma.financeRevenue.findMany({ where: { tenantId, workspaceId, deletedAt: null }, orderBy: { recognizedAt: 'desc' }, take: 50 }) : [],
      workspaceId ? this.prisma.financeExpense.findMany({ where: { tenantId, workspaceId, deletedAt: null }, orderBy: { incurredAt: 'desc' }, take: 50 }) : [],
      this.prisma.invoice.findMany({ where: { tenantId, workspaceId, deletedAt: null }, orderBy: { createdAt: 'desc' }, take: 50 }),
      workspaceId ? this.prisma.crmLeadRecord.findMany({ where: { tenantId, workspaceId, deletedAt: null }, orderBy: { createdAt: 'desc' }, take: 50 }) : [],
      workspaceId ? this.prisma.crmCustomerRecord.findMany({ where: { tenantId, workspaceId, deletedAt: null }, orderBy: { createdAt: 'desc' }, take: 50 }) : [],
      workspaceEmployeeIds.length ? this.prisma.employeeProfile.findMany({ where: { tenantId, id: { in: workspaceEmployeeIds }, deletedAt: null }, take: 50 }) : [],
      workspaceId ? this.prisma.department.findMany({ where: { tenantId, workspaceId, deletedAt: null }, take: 50 }) : [],
      this.prisma.inventoryItem.findMany({ where: { tenantId, deletedAt: null }, include: { movements: { orderBy: { occurredAt: 'desc' }, take: 5 } }, take: 50 }),
      workspaceId ? this.prisma.project.findMany({ where: { tenantId, workspaceId, deletedAt: null }, orderBy: { createdAt: 'desc' }, take: 50 }) : [],
      workspaceId ? this.prisma.task.findMany({ where: { tenantId, workspaceId, deletedAt: null }, orderBy: { createdAt: 'desc' }, take: 50 }) : [],
      workspaceId ? this.prisma.workflow.findMany({ where: { tenantId, workspaceId, deletedAt: null }, orderBy: { createdAt: 'desc' }, take: 50 }) : [],
      this.prisma.businessMemory.findMany({ where: { tenantId, workspaceId, memoryType: { contains: 'goal' }, deletedAt: null }, orderBy: { createdAt: 'desc' }, take: 25 }),
      this.prisma.aiMemory.findMany({ where: { tenantId, workspaceId, deletedAt: null }, orderBy: [{ importance: 'desc' }, { updatedAt: 'desc' }], take: 40 }),
    ]);

    const financialState = this.financialState(revenues, expenses, invoices);
    const payload = { tenant, workspace, business, user, userRole: input.userRole, country: { countryCode: input.countryCode, countryProfile, localeProfile }, goals, kpis, financialState, crm: { leads, customers }, hr: { employees, departments }, inventory, projects, tasks, workflows, memory: memories };
    const contextHash = createHash('sha256').update(JSON.stringify(payload)).digest('hex');
    const tokenEstimate = Math.ceil(JSON.stringify(payload).length / 4);
    const saved = await this.prisma.aiContext.create({ data: { tenantId, workspaceId, businessId, userId, departmentId: input.departmentId, conversationId: input.conversationId, contextType: 'copilot_brain_v2', contextHash, payload, sources: ['tenant','workspace','business','country','kpi','finance','crm','hr','inventory','projects','workflows','memory'], tokenEstimate } });
    return { contextId: saved.id, contextHash, tokenEstimate, payload };
  }

  private financialState(revenues: any[], expenses: any[], invoices: any[]) {
    const revenue = revenues.reduce((sum, row) => sum + Number(row.amount), 0);
    const expense = expenses.reduce((sum, row) => sum + Number(row.amount), 0);
    const outstanding = invoices.filter((row) => !['PAID','CANCELLED','VOID','REFUNDED'].includes(String(row.status))).reduce((sum, row) => sum + Number(row.amountDue ?? row.total ?? 0), 0);
    const paid = invoices.reduce((sum, row) => sum + Number(row.amountPaid ?? 0), 0);
    return { revenue, expense, profit: revenue - expense, outstandingInvoices: outstanding, paidInvoices: paid, invoiceCount: invoices.length, cashFlowSignal: revenue - expense - outstanding };
  }
}
