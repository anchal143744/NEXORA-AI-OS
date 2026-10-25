import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SessionsService } from './sessions.service';

@ApiTags('Sessions')
@Controller({ path: 'sessions', version: '1' })
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}

  @Get(':tenantId/users/:userId')
  list(@Param('tenantId') tenantId: string, @Param('userId') userId: string) {
    return this.sessionsService.listUserSessions(tenantId, userId);
  }

  @Post(':tenantId/:sessionId/revoke')
  revoke(@Param('tenantId') tenantId: string, @Param('sessionId') sessionId: string) {
    return this.sessionsService.revokeSession(tenantId, sessionId);
  }

  @Post(':tenantId/users/:userId/logout-all')
  logoutAll(@Param('tenantId') tenantId: string, @Param('userId') userId: string, @Body() _body: unknown) {
    return this.sessionsService.revokeAllUserSessions(tenantId, userId);
  }
}
