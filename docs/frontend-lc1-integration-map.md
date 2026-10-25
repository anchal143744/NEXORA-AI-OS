# LC1 Integration Map

## Shell

- Sidebar: generated from workspace module registry and permission filtering.
- Top navigation: global search, command palette, notification center, settings, AI dock and profile actions.
- Breadcrumbs: mounted once in the enterprise shell for every workspace route.

## Navigation Routes

- `/workspace/inventory` renders the integrated module workspace for Inventory.
- `/workspace/projects` renders the integrated module workspace for Projects.
- `/workspace/documents` renders the integrated module workspace for Documents.
- `/workspace/workflows` renders the integrated module workspace for Workflows.
- `/workspace/integrations` renders the integrated module workspace for Integrations.
- `/settings` renders unified workspace settings.

## Universal Search

Search sources:

- Workspace modules
- Pages
- Customers, leads and opportunities
- Projects and tasks
- Invoices and employees
- Reports
- AI agents
- Recent items
- Settings

Consumers:

- `GlobalSearch`
- `CommandPalette`

## Notifications

Notification sources:

- Workspace notification widgets
- KPI risk signals
- Report readiness
- AI context status
- Security and settings guidance

Consumers:

- `NotificationCenter`
- Unified settings notification tab

## AI Context

AI context remains owned by the workspace and AI providers. LC1 connects command search and module routes to the same workspace data so AI commands have the same module, KPI, report and permission context that users see in the UI.
