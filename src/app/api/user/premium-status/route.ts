import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { isAfter } from 'date-fns';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ 
        isPremium: false,
        trialActivated: false,
        trialActive: false
      }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { 
        trialActivated: true,
        trialStartDate: true,
        trialEndDate: true
      }
    });

    if (!user) {
      return NextResponse.json({ 
        isPremium: false,
        trialActivated: false,
        trialActive: false
      }, { status: 404 });
    }

    // Check if trial is active (activated and not expired)
    const now = new Date();
    const trialActive = user.trialActivated && 
                        user.trialEndDate && 
                        !isAfter(now, user.trialEndDate);

    // For backward compatibility, we'll consider a user with an active trial as "premium"
    const isPremium = trialActive;

    return NextResponse.json({ 
      isPremium: isPremium,
      trialActivated: user.trialActivated || false,
      trialActive: trialActive
    });
  } catch (error) {
    console.error('Error fetching premium status:', error);
    return NextResponse.json({ 
      isPremium: false,
      trialActivated: false,
      trialActive: false
    }, { status: 500 });
  }
} 