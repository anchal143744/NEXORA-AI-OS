import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { NotificationService } from './notification.service';
@ApiTags('Notifications') @ApiBearerAuth() @UseGuards(JwtAuthGuard) @Controller({path:'notifications',version:'1'})
export class NotificationController{constructor(private readonly notifications:NotificationService){} @Post() create(@Body() dto:CreateNotificationDto){return this.notifications.create(dto)} @Get('me') mine(){return this.notifications.listMine()}}
