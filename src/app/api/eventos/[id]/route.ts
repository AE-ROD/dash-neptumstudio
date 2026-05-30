import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await req.json()
  const evento = await prisma.evento.update({
    where: { id },
    data: {
      ...(body.titulo      !== undefined && { titulo: body.titulo }),
      ...(body.fecha       !== undefined && { fecha: new Date(body.fecha) }),
      ...(body.hora        !== undefined && { hora: body.hora }),
      ...(body.tipo        !== undefined && { tipo: body.tipo }),
      ...(body.descripcion !== undefined && { descripcion: body.descripcion }),
    },
  })
  return NextResponse.json(evento)
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  await prisma.evento.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
