import { Module } from '@nestjs/common';
import { QueueModule } from '../../infrastructure/queues/queue.module';
import { AiModule } from '../ai/ai.module';
import { ActivityModule } from '../activity/activity.module';
import { AuditModule } from '../audit/audit.module';
import { EventsModule } from '../events/events.module';
import { RealtimeModule } from '../realtime/realtime.module';
import { TenantsModule } from '../tenants/tenants.module';
import { AgentController } from './agent.controller';
import { AgentExecutionLayerController } from './agent-execution-layer.controller';
import { AgentRuntimeService } from './agent-runtime.service';
import { AgentApprovalService } from './approvals/agent-approval.service';
import { AgentAuditTrailService } from './audit/agent-audit-trail.service';
import { AgentDecisionService } from './decisions/agent-decision.service';
import { AgentExecutionLayerService } from './execution/agent-execution-layer.service';
import { AgentGovernanceService } from './governance/agent-governance.service';
import { AgentMemoryService } from './memory/agent-memory.service';
import { AgentOutcomeService } from './outcomes/agent-outcome.service';
import { AgentAnalysisProcessor } from './processors/agent-analysis.processor';
import { AgentExecutionProcessor } from './processors/agent-execution.processor';
import { AgentRegistryService } from './registry/agent-registry.service';
import { AgentRouterService } from './router/agent-router.service';
import { AgentContextManagerService } from './runtime/agent-context-manager.service';
import { AgentExecutionService } from './runtime/agent-execution.service';
import { AgentTaskWorkflowService } from './tasks/agent-task-workflow.service';

@Module({ imports: [QueueModule, TenantsModule, AiModule, ActivityModule, EventsModule, RealtimeModule, AuditModule], controllers: [AgentController, AgentExecutionLayerController], providers: [AgentRegistryService, AgentRouterService, AgentMemoryService, AgentContextManagerService, AgentExecutionService, AgentRuntimeService, AgentExecutionProcessor, AgentAnalysisProcessor, AgentGovernanceService, AgentApprovalService, AgentExecutionLayerService, AgentDecisionService, AgentOutcomeService, AgentAuditTrailService, AgentTaskWorkflowService], exports: [AgentRuntimeService, AgentMemoryService, AgentRegistryService, AgentGovernanceService, AgentExecutionLayerService, AgentApprovalService, AgentOutcomeService] })
export class AgentModule {}