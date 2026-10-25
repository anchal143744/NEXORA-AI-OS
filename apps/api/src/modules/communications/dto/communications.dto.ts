import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsInt, IsNumber, IsObject, IsOptional, IsString, Min } from 'class-validator';

export class CreateChannelDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() channelKey?: string;
  @ApiProperty() @IsString() name!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() description?: string;
  @ApiProperty() @IsString() channelType!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() visibility?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() departmentId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() teamId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() projectId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() createdByUserId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() permissions?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class AddChannelMemberDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() userId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() teamId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() memberRole?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() notificationLevel?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class CreateConversationDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() channelId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() conversationKey?: string;
  @ApiProperty() @IsString() conversationType!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() subject?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() privacy?: string;
  @ApiPropertyOptional() @IsOptional() @IsArray() participantRefs?: Record<string, unknown>[];
  @ApiPropertyOptional() @IsOptional() @IsString() createdByUserId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class SendMessageDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() channelId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() conversationId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() senderUserId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() messageType?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() body?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() content?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class CreateMessageAttachmentDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiProperty() @IsString() attachmentType!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() fileId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() fileName?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() url?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() storageKey?: string;
  @ApiPropertyOptional() @IsOptional() @IsInt() @Min(0) sizeBytes?: number;
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class CreateMessageReactionDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() actorUserId?: string;
  @ApiProperty() @IsString() reactionType!: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class CreateAnnouncementDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() announcementKey?: string;
  @ApiProperty() @IsString() title!: string;
  @ApiProperty() @IsString() body!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() audienceType?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() priority?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() createdByUserId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() scheduledAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() expiresAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsArray() recipients?: Array<{ recipientType: string; recipientId?: string }>;
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class CreateMeetingDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() meetingKey?: string;
  @ApiProperty() @IsString() title!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() description?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() meetingType?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() privacy?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() organizerUserId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() channelId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() conversationId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() timezone?: string;
  @ApiProperty() @IsString() startsAt!: string;
  @ApiProperty() @IsString() endsAt!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() location?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() meetingUrl?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() recurrenceRule?: string;
  @ApiPropertyOptional() @IsOptional() @IsArray() participants?: Array<{ userId?: string; email?: string; participantRole?: string; required?: boolean }>;
  @ApiPropertyOptional() @IsOptional() @IsObject() context?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class AddMeetingParticipantDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() userId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() email?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() participantRole?: string;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() required?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsString() responseStatus?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class CreateMeetingAgendaDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() agendaKey?: string;
  @ApiProperty() @IsString() title!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() description?: string;
  @ApiPropertyOptional() @IsOptional() @IsInt() @Min(0) orderIndex?: number;
  @ApiPropertyOptional() @IsOptional() @IsInt() @Min(1) durationMinutes?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() presenterUserId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class CreateMeetingDecisionDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() decisionKey?: string;
  @ApiProperty() @IsString() title!: string;
  @ApiProperty() @IsString() outcome!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() rationale?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() decidedByUserId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() impact?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class CreateMeetingActionDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() summaryId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() actionKey?: string;
  @ApiProperty() @IsString() title!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() description?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() priority?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() assigneeUserId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() dueAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() sourceType?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() sourceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class GenerateMeetingSummaryDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() summaryKey?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() summaryType?: string;
  @ApiProperty() @IsString() title!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() sourceText?: string;
  @ApiPropertyOptional() @IsOptional() @IsArray() decisions?: Record<string, unknown>[];
  @ApiPropertyOptional() @IsOptional() @IsArray() actionItems?: Record<string, unknown>[];
  @ApiPropertyOptional() @IsOptional() @IsArray() risks?: Record<string, unknown>[];
  @ApiPropertyOptional() @IsOptional() @IsArray() followUps?: Record<string, unknown>[];
  @ApiPropertyOptional() @IsOptional() @IsArray() sourceRefs?: Record<string, unknown>[];
  @ApiPropertyOptional() @IsOptional() @IsString() provider?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() model?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() generatedByUserId?: string;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() createActionItems?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class CreateCalendarDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() calendarKey?: string;
  @ApiProperty() @IsString() name!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() description?: string;
  @ApiProperty() @IsString() calendarType!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() ownerUserId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() departmentId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() teamId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() timezone?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() visibility?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() color?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class CreateCalendarEventDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiProperty() @IsString() calendarId!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() meetingId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() eventKey?: string;
  @ApiProperty() @IsString() title!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() description?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() eventType?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() privacy?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() timezone?: string;
  @ApiProperty() @IsString() startsAt!: string;
  @ApiProperty() @IsString() endsAt!: string;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() allDay?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsString() recurrenceRule?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() location?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() meetingUrl?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() organizerUserId?: string;
  @ApiPropertyOptional() @IsOptional() @IsArray() participants?: Array<{ userId?: string; email?: string; required?: boolean }>;
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class CreateScheduleRuleDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() calendarId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() ruleKey?: string;
  @ApiProperty() @IsString() name!: string;
  @ApiProperty() @IsString() ruleType!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() timezone?: string;
  @ApiPropertyOptional() @IsOptional() @IsInt() @Min(0) priority?: number;
  @ApiPropertyOptional() @IsOptional() @IsArray() workingDays?: string[];
  @ApiPropertyOptional() @IsOptional() @IsObject() constraints?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() enabled?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class CreateAvailabilityWindowDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() calendarId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() userId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() teamId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() departmentId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() windowKey?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() timezone?: string;
  @ApiProperty() @IsString() startsAt!: string;
  @ApiProperty() @IsString() endsAt!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() availabilityType?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() source?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class SchedulingRequestDto {
  @ApiProperty() @IsString() title!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() meetingId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() calendarId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() timezone?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() preferredStartAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() preferredEndAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsInt() @Min(1) durationMinutes?: number;
  @ApiPropertyOptional() @IsOptional() @IsArray() participantRefs?: Record<string, unknown>[];
  @ApiPropertyOptional() @IsOptional() @IsObject() constraints?: Record<string, unknown>;
}

export class CreateReminderDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() eventId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() meetingId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() reminderKey?: string;
  @ApiProperty() @IsString() reminderType!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() channel?: string;
  @ApiProperty() @IsString() scheduledAt!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() targetUserId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() payload?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class UpsertNotificationPreferenceDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() userId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() preferenceKey?: string;
  @ApiProperty() @IsString() channel!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() scope?: string;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() enabled?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsObject() quietHours?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsObject() rules?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}