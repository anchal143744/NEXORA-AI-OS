# Communications Center

Date: 2026-06-13
Version: 0.26.0
Phase: Phase 26 - Enterprise Communications, Meetings and Calendar Intelligence
Database Model Count: 264
API Count: 533

## Purpose

The Communications Center provides tenant-aware communication channels, conversations, messages, announcements, reactions, attachments, read receipts and searchable communication history.

## Capabilities

- Team channels.
- Department channels.
- Direct messages.
- Group conversations.
- Announcements and recipients.
- Message reactions and file references.
- Read receipts and message search.

## Data Models

- `CommunicationChannel`
- `CommunicationMember`
- `Conversation`
- `Message`
- `MessageAttachment`
- `MessageReaction`
- `Announcement`
- `AnnouncementRecipient`

## APIs

- `/v1/communications`
- `/v1/conversations`
- `/v1/messages`
- `/v1/announcements`

## Security

Communication records are tenant scoped, workspace scoped and indexed through the enterprise search foundation with internal sensitivity defaults.