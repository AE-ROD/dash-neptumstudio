import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const eventos = await prisma.evento.findMany({
    orderBy: { fecha: 'asc' },
  })
  return NextResponse.json(eventos)
}

export async function POST(req: Request) {
  const body = await req.json()
  const { titulo, fecha, hora, tipo, clienteId, descripcion } = body
  if (!titulo || !fecha) return NextResponse.json({ error: 'Faltan campos' }, { status: 400 })
  const evento = await prisma.evento.create({
    data: { titulo, fecha: new Date(fecha), hora: hora ?? null, tipo, clienteId: clienteId ?? null, descripcion: descripcion ?? null },
  })
  return NextResponse.json(evento, { status: 201 })
}
