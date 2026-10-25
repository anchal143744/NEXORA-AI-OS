import { Module } from '@nestjs/common';
import { QueueModule } from '../../infrastructure/queues/queue.module';
import { AiModule } from '../ai/ai.module';
import { ActivityModule } from '../activity/activity.module';
import { EventsModule } from '../events/events.module';
import { RealtimeModule } from '../realtime/realtime.module';
import { TenantsModule } from '../tenants/tenants.module';
import { WorkflowAiController } from './ai/workflow-ai.controller';
import { WorkflowAiService } from './ai/workflow-ai.service';
import { WorkflowApprovalController } from './approvals/workflow-approval.controller';
import { WorkflowApprovalService } from './approvals/workflow-approval.service';
import { WorkflowBuilderController } from './builder/workflow-builder.controller';
import { WorkflowBuilderService } from './builder/workflow-builder.service';
import { WorkflowExecutionConsoleController } from './console/workflow-execution-console.controller';
import { WorkflowExecutionConsoleService } from './console/workflow-execution-console.service';
import { WorkflowMonitoringController } from './monitoring/workflow-monitoring.controller';
import { WorkflowMonitoringService } from './monitoring/workflow-monitoring.service';
import { WorkflowExecutionProcessor } from './processors/workflow-execution.processor';
import { WorkflowRetryProcessor } from './processors/workflow-retry.processor';
import { WorkflowRepository } from './repositories/workflow.repository';
import { WorkflowTemplateController } from './templates/workflow-template.controller';
import { WorkflowTemplateService } from './templates/workflow-template.service';
import { WorkflowController } from './workflow.controller';
import { WorkflowExecutorService } from './workflow-executor.service';
import { WorkflowRegistryService } from './workflow-registry.service';
import { WorkflowRuntimeService } from './workflow-runtime.service';
import { WorkflowService } from './workflow.service';
import { WorkflowValidationService } from './workflow-validation.service';
import { WorkflowVersioningService } from './workflow-versioning.service';

@Module({
  imports: [QueueModule, TenantsModule, ActivityModule, EventsModule, RealtimeModule, AiModule],
  controllers: [WorkflowController, WorkflowBuilderController, WorkflowTemplateController, WorkflowExecutionConsoleController, WorkflowMonitoringController, WorkflowApprovalController, WorkflowAiController],
  providers: [WorkflowRepository, WorkflowRegistryService, WorkflowValidationService, WorkflowVersioningService, WorkflowService, WorkflowRuntimeService, WorkflowExecutorService, WorkflowExecutionProcessor, WorkflowRetryProcessor, WorkflowBuilderService, WorkflowTemplateService, WorkflowExecutionConsoleService, WorkflowMonitoringService, WorkflowApprovalService, WorkflowAiService],
  exports: [WorkflowRuntimeService, WorkflowExecutorService, WorkflowRegistryService, WorkflowBuilderService, WorkflowTemplateService, WorkflowMonitoringService],
})
export class WorkflowModule {}
