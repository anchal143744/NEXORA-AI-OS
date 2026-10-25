# Data Import Engine

Phase 20 adds enterprise data import foundations.

## Capabilities

- CSV import with server-side parsing.
- Excel workbook row ingestion through structured sheet payloads.
- Validation rules for required fields.
- Error reporting through persisted import errors.
- Import batches and row records for bulk processing.
- Processing endpoint that marks valid rows and reports completed state.

## API Group

- `/v1/data-import`

## Models

- `DataImportJob`
- `DataImportBatch`
- `DataImportRecord`
- `DataImportError`
