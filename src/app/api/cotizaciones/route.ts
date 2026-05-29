import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const cotizaciones = await prisma.cotizacion.findMany({
      orderBy: { creadoEn: 'desc' },
      include: { cliente: true },
    })
    return NextResponse.json(cotizaciones)
  } catch (error) {
    console.error('[api/cotizaciones GET]', error)
    return NextResponse.json({ error: 'Error al obtener cotizaciones' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const { nombreCliente, clienteId, items, notas, estado } = await req.json()
    if (!nombreCliente?.trim()) {
      return NextResponse.json({ error: 'nombreCliente es requerido' }, { status: 400 })
    }
    const itemsArr = Array.isArray(items) ? items : []
    const total = itemsArr.reduce((sum: number, item: { cantidad?: number; precioUnit?: number }) => {
      return sum + (Number(item.cantidad ?? 1) * Number(item.precioUnit ?? 0))
    }, 0)

    const cotizacion = await prisma.cotizacion.create({
      data: {
        nombreCliente: nombreCliente.trim(),
        clienteId:     clienteId || null,
        items:         itemsArr,
        total,
        estado:        estado ?? 'BORRADOR',
        notas:         notas?.trim() || null,
      },
      include: { cliente: true },
    })
    return NextResponse.json(cotizacion, { status: 201 })
  } catch (error) {
    console.error('[api/cotizaciones POST]', error)
    return NextResponse.json({ error: 'Error al crear cotización' }, { status: 500 })
  }
}
