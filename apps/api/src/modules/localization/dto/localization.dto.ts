import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsIn, IsObject, IsOptional, IsString, Length } from 'class-validator';

export const SUPPORTED_LANGUAGE_CODES = ['en','es','fr','de','it','pt','ar','hi','zh','ja','ko','ru','tr','nl','vi','th'] as const;
export const COMPLIANCE_FRAMEWORK_KEYS = ['GDPR','SOC2','ISO27001','CCPA','HIPAA','PDPA','LGPD','PIPEDA'] as const;
export const PREFERENCE_SCOPES = ['user','workspace','organization'] as const;

export class LocalizationSettingsDto {
  @ApiProperty({ enum: SUPPORTED_LANGUAGE_CODES }) @IsIn(SUPPORTED_LANGUAGE_CODES) languageCode!: string;
  @ApiProperty() @IsString() locale!: string;
  @ApiProperty() @IsString() @Length(2, 2) countryCode!: string;
  @ApiProperty() @IsString() timezone!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() currencyCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() dateFormat?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() numberFormat?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() scopeId?: string;
  @ApiProperty({ enum: PREFERENCE_SCOPES }) @IsIn(PREFERENCE_SCOPES) scope!: string;
}

export class TranslationQueryDto {
  @ApiProperty() @IsString() namespace!: string;
  @ApiProperty({ enum: SUPPORTED_LANGUAGE_CODES }) @IsIn(SUPPORTED_LANGUAGE_CODES) languageCode!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() locale?: string;
}

export class UpsertTranslationDto {
  @ApiProperty() @IsString() namespace!: string;
  @ApiProperty() @IsString() key!: string;
  @ApiProperty({ enum: SUPPORTED_LANGUAGE_CODES }) @IsIn(SUPPORTED_LANGUAGE_CODES) languageCode!: string;
  @ApiProperty() @IsString() value!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() locale?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class ComplianceRuleQueryDto {
  @ApiPropertyOptional() @IsOptional() @IsString() @Length(2, 2) countryCode?: string;
  @ApiPropertyOptional({ enum: COMPLIANCE_FRAMEWORK_KEYS }) @IsOptional() @IsIn(COMPLIANCE_FRAMEWORK_KEYS) frameworkKey?: string;
}

export class FormatBusinessValueDto {
  @ApiProperty() @IsString() @Length(2, 2) countryCode!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() currencyCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() dateValue?: string;
  @ApiPropertyOptional() @IsOptional() amount?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() phone?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() address?: Record<string, unknown>;
}

export class TimeConversionDto {
  @ApiProperty() @IsString() value!: string;
  @ApiProperty() @IsString() fromTimezone!: string;
  @ApiProperty() @IsString() toTimezone!: string;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() respectBusinessHours?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsString() @Length(2, 2) countryCode?: string;
}