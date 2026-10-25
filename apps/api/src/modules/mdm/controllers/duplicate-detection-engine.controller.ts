import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateMdmDuplicateRuleDto, CreateMdmDuplicateCandidateDto, CreateMdmDuplicateClusterDto, CreateMdmDuplicateReviewDto } from '../dto/mdm.dto';
import { MdmAnalyticsService } from '../mdm-analytics.service';
import { MdmCommandService } from '../mdm-command.service';
import { MdmQueryService } from '../mdm-query.service';

@ApiTags('Duplicate Detection Engine')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'duplicate-detection', version: '1' })
export class DuplicateDetectionEngineController {
  constructor(private readonly commands: MdmCommandService, private readonly queries: MdmQueryService, private readonly analytics: MdmAnalyticsService) {}

  @Get('dashboard') dashboard() {
    return this.analytics.dashboard('Duplicate Detection Engine');
  }

  @Get('rules') listMdmDuplicateRule(@Query('status') status?: string, @Query('domain') domain?: string, @Query('entityType') entityType?: string, @Query('qualityStatus') qualityStatus?: string, @Query('matchStatus') matchStatus?: string, @Query('governanceStatus') governanceStatus?: string, @Query('riskLevel') riskLevel?: string, @Query('goldenRecordId') goldenRecordId?: string, @Query('sourceSystemId') sourceSystemId?: string, @Query('stewardUserId') stewardUserId?: string, @Query('ownerUserId') ownerUserId?: string) {
    return this.queries.list('mdmDuplicateRule', { status, domain, entityType, qualityStatus, matchStatus, governanceStatus, riskLevel, goldenRecordId, sourceSystemId, stewardUserId, ownerUserId });
  }

  @Post('rules') createMdmDuplicateRule(@Body() dto: CreateMdmDuplicateRuleDto) {
    return this.commands.create('mdmDuplicateRule', dto);
  }

  @Get('candidates') listMdmDuplicateCandidate(@Query('status') status?: string, @Query('domain') domain?: string, @Query('entityType') entityType?: string, @Query('qualityStatus') qualityStatus?: string, @Query('matchStatus') matchStatus?: string, @Query('governanceStatus') governanceStatus?: string, @Query('riskLevel') riskLevel?: string, @Query('goldenRecordId') goldenRecordId?: string, @Query('sourceSystemId') sourceSystemId?: string, @Query('stewardUserId') stewardUserId?: string, @Query('ownerUserId') ownerUserId?: string) {
    return this.queries.list('mdmDuplicateCandidate', { status, domain, entityType, qualityStatus, matchStatus, governanceStatus, riskLevel, goldenRecordId, sourceSystemId, stewardUserId, ownerUserId });
  }

  @Post('candidates') createMdmDuplicateCandidate(@Body() dto: CreateMdmDuplicateCandidateDto) {
    return this.commands.create('mdmDuplicateCandidate', dto);
  }

  @Get('clusters') listMdmDuplicateCluster(@Query('status') status?: string, @Query('domain') domain?: string, @Query('entityType') entityType?: string, @Query('qualityStatus') qualityStatus?: string, @Query('matchStatus') matchStatus?: string, @Query('governanceStatus') governanceStatus?: string, @Query('riskLevel') riskLevel?: string, @Query('goldenRecordId') goldenRecordId?: string, @Query('sourceSystemId') sourceSystemId?: string, @Query('stewardUserId') stewardUserId?: string, @Query('ownerUserId') ownerUserId?: string) {
    return this.queries.list('mdmDuplicateCluster', { status, domain, entityType, qualityStatus, matchStatus, governanceStatus, riskLevel, goldenRecordId, sourceSystemId, stewardUserId, ownerUserId });
  }

  @Post('clusters') createMdmDuplicateCluster(@Body() dto: CreateMdmDuplicateClusterDto) {
    return this.commands.create('mdmDuplicateCluster', dto);
  }

  @Get('reviews') listMdmDuplicateReview(@Query('status') status?: string, @Query('domain') domain?: string, @Query('entityType') entityType?: string, @Query('qualityStatus') qualityStatus?: string, @Query('matchStatus') matchStatus?: string, @Query('governanceStatus') governanceStatus?: string, @Query('riskLevel') riskLevel?: string, @Query('goldenRecordId') goldenRecordId?: string, @Query('sourceSystemId') sourceSystemId?: string, @Query('stewardUserId') stewardUserId?: string, @Query('ownerUserId') ownerUserId?: string) {
    return this.queries.list('mdmDuplicateReview', { status, domain, entityType, qualityStatus, matchStatus, governanceStatus, riskLevel, goldenRecordId, sourceSystemId, stewardUserId, ownerUserId });
  }

  @Post('reviews') createMdmDuplicateReview(@Body() dto: CreateMdmDuplicateReviewDto) {
    return this.commands.create('mdmDuplicateReview', dto);
  }
}
