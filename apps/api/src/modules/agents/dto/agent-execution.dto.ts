import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsIn, IsObject, IsOptional, IsString } from 'class-validator';

export const FOUNDATION_AI_AGENTS = ['crm_agent','finance_agent','hr_agent','inventory_agent','project_agent','operations_agent','executive_agent','analytics_agent'] as const;
export const AGENT_CAPABILITIES = ['create_task','assign_task','generate_report','analyze_kpi','create_workflow','execute_workflow','create_crm_record','create_invoice','schedule_meeting','send_notification','trigger_automation','generate_insight'] as const;
export const RISK_LEVELS = ['low','medium','high','critical'] as const;
export const OUTCOME_STATUSES = ['success','failure','partial_success','cancelled','rejected','expired'] as const;

export class RegisterAgentDto {
  @ApiProperty({ enum: FOUNDATION_AI_AGENTS }) @IsIn(FOUNDATION_AI_AGENTS) agentKey!: string;
  @ApiProperty() @IsString() name!: string;
  @ApiProperty() @IsString() agentType!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() roleId?: string;
  @ApiPropertyOptional({ enum: AGENT_CAPABILITIES, isArray: true }) @IsOptional() @IsArray() capabilities?: string[];
  @ApiPropertyOptional() @IsOptional() @IsObject() riskPolicy?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsObject() configuration?: Record<string, unknown>;
}

export class CreateAgentRoleDto {
  @ApiProperty() @IsString() roleKey!: string;
  @ApiProperty() @IsString() name!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() description?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() approvalPolicy?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsArray() permissions?: string[];
}

export class CreateAgentCapabilityDto {
  @ApiProperty({ enum: AGENT_CAPABILITIES }) @IsIn(AGENT_CAPABILITIES) capabilityKey!: string;
  @ApiProperty() @IsString() name!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() description?: string;
  @ApiProperty({ enum: RISK_LEVELS }) @IsIn(RISK_LEVELS) riskLevel!: string;
  @ApiPropertyOptional() @IsOptional() requiresApproval?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsArray() allowedActions?: string[];
  @ApiPropertyOptional() @IsOptional() @IsObject() policy?: Record<string, unknown>;
}

export class PlanAgentExecutionDto {
  @ApiProperty({ enum: FOUNDATION_AI_AGENTS }) @IsIn(FOUNDATION_AI_AGENTS) agentKey!: string;
  @ApiProperty({ enum: AGENT_CAPABILITIES }) @IsIn(AGENT_CAPABILITIES) capabilityKey!: string;
  @ApiProperty() @IsString() actionType!: string;
  @ApiProperty() @IsString() objective!: string;
  @ApiProperty({ enum: RISK_LEVELS }) @IsIn(RISK_LEVELS) riskLevel!: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() input?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsObject() rollbackStrategy?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
}

export class DecideApprovalDto {
  @ApiProperty() @IsString() approvalId!: string;
  @ApiProperty({ enum: ['approved','rejected'] }) @IsIn(['approved','rejected']) status!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() decisionReason?: string;
}

export class CreateAgentTaskDto {
  @ApiProperty() @IsString() taskType!: string;
  @ApiProperty() @IsString() title!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() description?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() executionId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() assignedToUserId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() payload?: Record<string, unknown>;
}

export class CreateAgentWorkflowDto {
  @ApiProperty() @IsString() workflowKey!: string;
  @ApiProperty() @IsString() title!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() executionId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() trigger?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsArray() steps?: Record<string, unknown>[];
  @ApiPropertyOptional() @IsOptional() @IsObject() rollbackPlan?: Record<string, unknown>;
}

export class RecordOutcomeDto {
  @ApiProperty() @IsString() executionId!: string;
  @ApiProperty({ enum: OUTCOME_STATUSES }) @IsIn(OUTCOME_STATUSES) status!: string;
  @ApiProperty() @IsString() summary!: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() actualImpact?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsObject() metrics?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsObject() learnedMemory?: Record<string, unknown>;
}