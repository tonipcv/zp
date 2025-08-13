// Script para executar a migração SQL
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

async function runMigration() {
  const prisma = new PrismaClient();
  
  try {
    console.log('Iniciando migração para adicionar tabela AIModel...');
    
    // Ler o arquivo SQL
    const sqlPath = path.join(__dirname, '../prisma/migrations/add_ai_models.sql');
    const sqlContent = fs.readFileSync(sqlPath, 'utf8');
    
    // Dividir as queries por ponto e vírgula (ignorando comentários)
    const queries = sqlContent
      .split(';')
      .map(query => query.trim())
      .filter(query => query && !query.startsWith('--'));
    
    // Executar cada query separadamente
    for (const query of queries) {
      if (query) {
        console.log(`Executando query: ${query.substring(0, 60)}...`);
        await prisma.$executeRawUnsafe(query + ';');
      }
    }
    
    console.log('Migração concluída com sucesso!');
    
    // Verificar se os modelos foram criados
    const models = await prisma.$queryRaw`SELECT * FROM "ai_models"`;
    console.log(`Modelos cadastrados: ${models.length}`);
    console.log(models);
    
  } catch (error) {
    console.error('Erro ao executar migração:', error);
  } finally {
    await prisma.$disconnect();
  }
}

runMigration();
