import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateDesktopNotificationDto, CreateDesktopProfileDto } from '../dto/omnichannel.dto';
import { DesktopService } from './desktop.service';

@ApiTags('Desktop Companion')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'desktop', version: '1' })
export class DesktopController {
  constructor(private readonly desktop: DesktopService) {}

  @Get('architecture') architecture() { return this.desktop.architecture(); }
  @Get('profiles') profiles() { return this.desktop.profiles(); }
  @Post('profiles') createProfile(@Body() dto: CreateDesktopProfileDto) { return this.desktop.createProfile(dto); }
  @Get('windows') windows() { return this.desktop.windows(); }
  @Get('tray') tray() { return this.desktop.tray(); }
  @Post('notifications') notification(@Body() dto: CreateDesktopNotificationDto) { return this.desktop.notification(dto); }
}