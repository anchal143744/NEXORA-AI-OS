import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsArray, IsIn, IsObject, IsOptional, IsString, ValidateNested } from 'class-validator';

export const INDUSTRIES = ['saas','agency','ecommerce','retail','healthcare','manufacturing','education','finance','logistics','consulting'];
export const BUSINESS_TYPES = ['startup','small_business','agency','ecommerce','manufacturing','enterprise','global_organization'];
export const GROWTH_STAGES = ['idea','launch','growth','scale','maturity','turnaround'];
export const REVENUE_RANGES = ['pre_revenue','under_100k','100k_1m','1m_10m','10m_100m','100m_plus'];
export const TEAM_SIZE_BANDS = ['solo','2_10','11_50','51_200','201_1000','1000_plus'];

export class BusinessProfileDto {
  @ApiProperty({ enum: INDUSTRIES }) @IsIn(INDUSTRIES) industry!: string;
  @ApiProperty({ enum: BUSINESS_TYPES }) @IsIn(BUSINESS_TYPES) businessType!: string;
  @ApiProperty({ enum: TEAM_SIZE_BANDS }) @IsIn(TEAM_SIZE_BANDS) teamSize!: string;
  @ApiProperty({ enum: REVENUE_RANGES }) @IsIn(REVENUE_RANGES) revenueRange!: string;
  @ApiProperty({ enum: GROWTH_STAGES }) @IsIn(GROWTH_STAGES) growthStage!: string;
  @ApiProperty() @IsString() country!: string;
  @ApiProperty() @IsArray() goals!: string[];
  @ApiPropertyOptional() @IsOptional() @IsString() role?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Prisma.InputJsonObject;
}

export class GenerateWorkspaceDto {
  @ApiProperty() @IsString() organizationId!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() businessId?: string;
  @ApiProperty() @IsString() workspaceName!: string;
  @ApiProperty() @IsString() workspaceSlug!: string;
  @ApiProperty({ type: () => BusinessProfileDto }) @ValidateNested() @Type(() => BusinessProfileDto) profile!: BusinessProfileDto;
}

export class BlueprintQueryDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() blueprintId?: string;
}



