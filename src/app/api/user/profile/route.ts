import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getUserSubscriptionTier, getUserResourceLimits, SubscriptionTier } from '@/lib/subscription-manager';

// Helper function for safe JSON responses
function safeJsonResponse(data: any, status = 200) {
  try {
    return NextResponse.json(data, { status });
  } catch (err) {
    console.error('Error creating JSON response:', err);
    // Fallback to a simple response
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function GET() {
  try {
    // Get user session
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return safeJsonResponse({ error: 'Unauthorized' }, 401);
    }

    console.log('Fetching profile for user:', session.user.email);

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        subscriptions: {
          include: {
            price: {
              include: {
                plan: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          },
          take: 1
        }
      }
    });

    if (!user) {
      console.log('User not found:', session.user.email);
      return safeJsonResponse({ error: 'User not found' }, 404);
    }
    
    console.log('User found:', user.id);
    
    try {
      // Get subscription tier and resource limits
      const tier = await getUserSubscriptionTier(user.id);
      console.log('User subscription tier:', tier);
      
      const limits = await getUserResourceLimits(user.id);
      console.log('User resource limits:', limits);
      
      // Get usage statistics
      const instances = await prisma.whatsAppInstance.count({
        where: { userId: user.id }
      });
      
      const agents = await prisma.aIAgentConfig.count({
        where: { userId: user.id }
      });
      
      console.log('Usage statistics - Instances:', instances, 'Agents:', agents);
      
      // Calculate token usage
      const tokensUsed = user.tokensUsed || 0;
      const tokensLimit = limits.tokens;

      // Get active subscription details
      const activeSubscription = user.subscriptions[0];
      let planName = 'Free';
      let planType = 'free';
      
      if (activeSubscription) {
        planName = activeSubscription.price.plan.name;
        planType = activeSubscription.price.plan.type;
        console.log('Active subscription found:', activeSubscription.id);
      } else if (tier === SubscriptionTier.UNLIMITED) {
        planName = 'Unlimited';
        planType = 'unlimited';
        console.log('User has unlimited tier');
      } else {
        console.log('User has free tier (no active subscription)');
      }

      // Prepare response payload
      const responsePayload = {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        plan: {
          name: planName,
          type: planType
        },
        tokensUsed: tokensUsed,
        tokensLimit: tokensLimit,
        instances: {
          count: instances,
          limit: limits.instances
        },
        agents: {
          count: agents,
          limit: limits.agents
        },
        subscription: activeSubscription ? {
          id: activeSubscription.id,
          status: activeSubscription.status,
          currentPeriodEnd: activeSubscription.currentPeriodEnd
        } : null
      };
      
      console.log('Sending profile response');
      return safeJsonResponse(responsePayload);
    } catch (innerError) {
      console.error('Error processing user data:', innerError);
      
      // Fallback to basic user info if subscription/limits processing fails
      return safeJsonResponse({
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        plan: {
          name: user.email === 'xppsalvador@gmail.com' ? 'Unlimited' : 'Free',
          type: user.email === 'xppsalvador@gmail.com' ? 'unlimited' : 'free'
        },
        tokensUsed: 0,
        tokensLimit: user.email === 'xppsalvador@gmail.com' ? 999999 : 10000,
        instances: {
          count: 0,
          limit: user.email === 'xppsalvador@gmail.com' ? 999 : 1
        },
        agents: {
          count: 0,
          limit: user.email === 'xppsalvador@gmail.com' ? 999 : 1
        },
        subscription: null
      });
    }
  } catch (error) {
    console.error('Profile fetch error:', error);
    return safeJsonResponse({ error: 'Failed to fetch profile' }, 500);
  }
}
