import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/database/prisma.service';
import { BusinessAuditService } from '../../audit/business-audit.service';
import { TenantContextService } from '../../tenants/tenant-context.service';
import { CreateInvoiceDto, CreateInvoiceSeriesDto, CreateInvoiceTemplateDto, UpdateInvoiceStatusDto } from '../dto/global-finance.dto';
import { TaxEngineService } from '../tax/tax-engine.service';
import { RetailAccessService } from '../../retail/retail-access.service';
import { audit as recordRetailAudit, lock } from '../../retail/retail-transaction';

@Injectable()
export class InvoiceIntelligenceService {
  constructor(private readonly prisma: PrismaService, private readonly context: TenantContextService, private readonly audit: BusinessAuditService, private readonly tax: TaxEngineService, private readonly retailAccess: RetailAccessService) {}

  private tenantId() { return this.context.currentTenantId(); }
  private userId() { return this.context.context()?.userId; }
  private workspaceId(input?: string) { return input ?? this.context.currentWorkspaceId(); }

  async createDraft(dto: CreateInvoiceDto) {
    const scope = await this.retailAccess.require('finance', 'create');
    if (dto.workspaceId && dto.workspaceId !== scope.workspaceId) throw new BadRequestException('Workspace override is not permitted');
    if (!dto.items?.length) throw new BadRequestException('Invoice requires at least one item');
    const tenantId = this.tenantId();
    const workspaceId = this.workspaceId(dto.workspaceId);
    const invoiceNumber = dto.invoiceNumber ?? await this.generateInvoiceNumber({ workspaceId, countryCode: dto.countryCode, seriesKey: dto.seriesKey });
    const lineResults = [];
    let subtotal = 0;
    let taxTotal = 0;
    let total = 0;

    for (let index = 0; index < dto.items.length; index += 1) {
      const item = dto.items[index];
      const quantity = item.quantity ?? 1;
      const discount = item.discount ?? 0;
      const lineSubtotal = Math.max(quantity * item.unitPrice - discount, 0);
      const taxResult = await this.tax.calculate({ countryCode: dto.countryCode, amount: lineSubtotal, currency: dto.currency, taxCategoryCode: item.taxCategoryCode, inclusive: dto.taxMode === 'inclusive' });
      subtotal += lineSubtotal;
      taxTotal += taxResult.taxTotal;
      total += taxResult.total;
      lineResults.push({ index, item, quantity, discount, lineSubtotal, taxResult, lineTotal: taxResult.total });
    }

    const invoice = await this.prisma.invoice.create({ data: { tenantId, workspaceId, billingAccountId: dto.billingAccountId, subscriptionId: dto.subscriptionId, customerId: dto.customerId, supplierId: dto.supplierId, templateId: dto.templateId, invoiceNumber, version: 1, status: 'DRAFT', invoiceType: 'standard', countryCode: dto.countryCode.toUpperCase(), currency: dto.currency, baseCurrency: dto.baseCurrency, exchangeRate: dto.exchangeRate, taxMode: dto.taxMode ?? 'exclusive', subtotal, discount: lineResults.reduce((sum, row) => sum + row.discount, 0), tax: taxTotal, total, amountDue: total, dueAt: dto.dueAt ? new Date(dto.dueAt) : undefined, paymentTerms: dto.paymentTerms, lateFeeRules: dto.lateFeeRules ?? {}, taxBreakdown: lineResults.flatMap((row) => row.taxResult.breakdown), billingAddress: dto.billingAddress ?? {}, shippingAddress: dto.shippingAddress ?? {}, notes: dto.notes, metadata: {} } });

    for (const row of lineResults) {
      const createdItem = await this.prisma.invoiceItem.create({ data: { tenantId, invoiceId: invoice.id, lineNumber: row.index + 1, itemType: row.item.itemType ?? 'service', description: row.item.description, quantity: row.quantity, unitPrice: row.item.unitPrice, subtotal: row.lineSubtotal, discount: row.discount, taxAmount: row.taxResult.taxTotal, total: row.lineTotal, currency: dto.currency, taxCategoryCode: row.item.taxCategoryCode, metadata: row.item.metadata ?? {} } });
      for (const taxRow of row.taxResult.breakdown) {
        await this.prisma.invoiceTax.create({ data: { tenantId, invoiceId: invoice.id, invoiceItemId: createdItem.id, taxRuleId: taxRow.taxRuleId, taxType: taxRow.taxType, taxName: taxRow.taxName, rate: taxRow.rate, taxableAmount: taxRow.taxableAmount, taxAmount: taxRow.taxAmount, inclusive: taxRow.inclusive, exemptionCode: taxRow.exemptionCode, metadata: {} } });
      }
    }

    await this.recordInvoiceAudit(invoice.id, 'invoice.draft_created', undefined, 'DRAFT', 1, { invoiceNumber, total, currency: dto.currency });
    return this.getInvoice(invoice.id);
  }

  async listInvoices(status?: string) {
    await this.retailAccess.require('finance', 'read');
    const where: any = { tenantId: this.tenantId(), deletedAt: null };
    const workspaceId = this.workspaceId();
    if (workspaceId) where.workspaceId = workspaceId;
    if (status) where.status = status;
    return this.prisma.invoice.findMany({ where, include: { items: true, taxes: true, payments: true }, orderBy: { createdAt: 'desc' }, take: 100 });
  }

  async getInvoice(id: string) {
    await this.retailAccess.require('finance', 'read');
    const invoice = await this.prisma.invoice.findFirst({ where: { tenantId: this.tenantId(), workspaceId: this.context.currentWorkspaceId(), id, deletedAt: null }, include: { items: true, taxes: true, payments: true, audits: true } });
    if (!invoice) throw new NotFoundException('Invoice not found');
    return invoice;
  }

  issueInvoice(id: string) { return this.transitionInvoice(id, { status: 'ISSUED', metadata: { issuedAt: new Date().toISOString() } }); }
  cancelInvoice(id: string) { return this.transitionInvoice(id, { status: 'CANCELLED', metadata: { cancelledAt: new Date().toISOString() } }); }

  async transitionInvoice(id: string, dto: UpdateInvoiceStatusDto) {
    await this.prisma.transaction(async tx => {
      const scope = await this.retailAccess.require('finance', 'update', tx);
      await lock(tx, `invoice:${id}`);
      const invoice = await tx.invoice.findFirst({ where: { id, tenantId: scope.tenantId, workspaceId: scope.workspaceId, deletedAt: null } });
      if (!invoice) throw new NotFoundException('Invoice not found');
      if (await tx.retailSale.findFirst({ where: { invoiceId: id } })) throw new BadRequestException('Retail invoices are controlled by the sale lifecycle');
      if (!['DRAFT', 'SENT', 'ISSUED', 'CANCELLED'].includes(dto.status) || await tx.invoicePayment.count({ where: { invoiceId: id } })) throw new BadRequestException('Payment state must be reconciled through the payment ledger');
      if (['VOID', 'CANCELLED', 'REFUNDED'].includes(invoice.status) || dto.status === 'DRAFT' && invoice.status !== 'DRAFT') throw new BadRequestException('Finalized invoice state cannot be reversed');
      const result = await tx.invoice.update({ where: { id }, data: { status: dto.status as 'DRAFT' | 'SENT' | 'ISSUED' | 'CANCELLED', version: { increment: 1 }, issuedAt: ['ISSUED', 'SENT'].includes(dto.status) ? invoice.issuedAt ?? new Date() : undefined, cancelledAt: dto.status === 'CANCELLED' ? new Date() : undefined, amountDue: dto.status === 'CANCELLED' ? 0 : invoice.total } });
      await recordRetailAudit(tx, scope, 'finance.invoice', id, { status: result.status, version: result.version });
    });
    return this.getInvoice(id);
  }

  async createTemplate(dto: CreateInvoiceTemplateDto) {
    return this.prisma.invoiceTemplate.create({ data: { tenantId: this.tenantId(), workspaceId: dto.workspaceId ?? this.workspaceId(), countryCode: dto.countryCode?.toUpperCase(), templateKey: dto.templateKey, name: dto.name, invoiceFormat: dto.invoiceFormat ?? {}, taxFormat: dto.taxFormat ?? {}, registrationFormat: dto.registrationFormat ?? {}, paymentInstructions: dto.paymentInstructions ?? {}, version: dto.version ?? 1 } });
  }

  listTemplates(countryCode?: string) {
    const where: any = { tenantId: this.tenantId(), deletedAt: null };
    if (countryCode) where.countryCode = countryCode.toUpperCase();
    return this.prisma.invoiceTemplate.findMany({ where, orderBy: [{ countryCode: 'asc' }, { templateKey: 'asc' }, { version: 'desc' }] });
  }

  async createSeries(dto: CreateInvoiceSeriesDto) {
    return this.prisma.invoiceSeries.create({ data: { tenantId: this.tenantId(), workspaceId: dto.workspaceId ?? this.workspaceId(), countryCode: dto.countryCode?.toUpperCase(), seriesKey: dto.seriesKey, prefix: dto.prefix, suffix: dto.suffix, nextNumber: dto.nextNumber ?? 1, padding: dto.padding ?? 6, resetPolicy: dto.resetPolicy ?? 'yearly', metadata: dto.metadata ?? {} } });
  }

  listSeries(countryCode?: string) {
    const where: any = { tenantId: this.tenantId(), deletedAt: null };
    if (countryCode) where.countryCode = countryCode.toUpperCase();
    return this.prisma.invoiceSeries.findMany({ where, orderBy: [{ countryCode: 'asc' }, { seriesKey: 'asc' }] });
  }

  private async generateInvoiceNumber(input: { workspaceId?: string; countryCode?: string; seriesKey?: string }) {
    const tenantId = this.tenantId();
    const year = new Date().getFullYear();
    const seriesKey = input.seriesKey ?? `${input.countryCode ?? 'GLOBAL'}-${year}`;
    let series = await this.prisma.invoiceSeries.findFirst({ where: { tenantId, workspaceId: input.workspaceId, countryCode: input.countryCode?.toUpperCase(), seriesKey, deletedAt: null } });
    if (!series) {
      series = await this.prisma.invoiceSeries.create({ data: { tenantId, workspaceId: input.workspaceId, countryCode: input.countryCode?.toUpperCase(), seriesKey, prefix: `${input.countryCode ?? 'NX'}-${year}-`, nextNumber: 1, padding: 6, resetPolicy: 'yearly' } });
    }
    const number = `${series.prefix}${String(series.nextNumber).padStart(series.padding, '0')}${series.suffix ?? ''}`;
    await this.prisma.invoiceSeries.update({ where: { id: series.id }, data: { nextNumber: Number(series.nextNumber) + 1, lastIssuedAt: new Date() } });
    return number;
  }

  async recordInvoiceAudit(invoiceId: string, action: string, fromStatus?: string, toStatus?: string, version?: number, changes: Record<string, unknown> = {}) {
    const tenantId = this.tenantId();
    await this.prisma.invoiceAudit.create({ data: { tenantId, invoiceId, actorUserId: this.userId(), action, fromStatus, toStatus, version, changes } });
    await this.audit.record({ tenantId, userId: this.userId(), action: 'UPDATE', resourceType: 'finance.invoice', resourceId: invoiceId, message: action });
  }
}
