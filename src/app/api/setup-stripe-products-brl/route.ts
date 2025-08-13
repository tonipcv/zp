import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

export async function GET() {
  try {
    // Buscar produto existente
    const products = await stripe.products.list({
      active: true,
      limit: 1,
    });

    const existingProduct = products.data.find(
      p => p.name === 'Protocolo FaceKorea'
    );

    let product;
    let annualPrice;
    let lifetimePrice;

    if (!existingProduct) {
      // Criar novo produto
      product = await stripe.products.create({
        name: 'Protocolo FaceKorea',
        description: 'Programa completo de exercícios faciais e skincare',
      });

      // Criar preços para o produto
      [annualPrice, lifetimePrice] = await Promise.all([
        stripe.prices.create({
          product: product.id,
          unit_amount: 1000, // R$10,00
          currency: 'brl',
          recurring: {
            interval: 'year',
            interval_count: 1
          },
          metadata: {
            type: 'annual'
          },
        }),
        stripe.prices.create({
          product: product.id,
          unit_amount: 20000, // R$200,00
          currency: 'brl',
          metadata: {
            type: 'lifetime'
          },
        }),
      ]);
    } else {
      product = existingProduct;
      const prices = await stripe.prices.list({
        product: product.id,
        active: true,
      });

      annualPrice = prices.data.find(p => p.metadata.type === 'annual');
      lifetimePrice = prices.data.find(p => p.metadata.type === 'lifetime');

      if (!annualPrice || !lifetimePrice) {
        const missingPrices = await Promise.all([
          !annualPrice && stripe.prices.create({
            product: product.id,
            unit_amount: 1000,
            currency: 'brl',
            recurring: {
              interval: 'year',
              interval_count: 1
            },
            metadata: {
              type: 'annual'
            },
          }),
          !lifetimePrice && stripe.prices.create({
            product: product.id,
            unit_amount: 20000,
            currency: 'brl',
            metadata: {
              type: 'lifetime'
            },
          }),
        ]);

        annualPrice = annualPrice || missingPrices[0];
        lifetimePrice = lifetimePrice || missingPrices[1];
      }
    }

    return NextResponse.json({
      success: true,
      prices: {
        annual: annualPrice,
        lifetime: lifetimePrice,
      }
    });
  } catch (error) {
    console.error('Error setting up Stripe products:', error);
    return NextResponse.json(
      { error: 'Error setting up Stripe products' },
      { status: 500 }
    );
  }
} 