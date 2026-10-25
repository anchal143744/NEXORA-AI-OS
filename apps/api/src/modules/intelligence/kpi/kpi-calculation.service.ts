import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/database/prisma.service';
@Injectable()
export class KpiCalculationService {
  constructor(private readonly prisma: PrismaService) {}
  async calculate(tenantId: string, workspaceId: string | undefined, start: Date, end: Date) {
    const scoped = workspaceId ? { tenantId, workspaceId, deletedAt: null } : { tenantId, deletedAt: null } as any;
    const [leads, customers, opportunities, revenueAgg, expenseAgg, employees, attendance, presentAttendance, tasksCompleted, projectsCompleted, workflowRuns, workflowSuccess, workflowsActive, workflowsTotal, cashflow] = await Promise.all([
      this.prisma.crmLeadRecord.count({ where: scoped }), this.prisma.crmCustomerRecord.count({ where: scoped }), this.prisma.crmOpportunity.findMany({ where: { ...scoped, createdAt: { lte: end } } }),
      this.prisma.financeRevenue.aggregate({ where: { ...scoped, recognizedAt: { gte: start, lte: end } }, _sum: { amount: true } }),
      this.prisma.financeExpense.aggregate({ where: { ...scoped, incurredAt: { gte: start, lte: end } }, _sum: { amount: true } }),
      this.prisma.employeeProfile.count({ where: { tenantId, employmentStatus: 'ACTIVE', deletedAt: null } }),
      this.prisma.attendanceRecord.count({ where: { ...scoped, workDate: { gte: start, lte: end } } }),
      this.prisma.attendanceRecord.count({ where: { ...scoped, workDate: { gte: start, lte: end }, status: { in: ['present','PRESENT'] } } }),
      this.prisma.task.count({ where: { ...scoped, status: 'DONE', updatedAt: { gte: start, lte: end } } }),
      this.prisma.project.count({ where: { ...scoped, status: 'COMPLETED', updatedAt: { gte: start, lte: end } } }),
      this.prisma.workflowExecution.count({ where: { tenantId, workspaceId, createdAt: { gte: start, lte: end } } }),
      this.prisma.workflowExecution.count({ where: { tenantId, workspaceId, status: 'SUCCEEDED', createdAt: { gte: start, lte: end } } }),
      this.prisma.workflow.count({ where: { tenantId, workspaceId, status: 'ACTIVE', deletedAt: null } }),
      this.prisma.workflow.count({ where: { tenantId, workspaceId, deletedAt: null } }),
      this.prisma.cashflowSnapshot.findFirst({ where: { tenantId, workspaceId, periodStart: { gte: start }, periodEnd: { lte: end } }, orderBy: { createdAt: 'desc' } }),
    ]);
    const revenue = Number((revenueAgg._sum as any).amount ?? 0); const expenses = Number((expenseAgg._sum as any).amount ?? 0); const won = opportunities.filter((o: any) => ['won','closed_won','WON'].includes(String(o.stage))).length; const pipeline = opportunities.filter((o: any) => !o.closedAt).reduce((s: number, o: any) => s + Number(o.amount ?? 0), 0);
    return { 'crm.lead_count': leads, 'crm.conversion_rate': rate(won, Math.max(leads, 1)), 'crm.pipeline_value': pipeline, 'crm.customer_acquisition_cost': div(expenses, Math.max(customers, 1)), 'crm.customer_lifetime_value': div(revenue, Math.max(customers, 1)), 'finance.revenue': revenue, 'finance.profit': revenue - expenses, 'finance.expenses': expenses, 'finance.cash_flow': cashflow ? Number((cashflow as any).netCashflow) : revenue - expenses, 'finance.burn_rate': expenses, 'finance.runway': expenses > 0 ? Number(((revenue - expenses) / expenses).toFixed(2)) : 999, 'hr.employee_count': employees, 'hr.attendance_rate': rate(presentAttendance, Math.max(attendance, 1)), 'hr.productivity_score': div(tasksCompleted, Math.max(employees, 1)), 'hr.retention_rate': employees > 0 ? 100 : 0, 'operations.tasks_completed': tasksCompleted, 'operations.projects_completed': projectsCompleted, 'operations.workflow_success_rate': rate(workflowSuccess, Math.max(workflowRuns, 1)), 'operations.automation_coverage': rate(workflowsActive, Math.max(workflowsTotal, 1)) };
  }
}
function rate(a: number, b: number) { return Number(((a / b) * 100).toFixed(2)); }
function div(a: number, b: number) { return Number((a / b).toFixed(2)); }
