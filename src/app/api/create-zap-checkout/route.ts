import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { ZAP_PRICE_IDS } from '@/lib/stripe-zap-prices';
import { prisma } from '@/lib/prisma';

const DOMAIN = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export async function POST(request: Request) {
  try {
    const { userId, planType = 'basic' } = await request.json();

    // Validação dos parâmetros obrigatórios
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID é obrigatório' },
        { status: 400 }
      );
    }

    // Buscar o usuário
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      );
    }

    // Determinar qual preço usar com base no tipo de plano
    let priceId;
    if (planType === 'basic') {
      priceId = ZAP_PRICE_IDS.BASIC.MONTHLY;
    } else {
      return NextResponse.json(
        { error: 'Tipo de plano inválido' },
        { status: 400 }
      );
    }

    // Criar ou recuperar o cliente no Stripe
    let stripeCustomerId = user.stripeCustomerId;
    
    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name || undefined,
        metadata: {
          userId: user.id,
        },
      });
      
      stripeCustomerId = customer.id;
      
      // Atualizar o ID do cliente no banco de dados
      await prisma.user.update({
        where: { id: user.id },
        data: { stripeCustomerId },
      });
    }

    // Criar a sessão de checkout
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${DOMAIN}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${DOMAIN}/planos`,
      client_reference_id: userId,
      customer: stripeCustomerId,
      metadata: {
        userId,
        planType,
      },
      allow_promotion_codes: true,
      billing_address_collection: 'required',
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (error: any) {
    console.error('Erro ao criar sessão de checkout:', error);
    
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
