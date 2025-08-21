// Execute a SQL migration file against the database defined by DATABASE_URL
// Usage: node scripts/apply-sql-migration.js scripts/migrations/add-api-keys-tables.sql

const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.resolve(process.cwd(), '.env') });
const { Client } = require('pg');

async function main() {
  const fileArg = process.argv[2];
  if (!fileArg) {
    console.error('Usage: node scripts/apply-sql-migration.js <path-to-sql-file>');
    process.exit(1);
  }
  const sqlPath = path.resolve(process.cwd(), fileArg);
  if (!fs.existsSync(sqlPath)) {
    console.error(`SQL file not found: ${sqlPath}`);
    process.exit(1);
  }

  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error('DATABASE_URL is not set. Please configure it in your environment or .env file.');
    process.exit(1);
  }

  const sql = fs.readFileSync(sqlPath, 'utf8');

  const client = new Client({ connectionString: databaseUrl });
  try {
    await client.connect();
    console.log(`Connected to database. Applying migration: ${path.basename(sqlPath)}`);

    // Split by GO-like statements? Not necessary, we use a single file with DO blocks and IF NOT EXISTS.
    await client.query('BEGIN');
    await client.query(sql);
    await client.query('COMMIT');

    console.log('Migration applied successfully.');
  } catch (err) {
    try { await client.query('ROLLBACK'); } catch (_) {}
    console.error('Migration failed:', err.message);
    process.exitCode = 1;
  } finally {
    await client.end();
  }
}

main().catch((e) => {
  console.error('Unexpected error:', e);
  process.exit(1);
});
