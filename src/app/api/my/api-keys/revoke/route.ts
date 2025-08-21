import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

function requireUserId(req: NextRequest): string {
  const uid = req.headers.get('x-user-id')?.trim()
  if (!uid) throw Object.assign(new Error('Unauthorized: missing x-user-id'), { status: 401 })
  return uid
}

export async function POST(req: NextRequest) {
  try {
    const userId = requireUserId(req)
    const body = await req.json().catch(() => null)
    const id = body?.id as string | undefined
    if (!id) return NextResponse.json({ success: false, error: 'id obrigatório' }, { status: 400 })

    // Verifica propriedade da chave
    const rows: any[] = await prisma.$queryRaw`
      SELECT id FROM api_keys WHERE id = ${id} AND user_id = ${userId} AND status = 'active'
    `
    if (rows.length === 0) return NextResponse.json({ success: false, error: 'Chave não encontrada' }, { status: 404 })

    await prisma.$executeRaw`UPDATE api_keys SET status = 'revoked', updated_at = now() WHERE id = ${id}`
    return NextResponse.json({ success: true })
  } catch (e: any) {
    const status = e?.status || 500
    return NextResponse.json({ success: false, error: e?.message || 'Erro' }, { status })
  }
}
