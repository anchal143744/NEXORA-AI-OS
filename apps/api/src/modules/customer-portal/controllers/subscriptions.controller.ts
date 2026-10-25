import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { BillingPortalService } from '../billing-portal.service';
import { CreateCustomerSubscriptionDto } from '../dto/customer-portal.dto';
import { ExternalPortalService } from '../external-portal.service';

@ApiTags('Subscriptions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'subscriptions', version: '1' })
export class SubscriptionsController {
  constructor(private readonly billing: BillingPortalService, private readonly external: ExternalPortalService) {}
  @Get('center') center() { return this.external.subscriptionCenter(); }
  @Get() subscriptions(@Query('customerAccountId') customerAccountId?: string, @Query('status') status?: string, @Query('planTier') planTier?: string) { return this.billing.subscriptions(customerAccountId, status, planTier); }
  @Post() createSubscription(@Body() dto: CreateCustomerSubscriptionDto) { return this.billing.createSubscription(dto); }
}
