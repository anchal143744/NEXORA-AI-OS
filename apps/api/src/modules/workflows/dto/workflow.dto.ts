import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsObject, IsOptional, IsString } from 'class-validator';
import { WORKFLOW_TRIGGERS, WorkflowTriggerType } from '../contracts/workflow-definition.contract';
export class CreateWorkflowDto {
  @ApiProperty() @IsString() name!: string;
  @ApiProperty() @IsString() slug!: string;
  @ApiProperty({ enum: WORKFLOW_TRIGGERS }) @IsIn(WORKFLOW_TRIGGERS) triggerType!: WorkflowTriggerType;
  @ApiPropertyOptional() @IsOptional() @IsObject() triggerConfig?: Record<string, unknown>;
  @ApiProperty() @IsObject() graphDefinition!: Record<string, unknown>;
}
export class UpdateWorkflowDto {
  @ApiPropertyOptional() @IsOptional() @IsString() name?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() triggerConfig?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsObject() graphDefinition?: Record<string, unknown>;
}
export class ManualTriggerWorkflowDto { @ApiPropertyOptional() @IsOptional() @IsObject() input?: Record<string, unknown>; }
export class ApiTriggerWorkflowDto extends ManualTriggerWorkflowDto {}
export class WebhookTriggerWorkflowDto extends ManualTriggerWorkflowDto {}
