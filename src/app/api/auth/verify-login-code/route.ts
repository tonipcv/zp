import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { email, code } = await request.json();

    if (!email || !code) {
      return NextResponse.json({ error: 'Email and verification code are required' }, { status: 400 });
    }

    // Find the verification code in the database
    const verificationRecord = await prisma.verificationCode.findFirst({
      where: {
        email,
        code,
        expiresAt: {
          gt: new Date(), // Code must not be expired
        },
      },
    });

    if (!verificationRecord) {
      return NextResponse.json({ error: 'Invalid or expired verification code' }, { status: 400 });
    }

    // Mark the code as verified
    await prisma.verificationCode.update({
      where: { id: verificationRecord.id },
      data: { verified: true },
    });

    // Return user email for the login process
    return NextResponse.json({ 
      success: true,
      email: email
    });
  } catch (error) {
    console.error('Error verifying login code:', error);
    return NextResponse.json({ error: 'Failed to verify code' }, { status: 500 });
  }
}
