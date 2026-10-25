import { IsIn, IsOptional, IsString, IsUUID, MaxLength, MinLength } from 'class-validator';
export class SwitchContextDto {
  @IsUUID() workspaceId!: string;
  @IsOptional() @IsIn(['cookie']) sessionTransport?: 'cookie';
}
export class CreateContextDto {
  @IsUUID() requestKey!: string;
  @IsIn(['business', 'workspace']) kind!: 'business' | 'workspace';
  @IsString() @MinLength(1) @MaxLength(100) name!: string;
}
