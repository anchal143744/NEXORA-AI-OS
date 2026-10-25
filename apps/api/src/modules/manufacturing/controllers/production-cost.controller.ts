import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import {

  CreateProductionCostRecordDto,

} from '../dto/manufacturing.dto';
import { ManufacturingCommandService } from '../manufacturing-command.service';
import { ManufacturingQueryService } from '../manufacturing-query.service';
import { ManufacturingService } from '../manufacturing.service';

@ApiTags('Production Cost Intelligence')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'production-cost', version: '1' })
export class ProductionCostController {
  constructor(private readonly commands: ManufacturingCommandService, private readonly queries: ManufacturingQueryService, private readonly manufacturing: ManufacturingService) {}

  @Get('records') records(@Query('currency') currency?: string, @Query('productionOrderId') productionOrderId?: string) { return this.queries.costs(currency, productionOrderId); }
  @Post('records') createRecord(@Body() dto: CreateProductionCostRecordDto) { return this.commands.createCostRecord(dto); }
  @Get('summary') summary(@Query('currency') currency?: string) { return this.queries.costs(currency); }

}

