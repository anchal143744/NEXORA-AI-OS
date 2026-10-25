import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateWorkflowTemplateDto } from '../dto/workflow-builder.dto';
import { WorkflowTemplateService } from './workflow-template.service';

@ApiTags('Workflow Templates')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'workflow-templates', version: '1' })
export class WorkflowTemplateController {
  constructor(private readonly templates: WorkflowTemplateService) {}
  @Get() list(@Query('industry') industry?: string) { return this.templates.list(industry); }
  @Get(':id') get(@Param('id') id: string) { return this.templates.get(id); }
  @Post() create(@Body() dto: CreateWorkflowTemplateDto) { return this.templates.create(dto); }
}
