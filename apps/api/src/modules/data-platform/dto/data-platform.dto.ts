import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsInt, IsNumber, IsObject, IsOptional, IsString, Min } from 'class-validator';

export class CreateDataLakeDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() dataLakeKey?: string;
  @ApiProperty() @IsString() name!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() lakeType?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() storageProvider?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() storageUri?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() region?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() encryptionMode?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() retentionPolicy?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsString() classification?: string;
  @ApiPropertyOptional() @IsOptional() @IsArray() zones?: Record<string, unknown>[];
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class CreateDataWarehouseDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() dataLakeId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() warehouseKey?: string;
  @ApiProperty() @IsString() name!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() warehouseType?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() engine?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() schemaName?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() refreshCadence?: string;
  @ApiPropertyOptional() @IsOptional() @IsInt() @Min(0) storageBytes?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() queryEndpoint?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() governance?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class CreateDataMartDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() warehouseId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() dataMartKey?: string;
  @ApiProperty() @IsString() name!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() martType?: string;
  @ApiProperty() @IsString() domain!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() ownerTeamId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() refreshCadence?: string;
  @ApiPropertyOptional() @IsOptional() @IsArray() sourceTables?: Record<string, unknown>[];
  @ApiPropertyOptional() @IsOptional() @IsArray() semanticModels?: Record<string, unknown>[];
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class CreateSemanticMetricDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() dataMartId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() metricKey?: string;
  @ApiProperty() @IsString() name!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() metricType?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() category?: string;
  @ApiProperty() @IsString() formula!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() aggregation?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() unit?: string;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() certified?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsString() ownerUserId?: string;
  @ApiPropertyOptional() @IsOptional() @IsArray() dimensions?: Record<string, unknown>[];
  @ApiPropertyOptional() @IsOptional() @IsArray() filters?: Record<string, unknown>[];
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class CreateSemanticDimensionDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() dataMartId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() dimensionKey?: string;
  @ApiProperty() @IsString() name!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() dimensionType?: string;
  @ApiProperty() @IsString() sourceField!: string;
  @ApiPropertyOptional() @IsOptional() @IsArray() hierarchy?: Record<string, unknown>[];
  @ApiPropertyOptional() @IsOptional() @IsArray() valuesPreview?: Record<string, unknown>[];
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class CreateKpiDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() semanticMetricId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() kpiKey?: string;
  @ApiProperty() @IsString() name!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() category?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() targetValue?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() currentValue?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() unit?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() period?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() ownerUserId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() thresholds?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsString() formula?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class GenerateKpiResultDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiProperty() @IsString() kpiId!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() resultKey?: string;
  @ApiProperty() @IsString() periodStart!: string;
  @ApiProperty() @IsString() periodEnd!: string;
  @ApiProperty() @IsNumber() actualValue!: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() targetValue?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() variance?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() score?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() band?: string;
  @ApiPropertyOptional() @IsOptional() @IsArray() drivers?: Record<string, unknown>[];
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class CreateExecutiveDashboardDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() dataMartId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() dashboardKey?: string;
  @ApiProperty() @IsString() name!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() dashboardType?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() audience?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() layout?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsArray() widgets?: Record<string, unknown>[];
  @ApiPropertyOptional() @IsOptional() @IsArray() filters?: Record<string, unknown>[];
  @ApiPropertyOptional() @IsOptional() @IsString() refreshCadence?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() ownerUserId?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class CreateWarehouseJobDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() warehouseId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() jobKey?: string;
  @ApiProperty() @IsString() jobType!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() startedAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() finishedAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsInt() @Min(0) durationMs?: number;
  @ApiPropertyOptional() @IsOptional() @IsInt() @Min(0) rowsProcessed?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() errorMessage?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() metrics?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class CreateDataPipelineDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() dataLakeId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() warehouseId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() pipelineKey?: string;
  @ApiProperty() @IsString() name!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() pipelineType?: string;
  @ApiProperty() @IsString() sourceSystem!: string;
  @ApiProperty() @IsString() targetSystem!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() schedule?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() transformationConfig?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsArray() qualityRules?: Record<string, unknown>[];
  @ApiPropertyOptional() @IsOptional() @IsString() lastRunAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class ExecuteDataPipelineDto {
  @ApiPropertyOptional() @IsOptional() @IsString() workspaceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
  @ApiPropertyOptional() @IsOptional() @IsInt() @Min(0) rowsProcessed?: number;
  @ApiPropertyOptional() @IsOptional() @IsObject() metrics?: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsString() errorMessage?: string;
}