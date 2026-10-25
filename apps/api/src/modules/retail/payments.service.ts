import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Invoice, InvoiceStatus, Prisma } from '@prisma/client';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { RetailAccessService, RetailScope } from './retail-access.service';
import { audit, currency, key, lock, matchRequest, reason, requestHash } from './retail-transaction';
import { decimal, money, reconcile, total } from './money';

export type PaymentInput = { idempotencyKey: string; amount: string; currency: string; paymentMethod: string; reference?: string };
export type RefundInput = { idempotencyKey: string; paymentId: string; amount: string; reason: string; entryType?: 'REFUND' | 'REVERSAL' };
@Injectable()
export class PaymentsService {
  constructor(private readonly prisma: PrismaService, private readonly access: RetailAccessService) {}

  async ownedInvoice(tx: Prisma.TransactionClient, scope: RetailScope, id: string) {
    const invoice = await tx.invoice.findFirst({ where: { id, tenantId: scope.tenantId, workspaceId: scope.workspaceId, deletedAt: null } });
    if (!invoice) throw new NotFoundException('Invoice not found');
    if (invoice.billingAccountId && !await tx.billingAccount.findFirst({ where: { id: invoice.billingAccountId, tenantId: scope.tenantId, organizationId: scope.organizationId, deletedAt: null } })) throw new NotFoundException('Invoice billing ownership is invalid');
    return invoice;
  }
  async record(invoiceId: string, input: PaymentInput) {
    key(input.idempotencyKey);
    if (!input.paymentMethod?.trim() || input.paymentMethod.length > 80 || (input.reference?.length ?? 0) > 200) throw new BadRequestException('Valid payment method and reference are required');
    return this.prisma.transaction(async tx => {
      const scope = await this.access.require('finance', 'update', tx);
      await lock(tx, `payment:${scope.tenantId}:${input.idempotencyKey}`);
      await lock(tx, `invoice:${invoiceId}`);
      const invoice = await this.ownedInvoice(tx, scope, invoiceId);
      const config = await currency(tx, invoice.currency);
      const amount = money(input.amount, config.precision, true);
      if (input.currency !== invoice.currency) throw new BadRequestException('Payment currency must match invoice');
      const hash = requestHash([invoiceId, amount.toString(), invoice.currency, input.paymentMethod, input.reference ?? null]);
      const previous = await this.existing(tx, scope, input.idempotencyKey, hash);
      if (previous) return { payment: previous, invoice: await this.ownedInvoice(tx, scope, invoiceId) };
      this.payable(invoice);
      const reconciled = await this.reconcileInTx(tx, scope, invoiceId);
      if (amount.gt(reconciled.amountDue)) throw new BadRequestException('Payment exceeds outstanding balance');
      const payment = await tx.invoicePayment.create({ data: { tenantId: scope.tenantId, invoiceId, idempotencyKey: input.idempotencyKey, entryType: 'PAYMENT', provider: 'manual', paymentMethod: input.paymentMethod, transactionReference: input.reference, amount, currency: invoice.currency, status: 'succeeded', reconciliationStatus: 'reconciled', paidAt: new Date(), reconciledAt: new Date(), metadata: { organizationId: scope.organizationId, actorUserId: scope.userId, requestHash: hash } } });
      await audit(tx, scope, 'finance.payment', payment.id, { invoiceId, amount: amount.toString(), currency: invoice.currency });
      return { payment, invoice: await this.reconcileInTx(tx, scope, invoiceId) };
    });
  }

  async settle(invoiceId: string, idempotencyKey: string) {
    key(idempotencyKey);
    return this.prisma.transaction(async tx => {
      const scope = await this.access.require('finance', 'update', tx);
      await lock(tx, `payment:${scope.tenantId}:${idempotencyKey}`);
      await lock(tx, `invoice:${invoiceId}`);
      const invoice = await this.ownedInvoice(tx, scope, invoiceId);
      const hash = requestHash([invoiceId, 'settle-outstanding']);
      if (await this.existing(tx, scope, idempotencyKey, hash)) return this.ownedInvoice(tx, scope, invoiceId);
      this.payable(invoice);
      await currency(tx, invoice.currency);
      const reconciled = await this.reconcileInTx(tx, scope, invoiceId);
      if (reconciled.amountDue.isZero()) return reconciled;
      const payment = await tx.invoicePayment.create({ data: { tenantId: scope.tenantId, invoiceId, idempotencyKey, entryType: 'PAYMENT', provider: 'manual', paymentMethod: 'manual', amount: reconciled.amountDue, currency: invoice.currency, status: 'succeeded', reconciliationStatus: 'reconciled', paidAt: new Date(), reconciledAt: new Date(), metadata: { requestHash: hash, organizationId: scope.organizationId, actorUserId: scope.userId } } });
      await audit(tx, scope, 'finance.payment', payment.id, { invoiceId, amount: payment.amount.toString(), currency: invoice.currency });
      return this.reconcileInTx(tx, scope, invoiceId);
    });
  }

  async refund(invoiceId: string, input: RefundInput) {
    return this.prisma.transaction(async tx => {
      const scope = await this.access.require('finance', 'approve', tx);
      await lock(tx, `invoice:${invoiceId}`);
      return this.refundInTx(tx, scope, invoiceId, input);
    });
  }

  async refundInTx(tx: Prisma.TransactionClient, scope: RetailScope, invoiceId: string, input: RefundInput, reconcileAfter = true) {
    key(input.idempotencyKey);
    const why = reason(input.reason);
    await lock(tx, `payment:${scope.tenantId}:${input.idempotencyKey}`);
    const invoice = await this.ownedInvoice(tx, scope, invoiceId);
    const config = await currency(tx, invoice.currency);
    const amount = money(input.amount, config.precision, true);
    const entryType = input.entryType ?? 'REFUND';
    if (!['REFUND', 'REVERSAL'].includes(entryType)) throw new BadRequestException('Unsupported payment correction');
    const hash = requestHash([invoiceId, input.paymentId, amount.toString(), entryType, why]);
    const previous = await this.existing(tx, scope, input.idempotencyKey, hash);
    if (previous) return { payment: previous, invoice };
    const original = await tx.invoicePayment.findFirst({ where: { id: input.paymentId, invoiceId, tenantId: scope.tenantId, entryType: 'PAYMENT', status: 'succeeded', reconciliationStatus: 'reconciled', deletedAt: null } });
    if (!original) throw new NotFoundException('Reconciled payment not found');
    const corrections = await tx.invoicePayment.findMany({ where: { tenantId: scope.tenantId, invoiceId, parentPaymentId: original.id, entryType: { in: ['REFUND', 'REVERSAL'] }, status: 'succeeded', deletedAt: null } });
    const remaining = decimal(original.amount).minus(total(corrections.map(p => p.amount)));
    if (amount.gt(remaining) || (entryType === 'REVERSAL' && !amount.eq(remaining))) throw new BadRequestException('Refund exceeds payment balance or reversal is not for the remaining payment');
    const payment = await tx.invoicePayment.create({ data: { tenantId: scope.tenantId, invoiceId, idempotencyKey: input.idempotencyKey, entryType, parentPaymentId: original.id, provider: 'manual', paymentMethod: original.paymentMethod, amount, currency: invoice.currency, status: 'succeeded', reconciliationStatus: 'reconciled', paidAt: new Date(), reconciledAt: new Date(), metadata: { requestHash: hash, reason: why, organizationId: scope.organizationId, actorUserId: scope.userId } } });
    await tx.invoicePayment.update({ where: { id: original.id }, data: { refundStatus: amount.eq(remaining) ? 'refunded' : 'partially_refunded' } });
    await audit(tx, scope, 'finance.refund', payment.id, { invoiceId, paymentId: original.id, amount: amount.toString(), reason: why, entryType });
    return { payment, invoice: reconcileAfter ? await this.reconcileInTx(tx, scope, invoiceId) : invoice };
  }

  async reconcileInTx(tx: Prisma.TransactionClient, scope: RetailScope, invoiceId: string) {
    const invoice = await this.ownedInvoice(tx, scope, invoiceId);
    const config = await currency(tx, invoice.currency);
    money(invoice.total, config.precision);
    const legacy = await tx.invoicePayment.findFirst({ where: { tenantId: scope.tenantId, invoiceId, status: { in: ['paid', 'succeeded', 'completed', 'settled'] }, reconciliationStatus: { not: 'reconciled' }, deletedAt: null } });
    if (legacy) throw new ConflictException('Existing payments require verified opening reconciliation before further posting');
    const rows = await tx.invoicePayment.findMany({ where: { tenantId: scope.tenantId, invoiceId, status: 'succeeded', reconciliationStatus: 'reconciled', deletedAt: null } });
    if (rows.some(p => p.currency !== invoice.currency || !['PAYMENT', 'REFUND', 'REVERSAL'].includes(p.entryType))) throw new BadRequestException('Payment ledger requires currency/type reconciliation');
    const paid = total(rows.map(p => p.entryType === 'PAYMENT' ? decimal(p.amount) : decimal(p.amount).negated()));
    const next = reconcile(decimal(invoice.total), paid, invoice.dueAt, new Date());
    return tx.invoice.update({ where: { id: invoice.id }, data: { amountPaid: next.amountPaid, amountDue: next.amountDue, status: ['VOID', 'CANCELLED'].includes(invoice.status) ? invoice.status : next.status as InvoiceStatus, paidAt: next.status === 'PAID' ? invoice.paidAt ?? new Date() : null } });
  }
  async list(invoiceId: string) {
    const scope = await this.access.require('finance', 'read');
    await this.ownedInvoice(this.prisma.database, scope, invoiceId);
    return this.prisma.database.invoicePayment.findMany({ where: { tenantId: scope.tenantId, invoiceId, deletedAt: null }, orderBy: { createdAt: 'asc' } });
  }
  private payable(invoice: Invoice) { if (['DRAFT', 'VOID', 'CANCELLED', 'REFUNDED'].includes(invoice.status)) throw new BadRequestException('Invoice must be issued before accepting payment'); }
  private async existing(tx: Prisma.TransactionClient, scope: RetailScope, idempotencyKey: string, hash: string) {
    const row = await tx.invoicePayment.findUnique({ where: { tenantId_idempotencyKey: { tenantId: scope.tenantId, idempotencyKey } } });
    if (row) matchRequest((row.metadata as Record<string, string>).requestHash, hash);
    return row;
  }
}
