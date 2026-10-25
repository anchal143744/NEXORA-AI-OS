import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import {

  CreateDigitalTwinModelDto,
  CreateDigitalTwinSnapshotDto,

} from '../dto/manufacturing.dto';
import { ManufacturingCommandService } from '../manufacturing-command.service';
import { ManufacturingQueryService } from '../manufacturing-query.service';
import { ManufacturingService } from '../manufacturing.service';

@ApiTags('Digital Twin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'digital-twin', version: '1' })
export class DigitalTwinController {
  constructor(private readonly commands: ManufacturingCommandService, private readonly queries: ManufacturingQueryService, private readonly manufacturing: ManufacturingService) {}

  @Get('models') models(@Query('status') status?: string, @Query('twinType') twinType?: string) { return this.queries.twinModels(status, twinType); }
  @Post('models') createModel(@Body() dto: CreateDigitalTwinModelDto) { return this.commands.createDigitalTwinModel(dto); }
  @Get('snapshots') snapshots(@Query('status') status?: string, @Query('digitalTwinModelId') digitalTwinModelId?: string) { return this.queries.twinSnapshots(status, digitalTwinModelId); }
  @Post('snapshots') createSnapshot(@Body() dto: CreateDigitalTwinSnapshotDto) { return this.commands.createDigitalTwinSnapshot(dto); }

}

