import { IsEmail, IsIn, IsOptional, IsString, IsUUID, MaxLength, MinLength } from 'class-validator';

export class SignupDto {
  @IsOptional() @IsUUID() requestKey?: string;
  @IsOptional() @IsIn(['cookie']) sessionTransport?: 'cookie';
  @IsOptional()
  @IsUUID()
  tenantId?: string;

  @IsEmail()
  @MaxLength(254)
  email!: string;

  @IsOptional()
  @IsString()
  @MinLength(1) @MaxLength(120)
  displayName?: string;

  @IsOptional()
  @IsString()
  @MinLength(1) @MaxLength(120)
  name?: string;

  @IsString()
  @MinLength(12)
  @MaxLength(256)
  password!: string;

  @IsOptional()
  @IsString()
  @MinLength(1) @MaxLength(100)
  companyName?: string;

  @IsOptional()
  @IsString()
  role?: string;

  @IsOptional()
  @IsUUID()
  workspaceId?: string;
}
