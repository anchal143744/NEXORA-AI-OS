import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateAdminOperationDto } from '../dto/enterprise-admin.dto';
import { AdminCenterService } from './admin-center.service';

@ApiTags('Enterprise Admin Center')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'admin-center', version: '1' })
export class AdminCenterController {
  constructor(private readonly admin: AdminCenterService) {}
  @Get('overview') overview() { return this.admin.overview(); }
  @Get('organizations') organizations() { return this.admin.organizations(); }
  @Get('workspaces') workspaces() { return this.admin.workspaces(); }
  @Get('users') users() { return this.admin.users(); }
  @Get('subscriptions') subscriptions() { return this.admin.subscriptions(); }
  @Get('ai-usage') aiUsage() { return this.admin.aiUsage(); }
  @Get('operations') operations(@Query('status') status?: string) { return this.admin.adminOperations(status); }
  @Post('operations') createOperation(@Body() dto: CreateAdminOperationDto) { return this.admin.createOperation(dto); }
}
