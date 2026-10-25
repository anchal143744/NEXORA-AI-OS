import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateAssetIotDeviceDto, CreateAssetIotTelemetryDto, CreateAssetIotAlertDto, CreateAssetSensorCalibrationDto } from '../dto/eam.dto';
import { EamAnalyticsService } from '../eam-analytics.service';
import { EamCommandService } from '../eam-command.service';
import { EamQueryService } from '../eam-query.service';

@ApiTags('IoT Asset Monitoring Foundation')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'iot-assets', version: '1' })
export class IotAssetsController {
  constructor(private readonly commands: EamCommandService, private readonly queries: EamQueryService, private readonly analytics: EamAnalyticsService) {}

  @Get('dashboard') dashboard() {
    return this.analytics.dashboard('IoT Asset Monitoring Foundation');
  }

  @Get('iot-devices') listAssetIotDevice(@Query('status') status?: string, @Query('assetId') assetId?: string, @Query('workOrderId') workOrderId?: string, @Query('locationId') locationId?: string, @Query('vendorId') vendorId?: string, @Query('riskLevel') riskLevel?: string, @Query('lifecycleStage') lifecycleStage?: string, @Query('conditionStatus') conditionStatus?: string) {
    return this.queries.list('assetIotDevice', { status, assetId, workOrderId, locationId, vendorId, riskLevel, lifecycleStage, conditionStatus });
  }

  @Post('iot-devices') createAssetIotDevice(@Body() dto: CreateAssetIotDeviceDto) {
    return this.commands.create('assetIotDevice', dto);
  }

  @Get('iot-telemetry') listAssetIotTelemetry(@Query('status') status?: string, @Query('assetId') assetId?: string, @Query('workOrderId') workOrderId?: string, @Query('locationId') locationId?: string, @Query('vendorId') vendorId?: string, @Query('riskLevel') riskLevel?: string, @Query('lifecycleStage') lifecycleStage?: string, @Query('conditionStatus') conditionStatus?: string) {
    return this.queries.list('assetIotTelemetry', { status, assetId, workOrderId, locationId, vendorId, riskLevel, lifecycleStage, conditionStatus });
  }

  @Post('iot-telemetry') createAssetIotTelemetry(@Body() dto: CreateAssetIotTelemetryDto) {
    return this.commands.create('assetIotTelemetry', dto);
  }

  @Get('iot-alerts') listAssetIotAlert(@Query('status') status?: string, @Query('assetId') assetId?: string, @Query('workOrderId') workOrderId?: string, @Query('locationId') locationId?: string, @Query('vendorId') vendorId?: string, @Query('riskLevel') riskLevel?: string, @Query('lifecycleStage') lifecycleStage?: string, @Query('conditionStatus') conditionStatus?: string) {
    return this.queries.list('assetIotAlert', { status, assetId, workOrderId, locationId, vendorId, riskLevel, lifecycleStage, conditionStatus });
  }

  @Post('iot-alerts') createAssetIotAlert(@Body() dto: CreateAssetIotAlertDto) {
    return this.commands.create('assetIotAlert', dto);
  }

  @Get('sensor-calibrations') listAssetSensorCalibration(@Query('status') status?: string, @Query('assetId') assetId?: string, @Query('workOrderId') workOrderId?: string, @Query('locationId') locationId?: string, @Query('vendorId') vendorId?: string, @Query('riskLevel') riskLevel?: string, @Query('lifecycleStage') lifecycleStage?: string, @Query('conditionStatus') conditionStatus?: string) {
    return this.queries.list('assetSensorCalibration', { status, assetId, workOrderId, locationId, vendorId, riskLevel, lifecycleStage, conditionStatus });
  }

  @Post('sensor-calibrations') createAssetSensorCalibration(@Body() dto: CreateAssetSensorCalibrationDto) {
    return this.commands.create('assetSensorCalibration', dto);
  }
}

