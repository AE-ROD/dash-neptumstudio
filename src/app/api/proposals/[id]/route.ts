// TODO: Agregar autenticación NextAuth antes de producción
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const propuesta = await prisma.proposal.findUnique({ where: { id }, include: { cliente: true } })
    if (!propuesta) return NextResponse.json({ error: 'No encontrado' }, { status: 404 })
    return NextResponse.json(propuesta)
  } catch (error) {
    console.error('[api/proposals GET id]', error)
    return NextResponse.json({ error: 'Error al obtener propuesta' }, { status: 500 })
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await req.json()
    const { estado, notas, descripcion, monto, ultimoContacto, proyectoId, clienteId } = body
    const propuesta = await prisma.proposal.update({
      where: { id },
      data: { estado, notas, descripcion, monto, ultimoContacto, proyectoId, clienteId },
    })
    return NextResponse.json(propuesta)
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return NextResponse.json({ error: 'No encontrado' }, { status: 404 })
    }
    console.error('[api/proposals PATCH]', error)
    return NextResponse.json({ error: 'Error al actualizar propuesta' }, { status: 500 })
  }
}
