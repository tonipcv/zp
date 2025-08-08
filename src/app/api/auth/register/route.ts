import { NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { type Region } from '@/lib/prices';

export async function POST(req: Request) {
  try {
    const { name, email, password, region, verificationCode } = await req.json();

    // Validate required fields
    if (!name || !email || !password || !region || !verificationCode) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if email is already in use
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already in use' },
        { status: 409 }
      );
    }

    // Verify the verification code
    const verificationRecord = await prisma.verificationCode.findFirst({
      where: {
        email,
        code: verificationCode,
        verified: true,
        expiresAt: {
          gt: new Date(), // Code must not be expired
        },
      },
    });

    if (!verificationRecord) {
      return NextResponse.json(
        { error: 'Invalid or expired verification code' },
        { status: 400 }
      );
    }

    // Hash the password
    const hashedPassword = await hash(password, 10);

    try {
      // Create user with verified email
      const user = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          region: region as Region,
          emailVerified: new Date(), // Email is already verified through the code
        },
      });

      // Delete the verification code record
      await prisma.verificationCode.delete({
        where: { id: verificationRecord.id },
      });

      return NextResponse.json({
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          region: user.region,
        },
      });
    } catch (dbError) {
      console.error('Database error:', dbError);
      return NextResponse.json(
        { error: 'Error creating user' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Error creating user' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}