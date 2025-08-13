import { prisma } from '@/lib/prisma';
import { ZAP_PLAN_LIMITS } from './stripe-zap-prices';

// Special user with unlimited access
const UNLIMITED_ACCESS_EMAIL = 'xppsalvador@gmail.com';

// Subscription tiers
export enum SubscriptionTier {
  FREE = 'FREE',
  PREMIUM = 'PREMIUM',
  UNLIMITED = 'UNLIMITED'
}

// Resource limits by tier
export const TIER_LIMITS = {
  [SubscriptionTier.FREE]: {
    instances: 1,
    agents: 1,
    tokens: 10000,
  },
  [SubscriptionTier.PREMIUM]: ZAP_PLAN_LIMITS.BASIC, // Use the same limits as the basic plan
  [SubscriptionTier.UNLIMITED]: {
    instances: Number.MAX_SAFE_INTEGER,
    agents: Number.MAX_SAFE_INTEGER,
    tokens: Number.MAX_SAFE_INTEGER,
  }
};

/**
 * Get the subscription tier for a user
 */
export async function getUserSubscriptionTier(userId: string): Promise<SubscriptionTier> {
  // Check if user has unlimited access
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { 
      email: true, 
      trialActivated: true, 
      trialEndDate: true 
    }
  });

  if (!user) {
    throw new Error('User not found');
  }

  // Special user with unlimited access
  if (user.email === UNLIMITED_ACCESS_EMAIL) {
    return SubscriptionTier.UNLIMITED;
  }

  // Check if user has an active subscription
  const activeSubscription = await prisma.subscription.findFirst({
    where: {
      userId,
      status: 'active',
      currentPeriodEnd: {
        gte: new Date()
      }
    }
  });

  // Check if user has active trial
  const now = new Date();
  const hasActiveTrial = user.trialActivated && 
                        user.trialEndDate && 
                        new Date(user.trialEndDate) > now;

  if (activeSubscription || hasActiveTrial) {
    return SubscriptionTier.PREMIUM;
  }

  // Default to free tier
  return SubscriptionTier.FREE;
}

/**
 * Get the resource limits for a user based on their subscription tier
 */
export async function getUserResourceLimits(userId: string) {
  const tier = await getUserSubscriptionTier(userId);
  
  // Get base limits from tier
  const baseLimits = TIER_LIMITS[tier];
  
  // If premium, check for additional resources
  if (tier === SubscriptionTier.PREMIUM) {
    // Count additional resources from subscriptions
    const additionalResources = await prisma.subscription.count({
      where: {
        userId,
        status: 'active',
        currentPeriodEnd: {
          gte: new Date()
        },
        price: {
          plan: {
            type: 'addon'
          }
        }
      }
    });
    
    return {
      ...baseLimits,
      instances: baseLimits.instances + additionalResources,
      agents: baseLimits.agents + additionalResources,
    };
  }
  
  return baseLimits;
}

/**
 * Check if a user has reached their resource limits
 */
export async function checkUserResourceLimits(userId: string) {
  const limits = await getUserResourceLimits(userId);
  
  // Count current instances
  const instanceCount = await prisma.whatsAppInstance.count({
    where: { userId }
  });
  
  // Count current agents
  const agentCount = await prisma.aIAgentConfig.count({
    where: { userId }
  });
  
  // Get token usage
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { tokensUsedThisMonth: true }
  });
  
  if (!user) {
    throw new Error('User not found');
  }
  
  return {
    instances: {
      used: instanceCount,
      limit: limits.instances,
      remaining: limits.instances - instanceCount,
      exceeded: instanceCount >= limits.instances
    },
    agents: {
      used: agentCount,
      limit: limits.agents,
      remaining: limits.agents - agentCount,
      exceeded: agentCount >= limits.agents
    },
    tokens: {
      used: user.tokensUsedThisMonth,
      limit: limits.tokens,
      remaining: limits.tokens - user.tokensUsedThisMonth,
      exceeded: user.tokensUsedThisMonth >= limits.tokens
    }
  };
}

/**
 * Create or update a subscription for a user
 */
export async function createOrUpdateSubscription(
  userId: string, 
  priceId: string, 
  stripeSubscriptionId: string,
  status: string,
  currentPeriodStart: Date,
  currentPeriodEnd: Date
) {
  // Check if subscription already exists
  const existingSubscription = await prisma.subscription.findFirst({
    where: {
      stripeId: stripeSubscriptionId
    }
  });
  
  if (existingSubscription) {
    // Update existing subscription
    return prisma.subscription.update({
      where: {
        id: existingSubscription.id
      },
      data: {
        status,
        currentPeriodStart,
        currentPeriodEnd,
        updatedAt: new Date()
      }
    });
  } else {
    // Create new subscription
    return prisma.subscription.create({
      data: {
        userId,
        priceId,
        stripeId: stripeSubscriptionId,
        status,
        currentPeriodStart,
        currentPeriodEnd
      }
    });
  }
}

/**
 * Set up a free tier for a user
 */
export async function setupFreeTier(userId: string) {
  // Find or create the free plan
  let freePlan = await prisma.plan.findFirst({
    where: {
      type: 'free'
    }
  });
  
  if (!freePlan) {
    freePlan = await prisma.plan.create({
      data: {
        name: 'Free Plan',
        description: 'Basic access with limited resources',
        type: 'free',
        features: JSON.stringify([
          '1 WhatsApp instance',
          '1 AI agent',
          '10,000 tokens per month'
        ])
      }
    });
    
    // Create a price for the free plan
    await prisma.price.create({
      data: {
        planId: freePlan.id,
        amount: 0,
        currency: 'usd',
        language: 'en',
        interval: 'month',
        stripeId: 'free_plan_price'
      }
    });
  }
  
  // No need to create a subscription for free tier
  // Just make sure the user is not marked as having an active trial
  await prisma.user.update({
    where: {
      id: userId
    },
    data: {
      trialActivated: false,
      trialStartDate: null,
      trialEndDate: null
    }
  });
}

/**
 * Set up unlimited access for a specific user
 */
export async function setupUnlimitedAccess(email: string = UNLIMITED_ACCESS_EMAIL) {
  const user = await prisma.user.findUnique({
    where: { email }
  });
  
  if (!user) {
    throw new Error(`User with email ${email} not found`);
  }
  
  // Update user to have unlimited access
  const now = new Date();
  const farFuture = new Date();
  farFuture.setFullYear(farFuture.getFullYear() + 10); // Set trial end date 10 years in the future
  
  await prisma.user.update({
    where: {
      id: user.id
    },
    data: {
      trialActivated: true,
      trialStartDate: now,
      trialEndDate: farFuture,
      freeTokensLimit: Number.MAX_SAFE_INTEGER
    }
  });
  
  // Find or create the unlimited plan
  let unlimitedPlan = await prisma.plan.findFirst({
    where: {
      type: 'unlimited'
    }
  });
  
  if (!unlimitedPlan) {
    unlimitedPlan = await prisma.plan.create({
      data: {
        name: 'Unlimited Plan',
        description: 'Unlimited access to all resources',
        type: 'unlimited',
        features: JSON.stringify([
          'Unlimited WhatsApp instances',
          'Unlimited AI agents',
          'Unlimited tokens'
        ])
      }
    });
    
    // Create a price for the unlimited plan
    await prisma.price.create({
      data: {
        planId: unlimitedPlan.id,
        amount: 0, // Free for special users
        currency: 'usd',
        language: 'en',
        interval: 'month',
        stripeId: 'unlimited_plan_price'
      }
    });
  }
}
