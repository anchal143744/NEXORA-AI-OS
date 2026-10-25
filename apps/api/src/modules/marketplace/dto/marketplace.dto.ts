import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsEmail, IsIn, IsInt, IsObject, IsOptional, IsString, Min } from 'class-validator';

export class CreateMarketplaceAppDto {
  @ApiPropertyOptional() @IsOptional() @IsString() appKey?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() slug?: string;
  @ApiProperty() @IsString() name!: string;
  @ApiProperty() @IsString() category!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() summary?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() description?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() developerName?: string;
  @ApiPropertyOptional() @IsOptional() @IsEmail() supportEmail?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() partnerProfileId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() pricingModel?: string;
  @ApiPropertyOptional({ enum: ['private', 'tenant', 'public'] }) @IsOptional() @IsIn(['private', 'tenant', 'public']) visibility?: string;
  @ApiPropertyOptional({ enum: ['draft', 'review', 'published', 'suspended', 'retired'] }) @IsOptional() @IsIn(['draft', 'review', 'published', 'suspended', 'retired']) status?: string;
  @ApiPropertyOptional({ enum: ['low', 'medium', 'high', 'critical'] }) @IsOptional() @IsIn(['low', 'medium', 'high', 'critical']) riskLevel?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() iconUrl?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() documentationUrl?: string;
  @ApiPropertyOptional() @IsOptional() @IsArray() requiredScopes?: string[];
  @ApiPropertyOptional() @IsOptional() @IsArray() supportedModules?: string[];
  @ApiPropertyOptional() @IsOptional() @IsArray() supportedIndustries?: string[];
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class CreateMarketplaceVersionDto {
  @ApiProperty() @IsString() version!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() releaseNotes?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() manifest?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsString() sdkVersion?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() minimumNexoraVersion?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() checksum?: string;
  @ApiPropertyOptional({ enum: ['draft', 'review', 'published', 'deprecated'] }) @IsOptional() @IsIn(['draft', 'review', 'published', 'deprecated']) status?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class CreateMarketplacePermissionDto {
  @ApiProperty() @IsString() permissionKey!: string;
  @ApiProperty() @IsString() name!: string;
  @ApiProperty() @IsString() category!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() description?: string;
  @ApiPropertyOptional({ enum: ['low', 'medium', 'high', 'critical'] }) @IsOptional() @IsIn(['low', 'medium', 'high', 'critical']) riskLevel?: string;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() required?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() defaultGrant?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsObject() conditions?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class InstallMarketplaceAppDto {
  @ApiPropertyOptional() @IsOptional() @IsString() organizationId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() businessId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() versionId?: string;
  @ApiPropertyOptional({ enum: ['tenant', 'organization', 'business', 'workspace'] }) @IsOptional() @IsIn(['tenant', 'organization', 'business', 'workspace']) installationScope?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() configuration?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsArray() grantedScopes?: string[];
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class CreateExtensionDefinitionDto {
  @ApiPropertyOptional() @IsOptional() @IsString() appId?: string;
  @ApiProperty() @IsString() extensionKey!: string;
  @ApiProperty() @IsString() name!: string;
  @ApiProperty({ enum: ['module', 'event', 'workflow', 'ui', 'api'] }) @IsIn(['module', 'event', 'workflow', 'ui', 'api']) extensionType!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() moduleKey?: string;
  @ApiPropertyOptional({ enum: ['active', 'disabled', 'deprecated'] }) @IsOptional() @IsIn(['active', 'disabled', 'deprecated']) status?: string;
  @ApiPropertyOptional({ enum: ['server', 'client', 'edge', 'worker'] }) @IsOptional() @IsIn(['server', 'client', 'edge', 'worker']) runtime?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() entrypoint?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() version?: string;
  @ApiPropertyOptional() @IsOptional() @IsArray() permissionScopes?: string[];
  @ApiPropertyOptional() @IsOptional() @IsObject() configurationSchema?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class CreateExtensionHookDto {
  @ApiProperty({ enum: ['event', 'workflow', 'module', 'api'] }) @IsIn(['event', 'workflow', 'module', 'api']) hookType!: string;
  @ApiProperty() @IsString() hookKey!: string;
  @ApiProperty() @IsString() target!: string;
  @ApiPropertyOptional() @IsOptional() @IsInt() @Min(1) priority?: number;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() enabled?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsObject() retryPolicy?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsObject() filter?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsObject() handlerConfig?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class CreateExtensionPointDto {
  @ApiProperty() @IsString() pointKey!: string;
  @ApiProperty({ enum: ['ui', 'api', 'workflow', 'module'] }) @IsIn(['ui', 'api', 'workflow', 'module']) pointType!: string;
  @ApiProperty() @IsString() location!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() moduleKey?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() contract?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsObject() schema?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() enabled?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class CreatePartnerProfileDto {
  @ApiPropertyOptional() @IsOptional() @IsString() partnerKey?: string;
  @ApiProperty() @IsString() name!: string;
  @ApiProperty({ enum: ['technology', 'implementation', 'consulting', 'agency', 'system-integrator'] }) @IsIn(['technology', 'implementation', 'consulting', 'agency', 'system-integrator']) partnerType!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() tier?: string;
  @ApiPropertyOptional({ enum: ['active', 'review', 'suspended', 'inactive'] }) @IsOptional() @IsIn(['active', 'review', 'suspended', 'inactive']) status?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() websiteUrl?: string;
  @ApiPropertyOptional() @IsOptional() @IsEmail() contactEmail?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() countryCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() description?: string;
  @ApiPropertyOptional() @IsOptional() @IsArray() capabilities?: string[];
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class CreatePartnerCertificationDto {
  @ApiProperty() @IsString() certificationKey!: string;
  @ApiProperty() @IsString() certificationType!: string;
  @ApiPropertyOptional({ enum: ['pending', 'active', 'expired', 'revoked'] }) @IsOptional() @IsIn(['pending', 'active', 'expired', 'revoked']) status?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() issuedAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() expiresAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() evidence?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class CreatePartnerServiceListingDto {
  @ApiProperty() @IsString() title!: string;
  @ApiProperty() @IsString() serviceType!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() description?: string;
  @ApiPropertyOptional() @IsOptional() @IsArray() industries?: string[];
  @ApiPropertyOptional() @IsOptional() @IsArray() regions?: string[];
  @ApiPropertyOptional() @IsOptional() @IsString() pricingModel?: string;
  @ApiPropertyOptional({ enum: ['active', 'review', 'hidden', 'retired'] }) @IsOptional() @IsIn(['active', 'review', 'hidden', 'retired']) status?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class CreateIndustryTemplatePackDto {
  @ApiPropertyOptional() @IsOptional() @IsString() templateKey?: string;
  @ApiProperty({ enum: ['healthcare', 'education', 'manufacturing', 'retail', 'professional-services'] }) @IsIn(['healthcare', 'education', 'manufacturing', 'retail', 'professional-services']) industry!: string;
  @ApiProperty() @IsString() name!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() description?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() version?: string;
  @ApiPropertyOptional({ enum: ['draft', 'published', 'retired'] }) @IsOptional() @IsIn(['draft', 'published', 'retired']) status?: string;
  @ApiPropertyOptional() @IsOptional() @IsArray() modules?: string[];
  @ApiPropertyOptional() @IsOptional() @IsArray() workflows?: Record<string, unknown>[];
  @ApiPropertyOptional() @IsOptional() @IsArray() dashboards?: Record<string, unknown>[];
  @ApiPropertyOptional() @IsOptional() @IsArray() kpis?: string[];
  @ApiPropertyOptional() @IsOptional() @IsArray() aiAgents?: string[];
  @ApiPropertyOptional() @IsOptional() @IsArray() navigation?: Record<string, unknown>[];
  @ApiPropertyOptional() @IsOptional() @IsArray() compliance?: string[];
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class InstallIndustryTemplateDto {
  @ApiPropertyOptional() @IsOptional() @IsString() organizationId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() businessId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() configuration?: Record<string, unknown>;
}