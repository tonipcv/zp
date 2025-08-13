-- Criação da tabela ai_models
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
);

-- Adicionar índice único para o nome do modelo
CREATE UNIQUE INDEX IF NOT EXISTS "ai_models_name_key" ON "ai_models"("name");

-- Criação da tabela ai_model_usages
CREATE TABLE IF NOT EXISTS "ai_model_usages" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "modelId" TEXT NOT NULL,
  "creditCost" INTEGER NOT NULL,
  "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT "ai_model_usages_pkey" PRIMARY KEY ("id")
);

-- Adicionar índices para a tabela de uso
CREATE INDEX IF NOT EXISTS "ai_model_usages_userId_idx" ON "ai_model_usages"("userId");
CREATE INDEX IF NOT EXISTS "ai_model_usages_modelId_idx" ON "ai_model_usages"("modelId");
CREATE INDEX IF NOT EXISTS "ai_model_usages_timestamp_idx" ON "ai_model_usages"("timestamp");

-- Adicionar chave estrangeira
ALTER TABLE "ai_model_usages" ADD CONSTRAINT "ai_model_usages_modelId_fkey" 
  FOREIGN KEY ("modelId") REFERENCES "ai_models"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Inserir modelos iniciais
INSERT INTO "ai_models" ("id", "name", "provider", "modelId", "description", "creditCost", "enabled", "createdAt", "updatedAt")
VALUES 
  ('clm1', 'GPT-4o', 'openai', 'gpt-4o', 'Modelo mais avançado da OpenAI', 1, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('clm2', 'GPT-4o-mini', 'openai', 'gpt-4o-mini', 'Versão mais leve e econômica do GPT-4o', 1, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('clm3', 'GPT-5', 'openai', 'gpt-5', 'Próxima geração de modelos OpenAI (placeholder)', 2, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
