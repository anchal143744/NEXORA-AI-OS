import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RecordWorkflowMetricDto } from '../dto/workflow-builder.dto';
import { WorkflowMonitoringService } from './workflow-monitoring.service';

@ApiTags('Workflow Monitoring')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'workflow-monitoring', version: '1' })
export class WorkflowMonitoringController {
  constructor(private readonly monitoring: WorkflowMonitoringService) {}
  @Get() summary() { return this.monitoring.summary(); }
  @Post('metrics') record(@Body() dto: RecordWorkflowMetricDto) { return this.monitoring.record(dto); }
}
