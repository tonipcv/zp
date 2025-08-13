const { Pool } = require('pg');
require('dotenv').config();

async function runMigration() {
  // Criar conexão com o banco de dados usando as variáveis de ambiente
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    console.log('Iniciando migração para adicionar campos de plano ao modelo User...');
    
    // Verificar se as colunas já existem
    const checkResult = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'User' 
      AND column_name IN ('plan', 'planUpdatedAt');
    `);
    
    const existingColumns = checkResult.rows.map(row => row.column_name);
    
    // Adicionar coluna plan se não existir
    if (!existingColumns.includes('plan')) {
      console.log('Adicionando coluna plan...');
      await pool.query(`
        ALTER TABLE "User" 
        ADD COLUMN "plan" TEXT NOT NULL DEFAULT 'free';
      `);
      console.log('Coluna plan adicionada com sucesso!');
    } else {
      console.log('Coluna plan já existe, pulando...');
    }
    
    // Adicionar coluna planUpdatedAt se não existir
    if (!existingColumns.includes('planUpdatedAt')) {
      console.log('Adicionando coluna planUpdatedAt...');
      await pool.query(`
        ALTER TABLE "User" 
        ADD COLUMN "planUpdatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
      `);
      console.log('Coluna planUpdatedAt adicionada com sucesso!');
    } else {
      console.log('Coluna planUpdatedAt já existe, pulando...');
    }
    
    // Atualizar os valores de plan com base nas informações de trial
    console.log('Atualizando valores de plan com base nas informações de trial...');
    await pool.query(`
      UPDATE "User"
      SET "plan" = 
        CASE 
          WHEN "trialActivated" = true AND "trialEndDate" > CURRENT_TIMESTAMP THEN 'trial'
          WHEN "trialActivated" = true AND "trialEndDate" <= CURRENT_TIMESTAMP THEN 'free'
          ELSE 'free'
        END,
      "planUpdatedAt" = CURRENT_TIMESTAMP;
    `);
    
    // Verificar se há assinaturas ativas e atualizar o plano correspondente
    console.log('Atualizando planos com base nas assinaturas ativas...');
    await pool.query(`
      UPDATE "User" u
      SET "plan" = 'premium',
          "planUpdatedAt" = s."currentPeriodStart"
      FROM "Subscription" s
      WHERE u.id = s."userId"
        AND s.status = 'active';
    `);
    
    console.log('Migração concluída com sucesso!');
  } catch (error) {
    console.error('Erro durante a migração:', error);
  } finally {
    // Fechar a conexão com o banco de dados
    await pool.end();
  }
}

// Executar a migração
runMigration();
