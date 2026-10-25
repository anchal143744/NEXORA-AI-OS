import { Module } from '@nestjs/common';
import { EventsModule } from '../events/events.module';
import { TenantsModule } from '../tenants/tenants.module';
import { AiAuditComplianceService } from './ai-audit-compliance.service';
import { AiExplainabilityService } from './ai-explainability.service';
import { AiGovernanceService } from './ai-governance.service';
import { AiAuditController } from './controllers/ai-audit.controller';
import { AiComplianceController } from './controllers/ai-compliance.controller';
import { AiExplainabilityController } from './controllers/ai-explainability.controller';
import { AiGovernanceController } from './controllers/ai-governance.controller';
import { DecisionIntelligenceController } from './controllers/decision-intelligence.controller';
import { ModelOpsController } from './controllers/modelops.controller';
import { ModelPerformanceController } from './controllers/model-performance.controller';
import { ModelRegistryController } from './controllers/model-registry.controller';
import { DecisionIntelligenceService } from './decision-intelligence.service';
import { ModelOpsService } from './modelops.service';
import { ModelPerformanceService } from './model-performance.service';
import { ModelRegistryService } from './model-registry.service';

@Module({
  imports: [TenantsModule, EventsModule],
  controllers: [AiGovernanceController, ModelRegistryController, ModelOpsController, DecisionIntelligenceController, AiAuditController, AiComplianceController, AiExplainabilityController, ModelPerformanceController],
  providers: [AiGovernanceService, ModelRegistryService, ModelOpsService, DecisionIntelligenceService, AiAuditComplianceService, AiExplainabilityService, ModelPerformanceService],
  exports: [AiGovernanceService, ModelRegistryService, ModelOpsService, DecisionIntelligenceService, AiAuditComplianceService, AiExplainabilityService, ModelPerformanceService],
})
export class AiGovernanceModule {}