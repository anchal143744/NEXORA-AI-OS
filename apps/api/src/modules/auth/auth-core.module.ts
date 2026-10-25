import { Global, Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { CommonModule } from '../../common/common.module';
import { SessionsModule } from '../sessions/sessions.module';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { TokenService } from './tokens/token.service';

function requireJwtSecret(configService: ConfigService) {
  const jwtSecret = configService.get<string>('JWT_SECRET');
  if (!jwtSecret) throw new Error('JWT_SECRET is required for authentication');
  return jwtSecret;
}

@Global()
@Module({
  imports: [
    CommonModule,
    SessionsModule,
    NestConfigModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: requireJwtSecret(configService),
        signOptions: {
          expiresIn: '15m',
        },
      }),
    }),
  ],

  providers: [
    TokenService,
    JwtAuthGuard,
  ],

  exports: [
    JwtModule,
    SessionsModule,
    TokenService,
    JwtAuthGuard,
  ],
})
export class AuthCoreModule {}
