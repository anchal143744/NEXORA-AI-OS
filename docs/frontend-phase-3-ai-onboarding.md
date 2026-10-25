# NEXORA AI OS Phase 3 - AI Business Setup Wizard and Intelligent Workspace Generation

## Architecture Summary

Phase 3 replaces the traditional setup wizard with a conversational AI-guided onboarding experience. The new flow is mounted on the existing /onboarding route through the existing OnboardingFlow export, so future routes and auth redirects continue working.

The implementation reuses:

- Phase 1 design system primitives
- Phase 2 authentication session storage and tenant context
- Existing adaptive workspace API client
- Existing local workspace intelligence engine for live preview recommendations
- Existing backend /v1/adaptive-workspace/generate-workspace endpoint for final generation

The success experience is only shown after the backend generation call returns successfully.

## Files Added and Modified

Added:

- apps/web/features/onboarding/ai-business-setup-wizard.tsx
- apps/web/lib/onboarding-intelligence.ts
- tests/phase3-ai-onboarding.test.mjs
- docs/frontend-phase-3-ai-onboarding.md

Modified:

- apps/web/features/onboarding/onboarding-flow.tsx
- apps/web/services/workspace-intelligence-api.ts
- apps/web/types/discovery.ts
- package.json
- apps/web/package.json
- package-lock.json
- tests/phase2-landing-auth.test.mjs

## Onboarding Flow Diagram

~~~mermaid
flowchart TD
  Identity["Business identity"] --> Global["Global context"]
  Global --> Operations["Operating model"]
  Operations --> Goals["Goals and AI preferences"]
  Goals --> Preview["Live workspace preview"]
  Preview --> Generate["Backend workspace generation"]
  Generate --> Success["Success and Open Workspace"]
  Generate --> Error["Real error state"]
~~~

## Workspace Generation Flow

~~~mermaid
sequenceDiagram
  participant User
  participant UI as Conversational Onboarding
  participant Local as Local Intelligence Engine
  participant API as Adaptive Workspace API
  User->>UI: Enters profile context
  UI->>Local: Build live recommendations
  Local-->>UI: Modules, KPIs, reports, agents, permissions
  User->>UI: Reviews preview
  User->>UI: Generate workspace
  UI->>API: POST /v1/adaptive-workspace/generate-workspace
  API-->>UI: Persisted blueprint result
  UI-->>User: Success and Open Workspace
~~~

## Validation Report

Required commands:

- npm.cmd run web:lint
- npm.cmd run web:typecheck
- node --test tests/phase51-frontend-foundation.test.mjs tests/phase2-landing-auth.test.mjs tests/phase3-ai-onboarding.test.mjs
- npm.cmd run web:build

## Manual Browser Verification Checklist

- Open /onboarding and confirm the conversational onboarding shell appears.
- Confirm progress updates across identity, global, operations, goals, preview and generate.
- Confirm autosave status appears and profile values survive refresh.
- Confirm live recommendations update when industry, departments, goals and AI preferences change.
- Confirm validation blocks empty business name, founder, invalid email, employee count and missing goals.
- Confirm preview shows sidebar, dashboard, modules, KPIs, reports, AI agents and workspace summary.
- Confirm generation shows staged progress.
- Confirm generation success appears only after the backend responds.
- Confirm unauthenticated generation shows the real organization-context error.
- Confirm responsive behavior on desktop, tablet and mobile.

## Product Evolution Report

NEXORA now feels less like a setup form and more like an AI business consultant. The onboarding experience translates simple business answers into workspace structure, intelligence recommendations and a governed backend generation call.

## Phase Completion Report

Phase 3 is complete when validation passes and physical verification confirms all files exist.

## Next Phase Plan

Phase 4 should connect the generated workspace outcome to the first-run workspace launch experience, team invitation, initial module activation review and first executive command center handoff.
