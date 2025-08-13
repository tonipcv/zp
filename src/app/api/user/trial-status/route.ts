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
        trialActivated: false,
        trialActive: false,
        trialExpired: false,
        trialStartDate: null,
        trialEndDate: null
      }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { 
        trialActivated: true,
        trialStartDate: true,
        trialEndDate: true,
        credits: true
      }
    });

    if (!user) {
      return NextResponse.json({ 
        trialActivated: false,
        trialActive: false,
        trialExpired: false,
        trialStartDate: null,
        trialEndDate: null
      }, { status: 404 });
    }

    // Check if trial is active (activated and not expired)
    const now = new Date();
    const trialActive = user.trialActivated && 
                        user.trialEndDate && 
                        !isAfter(now, user.trialEndDate);
    
    // Check if trial has expired
    const trialExpired = user.trialActivated && 
                         user.trialEndDate && 
                         isAfter(now, user.trialEndDate);

    return NextResponse.json({
      trialActivated: user.trialActivated || false,
      trialActive: trialActive,
      trialExpired: trialExpired,
      trialStartDate: user.trialStartDate,
      trialEndDate: user.trialEndDate,
      credits: user.credits
    });
  } catch (error) {
    console.error('Error fetching trial status:', error);
    return NextResponse.json({ 
      trialActivated: false,
      trialActive: false,
      trialExpired: false,
      trialStartDate: null,
      trialEndDate: null,
      error: 'Internal server error'
    }, { status: 500 });
  }
}
