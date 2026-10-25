import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import {

  CreateMaintenanceAssetDto,
  CreateMaintenancePredictionDto,

} from '../dto/manufacturing.dto';
import { ManufacturingCommandService } from '../manufacturing-command.service';
import { ManufacturingQueryService } from '../manufacturing-query.service';
import { ManufacturingService } from '../manufacturing.service';

@ApiTags('Predictive Maintenance')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'predictive-maintenance', version: '1' })
export class PredictiveMaintenanceController {
  constructor(private readonly commands: ManufacturingCommandService, private readonly queries: ManufacturingQueryService, private readonly manufacturing: ManufacturingService) {}

  @Get('assets') assets(@Query('status') status?: string, @Query('criticality') criticality?: string) { return this.queries.maintenanceAssets(status, criticality); }
  @Post('assets') createAsset(@Body() dto: CreateMaintenanceAssetDto) { return this.commands.createMaintenanceAsset(dto); }
  @Get('predictions') predictions(@Query('riskBand') riskBand?: string) { return this.queries.maintenancePredictions(riskBand); }
  @Post('predictions') createPrediction(@Body() dto: CreateMaintenancePredictionDto) { return this.commands.createMaintenancePrediction(dto); }

}

