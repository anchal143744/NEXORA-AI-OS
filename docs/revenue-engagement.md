# Revenue Engagement

Version: `0.28.0`

Phase: Phase 28 - Enterprise Customer Experience, Service Automation and Revenue Engagement.

Platform totals after this phase: 290 Prisma models and 650 controller endpoints.

## Purpose

Revenue Engagement transforms customer health, service and adoption signals into renewal, upsell, cross-sell, expansion and revenue risk workflows.

## Capabilities

- Renewal opportunities and renewal recommendations.
- Upsell opportunities from product usage and account signals.
- Cross-sell opportunities from adjacent customer needs.
- Expansion opportunities and growth recommendations.
- Revenue risk detection and mitigation actions.
- Customer value prediction from estimated value and probability.

## Data Model

- `RevenueOpportunity` stores expansion opportunity type, estimated value, probability, signals and recommendations.
- `UpsellOpportunity` stores product or service upsell signals and recommended actions.
- `CrossSellOpportunity` stores complementary product or service signals.
- `RevenueRisk` stores at-risk value, probability, drivers and mitigation actions.
- `RenewalOpportunity` connects renewal date and contract value to customer success context.

## API Surface

- `GET /v1/revenue-opportunities`
- `POST /v1/revenue-opportunities`
- `GET /v1/revenue-opportunities/upsell`
- `POST /v1/revenue-opportunities/upsell`
- `GET /v1/revenue-opportunities/cross-sell`
- `POST /v1/revenue-opportunities/cross-sell`
- `GET /v1/revenue-opportunities/risks`
- `POST /v1/revenue-opportunities/risks`
- `GET /v1/revenue-opportunities/recommendations`
- `GET /v1/revenue-opportunities/value-prediction`
- `GET /v1/revenue-opportunities/copilot`

## AI Copilot

The AI Customer Success Copilot can produce renewal recommendations, engagement recommendations, revenue expansion suggestions and service optimization insights from customer-level context.
