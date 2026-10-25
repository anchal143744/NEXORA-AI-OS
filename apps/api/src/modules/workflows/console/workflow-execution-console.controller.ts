import { Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { WorkflowExecutionConsoleService } from './workflow-execution-console.service';

@ApiTags('Workflow Executions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'workflow-executions', version: '1' })
export class WorkflowExecutionConsoleController {
  constructor(private readonly console: WorkflowExecutionConsoleService) {}
  @Get() list(@Query('status') status?: string) { return this.console.list(status); }
  @Get('running') running() { return this.console.running(); }
  @Get('queued') queued() { return this.console.queued(); }
  @Get('failed') failed() { return this.console.failed(); }
  @Get('retry-queue') retryQueue() { return this.console.retryQueue(); }
  @Get('approval-queue') approvalQueue() { return this.console.approvalQueue(); }
  @Get('ai-tracking') aiTracking() { return this.console.aiTracking(); }
  @Post(':id/retry') retry(@Param('id') id: string) { return this.console.retryExecution(id); }
}
