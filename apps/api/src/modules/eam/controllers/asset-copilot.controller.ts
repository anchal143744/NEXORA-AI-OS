import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateAssetCopilotQueryDto, CreateAssetRecommendationDto, CreateAssetInsightDto } from '../dto/eam.dto';
import { EamAnalyticsService } from '../eam-analytics.service';
import { EamCommandService } from '../eam-command.service';
import { EamQueryService } from '../eam-query.service';

@ApiTags('AI Asset Copilot')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'asset-copilot', version: '1' })
export class AssetCopilotController {
  constructor(private readonly commands: EamCommandService, private readonly queries: EamQueryService, private readonly analytics: EamAnalyticsService) {}

  @Get('dashboard') dashboard() {
    return this.analytics.dashboard('AI Asset Copilot');
  }

  @Get('queries') listAssetCopilotQuery(@Query('status') status?: string, @Query('assetId') assetId?: string, @Query('workOrderId') workOrderId?: string, @Query('locationId') locationId?: string, @Query('vendorId') vendorId?: string, @Query('riskLevel') riskLevel?: string, @Query('lifecycleStage') lifecycleStage?: string, @Query('conditionStatus') conditionStatus?: string) {
    return this.queries.list('assetCopilotQuery', { status, assetId, workOrderId, locationId, vendorId, riskLevel, lifecycleStage, conditionStatus });
  }

  @Post('queries') createAssetCopilotQuery(@Body() dto: CreateAssetCopilotQueryDto) {
    return this.commands.create('assetCopilotQuery', dto);
  }

  @Get('recommendations') listAssetRecommendation(@Query('status') status?: string, @Query('assetId') assetId?: string, @Query('workOrderId') workOrderId?: string, @Query('locationId') locationId?: string, @Query('vendorId') vendorId?: string, @Query('riskLevel') riskLevel?: string, @Query('lifecycleStage') lifecycleStage?: string, @Query('conditionStatus') conditionStatus?: string) {
    return this.queries.list('assetRecommendation', { status, assetId, workOrderId, locationId, vendorId, riskLevel, lifecycleStage, conditionStatus });
  }

  @Post('recommendations') createAssetRecommendation(@Body() dto: CreateAssetRecommendationDto) {
    return this.commands.create('assetRecommendation', dto);
  }

  @Get('insights') listAssetInsight(@Query('status') status?: string, @Query('assetId') assetId?: string, @Query('workOrderId') workOrderId?: string, @Query('locationId') locationId?: string, @Query('vendorId') vendorId?: string, @Query('riskLevel') riskLevel?: string, @Query('lifecycleStage') lifecycleStage?: string, @Query('conditionStatus') conditionStatus?: string) {
    return this.queries.list('assetInsight', { status, assetId, workOrderId, locationId, vendorId, riskLevel, lifecycleStage, conditionStatus });
  }

  @Post('insights') createAssetInsight(@Body() dto: CreateAssetInsightDto) {
    return this.commands.create('assetInsight', dto);
  }
}

