import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import {

  CreateManufacturingEventDto,
  CreateManufacturingPlantDto,
  CreateProductionLineDto,

} from '../dto/manufacturing.dto';
import { ManufacturingCommandService } from '../manufacturing-command.service';
import { ManufacturingQueryService } from '../manufacturing-query.service';
import { ManufacturingService } from '../manufacturing.service';

@ApiTags('Manufacturing Foundation')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'manufacturing', version: '1' })
export class ManufacturingController {
  constructor(private readonly commands: ManufacturingCommandService, private readonly queries: ManufacturingQueryService, private readonly manufacturing: ManufacturingService) {}

  @Get('dashboard') dashboard() { return this.manufacturing.dashboard(); }
  @Get('plants') plants(@Query('status') status?: string) { return this.queries.plants(status); }
  @Post('plants') createPlant(@Body() dto: CreateManufacturingPlantDto) { return this.commands.createPlant(dto); }
  @Get('production-lines') lines(@Query('status') status?: string, @Query('plantId') plantId?: string) { return this.queries.lines(status, plantId); }
  @Post('production-lines') createLine(@Body() dto: CreateProductionLineDto) { return this.commands.createProductionLine(dto); }
  @Get('events') events(@Query('eventType') eventType?: string, @Query('severity') severity?: string) { return this.queries.events(eventType, severity); }
  @Post('events') createEvent(@Body() dto: CreateManufacturingEventDto) { return this.commands.createEvent(dto); }

}

