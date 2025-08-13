import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

// Cache para armazenar os IDs dos preços
let cachedPrices: { price_monthly: string; price_yearly: string } | null = null;
const CACHE_DURATION = 1000 * 60 * 60; // 1 hora
let lastCacheUpdate = 0;

export async function GET() {
  try {
    console.log('API: Starting price fetch...');
    // Verificar se temos um cache válido
    const now = Date.now();
    if (cachedPrices && (now - lastCacheUpdate) < CACHE_DURATION) {
      console.log('API: Returning cached prices:', cachedPrices);
      return NextResponse.json({
        success: true,
        prices: cachedPrices,
        fromCache: true
      });
    }

    console.log('API: Cache miss, fetching from Stripe...');
    // Se não tiver cache ou estiver expirado, buscar do Stripe
    const products = await stripe.products.list({
      active: true,
      limit: 1,
      expand: ['data.default_price']
    });

    const existingProduct = products.data.find(
      p => p.name === 'Protocolo Face Korean'
    );

    let product;
    let monthlyPrice;
    let yearlyPrice;

    if (!existingProduct) {
      product = await stripe.products.create({
        name: 'Protocolo Face Korean',
        description: 'Programa completo de exercícios faciais e skincare',
      });

      [monthlyPrice, yearlyPrice] = await Promise.all([
        stripe.prices.create({
          product: product.id,
          unit_amount: 9700,
          currency: 'brl',
          recurring: { interval: 'month' },
          metadata: { type: 'monthly' },
        }),
        stripe.prices.create({
          product: product.id,
          unit_amount: 49700,
          currency: 'brl',
          recurring: { interval: 'year' },
          metadata: { type: 'yearly' },
        }),
      ]);
    } else {
      product = existingProduct;
      const prices = await stripe.prices.list({
        product: product.id,
        active: true,
        limit: 2
      });

      monthlyPrice = prices.data.find(p => p.recurring?.interval === 'month');
      yearlyPrice = prices.data.find(p => p.recurring?.interval === 'year');

      if (!monthlyPrice || !yearlyPrice) {
        const missingPrices = await Promise.all([
          !monthlyPrice ? stripe.prices.create({
            product: product.id,
            unit_amount: 9700,
            currency: 'brl',
            recurring: { interval: 'month' },
            metadata: { type: 'monthly' },
          }) : null,
          !yearlyPrice ? stripe.prices.create({
            product: product.id,
            unit_amount: 49700,
            currency: 'brl',
            recurring: { interval: 'year' },
            metadata: { type: 'yearly' },
          }) : null,
        ]);

        if (!monthlyPrice && missingPrices[0]) monthlyPrice = missingPrices[0];
        if (!yearlyPrice && missingPrices[1]) yearlyPrice = missingPrices[1];
      }
    }

    // Atualizar o cache
    if (!monthlyPrice || !yearlyPrice) {
      console.log('API: Failed to get prices');
      throw new Error('Failed to create or retrieve prices');
    }

    cachedPrices = {
      price_monthly: monthlyPrice.id,
      price_yearly: yearlyPrice.id,
    };
    lastCacheUpdate = now;

    console.log('API: Returning fresh prices:', cachedPrices);
    return NextResponse.json({
      success: true,
      prices: cachedPrices,
      fromCache: false
    });
  } catch (error) {
    console.error('Error getting or creating Stripe products:', error);
    // Se houver erro mas tivermos cache, retornar o cache
    if (cachedPrices) {
      return NextResponse.json({
        success: true,
        prices: cachedPrices,
        fromCache: true,
        hadError: true
      });
    }
    return NextResponse.json(
      { error: 'Error getting or creating Stripe products' },
      { status: 500 }
    );
  }
} 