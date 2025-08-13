import { prisma } from '@/lib/prisma';

interface ChargeModelOptions {
  userId: string;
  modelId?: string; // ID do modelo ou nome do modelo
  modelName?: string; // Nome do modelo alternativo
  amount?: number; // Quantidade personalizada (sobrepõe o custo do modelo)
}

/**
 * Serviço para gerenciar o consumo de créditos baseado no modelo de IA
 */
export const creditService = {
  /**
   * Cobra créditos com base no modelo de IA utilizado
   * @param options Opções de cobrança
   * @returns Objeto com status da operação e dados do usuário atualizado
   */
  async chargeForModel(options: ChargeModelOptions) {
    const { userId, modelId, modelName, amount } = options;
    
    try {
      // Buscar o usuário
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          credits: true,
          maxCredits: true,
          trialActivated: true,
          trialEndDate: true,
          plan: true
        }
      });
      
      if (!user) {
        return {
          success: false,
          error: 'User not found',
          status: 404
        };
      }
      
      // Buscar o modelo de IA (por ID ou nome)
      let aiModel;
      if (modelId) {
        aiModel = await prisma.aIModel.findUnique({
          where: { id: modelId }
        });
      } else if (modelName) {
        aiModel = await prisma.aIModel.findUnique({
          where: { name: modelName }
        });
      } else {
        // Modelo padrão (GPT-4o-mini)
        aiModel = await prisma.aIModel.findFirst({
          where: { modelId: 'gpt-4o-mini' }
        });
      }
      
      if (!aiModel) {
        return {
          success: false,
          error: 'AI model not found',
          status: 404
        };
      }
      
      // Se o modelo não estiver habilitado
      if (!aiModel.enabled) {
        return {
          success: false,
          error: 'AI model is currently disabled',
          status: 403
        };
      }
      
      // Determinar custo em créditos
      const creditCost = amount || aiModel.creditCost;
      
      // Verificar se o usuário tem créditos suficientes
      if (user.credits < creditCost) {
        return {
          success: false,
          error: 'Insufficient credits',
          credits: user.credits,
          maxCredits: user.maxCredits,
          required: creditCost,
          status: 402 // Payment Required
        };
      }
      
      // Debitar os créditos
      const updatedUser = await prisma.user.update({
        where: { id: user.id },
        data: { 
          credits: { decrement: creditCost }
        },
        select: {
          id: true,
          credits: true,
          maxCredits: true,
          trialActivated: true,
          trialEndDate: true,
          plan: true
        }
      });
      
      // Se os créditos acabaram e o usuário está em trial, encerrar o trial
      if (updatedUser.credits <= 0 && updatedUser.trialActivated && updatedUser.plan === 'trial') {
        await prisma.user.update({
          where: { id: user.id },
          data: {
            trialActivated: false,
            trialEndDate: new Date(),
            plan: 'free'
          }
        });
      }
      
      // Registrar o uso (opcional, para métricas futuras)
      await prisma.aIModelUsage.create({
        data: {
          userId: user.id,
          modelId: aiModel.id,
          creditCost,
          timestamp: new Date()
        }
      }).catch(() => {
        // Ignora erro se a tabela ainda não existir
        console.log('AIModelUsage table not available yet');
      });
      
      return {
        success: true,
        credits: updatedUser.credits,
        maxCredits: updatedUser.maxCredits,
        used: creditCost,
        model: aiModel.name,
        status: 200
      };
    } catch (error) {
      console.error('Error charging credits for AI model:', error);
      return {
        success: false,
        error: 'Internal server error',
        status: 500
      };
    }
  }
};
