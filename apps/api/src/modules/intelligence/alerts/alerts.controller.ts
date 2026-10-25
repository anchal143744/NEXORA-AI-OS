import { Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { AlertEngine } from './alert-engine.service';
@ApiTags('Predictive Alerts') @ApiBearerAuth() @UseGuards(JwtAuthGuard) @Controller({ path: 'alerts', version: '1' })
export class AlertsController { constructor(private readonly alerts: AlertEngine) {} @Post('generate') generate() { return this.alerts.generate(); } }
