import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateSlaRecordDto } from '../dto/customer-experience.dto';
import { ServiceAutomationService } from '../service-automation.service';

@ApiTags('SLA')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'sla', version: '1' })
export class SlaController {
  constructor(private readonly service: ServiceAutomationService) {}

  @Get() records(@Query('ticketId') ticketId?: string, @Query('status') status?: string) { return this.service.slaRecords(ticketId, status); }
  @Post() createRecord(@Body() dto: CreateSlaRecordDto) { return this.service.createSlaRecord(dto); }
  @Get('breaches') breaches() { return this.service.breachedSla(); }
  @Get('analytics') analytics() { return this.service.serviceAnalytics(); }
}
