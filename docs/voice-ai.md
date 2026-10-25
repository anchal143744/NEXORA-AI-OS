# Enterprise Voice AI

Version: `0.27.0`

Phase: Phase 27 - Enterprise Voice AI, Contact Center and Omnichannel Engagement.

Platform totals after this phase: 275 Prisma models and 590 controller endpoints.

## Purpose

The Voice AI layer gives NEXORA AI governed voice sessions, transcript capture, provider abstraction and voice command execution. It is tenant scoped, workspace aware and designed to feed contact-center, customer identity and conversation intelligence workflows.

## Capabilities

- Voice session tracking for inbound and outbound calls.
- Speech-to-text provider contracts for OpenAI, Azure Speech and local batch providers.
- Text-to-speech provider contracts with tenant-scoped voice options.
- Transcript segment capture with speaker type, confidence, language and offsets.
- Voice command processing with intent, risk scoring and approval-aware action execution.
- Voice conversation history connected to customer identity and conversations.
- Voice session lifecycle tracking from active to completed.

## Data Model

- `VoiceSession` stores tenant, workspace, customer, channel, queue, assigned agent, direction, provider, status, language, call timing and transcript status.
- `VoiceTranscript` stores per-session transcript segments with speaker metadata, language and confidence.
- `VoiceAgentExecution` stores voice action execution state, risk level, approval status, plan, actions and output.

## API Surface

- `GET /v1/voice-ai/sessions`
- `POST /v1/voice-ai/sessions`
- `GET /v1/voice-ai/sessions/:id`
- `POST /v1/voice-ai/sessions/:id/end`
- `GET /v1/voice-ai/sessions/:id/transcripts`
- `POST /v1/voice-ai/sessions/:id/transcripts`
- `GET /v1/voice-ai/speech-to-text/providers`
- `GET /v1/voice-ai/text-to-speech/providers`
- `POST /v1/voice-ai/commands/process`
- `POST /v1/voice-ai/actions/execute`
- `GET /v1/voice-ai/history`

## Security

All records carry tenant isolation, optional workspace isolation, audit-ready events and JWT-protected controllers. Voice commands are risk scored before execution so higher-risk actions can require approval.
