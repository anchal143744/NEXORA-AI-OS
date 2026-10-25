import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateAssetLifecycleRecordDto, CreateAssetAssignmentDto, CreateAssetDepreciationPolicyDto } from '../dto/eam.dto';
import { EamAnalyticsService } from '../eam-analytics.service';
import { EamCommandService } from '../eam-command.service';
import { EamQueryService } from '../eam-query.service';

@ApiTags('Asset Lifecycle Management')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'asset-lifecycle', version: '1' })
export class AssetLifecycleController {
  constructor(private readonly commands: EamCommandService, private readonly queries: EamQueryService, private readonly analytics: EamAnalyticsService) {}

  @Get('dashboard') dashboard() {
    return this.analytics.dashboard('Asset Lifecycle Management');
  }

  @Get('lifecycle-records') listAssetLifecycleRecord(@Query('status') status?: string, @Query('assetId') assetId?: string, @Query('workOrderId') workOrderId?: string, @Query('locationId') locationId?: string, @Query('vendorId') vendorId?: string, @Query('riskLevel') riskLevel?: string, @Query('lifecycleStage') lifecycleStage?: string, @Query('conditionStatus') conditionStatus?: string) {
    return this.queries.list('assetLifecycleRecord', { status, assetId, workOrderId, locationId, vendorId, riskLevel, lifecycleStage, conditionStatus });
  }

  @Post('lifecycle-records') createAssetLifecycleRecord(@Body() dto: CreateAssetLifecycleRecordDto) {
    return this.commands.create('assetLifecycleRecord', dto);
  }

  @Get('assignments') listAssetAssignment(@Query('status') status?: string, @Query('assetId') assetId?: string, @Query('workOrderId') workOrderId?: string, @Query('locationId') locationId?: string, @Query('vendorId') vendorId?: string, @Query('riskLevel') riskLevel?: string, @Query('lifecycleStage') lifecycleStage?: string, @Query('conditionStatus') conditionStatus?: string) {
    return this.queries.list('assetAssignment', { status, assetId, workOrderId, locationId, vendorId, riskLevel, lifecycleStage, conditionStatus });
  }

  @Post('assignments') createAssetAssignment(@Body() dto: CreateAssetAssignmentDto) {
    return this.commands.create('assetAssignment', dto);
  }

  @Get('depreciation-policies') listAssetDepreciationPolicy(@Query('status') status?: string, @Query('assetId') assetId?: string, @Query('workOrderId') workOrderId?: string, @Query('locationId') locationId?: string, @Query('vendorId') vendorId?: string, @Query('riskLevel') riskLevel?: string, @Query('lifecycleStage') lifecycleStage?: string, @Query('conditionStatus') conditionStatus?: string) {
    return this.queries.list('assetDepreciationPolicy', { status, assetId, workOrderId, locationId, vendorId, riskLevel, lifecycleStage, conditionStatus });
  }

  @Post('depreciation-policies') createAssetDepreciationPolicy(@Body() dto: CreateAssetDepreciationPolicyDto) {
    return this.commands.create('assetDepreciationPolicy', dto);
  }
}

