import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { ApiMonetizationService } from '../api-monetization.service';
import { CreateApiQuotaDto, CreateApiUsageRecordDto } from '../dto/platform-governance.dto';

@ApiTags('API Usage')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'api-usage', version: '1' })
export class ApiUsageController {
  constructor(private readonly monetization: ApiMonetizationService) {}

  @Get('analytics') analytics() { return this.monetization.dashboard(); }
  @Get() records(@Query('endpoint') endpoint?: string, @Query('apiProductId') apiProductId?: string, @Query('subscriptionId') subscriptionId?: string) { return this.monetization.usage(endpoint, apiProductId, subscriptionId); }
  @Post() createRecord(@Body() dto: CreateApiUsageRecordDto) { return this.monetization.createUsage(dto); }
  @Get('quotas') quotas(@Query('apiProductId') apiProductId?: string, @Query('quotaType') quotaType?: string, @Query('status') status?: string) { return this.monetization.quotas(apiProductId, quotaType, status); }
  @Post('quotas') createQuota(@Body() dto: CreateApiQuotaDto) { return this.monetization.createQuota(dto); }
}
