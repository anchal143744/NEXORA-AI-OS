import { IsEmail, IsIn, IsOptional, IsString, IsUUID, MaxLength, MinLength } from 'class-validator';

export class LoginDto {
  @IsOptional() @IsIn(['cookie']) sessionTransport?: 'cookie';
  @IsOptional()
  @IsUUID()
  tenantId?: string;

  @IsEmail()
  @MaxLength(254)
  email!: string;

  @IsString()
  @MinLength(1)
  @MaxLength(256)
  password!: string;

  @IsOptional()
  @IsString()
  deviceName?: string;
}
