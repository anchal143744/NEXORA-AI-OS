import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateRoleDto {
  @ApiProperty({ example: 'Regional Manager' })
  @IsString()
  name!: string;

  @ApiProperty({ example: 'regional_manager' })
  @IsString()
  slug!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;
}

export class AssignRoleDto {
  @ApiProperty()
  @IsUUID()
  roleId!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  membershipId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  workspaceMemberId?: string;
}

export class CreatePermissionDto {
  @ApiProperty({ example: 'workspace' })
  @IsString()
  resource!: string;

  @ApiProperty({ example: 'read' })
  @IsString()
  action!: string;

  @ApiProperty({ example: 'tenant' })
  @IsString()
  scope!: string;
}

export class AssignPermissionDto {
  @ApiProperty()
  @IsUUID()
  roleId!: string;

  @ApiProperty()
  @IsUUID()
  permissionId!: string;
}

export class PermissionCheckDto {
  @ApiProperty({ type: [String] })
  @IsArray()
  permissions!: string[];

  @ApiProperty({ type: [String] })
  @IsArray()
  required!: string[];
}
