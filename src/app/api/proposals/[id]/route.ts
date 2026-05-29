import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await req.json()
    const propuesta = await prisma.proposal.update({
      where: { id },
      data: body,
    })
    return NextResponse.json(propuesta)
  } catch (error) {
    console.error('[api/proposals/[id]] PATCH error:', error)
    return NextResponse.json({ error: 'Error al actualizar propuesta' }, { status: 500 })
  }
}
