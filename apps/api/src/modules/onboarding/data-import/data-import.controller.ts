import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateImportJobDto, CsvImportDto, ExcelImportDto } from '../dto/onboarding.dto';
import { DataImportService } from './data-import.service';

@ApiTags('Data Import')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'data-import', version: '1' })
export class DataImportController {
  constructor(private readonly imports: DataImportService) {}
  @Get('jobs') jobs(@Query('status') status?: string) { return this.imports.jobs(status); }
  @Post('jobs') createJob(@Body() dto: CreateImportJobDto) { return this.imports.createJob(dto); }
  @Post('csv') importCsv(@Body() dto: CsvImportDto) { return this.imports.importCsv(dto); }
  @Post('excel') importExcel(@Body() dto: ExcelImportDto) { return this.imports.importExcel(dto); }
  @Post('jobs/:id/process') processJob(@Param('id') id: string) { return this.imports.processJob(id); }
  @Get('jobs/:id/errors') errors(@Param('id') id: string) { return this.imports.errors(id); }
  @Get('jobs/:id/records') records(@Param('id') id: string) { return this.imports.records(id); }
}
