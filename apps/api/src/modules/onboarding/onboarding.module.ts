import { Module } from '@nestjs/common';
import { AdaptiveWorkspaceModule } from '../adaptive-workspace/adaptive-workspace.module';
import { AiModule } from '../ai/ai.module';
import { EventsModule } from '../events/events.module';
import { TenantsModule } from '../tenants/tenants.module';
import { CustomerOnboardingController } from './customer-onboarding/customer-onboarding.controller';
import { CustomerOnboardingService } from './customer-onboarding/customer-onboarding.service';
import { DataImportController } from './data-import/data-import.controller';
import { DataImportService } from './data-import/data-import.service';
import { MigrationController } from './migrations/migration.controller';
import { MigrationService } from './migrations/migration.service';

@Module({
  imports: [TenantsModule, EventsModule, AiModule, AdaptiveWorkspaceModule],
  controllers: [DataImportController, MigrationController, CustomerOnboardingController],
  providers: [DataImportService, MigrationService, CustomerOnboardingService],
  exports: [DataImportService, MigrationService, CustomerOnboardingService],
})
export class OnboardingModule {}
