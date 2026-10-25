# Staging Performance Report

## Metrics

- Page load: measured through staged web route probes and Lighthouse.
- Dashboard render: validated through command center and workspace launcher route timings.
- Route transitions: validated by production build output and manual browser QA.
- AI response latency: validated when provider credentials are configured in staging.
- Bundle size: measured by `npm.cmd run web:build` output.
- API latency: measured by health and readiness probes.

## Budgets

- Web route p95 under 750 ms for local SRC load probes.
- API health p95 under 750 ms for local SRC load probes.
- Lighthouse Performance >=95 on hosted staging.

## Automation

Run `npm.cmd run staging:load` after staging services are online.
