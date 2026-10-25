import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import {

  CreateManufacturingExecutionRunDto,
  CreateProductionOperationDto,
  CreateProductionOrderDto,

} from '../dto/manufacturing.dto';
import { ManufacturingCommandService } from '../manufacturing-command.service';
import { ManufacturingQueryService } from '../manufacturing-query.service';
import { ManufacturingService } from '../manufacturing.service';

@ApiTags('Manufacturing Execution')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'manufacturing-execution', version: '1' })
export class ManufacturingExecutionController {
  constructor(private readonly commands: ManufacturingCommandService, private readonly queries: ManufacturingQueryService, private readonly manufacturing: ManufacturingService) {}

  @Get('orders') orders(@Query('status') status?: string, @Query('plantId') plantId?: string) { return this.queries.orders(status, plantId); }
  @Post('orders') createOrder(@Body() dto: CreateProductionOrderDto) { return this.commands.createProductionOrder(dto); }
  @Get('operations') operations(@Query('status') status?: string, @Query('productionOrderId') productionOrderId?: string) { return this.queries.operations(status, productionOrderId); }
  @Post('operations') createOperation(@Body() dto: CreateProductionOperationDto) { return this.commands.createProductionOperation(dto); }
  @Get('runs') executionRuns(@Query('status') status?: string, @Query('productionOrderId') productionOrderId?: string) { return this.queries.executionRuns(status, productionOrderId); }
  @Post('runs') createExecutionRun(@Body() dto: CreateManufacturingExecutionRunDto) { return this.commands.createExecutionRun(dto); }

}

