import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsInt, IsNumber, IsObject, IsOptional, IsString, Min } from 'class-validator';

export class CustomerScopeDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() customerIdentityId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() customerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() accountName?: string;
}

export class CreateCustomerHealthScoreDto extends CustomerScopeDto {
  @ApiPropertyOptional() @IsOptional() @IsString() scoreKey?: string;
  @ApiProperty() @IsNumber() score!: number;
  @ApiPropertyOptional() @IsOptional() @IsString() scoreBand?: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() previousScore?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() trend?: string;
  @ApiPropertyOptional() @IsOptional() @IsArray() drivers?: Record<string, unknown>[];
  @ApiPropertyOptional() @IsOptional() @IsArray() risks?: Record<string, unknown>[];
  @ApiPropertyOptional() @IsOptional() @IsArray() recommendations?: Record<string, unknown>[];
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class CreateCustomerJourneyDto extends CustomerScopeDto {
  @ApiPropertyOptional() @IsOptional() @IsString() journeyKey?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() lifecycleStage?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() previousStage?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() journeyStatus?: string;
  @ApiPropertyOptional() @IsOptional() @IsArray() touchpoints?: Record<string, unknown>[];
  @ApiPropertyOptional() @IsOptional() @IsArray() milestones?: Record<string, unknown>[];
  @ApiPropertyOptional() @IsOptional() @IsArray() blockers?: Record<string, unknown>[];
  @ApiPropertyOptional() @IsOptional() @IsString() ownerUserId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() lastTouchAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() nextStepAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class UpdateJourneyStageDto {
  @ApiProperty() @IsString() lifecycleStage!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() journeyStatus?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() touchpoint?: Record<string, unknown>;
}

export class CreateCustomerFeedbackDto extends CustomerScopeDto {
  @ApiPropertyOptional() @IsOptional() @IsString() feedbackKey?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() feedbackType?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() source?: string;
  @ApiPropertyOptional() @IsOptional() @IsInt() rating?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() sentiment?: string;
  @ApiPropertyOptional() @IsOptional() @IsInt() npsScore?: number;
  @ApiPropertyOptional() @IsOptional() @IsInt() csatScore?: number;
  @ApiPropertyOptional() @IsOptional() @IsInt() cesScore?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() title?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() comments?: string;
  @ApiPropertyOptional() @IsOptional() @IsArray() tags?: string[];
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class CreateCustomerSuccessPlanDto extends CustomerScopeDto {
  @ApiPropertyOptional() @IsOptional() @IsString() planKey?: string;
  @ApiProperty() @IsString() name!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() description?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() planType?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() priority?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() ownerUserId?: string;
  @ApiPropertyOptional() @IsOptional() @IsArray() goals?: Record<string, unknown>[];
  @ApiPropertyOptional() @IsOptional() @IsArray() playbooks?: Record<string, unknown>[];
  @ApiPropertyOptional() @IsOptional() @IsArray() automations?: Record<string, unknown>[];
  @ApiPropertyOptional() @IsOptional() @IsObject() adoptionTargets?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsString() renewalTargetAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class CreateCustomerEngagementScoreDto extends CustomerScopeDto {
  @ApiPropertyOptional() @IsOptional() @IsString() scoreKey?: string;
  @ApiProperty() @IsNumber() score!: number;
  @ApiPropertyOptional() @IsOptional() @IsString() scoreBand?: string;
  @ApiPropertyOptional() @IsOptional() @IsInt() @Min(0) activityCount?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() adoptionRate?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() communicationRate?: number;
  @ApiPropertyOptional() @IsOptional() @IsObject() productUsage?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsArray() engagementSignals?: Record<string, unknown>[];
  @ApiPropertyOptional() @IsOptional() @IsArray() recommendations?: Record<string, unknown>[];
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class CreateChurnPredictionDto extends CustomerScopeDto {
  @ApiPropertyOptional() @IsOptional() @IsString() predictionKey?: string;
  @ApiProperty() @IsNumber() probability!: number;
  @ApiPropertyOptional() @IsOptional() @IsString() riskBand?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() predictedReason?: string;
  @ApiPropertyOptional() @IsOptional() @IsArray() riskDrivers?: Record<string, unknown>[];
  @ApiPropertyOptional() @IsOptional() @IsArray() preventionActions?: Record<string, unknown>[];
  @ApiPropertyOptional() @IsOptional() @IsNumber() confidence?: number;
  @ApiPropertyOptional() @IsOptional() @IsInt() @Min(1) predictionWindowDays?: number;
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class CreateRenewalOpportunityDto extends CustomerScopeDto {
  @ApiPropertyOptional() @IsOptional() @IsString() opportunityKey?: string;
  @ApiProperty() @IsString() title!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() priority?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() renewalDate?: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() contractValue?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() probability?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() ownerUserId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() nextStep?: string;
  @ApiPropertyOptional() @IsOptional() @IsArray() risks?: Record<string, unknown>[];
  @ApiPropertyOptional() @IsOptional() @IsArray() recommendations?: Record<string, unknown>[];
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class CreateRevenueOpportunityDto extends CustomerScopeDto {
  @ApiPropertyOptional() @IsOptional() @IsString() opportunityKey?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() opportunityType?: string;
  @ApiProperty() @IsString() title!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() priority?: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() estimatedValue?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() probability?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() expectedCloseAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() source?: string;
  @ApiPropertyOptional() @IsOptional() @IsArray() signals?: Record<string, unknown>[];
  @ApiPropertyOptional() @IsOptional() @IsArray() recommendations?: Record<string, unknown>[];
  @ApiPropertyOptional() @IsOptional() @IsString() ownerUserId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class CreateRevenueRiskDto extends CustomerScopeDto {
  @ApiPropertyOptional() @IsOptional() @IsString() riskKey?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() riskType?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() severity?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() atRiskValue?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() probability?: number;
  @ApiPropertyOptional() @IsOptional() @IsArray() drivers?: Record<string, unknown>[];
  @ApiPropertyOptional() @IsOptional() @IsArray() mitigationActions?: Record<string, unknown>[];
  @ApiPropertyOptional() @IsOptional() @IsString() ownerUserId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class CreateServiceTicketDto extends CustomerScopeDto {
  @ApiPropertyOptional() @IsOptional() @IsString() ticketKey?: string;
  @ApiProperty() @IsString() title!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() description?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() ticketType?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() priority?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() severity?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() source?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() queueId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() assignedUserId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() conversationId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() slaDueAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsArray() tags?: string[];
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class CreateServiceEscalationDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() ticketId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() escalationKey?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() escalationType?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() severity?: string;
  @ApiProperty() @IsString() reason!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() fromUserId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() toUserId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() recommendedAction?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class ResolveServiceTicketDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() resolutionKey?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() resolutionType?: string;
  @ApiProperty() @IsString() summary!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() rootCause?: string;
  @ApiPropertyOptional() @IsOptional() @IsArray() actionsTaken?: Record<string, unknown>[];
  @ApiPropertyOptional() @IsOptional() @IsString() customerImpact?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() resolvedByUserId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class CreateSlaRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() ticketId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() customerIdentityId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() slaKey?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() slaType?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
  @ApiProperty() @IsString() targetAt!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() achievedAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsInt() @Min(0) targetSeconds?: number;
  @ApiPropertyOptional() @IsOptional() @IsInt() @Min(0) actualSeconds?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() breachReason?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() policy?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}
