# Omnichannel Engine

Version: `0.27.0`

Phase: Phase 27 - Enterprise Voice AI, Contact Center and Omnichannel Engagement.

Platform totals after this phase: 275 Prisma models and 590 controller endpoints.

## Purpose

The Omnichannel Engine unifies email, WhatsApp, SMS, live chat, voice calls and internal messages into the existing NEXORA communication graph. It creates one customer communication history across channels.

## Capabilities

- Unified communication channel management.
- Customer identity resolution across email, phone, external IDs and channel identities.
- Conversation participants for customers, users, agents and systems.
- Single customer timeline across messages, voice sessions, summaries, assignments and escalations.
- Omnichannel message synchronization into the existing `Message` model.
- Search indexing hook for synchronized omnichannel messages.

## Data Model

- Reuses `CommunicationChannel`, `Conversation` and `Message` from Phase 26.
- `ConversationParticipant` links conversations to users and customer identities.
- `CustomerIdentity` stores lifecycle stage, risk level, external references and channel identities.

## API Surface

- `GET /v1/communication-channels`
- `POST /v1/communication-channels`
- `GET /v1/communication-channels/omnichannel`
- `GET /v1/communication-channels/:id/health`
- `GET /v1/customer-identity`
- `POST /v1/customer-identity`
- `GET /v1/customer-identity/:id`
- `GET /v1/customer-identity/:id/timeline`
- `POST /v1/customer-identity/resolve`
- `GET /v1/conversations/:id/participants`
- `POST /v1/conversations/:id/participants`
- `GET /v1/conversations/:id/timeline`
- `GET /v1/conversations/:id/omnichannel-context`
- `POST /v1/messages/sync`
- `POST /v1/messages/:id/sync`

## Security

Customer identity and communication records are tenant scoped. Workspace filters are applied to list and timeline endpoints, and synchronized messages publish auditable omnichannel events.
