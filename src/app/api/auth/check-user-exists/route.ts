import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email is required' }, { status: 400 });
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (!existingUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Don't return user details for security, just confirm existence
    return NextResponse.json({ exists: true });
  } catch (error) {
    console.error('Error checking user:', error);
    return NextResponse.json({ error: 'Failed to check user' }, { status: 500 });
  }
}
