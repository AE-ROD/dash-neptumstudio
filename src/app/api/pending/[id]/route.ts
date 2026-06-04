// TODO: Agregar autenticación NextAuth antes de producción
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Prisma } from '@/app/generated/client'

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { completado } = await req.json()
    if (typeof completado !== 'boolean') {
      return NextResponse.json({ error: 'completado debe ser un booleano' }, { status: 400 })
    }
    const pendiente = await prisma.pending.update({
      where: { id },
      data: { completado },
    })
    return NextResponse.json(pendiente)
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return NextResponse.json({ error: 'No encontrado' }, { status: 404 })
    }
    console.error('[api/pending PATCH]', error)
    return NextResponse.json({ error: 'Error al actualizar pendiente' }, { status: 500 })
  }
}
