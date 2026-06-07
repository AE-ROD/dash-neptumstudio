import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Prisma } from '@/app/generated/client'

type Params = { params: Promise<{ id: string }> }

export async function PATCH(req: Request, { params }: Params) {
  try {
    const { id } = await params
    const { estado } = await req.json()
    const idea = await prisma.idea.update({
      where: { id },
      data: { estado },
    })
    return NextResponse.json(idea)
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return NextResponse.json({ error: 'No encontrado' }, { status: 404 })
    }
    console.error('[api/ideas/[id] PATCH]', error)
    return NextResponse.json({ error: 'Error al actualizar idea' }, { status: 500 })
  }
}

export async function DELETE(_req: Request, { params }: Params) {
  try {
    const { id } = await params
    await prisma.idea.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return NextResponse.json({ error: 'No encontrado' }, { status: 404 })
    }
    console.error('[api/ideas/[id] DELETE]', error)
    return NextResponse.json({ error: 'Error al eliminar idea' }, { status: 500 })
  }
}
