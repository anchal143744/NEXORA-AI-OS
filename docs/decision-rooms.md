# Decision Rooms

Date: 2026-06-13
Version: 0.25.0
Phase: Phase 25 - Enterprise Collaboration, Knowledge Spaces and Decision Rooms
Database Model Count: 242
API Count: 477

## Purpose

Decision Rooms provide a structured operating space for strategic and operational decisions. Participants, votes, approvals, AI recommendations and final decisions are preserved as searchable business history.

## Capabilities

- Decision sessions and room context.
- Participant tracking.
- Weighted voting.
- Approval workflows.
- Decision records and history.
- Search indexing for decision rooms and outcomes.

## Data Models

- `DecisionRoom`
- `DecisionParticipant`
- `DecisionVote`
- `DecisionApproval`
- `DecisionRecord`

## APIs

- `GET /v1/decision-rooms`
- `POST /v1/decision-rooms`
- `GET /v1/decision-rooms/search`
- `GET /v1/decision-rooms/:id`
- `POST /v1/decision-rooms/:id/participants`
- `POST /v1/decision-rooms/:id/votes`
- `POST /v1/decision-rooms/:id/approvals`
- `POST /v1/decision-rooms/:id/approvals/:approvalId/decide`
- `POST /v1/decision-rooms/:id/records`
- `GET /v1/decision-rooms/:id/history`

## Events

- `decision.room.created`
- `decision.vote.cast`
- `decision.approval.decided`
- `decision.record.created`