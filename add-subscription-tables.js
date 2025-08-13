// Script to add subscription tables using Prisma's executeRaw
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function addSubscriptionTables() {
  try {
    console.log('Starting to add subscription tables...');

    // Check if Plan table exists
    const planTableExists = await prisma.$queryRaw`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public'
        AND table_name = 'Plan'
      );
    `;
    
    if (!planTableExists[0].exists) {
      console.log('Creating Plan table...');
      await prisma.$executeRaw`
        CREATE TABLE "Plan" (
          "id" TEXT NOT NULL,
          "name" TEXT NOT NULL,
          "description" TEXT NOT NULL,
          "type" TEXT NOT NULL,
          "features" TEXT NOT NULL,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP(3) NOT NULL,
          
          CONSTRAINT "Plan_pkey" PRIMARY KEY ("id")
        );
      `;
      console.log('Plan table created successfully.');
    } else {
      console.log('Plan table already exists, skipping creation.');
    }

    // Check if Price table exists
    const priceTableExists = await prisma.$queryRaw`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public'
        AND table_name = 'Price'
      );
    `;
    
    if (!priceTableExists[0].exists) {
      console.log('Creating Price table...');
      await prisma.$executeRaw`
        CREATE TABLE "Price" (
          "id" TEXT NOT NULL,
          "planId" TEXT NOT NULL,
          "amount" INTEGER NOT NULL,
          "currency" TEXT NOT NULL,
          "language" TEXT NOT NULL,
          "interval" TEXT NOT NULL,
          "stripeId" TEXT NOT NULL,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP(3) NOT NULL,
          
          CONSTRAINT "Price_pkey" PRIMARY KEY ("id"),
          CONSTRAINT "Price_stripeId_key" UNIQUE ("stripeId"),
          CONSTRAINT "Price_planId_fkey" FOREIGN KEY ("planId") REFERENCES "Plan"("id") ON DELETE RESTRICT ON UPDATE CASCADE
        );
      `;
      console.log('Price table created successfully.');
    } else {
      console.log('Price table already exists, skipping creation.');
    }

    // Check if Subscription table exists
    const subscriptionTableExists = await prisma.$queryRaw`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public'
        AND table_name = 'Subscription'
      );
    `;
    
    if (!subscriptionTableExists[0].exists) {
      console.log('Creating Subscription table...');
      await prisma.$executeRaw`
        CREATE TABLE "Subscription" (
          "id" TEXT NOT NULL,
          "userId" TEXT NOT NULL,
          "priceId" TEXT NOT NULL,
          "status" TEXT NOT NULL,
          "stripeId" TEXT NOT NULL,
          "currentPeriodStart" TIMESTAMP(3) NOT NULL,
          "currentPeriodEnd" TIMESTAMP(3) NOT NULL,
          "cancelAtPeriodEnd" BOOLEAN NOT NULL DEFAULT false,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP(3) NOT NULL,
          
          CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id"),
          CONSTRAINT "Subscription_stripeId_key" UNIQUE ("stripeId"),
          CONSTRAINT "Subscription_priceId_fkey" FOREIGN KEY ("priceId") REFERENCES "Price"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
          CONSTRAINT "Subscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE
        );
      `;
      console.log('Subscription table created successfully.');
    } else {
      console.log('Subscription table already exists, skipping creation.');
    }

    // Add subscriptions relation to User model if it doesn't exist
    console.log('Checking User model for subscriptions relation...');
    try {
      // This will throw an error if the column doesn't exist
      await prisma.$queryRaw`SELECT "subscriptions" FROM "User" LIMIT 1`;
      console.log('User model already has subscriptions relation, skipping.');
    } catch (error) {
      // If the column doesn't exist, we need to add the relation
      console.log('Adding subscriptions relation to User model...');
      
      // We don't actually need to add a column, as the relation is defined by the foreign key in the Subscription table
      console.log('Relation will be handled by Prisma ORM, no column needed.');
    }

    // Create special plans for free and unlimited tiers
    console.log('Creating special plans...');
    
    // Check if free plan exists
    const freePlanExists = await prisma.plan.findFirst({
      where: { type: 'free' }
    });
    
    if (!freePlanExists) {
      console.log('Creating free plan...');
      const freePlan = await prisma.plan.create({
        data: {
          id: 'free-plan',
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
          id: 'free-plan-price',
          planId: freePlan.id,
          amount: 0,
          currency: 'usd',
          language: 'en',
          interval: 'month',
          stripeId: 'free_plan_price'
        }
      });
      console.log('Free plan created successfully.');
    } else {
      console.log('Free plan already exists, skipping creation.');
    }
    
    // Check if unlimited plan exists
    const unlimitedPlanExists = await prisma.plan.findFirst({
      where: { type: 'unlimited' }
    });
    
    if (!unlimitedPlanExists) {
      console.log('Creating unlimited plan...');
      const unlimitedPlan = await prisma.plan.create({
        data: {
          id: 'unlimited-plan',
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
          id: 'unlimited-plan-price',
          planId: unlimitedPlan.id,
          amount: 0,
          currency: 'usd',
          language: 'en',
          interval: 'month',
          stripeId: 'unlimited_plan_price'
        }
      });
      console.log('Unlimited plan created successfully.');
    } else {
      console.log('Unlimited plan already exists, skipping creation.');
    }

    // Set up unlimited access for special user
    console.log('Setting up unlimited access for special user...');
    const specialUser = await prisma.user.findUnique({
      where: { email: 'xppsalvador@gmail.com' }
    });
    
    if (specialUser) {
      await prisma.user.update({
        where: { id: specialUser.id },
        data: {
          isPremium: true,
          isSuperPremium: true,
          freeTokensLimit: 2147483647 // Max safe integer value
        }
      });
      console.log('Special user updated with unlimited access.');
    } else {
      console.log('Special user not found, skipping unlimited access setup.');
    }

    console.log('All subscription tables added successfully!');
  } catch (error) {
    console.error('Error adding subscription tables:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the function
addSubscriptionTables()
  .then(() => console.log('Script completed.'))
  .catch(e => console.error('Script failed:', e));
