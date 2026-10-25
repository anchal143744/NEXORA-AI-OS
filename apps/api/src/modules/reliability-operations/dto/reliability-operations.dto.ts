import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsInt, IsNumber, IsObject, IsOptional, IsString } from 'class-validator';

export class CreateServiceHealthDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() serviceKey?: string;
  @ApiProperty() @IsString() serviceName!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() serviceType?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() environment?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() region?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() latencyMs?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() errorRate?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() throughput?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() saturation?: number;
  @ApiPropertyOptional() @IsOptional() @IsArray() dependencyStatus?: Record<string, unknown>[];
  @ApiPropertyOptional() @IsOptional() @IsString() lastCheckedAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class CreateSystemIncidentDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() serviceHealthId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() incidentKey?: string;
  @ApiProperty() @IsString() title!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() description?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() incidentType?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() severity?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() source?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() region?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() detectedAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() resolvedAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() assignedUserId?: string;
  @ApiPropertyOptional() @IsOptional() @IsArray() impact?: Record<string, unknown>[];
  @ApiPropertyOptional() @IsOptional() @IsArray() timeline?: Record<string, unknown>[];
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class CreateIncidentTimelineDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiProperty() @IsString() incidentId!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() timelineKey?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() eventType?: string;
  @ApiProperty() @IsString() title!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() description?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() actorUserId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() occurredAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class CreateRecoveryActionDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() incidentId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() actionKey?: string;
  @ApiProperty() @IsString() actionType!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() automationType?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() startedAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() completedAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() rollbackAvailable?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsObject() result?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class CompleteRecoveryActionDto {
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() completedAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() result?: Record<string, unknown>;
}

export class CreateUptimeMetricDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() serviceHealthId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() metricKey?: string;
  @ApiProperty() @IsString() serviceName!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() region?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() environment?: string;
  @ApiProperty() @IsNumber() uptimePercent!: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() availabilitySlo?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() downtimeMinutes?: number;
  @ApiProperty() @IsString() windowStart!: string;
  @ApiProperty() @IsString() windowEnd!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class CreateReliabilityScoreDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() scoreKey?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() scopeType?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() scopeId?: string;
  @ApiProperty() @IsNumber() score!: number;
  @ApiPropertyOptional() @IsOptional() @IsString() scoreBand?: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() previousScore?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() trend?: string;
  @ApiPropertyOptional() @IsOptional() @IsArray() factors?: Record<string, unknown>[];
  @ApiPropertyOptional() @IsOptional() @IsArray() recommendations?: Record<string, unknown>[];
  @ApiPropertyOptional() @IsOptional() @IsString() calculatedAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class CreateScalingPolicyDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() policyKey?: string;
  @ApiProperty() @IsString() name!: string;
  @ApiProperty() @IsString() serviceName!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() serviceType?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() region?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() mode?: string;
  @ApiPropertyOptional() @IsOptional() @IsInt() minInstances?: number;
  @ApiPropertyOptional() @IsOptional() @IsInt() maxInstances?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() targetCpu?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() targetMemory?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() targetLatencyMs?: number;
  @ApiPropertyOptional() @IsOptional() @IsInt() cooldownSeconds?: number;
  @ApiPropertyOptional() @IsOptional() @IsArray() rules?: Record<string, unknown>[];
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class CreateScalingEventDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() policyId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() eventKey?: string;
  @ApiProperty() @IsString() serviceName!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() region?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() direction?: string;
  @ApiPropertyOptional() @IsOptional() @IsInt() previousCapacity?: number;
  @ApiPropertyOptional() @IsOptional() @IsInt() requestedCapacity?: number;
  @ApiPropertyOptional() @IsOptional() @IsInt() newCapacity?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() reason?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() triggeredAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() completedAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class CreateRegionHealthDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() regionKey?: string;
  @ApiProperty() @IsString() region!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() provider?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() latencyMs?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() errorRate?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() capacityUtilization?: number;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() activeFailover?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsString() lastCheckedAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() metrics?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class CreateFailoverEventDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() regionHealthId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() incidentId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() eventKey?: string;
  @ApiProperty() @IsString() sourceRegion!: string;
  @ApiProperty() @IsString() targetRegion!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() reason?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() startedAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() completedAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() rollbackAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class CreateSreAlertDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() serviceHealthId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() incidentId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() alertKey?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() alertType?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() severity?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
  @ApiProperty() @IsString() title!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() message?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() source?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() triggeredAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() acknowledgedAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() resolvedAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class CreateCapacityForecastDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() serviceHealthId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() forecastKey?: string;
  @ApiProperty() @IsString() serviceName!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() region?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() forecastType?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() horizon?: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() demandScore?: number;
  @ApiPropertyOptional() @IsOptional() @IsInt() recommendedCapacity?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() confidence?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() forecastAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsArray() signals?: Record<string, unknown>[];
  @ApiPropertyOptional() @IsOptional() @IsArray() recommendations?: Record<string, unknown>[];
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}