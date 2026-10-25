import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsDateString, IsEmail, IsIn, IsNumber, IsOptional, IsString, IsUUID, Max, Min } from 'class-validator';

export const CRM_OPPORTUNITY_STAGES = ['lead', 'qualified', 'discovery', 'proposal', 'negotiation', 'closed_won', 'closed_lost'] as const;
export const CRM_LEAD_STATUSES = ['new', 'assigned', 'qualified', 'nurture', 'converted', 'disqualified'] as const;
export const CRM_RISK_LEVELS = ['low', 'medium', 'high'] as const;

export class CreateLeadDto {
  @ApiProperty() @IsString() firstName!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() lastName?: string;
  @ApiPropertyOptional() @IsOptional() @IsEmail() email?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() phone?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() company?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() source?: string;
  @ApiPropertyOptional({ enum: CRM_LEAD_STATUSES }) @IsOptional() @IsIn(CRM_LEAD_STATUSES) status?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() role?: string;
  @ApiPropertyOptional() @IsOptional() @IsUUID() ownerUserId?: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() @Min(0) @Max(100) score?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() @Min(0) conversionProbability?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() @Min(0) estimatedValue?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() nextBestAction?: string;
  @ApiPropertyOptional({ type: [String] }) @IsOptional() @IsArray() @IsString({ each: true }) tags?: string[];
}

export class UpdateLeadDto {
  @ApiPropertyOptional() @IsOptional() @IsString() firstName?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() lastName?: string;
  @ApiPropertyOptional() @IsOptional() @IsEmail() email?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() phone?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() company?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() source?: string;
  @ApiPropertyOptional({ enum: CRM_LEAD_STATUSES }) @IsOptional() @IsIn(CRM_LEAD_STATUSES) status?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() role?: string;
  @ApiPropertyOptional() @IsOptional() @IsUUID() ownerUserId?: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() @Min(0) @Max(100) score?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() @Min(0) conversionProbability?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() @Min(0) estimatedValue?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() nextBestAction?: string;
  @ApiPropertyOptional({ type: [String] }) @IsOptional() @IsArray() @IsString({ each: true }) tags?: string[];
}

export class CreateCustomerDto {
  @ApiProperty() @IsString() name!: string;
  @ApiPropertyOptional() @IsOptional() @IsEmail() email?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() phone?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() company?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() lifecycleStage?: string;
  @ApiPropertyOptional() @IsOptional() @IsUUID() ownerUserId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() title?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() industry?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() region?: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() @Min(0) @Max(100) healthScore?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() @Min(0) annualRevenue?: number;
  @ApiPropertyOptional({ type: [String] }) @IsOptional() @IsArray() @IsString({ each: true }) tags?: string[];
  @ApiPropertyOptional({ type: [String] }) @IsOptional() @IsArray() @IsString({ each: true }) communicationHistory?: string[];
}

export class UpdateCustomerDto {
  @ApiPropertyOptional() @IsOptional() @IsString() name?: string;
  @ApiPropertyOptional() @IsOptional() @IsEmail() email?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() phone?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() company?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() lifecycleStage?: string;
  @ApiPropertyOptional() @IsOptional() @IsUUID() ownerUserId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() title?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() industry?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() region?: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() @Min(0) @Max(100) healthScore?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() @Min(0) annualRevenue?: number;
  @ApiPropertyOptional({ type: [String] }) @IsOptional() @IsArray() @IsString({ each: true }) tags?: string[];
  @ApiPropertyOptional({ type: [String] }) @IsOptional() @IsArray() @IsString({ each: true }) communicationHistory?: string[];
}

export class CreatePipelineDto {
  @ApiProperty() @IsString() name!: string;
}

export class CreateOpportunityDto {
  @ApiProperty() @IsString() name!: string;
  @ApiPropertyOptional() @IsOptional() @IsUUID() pipelineId?: string;
  @ApiPropertyOptional() @IsOptional() @IsUUID() customerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() @Min(0) amount?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() currency?: string;
  @ApiPropertyOptional() @IsOptional() @IsDateString() expectedCloseDate?: string;
  @ApiPropertyOptional({ enum: CRM_OPPORTUNITY_STAGES }) @IsOptional() @IsIn(CRM_OPPORTUNITY_STAGES) stage?: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() @Min(0) @Max(100) probability?: number;
  @ApiPropertyOptional({ enum: CRM_RISK_LEVELS }) @IsOptional() @IsIn(CRM_RISK_LEVELS) risk?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() nextStep?: string;
}

export class UpdateOpportunityDto {
  @ApiPropertyOptional() @IsOptional() @IsString() name?: string;
  @ApiPropertyOptional({ enum: CRM_OPPORTUNITY_STAGES }) @IsOptional() @IsIn(CRM_OPPORTUNITY_STAGES) stage?: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() @Min(0) amount?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() currency?: string;
  @ApiPropertyOptional() @IsOptional() @IsDateString() expectedCloseDate?: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() @Min(0) @Max(100) probability?: number;
  @ApiPropertyOptional({ enum: CRM_RISK_LEVELS }) @IsOptional() @IsIn(CRM_RISK_LEVELS) risk?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() nextStep?: string;
}

export class UpdateOpportunityStageDto {
  @ApiProperty({ enum: CRM_OPPORTUNITY_STAGES }) @IsIn(CRM_OPPORTUNITY_STAGES) stage!: string;
}

export class CloseOpportunityDto {
  @ApiProperty({ enum: CRM_OPPORTUNITY_STAGES }) @IsIn(CRM_OPPORTUNITY_STAGES) stage!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() closeReason?: string;
}

export class AiSalesCommandDto {
  @ApiProperty() @IsString() command!: string;
}