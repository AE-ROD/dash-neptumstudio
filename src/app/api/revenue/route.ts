import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const ahora = new Date()
    const registros = await prisma.revenue.findMany({
      where: { mes: ahora.getMonth() + 1, anio: ahora.getFullYear() },
    })
    const total = registros.reduce((suma, r) => suma + r.monto, 0)
    return NextResponse.json({ total, mes: ahora.getMonth() + 1, anio: ahora.getFullYear() })
  } catch (error) {
    console.error('[api/revenue] GET error:', error)
    return NextResponse.json({ error: 'Error al obtener ingresos' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const ingreso = await prisma.revenue.create({ data: body })
    return NextResponse.json(ingreso, { status: 201 })
  } catch (error) {
    console.error('[api/revenue] POST error:', error)
    return NextResponse.json({ error: 'Error al registrar ingreso' }, { status: 500 })
  }
}
