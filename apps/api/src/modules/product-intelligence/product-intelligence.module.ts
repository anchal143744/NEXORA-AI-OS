import { Module } from '@nestjs/common';
import { EventsModule } from '../events/events.module';
import { TenantsModule } from '../tenants/tenants.module';
import { EngagementController } from './controllers/engagement.controller';
import { ExperimentsController } from './controllers/experiments.controller';
import { FunnelsController } from './controllers/funnels.controller';
import { GrowthInsightsController } from './controllers/growth-insights.controller';
import { JourneysController } from './controllers/journeys.controller';
import { ProductEventsController } from './controllers/product-events.controller';
import { ProductHealthController } from './controllers/product-health.controller';
import { ProductIntelligenceController } from './controllers/product-intelligence.controller';
import { RetentionController } from './controllers/retention.controller';
import { UsageAnalyticsController } from './controllers/usage-analytics.controller';
import { ExperimentationService } from './experimentation.service';
import { FunnelAnalyticsService } from './funnel-analytics.service';
import { GrowthInsightsService } from './growth-insights.service';
import { JourneyAnalyticsService } from './journey-analytics.service';
import { ProductIntelligenceService } from './product-intelligence.service';
import { RetentionIntelligenceService } from './retention-intelligence.service';
import { UsageAnalyticsService } from './usage-analytics.service';

@Module({
  imports: [TenantsModule, EventsModule],
  controllers: [ProductIntelligenceController, ProductHealthController, UsageAnalyticsController, ProductEventsController, JourneysController, FunnelsController, ExperimentsController, RetentionController, EngagementController, GrowthInsightsController],
  providers: [ProductIntelligenceService, UsageAnalyticsService, JourneyAnalyticsService, FunnelAnalyticsService, ExperimentationService, RetentionIntelligenceService, GrowthInsightsService],
  exports: [ProductIntelligenceService, UsageAnalyticsService, JourneyAnalyticsService, FunnelAnalyticsService, ExperimentationService, RetentionIntelligenceService, GrowthInsightsService],
})
export class ProductIntelligenceModule {}
