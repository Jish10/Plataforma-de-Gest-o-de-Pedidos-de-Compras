import pg from 'pg';

const { Pool } = pg;

// Pool reutiliza conexões com o PostgreSQL e deixa a aplicação mais organizada.
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME || 'compras_db',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres'
});

export function query(text, params) {
  return pool.query(text, params);
}

export function getClient() {
  return pool.connect();
}
