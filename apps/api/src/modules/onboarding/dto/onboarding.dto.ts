import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsIn, IsObject, IsOptional, IsString } from 'class-validator';

export class CreateImportJobDto {
  @ApiProperty({ enum: ['csv', 'excel'] }) @IsIn(['csv', 'excel']) sourceFormat!: string;
  @ApiProperty() @IsString() targetEntity!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() fileName?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() mapping?: Record<string, string>;
  @ApiPropertyOptional() @IsOptional() @IsObject() validationRules?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class CsvImportDto extends CreateImportJobDto {
  @ApiProperty() @IsString() csvText!: string;
}

export class ExcelImportDto extends CreateImportJobDto {
  @ApiProperty() @IsObject() workbook!: { sheets: Array<{ name: string; rows: Array<Record<string, unknown>> }> };
  @ApiPropertyOptional() @IsOptional() @IsString() sheetName?: string;
}

export class CreateMigrationConnectionDto {
  @ApiProperty({ enum: ['salesforce', 'hubspot', 'zoho', 'monday', 'notion'] }) @IsIn(['salesforce', 'hubspot', 'zoho', 'monday', 'notion']) provider!: string;
  @ApiProperty() @IsString() name!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() credentialRef?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() connectionConfig?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class CreateMigrationMappingDto {
  @ApiProperty({ enum: ['salesforce', 'hubspot', 'zoho', 'monday', 'notion'] }) @IsIn(['salesforce', 'hubspot', 'zoho', 'monday', 'notion']) provider!: string;
  @ApiProperty() @IsString() sourceObject!: string;
  @ApiProperty() @IsString() targetEntity!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() connectionId?: string;
  @ApiProperty() @IsObject() fieldMap!: Record<string, string>;
  @ApiPropertyOptional() @IsOptional() @IsArray() transformRules?: Record<string, unknown>[];
  @ApiPropertyOptional() @IsOptional() @IsObject() validationRules?: Record<string, unknown>;
}

export class CreateMigrationRunDto {
  @ApiProperty({ enum: ['salesforce', 'hubspot', 'zoho', 'monday', 'notion'] }) @IsIn(['salesforce', 'hubspot', 'zoho', 'monday', 'notion']) provider!: string;
  @ApiProperty() @IsString() sourceObject!: string;
  @ApiProperty() @IsString() targetEntity!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() connectionId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() mapping?: Record<string, string>;
  @ApiPropertyOptional() @IsOptional() @IsArray() records?: Array<Record<string, unknown>>;
}

export class StartOnboardingDto {
  @ApiProperty() @IsString() businessName!: string;
  @ApiProperty() @IsString() industry!: string;
  @ApiProperty() @IsString() businessType!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() countryCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() revenueRange?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() teamSizeRange?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() growthStage?: string;
  @ApiPropertyOptional() @IsOptional() @IsArray() goals?: string[];
  @ApiPropertyOptional() @IsOptional() @IsString() organizationId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() businessId?: string;
}

export class CompleteOnboardingStepDto {
  @ApiProperty() @IsString() stepKey!: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() input?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsObject() output?: Record<string, unknown>;
}

export class GenerateOnboardingWorkspaceDto {
  @ApiProperty() @IsString() workspaceName!: string;
  @ApiProperty() @IsString() workspaceSlug!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() organizationId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() businessId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() role?: string;
}

export class OnboardingAssistantDto {
  @ApiProperty() @IsString() message!: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() context?: Record<string, unknown>;
}
