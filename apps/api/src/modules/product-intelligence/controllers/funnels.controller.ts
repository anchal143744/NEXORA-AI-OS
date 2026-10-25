import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateFunnelDefinitionDto, CreateFunnelResultDto } from '../dto/product-intelligence.dto';
import { FunnelAnalyticsService } from '../funnel-analytics.service';

@ApiTags('Funnel Analytics')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'funnels', version: '1' })
export class FunnelsController {
  constructor(private readonly funnels: FunnelAnalyticsService) {}

  @Get() list(@Query('funnelType') funnelType?: string, @Query('status') status?: string) { return this.funnels.funnels(funnelType, status); }
  @Post() create(@Body() dto: CreateFunnelDefinitionDto) { return this.funnels.createFunnel(dto); }
  @Get(':id') get(@Param('id') id: string) { return this.funnels.getFunnel(id); }
  @Get(':id/results') results(@Param('id') id: string) { return this.funnels.results(id); }
  @Post(':id/results') createResult(@Param('id') id: string, @Body() dto: CreateFunnelResultDto) { return this.funnels.createResult({ ...dto, funnelId: id }); }
  @Get(':id/bottlenecks') bottlenecks(@Param('id') id: string) { return this.funnels.bottleneckAnalysis(id); }
  @Get(':id/recommendations') recommendations(@Param('id') id: string) { return this.funnels.conversionRecommendations(id); }
}
