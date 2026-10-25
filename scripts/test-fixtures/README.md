# Disposable runtime fixtures

The CRM and V1 runtime suites exercise the real application, signup, login, sessions and authorization guards. Their multi-user setup provisions synthetic persisted memberships in a disposable test database. This helper is test setup and does not add an invitation endpoint to the application.

Before running `npm run crm:rbac`, `npm run api:e2e` or `npm run v1:runtime`:

- Use a fresh PostgreSQL database on loopback, with `test` as a separate segment in its name, such as `nexora_ci_test`.
- Set `DATABASE_URL` to that database and explicitly set `NEXORA_TEST_DATABASE_DISPOSABLE=true` in the test process environment.
- Apply the schema only to that disposable database, build the API, configure private synthetic test secrets and disable external email delivery and AI drafts.
- Never use a business database or reuse an already running application. The API health suite starts and stops its own process on an ephemeral port.

GitHub validation creates its own PostgreSQL and Redis services. All original validation suites remain enabled. The database guard and fixture authorization unit tests can run without a database using `node --test tests/runtime-membership-fixtures.test.mjs`.
