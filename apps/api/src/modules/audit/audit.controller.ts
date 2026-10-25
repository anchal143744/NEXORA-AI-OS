import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AuditService } from './audit.service';
import { AuditSearchDto } from './dto/audit-search.dto';

@ApiTags('Audit')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'audit', version: '1' })
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Get('logs')
  @ApiOperation({ summary: 'List tenant audit logs' })
  list() {
    return this.auditService.list();
  }

  @Post('search')
  @ApiOperation({ summary: 'Search tenant audit logs' })
  search(@Body() dto: AuditSearchDto) {
    return this.auditService.search(dto);
  }

  @Get('users/:userId/activity')
  @ApiOperation({ summary: 'List user activity' })
  userActivity(@Param('userId') userId: string) {
    return this.auditService.userActivity(userId);
  }
}
