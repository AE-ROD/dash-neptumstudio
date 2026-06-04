import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Prisma } from '@/app/generated/client'

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await req.json()
    const contacto = await prisma.client.update({
      where: { id },
      data: {
        nombre:   body.nombre?.trim()   || undefined,
        marca:    body.marca?.trim()    ?? null,
        tipo:     body.tipo             || undefined,
        email:    body.email?.trim()    ?? null,
        telefono: body.telefono?.trim() ?? null,
        ciudad:   body.ciudad?.trim()   ?? null,
      },
    })
    return NextResponse.json(contacto)
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return NextResponse.json({ error: 'No encontrado' }, { status: 404 })
    }
    return NextResponse.json({ error: 'Error al actualizar contacto' }, { status: 500 })
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await prisma.client.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return NextResponse.json({ error: 'No encontrado' }, { status: 404 })
    }
    return NextResponse.json({ error: 'Error al eliminar contacto' }, { status: 500 })
  }
}
