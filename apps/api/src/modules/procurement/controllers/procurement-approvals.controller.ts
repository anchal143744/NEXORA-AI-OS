
import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateProcurementApprovalDto } from '../dto/procurement.dto';
import { ProcurementWorkflowService } from '../procurement-workflow.service';

@ApiTags('Procurement Approvals')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'procurement-approvals', version: '1' })
export class ProcurementApprovalsController {
  constructor(private readonly workflow: ProcurementWorkflowService) {}
  @Get('dashboard') dashboard() { return this.workflow.dashboard(); }
  @Get() list(@Query('status') status?: string, @Query('riskLevel') riskLevel?: string, @Query('procurementRequestId') procurementRequestId?: string) { return this.workflow.approvals(status, riskLevel, procurementRequestId); }
  @Post() create(@Body() dto: CreateProcurementApprovalDto) { return this.workflow.createApproval(dto); }
}
