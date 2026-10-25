import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateAIModelDeploymentDto, CreateModelApprovalWorkflowDto, DecideModelApprovalDto } from '../dto/ai-governance.dto';
import { ModelOpsService } from '../modelops.service';

@ApiTags('ModelOps')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'modelops', version: '1' })
export class ModelOpsController {
  constructor(private readonly modelOps: ModelOpsService) {}

  @Get('lifecycle') lifecycle() { return this.modelOps.lifecycle(); }
  @Get('deployments') deployments(@Query('environment') environment?: string, @Query('status') status?: string, @Query('healthStatus') healthStatus?: string) { return this.modelOps.deployments(environment, status, healthStatus); }
  @Post('deployments') createDeployment(@Body() dto: CreateAIModelDeploymentDto) { return this.modelOps.createDeployment(dto); }
  @Get('approval-workflows') approvals(@Query('status') status?: string, @Query('workflowType') workflowType?: string, @Query('riskTier') riskTier?: string) { return this.modelOps.approvals(status, workflowType, riskTier); }
  @Post('approval-workflows') createApproval(@Body() dto: CreateModelApprovalWorkflowDto) { return this.modelOps.createApprovalWorkflow(dto); }
  @Post('approval-workflows/:id/decision') decide(@Param('id') id: string, @Body() dto: DecideModelApprovalDto) { return this.modelOps.decideApprovalWorkflow(id, dto); }
}