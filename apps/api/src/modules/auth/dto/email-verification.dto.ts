import { IsEmail, IsString, IsUUID } from 'class-validator';

export class RequestEmailVerificationDto {
  @IsUUID()
  tenantId!: string;

  @IsEmail()
  email!: string;
}

export class VerifyEmailDto {
  @IsUUID()
  tenantId!: string;

  @IsString()
  token!: string;
}
