import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsIn, IsInt, IsObject, IsOptional, IsString, Min } from 'class-validator';

export class RegisterDeviceDto {
  @ApiPropertyOptional() @IsOptional() @IsString() deviceKey?: string;
  @ApiProperty({ enum: ['browser', 'mobile', 'tablet', 'desktop'] }) @IsIn(['browser', 'mobile', 'tablet', 'desktop']) deviceType!: string;
  @ApiProperty() @IsString() platform!: string;
  @ApiProperty() @IsString() name!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() osVersion?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() appVersion?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() lastIpAddress?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() lastUserAgent?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class TrustDeviceDto {
  @ApiProperty({ enum: ['untrusted', 'known', 'trusted', 'managed'] }) @IsIn(['untrusted', 'known', 'trusted', 'managed']) trustLevel!: string;
  @ApiPropertyOptional({ enum: ['pending', 'active', 'suspended', 'revoked'] }) @IsOptional() @IsIn(['pending', 'active', 'suspended', 'revoked']) status?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() reason?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class GrantDevicePermissionDto {
  @ApiProperty() @IsString() permissionKey!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() moduleKey?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() scope?: string;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() allowed?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() offlineAllowed?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsObject() conditions?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsString() expiresAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class DeviceApprovalDecisionDto {
  @ApiProperty({ enum: ['approved', 'rejected'] }) @IsIn(['approved', 'rejected']) decision!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() trustLevel?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() decisionReason?: string;
}

export class CreateDeviceTrustPolicyDto {
  @ApiProperty() @IsString() policyKey!: string;
  @ApiProperty() @IsString() name!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() deviceType?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() platform?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() requiredTrustLevel?: string;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() approvalRequired?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() mfaRequired?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() encryptionRequired?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() offlineAllowed?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsObject() rules?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class CreateMobileProfileDto {
  @ApiPropertyOptional() @IsOptional() @IsString() profileKey?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() deviceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() layoutMode?: string;
  @ApiPropertyOptional() @IsOptional() @IsArray() navigation?: Record<string, unknown>[];
  @ApiPropertyOptional() @IsOptional() @IsObject() dashboardConfig?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsObject() commandCenter?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() copilotEnabled?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() offlineEnabled?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsArray() supportedModules?: string[];
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class MobileCommandDto {
  @ApiProperty() @IsString() commandKey!: string;
  @ApiProperty() @IsString() commandType!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() payload?: Record<string, unknown>;
}

export class CreateDesktopProfileDto {
  @ApiPropertyOptional() @IsOptional() @IsString() profileKey?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() deviceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() windowState?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsObject() notificationConfig?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsObject() trayConfig?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsArray() nativeCapabilities?: string[];
  @ApiPropertyOptional() @IsOptional() @IsBoolean() multiWindowEnabled?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() desktopNotificationsEnabled?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() offlineEnabled?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class CreateDesktopNotificationDto {
  @ApiProperty() @IsString() title!: string;
  @ApiProperty() @IsString() body!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() deviceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() severity?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() payload?: Record<string, unknown>;
}

export class CreateOfflineStoreDto {
  @ApiPropertyOptional() @IsOptional() @IsString() storeKey?: string;
  @ApiProperty() @IsString() storeType!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() deviceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() moduleKey?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() encryptionStatus?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() retentionPolicy?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsInt() @Min(1) maxSizeMb?: number;
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class QueueOfflineOperationDto {
  @ApiProperty({ enum: ['task', 'workflow', 'ai', 'record'] }) @IsIn(['task', 'workflow', 'ai', 'record']) queueType!: string;
  @ApiProperty() @IsString() moduleKey!: string;
  @ApiProperty() @IsString() operation!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() deviceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() offlineStoreId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() payload?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsInt() @Min(1) priority?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() conflictPolicy?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() dedupeKey?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class ResolveOfflineConflictDto {
  @ApiProperty() @IsString() resolutionStrategy!: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() resolvedVersion?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsString() note?: string;
}

export class UpsertCachePolicyDto {
  @ApiProperty() @IsString() policyKey!: string;
  @ApiProperty() @IsString() moduleKey!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() cacheStrategy?: string;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() encryptionRequired?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsInt() @Min(60) ttlSeconds?: number;
  @ApiPropertyOptional() @IsOptional() @IsInt() @Min(1) maxRecords?: number;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() allowOfflineMutation?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() syncOnReconnect?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsObject() rules?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class UpsertOfflineModulePolicyDto {
  @ApiProperty() @IsString() moduleKey!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() supported?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() readOffline?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() writeOffline?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsString() queueType?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() conflictPolicy?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() permissionRules?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class StartSyncDto {
  @ApiPropertyOptional() @IsOptional() @IsString() syncRunKey?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() deviceId?: string;
  @ApiPropertyOptional({ enum: ['push', 'pull', 'bidirectional'] }) @IsOptional() @IsIn(['push', 'pull', 'bidirectional']) direction?: string;
  @ApiPropertyOptional() @IsOptional() @IsArray() modules?: string[];
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class UpsertSyncCursorDto {
  @ApiProperty() @IsString() moduleKey!: string;
  @ApiProperty() @IsString() cursorKey!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() deviceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() cursorValue?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() changeToken?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}