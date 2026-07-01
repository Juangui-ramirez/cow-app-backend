-- Base schema: users and groups. These tables predate the sql/ folder (they
-- were created by hand); recorded here so a fresh database can be bootstrapped
-- from scratch, e.g. via docker-compose's docker-entrypoint-initdb.d.

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(100) NOT NULL,
  createdAt TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS groups (
  id SERIAL PRIMARY KEY,
  name VARCHAR(30) NOT NULL UNIQUE,
  color VARCHAR(20) NOT NULL,
  ownerUserId INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  createdAt TIMESTAMP NOT NULL DEFAULT NOW()
);
