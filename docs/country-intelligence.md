# Country Intelligence

The Country Intelligence Engine stores country metadata and exposes country-aware business context for downstream modules.

## Country Metadata

Stored country data includes:

- Country code and region.
- Currency code.
- Default timezone.
- Fiscal year start month.
- Tax system.
- Business hours.
- Date, number, phone and address formatting metadata.
- Public holidays.
- Country-specific business rules.

## Core Tables

- `countries`
- `country_profiles`
- `country_compliance`
- `country_tax_profiles`
- `country_business_rules`
- `country_holidays`

## Main APIs

- `GET /v1/localization/countries`
- `GET /v1/localization/countries/profile`
- `GET /v1/localization/rules/evaluate`
- `POST /v1/localization/rules/format`

## Business Adaptation

The country rule engine provides country-aware tax system metadata, invoice rules, address format, phone format, fiscal year settings and compliance warnings.