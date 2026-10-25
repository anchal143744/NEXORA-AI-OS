import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ActivityService } from './activity.service';
@ApiTags('Activity Stream') @ApiBearerAuth() @UseGuards(JwtAuthGuard) @Controller({path:'activity',version:'1'})
export class ActivityController { constructor(private readonly activity: ActivityService) {} @Get('me') me(){return this.activity.listCurrentUser()} }
