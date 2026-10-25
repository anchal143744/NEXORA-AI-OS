import { Module } from '@nestjs/common';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthCoreModule } from './auth-core.module';
import { OAuthService } from './oauth/oauth.service';

import { SecurityModule } from '../security/security.module';
import { UsersModule } from '../users/users.module';
import { SessionsModule } from '../sessions/sessions.module';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [
    AuthCoreModule,
    SecurityModule,
    SessionsModule,
    EmailModule,
    UsersModule,
  ],

  controllers: [
    AuthController,
  ],

  providers: [
    AuthService,
    OAuthService,
  ],

  exports: [
    AuthService,
    OAuthService,
  ],
})
export class AuthModule {}