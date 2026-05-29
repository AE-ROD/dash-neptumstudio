import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await req.json()
    const proyecto = await prisma.project.update({
      where: { id },
      data: body,
    })
    return NextResponse.json(proyecto)
  } catch (error) {
    console.error('[api/projects/[id]] PATCH error:', error)
    return NextResponse.json({ error: 'Error al actualizar proyecto' }, { status: 500 })
  }
}
