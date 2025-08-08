const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

async function runMigration() {
  try {
    console.log('Iniciando migração do banco de dados...');
    
    // Criar instância do Prisma Client
    const prisma = new PrismaClient();
    
    // Ler o arquivo SQL
    const sqlPath = path.join(__dirname, '../prisma/migrations/add_login_verification_code.sql');
    const sqlContent = fs.readFileSync(sqlPath, 'utf8');
    
    // Dividir o conteúdo SQL em comandos individuais
    const sqlCommands = sqlContent
      .split(';')
      .filter(cmd => cmd.trim().length > 0)
      .map(cmd => cmd.trim() + ';');
    
    console.log(`Encontrados ${sqlCommands.length} comandos SQL para executar.`);
    
    // Executar cada comando SQL
    for (let i = 0; i < sqlCommands.length; i++) {
      const command = sqlCommands[i];
      console.log(`Executando comando ${i + 1}/${sqlCommands.length}...`);
      
      try {
        await prisma.$executeRawUnsafe(command);
        console.log(`Comando ${i + 1} executado com sucesso.`);
      } catch (error) {
        // Se a tabela já existir, ignorar o erro
        if (error.message.includes('already exists')) {
          console.log(`Tabela já existe, ignorando comando ${i + 1}.`);
        } else {
          throw error;
        }
      }
    }
    
    console.log('Migração concluída com sucesso!');
    
    // Desconectar do banco de dados
    await prisma.$disconnect();
  } catch (error) {
    console.error('Erro durante a migração:', error);
    process.exit(1);
  }
}

runMigration();
