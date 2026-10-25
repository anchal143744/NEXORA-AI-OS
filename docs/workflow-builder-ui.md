# Workflow Builder UI

Phase 18 adds the enterprise workflow workbench inside the existing adaptive frontend shell.

## Capabilities

- Metadata-driven node palette for trigger, condition, AI decision, delay, approval, action, notification, webhook, CRM, finance, HR and inventory nodes.
- Drag-and-drop node creation from the palette.
- Draggable workflow nodes on a visual canvas.
- SVG edge rendering between nodes.
- Zoom and pan controls.
- Group bands for revenue, risk and operations paths.
- Industry template selector for SaaS, Retail, Healthcare, Manufacturing, Logistics, Agency and Education.
- AI workflow generator panel for natural language blueprint generation.
- Execution console with running, queued, failed, retry, approval and AI tracked workflows.
- Monitoring tiles for success rate, latency, failed actions, pending approvals, savings and AI decision confidence.

## Frontend Files

- `apps/web/features/workflows/workflow-builder-workspace.tsx`
- `apps/web/features/workflows/workflow-types.ts`
- `apps/web/stores/workflow-builder-store.ts`
- `apps/web/services/workflow-builder-api.ts`
- `apps/web/app/page.tsx`

## Runtime Alignment

The UI is designed around the Phase 18 backend APIs:

- `/v1/workflow-builder/definitions`
- `/v1/workflow-templates`
- `/v1/workflow-executions`
- `/v1/workflow-monitoring`
- `/v1/workflow-approvals`
- `/v1/workflow-ai`
