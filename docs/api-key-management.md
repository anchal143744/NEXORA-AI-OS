# API Key Management

API keys are generated once, hashed with SHA-256 and stored by hash only. The API key layer supports scopes, permissions, rotation, revocation, expiry and audit events.

Raw keys are returned only at creation or rotation time.
