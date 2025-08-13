const { Client } = require('pg');
require('dotenv').config();

async function main() {
  console.log('Starting migration...');
  
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await client.connect();
    console.log('Connected to database');

    // Begin transaction
    await client.query('BEGIN');

    // 1. Add new trial columns to User table
    console.log('Adding trial columns to User table...');
    await client.query(`
      ALTER TABLE "User" 
      ADD COLUMN IF NOT EXISTS "trialActivated" BOOLEAN NOT NULL DEFAULT false,
      ADD COLUMN IF NOT EXISTS "trialStartDate" TIMESTAMP WITH TIME ZONE,
      ADD COLUMN IF NOT EXISTS "trialEndDate" TIMESTAMP WITH TIME ZONE;
    `);

    // 2. Remove isPremium and isSuperPremium columns from User table
    console.log('Removing isPremium and isSuperPremium columns from User table...');
    await client.query(`
      ALTER TABLE "User" 
      DROP COLUMN IF EXISTS "isPremium",
      DROP COLUMN IF EXISTS "isSuperPremium";
    `);

    // 3. Drop PrayerRequest table and its relations
    console.log('Dropping PrayerRequest table...');
    await client.query(`
      DROP TABLE IF EXISTS "PrayerRequest" CASCADE;
    `);

    // Commit transaction
    await client.query('COMMIT');
    console.log('Migration completed successfully!');
  } catch (error) {
    // Rollback transaction on error
    await client.query('ROLLBACK');
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    // Close connection
    await client.end();
    console.log('Database connection closed');
  }
}

main()
  .catch((e) => {
    console.error('Unhandled error:', e);
    process.exit(1);
  });
