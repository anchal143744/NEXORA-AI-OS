import { Module } from '@nestjs/common';
import { EventsModule } from '../events/events.module';
import { TenantsModule } from '../tenants/tenants.module';
import { ComplianceAutomationController } from './compliance/compliance-automation.controller';
import { ComplianceAutomationService } from './compliance/compliance-automation.service';
import { DataGovernanceController } from './data-governance/data-governance.controller';
import { DataGovernanceService } from './data-governance/data-governance.service';
import { PrivacyController } from './privacy/privacy.controller';
import { PrivacyAutomationService } from './privacy/privacy.service';
import { RecordsController } from './records/records.controller';
import { RecordsLifecycleService } from './records/records.service';
import { RetentionController } from './retention/retention.controller';
import { RetentionService } from './retention/retention.service';

@Module({
  imports: [TenantsModule, EventsModule],
  controllers: [DataGovernanceController, PrivacyController, RetentionController, RecordsController, ComplianceAutomationController],
  providers: [DataGovernanceService, PrivacyAutomationService, RetentionService, RecordsLifecycleService, ComplianceAutomationService],
  exports: [DataGovernanceService, PrivacyAutomationService, RetentionService, RecordsLifecycleService, ComplianceAutomationService],
})
export class GovernanceModule {}