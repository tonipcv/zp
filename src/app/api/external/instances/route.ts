import { NextRequest, NextResponse } from 'next/server';
import { WhatsAppService } from '@/lib/whatsapp-service';
import { PrismaClient } from '@prisma/client';
import { validateExternalApiKey } from '@/lib/external-auth';
import { rateLimitCheck, getRequesterIp } from '@/lib/rate-limit';

const whatsappService = new WhatsAppService(
  process.env.EVOLUTION_API_URL || 'https://boop-evolution-api.dpbdp1.easypanel.host',
  process.env.EVOLUTION_API_KEY
);

const prisma = new PrismaClient();

// Suporte legado: EXTERNAL_API_KEY
const EXTERNAL_API_KEY = process.env.EXTERNAL_API_KEY;

export async function GET(request: NextRequest) {
  try {
    // 1) Tenta validar a nova API key (escopada por instância)
    let allowedInstanceIds: string[] | null = null;
    let apiKeyId: string | null = null;
    let rateLimitPerMinute = 60;
    try {
      const auth = await validateExternalApiKey(request);
      allowedInstanceIds = auth.allowedInstanceIds;
      apiKeyId = auth.apiKeyId;
      rateLimitPerMinute = auth.rateLimitPerMinute ?? 60;
    } catch (e: any) {
      // 2) Fallback legado: EXTERNAL_API_KEY fixa no .env
      const headerKey = request.headers.get('x-api-key');
      if (!headerKey || !EXTERNAL_API_KEY || headerKey !== EXTERNAL_API_KEY) {
        return NextResponse.json(
          {
            success: false,
            error: 'API Key inválida ou ausente. Use o header x-api-key.'
          },
          { status: 401 }
        );
      }
    }

    // 1.1) Rate limit por API key (quando escopado)
    if (apiKeyId) {
      const rl = rateLimitCheck(`ext:list:key:${apiKeyId}`, rateLimitPerMinute);
      if (!rl.allowed) {
        return NextResponse.json({ success: false, error: 'Rate limit excedido para a API key' }, { status: 429 });
      }
    }
    // 1.2) Rate limit por IP (sempre aplica, inclusive legado)
    const ip = getRequesterIp(request.headers, (request as any).ip);
    if (ip) {
      const rlIp = rateLimitCheck(`ext:list:ip:${ip}`, 60);
      if (!rlIp.allowed) {
        return NextResponse.json({ success: false, error: 'Rate limit excedido para o IP' }, { status: 429 });
      }
    }

    // Monta o filtro: se houver escopo, restringe por IDs permitidos
    const whereClause: any = { status: 'CONNECTED' };
    if (allowedInstanceIds && allowedInstanceIds.length > 0) {
      whereClause.id = { in: allowedInstanceIds };
    }

    const instances = await prisma.whatsAppInstance.findMany({
      where: whereClause,
      select: {
        id: true,
        instanceName: true,
        status: true,
        connectedNumber: true,
        lastConnectedAt: true,
        createdAt: true,
        userId: true
      },
      orderBy: {
        lastConnectedAt: 'desc'
      }
    });

    console.log(`[EXTERNAL_API] Listagem de instâncias solicitada. ${instances.length} instâncias conectadas encontradas.`);

    return NextResponse.json({
      success: true,
      count: instances.length,
      instances: instances.map(instance => ({
        id: instance.id,
        instanceName: instance.instanceName,
        status: instance.status,
        connectedNumber: instance.connectedNumber ?
          instance.connectedNumber.replace(/\d(?=\d{4})/g, '*') : null, // Mascarar número
        lastConnectedAt: instance.lastConnectedAt,
        createdAt: instance.createdAt,
        isAvailable: instance.status === 'CONNECTED'
      })),
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('[EXTERNAL_API] Erro ao listar instâncias:', error);
    
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : 'Erro interno do servidor',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
} 