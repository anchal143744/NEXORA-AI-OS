import { Module } from '@nestjs/common';

import { TenantsModule } from '../tenants/tenants.module';

import { AdaptiveWorkspaceController } from './adaptive-workspace.controller';

import { WorkspaceBlueprintService } from './blueprints/workspace-blueprint.service';
import { BusinessClassificationService } from './classification/business-classification.service';
import { DashboardGeneratorService } from './generators/dashboard-generator.service';
import { ModuleActivationService } from './generators/module-activation.service';
import { NavigationGeneratorService } from './generators/navigation-generator.service';
import { WorkspaceRecommendationEngine } from './recommendations/recommendation-engine.service';
import { AdaptiveWorkspaceRepository } from './repositories/adaptive-workspace.repository';
import { IndustryRegistryService } from './registry/industry-registry.service';

@Module({
  imports: [
    TenantsModule,
  ],

  controllers: [
    AdaptiveWorkspaceController,
  ],

  providers: [
    BusinessClassificationService,
    IndustryRegistryService,
    WorkspaceBlueprintService,
    DashboardGeneratorService,
    ModuleActivationService,
    NavigationGeneratorService,
    WorkspaceRecommendationEngine,
    AdaptiveWorkspaceRepository,
  ],

  exports: [
    BusinessClassificationService,
    IndustryRegistryService,
    WorkspaceBlueprintService,
    DashboardGeneratorService,
    ModuleActivationService,
    NavigationGeneratorService,
    WorkspaceRecommendationEngine,
    AdaptiveWorkspaceRepository,
  ],
})
export class AdaptiveWorkspaceModule {}