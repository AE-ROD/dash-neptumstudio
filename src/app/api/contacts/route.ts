import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const contactos = await prisma.client.findMany({
      orderBy: { nombre: 'asc' },
      include: { _count: { select: { propuestas: true, cotizaciones: true } } },
    })
    return NextResponse.json(contactos)
  } catch (error) {
    console.error('[api/contacts GET]', error)
    return NextResponse.json({ error: 'Error al obtener contactos' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const { nombre, marca, tipo, email, telefono, ciudad } = await req.json()
    if (!nombre?.trim()) {
      return NextResponse.json({ error: 'nombre es requerido' }, { status: 400 })
    }
    const contacto = await prisma.client.create({
      data: { nombre: nombre.trim(), marca: marca?.trim() || null, tipo, email: email?.trim() || null, telefono: telefono?.trim() || null, ciudad: ciudad?.trim() || null },
    })
    return NextResponse.json(contacto, { status: 201 })
  } catch (error) {
    console.error('[api/contacts POST]', error)
    return NextResponse.json({ error: 'Error al crear contacto' }, { status: 500 })
  }
}
