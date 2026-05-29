import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const pendientes = await prisma.pending.findMany({
      where: { estaSemana: true },
      orderBy: [{ completado: 'asc' }, { creadoEn: 'desc' }],
    })
    return NextResponse.json(pendientes)
  } catch (error) {
    console.error('[api/pending] GET error:', error)
    return NextResponse.json({ error: 'Error al obtener pendientes' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const { texto } = await req.json()
    const pendiente = await prisma.pending.create({
      data: { texto, estaSemana: true },
    })
    return NextResponse.json(pendiente, { status: 201 })
  } catch (error) {
    console.error('[api/pending] POST error:', error)
    return NextResponse.json({ error: 'Error al crear pendiente' }, { status: 500 })
  }
}
