import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID } from 'class-validator';
export class CreateNotificationDto { @ApiProperty() @IsUUID() userId!: string; @ApiProperty({ enum: ['info','success','warning','critical'] }) @IsString() type!: 'info'|'success'|'warning'|'critical'; @ApiProperty() @IsString() title!: string; @ApiPropertyOptional() @IsOptional() @IsString() body?: string; @ApiPropertyOptional() @IsOptional() @IsString() actionUrl?: string; }
