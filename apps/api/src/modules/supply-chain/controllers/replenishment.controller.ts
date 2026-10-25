
import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateReplenishmentPlanDto } from '../dto/supply-chain.dto';
import { SupplyChainPlanningService } from '../supply-chain-planning.service';

@ApiTags('Replenishment')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'replenishment', version: '1' })
export class ReplenishmentController {
  constructor(private readonly planning: SupplyChainPlanningService) {}
  @Get('dashboard') dashboard() { return this.planning.replenishmentDashboard(); }
  @Get('plans') plans(@Query('status') status?: string, @Query('priority') priority?: string, @Query('itemId') itemId?: string) { return this.planning.replenishmentPlans(status, priority, itemId); }
  @Post('plans') createPlan(@Body() dto: CreateReplenishmentPlanDto) { return this.planning.createReplenishmentPlan(dto); }
}
