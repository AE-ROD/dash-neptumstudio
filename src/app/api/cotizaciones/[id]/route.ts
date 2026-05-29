import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Prisma } from '@/app/generated/prisma/client'

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const cotizacion = await prisma.cotizacion.findUnique({ where: { id }, include: { cliente: true } })
    if (!cotizacion) return NextResponse.json({ error: 'No encontrado' }, { status: 404 })
    return NextResponse.json(cotizacion)
  } catch (error) {
    return NextResponse.json({ error: 'Error' }, { status: 500 })
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await req.json()
    const itemsArr = Array.isArray(body.items) ? body.items : undefined
    const total = itemsArr
      ? itemsArr.reduce((sum: number, item: { cantidad?: number; precioUnit?: number }) =>
          sum + (Number(item.cantidad ?? 1) * Number(item.precioUnit ?? 0)), 0)
      : undefined

    const cotizacion = await prisma.cotizacion.update({
      where: { id },
      data: {
        nombreCliente: body.nombreCliente?.trim() || undefined,
        clienteId:     body.clienteId ?? undefined,
        estado:        body.estado    || undefined,
        items:         itemsArr,
        total,
        notas:         body.notas?.trim() ?? null,
      },
      include: { cliente: true },
    })
    return NextResponse.json(cotizacion)
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return NextResponse.json({ error: 'No encontrado' }, { status: 404 })
    }
    return NextResponse.json({ error: 'Error al actualizar cotización' }, { status: 500 })
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await prisma.cotizacion.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return NextResponse.json({ error: 'No encontrado' }, { status: 404 })
    }
    return NextResponse.json({ error: 'Error al eliminar cotización' }, { status: 500 })
  }
}
