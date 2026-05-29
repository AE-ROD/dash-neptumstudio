import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { completado } = await req.json()
    const pendiente = await prisma.pending.update({
      where: { id },
      data: { completado },
    })
    return NextResponse.json(pendiente)
  } catch (error) {
    console.error('[api/pending/[id]] PATCH error:', error)
    return NextResponse.json({ error: 'Error al actualizar pendiente' }, { status: 500 })
  }
}
