import pg from "pg";
import "dotenv/config"
const { Pool } = pg;
const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
  // Local/Docker Postgres doesn't support SSL; hosted providers usually require it.
  ssl: process.env.PGSSL === "true" ? { rejectUnauthorized: false } : false,
});

export default pool;
