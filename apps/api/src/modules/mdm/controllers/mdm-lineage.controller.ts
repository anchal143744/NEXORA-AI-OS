import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateMdmLineageRecordDto, CreateMdmLineageEventDto, CreateMdmSourceSystemDto, CreateMdmDataContractLinkDto } from '../dto/mdm.dto';
import { MdmAnalyticsService } from '../mdm-analytics.service';
import { MdmCommandService } from '../mdm-command.service';
import { MdmQueryService } from '../mdm-query.service';

@ApiTags('Data Lineage')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'mdm-lineage', version: '1' })
export class MdmLineageController {
  constructor(private readonly commands: MdmCommandService, private readonly queries: MdmQueryService, private readonly analytics: MdmAnalyticsService) {}

  @Get('dashboard') dashboard() {
    return this.analytics.dashboard('Data Lineage');
  }

  @Get('records') listMdmLineageRecord(@Query('status') status?: string, @Query('domain') domain?: string, @Query('entityType') entityType?: string, @Query('qualityStatus') qualityStatus?: string, @Query('matchStatus') matchStatus?: string, @Query('governanceStatus') governanceStatus?: string, @Query('riskLevel') riskLevel?: string, @Query('goldenRecordId') goldenRecordId?: string, @Query('sourceSystemId') sourceSystemId?: string, @Query('stewardUserId') stewardUserId?: string, @Query('ownerUserId') ownerUserId?: string) {
    return this.queries.list('mdmLineageRecord', { status, domain, entityType, qualityStatus, matchStatus, governanceStatus, riskLevel, goldenRecordId, sourceSystemId, stewardUserId, ownerUserId });
  }

  @Post('records') createMdmLineageRecord(@Body() dto: CreateMdmLineageRecordDto) {
    return this.commands.create('mdmLineageRecord', dto);
  }

  @Get('events') listMdmLineageEvent(@Query('status') status?: string, @Query('domain') domain?: string, @Query('entityType') entityType?: string, @Query('qualityStatus') qualityStatus?: string, @Query('matchStatus') matchStatus?: string, @Query('governanceStatus') governanceStatus?: string, @Query('riskLevel') riskLevel?: string, @Query('goldenRecordId') goldenRecordId?: string, @Query('sourceSystemId') sourceSystemId?: string, @Query('stewardUserId') stewardUserId?: string, @Query('ownerUserId') ownerUserId?: string) {
    return this.queries.list('mdmLineageEvent', { status, domain, entityType, qualityStatus, matchStatus, governanceStatus, riskLevel, goldenRecordId, sourceSystemId, stewardUserId, ownerUserId });
  }

  @Post('events') createMdmLineageEvent(@Body() dto: CreateMdmLineageEventDto) {
    return this.commands.create('mdmLineageEvent', dto);
  }

  @Get('source-systems') listMdmSourceSystem(@Query('status') status?: string, @Query('domain') domain?: string, @Query('entityType') entityType?: string, @Query('qualityStatus') qualityStatus?: string, @Query('matchStatus') matchStatus?: string, @Query('governanceStatus') governanceStatus?: string, @Query('riskLevel') riskLevel?: string, @Query('goldenRecordId') goldenRecordId?: string, @Query('sourceSystemId') sourceSystemId?: string, @Query('stewardUserId') stewardUserId?: string, @Query('ownerUserId') ownerUserId?: string) {
    return this.queries.list('mdmSourceSystem', { status, domain, entityType, qualityStatus, matchStatus, governanceStatus, riskLevel, goldenRecordId, sourceSystemId, stewardUserId, ownerUserId });
  }

  @Post('source-systems') createMdmSourceSystem(@Body() dto: CreateMdmSourceSystemDto) {
    return this.commands.create('mdmSourceSystem', dto);
  }

  @Get('data-contract-links') listMdmDataContractLink(@Query('status') status?: string, @Query('domain') domain?: string, @Query('entityType') entityType?: string, @Query('qualityStatus') qualityStatus?: string, @Query('matchStatus') matchStatus?: string, @Query('governanceStatus') governanceStatus?: string, @Query('riskLevel') riskLevel?: string, @Query('goldenRecordId') goldenRecordId?: string, @Query('sourceSystemId') sourceSystemId?: string, @Query('stewardUserId') stewardUserId?: string, @Query('ownerUserId') ownerUserId?: string) {
    return this.queries.list('mdmDataContractLink', { status, domain, entityType, qualityStatus, matchStatus, governanceStatus, riskLevel, goldenRecordId, sourceSystemId, stewardUserId, ownerUserId });
  }

  @Post('data-contract-links') createMdmDataContractLink(@Body() dto: CreateMdmDataContractLinkDto) {
    return this.commands.create('mdmDataContractLink', dto);
  }
}
