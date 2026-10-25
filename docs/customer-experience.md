# Enterprise Customer Experience

Version: `0.28.0`

Phase: Phase 28 - Enterprise Customer Experience, Service Automation and Revenue Engagement.

Platform totals after this phase: 290 Prisma models and 650 controller endpoints.

## Purpose

The Customer Experience engine turns customer signals into operating context for support, success and revenue teams. It tracks health, journeys, lifecycle state, risk, satisfaction and feedback in a tenant-scoped model.

## Capabilities

- Customer health score calculation and trend tracking.
- Customer journey and lifecycle monitoring.
- Customer risk detection across health, churn, service and revenue risk signals.
- Customer satisfaction tracking through NPS, CSAT, CES, ratings and sentiment.
- Customer feedback capture and status tracking.
- Customer Success Dashboard data assembly.

## Data Model

- `CustomerHealthScore` stores score, band, trend, drivers, risks and recommendations.
- `CustomerJourney` stores lifecycle stage, touchpoints, milestones, blockers and next steps.
- `CustomerFeedback` stores survey or manual feedback, rating, sentiment, NPS, CSAT and CES.

## API Surface

- `GET /v1/customer-experience/dashboard`
- `GET /v1/customer-experience/journeys`
- `POST /v1/customer-experience/journeys`
- `PATCH /v1/customer-experience/journeys/:id/stage`
- `GET /v1/customer-experience/lifecycle`
- `GET /v1/customer-experience/risks`
- `GET /v1/customer-experience/satisfaction`
- `POST /v1/customer-experience/feedback`
- `GET /v1/customer-experience/copilot/health-insights`
- `GET /v1/customer-health/scores`
- `POST /v1/customer-health/scores`

## Security

Every record is tenant scoped and optionally workspace scoped. Controllers are JWT protected and events are published for audit, realtime and automation pipelines.
