import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import {

  CreateFactoryResourceDto,
  CreateMachineTelemetryDto,
  CreateWorkCenterDto,

} from '../dto/manufacturing.dto';
import { ManufacturingCommandService } from '../manufacturing-command.service';
import { ManufacturingQueryService } from '../manufacturing-query.service';
import { ManufacturingService } from '../manufacturing.service';

@ApiTags('Factory Resources')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'factory-resources', version: '1' })
export class FactoryResourcesController {
  constructor(private readonly commands: ManufacturingCommandService, private readonly queries: ManufacturingQueryService, private readonly manufacturing: ManufacturingService) {}

  @Get('work-centers') workCenters(@Query('status') status?: string, @Query('plantId') plantId?: string) { return this.queries.workCenters(status, plantId); }
  @Post('work-centers') createWorkCenter(@Body() dto: CreateWorkCenterDto) { return this.commands.createWorkCenter(dto); }
  @Get('resources') resources(@Query('status') status?: string, @Query('workCenterId') workCenterId?: string) { return this.queries.resources(status, workCenterId); }
  @Post('resources') createResource(@Body() dto: CreateFactoryResourceDto) { return this.commands.createFactoryResource(dto); }
  @Get('telemetry') telemetry(@Query('signalType') signalType?: string, @Query('factoryResourceId') factoryResourceId?: string) { return this.queries.telemetry(signalType, factoryResourceId); }
  @Post('telemetry') createTelemetry(@Body() dto: CreateMachineTelemetryDto) { return this.commands.createTelemetry(dto); }

}

