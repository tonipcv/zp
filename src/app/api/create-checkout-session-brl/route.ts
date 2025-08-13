import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

export async function POST(request: Request) {
  try {
    const { priceId, successUrl, cancelUrl } = await request.json();

    if (!priceId) {
      return NextResponse.json(
        { error: 'Price ID is required' },
        { status: 400 }
      );
    }

    // Verificar se o preço existe no Stripe
    try {
      const price = await stripe.prices.retrieve(priceId);
      if (!price) {
        return NextResponse.json(
          { error: 'Invalid price ID' },
          { status: 400 }
        );
      }
    } catch (priceError) {
      console.error('Error retrieving price:', priceError);
      return NextResponse.json(
        { error: 'Invalid price ID' },
        { status: 400 }
      );
    }

    // Criar sessão de checkout
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: successUrl || `${process.env.NEXTAUTH_URL}/success`,
      cancel_url: cancelUrl || `${process.env.NEXTAUTH_URL}/planos`,
      allow_promotion_codes: true,
      billing_address_collection: 'required',
      payment_method_collection: 'always',
      locale: 'pt-BR',
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    
    // Retornar mensagem de erro mais detalhada
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json(
      { error: `Error creating checkout session: ${errorMessage}` },
      { status: 500 }
    );
  }
} 