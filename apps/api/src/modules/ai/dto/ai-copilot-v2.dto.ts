import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsIn, IsObject, IsOptional, IsString } from 'class-validator';

export const AI_PROVIDERS = ['openai','claude','gemini','azure_openai','local'] as const;
export const INSIGHT_TYPES = ['revenue','sales','customer','workflow','hr','finance','inventory','executive'] as const;
export const RISK_TYPES = ['revenue','cash_flow','employee_attrition','lead_drop','inventory_shortage','workflow_failure','customer_churn','compliance'] as const;
export const OPPORTUNITY_TYPES = ['growth','upsell','automation','hiring','cost_saving','market_expansion'] as const;
export const RECOMMENDATION_TYPES = ['task','workflow','automation','hiring','budget_change','revenue_action'] as const;

export class AiContextQueryDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() businessId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() departmentId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() userRole?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() countryCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() conversationId?: string;
}

export class AiChatDto extends AiContextQueryDto {
  @ApiProperty() @IsString() message!: string;
  @ApiPropertyOptional({ enum: AI_PROVIDERS }) @IsOptional() @IsIn(AI_PROVIDERS) provider?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() model?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() copilotKey?: string;
}

export class CreateAiMemoryDto extends AiContextQueryDto {
  @ApiProperty() @IsString() memoryType!: string;
  @ApiProperty() @IsString() title!: string;
  @ApiProperty() @IsObject() content!: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsString() scope?: string;
  @ApiPropertyOptional() @IsOptional() importance?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() source?: string;
}

export class GenerateInsightsDto extends AiContextQueryDto {
  @ApiPropertyOptional({ enum: INSIGHT_TYPES, isArray: true }) @IsOptional() @IsArray() insightTypes?: string[];
}

export class GenerateRisksDto extends AiContextQueryDto {
  @ApiPropertyOptional({ enum: RISK_TYPES, isArray: true }) @IsOptional() @IsArray() riskTypes?: string[];
}

export class GenerateOpportunitiesDto extends AiContextQueryDto {
  @ApiPropertyOptional({ enum: OPPORTUNITY_TYPES, isArray: true }) @IsOptional() @IsArray() opportunityTypes?: string[];
}

export class GenerateRecommendationsDto extends AiContextQueryDto {
  @ApiPropertyOptional({ enum: RECOMMENDATION_TYPES, isArray: true }) @IsOptional() @IsArray() recommendationTypes?: string[];
}