# Multi-Language Foundation

Phase 14 introduces a database-backed translation foundation and a fixed supported language registry.

## Supported Languages

- English
- Spanish
- French
- German
- Italian
- Portuguese
- Arabic
- Hindi
- Chinese
- Japanese
- Korean
- Russian
- Turkish
- Dutch
- Vietnamese
- Thai

## Core Tables

- `languages`
- `translations`
- `translation_keys`
- `translation_values`

## Main APIs

- `GET /v1/localization/languages`
- `GET /v1/localization/translations`
- `POST /v1/localization/translations`

## Translation Model

Translation keys are stored by namespace and key. Translation values are stored by language code and locale, allowing shared language defaults and locale-specific overrides.