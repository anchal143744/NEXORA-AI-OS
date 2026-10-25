import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { AssignDataOwnerDto, ClassifyDataDto, CreateDataAssetDto, CreateLineageDto, CreateQualityCheckDto } from '../dto/governance.dto';
import { DataGovernanceService } from './data-governance.service';

@ApiTags('Data Governance')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'data-governance', version: '1' })
export class DataGovernanceController {
  constructor(private readonly governance: DataGovernanceService) {}

  @Get('catalog') catalog(@Query('assetType') assetType?: string, @Query('classification') classification?: string) { return this.governance.catalog(assetType, classification); }
  @Post('catalog') createAsset(@Body() dto: CreateDataAssetDto) { return this.governance.createAsset(dto); }
  @Post('classifications') classify(@Body() dto: ClassifyDataDto) { return this.governance.classify(dto); }
  @Post('ownership') assignOwner(@Body() dto: AssignDataOwnerDto) { return this.governance.assignOwner(dto); }
  @Get('lineage') lineage(@Query('assetId') assetId?: string) { return this.governance.lineage(assetId); }
  @Post('lineage') createLineage(@Body() dto: CreateLineageDto) { return this.governance.createLineage(dto); }
  @Get('quality') quality(@Query('status') status?: string) { return this.governance.quality(status); }
  @Post('quality/checks') runQualityCheck(@Body() dto: CreateQualityCheckDto) { return this.governance.runQualityCheck(dto); }
}