import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateAssetCostRecordDto, CreateAssetBudgetDto, CreateAssetTcoSnapshotDto, CreateAssetCostOptimizationDto } from '../dto/eam.dto';
import { EamAnalyticsService } from '../eam-analytics.service';
import { EamCommandService } from '../eam-command.service';
import { EamQueryService } from '../eam-query.service';

@ApiTags('Asset Cost Intelligence')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'asset-costs', version: '1' })
export class AssetCostsController {
  constructor(private readonly commands: EamCommandService, private readonly queries: EamQueryService, private readonly analytics: EamAnalyticsService) {}

  @Get('dashboard') dashboard() {
    return this.analytics.dashboard('Asset Cost Intelligence');
  }

  @Get('cost-records') listAssetCostRecord(@Query('status') status?: string, @Query('assetId') assetId?: string, @Query('workOrderId') workOrderId?: string, @Query('locationId') locationId?: string, @Query('vendorId') vendorId?: string, @Query('riskLevel') riskLevel?: string, @Query('lifecycleStage') lifecycleStage?: string, @Query('conditionStatus') conditionStatus?: string) {
    return this.queries.list('assetCostRecord', { status, assetId, workOrderId, locationId, vendorId, riskLevel, lifecycleStage, conditionStatus });
  }

  @Post('cost-records') createAssetCostRecord(@Body() dto: CreateAssetCostRecordDto) {
    return this.commands.create('assetCostRecord', dto);
  }

  @Get('budgets') listAssetBudget(@Query('status') status?: string, @Query('assetId') assetId?: string, @Query('workOrderId') workOrderId?: string, @Query('locationId') locationId?: string, @Query('vendorId') vendorId?: string, @Query('riskLevel') riskLevel?: string, @Query('lifecycleStage') lifecycleStage?: string, @Query('conditionStatus') conditionStatus?: string) {
    return this.queries.list('assetBudget', { status, assetId, workOrderId, locationId, vendorId, riskLevel, lifecycleStage, conditionStatus });
  }

  @Post('budgets') createAssetBudget(@Body() dto: CreateAssetBudgetDto) {
    return this.commands.create('assetBudget', dto);
  }

  @Get('tco-snapshots') listAssetTcoSnapshot(@Query('status') status?: string, @Query('assetId') assetId?: string, @Query('workOrderId') workOrderId?: string, @Query('locationId') locationId?: string, @Query('vendorId') vendorId?: string, @Query('riskLevel') riskLevel?: string, @Query('lifecycleStage') lifecycleStage?: string, @Query('conditionStatus') conditionStatus?: string) {
    return this.queries.list('assetTcoSnapshot', { status, assetId, workOrderId, locationId, vendorId, riskLevel, lifecycleStage, conditionStatus });
  }

  @Post('tco-snapshots') createAssetTcoSnapshot(@Body() dto: CreateAssetTcoSnapshotDto) {
    return this.commands.create('assetTcoSnapshot', dto);
  }

  @Get('cost-optimizations') listAssetCostOptimization(@Query('status') status?: string, @Query('assetId') assetId?: string, @Query('workOrderId') workOrderId?: string, @Query('locationId') locationId?: string, @Query('vendorId') vendorId?: string, @Query('riskLevel') riskLevel?: string, @Query('lifecycleStage') lifecycleStage?: string, @Query('conditionStatus') conditionStatus?: string) {
    return this.queries.list('assetCostOptimization', { status, assetId, workOrderId, locationId, vendorId, riskLevel, lifecycleStage, conditionStatus });
  }

  @Post('cost-optimizations') createAssetCostOptimization(@Body() dto: CreateAssetCostOptimizationDto) {
    return this.commands.create('assetCostOptimization', dto);
  }
}

