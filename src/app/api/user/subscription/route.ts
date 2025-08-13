import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getUserSubscriptionTier, checkUserResourceLimits } from '@/lib/subscription-manager';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const userId = session.user.id;
    
    // Get user's subscription tier
    const tier = await getUserSubscriptionTier(userId);
    
    // Get user's resource limits and usage
    const resources = await checkUserResourceLimits(userId);
    
    // Get subscription expiry date if applicable
    const subscription = await prisma.subscription.findFirst({
      where: {
        userId,
        status: 'active',
        currentPeriodEnd: {
          gte: new Date()
        }
      },
      orderBy: {
        currentPeriodEnd: 'desc'
      }
    });
    
    return NextResponse.json({
      success: true,
      tier,
      resources,
      expiresAt: subscription?.currentPeriodEnd || null
    });
  } catch (error: any) {
    console.error('Error fetching subscription status:', error);
    return NextResponse.json(
      { 
        error: 'Error fetching subscription status', 
        details: error.message || 'Unknown error'
      },
      { status: 500 }
    );
  }
}
