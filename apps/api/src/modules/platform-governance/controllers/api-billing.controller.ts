import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { ApiMonetizationService } from '../api-monetization.service';
import { ApiProductService } from '../api-product.service';
import { CreateApiBillingDto } from '../dto/platform-governance.dto';

@ApiTags('API Billing')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'api-billing', version: '1' })
export class ApiBillingController {
  constructor(private readonly monetization: ApiMonetizationService, private readonly products: ApiProductService) {}

  @Get('dashboard') dashboard() { return this.monetization.dashboard(); }
  @Get() billings(@Query('status') status?: string, @Query('subscriptionId') subscriptionId?: string) { return this.monetization.billings(status, subscriptionId); }
  @Post() createBilling(@Body() dto: CreateApiBillingDto) { return this.monetization.createBilling(dto); }
  @Get('plans') plans(@Query('apiProductId') apiProductId?: string, @Query('status') status?: string, @Query('tier') tier?: string) { return this.products.plans(apiProductId, status, tier); }
  @Get('subscriptions') subscriptions(@Query('status') status?: string, @Query('subscriberType') subscriberType?: string, @Query('apiProductId') apiProductId?: string) { return this.products.subscriptions(status, subscriberType, apiProductId); }
}
