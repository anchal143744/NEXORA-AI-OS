# Extension Framework

Phase: 21
Version: 0.21.0

## Purpose

The extension framework gives marketplace apps a governed way to extend NEXORA modules, events, workflows, UI surfaces and APIs.

## Backend Surface

API group: `/v1/extensions`

- `GET /sdk` returns SDK contracts, supported runtimes, hook types, extension point types and isolation requirements.
- `GET /definitions` lists extension definitions.
- `POST /definitions` creates an extension definition.
- `GET /hooks` lists registered hooks.
- `POST /definitions/:id/hooks` registers event, workflow, module or API hooks.
- `GET /extension-points` lists UI, API, workflow and module extension points.
- `POST /definitions/:id/extension-points` registers extension points for a definition.

## Data Model

- `ExtensionDefinition` identifies an app extension, runtime, module key, entrypoint, version and permission scopes.
- `ExtensionHook` stores event/workflow/module/API subscriptions with priority, retry policy, filters and handler config.
- `ExtensionPoint` stores UI/API/workflow/module insertion contracts and schemas.

## Security Model

Extensions are tenant-isolated and permission-scoped. High-risk extension behavior is represented through app permissions and installation grants so approval and review policies can be layered on top.

## Events

- `extension.hook.registered`

## Supported Extension Types

- Module extensions.
- Event hooks.
- Workflow hooks.
- UI extension points.
- API extension points.