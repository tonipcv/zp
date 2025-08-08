const { Pool } = require('pg');
require('dotenv').config();

// Create a PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function runMigration() {
  try {
    console.log('Starting migration to add VerificationCode table...');
    
    // SQL to create the VerificationCode table
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS "VerificationCode" (
        "id" TEXT NOT NULL,
        "email" TEXT NOT NULL,
        "code" TEXT NOT NULL,
        "verified" BOOLEAN NOT NULL DEFAULT false,
        "expiresAt" TIMESTAMP(3) NOT NULL,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        
        CONSTRAINT "VerificationCode_pkey" PRIMARY KEY ("id"),
        CONSTRAINT "VerificationCode_email_key" UNIQUE ("email")
      );
    `;
    
    // Execute the SQL
    await pool.query(createTableSQL);
    
    console.log('Migration completed successfully!');
    
    // Close the connection pool
    await pool.end();
    
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

// Run the migration
runMigration();
