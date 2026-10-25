import { IsEmail, IsString, IsUUID } from 'class-validator';

export class AccountRecoveryDto {
  @IsUUID()
  tenantId!: string;

  @IsEmail()
  email!: string;

  @IsString()
  recoveryChannel!: 'email' | 'admin';
}
