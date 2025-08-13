import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// Lista de emails de administradores
const ADMIN_EMAILS = ['admin@example.com', 'admin@zap.com'];

// Verificar se o usuário é administrador
async function isAdmin(email: string | null | undefined): Promise<boolean> {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email);
}

// GET - Obter um modelo de IA específico
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verificar se o usuário está autenticado e é admin
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email || !await isAdmin(session.user.email)) {
      return NextResponse.json(
        { error: 'Não autorizado. Acesso restrito a administradores.' },
        { status: 403 }
      );
    }

    const id = params.id;

    // Buscar o modelo pelo ID
    const aiModel = await prisma.aIModel.findUnique({
      where: { id }
    });

    if (!aiModel) {
      return NextResponse.json(
        { error: 'Modelo não encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({ model: aiModel });
  } catch (error) {
    console.error('Erro ao buscar modelo de IA:', error);
    return NextResponse.json(
      { error: 'Erro ao processar solicitação' },
      { status: 500 }
    );
  }
}

// PUT - Atualizar um modelo de IA
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verificar se o usuário está autenticado e é admin
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email || !await isAdmin(session.user.email)) {
      return NextResponse.json(
        { error: 'Não autorizado. Acesso restrito a administradores.' },
        { status: 403 }
      );
    }

    const id = params.id;
    const data = await request.json();

    // Verificar se o modelo existe
    const existingModel = await prisma.aIModel.findUnique({
      where: { id }
    });

    if (!existingModel) {
      return NextResponse.json(
        { error: 'Modelo não encontrado' },
        { status: 404 }
      );
    }

    // Verificar se já existe outro modelo com o mesmo nome ou identificador
    if (data.name || data.apiIdentifier) {
      const duplicateModel = await prisma.aIModel.findFirst({
        where: {
          id: { not: id },
          OR: [
            data.name ? { name: data.name } : {},
            data.apiIdentifier ? { apiIdentifier: data.apiIdentifier } : {}
          ]
        }
      });

      if (duplicateModel) {
        return NextResponse.json(
          { error: 'Já existe outro modelo com este nome ou identificador.' },
          { status: 400 }
        );
      }
    }

    // Atualizar o modelo
    const updatedModel = await prisma.aIModel.update({
      where: { id },
      data: {
        name: data.name !== undefined ? data.name : undefined,
        apiIdentifier: data.apiIdentifier !== undefined ? data.apiIdentifier : undefined,
        creditCost: data.creditCost !== undefined ? data.creditCost : undefined,
        description: data.description !== undefined ? data.description : undefined,
        isActive: data.isActive !== undefined ? data.isActive : undefined,
        isDefault: data.isDefault !== undefined ? data.isDefault : undefined
      }
    });

    // Se este modelo for definido como padrão, desativar o padrão anterior
    if (data.isDefault) {
      await prisma.aIModel.updateMany({
        where: {
          id: { not: id },
          isDefault: true
        },
        data: {
          isDefault: false
        }
      });
    }

    return NextResponse.json({
      message: 'Modelo atualizado com sucesso',
      model: updatedModel
    });
  } catch (error) {
    console.error('Erro ao atualizar modelo de IA:', error);
    return NextResponse.json(
      { error: 'Erro ao processar solicitação' },
      { status: 500 }
    );
  }
}

// DELETE - Excluir um modelo de IA
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verificar se o usuário está autenticado e é admin
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email || !await isAdmin(session.user.email)) {
      return NextResponse.json(
        { error: 'Não autorizado. Acesso restrito a administradores.' },
        { status: 403 }
      );
    }

    const id = params.id;

    // Verificar se o modelo existe
    const existingModel = await prisma.aIModel.findUnique({
      where: { id }
    });

    if (!existingModel) {
      return NextResponse.json(
        { error: 'Modelo não encontrado' },
        { status: 404 }
      );
    }

    // Verificar se é o modelo padrão
    if (existingModel.isDefault) {
      return NextResponse.json(
        { error: 'Não é possível excluir o modelo padrão. Defina outro modelo como padrão primeiro.' },
        { status: 400 }
      );
    }

    // Excluir o modelo
    await prisma.aIModel.delete({
      where: { id }
    });

    return NextResponse.json({
      message: 'Modelo excluído com sucesso'
    });
  } catch (error) {
    console.error('Erro ao excluir modelo de IA:', error);
    return NextResponse.json(
      { error: 'Erro ao processar solicitação' },
      { status: 500 }
    );
  }
}
