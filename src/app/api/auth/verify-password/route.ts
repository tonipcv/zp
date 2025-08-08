import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { compare } from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    // Find the user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !user.password) {
      // Por segurança, não informamos se o usuário não existe ou não tem senha
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Verificar a senha
    const isCorrectPassword = await compare(password, user.password);

    if (!isCorrectPassword) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Senha correta, retornar sucesso (sem dados sensíveis)
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error verifying password:', error);
    return NextResponse.json({ error: 'Failed to verify password' }, { status: 500 });
  }
}
