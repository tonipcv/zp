import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

const DOMAIN = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export async function POST(request: Request) {
  try {
    const { priceId, userId } = await request.json();

    // Validação dos parâmetros obrigatórios
    if (!priceId) {
      return NextResponse.json(
        { error: 'Price ID is required' },
        { status: 400 }
      );
    }

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Cria a sessão de checkout
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
      metadata: {
        userId,
      },
      allow_promotion_codes: true,
      billing_address_collection: 'required',
      customer_email: undefined, // Será preenchido automaticamente se o usuário já existir
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (error: any) {
    console.error('Error creating checkout session:', error);
    
    // Retorna mensagens de erro mais específicas
    if (error.type === 'StripeInvalidRequestError') {
      return NextResponse.json(
        { error: error.message || 'Invalid request parameters' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Error creating checkout session' },
      { status: 500 }
    );
  }
} 