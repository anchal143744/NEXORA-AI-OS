
# Revenue Operations

Phase 40 introduces the enterprise revenue operations center for NEXORA AI. The layer unifies revenue accounts, contract lifecycle data, renewals, expansion opportunities, health scoring, revenue forecasts and revenue events under tenant and workspace isolation.

## Scope

- Revenue account management with ARR, TCV, lifecycle stage, renewal date and owner metadata.
- Contract lifecycle management with active contracts, amendments, obligations and renewal dates.
- Renewal intelligence with schedules, probability forecasts, playbooks and tasks.
- Churn prevention through churn signals and existing churn prediction records.
- Expansion intelligence with upsell, cross-sell and growth opportunity records.
- Account health monitoring through score trends, risks and recommendations.
- Revenue forecasting with committed, upside and downside scenarios.

## Security

Every record carries tenantId and optional workspaceId. API controllers use JWT protection and all services resolve tenant and workspace context before database access. All create operations publish registered revenue events for audit, activity and realtime consumers.
