# Meeting Intelligence

Date: 2026-06-13
Version: 0.26.0
Phase: Phase 26 - Enterprise Communications, Meetings and Calendar Intelligence
Database Model Count: 264
API Count: 533

## Purpose

Meeting Intelligence turns meetings into structured operating memory with agendas, participants, decisions, action items, summaries, risks and follow-up recommendations.

## Capabilities

- Meeting creation and participant management.
- Meeting agendas and meeting notes foundations.
- Meeting decisions and action items.
- Meeting templates and history.
- AI summaries, decision extraction, risk identification and action extraction.

## Data Models

- `Meeting`
- `MeetingParticipant`
- `MeetingAgenda`
- `MeetingDecision`
- `MeetingActionItem`
- `MeetingSummary`

## APIs

- `/v1/meetings`
- `/v1/meeting-summaries`

## AI Contract

Meeting summaries preserve source references, provider metadata, model metadata, decisions, action items, risks and follow-ups for auditability and retrieval.