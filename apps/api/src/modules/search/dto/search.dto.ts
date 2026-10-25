import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsIn, IsInt, IsObject, IsOptional, IsString, Min } from 'class-validator';

export class CreateSearchIndexDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() indexKey?: string;
  @ApiProperty() @IsString() name!: string;
  @ApiProperty({ enum: ['global', 'module', 'semantic', 'document', 'ai_memory', 'knowledge_graph'] }) @IsString() indexType!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() moduleKey?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() entityType?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() embeddingProvider?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() embeddingModel?: string;
  @ApiPropertyOptional() @IsOptional() @IsInt() @Min(1) dimension?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() sensitivityLevel?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() accessPolicy?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class IndexDocumentDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiProperty() @IsString() sourceType!: string;
  @ApiProperty() @IsString() sourceId!: string;
  @ApiProperty() @IsString() moduleKey!: string;
  @ApiProperty() @IsString() title!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() summary?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() contentHash?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() language?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() sensitivityLevel?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() classification?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() permissions?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsString() searchableText?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class CreateEmbeddingDto {
  @ApiPropertyOptional() @IsOptional() @IsString() documentId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() embeddingKey?: string;
  @ApiProperty() @IsString() provider!: string;
  @ApiProperty() @IsString() model!: string;
  @ApiProperty() @IsInt() @Min(1) dimensions!: number;
  @ApiPropertyOptional() @IsOptional() @IsString() vectorRef?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() vectorHash?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() chunkText?: string;
  @ApiPropertyOptional() @IsOptional() @IsInt() @Min(0) chunkIndex?: number;
  @ApiPropertyOptional() @IsOptional() @IsInt() @Min(0) tokenCount?: number;
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class CreateAccessPolicyDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() indexId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() policyKey?: string;
  @ApiProperty() @IsString() name!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() moduleKey?: string;
  @ApiPropertyOptional() @IsOptional() @IsArray() roleKeys?: string[];
  @ApiPropertyOptional() @IsOptional() @IsArray() permissionKeys?: string[];
  @ApiPropertyOptional() @IsOptional() @IsString() sensitivityThreshold?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() filterRules?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsObject() maskingRules?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() enabled?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class SearchQueryDto {
  @ApiProperty() @IsString() query!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() moduleKey?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() sourceType?: string;
  @ApiPropertyOptional({ enum: ['global', 'module', 'discovery', 'semantic', 'context', 'retrieval'] }) @IsOptional() @IsIn(['global', 'module', 'discovery', 'semantic', 'context', 'retrieval']) searchType?: string;
  @ApiPropertyOptional() @IsOptional() @IsInt() @Min(1) limit?: number;
  @ApiPropertyOptional() @IsOptional() @IsObject() filters?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsArray() roleKeys?: string[];
  @ApiPropertyOptional() @IsOptional() @IsArray() permissionKeys?: string[];
  @ApiPropertyOptional() @IsOptional() @IsBoolean() includeSensitive?: boolean;
}

export class SemanticSearchDto extends SearchQueryDto {
  @ApiPropertyOptional() @IsOptional() @IsString() embeddingModel?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() entityType?: string;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() includeKnowledgeGraph?: boolean;
}

export class ContextSearchDto extends SearchQueryDto {
  @ApiPropertyOptional({ enum: ['workspace', 'copilot', 'agent', 'executive', 'module'] }) @IsOptional() @IsString() contextType?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() userRole?: string;
  @ApiPropertyOptional() @IsOptional() @IsArray() includeModules?: string[];
  @ApiPropertyOptional() @IsOptional() @IsBoolean() includeMemory?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() includeGraph?: boolean;
}

export class RetrievalRequestDto extends ContextSearchDto {
  @ApiPropertyOptional() @IsOptional() @IsString() sessionKey?: string;
  @ApiPropertyOptional({ enum: ['copilot', 'agent', 'semantic', 'context', 'knowledge_graph'] }) @IsOptional() @IsString() retrievalType?: string;
  @ApiPropertyOptional() @IsOptional() @IsInt() @Min(1) maxResults?: number;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() aiReady?: boolean;
}

export class SavedSearchDto {
  @ApiProperty() @IsString() name!: string;
  @ApiProperty() @IsString() query!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() searchScope?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() filters?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsObject() sort?: Record<string, unknown>;
  @ApiPropertyOptional({ enum: ['private', 'workspace', 'tenant'] }) @IsOptional() @IsString() visibility?: string;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() notifyOnChange?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class RebuildIndexDto {
  @ApiPropertyOptional() @IsOptional() @IsArray() moduleKeys?: string[];
  @ApiPropertyOptional() @IsOptional() @IsBoolean() force?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}