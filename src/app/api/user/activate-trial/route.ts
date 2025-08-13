import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { addDays } from 'date-fns';

// POST /api/user/activate-trial - Activate trial with 200 initial credits
export async function POST(req: NextRequest) {
  try {
    console.log('Activate Trial - Starting process');
    const session = await getServerSession(authOptions);
    
    console.log('Activate Trial - Session:', JSON.stringify(session?.user || 'No session'));
    
    if (!session?.user?.id) {
      console.log('Activate Trial - No user ID in session');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    console.log('Activate Trial - Looking up user with ID:', session.user.id);
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { 
        id: true, 
        trialActivated: true
      }
    });
    
    console.log('Activate Trial - User found:', JSON.stringify(user || 'No user'));
    
    if (!user) {
      console.log('Activate Trial - User not found in database');
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    // Check if user has already activated the trial
    if (user.trialActivated) {
      console.log('Activate Trial - Trial already activated');
      return NextResponse.json({ 
        error: 'Trial already activated',
        trialActivated: true
      }, { status: 400 });
    }
    
    // Set trial period (3 days)
    const trialStartDate = new Date();
    const trialEndDate = addDays(trialStartDate, 3);
    
    // Update user with 200 initial credits and activate trial
    console.log('Activate Trial - Activating trial with 200 credits');
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        credits: 200,
        maxCredits: 200,
        trialActivated: true,
        trialStartDate: trialStartDate,
        trialEndDate: trialEndDate,
        plan: 'trial'
      }
    });
    
    console.log('Activate Trial - User updated successfully');
    
    return NextResponse.json({
      success: true,
      message: 'Trial activated with 200 initial credits',
      trialActivated: true
    });
  } catch (error) {
    console.error('Error activating trial:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// GET /api/user/activate-trial - Check trial status
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { 
        id: true, 
        trialActivated: true, 
        trialStartDate: true, 
        trialEndDate: true
      }
    });
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    return NextResponse.json({
      trialActivated: user.trialActivated,
      trialStartDate: user.trialStartDate,
      trialEndDate: user.trialEndDate
    });
  } catch (error) {
    console.error('Error checking trial status:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
