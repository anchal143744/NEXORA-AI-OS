# Timezone Engine

The Timezone Engine provides timezone metadata, locale-aware timezone profiles and conversion support.

## Capabilities

- User timezone foundation.
- Workspace timezone foundation.
- Organization timezone foundation.
- Country timezone lookup.
- Automatic time conversion.
- Business hours metadata.
- Holiday-aware country profiles.

## Core Tables

- `locale_profiles`
- `country_holidays`
- `language_preferences`

## Main APIs

- `GET /v1/localization/timezones`
- `POST /v1/localization/timezones/convert`

## Boundary

This phase implements timezone intelligence and conversion foundations. Calendar scheduling automation remains outside Phase 14.