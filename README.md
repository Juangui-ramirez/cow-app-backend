# cow-app-backend

Express + Postgres API for the Cow expense-splitting app.

## Local development (Docker)

1. Copy the example env file and adjust if needed:
   ```
   cp .env.example .env
   ```
2. Start Postgres (and pgAdmin) with Docker Compose:
   ```
   docker compose up -d
   ```
   This creates the database and automatically runs every script in `sql/`
   in filename order (`001` → `004`) the first time the `db` volume is created.
3. Install dependencies and start the API:
   ```
   npm install
   npm run dev
   ```
4. The API listens on `http://localhost:3000` (or `PORT` from `.env`).
   pgAdmin is available at `http://localhost:5050` (login with
   `PGADMIN_DEFAULT_EMAIL` / `PGADMIN_DEFAULT_PASSWORD` from `.env`); add a
   server there pointing at host `db`, port `5432`, using
   `PGUSER` / `PGPASSWORD` / `PGDATABASE`.

## Resetting the local database

Docker only runs the `sql/*.sql` scripts the first time the data volume is
created. To start over from a clean database:
```
docker compose down -v
docker compose up -d
```

## Database schema

There's no migration runner in this project. Every schema change lives as a
plain SQL file in `sql/`, applied in filename order. Docker Compose applies
them automatically for local dev; for a hosted database (Render, Supabase,
Neon, etc.) run each file manually, in order, against it.

## Connecting to a hosted database instead of Docker

Set `PGHOST`, `PGUSER`, `PGPASSWORD`, `PGDATABASE`, `PGPORT` to the hosted
instance's values and set `PGSSL=true` (most managed providers require SSL).
