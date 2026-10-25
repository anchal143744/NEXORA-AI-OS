import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AgentApprovalService } from './approvals/agent-approval.service';
import { AgentAuditTrailService } from './audit/agent-audit-trail.service';
import { AgentExecutionLayerService } from './execution/agent-execution-layer.service';
import { AgentGovernanceService } from './governance/agent-governance.service';
import { AgentOutcomeService } from './outcomes/agent-outcome.service';
import { AgentTaskWorkflowService } from './tasks/agent-task-workflow.service';
import { CreateAgentCapabilityDto, CreateAgentRoleDto, CreateAgentTaskDto, CreateAgentWorkflowDto, DecideApprovalDto, PlanAgentExecutionDto, RecordOutcomeDto, RegisterAgentDto } from './dto/agent-execution.dto';

@ApiTags('Autonomous AI Agents Execution')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'agents', version: '1' })
export class AgentExecutionLayerController {
  constructor(private readonly governance: AgentGovernanceService, private readonly executions: AgentExecutionLayerService, private readonly tasks: AgentTaskWorkflowService, private readonly approvals: AgentApprovalService, private readonly outcomes: AgentOutcomeService, private readonly audit: AgentAuditTrailService) {}

  @Get() listAgents() { return this.governance.listAgents(); }
  @Post() registerAgent(@Body() dto: RegisterAgentDto) { return this.governance.registerAgent(dto); }
  @Post('bootstrap') bootstrapFoundationAgents() { return this.governance.bootstrapFoundationAgents(); }
  @Get('roles') listRoles() { return this.governance.listRoles(); }
  @Post('roles') createRole(@Body() dto: CreateAgentRoleDto) { return this.governance.createRole(dto); }
  @Get('capabilities') listCapabilities() { return this.governance.listCapabilities(); }
  @Post('capabilities') createCapability(@Body() dto: CreateAgentCapabilityDto) { return this.governance.createCapability(dto); }

  @Get('executions') listExecutions(@Query('status') status?: string) { return this.executions.list(status); }
  @Post('executions') planExecution(@Body() dto: PlanAgentExecutionDto) { return this.executions.plan(dto); }
  @Get('executions/:id') getExecution(@Param('id') id: string) { return this.executions.getExecution(id); }
  @Post('executions/:id/execute') execute(@Param('id') id: string) { return this.executions.execute(id); }
  @Post('executions/:id/retry') retry(@Param('id') id: string) { return this.executions.retry(id); }
  @Post('executions/:id/rollback') rollback(@Param('id') id: string) { return this.executions.rollback(id); }

  @Get('tasks') listTasks(@Query('status') status?: string) { return this.tasks.listTasks(status); }
  @Post('tasks') createTask(@Body() dto: CreateAgentTaskDto) { return this.tasks.createTask(dto); }
  @Get('workflows') listWorkflows(@Query('status') status?: string) { return this.tasks.listWorkflows(status); }
  @Post('workflows') createWorkflow(@Body() dto: CreateAgentWorkflowDto) { return this.tasks.createWorkflow(dto); }

  @Get('approvals') listApprovals(@Query('executionId') executionId?: string) { return this.approvals.list(executionId); }
  @Post('approvals/decide') decideApproval(@Body() dto: DecideApprovalDto) { return this.approvals.decide(dto); }
  @Get('outcomes') listOutcomes(@Query('executionId') executionId?: string) { return this.outcomes.list(executionId); }
  @Post('outcomes') recordOutcome(@Body() dto: RecordOutcomeDto) { return this.outcomes.record(dto); }
  @Get('audit') listAudit(@Query('executionId') executionId?: string) { return this.audit.list(executionId); }
}