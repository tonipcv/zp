import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getUserSubscriptionTier, getUserResourceLimits, SubscriptionTier } from '@/lib/subscription-manager';

// Helper function for safe JSON responses
function safeJsonResponse(data: any, status = 200) {
  try {
    // Garantir que data nunca seja nulo
    if (data === null || data === undefined) {
      console.error('Attempt to create JSON response with null data');
      data = { error: 'Internal server error - null data' };
      status = 500;
    }
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
      
      // Use the new plan field if available, otherwise fallback to subscription data
      let planName = 'Free';
      let planType = 'free';
      
      // Check if user has the new plan field
      if (user.plan) {
        // Convert plan value to display name and type
        switch(user.plan) {
          case 'premium':
            planName = 'Premium';
            planType = 'premium';
            break;
          case 'trial':
            planName = 'Trial';
            planType = 'trial';
            break;
          case 'enterprise':
            planName = 'Enterprise';
            planType = 'enterprise';
            break;
          case 'unlimited':
            planName = 'Unlimited';
            planType = 'unlimited';
            break;
          default:
            planName = 'Free';
            planType = 'free';
        }
        console.log('Using plan from user model:', user.plan);
      } else if (activeSubscription) {
        // Fallback to subscription data if plan field is not available
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
        credits: user.credits || 0,
        maxCredits: user.maxCredits || 0,
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
        } : null,
        trialActivated: user.trialActivated || false,
        trialStartDate: user.trialStartDate || null,
        trialEndDate: user.trialEndDate || null
      };
      
      console.log('Sending profile response');
      // Garantir que responsePayload não é nulo antes de enviar
      if (responsePayload) {
        return safeJsonResponse(responsePayload);
      } else {
        console.error('Response payload is null, using fallback');
        throw new Error('Response payload is null');
      }
    } catch (innerError) {
      const innerMsg = innerError instanceof Error ? innerError.message : JSON.stringify(innerError ?? {});
      console.log('Error processing user data:', innerMsg);
      
      // Fallback to basic user info if subscription/limits processing fails
      // Usar o campo plan do usuário se disponível, caso contrário usar fallback
      let userPlanName = 'Free';
      let userPlanType = 'free';
      let userCredits = user.credits || 0;
      let userMaxCredits = user.maxCredits || 0;
      
      if (user.plan) {
        // Converter valor do plano para nome e tipo
        switch(user.plan) {
          case 'premium':
            userPlanName = 'Premium';
            userPlanType = 'premium';
            break;
          case 'trial':
            userPlanName = 'Trial';
            userPlanType = 'trial';
            break;
          case 'enterprise':
            userPlanName = 'Enterprise';
            userPlanType = 'enterprise';
            break;
          case 'unlimited':
            userPlanName = 'Unlimited';
            userPlanType = 'unlimited';
            break;
          default:
            userPlanName = 'Free';
            userPlanType = 'free';
        }
        console.log('Fallback using plan from user model:', user.plan);
      } else if (user.email === 'xppsalvador@gmail.com') {
        userPlanName = 'Unlimited';
        userPlanType = 'unlimited';
      }
      
      // Construir objeto de resposta de fallback com dados do usuário
      const fallbackResponse = {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        plan: {
          name: userPlanName,
          type: userPlanType
        },
        credits: userCredits,
        maxCredits: userMaxCredits,
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
        subscription: null,
        trialActivated: user.trialActivated || false,
        trialStartDate: user.trialStartDate || null,
        trialEndDate: user.trialEndDate || null
      };
      
      console.log('Using fallback response:', fallbackResponse);
      return safeJsonResponse(fallbackResponse);
    }
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : JSON.stringify(error ?? {});
    console.log('Profile fetch error:', errMsg);
    return safeJsonResponse({ error: 'Failed to fetch profile' }, 500);
  }
}
