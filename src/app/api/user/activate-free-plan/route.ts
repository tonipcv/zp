import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { addDays } from 'date-fns';

// POST /api/user/activate-free-plan - Activate free plan with 200 initial credits
export async function POST(req: NextRequest) {
  try {
    console.log('Activate Free Plan - Starting process');
    const session = await getServerSession(authOptions);
    
    console.log('Activate Free Plan - Session:', JSON.stringify(session?.user || 'No session'));
    
    if (!session?.user?.id) {
      console.log('Activate Free Plan - No user ID in session');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    console.log('Activate Free Plan - Looking up user with ID:', session.user.id);
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, credits: true, maxCredits: true, trialActivated: true, trialStartDate: true, trialEndDate: true }
    });
    
    console.log('Activate Free Plan - User found:', JSON.stringify(user || 'No user'));
    
    if (!user) {
      console.log('Activate Free Plan - User not found in database');
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    // Check if user has already activated the free trial
    console.log('Activate Free Plan - Checking if free trial already activated:', 
      `trialActivated=${user.trialActivated}, credits=${user.credits}, maxCredits=${user.maxCredits}`);
    
    // Only check trialActivated flag, not credits or maxCredits
    if (user.trialActivated) {
      console.log('Activate Free Plan - Free trial already activated');
      return NextResponse.json({ 
        error: 'Free plan already activated',
        credits: user.credits || 0,
        maxCredits: user.maxCredits || 0
      }, { status: 400 });
    }
    
    console.log('Activate Free Plan - User eligible for free plan activation');
    
    // Set trial period (14 days)
    const trialStartDate = new Date();
    const trialEndDate = addDays(trialStartDate, 14);
    
    // Update user with 200 initial credits and activate trial
    console.log('Activate Free Plan - Activating trial with 200 credits');
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        credits: 200,
        maxCredits: 200,
        trialActivated: true,
        trialStartDate: trialStartDate,
        trialEndDate: trialEndDate
      }
    });
    
    console.log('Activate Free Plan - User updated successfully');
    
    // No need to query again, we already have the updated user data
    console.log('Activate Free Plan - Final user credits:', JSON.stringify({
      credits: updatedUser.credits,
      maxCredits: updatedUser.maxCredits
    }));
    
    return NextResponse.json({
      success: true,
      message: 'Free trial activated with 200 initial credits',
      credits: updatedUser.credits || 200,
      maxCredits: updatedUser.maxCredits || 200,
      trialActivated: true,
      trialStartDate: trialStartDate,
      trialEndDate: trialEndDate
    });
  } catch (error) {
    console.error('Error activating free plan:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
