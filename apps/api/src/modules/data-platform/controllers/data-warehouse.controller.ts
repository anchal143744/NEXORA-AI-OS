import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { DataWarehouseService } from '../data-warehouse.service';
import { CreateDataWarehouseDto, CreateWarehouseJobDto } from '../dto/data-platform.dto';

@ApiTags('Data Warehouse')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'data-warehouse', version: '1' })
export class DataWarehouseController {
  constructor(private readonly warehouse: DataWarehouseService) {}

  @Get() list(@Query('status') status?: string, @Query('warehouseType') warehouseType?: string) { return this.warehouse.warehouses(status, warehouseType); }
  @Post() create(@Body() dto: CreateDataWarehouseDto) { return this.warehouse.createWarehouse(dto); }
  @Get('explorer') explorer() { return this.warehouse.explorer(); }
  @Get('jobs') jobs(@Query('warehouseId') warehouseId?: string, @Query('status') status?: string) { return this.warehouse.jobs(warehouseId, status); }
  @Post('jobs') createJob(@Body() dto: CreateWarehouseJobDto) { return this.warehouse.createJob(dto); }
}