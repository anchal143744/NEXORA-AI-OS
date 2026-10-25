import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreatePaymentDto } from '../dto/global-finance.dto';
import { GlobalBillingService } from './global-billing.service';

@ApiTags('Invoice Payments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'payments', version: '1' })
export class PaymentsController {
  constructor(private readonly billing: GlobalBillingService) {}

  @Get() listPayments(@Query('invoiceId') invoiceId?: string) { return this.billing.listPayments(invoiceId); }
  @Post() recordPayment(@Body() dto: CreatePaymentDto) { return this.billing.recordPayment(dto); }
}