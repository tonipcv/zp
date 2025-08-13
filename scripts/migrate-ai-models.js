// Script para migração do modelo AIModel e seed inicial
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Iniciando migração e seed do modelo AIModel...');

  try {
    // Verificar se a tabela ai_models existe
    console.log('🔍 Verificando se a tabela ai_models existe...');
    
    // Usar uma query SQL direta para verificar se a tabela existe
    const tableExists = await prisma.$queryRaw`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public'
        AND table_name = 'ai_models'
      );
    `;
    
    const exists = tableExists[0].exists;
    
    if (!exists) {
      console.log('⚠️ Tabela ai_models não encontrada. Executando migração...');
      
      // Criar a tabela ai_models
      await prisma.$executeRaw`
        CREATE TABLE IF NOT EXISTS "ai_models" (
          "id" TEXT NOT NULL,
          "name" TEXT NOT NULL,
          "provider" TEXT NOT NULL,
          "modelId" TEXT NOT NULL,
          "description" TEXT,
          "creditCost" INTEGER NOT NULL,
          "enabled" BOOLEAN NOT NULL DEFAULT true,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP(3) NOT NULL,
          
          CONSTRAINT "ai_models_pkey" PRIMARY KEY ("id")
        )
      `;
      
      // Criar índice separadamente
      await prisma.$executeRaw`
        CREATE UNIQUE INDEX IF NOT EXISTS "ai_models_name_key" ON "ai_models"("name")
      `;
      
      console.log('✅ Tabela ai_models criada com sucesso!');
    } else {
      console.log('ℹ️ Tabela ai_models já existe no banco de dados.');
    }
    
    // Verificar se já existem modelos no banco usando SQL direto
    const countResult = await prisma.$queryRaw`SELECT COUNT(*) FROM "ai_models"`;
    const count = parseInt(countResult[0].count);
    
    console.log(`📊 Encontrados ${count} modelos no banco de dados.`);
    
    if (count > 0) {
      console.log('ℹ️ Modelos de IA já existem no banco de dados.');
    } else {
      console.log('📝 Criando modelos de IA iniciais...');
      
      // Criar modelos iniciais usando SQL direto
      // GPT-4o
      const gpt4oId = `model_${Date.now()}_1`;
      await prisma.$executeRaw`
        INSERT INTO "ai_models" ("id", "name", "provider", "modelId", "description", "creditCost", "enabled", "createdAt", "updatedAt")
        VALUES (
          ${gpt4oId},
          'GPT-4o',
          'openai',
          'gpt-4o',
          'Modelo mais avançado da OpenAI com capacidades multimodais',
          2,
          true,
          CURRENT_TIMESTAMP,
          CURRENT_TIMESTAMP
        )
      `;
      
      // GPT-4o-mini
      const gpt4oMiniId = `model_${Date.now()}_2`;
      await prisma.$executeRaw`
        INSERT INTO "ai_models" ("id", "name", "provider", "modelId", "description", "creditCost", "enabled", "createdAt", "updatedAt")
        VALUES (
          ${gpt4oMiniId},
          'GPT-4o-mini',
          'openai',
          'gpt-4o-mini',
          'Versão mais rápida e econômica do GPT-4o',
          1,
          true,
          CURRENT_TIMESTAMP,
          CURRENT_TIMESTAMP
        )
      `;
      
      // GPT-3.5 Turbo
      const gpt35Id = `model_${Date.now()}_3`;
      await prisma.$executeRaw`
        INSERT INTO "ai_models" ("id", "name", "provider", "modelId", "description", "creditCost", "enabled", "createdAt", "updatedAt")
        VALUES (
          ${gpt35Id},
          'GPT-3.5 Turbo',
          'openai',
          'gpt-3.5-turbo',
          'Modelo equilibrado entre custo e desempenho',
          1,
          true,
          CURRENT_TIMESTAMP,
          CURRENT_TIMESTAMP
        )
      `;
      
      console.log('✅ Modelos de IA criados com sucesso!');
    }
    
    // Verificar se a tabela de uso de modelos existe
    console.log('✅ Migração e seed concluídos com sucesso!');
    
  } catch (error) {
    console.error('❌ Erro durante a migração:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .then(() => {
    console.log('🎉 Processo finalizado!');
    process.exit(0);
  })
  .catch((e) => {
    console.error('❌ Erro inesperado:', e);
    process.exit(1);
  });
