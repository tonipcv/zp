import { NextResponse } from 'next/server';
import type { Subscription } from '@prisma/client';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';
import { ZAP_PRICE_IDS } from '@/lib/stripe-zap-prices';

const DOMAIN = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export async function POST(request: Request) {
  try {
    const { userId, resourceType, quantity = 1 } = await request.json();

    // Validação dos parâmetros obrigatórios
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID é obrigatório' },
        { status: 400 }
      );
    }

    if (!resourceType || !['instance_agent', 'tokens'].includes(resourceType)) {
      return NextResponse.json(
        { error: 'Tipo de recurso inválido. Use "instance_agent" ou "tokens"' },
        { status: 400 }
      );
    }

    // Buscar o usuário
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { subscriptions: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      );
    }

    // Verificar se o usuário tem uma assinatura ativa
    const hasActiveSubscription = user.subscriptions.some(
      (sub: Subscription) => sub.status === 'active'
    );

    if (!hasActiveSubscription) {
      return NextResponse.json(
        { error: 'É necessário ter uma assinatura ativa para adicionar recursos' },
        { status: 400 }
      );
    }

    // Determinar qual preço usar com base no tipo de recurso
    let priceId;
    if (resourceType === 'instance_agent') {
      priceId = ZAP_PRICE_IDS.ADDITIONAL;
    } else if (resourceType === 'tokens') {
      priceId = ZAP_PRICE_IDS.EXTRA_TOKENS;
    }

    // Criar sessão de checkout para o recurso adicional
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: quantity,
        },
      ],
      success_url: `${DOMAIN}/dashboard?resource_added=true`,
      cancel_url: `${DOMAIN}/dashboard`,
      client_reference_id: userId,
      metadata: {
        userId,
        resourceType,
        quantity: quantity.toString(),
      },
      allow_promotion_codes: true,
      billing_address_collection: 'required',
      customer: user.stripeCustomerId || undefined,
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (error: any) {
    console.error('Erro ao criar sessão para recursos adicionais:', error);
    
    if (error.type === 'StripeInvalidRequestError') {
      return NextResponse.json(
        { error: error.message || 'Parâmetros de requisição inválidos' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Erro ao processar a requisição' },
      { status: 500 }
    );
  }
}
