import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';

import { CsrfGuard } from './guards/csrf.guard';
import { IpTrackingService } from './services/ip-tracking.service';
import { LoginAuditService } from './services/login-audit.service';
import { PasswordService } from './services/password.service';

import { TenantValidationMiddleware } from './middleware/tenant-validation.middleware';
import { WorkspaceValidationMiddleware } from './middleware/workspace-validation.middleware';

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 120,
      },
    ]),
  ],

  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },

    CsrfGuard,
    PasswordService,
    LoginAuditService,
    IpTrackingService,

    TenantValidationMiddleware,
    WorkspaceValidationMiddleware,
  ],

  exports: [
    CsrfGuard,
    PasswordService,
    LoginAuditService,
    IpTrackingService,
    TenantValidationMiddleware,
    WorkspaceValidationMiddleware,
  ],
})
export class SecurityModule {}