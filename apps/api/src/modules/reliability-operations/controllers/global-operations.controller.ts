import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateFailoverEventDto, CreateRegionHealthDto } from '../dto/reliability-operations.dto';
import { GlobalOperationsService } from '../global-operations.service';

@ApiTags('Global Operations')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'global-operations', version: '1' })
export class GlobalOperationsController {
  constructor(private readonly globalOps: GlobalOperationsService) {}

  @Get('dashboard') dashboard() { return this.globalOps.dashboard(); }
  @Get('regions') regions(@Query('provider') provider?: string, @Query('status') status?: string, @Query('region') region?: string) { return this.globalOps.regionHealth(provider, status, region); }
  @Post('regions') createRegion(@Body() dto: CreateRegionHealthDto) { return this.globalOps.createRegionHealth(dto); }
  @Get('failovers') failovers(@Query('status') status?: string, @Query('sourceRegion') sourceRegion?: string, @Query('targetRegion') targetRegion?: string) { return this.globalOps.failoverEvents(status, sourceRegion, targetRegion); }
  @Post('failovers') createFailover(@Body() dto: CreateFailoverEventDto) { return this.globalOps.createFailoverEvent(dto); }
}