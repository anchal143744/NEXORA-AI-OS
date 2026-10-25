import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { BillingPortalService } from '../billing-portal.service';
import { CreateInvoiceRecordDto } from '../dto/customer-portal.dto';

@ApiTags('Invoice Center')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'invoices', version: '1' })
export class InvoicesController {
  constructor(private readonly billing: BillingPortalService) {}
  @Get() invoices(@Query('customerAccountId') customerAccountId?: string, @Query('status') status?: string, @Query('subscriptionId') subscriptionId?: string) { return this.billing.invoices(customerAccountId, status, subscriptionId); }
  @Post() createInvoice(@Body() dto: CreateInvoiceRecordDto) { return this.billing.createInvoice(dto); }
}
