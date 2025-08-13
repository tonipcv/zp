import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

// GET /api/user/credits - Get current user's credits
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        credits: true,
        maxCredits: true,
        trialActivated: true,
        trialStartDate: true,
        trialEndDate: true
      }
    });
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    // Check if trial is active (activated and not expired)
    const now = new Date();
    const trialActive = user.trialActivated && 
                        user.trialEndDate && 
                        new Date(user.trialEndDate) > now;

    // For backward compatibility
    const isPremium = trialActive;
    
    return NextResponse.json({
      credits: user.credits,
      maxCredits: user.maxCredits,
      isPremium: isPremium,
      trialActivated: user.trialActivated,
      trialActive: trialActive,
      trialStartDate: user.trialStartDate,
      trialEndDate: user.trialEndDate
    });
  } catch (error) {
    // Safe error logging that won't cause TypeError with null payload
    console.error('Error fetching credits:', error instanceof Error ? error.message : 'Unknown error');
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/user/credits/use - Use credits
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { amount = 1 } = await req.json();
    
    // Validate amount
    if (typeof amount !== 'number' || amount <= 0) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
    }
    
    // Get user and check credits
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        credits: true,
        maxCredits: true,
        trialActivated: true,
        trialStartDate: true,
        trialEndDate: true
      }
    });
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    // Check if user has enough credits
    if (user.credits < amount) {
      return NextResponse.json({ 
        error: 'Insufficient credits',
        credits: user.credits,
        maxCredits: user.maxCredits,
        required: amount
      }, { status: 402 }); // 402 Payment Required
    }
    
    // Deduct credits
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { credits: { decrement: amount } },
      select: {
        credits: true,
        maxCredits: true
      }
    });
    
    return NextResponse.json({
      success: true,
      credits: updatedUser.credits,
      maxCredits: updatedUser.maxCredits,
      used: amount
    });
  } catch (error) {
    console.error('Error using credits:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/user/credits/refill - Refill credits (admin only)
export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { userId, amount, setMax = false } = await req.json();
    
    // Check admin via environment variable
    const adminEmail = process.env.EMAIL_ADMIN || process.env.NEXT_PUBLIC_EMAIL_ADMIN;
    if (!adminEmail || session.user.email.toLowerCase() !== adminEmail.toLowerCase()) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    
    // Validate amount
    if (typeof amount !== 'number' || amount < 0) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
    }
    
    // Get target user
    const targetUser = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        credits: true,
        maxCredits: true
      }
    });
    
    if (!targetUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    // Update user credits
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        credits: setMax ? amount : { increment: amount },
        ...(setMax && { maxCredits: amount })
      },
      select: {
        credits: true,
        maxCredits: true
      }
    });
    
    return NextResponse.json({
      success: true,
      credits: updatedUser.credits,
      maxCredits: updatedUser.maxCredits,
      added: amount
    });
  } catch (error) {
    console.error('Error refilling credits:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
