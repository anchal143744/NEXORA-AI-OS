# AI Architecture

## Purpose

Phase 2 creates AI service boundaries without implementing business-specific agents or workflows.

## Components

- `LlmProvider` contract
- `OpenAiProvider` implementation boundary
- `AiService` orchestration boundary
- `PromptRegistry` for versioned prompt definitions
- BullMQ `ai` queue foundation
- AI realtime channel foundation

## Provider Abstraction

The backend must call AI models through provider contracts, not directly from business modules. This keeps OpenAI replaceable and allows future support for routing, fallback, auditing, and enterprise policy checks.

## Prompt Management

Prompts are registered by key and version. Future implementation should persist prompts in the database, require review for production prompts, and log prompt versions with AI outputs.

## Safety Boundaries

Before any AI provider call, later phases must add:

- Tenant context validation
- Permission checks
- Prompt resolution
- Data redaction
- Tool permission checks
- Audit logging
- Usage metering
- Human approval for sensitive actions

Business-specific copilots and agents are intentionally excluded from Phase 2.
