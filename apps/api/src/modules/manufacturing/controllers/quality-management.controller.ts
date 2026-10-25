import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import {

  CreateQualityInspectionDto,
  CreateQualityIssueDto,

} from '../dto/manufacturing.dto';
import { ManufacturingCommandService } from '../manufacturing-command.service';
import { ManufacturingQueryService } from '../manufacturing-query.service';
import { ManufacturingService } from '../manufacturing.service';

@ApiTags('Quality Management')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'quality-management', version: '1' })
export class QualityManagementController {
  constructor(private readonly commands: ManufacturingCommandService, private readonly queries: ManufacturingQueryService, private readonly manufacturing: ManufacturingService) {}

  @Get('inspections') inspections(@Query('status') status?: string, @Query('result') result?: string) { return this.queries.inspections(status, result); }
  @Post('inspections') createInspection(@Body() dto: CreateQualityInspectionDto) { return this.commands.createQualityInspection(dto); }
  @Get('issues') issues(@Query('severity') severity?: string, @Query('status') status?: string) { return this.queries.qualityIssues(severity, status); }
  @Post('issues') createIssue(@Body() dto: CreateQualityIssueDto) { return this.commands.createQualityIssue(dto); }

}

