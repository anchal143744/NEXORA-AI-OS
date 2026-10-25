
import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreatePurchaseOrderDto } from '../dto/procurement.dto';
import { ProcurementWorkflowService } from '../procurement-workflow.service';

@ApiTags('Purchase Orders')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'purchase-orders', version: '1' })
export class PurchaseOrdersController {
  constructor(private readonly workflow: ProcurementWorkflowService) {}
  @Get('dashboard') dashboard() { return this.workflow.dashboard(); }
  @Get() list(@Query('status') status?: string, @Query('vendorId') vendorId?: string, @Query('purchaseCategoryId') purchaseCategoryId?: string) { return this.workflow.purchaseOrders(status, vendorId, purchaseCategoryId); }
  @Post() create(@Body() dto: CreatePurchaseOrderDto) { return this.workflow.createPurchaseOrder(dto); }
}
