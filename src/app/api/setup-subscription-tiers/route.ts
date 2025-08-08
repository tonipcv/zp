import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { setupFreeTier, setupUnlimitedAccess } from '@/lib/subscription-manager';

export async function POST() {
  try {
    // 1. Create the free plan tier
    await setupFreeTier('placeholder_user_id'); // This just ensures the free plan exists
    
    // 2. Set up unlimited access for the special user
    await setupUnlimitedAccess('xppsalvador@gmail.com');
    
    // 3. Ensure premium plan exists (should already be created by Stripe setup)
    const premiumPlan = await prisma.plan.findFirst({
      where: {
        type: 'basic'
      }
    });
    
    if (!premiumPlan) {
      // Create premium plan if it doesn't exist
      await prisma.plan.create({
        data: {
          name: 'Premium Plan',
          description: 'Standard subscription with basic resources',
          type: 'basic',
          features: JSON.stringify([
            '1 WhatsApp instance',
            '1 AI agent',
            '100,000 tokens per month',
            'Additional resources available for purchase'
          ])
        }
      });
    }
    
    return NextResponse.json({
      success: true,
      message: 'Subscription tiers set up successfully',
    });
  } catch (error: any) {
    console.error('Error setting up subscription tiers:', error);
    return NextResponse.json(
      { 
        error: 'Error setting up subscription tiers', 
        details: error.message || 'Unknown error'
      },
      { status: 500 }
    );
  }
}
