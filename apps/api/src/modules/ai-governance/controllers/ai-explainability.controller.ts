import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { AiExplainabilityService } from '../ai-explainability.service';
import { CreateAIExplainabilityRecordDto } from '../dto/ai-governance.dto';

@ApiTags('AI Explainability')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'ai-explainability', version: '1' })
export class AiExplainabilityController {
  constructor(private readonly explainability: AiExplainabilityService) {}

  @Get('records') records(@Query('explanationType') explanationType?: string, @Query('decisionId') decisionId?: string) { return this.explainability.records(explanationType, decisionId); }
  @Post('records') createRecord(@Body() dto: CreateAIExplainabilityRecordDto) { return this.explainability.createRecord(dto); }
  @Get('decisions/:decisionId') decisionExplanation(@Param('decisionId') decisionId: string) { return this.explainability.decisionExplanation(decisionId); }
  @Get('factors') factors(@Query('aiModelId') aiModelId?: string) { return this.explainability.factors(aiModelId); }
}