// TODO: Agregar autenticación NextAuth antes de producción
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const snapshot = await prisma.instagramSnapshot.findFirst({
      orderBy: { registradoEn: 'desc' },
    })
    if (!snapshot) {
      return NextResponse.json({ error: 'No hay snapshots disponibles' }, { status: 404 })
    }
    return NextResponse.json(snapshot)
  } catch (error) {
    console.error('[api/instagram GET]', error)
    return NextResponse.json({ error: 'Error al obtener snapshot' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { seguidores, publicaciones, alcancePromedio, crecimientoSemanal } = body
    const snapshot = await prisma.instagramSnapshot.create({
      data: { seguidores, publicaciones, alcancePromedio, crecimientoSemanal },
    })
    return NextResponse.json(snapshot, { status: 201 })
  } catch (error) {
    console.error('[api/instagram POST]', error)
    return NextResponse.json({ error: 'Error al guardar snapshot de Instagram' }, { status: 500 })
  }
}
