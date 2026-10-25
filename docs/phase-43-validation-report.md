# Phase 43 Validation Report

Version: 0.43.0
Date: 2026-06-14

## Validation Results

| npm install | PASSED - dependencies already up to date; audit remains 5 vulnerabilities (2 moderate, 3 high). |
| Prisma validate | PASSED - prisma/schema.prisma is valid. |
| Prisma generate | PASSED - Prisma Client v6.19.0 generated. |
| API TypeScript compile | PASSED - npm run api:typecheck. |
| Web TypeScript compile | PASSED - npm run web:typecheck. |
| Nest build | PASSED - npm run api:build. |
| Next build | PASSED - npm run web:build. |
| Unit tests | PASSED - Phase 43 manufacturing calculation and DTO tests. |
| Integration tests | PASSED - Phase 43 schema, module and API map tests. |

## Notes

- API TypeScript initially detected a duplicate controller member name in the manufacturing copilot controller.
- The route handler was renamed to listQueries and the API typecheck then passed.
- npm audit warnings were already present at the Phase 42 baseline and remain unchanged.

