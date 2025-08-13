import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// Verificar se o usuário é administrador via variável de ambiente
async function isAdmin(email: string | null | undefined): Promise<boolean> {
  if (!email) return false;
  const adminEmail = process.env.EMAIL_ADMIN || process.env.NEXT_PUBLIC_EMAIL_ADMIN;
  if (!adminEmail) return false;
  return email.toLowerCase() === adminEmail.toLowerCase();
}

// GET - Listar todos os modelos de IA
export async function GET(request: NextRequest) {
  try {
    // Verificar se o usuário está autenticado e é admin
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email || !await isAdmin(session.user.email)) {
      return NextResponse.json(
        { error: 'Não autorizado. Acesso restrito a administradores.' },
        { status: 403 }
      );
    }

    // Buscar todos os modelos de IA
    const aiModels = await prisma.aIModel.findMany({
      orderBy: {
        name: 'asc'
      }
    });

    return NextResponse.json({ models: aiModels });
  } catch (error) {
    console.error('Erro ao listar modelos de IA:', error);
    return NextResponse.json(
      { error: 'Erro ao processar solicitação' },
      { status: 500 }
    );
  }
}

// POST - Criar novo modelo de IA
export async function POST(request: NextRequest) {
  try {
    // Verificar se o usuário está autenticado e é admin
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email || !await isAdmin(session.user.email)) {
      return NextResponse.json(
        { error: 'Não autorizado. Acesso restrito a administradores.' },
        { status: 403 }
      );
    }

    // Obter dados do corpo da requisição
    const data = await request.json();
    
    // Validar dados
    if (!data.name || !data.apiIdentifier || data.creditCost === undefined) {
      return NextResponse.json(
        { error: 'Dados inválidos. Nome, identificador de API e custo de créditos são obrigatórios.' },
        { status: 400 }
      );
    }

    // Verificar se já existe um modelo com o mesmo nome ou identificador
    const existingModel = await prisma.aIModel.findFirst({
      where: {
        OR: [
          { name: data.name },
          { apiIdentifier: data.apiIdentifier }
        ]
      }
    });

    if (existingModel) {
      return NextResponse.json(
        { error: 'Já existe um modelo com este nome ou identificador.' },
        { status: 400 }
      );
    }

    // Criar novo modelo
    const newModel = await prisma.aIModel.create({
      data: {
        name: data.name,
        apiIdentifier: data.apiIdentifier,
        creditCost: data.creditCost,
        description: data.description || '',
        isActive: data.isActive !== undefined ? data.isActive : true,
        isDefault: data.isDefault !== undefined ? data.isDefault : false
      }
    });

    // Se este modelo for definido como padrão, desativar o padrão anterior
    if (data.isDefault) {
      await prisma.aIModel.updateMany({
        where: {
          id: {
            not: newModel.id
          },
          isDefault: true
        },
        data: {
          isDefault: false
        }
      });
    }

    return NextResponse.json(
      { message: 'Modelo criado com sucesso', model: newModel },
      { status: 201 }
    );
  } catch (error) {
    console.error('Erro ao criar modelo de IA:', error);
    return NextResponse.json(
      { error: 'Erro ao processar solicitação' },
      { status: 500 }
    );
  }
}
