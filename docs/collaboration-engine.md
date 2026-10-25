# Collaboration Engine

Date: 2026-06-13
Version: 0.25.0
Phase: Phase 25 - Enterprise Collaboration, Knowledge Spaces and Decision Rooms
Database Model Count: 242
API Count: 477

## Purpose

The Collaboration Engine powers discussions, threaded conversations, mentions, reactions, activity feeds and action items. It connects day-to-day collaboration to NEXORA workflows, search, decisions and AI memory.

## Capabilities

- Discussions and threaded replies.
- Mentions for users and teams.
- Reactions on messages.
- Activity feeds for spaces and workspaces.
- Collaboration action items with owners, due dates and completion state.

## Data Models

- `Discussion`
- `DiscussionThread`
- `DiscussionMessage`
- `CollaborationMention`
- `CollaborationReaction`
- `CollaborationActivity`
- `CollaborationActionItem`

## APIs

- `GET /v1/discussions`
- `POST /v1/discussions`
- `GET /v1/discussions/search`
- `POST /v1/discussions/:id/threads`
- `POST /v1/discussions/:id/messages`
- `POST /v1/discussions/messages/:id/mentions`
- `POST /v1/discussions/messages/:id/reactions`
- `GET /v1/collaboration/activity`
- `GET /v1/collaboration/mentions`
- `GET /v1/collaboration/action-items`
- `POST /v1/collaboration/action-items`

## Events

- `discussion.created`
- `discussion.message.created`
- `collaboration.action_item.created`