import { Prisma } from '@prisma/client';
import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { RetailAccessService } from './retail-access.service';
import { currency } from './retail-transaction';
import { decimal, round, total } from './money';

@Injectable()
export class RetailReportService {
  constructor(private readonly prisma: PrismaService, private readonly access: RetailAccessService) {}
  async summary(code: string, start: string, end: string) {
    const from = new Date(start), to = new Date(end);
    if (!Number.isFinite(from.getTime()) || !Number.isFinite(to.getTime()) || from >= to) throw new BadRequestException('Provide a valid reporting period [from, to)');
    return this.prisma.transaction(tx => this.inTransaction(tx, code, start, end));
  }

  async inTransaction(tx: Prisma.TransactionClient, code: string, start: string, end: string) {
    const from = new Date(start), to = new Date(end);
    if (!Number.isFinite(from.getTime()) || !Number.isFinite(to.getTime()) || from >= to) throw new BadRequestException('Provide a valid reporting period [from, to)');
      const scope = await this.access.require('finance', 'read', tx);
      const config = await currency(tx, code);
      const where = { tenantId: scope.tenantId, workspaceId: scope.workspaceId, currency: code };
      const period = { gte: from, lt: to };
      const sales = await tx.retailSale.findMany({ where: { ...where, organizationId: scope.organizationId, completedAt: period } });
      const returns = await tx.retailReturn.findMany({ where: { tenantId: scope.tenantId, createdAt: period, sale: { workspaceId: scope.workspaceId, organizationId: scope.organizationId, currency: code } } });
      const revenues = await tx.financeRevenue.findMany({ where: { ...where, deletedAt: null, recognizedAt: period } });
      const expenses = await tx.financeExpense.findMany({ where: { ...where, deletedAt: null, incurredAt: period, status: { in: ['approved', 'reimbursed'] } } });
      const payments = await tx.invoicePayment.findMany({ where: { tenantId: scope.tenantId, currency: code, deletedAt: null, status: 'succeeded', reconciliationStatus: 'reconciled', paidAt: period, invoice: { tenantId: scope.tenantId, workspaceId: scope.workspaceId, deletedAt: null } } });
      const salesAmount = total(sales.map(s => s.total)), returnedRevenue = total(returns.map(r => r.amount));
      const recognizedRevenue = salesAmount.minus(returnedRevenue).plus(total(revenues.map(r => r.amount)));
      const costOfGoodsSold = total(sales.map(s => s.costOfGoods)).minus(total(returns.map(r => r.costOfGoods)));
      const operatingExpenses = total(expenses.map(e => e.amount));
      const grossProfit = recognizedRevenue.minus(costOfGoodsSold), netProfit = grossProfit.minus(operatingExpenses);
      const cashReceived = total(payments.filter(p => p.entryType === 'PAYMENT').map(p => p.amount));
      const cashRefunded = total(payments.filter(p => ['REFUND', 'REVERSAL'].includes(p.entryType)).map(p => p.amount));
      const format = (value: ReturnType<typeof decimal>) => round(value, config.precision).toFixed(config.precision);
      const daily = new Map<string, ReturnType<typeof decimal>>();
      const addDay = (date: Date, amount: ReturnType<typeof decimal>) => { const day = date.toISOString().slice(0, 10); daily.set(day, (daily.get(day) ?? decimal(0)).plus(amount)); };
      for (const sale of sales) if (sale.completedAt) addDay(sale.completedAt, decimal(sale.total));
      for (const entry of returns) addDay(entry.createdAt, decimal(entry.amount).negated());
      for (const revenue of revenues) if (revenue.recognizedAt) addDay(revenue.recognizedAt, decimal(revenue.amount));
      const metrics = new Map<string, { revenue: ReturnType<typeof decimal>; cost: ReturnType<typeof decimal>; expense: ReturnType<typeof decimal> }>();
      const addMetric = (date: Date, revenue: ReturnType<typeof decimal>, cost = decimal(0), expense = decimal(0)) => { const day = date.toISOString().slice(0, 10); const row = metrics.get(day) ?? { revenue: decimal(0), cost: decimal(0), expense: decimal(0) }; metrics.set(day, { revenue: row.revenue.plus(revenue), cost: row.cost.plus(cost), expense: row.expense.plus(expense) }); };
      for (const sale of sales) if (sale.completedAt) addMetric(sale.completedAt, decimal(sale.total), decimal(sale.costOfGoods));
      for (const entry of returns) addMetric(entry.createdAt, decimal(entry.amount).negated(), decimal(entry.costOfGoods).negated());
      for (const revenue of revenues) if (revenue.recognizedAt) addMetric(revenue.recognizedAt, decimal(revenue.amount));
      for (const expense of expenses) addMetric(expense.incurredAt, decimal(0), decimal(0), decimal(expense.amount));
      const dailyMetrics = [...metrics].sort(([a], [b]) => a.localeCompare(b)).map(([date, row]) => ({ date, recognizedRevenue: format(row.revenue), costOfGoodsSold: format(row.cost), operatingExpenses: format(row.expense), grossProfit: format(row.revenue.minus(row.cost)), netProfit: format(row.revenue.minus(row.cost).minus(row.expense)) }));
      return { currency: code, precision: config.precision, from: from.toISOString(), to: to.toISOString(), sales: format(salesAmount), returns: format(returnedRevenue), recognizedRevenue: format(recognizedRevenue), costOfGoodsSold: format(costOfGoodsSold), operatingExpenses: format(operatingExpenses), grossProfit: format(grossProfit), netProfit: format(netProfit), cashReceived: format(cashReceived), cashRefunded: format(cashRefunded), netCustomerCash: format(cashReceived.minus(cashRefunded)), dailyMetrics, dailyRevenue: [...daily].sort(([a], [b]) => a.localeCompare(b)).map(([date, value]) => ({ date, amount: format(value) })), assumptions: 'Revenue at retail completion; returns recognized on return date; daily chart grouped by UTC date; moving weighted-average COGS; approved/reimbursed expenses on incurred date; manual payments/refunds are recorded cash, not provider-confirmed transfers; no FX, tax, overhead allocation or supplier cash ledger. FinanceRevenue rows must not duplicate retail sales; other revenue COGS is not available.' };
  }
}
