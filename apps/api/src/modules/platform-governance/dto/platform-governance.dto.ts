import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsNumber, IsObject, IsOptional, IsString } from 'class-validator';

export class CreateDataContractDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() contractKey?: string;
  @ApiProperty() @IsString() name!: string;
  @ApiProperty() @IsString() domain!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() contractType?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() ownerUserId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() schema?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsArray() qualityRules?: Record<string, unknown>[];
  @ApiPropertyOptional() @IsOptional() @IsArray() consumers?: Record<string, unknown>[];
  @ApiPropertyOptional() @IsOptional() @IsArray() tags?: string[];
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class CreateContractVersionDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiProperty() @IsString() dataContractId!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() versionKey?: string;
  @ApiProperty() @IsString() version!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() schema?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsArray() changelog?: Record<string, unknown>[];
  @ApiPropertyOptional() @IsOptional() @IsString() compatibilityMode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() publishedAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() deprecatedAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class CreateApiProductDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() dataContractId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() contractVersionId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() productKey?: string;
  @ApiProperty() @IsString() name!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() description?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() category?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() visibility?: string;
  @ApiProperty() @IsString() basePath!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() ownerUserId?: string;
  @ApiPropertyOptional() @IsOptional() @IsArray() tags?: string[];
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class CreateApiPlanDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() apiProductId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() planKey?: string;
  @ApiProperty() @IsString() name!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() tier?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() currency?: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() priceMonthly?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() pricePerRequest?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() includedRequests?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() overagePrice?: number;
  @ApiPropertyOptional() @IsOptional() @IsArray() features?: Record<string, unknown>[];
  @ApiPropertyOptional() @IsOptional() @IsObject() limits?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class CreateApiSubscriptionDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() apiProductId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() apiPlanId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() apiKeyId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() subscriptionKey?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() subscriberType?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() subscriberId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() startsAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() endsAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class CreateApiUsageRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() apiProductId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() subscriptionId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() apiKeyId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() usageKey?: string;
  @ApiProperty() @IsString() endpoint!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() method?: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() statusCode?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() requestCount?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() billableUnits?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() latencyMs?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() costAmount?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() currency?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() occurredAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() dimensions?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class CreateApiBillingDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() apiPlanId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() subscriptionId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() billingKey?: string;
  @ApiProperty() @IsString() periodStart!: string;
  @ApiProperty() @IsString() periodEnd!: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() usageUnits?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() subtotal?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() taxAmount?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() totalAmount?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() currency?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() dueAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() paidAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class CreateGovernancePolicyDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() dataContractId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() policyKey?: string;
  @ApiProperty() @IsString() name!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() policyType?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() enforcementMode?: string;
  @ApiPropertyOptional() @IsOptional() @IsArray() rules?: Record<string, unknown>[];
  @ApiPropertyOptional() @IsOptional() @IsObject() approvalWorkflow?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsString() ownerUserId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class CreateApiQuotaDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() apiProductId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() apiPlanId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() quotaKey?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() quotaType?: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() limit?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() period?: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() used?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() resetAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class CreateRateLimitPolicyDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() apiProductId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() policyKey?: string;
  @ApiProperty() @IsString() name!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() scopeType?: string;
  @ApiProperty() @IsNumber() limit!: number;
  @ApiProperty() @IsNumber() windowSeconds!: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() burstLimit?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() enforcementMode?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class CreatePartnerAccessDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() apiProductId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() subscriptionId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() partnerKey?: string;
  @ApiProperty() @IsString() partnerName!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() partnerType?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() accessLevel?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() approvedByUserId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() approvedAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() expiresAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsArray() permissions?: string[];
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class CreateGovernedApiKeyDto {
  @ApiProperty() @IsString() name!: string;
  @ApiPropertyOptional() @IsOptional() @IsArray() scopes?: string[];
  @ApiPropertyOptional() @IsOptional() @IsString() expiresAt?: string;
}
