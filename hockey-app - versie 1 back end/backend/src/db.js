import mysql from 'mysql2/promise';
import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config();

export async function getPool() {
  return mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });
}

async function init() {
  const pool = await getPool();
  const schema = fs.readFileSync(new URL('../schema.sql', import.meta.url), 'utf-8');
  const statements = schema.split(/;\s*\n/).filter(s => s.trim());
  for (const stmt of statements) {
    await pool.query(stmt);
  }
  console.log('Database initialized.');
  process.exit(0);
}

if (process.argv.includes('--init')) {
  init().catch(e => { console.error(e); process.exit(1); });
}
