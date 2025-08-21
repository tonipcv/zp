// Script para executar a migração SQL do Calendly
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

async function runMigration() {
  console.log('🚀 Iniciando migração das tabelas do Calendly...');
  
  // Inicializar cliente Prisma
  const prisma = new PrismaClient();
  
  try {
    // Ler arquivo SQL
    const sqlPath = path.join(__dirname, 'migrations', 'add-calendly-tables.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');
    
    // Dividir em comandos individuais (separados por ;)
    const commands = sql
      .split(';')
      .map(command => command.trim())
      .filter(command => command.length > 0);
    
    // Executar cada comando SQL
    for (const command of commands) {
      try {
        await prisma.$executeRawUnsafe(`${command};`);
        console.log('✅ Comando SQL executado com sucesso');
      } catch (err) {
        // Alguns erros são esperados (ex: tabela já existe)
        console.log(`⚠️ Aviso ao executar comando: ${err.message}`);
      }
    }
    
    // Verificar se as tabelas foram criadas
    const tables = ['calendly_connections', 'calendly_webhook_subscriptions', 'calendly_events'];
    for (const table of tables) {
      try {
        const result = await prisma.$executeRawUnsafe(`SELECT COUNT(*) FROM "${table}" LIMIT 1;`);
        console.log(`✅ Tabela "${table}" verificada com sucesso`);
      } catch (err) {
        console.error(`❌ Erro ao verificar tabela "${table}": ${err.message}`);
        throw err;
      }
    }
    
    console.log('🎉 Migração concluída com sucesso!');
  } catch (error) {
    console.error('❌ Erro durante a migração:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Executar a migração
runMigration();
