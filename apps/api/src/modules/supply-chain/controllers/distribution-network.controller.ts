
import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateCarrierDto, CreateDistributionCenterDto, CreateRouteOptimizationPlanDto } from '../dto/supply-chain.dto';
import { FulfillmentDistributionService } from '../fulfillment-distribution.service';

@ApiTags('Distribution Network')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'distribution-network', version: '1' })
export class DistributionNetworkController {
  constructor(private readonly distribution: FulfillmentDistributionService) {}
  @Get('dashboard') dashboard() { return this.distribution.distributionDashboard(); }
  @Get('carriers') carriers(@Query('status') status?: string, @Query('carrierType') carrierType?: string) { return this.distribution.carriers(status, carrierType); }
  @Post('carriers') createCarrier(@Body() dto: CreateCarrierDto) { return this.distribution.createCarrier(dto); }
  @Get('centers') centers(@Query('status') status?: string, @Query('region') region?: string) { return this.distribution.distributionCenters(status, region); }
  @Post('centers') createCenter(@Body() dto: CreateDistributionCenterDto) { return this.distribution.createDistributionCenter(dto); }
  @Get('routes') routes(@Query('status') status?: string, @Query('optimizationGoal') optimizationGoal?: string) { return this.distribution.routePlans(status, optimizationGoal); }
  @Post('routes') createRoute(@Body() dto: CreateRouteOptimizationPlanDto) { return this.distribution.createRoutePlan(dto); }
}
