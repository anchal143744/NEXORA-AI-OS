
import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateExpansionOpportunityDto } from '../dto/revenue-operations.dto';
import { RevenueIntelligenceService } from '../revenue-intelligence.service';

@ApiTags('Expansion Opportunities')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'expansion-opportunities', version: '1' })
export class ExpansionOpportunitiesController {
  constructor(private readonly intelligence: RevenueIntelligenceService) {}
  @Get('dashboard') dashboard() { return this.intelligence.expansionDashboard(); }
  @Get() list(@Query('status') status?: string, @Query('opportunityType') opportunityType?: string, @Query('revenueAccountId') revenueAccountId?: string) { return this.intelligence.expansionOpportunities(status, opportunityType, revenueAccountId); }
  @Post() create(@Body() dto: CreateExpansionOpportunityDto) { return this.intelligence.createExpansionOpportunity(dto); }
}
