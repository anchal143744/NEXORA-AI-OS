import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString, IsUUID } from 'class-validator';
export class CreateProjectDto { @ApiProperty() @IsString() name!: string; @ApiPropertyOptional() @IsOptional() @IsUUID() teamId?: string; @ApiPropertyOptional() @IsOptional() @IsDateString() startDate?: string; @ApiPropertyOptional() @IsOptional() @IsDateString() dueDate?: string; }
export class UpdateProjectDto { @ApiPropertyOptional() @IsOptional() @IsString() name?: string; @ApiPropertyOptional() @IsOptional() @IsString() status?: string; @ApiPropertyOptional() @IsOptional() @IsDateString() dueDate?: string; }
export class CreateTaskDto { @ApiProperty() @IsString() title!: string; @ApiPropertyOptional() @IsOptional() @IsString() description?: string; @ApiPropertyOptional() @IsOptional() @IsUUID() projectId?: string; @ApiPropertyOptional() @IsOptional() @IsUUID() assigneeUserId?: string; @ApiPropertyOptional() @IsOptional() @IsString() priority?: string; @ApiPropertyOptional() @IsOptional() @IsDateString() dueAt?: string; }
export class AssignTaskDto { @ApiProperty() @IsUUID() assigneeUserId!: string; }
export class TaskStatusDto { @ApiProperty() @IsString() status!: string; }
