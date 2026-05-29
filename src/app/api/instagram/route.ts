import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const snapshot = await prisma.instagramSnapshot.findFirst({
      orderBy: { registradoEn: 'desc' },
    })
    return NextResponse.json(snapshot)
  } catch (error) {
    console.error('[api/instagram] GET error:', error)
    return NextResponse.json({ error: 'Error al obtener snapshot de Instagram' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const snapshot = await prisma.instagramSnapshot.create({ data: body })
    return NextResponse.json(snapshot, { status: 201 })
  } catch (error) {
    console.error('[api/instagram] POST error:', error)
    return NextResponse.json({ error: 'Error al guardar snapshot de Instagram' }, { status: 500 })
  }
}
