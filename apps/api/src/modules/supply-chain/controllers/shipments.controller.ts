
import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateShipmentDto, CreateShipmentTrackingEventDto } from '../dto/supply-chain.dto';
import { FulfillmentDistributionService } from '../fulfillment-distribution.service';

@ApiTags('Shipments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'shipments', version: '1' })
export class ShipmentsController {
  constructor(private readonly fulfillment: FulfillmentDistributionService) {}
  @Get('dashboard') dashboard() { return this.fulfillment.shipmentDashboard(); }
  @Get() shipments(@Query('status') status?: string, @Query('carrierId') carrierId?: string, @Query('warehouseId') warehouseId?: string) { return this.fulfillment.shipments(status, carrierId, warehouseId); }
  @Post() createShipment(@Body() dto: CreateShipmentDto) { return this.fulfillment.createShipment(dto); }
  @Get('tracking') tracking(@Query('shipmentId') shipmentId?: string, @Query('eventType') eventType?: string) { return this.fulfillment.trackingEvents(shipmentId, eventType); }
  @Post('tracking') createTracking(@Body() dto: CreateShipmentTrackingEventDto) { return this.fulfillment.createTrackingEvent(dto); }
}
