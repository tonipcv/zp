import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { WhatsAppService } from '@/lib/whatsapp-service';
import { authOptions } from '@/lib/auth';
import { EvolutionApiClient } from '@/lib/evolution-api';
import { prisma } from '@/lib/prisma';

const whatsappService = new WhatsAppService(
  process.env.EVOLUTION_API_URL || 'https://boop-evolution-api.dpbdp1.easypanel.host',
  process.env.EVOLUTION_API_KEY
);

const evolutionApi = new EvolutionApiClient({
  baseUrl: process.env.EVOLUTION_API_URL || 'https://boop-evolution-api.dpbdp1.easypanel.host',
  apiKey: process.env.EVOLUTION_API_KEY
});

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const instances = await whatsappService.getUserInstances(session.user.id);
    
    return NextResponse.json({ instances });
  } catch (error) {
    console.error('Erro ao listar instâncias:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    // Enforce plan limits: users on free plan can have only 1 instance
    try {
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { id: true, plan: true },
      });

      if (!user) {
        return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
      }

      if (user.plan === 'free') {
        const instanceCount = await prisma.whatsAppInstance.count({
          where: { userId: user.id },
        });
        if (instanceCount >= 1) {
          return NextResponse.json(
            { error: 'Limite atingido no plano Free: você pode criar apenas 1 instância.' },
            { status: 403 }
          );
        }
      }
    } catch (planErr) {
      console.error('Erro ao validar limites de plano (WhatsApp instances):', planErr);
      // Prosseguir apenas se não for um erro crítico? Melhor retornar 500 para consistência
      return NextResponse.json(
        { error: 'Erro ao validar limites do plano' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { instanceName, sessionToken, webhookUrl, autoReconnect } = body;

    // Validações básicas
    if (instanceName && typeof instanceName !== 'string') {
      return NextResponse.json(
        { error: 'Nome da instância deve ser uma string' },
        { status: 400 }
      );
    }

    if (webhookUrl && typeof webhookUrl !== 'string') {
      return NextResponse.json(
        { error: 'URL do webhook deve ser uma string' },
        { status: 400 }
      );
    }

    const instance = await whatsappService.createInstance({
      userId: session.user.id,
      instanceName,
      sessionToken,
      webhookUrl,
      autoReconnect,
    });

    return NextResponse.json({ instance }, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar instância:', error);
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
} 