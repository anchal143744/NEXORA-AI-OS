import { Module } from '@nestjs/common';
import { AuditModule } from '../audit/audit.module';
import { RbacModule } from '../rbac/rbac.module';
import { TenantsModule } from '../tenants/tenants.module';
import { AiCopilotController } from './ai-copilot.controller';
import { AiService } from './ai.service';
import { ConversationEngineService } from './chat/conversation-engine.service';
import { AiContextBuilderService } from './context/ai-context-builder.service';
import { AiCopilotService } from './copilot/ai-copilot.service';
import { AiInsightEngineService } from './insights/ai-insight-engine.service';
import { AiMemoryEngineService } from './memory/ai-memory-engine.service';
import { OpportunityEngineService } from './opportunities/opportunity-engine.service';
import { AiProviderRouterService } from './providers/ai-provider-router.service';
import { OpenAiProvider } from './providers/openai.provider';
import { PromptRegistry } from './prompts/prompt.registry';
import { AiRecommendationEngineService } from './recommendations/ai-recommendation-engine.service';
import { RiskDetectionEngineService } from './risks/risk-detection-engine.service';

@Module({ imports: [TenantsModule, AuditModule, RbacModule], controllers: [AiCopilotController], providers: [AiService, OpenAiProvider, PromptRegistry, AiProviderRouterService, AiCopilotService, AiContextBuilderService, AiMemoryEngineService, ConversationEngineService, AiInsightEngineService, RiskDetectionEngineService, OpportunityEngineService, AiRecommendationEngineService], exports: [AiService, PromptRegistry, AiProviderRouterService, AiCopilotService, AiContextBuilderService, AiMemoryEngineService, ConversationEngineService, AiInsightEngineService, RiskDetectionEngineService, OpportunityEngineService, AiRecommendationEngineService] })
export class AiModule {}
