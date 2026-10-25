import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RequirePermissions } from '../rbac/decorators/require-permissions.decorator';
import { RbacGuard } from '../rbac/guards/rbac.guard';
import { ConversationEngineService } from './chat/conversation-engine.service';
import { AiContextBuilderService } from './context/ai-context-builder.service';
import { AiChatDto, AiContextQueryDto, CreateAiMemoryDto, GenerateInsightsDto, GenerateOpportunitiesDto, GenerateRecommendationsDto, GenerateRisksDto } from './dto/ai-copilot-v2.dto';
import { AiInsightEngineService } from './insights/ai-insight-engine.service';
import { AiMemoryEngineService } from './memory/ai-memory-engine.service';
import { OpportunityEngineService } from './opportunities/opportunity-engine.service';
import { AiProviderRouterService } from './providers/ai-provider-router.service';
import { AiRecommendationEngineService } from './recommendations/ai-recommendation-engine.service';
import { RiskDetectionEngineService } from './risks/risk-detection-engine.service';

@ApiTags('AI Copilot Brain V2')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RbacGuard)
@Controller({ path: 'ai', version: '1' })
export class AiCopilotController {
  constructor(private readonly chatEngine: ConversationEngineService, private readonly contextBuilder: AiContextBuilderService, private readonly memory: AiMemoryEngineService, private readonly insights: AiInsightEngineService, private readonly recommendations: AiRecommendationEngineService, private readonly opportunities: OpportunityEngineService, private readonly risks: RiskDetectionEngineService, private readonly providers: AiProviderRouterService) {}

  @RequirePermissions('execute')
  @Post('chat') chat(@Body() dto: AiChatDto) { return this.chatEngine.chat(dto); }
  @RequirePermissions('execute')
  @Get('context') getContext(@Query() query: AiContextQueryDto) { return this.contextBuilder.build(query); }
  @RequirePermissions('execute')
  @Post('context') buildContext(@Body() dto: AiContextQueryDto) { return this.contextBuilder.build(dto); }
  @RequirePermissions('read')
  @Get('memory') listMemory(@Query() query: AiContextQueryDto) { return this.memory.retrieve(query); }
  @RequirePermissions('execute')
  @Post('memory') storeMemory(@Body() dto: CreateAiMemoryDto) { return this.memory.store(dto); }
  @RequirePermissions('read')
  @Get('insights') listInsights() { return this.insights.list(); }
  @RequirePermissions('execute')
  @Post('insights') generateInsights(@Body() dto: GenerateInsightsDto) { return this.insights.generate(dto); }
  @RequirePermissions('read')
  @Get('recommendations') listRecommendations() { return this.recommendations.list(); }
  @RequirePermissions('execute')
  @Post('recommendations') generateRecommendations(@Body() dto: GenerateRecommendationsDto) { return this.recommendations.generate(dto); }
  @RequirePermissions('read')
  @Get('recommendations/tasks') listTaskSuggestions() { return this.recommendations.listTaskSuggestions(); }
  @RequirePermissions('read')
  @Get('recommendations/workflows') listWorkflowSuggestions() { return this.recommendations.listWorkflowSuggestions(); }
  @RequirePermissions('read')
  @Get('opportunities') listOpportunities() { return this.opportunities.list(); }
  @RequirePermissions('execute')
  @Post('opportunities') detectOpportunities(@Body() dto: GenerateOpportunitiesDto) { return this.opportunities.detect(dto); }
  @RequirePermissions('read')
  @Get('risks') listRisks() { return this.risks.list(); }
  @RequirePermissions('execute')
  @Post('risks') detectRisks(@Body() dto: GenerateRisksDto) { return this.risks.detect(dto); }
  @RequirePermissions('read')
  @Get('conversations') listConversations() { return this.chatEngine.conversations(); }
  @RequirePermissions('read')
  @Get('conversations/:id') getConversation(@Param('id') id: string) { return this.chatEngine.conversation(id); }
  @RequirePermissions('read')
  @Get('providers') supportedProviders() { return this.providers.supportedProviders(); }
}
