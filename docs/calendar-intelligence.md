# Calendar Intelligence

Date: 2026-06-13
Version: 0.26.0
Phase: Phase 26 - Enterprise Communications, Meetings and Calendar Intelligence
Database Model Count: 264
API Count: 533

## Purpose

Calendar Intelligence provides personal, team, department and company calendars with timezone-aware events, participants, availability windows and recurrence metadata.

## Capabilities

- Personal calendars.
- Team calendars.
- Department calendars.
- Company calendars.
- Event management.
- Calendar participants.
- Availability management.
- Timezone-aware scheduling metadata.

## Data Models

- `Calendar`
- `CalendarEvent`
- `CalendarParticipant`
- `AvailabilityWindow`

## APIs

- `/v1/calendars`
- `/v1/calendar-events`
- `/v1/availability`

## Search Integration

Calendar events are indexed into enterprise search with time, calendar and event metadata for future Copilot retrieval.