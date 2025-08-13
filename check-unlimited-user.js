// Script to check and update unlimited access for special user
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Special user with unlimited access
const UNLIMITED_ACCESS_EMAIL = 'xppsalvador@gmail.com';

async function checkAndUpdateUnlimitedUser() {
  console.log(`Checking unlimited access for user: ${UNLIMITED_ACCESS_EMAIL}`);
  
  try {
    // Find the user
    const user = await prisma.user.findUnique({
      where: { email: UNLIMITED_ACCESS_EMAIL },
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
      console.log(`User with email ${UNLIMITED_ACCESS_EMAIL} not found`);
      return;
    }

    console.log(`User found: ${user.id}, ${user.name}`);

    // Check if unlimited plan exists
    const unlimitedPlan = await prisma.plan.findFirst({
      where: { type: 'unlimited' }
    });

    if (!unlimitedPlan) {
      console.log('Creating unlimited plan...');
      const newPlan = await prisma.plan.create({
        data: {
          name: 'Unlimited',
          type: 'unlimited',
          description: 'Unlimited access to all features',
          features: 'Unlimited instances, agents, and tokens'
        }
      });
      console.log(`Created unlimited plan: ${newPlan.id}`);
    } else {
      console.log(`Unlimited plan exists: ${unlimitedPlan.id}`);
    }

    // Get or create unlimited plan
    const plan = unlimitedPlan || await prisma.plan.findFirst({
      where: { type: 'unlimited' }
    });

    // Check if price exists for unlimited plan
    let price = await prisma.price.findFirst({
      where: { planId: plan.id }
    });

    if (!price) {
      console.log('Creating price for unlimited plan...');
      price = await prisma.price.create({
        data: {
          planId: plan.id,
          amount: 0,
          currency: 'USD',
          interval: 'month',
          active: true
        }
      });
      console.log(`Created price: ${price.id}`);
    } else {
      console.log(`Price exists: ${price.id}`);
    }

    // Check if user has unlimited subscription
    const hasUnlimitedSubscription = user.subscriptions.some(
      sub => sub.price.plan.type === 'unlimited'
    );

    if (!hasUnlimitedSubscription) {
      console.log('Creating unlimited subscription for user...');
      const subscription = await prisma.subscription.create({
        data: {
          userId: user.id,
          priceId: price.id,
          status: 'active',
          stripeId: 'unlimited_special_user', // Correct field name from schema
          currentPeriodStart: new Date(),
          currentPeriodEnd: new Date(new Date().setFullYear(new Date().getFullYear() + 10)), // 10 years from now
          cancelAtPeriodEnd: false
        }
      });
      console.log(`Created unlimited subscription: ${subscription.id}`);
    } else {
      console.log('User already has unlimited subscription');
    }

    // Final check
    const updatedUser = await prisma.user.findUnique({
      where: { email: UNLIMITED_ACCESS_EMAIL },
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

    console.log('Current subscription status:');
    if (updatedUser.subscriptions.length > 0) {
      const sub = updatedUser.subscriptions[0];
      console.log(`- Subscription ID: ${sub.id}`);
      console.log(`- Plan: ${sub.price.plan.name} (${sub.price.plan.type})`);
      console.log(`- Status: ${sub.status}`);
      console.log(`- Current period end: ${sub.currentPeriodEnd}`);
    } else {
      console.log('No active subscription found');
    }

    console.log('Done!');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the function
checkAndUpdateUnlimitedUser();
