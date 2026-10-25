import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';
export class CreateFolderDto { @ApiProperty() @IsString() name!: string; @ApiProperty() @IsString() path!: string; @ApiPropertyOptional() @IsOptional() @IsUUID() parentId?: string; }
export class CreateDocumentDto { @ApiProperty() @IsString() title!: string; @ApiProperty() @IsString() documentType!: string; @ApiPropertyOptional() @IsOptional() @IsString() contentRef?: string; }
export class CreateUploadRecordDto { @ApiProperty() @IsString() fileName!: string; @ApiProperty() @IsString() mimeType!: string; @ApiProperty() @IsNumber() sizeBytes!: number; @ApiPropertyOptional() @IsOptional() @IsUUID() folderId?: string; @ApiPropertyOptional() @IsOptional() @IsString() storageProvider?: string; }
