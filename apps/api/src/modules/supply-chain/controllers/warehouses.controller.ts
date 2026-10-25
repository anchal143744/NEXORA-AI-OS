
import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateInventoryTransferDto, CreateReceivingRecordDto, CreateWarehouseBinDto, CreateWarehouseDto, CreateWarehouseZoneDto } from '../dto/supply-chain.dto';
import { WarehouseManagementService } from '../warehouse-management.service';

@ApiTags('Warehouses')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'warehouses', version: '1' })
export class WarehousesController {
  constructor(private readonly warehouses: WarehouseManagementService) {}
  @Get('dashboard') dashboard() { return this.warehouses.dashboard(); }
  @Get() list(@Query('status') status?: string, @Query('warehouseType') warehouseType?: string) { return this.warehouses.warehouses(status, warehouseType); }
  @Post() create(@Body() dto: CreateWarehouseDto) { return this.warehouses.createWarehouse(dto); }
  @Get('zones') zones(@Query('status') status?: string, @Query('warehouseId') warehouseId?: string) { return this.warehouses.zones(status, warehouseId); }
  @Post('zones') createZone(@Body() dto: CreateWarehouseZoneDto) { return this.warehouses.createZone(dto); }
  @Get('bins') bins(@Query('status') status?: string, @Query('warehouseId') warehouseId?: string, @Query('zoneId') zoneId?: string) { return this.warehouses.bins(status, warehouseId, zoneId); }
  @Post('bins') createBin(@Body() dto: CreateWarehouseBinDto) { return this.warehouses.createBin(dto); }
  @Get('transfers') transfers(@Query('status') status?: string, @Query('sourceWarehouseId') sourceWarehouseId?: string, @Query('destinationWarehouseId') destinationWarehouseId?: string) { return this.warehouses.transfers(status, sourceWarehouseId, destinationWarehouseId); }
  @Post('transfers') createTransfer(@Body() dto: CreateInventoryTransferDto) { return this.warehouses.createTransfer(dto); }
  @Get('receiving') receiving(@Query('status') status?: string, @Query('warehouseId') warehouseId?: string, @Query('itemId') itemId?: string) { return this.warehouses.receiving(status, warehouseId, itemId); }
  @Post('receiving') createReceiving(@Body() dto: CreateReceivingRecordDto) { return this.warehouses.createReceiving(dto); }
}
