import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const ahora = new Date()
    const mes  = ahora.getMonth() + 1
    const anio = ahora.getFullYear()
    const registros = await prisma.revenue.findMany({
      where: { mes, anio },
      orderBy: { creadoEn: 'desc' },
    })
    const ingresos = registros.filter(r => r.tipo === 'INGRESO').reduce((s, r) => s + r.monto, 0)
    const egresos  = registros.filter(r => r.tipo === 'EGRESO').reduce((s, r) => s + r.monto, 0)
    const balance  = ingresos - egresos
    return NextResponse.json({ ingresos, egresos, balance, mes, anio, registros })
  } catch (error) {
    console.error('[api/revenue] GET error:', error)
    return NextResponse.json({ error: 'Error al obtener balance' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { monto, tipo = 'INGRESO', descripcion } = body
    if (!monto) return NextResponse.json({ error: 'Falta monto' }, { status: 400 })
    const ahora = new Date()
    const registro = await prisma.revenue.create({
      data: {
        monto: parseFloat(monto),
        tipo,
        descripcion: descripcion ?? null,
        mes: ahora.getMonth() + 1,
        anio: ahora.getFullYear(),
      },
    })
    return NextResponse.json(registro, { status: 201 })
  } catch (error) {
    console.error('[api/revenue] POST error:', error)
    return NextResponse.json({ error: 'Error al registrar' }, { status: 500 })
  }
}
