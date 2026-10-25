import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateVendorMasterRecordDto, CreateVendorMasterProfileDto, CreateVendorMasterIdentifierDto, CreateVendorMasterRelationshipDto } from '../dto/mdm.dto';
import { MdmAnalyticsService } from '../mdm-analytics.service';
import { MdmCommandService } from '../mdm-command.service';
import { MdmQueryService } from '../mdm-query.service';

@ApiTags('Vendor Master')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'vendor-master', version: '1' })
export class VendorMasterController {
  constructor(private readonly commands: MdmCommandService, private readonly queries: MdmQueryService, private readonly analytics: MdmAnalyticsService) {}

  @Get('dashboard') dashboard() {
    return this.analytics.dashboard('Vendor Master');
  }

  @Get('records') listVendorMasterRecord(@Query('status') status?: string, @Query('domain') domain?: string, @Query('entityType') entityType?: string, @Query('qualityStatus') qualityStatus?: string, @Query('matchStatus') matchStatus?: string, @Query('governanceStatus') governanceStatus?: string, @Query('riskLevel') riskLevel?: string, @Query('goldenRecordId') goldenRecordId?: string, @Query('sourceSystemId') sourceSystemId?: string, @Query('stewardUserId') stewardUserId?: string, @Query('ownerUserId') ownerUserId?: string) {
    return this.queries.list('vendorMasterRecord', { status, domain, entityType, qualityStatus, matchStatus, governanceStatus, riskLevel, goldenRecordId, sourceSystemId, stewardUserId, ownerUserId });
  }

  @Post('records') createVendorMasterRecord(@Body() dto: CreateVendorMasterRecordDto) {
    return this.commands.create('vendorMasterRecord', dto);
  }

  @Get('profiles') listVendorMasterProfile(@Query('status') status?: string, @Query('domain') domain?: string, @Query('entityType') entityType?: string, @Query('qualityStatus') qualityStatus?: string, @Query('matchStatus') matchStatus?: string, @Query('governanceStatus') governanceStatus?: string, @Query('riskLevel') riskLevel?: string, @Query('goldenRecordId') goldenRecordId?: string, @Query('sourceSystemId') sourceSystemId?: string, @Query('stewardUserId') stewardUserId?: string, @Query('ownerUserId') ownerUserId?: string) {
    return this.queries.list('vendorMasterProfile', { status, domain, entityType, qualityStatus, matchStatus, governanceStatus, riskLevel, goldenRecordId, sourceSystemId, stewardUserId, ownerUserId });
  }

  @Post('profiles') createVendorMasterProfile(@Body() dto: CreateVendorMasterProfileDto) {
    return this.commands.create('vendorMasterProfile', dto);
  }

  @Get('identifiers') listVendorMasterIdentifier(@Query('status') status?: string, @Query('domain') domain?: string, @Query('entityType') entityType?: string, @Query('qualityStatus') qualityStatus?: string, @Query('matchStatus') matchStatus?: string, @Query('governanceStatus') governanceStatus?: string, @Query('riskLevel') riskLevel?: string, @Query('goldenRecordId') goldenRecordId?: string, @Query('sourceSystemId') sourceSystemId?: string, @Query('stewardUserId') stewardUserId?: string, @Query('ownerUserId') ownerUserId?: string) {
    return this.queries.list('vendorMasterIdentifier', { status, domain, entityType, qualityStatus, matchStatus, governanceStatus, riskLevel, goldenRecordId, sourceSystemId, stewardUserId, ownerUserId });
  }

  @Post('identifiers') createVendorMasterIdentifier(@Body() dto: CreateVendorMasterIdentifierDto) {
    return this.commands.create('vendorMasterIdentifier', dto);
  }

  @Get('relationships') listVendorMasterRelationship(@Query('status') status?: string, @Query('domain') domain?: string, @Query('entityType') entityType?: string, @Query('qualityStatus') qualityStatus?: string, @Query('matchStatus') matchStatus?: string, @Query('governanceStatus') governanceStatus?: string, @Query('riskLevel') riskLevel?: string, @Query('goldenRecordId') goldenRecordId?: string, @Query('sourceSystemId') sourceSystemId?: string, @Query('stewardUserId') stewardUserId?: string, @Query('ownerUserId') ownerUserId?: string) {
    return this.queries.list('vendorMasterRelationship', { status, domain, entityType, qualityStatus, matchStatus, governanceStatus, riskLevel, goldenRecordId, sourceSystemId, stewardUserId, ownerUserId });
  }

  @Post('relationships') createVendorMasterRelationship(@Body() dto: CreateVendorMasterRelationshipDto) {
    return this.commands.create('vendorMasterRelationship', dto);
  }
}
