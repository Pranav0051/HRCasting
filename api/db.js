import pg from 'pg';

const { Pool } = pg;

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.POSTGRES_URL_NON_POOLING;

const pool = new Pool({
  connectionString,
  ssl: connectionString && (connectionString.includes('localhost') || connectionString.includes('127.0.0.1'))
    ? false
    : { rejectUnauthorized: false }
});

export default pool;
