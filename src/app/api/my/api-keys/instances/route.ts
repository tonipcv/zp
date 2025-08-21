import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({ where: { email: session.user.email }, select: { id: true } })
    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 })
    }

    const rows: any[] = await prisma.$queryRaw`
      SELECT id, "instanceName", status, "connectedNumber",
             "lastConnectedAt", "createdAt"
      FROM whatsapp_instances
      WHERE "userId" = ${user.id}
      ORDER BY "createdAt" DESC
    `

    return NextResponse.json({ success: true, items: rows })
  } catch (e: any) {
    const status = e?.status || 500
    return NextResponse.json({ success: false, error: e?.message || 'Erro' }, { status })
  }
}
