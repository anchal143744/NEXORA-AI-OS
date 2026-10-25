import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { DataWarehouseService } from '../data-warehouse.service';
import { CreateDataMartDto } from '../dto/data-platform.dto';

@ApiTags('Data Marts')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'data-marts', version: '1' })
export class DataMartsController {
  constructor(private readonly warehouse: DataWarehouseService) {}

  @Get() list(@Query('domain') domain?: string, @Query('status') status?: string) { return this.warehouse.dataMarts(domain, status); }
  @Post() create(@Body() dto: CreateDataMartDto) { return this.warehouse.createDataMart(dto); }
  @Get('architecture') architecture() { return this.warehouse.architecture(); }
  @Get(':id/semantic-summary') semanticSummary(@Param('id') id: string) { return this.warehouse.dataMarts().then((marts: Array<{ id: string }>) => marts.find((mart) => mart.id === id) ?? null); }
}