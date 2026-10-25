import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CompleteRecoveryActionDto, CreateRecoveryActionDto } from '../dto/reliability-operations.dto';
import { IncidentManagementService } from '../incident-management.service';

@ApiTags('Recovery')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'recovery', version: '1' })
export class RecoveryController {
  constructor(private readonly incidents: IncidentManagementService) {}

  @Get('automation') automation() { return this.incidents.incidentCenter(); }
  @Get('actions') actions(@Query('incidentId') incidentId?: string, @Query('status') status?: string, @Query('actionType') actionType?: string) { return this.incidents.recoveryActions(incidentId, status, actionType); }
  @Post('actions') createAction(@Body() dto: CreateRecoveryActionDto) { return this.incidents.createRecoveryAction(dto); }
  @Patch('actions/:id/complete') complete(@Param('id') id: string, @Body() dto: CompleteRecoveryActionDto) { return this.incidents.completeRecoveryAction(id, dto); }
}