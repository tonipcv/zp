import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// Verificar se o usuário é administrador via variável de ambiente
async function isAdmin(email: string | null | undefined) {
  if (!email) return false;
  const adminEmail = process.env.EMAIL_ADMIN || process.env.NEXT_PUBLIC_EMAIL_ADMIN;
  if (!adminEmail) return false;
  return email.toLowerCase() === adminEmail.toLowerCase();
}

// GET: Listar todos os modelos de IA
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    // Determinar se o usuário atual é admin
    const isAdminUser = session?.user?.email ? await isAdmin(session.user.email) : false;

    // Filtrar campos diferentes dependendo se é admin ou não
    const models = await prisma.aIModel.findMany({
      where: {
        // Se não for admin, mostrar apenas modelos habilitados
        ...(!isAdminUser ? { enabled: true } : {})
      },
      select: {
        id: true,
        name: true,
        provider: true,
        modelId: true,
        description: true,
        creditCost: true,
        enabled: true
      },
      orderBy: {
        creditCost: 'asc'
      }
    });
    
    return NextResponse.json({ models });
  } catch (error) {
    console.error(
      'Error fetching AI models:',
      error instanceof Error ? error.message : String(error ?? 'Unknown error')
    );
    return NextResponse.json(
      { error: 'Erro ao buscar modelos de IA' },
      { status: 500 }
    );
  }
}

// POST: Criar um novo modelo de IA (apenas admin)
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email || !(await isAdmin(session.user.email))) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const { name, provider, modelId, description, creditCost, enabled = true } = await req.json();
    
    // Validações básicas
    if (!name || !provider || !modelId || creditCost === undefined) {
      return NextResponse.json(
        { error: 'Dados incompletos' },
        { status: 400 }
      );
    }
    
    // Verificar se já existe um modelo com o mesmo nome
    const existingModel = await prisma.aIModel.findUnique({
      where: { name }
    });
    
    if (existingModel) {
      return NextResponse.json(
        { error: 'Já existe um modelo com este nome' },
        { status: 409 }
      );
    }
    
    // Criar o novo modelo
    const newModel = await prisma.aIModel.create({
      data: {
        name,
        provider,
        modelId,
        description,
        creditCost,
        enabled
      }
    });
    
    return NextResponse.json({ model: newModel }, { status: 201 });
  } catch (error) {
    console.error(
      'Error creating AI model:',
      error instanceof Error ? error.message : String(error ?? 'Unknown error')
    );
    return NextResponse.json(
      { error: 'Erro ao criar modelo de IA' },
      { status: 500 }
    );
  }
}

// PATCH: Atualizar um modelo de IA existente (apenas admin)
export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email || !(await isAdmin(session.user.email))) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const { id, name, provider, modelId, description, creditCost, enabled } = await req.json();
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID do modelo é obrigatório' },
        { status: 400 }
      );
    }
    
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
    
    // Atualizar o modelo
    const updatedModel = await prisma.aIModel.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(provider !== undefined && { provider }),
        ...(modelId !== undefined && { modelId }),
        ...(description !== undefined && { description }),
        ...(creditCost !== undefined && { creditCost }),
        ...(enabled !== undefined && { enabled })
      }
    });
    
    return NextResponse.json({ model: updatedModel });
  } catch (error) {
    console.error(
      'Error updating AI model:',
      error instanceof Error ? error.message : String(error ?? 'Unknown error')
    );
    return NextResponse.json(
      { error: 'Erro ao atualizar modelo de IA' },
      { status: 500 }
    );
  }
}

// DELETE: Remover um modelo de IA (apenas admin)
export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email || !(await isAdmin(session.user.email))) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID do modelo é obrigatório' },
        { status: 400 }
      );
    }
    
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
    
    // Verificar se o modelo está sendo usado
    const usageCount = await prisma.aIModelUsage.count({
      where: { modelId: id }
    });
    
    if (usageCount > 0) {
      // Em vez de excluir, apenas desabilitar o modelo
      await prisma.aIModel.update({
        where: { id },
        data: { enabled: false }
      });
      
      return NextResponse.json({
        message: 'Modelo desabilitado pois já possui histórico de uso',
        disabled: true
      });
    }
    
    // Excluir o modelo se não tiver histórico de uso
    await prisma.aIModel.delete({
      where: { id }
    });
    
    return NextResponse.json({
      message: 'Modelo removido com sucesso',
      deleted: true
    });
  } catch (error) {
    console.error(
      'Error deleting AI model:',
      error instanceof Error ? error.message : String(error ?? 'Unknown error')
    );
    return NextResponse.json(
      { error: 'Erro ao remover modelo de IA' },
      { status: 500 }
    );
  }
}
