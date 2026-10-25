
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsInt, IsObject, IsOptional, IsString, Min } from 'class-validator';

export class UniversalCommandDto {
  @ApiProperty() @IsString() command!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsInt() @Min(1) limit?: number;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() includeGraph?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsObject() context?: Record<string, unknown>;
}

export class UniversalSearchDto {
  @ApiProperty() @IsString() query!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsArray() modules?: string[];
  @ApiPropertyOptional() @IsOptional() @IsInt() @Min(1) limit?: number;
}
