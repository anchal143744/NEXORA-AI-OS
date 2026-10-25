# OAuth System

The OAuth system supports OAuth2 authorization URLs, refresh token rotation, connection validation and revocation. OAuth tokens are encrypted through the CredentialVault before persistence.

Token lifecycle events publish connector and API key domain events for downstream audit and realtime routing.
