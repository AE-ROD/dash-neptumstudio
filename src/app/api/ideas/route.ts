import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const ideas = await prisma.idea.findMany({
      orderBy: { creadoEn: 'desc' },
      take: 12,
    })
    return NextResponse.json(ideas)
  } catch (error) {
    console.error('[api/ideas] GET error:', error)
    return NextResponse.json({ error: 'Error al cargar ideas' }, { status: 500 })
  }
}
