import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsIn, IsInt, IsObject, IsOptional, IsString, Min } from 'class-validator';

export const ONTOLOGY_ENTITY_TYPES = ['business','organization','workspace','department','team','user','employee','customer','lead','opportunity','project','task','invoice','contract','revenue','expense','inventory','supplier','workflow','workflow_execution','kpi','goal','ai_agent'] as const;
export const RELATIONSHIP_TYPES = ['owns','belongs_to','works_in','manages','managed_by','reports_to','contains','depends_on','drives','influences','generates','bills','connected_to','assigned_to','created_by','executes','recommends'] as const;

export class CreateOntologyEntityDto {
  @ApiProperty({ enum: ONTOLOGY_ENTITY_TYPES }) @IsIn(ONTOLOGY_ENTITY_TYPES) entityType!: string;
  @ApiProperty() @IsString() entityKey!: string;
  @ApiProperty() @IsString() name!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() sourceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() attributes?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsArray() tags?: string[];
}

export class CreateRelationshipDto {
  @ApiProperty() @IsString() sourceEntityId!: string;
  @ApiProperty() @IsString() targetEntityId!: string;
  @ApiProperty({ enum: RELATIONSHIP_TYPES }) @IsIn(RELATIONSHIP_TYPES) relationshipType!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() label?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() confidence?: number;
}

export class ContextQueryDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() businessId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() entityId?: string;
}

export class CreateBusinessMemoryDto {
  @ApiProperty() @IsString() memoryType!: string;
  @ApiProperty() @IsString() title!: string;
  @ApiProperty() @IsObject() content!: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() entityId?: string;
}


export class EnterpriseGraphSyncDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsArray() modules?: string[];
  @ApiPropertyOptional() @IsOptional() @IsInt() @Min(1) limit?: number;
}
