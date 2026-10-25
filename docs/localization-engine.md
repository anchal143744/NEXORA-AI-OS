# Localization Engine

Phase 14 adds a tenant-aware localization foundation for NEXORA AI. The backend module lives at `apps/api/src/modules/localization` and is registered in `AppModule`.

## Capabilities

- Language detection from locale or Accept-Language style input.
- Country detection from explicit country, locale region or timezone.
- Region and timezone profile lookup through locale profiles.
- User, workspace and organization locale preferences through scoped language preferences.
- Tenant-isolated localization settings.

## Core Tables

- `languages`
- `locale_profiles`
- `language_preferences`

## Main APIs

- `GET /v1/localization/settings`
- `POST /v1/localization/settings`
- `GET /v1/localization/languages`
- `GET /v1/localization/timezones`

## Design Notes

Localization is a foundation layer only. It prepares the platform for global behavior without implementing multi-currency accounting or frontend localization screens in this phase.