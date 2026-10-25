import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/database/prisma.service';
import { TenantContextService } from '../../tenants/tenant-context.service';
import { CreatePaymentDto } from '../dto/global-finance.dto';
import { InvoiceIntelligenceService } from '../invoices/invoice-intelligence.service';
import { PaymentsService } from '../../retail/payments.service';
import { RetailAccessService } from '../../retail/retail-access.service';
@Injectable()
export class GlobalBillingService {
  constructor(private readonly prisma: PrismaService, private readonly context: TenantContextService, private readonly invoices: InvoiceIntelligenceService, private readonly payments: PaymentsService, private readonly access: RetailAccessService) {}
  async listPayments(invoiceId?: string) {
    if (invoiceId) return this.payments.list(invoiceId);
    const scope = await this.access.require('finance', 'read');
    return this.prisma.database.invoicePayment.findMany({ where: { tenantId: scope.tenantId, deletedAt: null, invoice: { tenantId: scope.tenantId, workspaceId: scope.workspaceId, deletedAt: null } }, orderBy: { createdAt: 'desc' }, take: 100 });
  }
  async recordPayment(dto: CreatePaymentDto) {
    if (dto.provider !== 'manual' || dto.paidAt || dto.status && dto.status !== 'succeeded') throw new BadRequestException('Provider payment confirmation requires a verified integration; record manual receipts through the reconciled ledger');
    const result = await this.payments.record(dto.invoiceId, { idempotencyKey: dto.idempotencyKey, amount: String(dto.amount), currency: dto.currency, paymentMethod: dto.paymentMethod, reference: dto.transactionReference });
    return result.payment;
  }
}