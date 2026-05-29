// TODO: Agregar autenticación NextAuth antes de producción
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const propuestas = await prisma.proposal.findMany({
      where: { estado: { not: 'CERRADO' } },
      orderBy: { actualizadoEn: 'desc' },
      include: { cliente: true },
    })
    return NextResponse.json(propuestas)
  } catch (error) {
    console.error('[api/proposals GET]', error)
    return NextResponse.json({ error: 'Error al obtener propuestas' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { nombreCliente, clienteId, descripcion, monto, estado, ultimoContacto, notas, proyectoId } = body
    const propuesta = await prisma.proposal.create({
      data: { nombreCliente, clienteId, descripcion, monto, estado, ultimoContacto, notas, proyectoId },
    })
    return NextResponse.json(propuesta, { status: 201 })
  } catch (error) {
    console.error('[api/proposals POST]', error)
    return NextResponse.json({ error: 'Error al crear propuesta' }, { status: 500 })
  }
}
