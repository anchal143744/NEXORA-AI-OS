import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import {

  CreateProductionMaterialRequirementDto,
  CreateProductionPlanDto,
  CreateProductionScheduleDto,

} from '../dto/manufacturing.dto';
import { ManufacturingCommandService } from '../manufacturing-command.service';
import { ManufacturingQueryService } from '../manufacturing-query.service';
import { ManufacturingService } from '../manufacturing.service';

@ApiTags('Production Planning')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'production-planning', version: '1' })
export class ProductionPlanningController {
  constructor(private readonly commands: ManufacturingCommandService, private readonly queries: ManufacturingQueryService, private readonly manufacturing: ManufacturingService) {}

  @Get('plans') plans(@Query('status') status?: string, @Query('plantId') plantId?: string) { return this.queries.plans(status, plantId); }
  @Post('plans') createPlan(@Body() dto: CreateProductionPlanDto) { return this.commands.createProductionPlan(dto); }
  @Get('schedules') schedules(@Query('status') status?: string, @Query('plantId') plantId?: string) { return this.queries.schedules(status, plantId); }
  @Post('schedules') createSchedule(@Body() dto: CreateProductionScheduleDto) { return this.commands.createProductionSchedule(dto); }
  @Get('material-requirements') materialRequirements(@Query('status') status?: string, @Query('productionPlanId') productionPlanId?: string) { return this.queries.materialRequirements(status, productionPlanId); }
  @Post('material-requirements') createMaterialRequirement(@Body() dto: CreateProductionMaterialRequirementDto) { return this.commands.createMaterialRequirement(dto); }

}

