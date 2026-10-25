# AI Context Assembly

The AI Context Assembler prepares relevant business context before AI execution. It does not implement AI Copilot behavior; it creates the context package AI services can consume safely.

## Inputs

- Workspace id.
- Business id.
- User id.
- Focus entity id.

## Context Package

`AiContextAssemblerService` assembles:

- Relevant KPIs.
- Relevant revenue.
- Relevant customers.
- Relevant projects.
- Relevant employees and departments.
- Relevant workflows.
- Relevant goals.
- Entity network.
- Business memory.

## Dependency Services

- `ContextEngineService` for operational context.
- `GraphQueryService` for entity networks and dependency paths.

## API Surface

- `GET /v1/knowledge-graph/ai-context`

## Boundary

Phase 13 stops at context assembly. It does not start AI Copilot, localization or a new KPI engine.