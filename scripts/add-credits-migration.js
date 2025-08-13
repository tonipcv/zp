// Script to add credits fields to User table
const { Pool } = require('pg');
require('dotenv').config();

async function runMigration() {
  // Create a connection pool to the PostgreSQL database
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    console.log('Starting migration to add credits fields to User table...');
    
    // Begin transaction
    await pool.query('BEGIN');

    // Check if credits column already exists
    const checkResult = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'User' AND column_name = 'credits'
    `);

    if (checkResult.rows.length === 0) {
      console.log('Adding credits column to User table...');
      
      // Add credits column with default value 50
      await pool.query(`
        ALTER TABLE "User" 
        ADD COLUMN "credits" INTEGER NOT NULL DEFAULT 50
      `);
      
      console.log('Credits column added successfully.');
    } else {
      console.log('Credits column already exists, skipping...');
    }

    // Check if maxCredits column already exists
    const checkMaxCreditsResult = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'User' AND column_name = 'maxCredits'
    `);

    if (checkMaxCreditsResult.rows.length === 0) {
      console.log('Adding maxCredits column to User table...');
      
      // Add maxCredits column with default value 50
      await pool.query(`
        ALTER TABLE "User" 
        ADD COLUMN "maxCredits" INTEGER NOT NULL DEFAULT 50
      `);
      
      console.log('maxCredits column added successfully.');
    } else {
      console.log('maxCredits column already exists, skipping...');
    }

    // Update maxCredits based on subscription status
    console.log('Updating maxCredits based on subscription status...');
    
    // Set free users to 50 credits
    await pool.query(`
      UPDATE "User"
      SET "maxCredits" = 50
      WHERE "isPremium" = false AND "isSuperPremium" = false
    `);

    // Set basic (premium) users to 2000 credits
    await pool.query(`
      UPDATE "User"
      SET "maxCredits" = 2000
      WHERE "isPremium" = true AND "isSuperPremium" = false
    `);

    // Commit transaction
    await pool.query('COMMIT');
    
    console.log('Migration completed successfully!');
  } catch (error) {
    // Rollback transaction on error
    await pool.query('ROLLBACK');
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    // Close the connection pool
    await pool.end();
  }
}

// Run the migration
runMigration();
