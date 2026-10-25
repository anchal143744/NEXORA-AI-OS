import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsNumber, IsObject, IsOptional, IsString } from 'class-validator';

export class CreateTrustReportDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() reportKey?: string;
  @ApiProperty() @IsString() title!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() reportType?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() visibility?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() summary?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() periodStart?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() periodEnd?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() publishedAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() expiresAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsArray() evidence?: Record<string, unknown>[];
  @ApiPropertyOptional() @IsOptional() @IsObject() metrics?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class CreateSecurityCertificationDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() trustReportId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() certificationKey?: string;
  @ApiProperty() @IsString() name!: string;
  @ApiProperty() @IsString() authority!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() certificationType?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() issuedAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() expiresAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsArray() scope?: Record<string, unknown>[];
  @ApiPropertyOptional() @IsOptional() @IsString() evidenceUrl?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class CreateComplianceArtifactDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() trustReportId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() artifactKey?: string;
  @ApiProperty() @IsString() title!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() artifactType?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() framework?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() classification?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() storageUri?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() version?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() publishedAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() expiresAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsArray() accessRules?: Record<string, unknown>[];
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class CreateDeveloperAccountDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() accountKey?: string;
  @ApiProperty() @IsString() name!: string;
  @ApiProperty() @IsString() email!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() organizationName?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() accountType?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() verificationStatus?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() billingProfile?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsObject() profile?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class CreateDeveloperApplicationDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() developerAccountId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() applicationKey?: string;
  @ApiProperty() @IsString() name!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() description?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() appType?: string;
  @ApiPropertyOptional() @IsOptional() @IsArray() apiProductIds?: string[];
  @ApiPropertyOptional() @IsOptional() @IsArray() redirectUris?: string[];
  @ApiPropertyOptional() @IsOptional() @IsString() webhookUrl?: string;
  @ApiPropertyOptional() @IsOptional() @IsArray() scopes?: string[];
  @ApiPropertyOptional() @IsOptional() @IsString() approvalStatus?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() publishedAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class CreateApiDocumentationDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() documentationKey?: string;
  @ApiProperty() @IsString() title!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() apiProductId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() version?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() audience?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() specFormat?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() spec?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsArray() examples?: Record<string, unknown>[];
  @ApiPropertyOptional() @IsOptional() @IsString() content?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() publishedAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class CreateSdkPackageDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() apiDocumentationId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() packageKey?: string;
  @ApiProperty() @IsString() name!: string;
  @ApiProperty() @IsString() language!: string;
  @ApiProperty() @IsString() version!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() packageManager?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() downloadUrl?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() checksum?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() releaseNotes?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() publishedAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class CreatePartnerListingDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() listingKey?: string;
  @ApiProperty() @IsString() partnerName!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() partnerType?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() certificationLevel?: string;
  @ApiPropertyOptional() @IsOptional() @IsArray() countries?: string[];
  @ApiPropertyOptional() @IsOptional() @IsArray() industries?: string[];
  @ApiPropertyOptional() @IsOptional() @IsString() description?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() websiteUrl?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() supportUrl?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class CreateMarketplaceApplicationDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() developerApplicationId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() partnerListingId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() marketplaceKey?: string;
  @ApiProperty() @IsString() name!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() category?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() pricingModel?: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() installCount?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() rating?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() description?: string;
  @ApiPropertyOptional() @IsOptional() @IsArray() screenshots?: Record<string, unknown>[];
  @ApiPropertyOptional() @IsOptional() @IsArray() permissions?: string[];
  @ApiPropertyOptional() @IsOptional() @IsString() publishedAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class CreateExternalIntegrationDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() partnerListingId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() marketplaceApplicationId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() integrationKey?: string;
  @ApiProperty() @IsString() name!: string;
  @ApiProperty() @IsString() provider!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() category?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() authType?: string;
  @ApiPropertyOptional() @IsOptional() @IsArray() capabilities?: Record<string, unknown>[];
  @ApiPropertyOptional() @IsOptional() @IsObject() configurationSchema?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsString() healthStatus?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() lastVerifiedAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class CreateStatusIncidentDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() externalIntegrationId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() marketplaceApplicationId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() incidentKey?: string;
  @ApiProperty() @IsString() title!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() incidentType?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() severity?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() impact?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() startedAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() resolvedAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsArray() updates?: Record<string, unknown>[];
  @ApiPropertyOptional() @IsOptional() @IsArray() affectedComponents?: string[];
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class CreateEcosystemEventDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() developerApplicationId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() externalIntegrationId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() eventKey?: string;
  @ApiProperty() @IsString() eventType!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() source?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() subjectType?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() subjectId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() severity?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() payload?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsString() occurredAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() processedAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}
