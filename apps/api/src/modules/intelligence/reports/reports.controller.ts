import { Controller, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { ReportFormat, ReportType } from './report.contracts';
import { ReportEngine } from './report-engine.service';
@ApiTags('Reports') @ApiBearerAuth() @UseGuards(JwtAuthGuard) @Controller({ path: 'reports', version: '1' })
export class ReportsController { constructor(private readonly reports: ReportEngine) {} @Post('generate') generate(@Query('type') type: ReportType = 'executive', @Query('format') format: ReportFormat = 'json') { return this.reports.generate(type, format); } }
