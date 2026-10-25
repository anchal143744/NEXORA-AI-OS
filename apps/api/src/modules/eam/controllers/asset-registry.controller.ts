import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateEnterpriseAssetDto, CreateAssetCategoryDto, CreateAssetLocationDto, CreateAssetTagDto } from '../dto/eam.dto';
import { EamAnalyticsService } from '../eam-analytics.service';
import { EamCommandService } from '../eam-command.service';
import { EamQueryService } from '../eam-query.service';

@ApiTags('Asset Registry')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'asset-registry', version: '1' })
export class AssetRegistryController {
  constructor(private readonly commands: EamCommandService, private readonly queries: EamQueryService, private readonly analytics: EamAnalyticsService) {}

  @Get('dashboard') dashboard() {
    return this.analytics.dashboard('Asset Registry');
  }

  @Get('assets') listEnterpriseAsset(@Query('status') status?: string, @Query('assetId') assetId?: string, @Query('workOrderId') workOrderId?: string, @Query('locationId') locationId?: string, @Query('vendorId') vendorId?: string, @Query('riskLevel') riskLevel?: string, @Query('lifecycleStage') lifecycleStage?: string, @Query('conditionStatus') conditionStatus?: string) {
    return this.queries.list('enterpriseAsset', { status, assetId, workOrderId, locationId, vendorId, riskLevel, lifecycleStage, conditionStatus });
  }

  @Post('assets') createEnterpriseAsset(@Body() dto: CreateEnterpriseAssetDto) {
    return this.commands.create('enterpriseAsset', dto);
  }

  @Get('categories') listAssetCategory(@Query('status') status?: string, @Query('assetId') assetId?: string, @Query('workOrderId') workOrderId?: string, @Query('locationId') locationId?: string, @Query('vendorId') vendorId?: string, @Query('riskLevel') riskLevel?: string, @Query('lifecycleStage') lifecycleStage?: string, @Query('conditionStatus') conditionStatus?: string) {
    return this.queries.list('assetCategory', { status, assetId, workOrderId, locationId, vendorId, riskLevel, lifecycleStage, conditionStatus });
  }

  @Post('categories') createAssetCategory(@Body() dto: CreateAssetCategoryDto) {
    return this.commands.create('assetCategory', dto);
  }

  @Get('locations') listAssetLocation(@Query('status') status?: string, @Query('assetId') assetId?: string, @Query('workOrderId') workOrderId?: string, @Query('locationId') locationId?: string, @Query('vendorId') vendorId?: string, @Query('riskLevel') riskLevel?: string, @Query('lifecycleStage') lifecycleStage?: string, @Query('conditionStatus') conditionStatus?: string) {
    return this.queries.list('assetLocation', { status, assetId, workOrderId, locationId, vendorId, riskLevel, lifecycleStage, conditionStatus });
  }

  @Post('locations') createAssetLocation(@Body() dto: CreateAssetLocationDto) {
    return this.commands.create('assetLocation', dto);
  }

  @Get('tags') listAssetTag(@Query('status') status?: string, @Query('assetId') assetId?: string, @Query('workOrderId') workOrderId?: string, @Query('locationId') locationId?: string, @Query('vendorId') vendorId?: string, @Query('riskLevel') riskLevel?: string, @Query('lifecycleStage') lifecycleStage?: string, @Query('conditionStatus') conditionStatus?: string) {
    return this.queries.list('assetTag', { status, assetId, workOrderId, locationId, vendorId, riskLevel, lifecycleStage, conditionStatus });
  }

  @Post('tags') createAssetTag(@Body() dto: CreateAssetTagDto) {
    return this.commands.create('assetTag', dto);
  }
}

