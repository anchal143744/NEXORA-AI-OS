import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateMobileWorkSessionDto, CreateMobileDeviceRegistrationDto, CreateOfflineJobQueueDto, CreateMobileSyncEventDto } from '../dto/field-service.dto';
import { FieldServiceAnalyticsService } from '../field-service-analytics.service';
import { FieldServiceCommandService } from '../field-service-command.service';
import { FieldServiceQueryService } from '../field-service-query.service';

@ApiTags('Mobile Workforce Foundation')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'mobile-workforce', version: '1' })
export class MobileWorkforceController {
  constructor(private readonly commands: FieldServiceCommandService, private readonly queries: FieldServiceQueryService, private readonly analytics: FieldServiceAnalyticsService) {}

  @Get('dashboard') dashboard() {
    return this.analytics.dashboard('Mobile Workforce Foundation');
  }

  @Get('work-sessions') listMobileWorkSession(@Query('status') status?: string, @Query('stage') stage?: string, @Query('priority') priority?: string, @Query('severity') severity?: string, @Query('riskLevel') riskLevel?: string, @Query('workOrderId') workOrderId?: string, @Query('customerId') customerId?: string, @Query('technicianId') technicianId?: string, @Query('territoryId') territoryId?: string, @Query('slaPolicyId') slaPolicyId?: string) {
    return this.queries.list('mobileWorkSession', { status, stage, priority, severity, riskLevel, workOrderId, customerId, technicianId, territoryId, slaPolicyId });
  }

  @Post('work-sessions') createMobileWorkSession(@Body() dto: CreateMobileWorkSessionDto) {
    return this.commands.create('mobileWorkSession', dto);
  }

  @Get('device-registrations') listMobileDeviceRegistration(@Query('status') status?: string, @Query('stage') stage?: string, @Query('priority') priority?: string, @Query('severity') severity?: string, @Query('riskLevel') riskLevel?: string, @Query('workOrderId') workOrderId?: string, @Query('customerId') customerId?: string, @Query('technicianId') technicianId?: string, @Query('territoryId') territoryId?: string, @Query('slaPolicyId') slaPolicyId?: string) {
    return this.queries.list('mobileDeviceRegistration', { status, stage, priority, severity, riskLevel, workOrderId, customerId, technicianId, territoryId, slaPolicyId });
  }

  @Post('device-registrations') createMobileDeviceRegistration(@Body() dto: CreateMobileDeviceRegistrationDto) {
    return this.commands.create('mobileDeviceRegistration', dto);
  }

  @Get('offline-job-queue') listOfflineJobQueue(@Query('status') status?: string, @Query('stage') stage?: string, @Query('priority') priority?: string, @Query('severity') severity?: string, @Query('riskLevel') riskLevel?: string, @Query('workOrderId') workOrderId?: string, @Query('customerId') customerId?: string, @Query('technicianId') technicianId?: string, @Query('territoryId') territoryId?: string, @Query('slaPolicyId') slaPolicyId?: string) {
    return this.queries.list('offlineJobQueue', { status, stage, priority, severity, riskLevel, workOrderId, customerId, technicianId, territoryId, slaPolicyId });
  }

  @Post('offline-job-queue') createOfflineJobQueue(@Body() dto: CreateOfflineJobQueueDto) {
    return this.commands.create('offlineJobQueue', dto);
  }

  @Get('sync-events') listMobileSyncEvent(@Query('status') status?: string, @Query('stage') stage?: string, @Query('priority') priority?: string, @Query('severity') severity?: string, @Query('riskLevel') riskLevel?: string, @Query('workOrderId') workOrderId?: string, @Query('customerId') customerId?: string, @Query('technicianId') technicianId?: string, @Query('territoryId') territoryId?: string, @Query('slaPolicyId') slaPolicyId?: string) {
    return this.queries.list('mobileSyncEvent', { status, stage, priority, severity, riskLevel, workOrderId, customerId, technicianId, territoryId, slaPolicyId });
  }

  @Post('sync-events') createMobileSyncEvent(@Body() dto: CreateMobileSyncEventDto) {
    return this.commands.create('mobileSyncEvent', dto);
  }
}

