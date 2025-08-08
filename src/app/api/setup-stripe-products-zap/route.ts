import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

export async function POST() {
  try {
    // 1. Create the product for the basic plan
    const basicProduct = await stripe.products.create({
      name: 'Basic ZAP Plan',
      description: '1 instance + 1 agent with 100,000 included tokens',
      metadata: {
        type: 'basic',
        instances: '1',
        agents: '1',
        tokens: '100000',
      }
    });

    // 2. Create the monthly price for the basic plan ($11/month)
    const basicMonthlyPrice = await stripe.prices.create({
      product: basicProduct.id,
      unit_amount: 1100, // $11.00 in cents
      currency: 'usd',
      recurring: {
        interval: 'month',
      },
      metadata: {
        type: 'monthly',
        plan: 'basic',
      },
    });

    // 3. Create the product for additional instances/agents
    const additionalProduct = await stripe.products.create({
      name: 'Additional Instance + Agent',
      description: 'Add an instance and an agent to your plan',
      metadata: {
        type: 'addon',
        instances: '1',
        agents: '1',
      }
    });

    // 4. Create the price for additional instances/agents ($8 each)
    const additionalPrice = await stripe.prices.create({
      product: additionalProduct.id,
      unit_amount: 800, // $8.00 in cents
      currency: 'usd',
      recurring: {
        interval: 'month',
      },
      metadata: {
        type: 'addon',
      },
    });

    // 5. Create the product for additional tokens
    const extraTokensProduct = await stripe.products.create({
      name: 'Additional Tokens',
      description: 'Additional tokens for usage beyond the included limit',
      metadata: {
        type: 'tokens',
      }
    });

    // 6. Create the price for additional tokens ($0.20 per 1,000 tokens)
    const extraTokensPrice = await stripe.prices.create({
      product: extraTokensProduct.id,
      unit_amount: 20, // $0.20 in cents
      currency: 'usd',
      // One-time price, not recurring
      metadata: {
        type: 'usage',
        unit: '1000_tokens',
      },
    });

    // 7. Return the IDs for reference
    const priceIds = {
      basic_monthly: basicMonthlyPrice.id,
      additional_instance_agent: additionalPrice.id,
      extra_tokens_per_1000: extraTokensPrice.id,
    };

    return NextResponse.json({
      success: true,
      products: {
        basic: basicProduct.id,
        additional: additionalProduct.id,
        extraTokens: extraTokensProduct.id,
      },
      prices: priceIds,
      message: 'Products and prices created successfully. Copy these IDs for use in your application.',
    });
  } catch (error: any) {
    console.error('Error setting up Stripe products:', error);
    return NextResponse.json(
      { 
        error: 'Error setting up Stripe products', 
        details: error.message || 'Unknown error',
        type: error.type || 'Unknown type'
      },
      { status: 500 }
    );
  }
}
