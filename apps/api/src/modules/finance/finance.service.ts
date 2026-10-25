import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Invoice, Prisma } from '@prisma/client';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { BusinessAuditService } from '../audit/business-audit.service';
import { TenantContextService } from '../tenants/tenant-context.service';
import { CreateExpenseDto, CreateFinanceInvoiceDto, UpdateExpenseDto, UpdateInvoiceDto } from './dto/finance.dto';
import { PaymentsService } from '../retail/payments.service';
import { RetailAccessService } from '../retail/retail-access.service';
import { RetailReportService } from '../retail/retail-report.service';
import { audit, currency, lock } from '../retail/retail-transaction';
import { decimal, money } from '../retail/money';

@Injectable()
export class FinanceService {
  constructor(private readonly prisma: PrismaService, private readonly context: TenantContextService, private readonly businessAudit: BusinessAuditService, private readonly payments: PaymentsService, private readonly access: RetailAccessService, private readonly reports: RetailReportService) {}
  async workspace() {
    const [invoices, expenses, summary] = await Promise.all([this.listInvoices(), this.listExpenses(), this.revenueSummary()]);
    const format = (value: string) => `${summary.currency} ${value}`;
    return { metrics: [
      { id: 'revenue-overview', label: 'Recognized revenue', value: format(summary.revenue), detail: 'Completed sales less returns plus recorded recognized revenue', trend: 'Persisted transactions', tone: 'healthy' },
      { id: 'expenses', label: 'Operating expenses', value: format(summary.expense), detail: 'Approved and reimbursed expenses', trend: 'Persisted transactions', tone: 'watch' },
      { id: 'net', label: 'Net profit / loss', value: format(summary.net), detail: 'Recognized revenue less COGS and operating expenses', trend: decimal(summary.net).gte(0) ? 'positive' : 'review', tone: decimal(summary.net).gte(0) ? 'healthy' : 'risk' },
    ], billingPlans: [], revenue: [], invoices, payments: [], budgets: [], expenses, forecasts: [], cashFlow: [], analytics: [], executiveSignals: [], insights: [] };
  }
  async runFinanceCommand(dto: { command: string }) {
    if (!dto.command?.trim()) throw new BadRequestException('Command is required');
    const s = await this.revenueSummary();
    return { id: 'finance-command-' + Date.now(), command: dto.command, response: `Recorded ${s.currency} summary: recognized revenue ${s.revenue}, operating expenses ${s.expense}, COGS ${s.costOfGoodsSold}, net profit/loss ${s.net}. Customer cash received ${s.cashReceived}, refunded ${s.cashRefunded}.`, recommendedActions: decimal(s.net).lt(0) ? ['Review costs and expenses'] : ['Keep source transactions current'] };
  }
  private invoiceView(row: Invoice) {
    // Numeric conversion is presentation-only; all accounting commands/reports use decimals.
    return { id: row.id, customerName: 'Customer not linked', invoiceNumber: row.invoiceNumber, amount: Number(row.total), currency: row.currency, amountPaid: row.amountPaid.toString(), amountDue: row.amountDue.toString(), dueDate: row.dueAt?.toISOString() ?? '', status: row.status.toLowerCase(), owner: 'Unassigned', pdfStatus: 'not_generated' };
  }
  async listInvoices() {
    const scope = await this.access.require('finance', 'read');
    const rows = await this.prisma.database.invoice.findMany({ where: { tenantId: scope.tenantId, workspaceId: scope.workspaceId, deletedAt: null }, orderBy: { createdAt: 'desc' } });
    return rows.map(row => this.invoiceView(row));
  }
  async createInvoice(dto: CreateFinanceInvoiceDto) {
    return this.prisma.transaction(async tx => {
      const scope = await this.access.require('finance', 'create', tx);
      const account = await tx.billingAccount.findFirst({ where: { id: dto.billingAccountId, tenantId: scope.tenantId, organizationId: scope.organizationId, deletedAt: null } });
      if (!account) throw new NotFoundException('Billing account not found');
      const config = await currency(tx, dto.currency);
      const subtotal = money(dto.subtotal, config.precision), tax = money(dto.tax, config.precision), amount = money(dto.total, config.precision);
      if (!subtotal.plus(tax).eq(amount) || !dto.invoiceNumber.trim()) throw new BadRequestException('Invoice total must equal subtotal plus tax');
      const row = await tx.invoice.create({ data: { tenantId: scope.tenantId, workspaceId: scope.workspaceId, billingAccountId: account.id, invoiceNumber: dto.invoiceNumber, currency: dto.currency, subtotal, tax, total: amount, amountDue: amount, dueAt: dto.dueAt ? new Date(dto.dueAt) : undefined } });
      await audit(tx, scope, 'finance.invoice', row.id, { total: amount.toString(), currency: row.currency });
      return row;
    });
  }
  async updateInvoice(id: string, dto: UpdateInvoiceDto) {
    return this.prisma.transaction(async tx => {
      const scope = await this.access.require('finance', 'update', tx);
      await lock(tx, `invoice:${id}`);
      const row = await this.payments.ownedInvoice(tx, scope, id);
      if (dto.paidAt || dto.status && !['draft', 'sent', 'issued', 'cancelled'].includes(dto.status.toLowerCase())) throw new BadRequestException('Payment states are derived from the payment ledger');
      if (await tx.retailSale.findFirst({ where: { invoiceId: id } })) throw new BadRequestException('Retail invoices are controlled by the sale lifecycle');
      if (await tx.invoicePayment.count({ where: { invoiceId: id, tenantId: scope.tenantId, deletedAt: null } })) throw new BadRequestException('An invoice with payment history cannot be edited directly');
      if (['CANCELLED', 'VOID', 'REFUNDED'].includes(row.status)) throw new BadRequestException('Finalized invoice cannot be edited');
      const config = await currency(tx, row.currency);
      const amount = dto.total === undefined ? decimal(row.total) : money(dto.total, config.precision);
      const status = dto.status?.toUpperCase() as 'DRAFT' | 'SENT' | 'ISSUED' | 'CANCELLED' | undefined;
      if (status === 'DRAFT' && row.status !== 'DRAFT') throw new BadRequestException('Issued invoice cannot return to draft');
      const subtotal = amount.minus(row.tax).plus(row.discount);
      if (subtotal.lt(0)) throw new BadRequestException('Total cannot be lower than tax');
      const result = await tx.invoice.update({ where: { id }, data: { status, total: amount, subtotal, amountDue: status === 'CANCELLED' ? 0 : amount, issuedAt: status === 'ISSUED' || status === 'SENT' ? row.issuedAt ?? new Date() : undefined, cancelledAt: status === 'CANCELLED' ? new Date() : undefined } });
      await audit(tx, scope, 'finance.invoice', id, { status: result.status, total: amount.toString() });
      return result;
    });
  }
  async invoiceStatus(id: string) { const scope = await this.access.require('finance', 'read'); return this.payments.ownedInvoice(this.prisma.database, scope, id); }
  async markInvoicePaid(id: string, idempotencyKey: string) { return this.invoiceView(await this.payments.settle(id, idempotencyKey)); }
  async createExpense(dto: CreateExpenseDto) {
    return this.prisma.transaction(async tx => {
      const scope = await this.access.require('finance', 'create', tx);
      const config = await currency(tx, dto.currency);
      const amount = money(dto.amount, config.precision);
      const row = await tx.financeExpense.create({ data: { tenantId: scope.tenantId, workspaceId: scope.workspaceId, ...dto, amount, incurredAt: new Date(dto.incurredAt) } });
      await audit(tx, scope, 'finance.expense', row.id, { amount: amount.toString(), currency: row.currency });
      return row;
    });
  }
  async listExpenses() {
    const scope = await this.access.require('finance', 'read');
    const rows = await this.prisma.database.financeExpense.findMany({ where: { tenantId: scope.tenantId, workspaceId: scope.workspaceId, deletedAt: null }, orderBy: { createdAt: 'desc' } });
    return rows.map(row => ({ id: row.id, employeeName: row.vendor ?? 'Payee unavailable', category: row.category, amount: Number(row.amount), currency: row.currency, submittedAt: row.incurredAt.toISOString(), status: row.status, reimbursementDue: 'Not scheduled' }));
  }
  async updateExpense(id: string, dto: UpdateExpenseDto) {
    return this.prisma.transaction(async tx => {
      const scope = await this.access.require('finance', dto.status === 'approved' || dto.status === 'reimbursed' ? 'approve' : 'update', tx);
      const row = await tx.financeExpense.findFirst({ where: { id, tenantId: scope.tenantId, workspaceId: scope.workspaceId, deletedAt: null } });
      if (!row) throw new NotFoundException('Expense not found');
      if (dto.status && !['pending', 'submitted', 'approved', 'reimbursed', 'rejected'].includes(dto.status)) throw new BadRequestException('Invalid expense status');
      const config = await currency(tx, row.currency);
      const result = await tx.financeExpense.update({ where: { id }, data: { ...dto, amount: dto.amount === undefined ? undefined : money(dto.amount, config.precision) } });
      await audit(tx, scope, 'finance.expense', id, { status: result.status, amount: result.amount.toString() });
      return result;
    });
  }
  async approveExpense(id: string) { return this.updateExpense(id, { status: 'approved' }); }
  async revenueSummary(code?: string, from = '1970-01-01T00:00:00.000Z', to = new Date().toISOString()) {
    const scope = await this.access.require('finance', 'read');
    const workspace = await this.prisma.database.workspace.findUniqueOrThrow({ where: { id: scope.workspaceId } });
    const configured = (workspace.metadata as Prisma.JsonObject).currency;
    if (!code && typeof configured !== 'string') throw new BadRequestException('Configure workspace currency or request an explicit currency');
    const result = await this.reports.summary(code ?? String(configured), from, to);
    return { ...result, revenue: result.recognizedRevenue, expense: result.operatingExpenses, net: result.netProfit };
  }
}