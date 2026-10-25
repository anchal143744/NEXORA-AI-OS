import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateKpiDto, GenerateKpiResultDto } from '../dto/data-platform.dto';
import { KpiExecutiveService } from '../kpi-executive.service';

@ApiTags('KPIs')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'kpis', version: '1' })
export class KpisController {
  constructor(private readonly kpis: KpiExecutiveService) {}

  @Get() list(@Query('category') category?: string, @Query('status') status?: string) { return this.kpis.kpis(category, status); }
  @Post() create(@Body() dto: CreateKpiDto) { return this.kpis.createKpi(dto); }
  @Get('results') results(@Query('kpiId') kpiId?: string, @Query('band') band?: string) { return this.kpis.results(kpiId, band); }
  @Post('results') generateResult(@Body() dto: GenerateKpiResultDto) { return this.kpis.generateResult(dto); }
  @Get('studio') studio() { return this.kpis.studio(); }
  @Get('scorecard') scorecard() { return this.kpis.scorecard(); }
}