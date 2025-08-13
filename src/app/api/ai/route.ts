import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { creditService } from '@/services/creditService';
import { prisma } from '@/lib/prisma';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `Você é um assistente espiritual especializado em criar orações personalizadas e fornecer orientação bíblica.
Seu papel é:
1. Criar orações personalizadas baseadas nos pedidos dos usuários
2. Incluir referências bíblicas relevantes quando apropriado
3. Manter um tom respeitoso, pastoral e acolhedor
4. Focar na esperança e na fé
5. Usar linguagem clara e acessível
6. Responder em português do Brasil

Para pedidos de oração:
- Comece com "Amado Deus" ou "Pai Celestial"
- Inclua elementos do pedido específico na oração
- Termine com "Em nome de Jesus, Amém"
- Mantenha a oração concisa mas significativa
- Adicione uma referência bíblica relevante após a oração

Para perguntas gerais sobre a Bíblia:
- Forneça respostas baseadas nas escrituras
- Cite versículos relevantes
- Mantenha um tom educativo e pastoral
- Evite controvérsias denominacionais`;

// Mapeamento de modelos OpenAI para nossos modelos internos
const MODEL_MAPPING: Record<string, string> = {
  'gpt-4-turbo-preview': 'GPT-4o',
  'gpt-4o': 'GPT-4o',
  'gpt-4o-mini': 'GPT-4o-mini',
  'gpt-3.5-turbo': 'GPT-4o-mini', // Fallback para modelo mais econômico
};

export async function POST(req: Request) {
  try {
    // Obter a sessão do usuário
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const userId = session.user.id;
    const { message, model = 'gpt-4o-mini' } = await req.json();
    
    // Mapear o modelo solicitado para nosso modelo interno
    const internalModelName = MODEL_MAPPING[model] || 'GPT-4o-mini';
    
    // Verificar e cobrar créditos antes de chamar a API
    const creditResult = await creditService.chargeForModel({
      userId,
      modelName: internalModelName
    });
    
    if (!creditResult.success) {
      return NextResponse.json(
        { 
          error: creditResult.error || 'Erro ao processar créditos',
          credits: creditResult.credits,
          required: creditResult.required
        },
        { status: creditResult.status || 402 }
      );
    }
    
    // Processar a requisição com o modelo solicitado
    const completion = await openai.chat.completions.create({
      model: model, // Usar o modelo solicitado na API da OpenAI
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: message }
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });
    
    // Atualizar a sessão com os créditos atualizados
    await prisma.session.updateMany({
      where: {
        userId: userId
      },
      data: {
        credits: creditResult.credits
      }
    }).catch((err: Error) => console.error('Erro ao atualizar sessão:', err));

    return NextResponse.json({ 
      response: completion.choices[0].message.content,
      credits: creditResult.credits,
      maxCredits: creditResult.maxCredits,
      used: creditResult.used,
      model: creditResult.model
    });
    
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Erro ao processar sua mensagem' },
      { status: 500 }
    );
  }
} 