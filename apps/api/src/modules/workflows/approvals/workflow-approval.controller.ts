import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { DecideWorkflowApprovalDto, RequestWorkflowApprovalDto } from '../dto/workflow-builder.dto';
import { WorkflowApprovalService } from './workflow-approval.service';

@ApiTags('Workflow Approvals')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'workflow-approvals', version: '1' })
export class WorkflowApprovalController {
  constructor(private readonly approvals: WorkflowApprovalService) {}
  @Get() list(@Query('status') status?: string) { return this.approvals.list(status ?? 'pending'); }
  @Post() request(@Body() dto: RequestWorkflowApprovalDto) { return this.approvals.request(dto); }
  @Post(':id/decision') decide(@Param('id') id: string, @Body() dto: DecideWorkflowApprovalDto) { return this.approvals.decide(id, dto); }
}
