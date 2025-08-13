import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

function isEnvAdmin(email?: string | null): boolean {
  if (!email) return false;
  const adminEmail = process.env.EMAIL_ADMIN || process.env.NEXT_PUBLIC_EMAIL_ADMIN;
  return !!adminEmail && email.toLowerCase() === adminEmail.toLowerCase();
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!isEnvAdmin(session?.user?.email)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        plan: true,
        credits: true,
        maxCredits: true,
        trialActivated: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ users });
  } catch (err) {
    console.error('GET /api/admin/users error', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!isEnvAdmin(session?.user?.email)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { id, plan, credits, maxCredits } = body as {
      id?: string;
      plan?: string;
      credits?: number;
      maxCredits?: number;
    };

    if (!id) {
      return NextResponse.json({ error: 'Missing user id' }, { status: 400 });
    }

    const updated = await prisma.user.update({
      where: { id },
      data: {
        ...(plan !== undefined ? { plan } : {}),
        ...(credits !== undefined ? { credits } : {}),
        ...(maxCredits !== undefined ? { maxCredits } : {}),
        planUpdatedAt: new Date(),
      },
      select: { id: true, name: true, email: true, plan: true, credits: true, maxCredits: true, updatedAt: true },
    });

    return NextResponse.json({ user: updated });
  } catch (err) {
    console.error('PATCH /api/admin/users error', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
