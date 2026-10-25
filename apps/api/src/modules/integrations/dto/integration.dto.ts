import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsIn, IsObject, IsOptional, IsString, IsUrl } from 'class-validator';
import { SUPPORTED_CONNECTORS, ConnectorKey } from '../connectors/connector.contracts';
export class CreateIntegrationDto { @ApiProperty({ enum: SUPPORTED_CONNECTORS }) @IsIn(SUPPORTED_CONNECTORS) connectorKey!: ConnectorKey; @ApiProperty() @IsString() name!: string; @ApiPropertyOptional() @IsOptional() @IsObject() credentials?: Record<string, unknown>; @ApiPropertyOptional() @IsOptional() @IsObject() settings?: Record<string, unknown>; }
export class RotateSecretDto { @ApiProperty() @IsString() secret!: string; }
export class CreateWebhookDto { @ApiProperty() @IsString() name!: string; @ApiProperty() @IsUrl({ require_tld: false }) url!: string; @ApiProperty() @IsString() secret!: string; @ApiPropertyOptional() @IsOptional() @IsArray() events?: string[]; @ApiPropertyOptional() @IsOptional() @IsBoolean() inbound?: boolean; @ApiPropertyOptional() @IsOptional() @IsBoolean() outbound?: boolean; }
export class InboundWebhookDto { @ApiPropertyOptional() @IsOptional() @IsObject() payload?: Record<string, unknown>; }
export class CreateApiKeyDto { @ApiProperty() @IsString() name!: string; @ApiPropertyOptional() @IsOptional() @IsArray() scopes?: string[]; @ApiPropertyOptional() @IsOptional() @IsString() expiresAt?: string; }
export class SyncRequestDto { @ApiProperty() @IsString() integrationId!: string; @ApiPropertyOptional() @IsOptional() @IsIn(['one_way','two_way','scheduled','realtime']) mode?: string; @ApiPropertyOptional() @IsOptional() @IsObject() payload?: Record<string, unknown>; }
