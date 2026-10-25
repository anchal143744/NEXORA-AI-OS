import { IsEmail, IsString, IsUUID, MaxLength, MinLength } from 'class-validator';

export class RequestPasswordResetDto {
  @IsUUID()
  tenantId!: string;

  @IsEmail()
  email!: string;
}

export class ConfirmPasswordResetDto {
  @IsUUID()
  tenantId!: string;

  @IsString()
  token!: string;

  @IsString()
  @MinLength(12)
  @MaxLength(256)
  newPassword!: string;
}

export class ChangePasswordDto {
  @IsUUID()
  tenantId!: string;

  @IsUUID()
  userId!: string;

  @IsString()
  currentPassword!: string;

  @IsString()
  @MinLength(12)
  newPassword!: string;
}
