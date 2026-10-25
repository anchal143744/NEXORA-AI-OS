# Local development

Run commands from the `NEXORA_AI` repository root. This checkout uses PostgreSQL 16 and a private root `.env`; Prisma requires `DATABASE_URL`. `.env.example` and `.env.production.example` are templates, not working credentials.

## Current machine setup

A separate project-owned PostgreSQL cluster lives in the ignored `.local/postgres` directory and listens only on `127.0.0.1:5433`. Its development role uses credentials already supplied by the original project's local configuration. The database has a unique development name, recorded without credentials in `.local/dev-database.json`. The existing PostgreSQL Windows service on port 5432 was left untouched.

The checked-in migrations were applied to this newly created empty database. Startup does not run migrations or reset data. Keep `.env` and `.local/` private and preserve the database directory when retaining development data.

Another application occupies ports 3000 and 4000, so this checkout's `.env` selects:

```dotenv
NODE_ENV=development
PORT=4001
NEXORA_WEB_PORT=3001
NEXORA_API_INTERNAL_URL=http://localhost:4001
NEXT_PUBLIC_API_URL=/api
APP_URL=http://localhost:3001
CORS_ORIGINS=http://localhost:3001
REDIS_DISABLED=true
```

`DATABASE_URL` and a securely generated local `JWT_SECRET` are configured privately. Do not substitute template credentials into an existing database. The Docker Compose credentials and database name differ from `.env.example`; this machine uses the separate native PostgreSQL cluster rather than that Compose profile.

## Start and check

```powershell
npm.cmd run db:start:local
npm.cmd run db:check
npm.cmd run dev
```

The launcher also starts the owned cluster if it is offline. `db:check` authenticates, executes a read-only query, and checks the selected schema without printing the connection URL. The launcher generates Prisma before loading its native engine, refuses occupied application ports, and requires successful HTTP health responses.

Open `http://localhost:3001`. API health is available at `http://localhost:3001/api/v1/health/live`; database readiness is at `/api/v1/health/ready`. Stop the application launcher with Ctrl+C; the local database persists.

Redis and queues are disabled for this development profile. Features requiring those services need a separately configured Redis connection. This environment setup does not certify all application workflows or production readiness.

## Explicit development migrations

```powershell
npm.cmd run db:initialize:local
```

This command verifies the development URL, database ownership marker, and PostgreSQL data directory before applying pending checked-in migrations. On first initialization it requires an empty database. It never resets or automatically baselines an existing database. Review migration SQL before applying future changes to valuable development data.

Environment precedence is inherited process variables, `.env.development.local`, `.env.development`, `.env.local`, then `.env`. The launcher passes the same resolved environment to both applications. Local commands reject production mode and non-loopback PostgreSQL addresses.
