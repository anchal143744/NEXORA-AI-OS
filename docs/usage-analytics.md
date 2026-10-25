# Usage Analytics

Version: 0.29.0

The Usage Analytics layer captures product behavior across users, teams, modules and workspaces. It is designed for enterprise-scale event ingestion, feature adoption tracking and session analytics.

## Capabilities

- Event tracking for product activity and product behavior.
- User activity analytics and session analytics.
- Feature usage analytics by module, workspace and team.
- Workspace, team and module analytics endpoints.
- Usage metrics that feed product health, retention and AI recommendations.

## API Groups

- /v1/usage-analytics
- /v1/events
- /v1/engagement

## Database Models

- ProductUsageMetric
- ProductEvent
- SessionAnalytics
- FeatureUsage
- EngagementScore

## Operational Notes

Usage analytics is tenant scoped, workspace scoped and event driven. Product events can be indexed later by the knowledge search and semantic retrieval layer without breaking the API contract.

## Phase Gate

- Version: 0.29.0
- Phase: Phase 29 - Enterprise Product Intelligence, Usage Analytics and Growth Experimentation
- Documentation Status: Passed
