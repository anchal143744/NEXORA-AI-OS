# Privacy Automation

Phase: 23
Version: 0.23.0

## Purpose

Privacy Automation provides enterprise workflows for GDPR, CCPA and subject rights operations including access, deletion, export and consent review.

## API Surface

API group: `/v1/privacy`

- `GET /workflows` returns supported privacy workflows.
- `GET /consents` lists consent records.
- `POST /consents` creates or updates consent.
- `GET /requests` lists privacy requests.
- `POST /requests` creates privacy requests.
- `POST /requests/:id/run-workflow` starts workflow execution for a request.
- `POST /requests/:id/complete` completes a privacy request.
- `GET /requests/:id/access-package` generates a subject access package shape.
- `GET /requests/:id/deletion-plan` generates a deletion workflow plan.

## Data Model

- `PrivacyConsentRecord` stores consent key, purpose, lawful basis, status and evidence.
- `PrivacyRequest` stores subject request metadata, due dates, verification and outcome.
- `PrivacyWorkflowRun` stores workflow steps and execution status.

## Events

- `privacy.request.created`.
- `privacy.request.completed`.
- `privacy.consent.updated`.