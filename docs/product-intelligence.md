# Product Intelligence

Version: 0.29.0

Phase 29 adds Enterprise Product Intelligence to NEXORA AI. The module converts product activity into product health, feature adoption, user journeys, product risks and AI growth recommendations while preserving tenant and workspace isolation.

## Scope

- Product health scoring and product success metrics.
- Feature adoption and product usage insight services.
- User behavior tracking through product events and sessions.
- Product risk detection using engagement, churn and adoption signals.
- AI Product Copilot recommendations connected to product, customer and revenue context.

## Backend Services

- ProductIntelligenceService
- UsageAnalyticsService
- JourneyAnalyticsService
- FunnelAnalyticsService
- ExperimentationService
- RetentionIntelligenceService
- GrowthInsightsService

## API Groups

- /v1/product-intelligence
- /v1/product-health
- /v1/usage-analytics
- /v1/events
- /v1/growth-insights

## Database Models

- ProductHealthScore
- ProductUsageMetric
- ProductEvent
- SessionAnalytics
- FeatureUsage
- EngagementScore
- GrowthRecommendation

## Security

All records carry tenant and workspace identifiers. Services resolve request context through the tenant context layer and write product intelligence events through the event bus for auditability.

## Phase Gate

- Version: 0.29.0
- Phase: Phase 29 - Enterprise Product Intelligence, Usage Analytics and Growth Experimentation
- Documentation Status: Passed
