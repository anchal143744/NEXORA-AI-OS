import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, RetailSale, RetailSaleLine } from '@prisma/client';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { InventoryLedgerService } from './inventory-ledger.service';
import { PaymentsService } from './payments.service';
import { RetailAccessService, RetailScope } from './retail-access.service';
import { audit, currency, key, lock, matchRequest, reason, requestHash } from './retail-transaction';
import { decimal, money, quantity, round, total } from './money';
import { ShopQueryDto } from './shop.dto';

const json=(value:Prisma.JsonValue)=>value&&typeof value==='object'&&!Array.isArray(value)?value as Prisma.JsonObject:{};
export type SaleInput = { sourceDocumentId?:string; saleKey: string; currency: string; customerId?: string; lines: Array<{ stockId: string; quantity: string; unitPrice: string }> };
export type ReturnInput = { returnKey: string; reason: string; lines: Array<{ lineId: string; quantity: string }> };
type SaleWithLines = RetailSale & { lines: RetailSaleLine[] };

@Injectable()
export class RetailSalesService {
  constructor(private readonly prisma: PrismaService, private readonly access: RetailAccessService, private readonly inventory: InventoryLedgerService, private readonly payments: PaymentsService) {}

  async create(input: SaleInput) {
    key(input.saleKey);
    if (!input.lines?.length || input.lines.length > 100 || new Set(input.lines.map(l => l.stockId)).size !== input.lines.length) throw new BadRequestException('Provide 1–100 distinct stock lines');
    return this.prisma.transaction(async tx => {
      const scope = await this.access.require('sales', 'create', tx);
      const config = await currency(tx, input.currency);
      const customer = input.customerId ? await tx.crmCustomerRecord.findFirst({ where: { id: input.customerId, tenantId: scope.tenantId, workspaceId: scope.workspaceId, deletedAt: null } }) : null;
      if (input.customerId && !customer) throw new NotFoundException('Customer not found');
      const lines = input.lines.map(l => ({ stockId: l.stockId, quantity: quantity(l.quantity), unitPrice: money(l.unitPrice, config.precision) })).sort((a, b) => a.stockId.localeCompare(b.stockId));
      const hash = requestHash([scope.organizationId, scope.workspaceId, input.currency, lines.map(l => [l.stockId, l.quantity.toString(), l.unitPrice.toString()]), ...(input.customerId ? [input.customerId] : []), ...(input.sourceDocumentId ? [input.sourceDocumentId] : [])]);
      await lock(tx, `sale-key:${scope.tenantId}:${input.saleKey}`);
      const existing = await tx.retailSale.findUnique({ where: { tenantId_saleKey: { tenantId: scope.tenantId, saleKey: input.saleKey } }, include: { lines: true } });
      if (existing) { matchRequest(existing.requestHash, hash); return existing; }
      let source:Awaited<ReturnType<typeof tx.document.findFirst>>=null;
      if(input.sourceDocumentId){await lock(tx,'invoice-source:'+input.sourceDocumentId);source=await tx.document.findFirst({where:{id:input.sourceDocumentId,tenantId:scope.tenantId,documentType:'retail_invoice_source',deletedAt:null,AND:[{metadata:{path:['workspaceId'],equals:scope.workspaceId}},{metadata:{path:['organizationId'],equals:scope.organizationId}}]}});if(!source)throw new NotFoundException('Invoice source not found');if(json(source.metadata).linkedSaleId)throw new BadRequestException('Invoice source is already linked to a sale');}
      for (const line of lines) await this.inventory.ownedStock(tx, scope, line.stockId);
      const lineTotals = lines.map(l => round(l.quantity.times(l.unitPrice), config.precision));
      const saleTotal = money(total(lineTotals), config.precision);
      const invoice = await tx.invoice.create({ data: { tenantId: scope.tenantId, workspaceId: scope.workspaceId, customerId: customer?.id, invoiceNumber: `RS:${input.saleKey}`, currency: input.currency, subtotal: saleTotal, total: saleTotal, amountDue: saleTotal, status: 'DRAFT', metadata: { source: 'retail_sale', organizationId: scope.organizationId, customerName: customer?.name ?? null, ...(input.sourceDocumentId?{sourceDocumentId:input.sourceDocumentId}:{}) } } });
      const sale = await tx.retailSale.create({ data: { tenantId: scope.tenantId, organizationId: scope.organizationId, workspaceId: scope.workspaceId, saleKey: input.saleKey, requestHash: hash, currency: input.currency, total: saleTotal, invoiceId: invoice.id, createdBy: scope.userId, lines: { create: lines.map((l, i) => ({ ...l, lineTotal: lineTotals[i] })) } }, include: { lines: true } });
      if(source)await tx.document.update({where:{id:source.id},data:{metadata:{...json(source.metadata),linkedSaleId:sale.id,reviewRequired:false,reviewedBy:scope.userId,reviewedAt:new Date().toISOString()}}});
      await audit(tx, scope, 'retail.sale', sale.id, { status: 'DRAFT', total: sale.total.toString(), currency: sale.currency });
      return sale;
    });
  }

  async complete(id: string) {
    return this.prisma.transaction(async tx => {
      const scope = await this.access.require('sales', 'update', tx);
      await this.access.require('inventory', 'update', tx);
      await lock(tx, `sale:${id}`);
      const sale = await this.owned(tx, scope, id);
      if (sale.status === 'COMPLETED') return sale;
      if (sale.status !== 'DRAFT') throw new BadRequestException('Only a draft sale can be completed');
      await lock(tx, `invoice:${sale.invoiceId}`);
      let costOfGoods = decimal(0);
      for (const line of [...sale.lines].sort((a, b) => a.stockId.localeCompare(b.stockId))) {
        const movement = await this.inventory.mutate(tx, scope, { stockId: line.stockId, quantity: decimal(line.quantity).negated(), movementKey: `sale:${sale.id}:${line.id}`, movementType: 'SALE', reason: 'Completed retail sale', currency: sale.currency, referenceId: sale.id, requestHash: requestHash([sale.id, line.id, 'complete']) });
        const cost = decimal((movement.metadata as Record<string, string>).value).negated();
        await tx.retailSaleLine.update({ where: { id: line.id }, data: { costOfGoods: cost } });
        costOfGoods = costOfGoods.plus(cost);
      }
      const invoice=await tx.invoice.findUniqueOrThrow({where:{id:sale.invoiceId}});
      const workspace=await tx.workspace.findUniqueOrThrow({where:{id:scope.workspaceId},include:{organization:true}});const metadata=json(workspace.metadata);
      const stockItems=await tx.stockBalance.findMany({where:{tenantId:scope.tenantId,workspaceId:scope.workspaceId,id:{in:sale.lines.map(line=>line.stockId)}},include:{item:true}});
      const profile=json(metadata.businessProfile??null);
      const printSnapshot={seller:{...profile,businessName:profile.businessName??workspace.organization.name},signatureId:metadata.invoiceSignatureId??null,items:sale.lines.map(line=>({name:stockItems.find(stock=>stock.id===line.stockId)?.item?.name??'Recorded item',sku:stockItems.find(stock=>stock.id===line.stockId)?.item?.sku??'',quantity:line.quantity.toString(),unitPrice:line.unitPrice.toString(),lineTotal:line.lineTotal.toString()}))};
      await tx.invoice.update({ where: { id: sale.invoiceId }, data: { status: 'ISSUED', issuedAt: new Date(),metadata:{...json(invoice.metadata),printSnapshot} } });
      const result = await tx.retailSale.update({ where: { id }, data: { status: 'COMPLETED', completedAt: new Date(), costOfGoods }, include: { lines: true } });
      await audit(tx, scope, 'retail.sale', id, { status: 'COMPLETED', costOfGoods: costOfGoods.toString() });
      return result;
    });
  }

  async returnItems(id: string, input: ReturnInput) {
    return this.prisma.transaction(async tx => {
      const scope = await this.access.require('sales', 'update', tx);
      await this.access.require('inventory', 'update', tx);
      await this.access.require('finance', 'approve', tx);
      await lock(tx, `sale:${id}`);
      return this.returnInTx(tx, scope, await this.owned(tx, scope, id), input, false);
    });
  }

  async cancel(id: string, why: string) {
    const explanation = reason(why);
    return this.prisma.transaction(async tx => {
      const scope = await this.access.require('sales', 'update', tx);
      await this.access.require('inventory', 'update', tx);
      await this.access.require('finance', 'approve', tx);
      await lock(tx, `sale:${id}`);
      const sale = await this.owned(tx, scope, id);
      if (sale.status === 'CANCELLED') return sale;
      if (sale.status === 'DRAFT') {
        await tx.invoice.update({ where: { id: sale.invoiceId }, data: { status: 'CANCELLED', amountDue: 0, cancelledAt: new Date() } });
        const result = await tx.retailSale.update({ where: { id }, data: { status: 'CANCELLED', cancelledAt: new Date() }, include: { lines: true } });
        await audit(tx, scope, 'retail.sale', id, { status: 'CANCELLED', reason: explanation });
        return result;
      }
      if (!['COMPLETED', 'PARTIALLY_RETURNED'].includes(sale.status)) throw new BadRequestException('Sale cannot be cancelled in its current state');
      const lines = sale.lines.filter(l => l.returnedQuantity.lt(l.quantity)).map(l => ({ lineId: l.id, quantity: decimal(l.quantity).minus(l.returnedQuantity).toString() }));
      await this.returnInTx(tx, scope, sale, { returnKey: `cancel:${id}`, reason: explanation, lines }, true);
      return this.owned(tx, scope, id);
    });
  }

  private async returnInTx(tx: Prisma.TransactionClient, scope: RetailScope, sale: SaleWithLines, input: ReturnInput, cancelling: boolean) {
    key(input.returnKey);
    const why = reason(input.reason);
    if (!input.lines?.length || input.lines.length > 100 || new Set(input.lines.map(l => l.lineId)).size !== input.lines.length) throw new BadRequestException('Provide distinct return lines');
    const lines = input.lines.map(l => ({ lineId: l.lineId, quantity: quantity(l.quantity) })).sort((a, b) => a.lineId.localeCompare(b.lineId));
    const hash = requestHash([sale.id, why, cancelling, lines.map(l => [l.lineId, l.quantity.toString()])]);
    await lock(tx, `return:${scope.tenantId}:${input.returnKey}`);
    const previous = await tx.retailReturn.findUnique({ where: { tenantId_returnKey: { tenantId: scope.tenantId, returnKey: input.returnKey } } });
    if (previous) { matchRequest(previous.requestHash, hash); return previous; }
    if (!['COMPLETED', 'PARTIALLY_RETURNED'].includes(sale.status)) throw new BadRequestException('Only completed, unreturned quantities may be returned');
    const config = await currency(tx, sale.currency);
    await lock(tx, `invoice:${sale.invoiceId}`);
    let amount = decimal(0), returnedCost = decimal(0);
    const entries = lines.map(l => ({ ...l, original: sale.lines.find(o => o.id === l.lineId) })).sort((a, b) => (a.original?.stockId ?? '').localeCompare(b.original?.stockId ?? ''));
    for (const entry of entries) {
      const line = entry.original;
      if (!line || entry.quantity.gt(decimal(line.quantity).minus(line.returnedQuantity))) throw new BadRequestException('Return quantity exceeds unreturned sale quantity');
      const fullRemaining = entry.quantity.eq(decimal(line.quantity).minus(line.returnedQuantity));
      const remainingCredit = decimal(line.lineTotal).minus(line.returnedAmount);
      const remainingCost = decimal(line.costOfGoods).minus(line.returnedCost);
      const proportionalCredit = round(decimal(line.lineTotal).times(entry.quantity).dividedBy(line.quantity), config.precision);
      const proportionalCost = round(decimal(line.costOfGoods).times(entry.quantity).dividedBy(line.quantity), 4);
      // Repeated fractional returns must never allocate more than the original rounded line.
      const credit = fullRemaining || proportionalCredit.gt(remainingCredit) ? remainingCredit : proportionalCredit;
      const cost = fullRemaining || proportionalCost.gt(remainingCost) ? remainingCost : proportionalCost;
      await this.inventory.mutate(tx, scope, { stockId: line.stockId, quantity: entry.quantity, value: cost, movementKey: `return:${input.returnKey}:${line.id}`, movementType: cancelling ? 'CANCELLATION' : 'RETURN', reason: why, currency: sale.currency, referenceId: sale.id, requestHash: hash });
      await tx.retailSaleLine.update({ where: { id: line.id }, data: { returnedQuantity: { increment: entry.quantity }, returnedAmount: { increment: credit }, returnedCost: { increment: cost } } });
      amount = amount.plus(credit); returnedCost = returnedCost.plus(cost);
    }
    const invoice = await this.payments.ownedInvoice(tx, scope, sale.invoiceId);
    // Reduce the invoice by the returned goods, then refund only any cash exceeding the new total.
    const nextTotal = decimal(invoice.total).minus(amount);
    if (nextTotal.lt(0)) throw new BadRequestException('Return exceeds invoice value');
    await tx.invoice.update({ where: { id: invoice.id }, data: { total: nextTotal, discount: { increment: amount } } });
    const paymentRows = await tx.invoicePayment.findMany({ where: { tenantId: scope.tenantId, invoiceId: invoice.id, status: 'succeeded', reconciliationStatus: 'reconciled', deletedAt: null }, orderBy: { createdAt: 'asc' } });
    let refundDue = total(paymentRows.map(p => p.entryType === 'PAYMENT' ? decimal(p.amount) : decimal(p.amount).negated())).minus(nextTotal);
    for (const payment of paymentRows.filter(p => p.entryType === 'PAYMENT')) {
      if (refundDue.lte(0)) break;
      const remaining = decimal(payment.amount).minus(total(paymentRows.filter(p => p.parentPaymentId === payment.id).map(p => p.amount)));
      const refund = refundDue.lt(remaining) ? refundDue : remaining;
      if (refund.lte(0)) continue;
      await this.payments.refundInTx(tx, scope, invoice.id, { idempotencyKey: `return:${requestHash([input.returnKey, payment.id])}`, paymentId: payment.id, amount: refund.toString(), reason: why }, false);
      refundDue = refundDue.minus(refund);
    }
    if (refundDue.gt(0)) throw new BadRequestException('Payment ledger cannot fund this refund');
    await this.payments.reconcileInTx(tx, scope, invoice.id);
    const updatedLines = await tx.retailSaleLine.findMany({ where: { saleId: sale.id } });
    const fullyReturned = updatedLines.every(l => l.returnedQuantity.eq(l.quantity));
    await tx.retailSale.update({ where: { id: sale.id }, data: { status: cancelling ? 'CANCELLED' : fullyReturned ? 'RETURNED' : 'PARTIALLY_RETURNED', cancelledAt: cancelling ? new Date() : undefined } });
    if (fullyReturned) await tx.invoice.update({ where: { id: invoice.id }, data: { status: cancelling ? 'CANCELLED' : 'REFUNDED', cancelledAt: cancelling ? new Date() : undefined, refundedAt: new Date() } });
    const result = await tx.retailReturn.create({ data: { tenantId: scope.tenantId, saleId: sale.id, returnKey: input.returnKey, requestHash: hash, amount, costOfGoods: returnedCost, reason: why, actorUserId: scope.userId, lines: lines.map(l => ({ lineId: l.lineId, quantity: l.quantity.toString() })) } });
    await audit(tx, scope, 'retail.return', result.id, { saleId: sale.id, amount: amount.toString(), costOfGoods: returnedCost.toString(), reason: why });
    return result;
  }
  async list() { const scope = await this.access.require('sales', 'read'); return this.prisma.database.retailSale.findMany({ where: { tenantId: scope.tenantId, workspaceId: scope.workspaceId, organizationId: scope.organizationId, invoice: { tenantId: scope.tenantId, workspaceId: scope.workspaceId, deletedAt: null } }, include: { lines: true, invoice: { select: { id: true, invoiceNumber: true, status: true, total: true, amountPaid: true, amountDue: true, customerId: true, metadata: true } } }, orderBy: [{ createdAt: 'desc' }, { id: 'desc' }], take: 100 }); }
  async page(query: ShopQueryDto) {
    return this.prisma.transaction(async tx => {
      const scope = await this.access.require('sales', 'read', tx);
      const search = query.search.trim();
      const customers = search ? await tx.crmCustomerRecord.findMany({ where: { tenantId: scope.tenantId, workspaceId: scope.workspaceId, deletedAt: null, name: { contains: search, mode: 'insensitive' } }, select: { id: true } }) : [];
      const statuses = (['DRAFT', 'COMPLETED', 'PARTIALLY_RETURNED', 'RETURNED', 'CANCELLED'] as const).filter(status => status.toLowerCase().includes(search.toLowerCase()));
      const where: Prisma.RetailSaleWhereInput = {
        tenantId: scope.tenantId, organizationId: scope.organizationId, workspaceId: scope.workspaceId,
        invoice: { tenantId: scope.tenantId, workspaceId: scope.workspaceId, deletedAt: null },
        ...(search ? { OR: [{ saleKey: { contains: search, mode: 'insensitive' } }, { status: { in: statuses } }, { invoice: { OR: [{ customerId: { in: customers.map(customer => customer.id) } }, { invoiceNumber: { contains: search, mode: 'insensitive' } }, { metadata: { path: ['customerName'], string_contains: search } }] } }] } : {}),
      };
      const total = await tx.retailSale.count({ where });
      const items = await tx.retailSale.findMany({ where, include: { lines: true, invoice: { select: { id: true, invoiceNumber: true, status: true, total: true, amountPaid: true, amountDue: true, customerId: true, metadata: true } } }, orderBy: [{ createdAt: 'desc' }, { id: 'desc' }], skip: (query.page - 1) * query.limit, take: query.limit });
      return { items, total, page: query.page, limit: query.limit };
    });
  }
  private async owned(tx: Prisma.TransactionClient, scope: RetailScope, id: string): Promise<SaleWithLines> {
    const sale = await tx.retailSale.findFirst({ where: { id, tenantId: scope.tenantId, organizationId: scope.organizationId, workspaceId: scope.workspaceId }, include: { lines: true } });
    if (!sale) throw new NotFoundException('Sale not found');
    return sale;
  }
}
