import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { BillingPortalService } from '../billing-portal.service';
import { CreateBillingProfileDto, CreateUsageMetricDto } from '../dto/customer-portal.dto';
import { ExternalPortalService } from '../external-portal.service';

@ApiTags('Billing Workspace')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'billing', version: '1' })
export class BillingController {
  constructor(private readonly billing: BillingPortalService, private readonly external: ExternalPortalService) {}
  @Get('dashboard') dashboard() { return this.external.billingWorkspace(); }
  @Get('profiles') profiles(@Query('customerAccountId') customerAccountId?: string, @Query('status') status?: string, @Query('currency') currency?: string) { return this.billing.billingProfiles(customerAccountId, status, currency); }
  @Post('profiles') createProfile(@Body() dto: CreateBillingProfileDto) { return this.billing.createBillingProfile(dto); }
  @Get('usage') usage(@Query('customerAccountId') customerAccountId?: string, @Query('subscriptionId') subscriptionId?: string, @Query('metricType') metricType?: string) { return this.billing.usageMetrics(customerAccountId, subscriptionId, metricType); }
  @Post('usage') createUsage(@Body() dto: CreateUsageMetricDto) { return this.billing.createUsageMetric(dto); }
}
