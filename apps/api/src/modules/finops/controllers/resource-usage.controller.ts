import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateResourceAllocationDto, CreateResourceUsageDto } from '../dto/finops.dto';
import { ResourceAnalyticsService } from '../resource-analytics.service';

@ApiTags('Resource Usage')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'resource-usage', version: '1' })
export class ResourceUsageController {
  constructor(private readonly resources: ResourceAnalyticsService) {}

  @Get('analytics') analytics() { return this.resources.analytics(); }
  @Get() usage(@Query('resourceType') resourceType?: string, @Query('provider') provider?: string, @Query('serviceName') serviceName?: string) { return this.resources.usage(resourceType, provider, serviceName); }
  @Post() createUsage(@Body() dto: CreateResourceUsageDto) { return this.resources.createUsage(dto); }
  @Get('allocations') allocations(@Query('resourceType') resourceType?: string, @Query('allocationType') allocationType?: string, @Query('allocatedTo') allocatedTo?: string) { return this.resources.allocations(resourceType, allocationType, allocatedTo); }
  @Post('allocations') createAllocation(@Body() dto: CreateResourceAllocationDto) { return this.resources.createAllocation(dto); }
}