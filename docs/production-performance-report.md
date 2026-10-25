# Production Performance Report

## Initial Load

The latest clean Next production build completed and generated 235 static pages.

## Dashboard Render Time

Dashboard render against live API data remains unverified in production because the Redis-backed API is unavailable locally.

## Route Transition Speed

Frontend route smoke and SRC audits passed. Runtime browser transition measurement requires hosted deployment instrumentation.

## AI Response Time

AI response time remains provider-environment dependent and must be measured after production AI credentials are configured.

## Bundle Size

Next production build completed successfully in the latest SRC validation. Bundle budgets should be enforced in CI before the final `v2.0.0` tag.

## API And Queue Performance

API and queue throughput are blocked until Redis and worker services are online.