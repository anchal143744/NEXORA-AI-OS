import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateEmployeeMasterRecordDto, CreateEmployeeMasterProfileDto, CreateEmployeeMasterIdentifierDto, CreateEmployeeMasterAssignmentDto } from '../dto/mdm.dto';
import { MdmAnalyticsService } from '../mdm-analytics.service';
import { MdmCommandService } from '../mdm-command.service';
import { MdmQueryService } from '../mdm-query.service';

@ApiTags('Employee Master')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'employee-master', version: '1' })
export class EmployeeMasterController {
  constructor(private readonly commands: MdmCommandService, private readonly queries: MdmQueryService, private readonly analytics: MdmAnalyticsService) {}

  @Get('dashboard') dashboard() {
    return this.analytics.dashboard('Employee Master');
  }

  @Get('records') listEmployeeMasterRecord(@Query('status') status?: string, @Query('domain') domain?: string, @Query('entityType') entityType?: string, @Query('qualityStatus') qualityStatus?: string, @Query('matchStatus') matchStatus?: string, @Query('governanceStatus') governanceStatus?: string, @Query('riskLevel') riskLevel?: string, @Query('goldenRecordId') goldenRecordId?: string, @Query('sourceSystemId') sourceSystemId?: string, @Query('stewardUserId') stewardUserId?: string, @Query('ownerUserId') ownerUserId?: string) {
    return this.queries.list('employeeMasterRecord', { status, domain, entityType, qualityStatus, matchStatus, governanceStatus, riskLevel, goldenRecordId, sourceSystemId, stewardUserId, ownerUserId });
  }

  @Post('records') createEmployeeMasterRecord(@Body() dto: CreateEmployeeMasterRecordDto) {
    return this.commands.create('employeeMasterRecord', dto);
  }

  @Get('profiles') listEmployeeMasterProfile(@Query('status') status?: string, @Query('domain') domain?: string, @Query('entityType') entityType?: string, @Query('qualityStatus') qualityStatus?: string, @Query('matchStatus') matchStatus?: string, @Query('governanceStatus') governanceStatus?: string, @Query('riskLevel') riskLevel?: string, @Query('goldenRecordId') goldenRecordId?: string, @Query('sourceSystemId') sourceSystemId?: string, @Query('stewardUserId') stewardUserId?: string, @Query('ownerUserId') ownerUserId?: string) {
    return this.queries.list('employeeMasterProfile', { status, domain, entityType, qualityStatus, matchStatus, governanceStatus, riskLevel, goldenRecordId, sourceSystemId, stewardUserId, ownerUserId });
  }

  @Post('profiles') createEmployeeMasterProfile(@Body() dto: CreateEmployeeMasterProfileDto) {
    return this.commands.create('employeeMasterProfile', dto);
  }

  @Get('identifiers') listEmployeeMasterIdentifier(@Query('status') status?: string, @Query('domain') domain?: string, @Query('entityType') entityType?: string, @Query('qualityStatus') qualityStatus?: string, @Query('matchStatus') matchStatus?: string, @Query('governanceStatus') governanceStatus?: string, @Query('riskLevel') riskLevel?: string, @Query('goldenRecordId') goldenRecordId?: string, @Query('sourceSystemId') sourceSystemId?: string, @Query('stewardUserId') stewardUserId?: string, @Query('ownerUserId') ownerUserId?: string) {
    return this.queries.list('employeeMasterIdentifier', { status, domain, entityType, qualityStatus, matchStatus, governanceStatus, riskLevel, goldenRecordId, sourceSystemId, stewardUserId, ownerUserId });
  }

  @Post('identifiers') createEmployeeMasterIdentifier(@Body() dto: CreateEmployeeMasterIdentifierDto) {
    return this.commands.create('employeeMasterIdentifier', dto);
  }

  @Get('assignments') listEmployeeMasterAssignment(@Query('status') status?: string, @Query('domain') domain?: string, @Query('entityType') entityType?: string, @Query('qualityStatus') qualityStatus?: string, @Query('matchStatus') matchStatus?: string, @Query('governanceStatus') governanceStatus?: string, @Query('riskLevel') riskLevel?: string, @Query('goldenRecordId') goldenRecordId?: string, @Query('sourceSystemId') sourceSystemId?: string, @Query('stewardUserId') stewardUserId?: string, @Query('ownerUserId') ownerUserId?: string) {
    return this.queries.list('employeeMasterAssignment', { status, domain, entityType, qualityStatus, matchStatus, governanceStatus, riskLevel, goldenRecordId, sourceSystemId, stewardUserId, ownerUserId });
  }

  @Post('assignments') createEmployeeMasterAssignment(@Body() dto: CreateEmployeeMasterAssignmentDto) {
    return this.commands.create('employeeMasterAssignment', dto);
  }
}
