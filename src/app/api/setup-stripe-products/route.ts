import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

export async function POST() {
  try {
    // 1. Criar o produto
    const product = await stripe.products.create({
      name: 'Protocolo Face Korean',
      description: 'Programa completo de exercícios faciais e skincare',
    });

    // 2. Criar o preço mensal (R$97/mês)
    const monthlyPrice = await stripe.prices.create({
      product: product.id,
      unit_amount: 9700, // R$97.00 em centavos
      currency: 'brl',
      recurring: {
        interval: 'month',
      },
      metadata: {
        type: 'monthly',
      },
    });

    // 3. Criar o preço anual (R$497/ano)
    const yearlyPrice = await stripe.prices.create({
      product: product.id,
      unit_amount: 49700, // R$497.00 em centavos
      currency: 'brl',
      recurring: {
        interval: 'year',
      },
      metadata: {
        type: 'yearly',
      },
    });

    // 4. Atualizar o arquivo de configuração com os IDs
    const priceIds = {
      price_monthly: monthlyPrice.id,
      price_yearly: yearlyPrice.id,
    };

    return NextResponse.json({
      success: true,
      product: product.id,
      prices: priceIds,
      message: 'Copie esses IDs e atualize o arquivo route.ts',
    });
  } catch (error) {
    console.error('Error setting up Stripe products:', error);
    return NextResponse.json(
      { error: 'Error setting up Stripe products' },
      { status: 500 }
    );
  }
} 