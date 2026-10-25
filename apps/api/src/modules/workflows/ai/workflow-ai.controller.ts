import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { GenerateWorkflowDto } from '../dto/workflow-builder.dto';
import { WorkflowAiService } from './workflow-ai.service';

@ApiTags('Workflow AI')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'workflow-ai', version: '1' })
export class WorkflowAiController {
  constructor(private readonly workflowAi: WorkflowAiService) {}
  @Post('generate') generate(@Body() dto: GenerateWorkflowDto) { return this.workflowAi.generate(dto); }
  @Get('recommendations') recommend(@Query('industry') industry?: string, @Query('goals') goals?: string) { return this.workflowAi.recommend(industry, goals ? goals.split(',').map((goal) => goal.trim()).filter(Boolean) : []); }
}
