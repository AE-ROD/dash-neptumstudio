import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const eventos = await prisma.evento.findMany({ orderBy: { fecha: 'asc' } })
    return NextResponse.json(eventos)
  } catch (error) {
    console.error('[api/eventos] GET error:', error)
    return NextResponse.json({ error: 'Error al cargar eventos' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { titulo, fecha, hora, tipo, clienteId, descripcion } = body
    if (!titulo || !fecha) return NextResponse.json({ error: 'Faltan campos' }, { status: 400 })
    const evento = await prisma.evento.create({
      data: { titulo, fecha: new Date(fecha), hora: hora ?? null, tipo, clienteId: clienteId ?? null, descripcion: descripcion ?? null },
    })
    return NextResponse.json(evento, { status: 201 })
  } catch (error) {
    console.error('[api/eventos] POST error:', error)
    return NextResponse.json({ error: 'Error al crear evento' }, { status: 500 })
  }
}
