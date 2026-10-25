import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateWorkflowDto, ManualTriggerWorkflowDto, UpdateWorkflowDto } from './dto/workflow.dto';
import { WorkflowRegistryService } from './workflow-registry.service';
import { WorkflowRuntimeService } from './workflow-runtime.service';
import { WorkflowService } from './workflow.service';
import { WorkflowVersioningService } from './workflow-versioning.service';
@ApiTags('Workflows') @ApiBearerAuth() @UseGuards(JwtAuthGuard) @Controller({ path: 'workflows', version: '1' })
export class WorkflowController {
  constructor(private readonly workflows: WorkflowService, private readonly registry: WorkflowRegistryService, private readonly runtime: WorkflowRuntimeService, private readonly versions: WorkflowVersioningService) {}
  @Get('registry') getRegistry() { return this.registry.snapshot(); }
  @Post() create(@Body() dto: CreateWorkflowDto) { return this.workflows.create(dto); }
  @Get() list() { return this.workflows.list(); }
  @Patch(':id') update(@Param('id') id: string, @Body() dto: UpdateWorkflowDto) { return this.workflows.update(id, dto); }
  @Post(':id/publish') publish(@Param('id') id: string) { return this.versions.publish(id); }
  @Post(':id/versions') createVersion(@Param('id') id: string) { return this.versions.createDraftVersion(id); }
  @Post(':id/rollback/:version') rollback(@Param('id') id: string, @Param('version') version: string) { return this.versions.rollback(id, Number(version)); }
  @Post(':id/trigger') trigger(@Param('id') id: string, @Body() dto: ManualTriggerWorkflowDto) { return this.runtime.triggerManual(id, dto.input ?? {}); }
  @Post(':id/api-trigger') apiTrigger(@Param('id') id: string, @Body() dto: ManualTriggerWorkflowDto) { return this.runtime.triggerApi(id, dto.input ?? {}); }
  @Post(':id/webhook-trigger') webhookTrigger(@Param('id') id: string, @Body() dto: ManualTriggerWorkflowDto) { return this.runtime.triggerWebhook(id, dto.input ?? {}); }
}
