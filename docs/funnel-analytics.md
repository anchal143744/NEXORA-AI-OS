# Funnel Analytics

Version: 0.29.0

Funnel Analytics models conversion paths such as signup, onboarding, workspace creation, customer conversion, revenue and retention. The engine stores stages, results, bottlenecks and optimization recommendations.

## Capabilities

- Funnel definitions with ordered stages.
- Funnel result recording and conversion measurement.
- Drop-off detection and bottleneck analysis.
- Recommendations for conversion optimization.
- Cross-linking to journeys, product events, retention and growth insights.

## API Groups

- /v1/journeys
- /v1/funnels
- /v1/growth-insights

## Database Models

- UserJourney
- JourneyStep
- FunnelDefinition
- FunnelStage
- FunnelResult
- GrowthRecommendation

## Security

Funnel records inherit tenant and workspace isolation. Result payloads are stored as structured JSON so sensitive details can be filtered by policy before AI retrieval.

## Phase Gate

- Version: 0.29.0
- Phase: Phase 29 - Enterprise Product Intelligence, Usage Analytics and Growth Experimentation
- Documentation Status: Passed
