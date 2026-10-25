import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateCustomerMasterRecordDto, CreateCustomerMasterProfileDto, CreateCustomerMasterIdentifierDto, CreateCustomerMasterRelationshipDto } from '../dto/mdm.dto';
import { MdmAnalyticsService } from '../mdm-analytics.service';
import { MdmCommandService } from '../mdm-command.service';
import { MdmQueryService } from '../mdm-query.service';

@ApiTags('Customer Master')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'customer-master', version: '1' })
export class CustomerMasterController {
  constructor(private readonly commands: MdmCommandService, private readonly queries: MdmQueryService, private readonly analytics: MdmAnalyticsService) {}

  @Get('dashboard') dashboard() {
    return this.analytics.dashboard('Customer Master');
  }

  @Get('records') listCustomerMasterRecord(@Query('status') status?: string, @Query('domain') domain?: string, @Query('entityType') entityType?: string, @Query('qualityStatus') qualityStatus?: string, @Query('matchStatus') matchStatus?: string, @Query('governanceStatus') governanceStatus?: string, @Query('riskLevel') riskLevel?: string, @Query('goldenRecordId') goldenRecordId?: string, @Query('sourceSystemId') sourceSystemId?: string, @Query('stewardUserId') stewardUserId?: string, @Query('ownerUserId') ownerUserId?: string) {
    return this.queries.list('customerMasterRecord', { status, domain, entityType, qualityStatus, matchStatus, governanceStatus, riskLevel, goldenRecordId, sourceSystemId, stewardUserId, ownerUserId });
  }

  @Post('records') createCustomerMasterRecord(@Body() dto: CreateCustomerMasterRecordDto) {
    return this.commands.create('customerMasterRecord', dto);
  }

  @Get('profiles') listCustomerMasterProfile(@Query('status') status?: string, @Query('domain') domain?: string, @Query('entityType') entityType?: string, @Query('qualityStatus') qualityStatus?: string, @Query('matchStatus') matchStatus?: string, @Query('governanceStatus') governanceStatus?: string, @Query('riskLevel') riskLevel?: string, @Query('goldenRecordId') goldenRecordId?: string, @Query('sourceSystemId') sourceSystemId?: string, @Query('stewardUserId') stewardUserId?: string, @Query('ownerUserId') ownerUserId?: string) {
    return this.queries.list('customerMasterProfile', { status, domain, entityType, qualityStatus, matchStatus, governanceStatus, riskLevel, goldenRecordId, sourceSystemId, stewardUserId, ownerUserId });
  }

  @Post('profiles') createCustomerMasterProfile(@Body() dto: CreateCustomerMasterProfileDto) {
    return this.commands.create('customerMasterProfile', dto);
  }

  @Get('identifiers') listCustomerMasterIdentifier(@Query('status') status?: string, @Query('domain') domain?: string, @Query('entityType') entityType?: string, @Query('qualityStatus') qualityStatus?: string, @Query('matchStatus') matchStatus?: string, @Query('governanceStatus') governanceStatus?: string, @Query('riskLevel') riskLevel?: string, @Query('goldenRecordId') goldenRecordId?: string, @Query('sourceSystemId') sourceSystemId?: string, @Query('stewardUserId') stewardUserId?: string, @Query('ownerUserId') ownerUserId?: string) {
    return this.queries.list('customerMasterIdentifier', { status, domain, entityType, qualityStatus, matchStatus, governanceStatus, riskLevel, goldenRecordId, sourceSystemId, stewardUserId, ownerUserId });
  }

  @Post('identifiers') createCustomerMasterIdentifier(@Body() dto: CreateCustomerMasterIdentifierDto) {
    return this.commands.create('customerMasterIdentifier', dto);
  }

  @Get('relationships') listCustomerMasterRelationship(@Query('status') status?: string, @Query('domain') domain?: string, @Query('entityType') entityType?: string, @Query('qualityStatus') qualityStatus?: string, @Query('matchStatus') matchStatus?: string, @Query('governanceStatus') governanceStatus?: string, @Query('riskLevel') riskLevel?: string, @Query('goldenRecordId') goldenRecordId?: string, @Query('sourceSystemId') sourceSystemId?: string, @Query('stewardUserId') stewardUserId?: string, @Query('ownerUserId') ownerUserId?: string) {
    return this.queries.list('customerMasterRelationship', { status, domain, entityType, qualityStatus, matchStatus, governanceStatus, riskLevel, goldenRecordId, sourceSystemId, stewardUserId, ownerUserId });
  }

  @Post('relationships') createCustomerMasterRelationship(@Body() dto: CreateCustomerMasterRelationshipDto) {
    return this.commands.create('customerMasterRelationship', dto);
  }
}
