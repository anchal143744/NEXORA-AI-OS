import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateCapacityPlanDto } from '../dto/strategic-forecasting.dto';
import { CapacityPlanningService } from '../capacity-planning.service';

@ApiTags('Capacity Planning')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'capacity-planning', version: '1' })
export class CapacityPlanningController {
  constructor(private readonly capacity: CapacityPlanningService) {}

  @Get() plans(@Query('capacityType') capacityType?: string, @Query('status') status?: string) { return this.capacity.plans(capacityType, status); }
  @Post() create(@Body() dto: CreateCapacityPlanDto) { return this.capacity.create(dto); }
  @Get('gaps') gaps() { return this.capacity.gaps(); }
  @Get('recommendations') recommendations() { return this.capacity.recommendations(); }
}