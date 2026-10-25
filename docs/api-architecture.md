# API Architecture

## API Foundation

The API uses NestJS with URI versioning under `/api/v1`. Swagger is exposed at `/docs` after backend dependencies are installed and the server runs.

## Standards

- Global validation pipe with whitelist and transform enabled.
- Global exception filter for consistent error responses.
- Global response interceptor for standard success envelopes.
- DTO-first request validation.
- Zod validation pipe available for schema-driven DTOs.
- OpenAPI decorators should be added when business endpoints are implemented.

## Response Shape

Success:

```json
{
  "success": true,
  "data": {},
  "meta": { "timestamp": "ISO_DATE" }
}
```

Error:

```json
{
  "success": false,
  "error": { "code": "ErrorName", "message": "Human readable message" },
  "meta": { "path": "/api/v1/...", "method": "GET", "timestamp": "ISO_DATE" }
}
```

## DTO Strategy

- Request DTOs live close to their module.
- Shared DTO contracts graduate into `packages/types` only when consumed by more than one app/package.
- DTOs use class-validator for NestJS/OpenAPI compatibility.
- Zod schemas may be used for runtime shared contracts and environment validation.
