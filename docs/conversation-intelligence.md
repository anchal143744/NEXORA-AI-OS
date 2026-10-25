# Conversation Intelligence

Version: `0.27.0`

Phase: Phase 27 - Enterprise Voice AI, Contact Center and Omnichannel Engagement.

Platform totals after this phase: 275 Prisma models and 590 controller endpoints.

## Purpose

Conversation Intelligence converts raw customer conversations into actionable business context for support, sales, appointments, follow-ups and escalation decisions.

## Capabilities

- Sentiment analysis for customer tone and urgency.
- Intent detection for billing, scheduling, retention, sales and support.
- Conversation summaries with decisions, actions, follow-ups and risk signals.
- Action extraction for follow-up work.
- Risk detection and severity classification.
- Escalation recommendation for contact-center routing.
- Conversation insight aggregation across sentiment, intent, summary and escalation records.

## Data Model

- `SentimentRecord` stores sentiment, score, confidence, source text and related conversation/message/voice/customer references.
- `IntentRecord` stores detected intent, category, confidence and entities.
- `ConversationSummary` stores generated summaries, decisions, action items, follow-ups, risks and sentiment context.

## API Surface

- `POST /v1/conversation-intelligence/sentiment`
- `POST /v1/conversation-intelligence/intent`
- `POST /v1/conversation-intelligence/summaries`
- `GET /v1/conversation-intelligence/conversations/:id/insights`
- `POST /v1/conversation-intelligence/action-extraction`
- `POST /v1/conversation-intelligence/risk-detection`
- `POST /v1/conversation-intelligence/escalation-recommendation`
- `POST /v1/messages/:id/sentiment`
- `POST /v1/messages/:id/intent`
- `GET /v1/messages/:id/context`

## AI Agent Integration

AI Voice Agents can read customer identity, conversation history, transcript history, sentiment, intent and risk records before planning actions. Higher-risk voice actions can require approval or human handoff.
