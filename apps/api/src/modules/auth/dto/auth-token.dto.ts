import { IsString, MinLength } from 'class-validator';

export class AuthTokenDto {
  @IsString()
  @MinLength(10)
  accessToken!: string;
}
