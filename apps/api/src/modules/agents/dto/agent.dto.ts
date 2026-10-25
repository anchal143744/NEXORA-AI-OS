import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsObject, IsOptional, IsString } from 'class-validator';
import { FOUNDATION_AGENTS, FoundationAgentKey } from '../contracts/agent.contract';
export class RunAgentDto { @ApiProperty({ enum: FOUNDATION_AGENTS }) @IsIn(FOUNDATION_AGENTS) agentKey!: FoundationAgentKey; @ApiProperty() @IsString() objective!: string; @ApiPropertyOptional() @IsOptional() @IsObject() input?: Record<string, unknown>; }
export class UpsertMemoryDto { @ApiProperty() @IsString() scope!: string; @ApiProperty() @IsString() key!: string; @ApiProperty() @IsObject() value!: Record<string, unknown>; @ApiPropertyOptional() @IsOptional() @IsString() agentKey?: string; @ApiPropertyOptional() @IsOptional() @IsString() businessId?: string; @ApiPropertyOptional() @IsOptional() @IsString() conversationId?: string; }
