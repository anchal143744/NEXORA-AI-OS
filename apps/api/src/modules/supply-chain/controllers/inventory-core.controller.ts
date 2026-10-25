
import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateInventoryAuditDto, CreateInventoryBatchDto, CreateInventoryMovementHistoryDto, CreateInventorySerialDto, CreateStockBalanceDto, CreateSupplyChainItemDto } from '../dto/supply-chain.dto';
import { InventoryCoreService } from '../inventory-core.service';

@ApiTags('Inventory Core')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'inventory-core', version: '1' })
export class InventoryCoreController {
  constructor(private readonly inventory: InventoryCoreService) {}
  @Get('dashboard') dashboard() { return this.inventory.dashboard(); }
  @Get('items') items(@Query('status') status?: string, @Query('category') category?: string) { return this.inventory.items(status, category); }
  @Post('items') createItem(@Body() dto: CreateSupplyChainItemDto) { return this.inventory.createItem(dto); }
  @Get('stock') stock(@Query('status') status?: string, @Query('itemId') itemId?: string, @Query('warehouseId') warehouseId?: string) { return this.inventory.stock(status, itemId, warehouseId); }
  @Post('stock') createStock(@Body() dto: CreateStockBalanceDto) { return this.inventory.createStock(dto); }
  @Get('batches') batches(@Query('status') status?: string, @Query('itemId') itemId?: string) { return this.inventory.batches(status, itemId); }
  @Post('batches') createBatch(@Body() dto: CreateInventoryBatchDto) { return this.inventory.createBatch(dto); }
  @Get('serials') serials(@Query('status') status?: string, @Query('itemId') itemId?: string) { return this.inventory.serials(status, itemId); }
  @Post('serials') createSerial(@Body() dto: CreateInventorySerialDto) { return this.inventory.createSerial(dto); }
  @Get('audits') audits(@Query('status') status?: string, @Query('warehouseId') warehouseId?: string) { return this.inventory.audits(status, warehouseId); }
  @Post('audits') createAudit(@Body() dto: CreateInventoryAuditDto) { return this.inventory.createAudit(dto); }
  @Get('movements') movements(@Query('status') status?: string, @Query('movementType') movementType?: string, @Query('itemId') itemId?: string) { return this.inventory.movements(status, movementType, itemId); }
  @Post('movements') createMovement(@Body() dto: CreateInventoryMovementHistoryDto) { return this.inventory.createMovement(dto); }
}
