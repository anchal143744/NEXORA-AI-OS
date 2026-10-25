import { Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { KpiPeriod } from './kpi.contracts';
import { KpiEngine } from './kpi-engine.service';
@ApiTags('KPIs') @ApiBearerAuth() @UseGuards(JwtAuthGuard) @Controller({ path: 'kpis', version: '1' })
export class KpiController { constructor(private readonly engine: KpiEngine) {} @Get() registry() { return this.engine.registrySnapshot(); } @Post('generate') generate(@Query('period') period?: KpiPeriod) { return this.engine.generate(period ?? 'monthly'); } }
