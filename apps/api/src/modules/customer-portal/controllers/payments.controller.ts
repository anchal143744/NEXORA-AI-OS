import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { BillingPortalService } from '../billing-portal.service';
import { CreatePaymentMethodDto } from '../dto/customer-portal.dto';

@ApiTags('Payment Methods')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'payments', version: '1' })
export class PaymentsController {
  constructor(private readonly billing: BillingPortalService) {}
  @Get('methods') methods(@Query('customerAccountId') customerAccountId?: string, @Query('status') status?: string, @Query('provider') provider?: string) { return this.billing.paymentMethods(customerAccountId, status, provider); }
  @Post('methods') createMethod(@Body() dto: CreatePaymentMethodDto) { return this.billing.createPaymentMethod(dto); }
}
