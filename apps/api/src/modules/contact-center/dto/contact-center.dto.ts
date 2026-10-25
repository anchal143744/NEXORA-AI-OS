import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsInt, IsNumber, IsObject, IsOptional, IsString, Min } from 'class-validator';

export class CreateVoiceSessionDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() sessionKey?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() conversationId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() customerIdentityId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() channelId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() queueId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() assignedAgentUserId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() voiceAgentKey?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() direction?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() provider?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() language?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() phoneNumber?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() callerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() audioStorageKey?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class AddVoiceTranscriptDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() conversationId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() speakerType?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() speakerRef?: string;
  @ApiPropertyOptional() @IsOptional() @IsInt() @Min(0) sequence?: number;
  @ApiProperty() @IsString() transcriptText!: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() confidence?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() language?: string;
  @ApiPropertyOptional() @IsOptional() @IsInt() @Min(0) startOffsetMs?: number;
  @ApiPropertyOptional() @IsOptional() @IsInt() @Min(0) endOffsetMs?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() provider?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class VoiceCommandDto {
  @ApiProperty() @IsString() commandText!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() voiceSessionId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() conversationId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() customerIdentityId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() context?: Record<string, unknown>;
}

export class VoiceActionDto {
  @ApiProperty() @IsString() actionType!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() voiceSessionId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() conversationId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() customerIdentityId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() riskLevel?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() payload?: Record<string, unknown>;
}

export class CreateContactCenterQueueDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() queueKey?: string;
  @ApiProperty() @IsString() name!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() description?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() queueType?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() priority?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() departmentId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() teamId?: string;
  @ApiPropertyOptional() @IsOptional() @IsArray() channelTypes?: string[];
  @ApiPropertyOptional() @IsOptional() @IsString() routingStrategy?: string;
  @ApiPropertyOptional() @IsOptional() @IsInt() @Min(1) slaTargetSeconds?: number;
  @ApiPropertyOptional() @IsOptional() @IsInt() @Min(1) maxWaitSeconds?: number;
  @ApiPropertyOptional() @IsOptional() @IsObject() businessHours?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsObject() escalationPolicy?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class CreateAgentAssignmentDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() assignmentKey?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() queueId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() conversationId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() voiceSessionId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() customerIdentityId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() assignedUserId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() assignmentType?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() priority?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() slaDueAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() routingReason?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class UpdateAssignmentStatusDto {
  @ApiProperty() @IsString() status!: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class CreateEscalationDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() escalationKey?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() queueId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() conversationId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() voiceSessionId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() customerIdentityId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() assignmentId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() escalationType?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() severity?: string;
  @ApiProperty() @IsString() reason!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() recommendation?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() fromUserId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() toUserId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class CreateCustomerIdentityDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() identityKey?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() customerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() leadId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() primaryName?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() email?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() phone?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() company?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() externalRefs?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsArray() channelIdentities?: Record<string, unknown>[];
  @ApiPropertyOptional() @IsOptional() @IsString() lifecycleStage?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() riskLevel?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class ResolveCustomerIdentityDto extends CreateCustomerIdentityDto {
  @ApiPropertyOptional() @IsOptional() @IsString() channel?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() channelUserId?: string;
}

export class AddConversationParticipantDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() customerIdentityId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() userId?: string;
  @ApiProperty() @IsString() participantType!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() displayName?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() email?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() phone?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() channelRef?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class SyncOmnichannelMessageDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() channelId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() conversationId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() customerIdentityId?: string;
  @ApiProperty() @IsString() sourceChannel!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() externalMessageId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() body?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() content?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class SentimentAnalysisDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() conversationId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() messageId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() voiceSessionId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() customerIdentityId?: string;
  @ApiProperty() @IsString() sourceText!: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class IntentDetectionDto extends SentimentAnalysisDto {}

export class CreateConversationSummaryDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() summaryKey?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() conversationId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() voiceSessionId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() customerIdentityId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() summaryType?: string;
  @ApiProperty() @IsString() title!: string;
  @ApiProperty() @IsString() sourceText!: string;
  @ApiPropertyOptional() @IsOptional() @IsArray() decisions?: Record<string, unknown>[];
  @ApiPropertyOptional() @IsOptional() @IsArray() actionItems?: Record<string, unknown>[];
  @ApiPropertyOptional() @IsOptional() @IsArray() followUps?: Record<string, unknown>[];
  @ApiPropertyOptional() @IsOptional() @IsArray() risks?: Record<string, unknown>[];
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class ConversationActionExtractionDto extends SentimentAnalysisDto {}
export class RiskDetectionDto extends SentimentAnalysisDto {}
export class EscalationRecommendationDto extends SentimentAnalysisDto {}

export class StartVoiceAgentExecutionDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() executionKey?: string;
  @ApiProperty() @IsString() agentType!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() voiceSessionId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() conversationId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() customerIdentityId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() riskLevel?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() approvalStatus?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() input?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsObject() plan?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsArray() actions?: Record<string, unknown>[];
  @ApiPropertyOptional() @IsOptional() @IsBoolean() handoffRequired?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class CompleteVoiceAgentExecutionDto {
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() output?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsArray() actions?: Record<string, unknown>[];
}

export class HumanHandoffDto {
  @ApiProperty() @IsString() reason!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() toUserId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() queueId?: string;
}
