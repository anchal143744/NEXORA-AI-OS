import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateMobileProfileDto, MobileCommandDto } from '../dto/omnichannel.dto';
import { MobileService } from './mobile.service';

@ApiTags('Mobile')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'mobile', version: '1' })
export class MobileController {
  constructor(private readonly mobile: MobileService) {}

  @Get('shell') shell() { return this.mobile.shell(); }
  @Get('dashboard-framework') dashboardFramework(@Query('role') role?: string) { return this.mobile.dashboardFramework(role); }
  @Get('workspaces') workspaces() { return this.mobile.workspaces(); }
  @Get('profiles') profiles() { return this.mobile.profiles(); }
  @Post('profiles') createProfile(@Body() dto: CreateMobileProfileDto) { return this.mobile.createProfile(dto); }
  @Post('commands') command(@Body() dto: MobileCommandDto) { return this.mobile.command(dto); }
}