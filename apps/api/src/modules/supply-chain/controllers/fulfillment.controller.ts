
import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateFulfillmentOrderDto, CreatePackingTaskDto, CreatePickingTaskDto } from '../dto/supply-chain.dto';
import { FulfillmentDistributionService } from '../fulfillment-distribution.service';

@ApiTags('Fulfillment')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'fulfillment', version: '1' })
export class FulfillmentController {
  constructor(private readonly fulfillment: FulfillmentDistributionService) {}
  @Get('dashboard') dashboard() { return this.fulfillment.fulfillmentDashboard(); }
  @Get('orders') orders(@Query('status') status?: string, @Query('priority') priority?: string, @Query('warehouseId') warehouseId?: string) { return this.fulfillment.fulfillmentOrders(status, priority, warehouseId); }
  @Post('orders') createOrder(@Body() dto: CreateFulfillmentOrderDto) { return this.fulfillment.createFulfillmentOrder(dto); }
  @Get('picking') picking(@Query('status') status?: string, @Query('fulfillmentOrderId') fulfillmentOrderId?: string) { return this.fulfillment.pickingTasks(status, fulfillmentOrderId); }
  @Post('picking') createPicking(@Body() dto: CreatePickingTaskDto) { return this.fulfillment.createPickingTask(dto); }
  @Get('packing') packing(@Query('status') status?: string, @Query('fulfillmentOrderId') fulfillmentOrderId?: string) { return this.fulfillment.packingTasks(status, fulfillmentOrderId); }
  @Post('packing') createPacking(@Body() dto: CreatePackingTaskDto) { return this.fulfillment.createPackingTask(dto); }
}
