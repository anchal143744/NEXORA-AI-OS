import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateWorkflowDefinitionDto, UpdateWorkflowDefinitionDto } from '../dto/workflow-builder.dto';
import { WorkflowBuilderService } from './workflow-builder.service';

@ApiTags('Workflow Builder')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'workflow-builder', version: '1' })
export class WorkflowBuilderController {
  constructor(private readonly builder: WorkflowBuilderService) {}

  @Post('definitions') create(@Body() dto: CreateWorkflowDefinitionDto) { return this.builder.create(dto); }
  @Get('definitions') list(@Query('status') status?: string) { return this.builder.list(status); }
  @Get('definitions/:id') get(@Param('id') id: string) { return this.builder.get(id); }
  @Patch('definitions/:id') update(@Param('id') id: string, @Body() dto: UpdateWorkflowDefinitionDto) { return this.builder.update(id, dto); }
  @Post('definitions/:id/publish') publish(@Param('id') id: string) { return this.builder.publishDefinition(id); }
}
