import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsBoolean, IsIn, IsNumber, IsObject, IsOptional, IsString, ValidateNested } from 'class-validator';

export const WORKFLOW_BUILDER_NODE_TYPES = ['trigger', 'condition', 'ai_decision', 'delay', 'approval', 'action', 'notification', 'webhook', 'crm', 'finance', 'hr', 'inventory'] as const;
export type WorkflowBuilderNodeType = (typeof WORKFLOW_BUILDER_NODE_TYPES)[number];

export class WorkflowNodeDto {
  @ApiProperty() @IsString() nodeKey!: string;
  @ApiProperty({ enum: WORKFLOW_BUILDER_NODE_TYPES }) @IsIn(WORKFLOW_BUILDER_NODE_TYPES) nodeType!: WorkflowBuilderNodeType;
  @ApiProperty() @IsString() label!: string;
  @ApiProperty() @IsObject() position!: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsObject() size?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsObject() configuration?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsObject() validation?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsString() groupKey?: string;
}

export class WorkflowEdgeDto {
  @ApiProperty() @IsString() edgeKey!: string;
  @ApiProperty() @IsString() sourceNodeKey!: string;
  @ApiProperty() @IsString() targetNodeKey!: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() condition?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsString() label?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() style?: Record<string, unknown>;
}

export class CreateWorkflowDefinitionDto {
  @ApiProperty() @IsString() name!: string;
  @ApiProperty() @IsString() slug!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() description?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() industry?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() templateId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() canvas?: Record<string, unknown>;
  @ApiPropertyOptional({ type: [WorkflowNodeDto] }) @IsOptional() @IsArray() @ValidateNested({ each: true }) @Type(() => WorkflowNodeDto) nodes?: WorkflowNodeDto[];
  @ApiPropertyOptional({ type: [WorkflowEdgeDto] }) @IsOptional() @IsArray() @ValidateNested({ each: true }) @Type(() => WorkflowEdgeDto) edges?: WorkflowEdgeDto[];
  @ApiPropertyOptional() @IsOptional() @IsArray() nodeGroups?: Record<string, unknown>[];
  @ApiPropertyOptional() @IsOptional() @IsObject() viewport?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class UpdateWorkflowDefinitionDto {
  @ApiPropertyOptional() @IsOptional() @IsString() name?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() description?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() canvas?: Record<string, unknown>;
  @ApiPropertyOptional({ type: [WorkflowNodeDto] }) @IsOptional() @IsArray() @ValidateNested({ each: true }) @Type(() => WorkflowNodeDto) nodes?: WorkflowNodeDto[];
  @ApiPropertyOptional({ type: [WorkflowEdgeDto] }) @IsOptional() @IsArray() @ValidateNested({ each: true }) @Type(() => WorkflowEdgeDto) edges?: WorkflowEdgeDto[];
  @ApiPropertyOptional() @IsOptional() @IsArray() nodeGroups?: Record<string, unknown>[];
  @ApiPropertyOptional() @IsOptional() @IsObject() viewport?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class CreateWorkflowTemplateDto {
  @ApiProperty() @IsString() industry!: string;
  @ApiProperty() @IsString() workflowKey!: string;
  @ApiProperty() @IsString() templateName!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() description?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() category?: string;
  @ApiProperty() @IsObject() template!: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsArray() nodePalette?: Record<string, unknown>[];
  @ApiPropertyOptional() @IsOptional() @IsObject() monitoringProfile?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() enabled?: boolean;
}

export class GenerateWorkflowDto {
  @ApiProperty() @IsString() instruction!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() industry?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() role?: string;
  @ApiPropertyOptional() @IsOptional() @IsArray() goals?: string[];
  @ApiPropertyOptional() @IsOptional() @IsObject() context?: Record<string, unknown>;
}

export class RecordWorkflowMetricDto {
  @ApiProperty() @IsString() metricKey!: string;
  @ApiProperty() @IsNumber() metricValue!: number;
  @ApiPropertyOptional() @IsOptional() @IsString() unit?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() workflowId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() workflowExecutionId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() dimensions?: Record<string, unknown>;
}

export class RequestWorkflowApprovalDto {
  @ApiProperty() @IsString() approvalType!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() workflowId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() workflowExecutionId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() nodeKey?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() approverRole?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() approverUserId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() expiresAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class DecideWorkflowApprovalDto {
  @ApiProperty({ enum: ['approved', 'rejected'] }) @IsIn(['approved', 'rejected']) decision!: 'approved' | 'rejected';
  @ApiPropertyOptional() @IsOptional() @IsString() reason?: string;
}
